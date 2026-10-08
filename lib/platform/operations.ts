import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email";
import { deliverInviteEmail } from "@/lib/email/deliver";
import { studentInviteMessage } from "@/lib/email/student-invite";
import { advisorInviteMessage } from "@/lib/email/advisor-invite";
import { createInviteToken, hashToken, invitationIsUsable } from "@/lib/auth/tokens";
import { canInviteChapterAdvisor, canManageChapter, isAdminRole, type Actor } from "@/lib/auth/roles";
import { pointsForReason } from "@/lib/points/award";
import { siteUrl } from "@/lib/env";

type Client = {
  from: (table: string) => any;
};

export async function writeAudit(
  client: Client,
  actorId: string,
  action: string,
  entityType?: string,
  entityId?: string,
  metadata: Record<string, unknown> = {},
) {
  await client.from("audit_logs").insert({
    actor_id: actorId,
    action,
    entity_type: entityType ?? null,
    entity_id: entityId ?? null,
    target: entityId ?? entityType ?? null,
    metadata,
  });
}

export async function notify(
  client: Client,
  profileId: string,
  type: string,
  title: string,
  message: string,
  link?: string,
) {
  await client.from("notifications").insert({
    profile_id: profileId,
    type,
    title,
    body: message,
    message,
    link: link ?? null,
  });
}

export async function createInvitation(opts: {
  client: Client;
  actor: Actor;
  email?: string;
  role: "STUDENT" | "CHAPTER_ADVISOR";
  firstName?: string;
  lastName?: string;
  grade?: string;
  schoolName?: string;
}) {
  if (!opts.actor.chapterId && opts.actor.role !== "SUPER_ADMIN") {
    return { error: "Your advisor account is not attached to a chapter yet." };
  }
  if (opts.role === "CHAPTER_ADVISOR" && !canInviteChapterAdvisor(opts.actor)) {
    return { error: "Only a chapter advisor can invite a teacher to the advisor portal." };
  }
  const token = createInviteToken();
  const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const { data: inserted, error } = await opts.client
    .from("invitations")
    .insert({
      chapter_id: opts.actor.chapterId,
      created_by: opts.actor.id,
      intended_role: opts.role,
      email: opts.email ?? null,
      first_name: opts.firstName?.trim() || null,
      last_name: opts.lastName?.trim() || null,
      grade: opts.grade || null,
      token_hash: hashToken(token),
      expires_at: expires,
      max_uses: 1,
    })
    .select("id")
    .single();
  if (error || !inserted?.id) return { error: "The invitation could not be created." };
  await writeAudit(opts.client, opts.actor.id, "invitation.created", "chapter", opts.actor.chapterId ?? undefined);

  const inviteUrl = `${siteUrl()}/portal/invite/${token}`;
  let sent = false;
  let sendError: string | undefined;
  if (opts.email) {
    const message =
      opts.role === "STUDENT"
        ? studentInviteMessage({
            firstName: opts.firstName || "",
            inviteUrl,
            expiresAt: expires,
          })
        : advisorInviteMessage({
            firstName: opts.firstName || "",
            inviteUrl,
            expiresAt: expires,
            schoolName: opts.schoolName,
          });
    if (opts.role === "STUDENT") {
      const delivered = await deliverInviteEmail({
        email: opts.email,
        firstName: opts.firstName || "",
        lastName: opts.lastName || "",
        inviteUrl,
        expiresAt: expires,
      });
      sent = delivered.sent;
      sendError = delivered.error;
      if (delivered.userId) {
        await opts.client.from("invitations").update({ invited_user_id: delivered.userId }).eq("id", inserted.id);
      }
    } else {
      const mail = await sendTransactionalEmail({
        to: opts.email,
        subject: message.subject,
        text: message.text,
        html: message.html,
        template: "advisor_invitation",
      });
      sent = mail.sent;
      sendError = mail.error;
    }
  }
  return { token, expires, id: inserted.id, sent, sendError, inviteUrl };
}

export async function getInvitationPreview(token: string) {
  const admin = createAdminClient();
  if (!admin) return { error: "The portal is not connected yet." };
  const { data: invite, error } = await admin
    .from("invitations")
    .select(
      "email, first_name, last_name, grade, expires_at, revoked_at, used_at, max_uses, use_count, intended_role",
    )
    .eq("token_hash", hashToken(token))
    .maybeSingle();
  if (error || !invite) return { error: "That invitation is not valid." };
  const usable = invitationIsUsable(invite);
  if (!usable.ok) {
    if (usable.reason === "revoked") return { error: "That invitation was revoked." };
    if (usable.reason === "used") return { error: "That invitation has already been used." };
    return { error: "That invitation has expired." };
  }
  return {
    email: invite.email as string | null,
    firstName: (invite.first_name as string | null) || "",
    lastName: (invite.last_name as string | null) || "",
    grade: (invite.grade as string | null) || "",
    intendedRole: invite.intended_role as string,
  };
}

