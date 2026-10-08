import type { SupabaseClient } from "@supabase/supabase-js";
import { generatePublicCode, slugFromName } from "@/lib/auth/passwords";
import { createInvitation, writeAudit } from "@/lib/platform/operations";
import { cancelPendingInviteMail } from "@/lib/email/deliver";
import { sendTransactionalEmail } from "@/lib/email";
import { siteUrl } from "@/lib/env";

type Admin = SupabaseClient;

export type StartChapterInput = {
  schoolName: string;
  city: string;
  state: string;
  advisorFirstName: string;
  advisorLastName: string;
  advisorEmail: string;
  advisorPhone?: string;
  advisorTitle?: string;
  principalName?: string;
  estimatedStudents?: number;
  statement?: string;
  password: string;
};

export type ReactivateChapterInput = StartChapterInput & {
  chapterCode?: string;
};

export type AddStudentInput = {
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
  chapterId?: string;
};

async function waitForProfile(admin: Admin, userId: string) {
  for (let attempt = 0; attempt < 8; attempt += 1) {
    const { data } = await admin.from("profiles").select("id").eq("id", userId).maybeSingle();
    if (data?.id) return true;
    await new Promise((resolve) => setTimeout(resolve, 150));
  }
  return false;
}

async function uniqueChapterCodes(admin: Admin, schoolName: string) {
  for (let attempt = 0; attempt < 6; attempt += 1) {
    const chapterCode = generatePublicCode("ML");
    const joinCode = generatePublicCode("JN");
    const slug = `${slugFromName(schoolName)}-${chapterCode.slice(-6).toLowerCase()}`;
    const { data } = await admin
      .from("chapters")
      .select("id")
      .or(`chapter_code.eq.${chapterCode},join_code.eq.${joinCode},slug.eq.${slug}`)
      .maybeSingle();
    if (!data) return { chapterCode, joinCode, slug };
  }
  return {
    chapterCode: generatePublicCode("ML"),
    joinCode: generatePublicCode("JN"),
    slug: `${slugFromName(schoolName)}-${Date.now().toString(36)}`,
  };
}

async function ensureProfile(
  admin: Admin,
  userId: string,
  values: {
    email: string;
    firstName: string;
    lastName: string;
    role: "CHAPTER_ADVISOR" | "STUDENT";
    chapterId: string | null;
    grade?: string;
    status?: "PENDING" | "ACTIVE";
    advisorStatus?: "PENDING" | "ACTIVE" | null;
  },
) {
  const fullName = `${values.firstName} ${values.lastName}`.trim();
  const status = values.status ?? "ACTIVE";
  const advisorStatus =
    values.advisorStatus !== undefined
      ? values.advisorStatus
      : values.role === "CHAPTER_ADVISOR"
        ? "ACTIVE"
        : null;
  const exists = await waitForProfile(admin, userId);
  if (!exists) {
    const { error: insertError } = await admin.from("profiles").insert({
      id: userId,
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      full_name: fullName,
      display_name: fullName,
      role: values.role,
      chapter_id: values.chapterId,
      grade: values.grade || "",
      status,
      advisor_status: advisorStatus,
    });
    if (insertError) return insertError.message;
    return null;
  }

  const { error } = await admin
    .from("profiles")
    .update({
      email: values.email,
      first_name: values.firstName,
      last_name: values.lastName,
      full_name: fullName,
      display_name: fullName,
      role: values.role,
      chapter_id: values.chapterId,
      grade: values.grade || "",
      status,
      advisor_status: advisorStatus,
    })
    .eq("id", userId);
  return error?.message ?? null;
}

async function notifyAdmins(
  admin: Admin,
  type: string,
  title: string,
  message: string,
  link = "/portal/admin/chapters",
) {
  const { data: admins } = await admin
    .from("profiles")
    .select("id")
    .in("role", ["SUPER_ADMIN", "STATE_ADMIN"]);
  for (const row of admins || []) {
    await admin.from("notifications").insert({
      profile_id: row.id,
      type,
      title,
      body: message,
      message,
      link,
    });
  }
}

