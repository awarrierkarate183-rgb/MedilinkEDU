import type { SupabaseClient } from "@supabase/supabase-js";
import { generatePortalPassword, generatePublicCode, slugFromName } from "@/lib/auth/passwords";
import { writeAudit } from "@/lib/platform/operations";
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
};

export type AddStudentInput = {
  firstName: string;
  lastName: string;
  email: string;
  grade?: string;
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
  },
) {
  const fullName = `${values.firstName} ${values.lastName}`.trim();
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
      status: "ACTIVE",
      advisor_status: values.role === "CHAPTER_ADVISOR" ? "ACTIVE" : null,
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
      status: "ACTIVE",
      advisor_status: values.role === "CHAPTER_ADVISOR" ? "ACTIVE" : null,
    })
    .eq("id", userId);
  return error?.message ?? null;
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
    return { error: "A MediLink chapter is already recorded for that school in that city." };
  }

  const codes = await uniqueChapterCodes(admin, input.schoolName);
  const password = generatePortalPassword();
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
      status: "FOUNDING",
      public_visibility: false,
      founded_date: new Date().toISOString().slice(0, 10),
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
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    await admin.from("chapters").delete().eq("id", chapter.id);
    return { error: "The advisor profile could not be finished. Try again." };
  }

  await admin.from("chapters").update({ advisor_id: created.user.id }).eq("id", chapter.id);
  await admin.from("chapter_members").insert({
    chapter_id: chapter.id,
    profile_id: created.user.id,
    status: "ACTIVE",
    joined_at: new Date().toISOString(),
  });

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
  });
  if (applicationError) {
    await admin.auth.admin.deleteUser(created.user.id);
    await admin.from("chapters").delete().eq("id", chapter.id);
    return { error: "The chapter application could not be stored. Try again." };
  }

  await writeAudit(admin, created.user.id, "chapter.started", "chapter", chapter.id, {
    school,
    chapter_code: chapter.chapter_code,
  });
  await sendTransactionalEmail({
    to: email,
    subject: "Your MediLink chapter advisor account",
    text: `Your chapter at ${school} is ready. Sign in at ${siteUrl()}/portal/login with this email.`,
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

export async function addStudentAccount(
  admin: Admin,
  actor: { id: string; chapterId: string | null; role: string },
  input: AddStudentInput,
) {
  if (!actor.chapterId) return { error: "Your advisor account is not attached to a chapter yet." };
  if (!["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"].includes(actor.role)) {
    return { error: "Only an advisor can add students to this roster." };
  }

  const email = input.email.trim().toLowerCase();
  const { data: existing } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
  if (existing) return { error: "That email already has a MediLink account." };

  const password = generatePortalPassword();
  const { data: created, error: userError } = await admin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
    user_metadata: {
      first_name: input.firstName.trim(),
      last_name: input.lastName.trim(),
      full_name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    },
    app_metadata: { role: "STUDENT" },
  });
  if (userError || !created.user) {
    if (/already|exists|registered/i.test(userError?.message || "")) {
      return { error: "That email already has a MediLink account." };
    }
    return { error: "The student account could not be created. Try again." };
  }

  const profileError = await ensureProfile(admin, created.user.id, {
    email,
    firstName: input.firstName.trim(),
    lastName: input.lastName.trim(),
    role: "STUDENT",
    chapterId: actor.chapterId,
    grade: input.grade,
  });
  if (profileError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: "The student profile could not be finished. Try again." };
  }

  const { error: memberError } = await admin.from("chapter_members").insert({
    chapter_id: actor.chapterId,
    profile_id: created.user.id,
    status: "ACTIVE",
    joined_at: new Date().toISOString(),
  });
  if (memberError) {
    await admin.auth.admin.deleteUser(created.user.id);
    return { error: "The student could not be added to the roster. Try again." };
  }

  await writeAudit(admin, actor.id, "student.created", "profile", created.user.id, {
    chapter_id: actor.chapterId,
  });
  await sendTransactionalEmail({
    to: email,
    subject: "Your MediLink student account",
    text: `Your advisor added you to a MediLink chapter. Sign in at ${siteUrl()}/portal/login with this email.`,
    template: "student_invitation",
  });

  return {
    email,
    password,
    name: `${input.firstName.trim()} ${input.lastName.trim()}`.trim(),
    loginUrl: `${siteUrl()}/portal/login`,
  };
}