export async function redeemInvitation(opts: {
  userClient: Client & {
    auth: {
      signInWithPassword: Function;
    };
  };
  token: string;
  password: string;
}) {
  const admin = createAdminClient();
  if (!admin) {
    return { error: "Invitation redeem is unavailable until the server secret key is configured." };
  }
  const { data: invite, error: inviteError } = await admin
    .from("invitations")
    .select(
      "id, chapter_id, intended_role, expires_at, revoked_at, used_at, max_uses, use_count, email, first_name, last_name, grade, invited_user_id",
    )
    .eq("token_hash", hashToken(opts.token))
    .maybeSingle();

  if (inviteError || !invite) return { error: "That invitation is not valid." };
  const usable = invitationIsUsable(invite);
  if (!usable.ok) {
    if (usable.reason === "revoked") return { error: "That invitation was revoked." };
    if (usable.reason === "used") return { error: "That invitation has already been used." };
    return { error: "That invitation has expired." };
  }
  if (!invite.email) return { error: "That invitation is missing an email address." };

  const email = String(invite.email).trim().toLowerCase();
  const firstName =
    String(invite.first_name || "").trim() ||
    (invite.intended_role === "CHAPTER_ADVISOR" ? "Advisor" : "Student");
  const lastName = String(invite.last_name || "").trim();
  const display = [firstName, lastName].filter(Boolean).join(" ");
  const role = invite.intended_role === "CHAPTER_ADVISOR" ? "CHAPTER_ADVISOR" : "STUDENT";

  let userId = (invite.invited_user_id as string | null) || null;
  if (!userId) {
    const { data: existing } = await admin.from("profiles").select("id").ilike("email", email).maybeSingle();
    userId = existing?.id ?? null;
  }

  if (userId) {
    const { error: updateError } = await admin.auth.admin.updateUserById(userId, {
      password: opts.password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: display,
      },
      app_metadata: { role },
    });
    if (updateError) return { error: "The account password could not be saved. Try again." };
  } else {
    const { data: created, error: createError } = await admin.auth.admin.createUser({
      email,
      password: opts.password,
      email_confirm: true,
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
        full_name: display,
      },
      app_metadata: { role },
    });
    if (createError || !created.user) {
      if (/already|exists|registered/i.test(createError?.message || "")) {
        return { error: "That email already has a MediLink account." };
      }
      return { error: "The account could not be created. Try again." };
    }
    userId = created.user.id;
  }

  const { error: profileError } = await admin.from("profiles").upsert({
    id: userId,
    email,
    full_name: display,
    first_name: firstName,
    last_name: lastName,
    display_name: display,
    role,
    chapter_id: invite.chapter_id,
    grade: invite.grade || "",
    status: "ACTIVE",
    advisor_status: role === "CHAPTER_ADVISOR" ? "ACTIVE" : null,
  });
  if (profileError) {
    return { error: "Your account was created but the chapter profile could not be attached." };
  }

  const { data: membership } = await admin
    .from("chapter_members")
    .select("id")
    .eq("chapter_id", invite.chapter_id)
    .eq("profile_id", userId)
    .maybeSingle();
  if (membership?.id) {
    await admin
      .from("chapter_members")
      .update({ status: "ACTIVE", joined_at: new Date().toISOString() })
      .eq("id", membership.id);
  } else {
    await admin.from("chapter_members").insert({
      chapter_id: invite.chapter_id,
      profile_id: userId,
      status: "ACTIVE",
      joined_at: new Date().toISOString(),
    });
  }

  await admin
    .from("invitations")
    .update({
      used_at: new Date().toISOString(),
      use_count: (invite.use_count ?? 0) + 1,
      invited_user_id: userId,
    })
    .eq("id", invite.id);

  await writeAudit(admin, userId, "invitation.redeemed", "invitation", invite.id);

  const { error: signError } = await opts.userClient.auth.signInWithPassword({
    email,
    password: opts.password,
  });
  if (signError) {
    return { ok: true, signedIn: false, role };
  }
  return { ok: true, signedIn: true, role };
}

export async function approveMember(opts: {
  client: Client;
  actor: Actor;
  membershipId: string;
}) {
  const { data: membership, error } = await opts.client
    .from("chapter_members")
    .select("id, chapter_id, profile_id, status")
    .eq("id", opts.membershipId)
    .maybeSingle();
  if (error || !membership) return { error: "That membership was not found." };

  if (opts.actor.role === "CHAPTER_ADVISOR" && opts.actor.chapterId !== membership.chapter_id) {
    return { error: "You can only approve members of your chapter." };
  }
  if (opts.actor.role === "STATE_ADMIN") {
    const { data: chapter } = await opts.client
      .from("chapters")
      .select("id, state, advisor_id")
      .eq("id", membership.chapter_id)
      .maybeSingle();
    if (!chapter || !canManageChapter(opts.actor, { id: chapter.id, state: chapter.state, advisorId: chapter.advisor_id })) {
      return { error: "You can only approve members in your administrative scope." };
    }
  }

  const { error: updateError } = await opts.client
    .from("chapter_members")
    .update({
      status: "ACTIVE",
      joined_at: new Date().toISOString(),
      left_at: null,
    })
    .eq("id", membership.id)
    .eq("chapter_id", membership.chapter_id);
  if (updateError) return { error: "That member could not be approved." };

  await opts.client
    .from("profiles")
    .update({ status: "ACTIVE", chapter_id: membership.chapter_id })
    .eq("id", membership.profile_id);

  await writeAudit(opts.client, opts.actor.id, "student_approved", "chapter_member", membership.id, {
    chapter_id: membership.chapter_id,
  });
  await notify(
    opts.client,
    membership.profile_id,
    "membership",
    "Chapter membership approved",
    "Your advisor approved your MediLink chapter membership.",
    "/portal/student",
  );
  return { ok: true };
}