export async function startChapter(admin: Admin, input: StartChapterInput) {
  const email = input.advisorEmail.trim().toLowerCase();
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id")
    .ilike("email", email)
    .maybeSingle();
  if (existingProfile) {
    return { error: "That email already has a MediLink account. Sign in or use a different email." };
  }

  const { data: existingSchool } = await admin
    .from("chapters")
    .select("id")
    .ilike("school", input.schoolName.trim())
    .ilike("city", input.city.trim())
    .ilike("state", input.state.trim())
    .maybeSingle();
  if (existingSchool) {
    return {
      error:
        "A MediLink chapter is already recorded for that school in that city. If it has no portal, use the existing-chapter form.",
    };
  }

  const codes = await uniqueChapterCodes(admin, input.schoolName);
  const password = input.password;
  const school = input.schoolName.trim();
  const { data: chapter, error: chapterError } = await admin
    .from("chapters")
    .insert({
      chapter_code: codes.chapterCode,
      join_code: codes.joinCode,
      slug: codes.slug,
      name: `${school} MediLink`,
      school,
      city: input.city.trim(),
      state: input.state.trim(),
      country: "United States",
      status: "PENDING_APPROVAL",
      public_visibility: false,
      chapter_description: input.statement?.trim() || null,
      description: input.statement?.trim() || null,
    })
    .select("id, chapter_code, school")
    .single();
  if (chapterError || !chapter) {
    return { error: "The chapter record could not be created. Try again." };
  }

  const { data: created, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: input.advisorFirstName.trim(),
      last_name: input.advisorLastName.trim(),
      full_name: `${input.advisorFirstName.trim()} ${input.advisorLastName.trim()}`.trim(),
    },
    app_metadata: { role: "CHAPTER_ADVISOR" },
  });
  if (userError || !created.user) {
    await admin.from("chapters").delete().eq("id", chapter.id);
    if (/already|exists|registered/i.test(userError?.message || "")) {
      return { error: "That email already has a MediLink account. Sign in or use a different email." };
    }
    return { error: "The advisor account could not be created. Try again." };
  }

  const profileError = await ensureProfile(admin, created.user.id, {
    email,
    firstName: input.advisorFirstName.trim(),
    lastName: input.advisorLastName.trim(),
    role: "CHAPTER_ADVISOR",
    chapterId: chapter.id,
    status: "PENDING",
    advisorStatus: "PENDING",
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    await admin.from("chapters").delete().eq("id", chapter.id);
    return { error: "The advisor profile could not be finished. Try again." };
  }

  await admin.from("chapters").update({ advisor_id: created.user.id }).eq("id", chapter.id);

  const { error: applicationError } = await admin.from("chapter_applications").insert({
    chapter_id: chapter.id,
    advisor_profile_id: created.user.id,
    school_name: school,
    city: input.city.trim(),
    state: input.state.trim(),
    advisor_first_name: input.advisorFirstName.trim(),
    advisor_last_name: input.advisorLastName.trim(),
    advisor_email: email,
    advisor_phone: input.advisorPhone?.trim() || "",
    advisor_title: input.advisorTitle?.trim() || "",
    principal_name: input.principalName?.trim() || "",
    estimated_students: input.estimatedStudents ?? null,
    statement: input.statement?.trim() || "",
    review_status: "PENDING",
    request_type: "START",
  });
  if (applicationError) {
    await admin.auth.admin.deleteUser(created.user.id);
    await admin.from("chapters").delete().eq("id", chapter.id);
    return { error: "The chapter application could not be stored. Try again." };
  }

  await writeAudit(admin, created.user.id, "chapter.requested", "chapter", chapter.id, {
    school,
    chapter_code: chapter.chapter_code,
  });
  await notifyAdmins(
    admin,
    "chapter_request",
    "New chapter request",
    `${input.advisorFirstName.trim()} ${input.advisorLastName.trim()} requested a chapter at ${school}.`,
  );
  await sendTransactionalEmail({
    to: email,
    subject: "Your MediLink chapter request",
    text: `Your request for ${school} is in. Sign in at ${siteUrl()}/portal/login. An administrator still has to accept the chapter before you can add students or invite a teacher to share the advisor portal.`,
    template: "advisor_invitation",
  });

  return {
    email,
    password,
    school,
    chapterCode: chapter.chapter_code,
    loginUrl: `${siteUrl()}/portal/login`,
  };
}

