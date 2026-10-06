import { z } from "zod";
import { ADVISOR_TITLES, US_STATES } from "@/lib/content/states";

export const uuid = z.string().uuid("That id is not valid.");

export const createInvitationSchema = z.object({
  email: z.preprocess(
    (value) => (value === "" || value == null ? undefined : value),
    z.string().email().optional(),
  ),
  role: z.enum(["STUDENT", "CHAPTER_ADVISOR"]).default("STUDENT"),
});

export const redeemInvitationSchema = z
  .object({
    token: z.string().min(16).max(200),
    password: z
      .string()
      .min(8, "Choose a password with at least 8 characters.")
      .max(72, "That password is too long."),
    confirmPassword: z.string().min(8, "Confirm your password."),
  })
  .refine((value) => value.password === value.confirmPassword, {
    message: "The two passwords do not match.",
    path: ["confirmPassword"],
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

export const reviewChapterSchema = z.object({
  chapterId: uuid,
  decision: z.enum(["approve", "deny"]),
});

export const publishResultsSchema = z.object({
  resultId: uuid,
});

export const startChapterSchema = z
  .object({
    schoolName: z.string().trim().min(3, "Enter the high school name.").max(160),
    city: z.string().trim().min(2, "Enter the city.").max(80),
    state: z.enum(US_STATES, { message: "Choose a state." }),
    advisorFirstName: z.string().trim().min(1, "Enter the advisor first name.").max(80),
    advisorLastName: z.string().trim().min(1, "Enter the advisor last name.").max(80),
    advisorEmail: z.string().trim().email("Enter a real advisor email.").max(160),
    advisorPhone: z.string().trim().max(40).optional().or(z.literal("")),
    advisorTitle: z.enum(ADVISOR_TITLES).optional(),
    principalName: z.string().trim().max(120).optional().or(z.literal("")),
    estimatedStudents: z.coerce.number().int().min(1).max(500).optional(),
    statement: z.string().trim().max(1000).optional().or(z.literal("")),
    password: z
      .string()
      .min(8, "Choose a password with at least 8 characters.")
      .max(72, "That password is too long."),
    confirmPassword: z.string().min(8, "Confirm the portal password."),
    highSchool: z.literal("yes", { message: "Confirm this is a high school chapter." }),
    website: z.string().max(0, "That request is not valid.").optional().or(z.literal("")),
  })
  .strict()
  .refine((value) => value.password === value.confirmPassword, {
    message: "The two passwords do not match.",
    path: ["confirmPassword"],
  });

export const reactivateChapterSchema = z
  .object({
    schoolName: z.string().trim().min(3, "Enter the high school name.").max(160),
    city: z.string().trim().min(2, "Enter the city.").max(80),
    state: z.enum(US_STATES, { message: "Choose a state." }),
    chapterCode: z.string().trim().max(24).optional().or(z.literal("")),
    advisorFirstName: z.string().trim().min(1, "Enter the advisor first name.").max(80),
    advisorLastName: z.string().trim().min(1, "Enter the advisor last name.").max(80),
    advisorEmail: z.string().trim().email("Enter a real advisor email.").max(160),
    advisorPhone: z.string().trim().max(40).optional().or(z.literal("")),
    advisorTitle: z.enum(ADVISOR_TITLES).optional(),
    principalName: z.string().trim().max(120).optional().or(z.literal("")),
    estimatedStudents: z.coerce.number().int().min(1).max(500).optional(),
    statement: z.string().trim().min(8, "Say why this chapter should come back.").max(1000),
    password: z
      .string()
      .min(8, "Choose a password with at least 8 characters.")
      .max(72, "That password is too long."),
    confirmPassword: z.string().min(8, "Confirm the portal password."),
    highSchool: z.literal("yes", { message: "Confirm this is a high school chapter." }),
    website: z.string().max(0, "That request is not valid.").optional().or(z.literal("")),
  })
  .strict()
  .refine((value) => value.password === value.confirmPassword, {
    message: "The two passwords do not match.",
    path: ["confirmPassword"],
  });

export const emailSettingsSchema = z.object({
  from: z.string().trim().max(200).optional().or(z.literal("")),
  host: z.string().trim().max(200).optional().or(z.literal("")),
  port: z.coerce.number().int().min(1).max(65535).optional(),
  user: z.string().trim().email("Enter the Gmail address that will send invites."),
  pass: z.string().trim().min(8, "Enter the Gmail app password.").max(200),
});

export const addStudentSchema = z.object({
  firstName: z.string().trim().min(1, "Enter the student first name.").max(80),
  lastName: z.string().trim().min(1, "Enter the student last name.").max(80),
  email: z.string().trim().email("Enter a real student email.").max(160),
  grade: z.enum(["9", "10", "11", "12"], { message: "Choose a grade level." }),
  chapterId: uuid.optional(),
});

export const normalRegisterSchema = z.object({
  eventId: z.string().min(3),
  profileIds: z.array(uuid).min(1).max(5),
  chapterId: uuid.optional(),
});

export const assignByNameSchema = z.object({
  chapterId: uuid,
  eventId: z.string().min(3),
  students: z
    .array(
      z.object({
        firstName: z.string().trim().min(1, "Enter each student first name."),
        lastName: z.string().trim().min(1, "Enter each student last name."),
      }),
    )
    .min(1, "Enter at least one student name.")
    .max(5, "A team may have at most five students."),
});

export const eventChoiceSchema = z.object({
  choices: z
    .array(
      z.object({
        eventId: z.string().min(3),
        intent: z.string().trim().max(800).optional().default(""),
      }),
    )
    .min(1, "Choose at least one event.")
    .max(9, "Choose at most six Normal Events and the three Legacy Events."),
});

export const reviewEventChoiceSchema = z.object({
  choiceId: uuid,
  decision: z.enum(["approve", "decline"]),
  teammates: z
    .array(
      z.object({
        firstName: z.string().trim().min(1, "Enter each teammate first name."),
        lastName: z.string().trim().min(1, "Enter each teammate last name."),
      }),
    )
    .max(4)
    .optional()
    .default([]),
});

export const legacyRosterSchema = z.object({
  groupA: z.array(uuid).max(4),
  groupB: z.array(uuid).max(4).optional().default([]),
  chapterId: uuid.optional(),
});

export const legacyEntrySchema = z.object({
  eventId: z.string().min(3),
  groupLabel: z.enum(["A", "B"]).optional().default("A"),
  chapterId: uuid.optional(),
});

export const legacyExceptionSchema = z.object({
  chapterId: uuid.optional(),
  profileOut: uuid,
  profileIn: uuid,
  reason: z.enum(["WITHDRAWAL_FROM_SCHOOL", "MEDICAL", "NATIONALLY_APPROVED"]),
  notes: z.string().max(400).optional(),
});

export const eventResultSchema = z.object({
  eventId: z.string().min(3),
  round: z.enum(["REGIONAL", "STATE", "NATIONAL"]),
  chapterId: uuid,
  placement: z.coerce.number().int().min(1).max(50).optional(),
  rawScore: z.coerce.number().min(0).max(1000).optional(),
  profileId: uuid.optional(),
  teamId: uuid.optional(),
  legacyEntryId: uuid.optional(),
  published: z.boolean().optional(),
});

export const publishRankingsSchema = z.object({
  publish: z.boolean().default(true),
});

export const nominateSchema = z.object({
  profileId: uuid,
  chapterId: uuid.optional(),
});

export const invitationalScoreSchema = z.object({
  profileId: uuid,
  chapterId: uuid,
  score: z.coerce.number().min(0).max(100),
});

export const publishInviteesSchema = z.object({
  profileIds: z.array(uuid).min(1),
});

export const seasonSettingsSchema = z.object({
  rosterLocked: z.boolean().optional(),
  invitationalNominationsOpen: z.boolean().optional(),
});

export const eventGuideSchema = z.object({
  eventId: z.string().min(3),
  kind: z.enum(["INSTRUCTIONS", "RUBRIC"]),
  title: z.string().trim().min(1).max(160),
  body: z.string().trim().min(1).max(20000),
  filePath: z.string().trim().max(400).optional(),
  published: z.boolean().optional(),
});

export const adminDeskSchema = z.object({
  message: z.string().trim().min(1).max(4000),
});

export const aiSettingsSchema = z.object({
  groqKey: z.string().trim().min(10).max(200).optional(),
});

export const createChapterIdeaSchema = z.object({
  title: z.string().trim().min(1, "Give the idea a title.").max(160),
  requestKind: z.enum(["EVENT", "ACTIVITY", "OTHER"]),
  body: z.string().trim().min(1, "Describe what you want the chapter to do.").max(4000),
  why: z.string().trim().max(2000).optional().default(""),
});

export const updatePrepItemSchema = z.object({
  itemId: uuid,
  notes: z.string().trim().max(4000).optional().default(""),
  status: z.enum(["NOT_STARTED", "IN_PROGRESS", "SUBMITTED", "DONE"]).optional(),
});

export const reviewIdeaSchema = z.object({
  ideaId: uuid,
  status: z.enum(["UNDER_REVIEW", "APPROVED", "IN_DEVELOPMENT", "COMPLETED"]),
  feedback: z.string().trim().max(2000).optional().default(""),
});

export const createAnnouncementSchema = z.object({
  title: z.string().min(1).max(160),
  body: z.string().min(1).max(8000),
  audienceType: z.enum(["all", "students", "advisors", "chapter", "competition_participants"]),
  priority: z.enum(["low", "normal", "high"]).default("normal"),
  status: z.enum(["draft", "published"]).default("published"),
});
