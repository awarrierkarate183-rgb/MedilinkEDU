import { createAdminClient } from "@/lib/supabase/admin";
import { sendTransactionalEmail } from "@/lib/email";
import { createInviteToken, hashToken, invitationIsUsable } from "@/lib/auth/tokens";
import { canManageChapter, type Actor } from "@/lib/auth/roles";
import { pointsForReason } from "@/lib/points/award";

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
}) {
  if (!opts.actor.chapterId && opts.actor.role !== "SUPER_ADMIN") {
    return { error: "Your advisor account is not attached to a chapter yet." };
  }
  if (opts.role === "CHAPTER_ADVISOR" && opts.actor.role !== "SUPER_ADMIN") {
    return { error: "Only an administrator can invite an advisor." };
  }
  const token = createInviteToken();
  const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await opts.client.from("invitations").insert({
    chapter_id: opts.actor.chapterId,
    created_by: opts.actor.id,
    intended_role: opts.role,
    email: opts.email ?? null,
    token_hash: hashToken(token),
    expires_at: expires,
    max_uses: 1,
  });
  if (error) return { error: "The invitation could not be created." };
  await writeAudit(opts.client, opts.actor.id, "invitation.created", "chapter", opts.actor.chapterId ?? undefined);
  if (opts.email) {
    await sendTransactionalEmail({
      to: opts.email,
      subject: "Your MediLink chapter invitation",
      text: "An advisor invited you to join a MediLink chapter. Use the invitation code they provided.",
      template: opts.role === "CHAPTER_ADVISOR" ? "advisor_invitation" : "student_invitation",
    });
  }
  return { token, expires };
}

export async function redeemInvitation(opts: {
  userClient: Client & { auth: { signUp: Function } };
  token: string;
  email: string;
  password: string;
  firstName: string;
  lastName?: string;
}) {
  const admin = createAdminClient();
  if (!admin) {
    return { error: "Invitation redeem is unavailable until the server secret key is configured." };
  }
  const lookup = admin;
  const { data: invite, error: inviteError } = await lookup
    .from("invitations")
    .select("id, chapter_id, intended_role, expires_at, revoked_at, used_at, max_uses, use_count, email")
    .eq("token_hash", hashToken(opts.token))
    .maybeSingle();

  if (inviteError || !invite) return { error: "That invitation is not valid." };
  const usable = invitationIsUsable(invite);
  if (!usable.ok) {
    if (usable.reason === "revoked") return { error: "That invitation was revoked." };
    if (usable.reason === "used") return { error: "That invitation has already been used." };
    return { error: "That invitation has expired." };
  }
  if (invite.email && invite.email.toLowerCase() !== opts.email.toLowerCase()) {
    return { error: "Use the email address this invitation was sent to." };
  }

  const { data: signed, error: signError } = await opts.userClient.auth.signUp({
    email: opts.email,
    password: opts.password,
    options: {
      data: {
        first_name: opts.firstName,
        last_name: opts.lastName || "",
        full_name: [opts.firstName, opts.lastName].filter(Boolean).join(" "),
      },
    },
  });
  if (signError || !signed?.user) {
    return { error: "The account could not be created. That email may already be in use." };
  }

  const writer = admin;
  const display = [opts.firstName, opts.lastName].filter(Boolean).join(" ");
  const { error: profileError } = await writer.from("profiles").upsert({
    id: signed.user.id,
    full_name: display,
    first_name: opts.firstName,
    last_name: opts.lastName || "",
    display_name: display,
    role: invite.intended_role,
    chapter_id: invite.chapter_id,
    status: "PENDING",
  });
  if (profileError) {
    return { error: "Your account was created but the chapter profile could not be attached." };
  }

  await writer.from("chapter_members").insert({
    chapter_id: invite.chapter_id,
    profile_id: signed.user.id,
    status: "PENDING",
  });
  await writer
    .from("invitations")
    .update({
      used_at: new Date().toISOString(),
      use_count: (invite.use_count ?? 0) + 1,
    })
    .eq("id", invite.id);

  await writeAudit(writer, signed.user.id, "invitation.redeemed", "invitation", invite.id);
  return { ok: true };
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
  const { error } = await opts.client
    .from("chapters")
    .update({ status: opts.status })
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
