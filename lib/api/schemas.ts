import { z } from "zod";

export const uuid = z.string().uuid("That id is not valid.");

export const createInvitationSchema = z.object({
  email: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.string().email().optional(),
  ),
  role: z.enum(["STUDENT", "CHAPTER_ADVISOR"]).default("STUDENT"),
});

export const redeemInvitationSchema = z.object({
  token: z.string().min(16).max(200),
  email: z.string().email(),
  password: z.string().min(8).max(72),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80).optional().or(z.literal("")),
});

export const approveMemberSchema = z.object({
  membershipId: uuid,
});

export const joinChapterSchema = z.object({
  joinCode: z.string().min(3).max(64).regex(/^[A-Za-z0-9_-]+$/),
});

export const registerEventSchema = z.object({
  eventId: uuid,
});

export const awardPointsSchema = z.object({
  reasonCode: z.string().min(3).max(80),
  competitionId: uuid.optional(),
  stageId: uuid.optional(),
  teamId: uuid.optional(),
  profileId: uuid.optional(),
  eventDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD.").optional(),
});

export const approveChapterSchema = z.object({
  chapterId: uuid,
  status: z.enum([
    "PENDING_APPROVAL",
    "FOUNDING",
    "ESTABLISHED",
    "FLAGSHIP_ELIGIBLE",
    "INACTIVE",
    "REACTIVATION_PENDING",
  ]),
});

export const publishResultsSchema = z.object({
  resultId: uuid,
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(8000),
  audienceType: z.enum(["all", "students", "advisors", "chapter", "competition_participants"]),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  status: z.enum(["draft", "published"]).default("published"),
});