export async function awardPoints(opts: {
  client: Client;
  actor: Actor;
  reasonCode: string;
  competitionId?: string;
  stageId?: string;
  teamId?: string;
  profileId?: string;
  eventDate?: string;
}) {
  if (!isAdminRole(opts.actor.role)) {
    return { error: "Chapter points come from published event results. Advisors cannot add points." };
  }
  const amount = pointsForReason(opts.reasonCode);
  if (amount == null) return { error: "That point reason is not recognized." };

  let chapterId = opts.actor.chapterId;
  if (!chapterId && opts.actor.role === "SUPER_ADMIN" && opts.profileId) {
    const { data: target } = await opts.client
      .from("profiles")
      .select("chapter_id")
      .eq("id", opts.profileId)
      .maybeSingle();
    chapterId = target?.chapter_id ?? null;
  }
  if (!chapterId) return { error: "A chapter is required to award points." };
  if (opts.actor.role === "CHAPTER_ADVISOR" && opts.actor.chapterId !== chapterId) {
    return { error: "You can only award points for your chapter." };
  }

  const { data: cycle } = await opts.client
    .from("apex_cycles")
    .select("id")
    .eq("is_current", true)
    .maybeSingle();

  const { error } = await opts.client.from("points_transactions").insert({
    chapter_id: chapterId,
    profile_id: opts.profileId ?? null,
    competition_id: opts.competitionId ?? null,
    stage_id: opts.stageId ?? null,
    team_id: opts.teamId ?? null,
    amount,
    reason_code: opts.reasonCode,
    reason: opts.reasonCode.replaceAll("_", " "),
    event_date: opts.eventDate ?? null,
    apex_cycle_id: cycle?.id ?? null,
    created_by: opts.actor.id,
  });
  if (error) return { error: "Points could not be recorded." };
  await writeAudit(opts.client, opts.actor.id, "points_awarded", "chapter", chapterId, {
    reason: opts.reasonCode,
    amount,
  });
  return { ok: true, amount };
}

export async function approveChapter(opts: {
  client: Client;
  actor: Actor;
  chapterId: string;
  status: string;
}) {
  if (opts.actor.role !== "SUPER_ADMIN" && opts.actor.role !== "STATE_ADMIN") {
    return { error: "Only administrators can change chapter status." };
  }
  const { data: chapter } = await opts.client
    .from("chapters")
    .select("id, state, advisor_id")
    .eq("id", opts.chapterId)
    .maybeSingle();
  if (!chapter) return { error: "That chapter was not found." };
  if (!canManageChapter(opts.actor, { id: chapter.id, state: chapter.state, advisorId: chapter.advisor_id })) {
    return { error: "That chapter is outside your administrative scope." };
  }
  const publicStatuses = new Set(["FOUNDING", "ESTABLISHED", "FLAGSHIP_ELIGIBLE"]);
  const { error } = await opts.client
    .from("chapters")
    .update({
      status: opts.status,
      public_visibility: publicStatuses.has(opts.status),
    })
    .eq("id", chapter.id);
  if (error) return { error: "The chapter could not be updated." };
  await writeAudit(opts.client, opts.actor.id, "chapter_created" === opts.status ? "chapter_updated" : "chapter_updated", "chapter", chapter.id, {
    status: opts.status,
  });
  if (opts.status === "ESTABLISHED" || opts.status === "FOUNDING") {
    await writeAudit(opts.client, opts.actor.id, "chapter_approved", "chapter", chapter.id, {
      status: opts.status,
    });
  }
  return { ok: true };
}

export async function publishResult(opts: {
  client: Client;
  actor: Actor;
  resultId: string;
}) {
  if (opts.actor.role !== "SUPER_ADMIN") {
    return { error: "Only a super administrator can publish results." };
  }
  const { data: result } = await opts.client
    .from("competition_results")
    .select("id")
    .eq("id", opts.resultId)
    .maybeSingle();
  if (!result) return { error: "That result was not found." };
  const { error } = await opts.client
    .from("competition_results")
    .update({ published: true, published_at: new Date().toISOString() })
    .eq("id", result.id);
  if (error) return { error: "The result could not be published." };
  await writeAudit(opts.client, opts.actor.id, "result_published", "competition_result", result.id);
  return { ok: true };
}