export async function reactivateChapter(admin: Admin, input: ReactivateChapterInput) {
  const school = input.schoolName.trim();
  const city = input.city.trim();
  const state = input.state.trim();
  const code = input.chapterCode?.trim().toUpperCase() || "";

  let chapterQuery = admin
    .from("chapters")
    .select("id, school, city, state, status, chapter_code, advisor_id")
    .limit(1);
  if (code) {
    chapterQuery = chapterQuery.eq("chapter_code", code);
  } else {
    chapterQuery = chapterQuery.ilike("school", school).ilike("city", city).ilike("state", state);
  }
  const { data: chapter } = await chapterQuery.maybeSingle();
  if (!chapter) {
    return {
      error:
        "No MediLink chapter is recorded for that school. Use Start a Chapter if this is a new campus.",
    };
  }
  if (["PENDING_APPROVAL", "PROPOSED"].includes(chapter.status)) {
    return { error: "That school already has a request waiting for review." };
  }

  const { data: pending } = await admin
    .from("chapter_applications")
    .select("id")
    .eq("chapter_id", chapter.id)
    .eq("review_status", "PENDING")
    .maybeSingle();
  if (pending) {
    return { error: "That chapter already has a portal request waiting for review." };
  }

  const { data: advisors } = await admin
    .from("profiles")
    .select("id, status, advisor_status")
    .eq("chapter_id", chapter.id)
    .eq("role", "CHAPTER_ADVISOR");
  const hasPortal = (advisors ?? []).some(
    (row) => row.status === "ACTIVE" && (row.advisor_status === "ACTIVE" || !row.advisor_status),
  );
  const portalClaim = chapter.status !== "INACTIVE";
  if (portalClaim && hasPortal) {
    return { error: "That chapter already has a portal. Sign in or write MediLink if you need access." };
  }

  const email = input.advisorEmail.trim().toLowerCase();
  const { data: existingProfile } = await admin
    .from("profiles")
    .select("id, role, chapter_id")
    .ilike("email", email)
    .maybeSingle();

  let advisorId = existingProfile?.id || "";
  if (existingProfile) {
    const sameChapterAdvisor =
      existingProfile.role === "CHAPTER_ADVISOR" && existingProfile.chapter_id === chapter.id;
    if (!sameChapterAdvisor) {
      return { error: "That email already has a MediLink account. Sign in or use a different email." };
    }
    const { error: passwordError } = await admin.auth.admin.updateUserById(existingProfile.id, {
      password: input.password,
    });
    if (passwordError) return { error: "The advisor password could not be updated. Try again." };
    const profileError = await ensureProfile(admin, existingProfile.id, {
      email,
      firstName: input.advisorFirstName.trim(),
      lastName: input.advisorLastName.trim(),
      role: "CHAPTER_ADVISOR",
      chapterId: chapter.id,
      status: "PENDING",
      advisorStatus: "PENDING",
    });
    if (profileError) return { error: "The advisor profile could not be updated. Try again." };
  } else {
    const { data: created, error: userError } = await admin.auth.admin.createUser({
      email,
      password: input.password,
      email_confirm: true,
      user_metadata: {
        first_name: input.advisorFirstName.trim(),
        last_name: input.advisorLastName.trim(),
        full_name: `${input.advisorFirstName.trim()} ${input.advisorLastName.trim()}`.trim(),
      },
      app_metadata: { role: "CHAPTER_ADVISOR" },
    });
    if (userError || !created.user) {
      if (/already|exists|registered/i.test(userError?.message || "")) {
        return { error: "That email already has a MediLink account. Sign in or use a different email." };
      }
      return { error: "The advisor account could not be created. Try again." };
    }
    advisorId = created.user.id;
    const profileError = await ensureProfile(admin, created.user.id, {
      email,
      firstName: input.advisorFirstName.trim(),
      lastName: input.advisorLastName.trim(),
      role: "CHAPTER_ADVISOR",
      chapterId: chapter.id,
      status: "PENDING",
      advisorStatus: "PENDING",
    });
    if (profileError) {
      await admin.auth.admin.deleteUser(created.user.id);
      return { error: "The advisor profile could not be finished. Try again." };
    }
  }

  if (!portalClaim) {
    await admin.from("chapters").update({
      status: "PENDING_APPROVAL",
      public_visibility: false,
      advisor_id: advisorId,
    }).eq("id", chapter.id);
  } else {
    await admin.from("chapters").update({ advisor_id: advisorId }).eq("id", chapter.id);
  }

  const requestType = portalClaim ? "PORTAL_CLAIM" : "REACTIVATE";
  const { error: applicationError } = await admin.from("chapter_applications").insert({
    chapter_id: chapter.id,
    advisor_profile_id: advisorId,
    school_name: school,
    city,
    state,
    advisor_first_name: input.advisorFirstName.trim(),
    advisor_last_name: input.advisorLastName.trim(),
    advisor_email: email,
    advisor_phone: input.advisorPhone?.trim() || "",
    advisor_title: input.advisorTitle?.trim() || "",
    principal_name: input.principalName?.trim() || "",
    estimated_students: input.estimatedStudents ?? null,
    statement: input.statement?.trim() || "",
    review_status: "PENDING",
    request_type: requestType,
  });
  if (applicationError) {
    if (!portalClaim) {
      await admin.from("chapters").update({ status: "INACTIVE", public_visibility: false }).eq("id", chapter.id);
    }
    return { error: "The chapter portal request could not be stored. Try again." };
  }

  await writeAudit(admin, advisorId, portalClaim ? "chapter.portal_claimed" : "chapter.reactivation_requested", "chapter", chapter.id, {
    school: chapter.school,
    chapter_code: chapter.chapter_code,
  });
  await notifyAdmins(
    admin,
    portalClaim ? "chapter_portal_claim" : "chapter_reactivation",
    portalClaim ? "Chapter portal request" : "Chapter reactivation request",
    `${input.advisorFirstName.trim()} ${input.advisorLastName.trim()} asked ${portalClaim ? "for a portal login" : "to reactivate"} at ${chapter.school}.`,
  );
  await sendTransactionalEmail({
    to: email,
    subject: portalClaim ? "Your MediLink chapter portal request" : "Your MediLink chapter reactivation request",
    text: portalClaim
      ? `Your request for a portal login at ${chapter.school} is in. Sign in at ${siteUrl()}/portal/login. An administrator still has to accept it before the advisor tools open.`
      : `Your request to reactivate ${chapter.school} is in. Sign in at ${siteUrl()}/portal/login. An administrator still has to accept the chapter before you can add students.`,
    template: "advisor_invitation",
  });

  return {
    email,
    school: chapter.school,
    chapterCode: chapter.chapter_code,
    loginUrl: `${siteUrl()}/portal/login`,
  };
}

export async function inviteStudent(
  admin: Admin,
  actor: { id: string; chapterId: string | null; role: string; stateScope?: string | null },
  input: AddStudentInput,
) {
  if (!["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"].includes(actor.role)) {
    return { error: "Only an advisor can add students to this roster." };
  }
  const chapterId =
    actor.role === "CHAPTER_ADVISOR" ? actor.chapterId : actor.chapterId || input.chapterId || null;
  if (!chapterId) return { error: "Choose a chapter for this student." };
  if (actor.role === "STATE_ADMIN" && input.chapterId && input.chapterId !== actor.chapterId) {
    const { data: scoped } = await admin
      .from("chapters")
      .select("id, state")
      .eq("id", input.chapterId)
      .maybeSingle();
    if (!scoped || (actor.stateScope && scoped.state !== actor.stateScope)) {
      return { error: "You can only add students to a chapter in your state." };
    }
  }

  const { data: chapter } = await admin.from("chapters").select("status").eq("id", chapterId).maybeSingle();
  if (!chapter) return { error: "That chapter was not found." };
  if (actor.role === "CHAPTER_ADVISOR" && ["PROPOSED", "PENDING_APPROVAL", "INACTIVE"].includes(chapter.status)) {
    return { error: "An administrator still has to accept this chapter before you can add students." };
  }

  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const { data: existing } = await admin
    .from("profiles")
    .select("id, role, status")
    .ilike("email", email)
    .maybeSingle();
  if (existing && !(existing.role === "STUDENT" && existing.status === "PENDING")) {
    return { error: "That email already has a MediLink account." };
  }

  await admin
    .from("invitations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("chapter_id", chapterId)
    .ilike("email", email)
    .is("used_at", null)
    .is("revoked_at", null);
  await cancelPendingInviteMail(email);

  const created = await createInvitation({
    client: admin,
    actor: {
      id: actor.id,
      role: actor.role as "CHAPTER_ADVISOR" | "STATE_ADMIN" | "SUPER_ADMIN",
      chapterId,
      stateScope: actor.stateScope,
    },
    email,
    role: "STUDENT",
    firstName,
    lastName,
    grade: input.grade,
  });
  if ("error" in created && created.error) return { error: created.error };
  if (!("token" in created) || !created.token) {
    return { error: "The invitation could not be created." };
  }

  if (!created.sent) {
    await admin.from("invitations").delete().eq("id", created.id);
    return {
      error:
        created.sendError ||
        "The invite email could not be sent to that student. Check the MediLink Gmail Sent folder, then try again.",
    };
  }

  await writeAudit(admin, actor.id, "student.invited", "invitation", created.id, {
    chapter_id: chapterId,
    email,
  });

  return {
    email,
    name: `${firstName} ${lastName}`.trim(),
    sent: true,
  };
}

export type InviteAdvisorInput = {
  firstName: string;
  lastName: string;
  email: string;
  chapterId?: string;
};

export async function inviteAdvisor(
  admin: Admin,
  actor: { id: string; chapterId: string | null; role: string; stateScope?: string | null },
  input: InviteAdvisorInput,
) {
  if (!["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"].includes(actor.role)) {
    return { error: "Only a chapter advisor can invite a teacher to the advisor portal." };
  }
  const chapterId =
    actor.role === "CHAPTER_ADVISOR" ? actor.chapterId : actor.chapterId || input.chapterId || null;
  if (!chapterId) return { error: "Choose a chapter for this teacher." };

  const { data: chapter } = await admin
    .from("chapters")
    .select("id, school, status")
    .eq("id", chapterId)
    .maybeSingle();
  if (!chapter) return { error: "That chapter was not found." };
  if (actor.role === "CHAPTER_ADVISOR" && ["PROPOSED", "PENDING_APPROVAL", "INACTIVE"].includes(chapter.status)) {
    return { error: "An administrator still has to accept this chapter before you can invite a teacher." };
  }

  const email = input.email.trim().toLowerCase();
  const firstName = input.firstName.trim();
  const lastName = input.lastName.trim();
  const { data: existing } = await admin.from("profiles").select("id, role, chapter_id").ilike("email", email).maybeSingle();
  if (existing) {
    if (existing.role === "CHAPTER_ADVISOR" && existing.chapter_id === chapterId) {
      return { error: "That teacher already has an advisor account for this chapter." };
    }
    return { error: "That email already has a MediLink account." };
  }

  await admin
    .from("invitations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("chapter_id", chapterId)
    .ilike("email", email)
    .is("used_at", null)
    .is("revoked_at", null);
  await cancelPendingInviteMail(email);

  const created = await createInvitation({
    client: admin,
    actor: {
      id: actor.id,
      role: actor.role as "CHAPTER_ADVISOR" | "STATE_ADMIN" | "SUPER_ADMIN",
      chapterId,
      stateScope: actor.stateScope,
    },
    email,
    role: "CHAPTER_ADVISOR",
    firstName,
    lastName,
    schoolName: chapter.school || undefined,
  });
  if ("error" in created && created.error) return { error: created.error };
  if (!("token" in created) || !created.token) {
    return { error: "The teacher invitation could not be created." };
  }

  if (!created.sent) {
    await admin.from("invitations").delete().eq("id", created.id);
    return {
      error:
        created.sendError ||
        "The invite email could not be sent to that teacher. Check the MediLink Gmail Sent folder, then try again.",
    };
  }

  await writeAudit(admin, actor.id, "advisor.invited", "invitation", created.id, {
    chapter_id: chapterId,
    email,
  });

  return {
    email,
    name: `${firstName} ${lastName}`.trim(),
    sent: true,
  };
}

export async function recordAdvisorSignInAttempt(admin: Admin, userId: string) {
  const { data: application } = await admin
    .from("chapter_applications")
    .select("id, school_name, advisor_first_name, advisor_last_name, advisor_email, review_status")
    .eq("advisor_profile_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!application) return;
  await admin
    .from("chapter_applications")
    .update({ last_sign_in_attempt_at: new Date().toISOString() })
    .eq("id", application.id);
  if (application.review_status !== "PENDING") return;
  await notifyAdmins(
    admin,
    "chapter_login_attempt",
    "Pending advisor signed in",
    `${application.advisor_first_name} ${application.advisor_last_name} signed in while ${application.school_name} is waiting for review.`,
  );
  await writeAudit(admin, userId, "chapter.login_while_pending", "chapter_application", application.id, {
    school: application.school_name,
    email: application.advisor_email,
  });
}

export async function reviewChapterRequest(
  admin: Admin,
  actorId: string,
  chapterId: string,
  decision: "approve" | "deny",
) {
  const { data: application } = await admin
    .from("chapter_applications")
    .select("id, advisor_profile_id, school_name, review_status, request_type")
    .eq("chapter_id", chapterId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();
  if (!application) return { error: "That chapter request was not found." };
  if (application.review_status !== "PENDING") {
    return { error: "That request has already been reviewed." };
  }

  const now = new Date().toISOString();
  const portalClaim = application.request_type === "PORTAL_CLAIM";
  if (decision === "deny") {
    await admin
      .from("chapter_applications")
      .update({
        review_status: "DENIED",
        reviewed_at: now,
        reviewed_by: actorId,
      })
      .eq("id", application.id);
    if (!portalClaim) {
      await admin.from("chapters").update({ status: "INACTIVE", public_visibility: false }).eq("id", chapterId);
    }
    await admin
      .from("profiles")
      .update({ status: "INACTIVE", advisor_status: "INACTIVE" })
      .eq("id", application.advisor_profile_id);
    await writeAudit(admin, actorId, portalClaim ? "chapter.portal_denied" : "chapter.denied", "chapter", chapterId);
    await admin.from("notifications").insert({
      profile_id: application.advisor_profile_id,
      type: "chapter_denied",
      title: portalClaim ? "Portal request not accepted" : "Chapter request not accepted",
      body: portalClaim
        ? `The portal request for ${application.school_name} was not accepted. Contact MediLink if this is a mistake.`
        : `${application.school_name} was not accepted. Contact MediLink if this is a mistake.`,
      message: portalClaim
        ? `The portal request for ${application.school_name} was not accepted. Contact MediLink if this is a mistake.`
        : `${application.school_name} was not accepted. Contact MediLink if this is a mistake.`,
      link: "/portal/pending",
    });
    return { ok: true, decision };
  }

  await admin
    .from("chapter_applications")
    .update({
      review_status: "APPROVED",
      reviewed_at: now,
      reviewed_by: actorId,
    })
    .eq("id", application.id);
  await admin
    .from("chapters")
    .update(
      portalClaim
        ? { advisor_id: application.advisor_profile_id }
        : {
            status: "FOUNDING",
            founded_date: now.slice(0, 10),
            advisor_id: application.advisor_profile_id,
            public_visibility: true,
          },
    )
    .eq("id", chapterId);
  await admin
    .from("profiles")
    .update({ status: "ACTIVE", advisor_status: "ACTIVE" })
    .eq("id", application.advisor_profile_id);
  await admin.from("chapter_members").upsert(
    {
      chapter_id: chapterId,
      profile_id: application.advisor_profile_id,
      status: "ACTIVE",
      joined_at: now,
    },
    { onConflict: "chapter_id,profile_id" },
  );
  await writeAudit(admin, actorId, portalClaim ? "chapter.portal_approved" : "chapter.approved", "chapter", chapterId);
  await admin.from("notifications").insert({
    profile_id: application.advisor_profile_id,
    type: "chapter_approved",
    title: portalClaim ? "Your chapter portal is open" : "Your chapter was accepted",
    body: portalClaim
      ? `The advisor portal for ${application.school_name} is open. You can add students and invite a teacher.`
      : `${application.school_name} is now a founding MediLink chapter. You can add students.`,
    message: portalClaim
      ? `The advisor portal for ${application.school_name} is open. You can add students and invite a teacher.`
      : `${application.school_name} is now a founding MediLink chapter. You can add students.`,
    link: "/portal/advisor/members",
  });
  return { ok: true, decision };
}
