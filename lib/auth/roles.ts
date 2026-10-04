import type { AppRole } from "@/lib/constants";

export const ADVISOR_ROLES: AppRole[] = ["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"];
export const ADMIN_ROLES: AppRole[] = ["STATE_ADMIN", "SUPER_ADMIN"];
export const STUDENT_ROLES: AppRole[] = ["STUDENT", "CHAPTER_OFFICER"];

export function isPendingAdvisor(profile?: {
  role?: string | null;
  status?: string | null;
  advisor_status?: string | null;
} | null) {
  if (profile?.role !== "CHAPTER_ADVISOR") return false;
  if (profile.status === "PENDING" || profile.status === "INACTIVE" || profile.status === "REMOVED") {
    return true;
  }
  if (
    profile.advisor_status === "PENDING" ||
    profile.advisor_status === "SUSPENDED" ||
    profile.advisor_status === "INACTIVE"
  ) {
    return true;
  }
  return false;
}

export function homeForRole(
  role?: string | null,
  profile?: { status?: string | null; advisor_status?: string | null } | null,
) {
  if (role === "SUPER_ADMIN" || role === "STATE_ADMIN") return "/portal/admin";
  if (role === "STUDENT" && profile?.status === "PENDING") return "/portal/complete-invite";
  if (role === "CHAPTER_ADVISOR") {
    if (isPendingAdvisor({ role, status: profile?.status, advisor_status: profile?.advisor_status })) {
      return "/portal/pending";
    }
    return "/portal/advisor";
  }
  return "/portal/student";
}

export function isAdvisorRole(role?: string | null): role is AppRole {
  return ADVISOR_ROLES.includes(role as AppRole);
}

export function isAdminRole(role?: string | null): role is AppRole {
  return ADMIN_ROLES.includes(role as AppRole);
}

export type Actor = {
  id: string;
  role: AppRole;
  chapterId: string | null;
  stateScope?: string | null;
  status?: string | null;
  advisorStatus?: string | null;
};

export function canReadProfile(actor: Actor, target: { id: string; chapterId: string | null }) {
  if (actor.id === target.id) return true;
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role === "CHAPTER_ADVISOR" && actor.chapterId && actor.chapterId === target.chapterId) {
    return true;
  }
  return false;
}

export function canManageChapter(
  actor: Actor,
  chapter: { id: string; state?: string | null; advisorId?: string | null },
) {
  if (actor.role === "SUPER_ADMIN") return true;
  if (actor.role === "STATE_ADMIN" && actor.stateScope && chapter.state === actor.stateScope) {
    return true;
  }
  if (actor.role === "CHAPTER_ADVISOR") {
    return actor.chapterId === chapter.id || chapter.advisorId === actor.id;
  }
  return false;
}

export function canApproveMembers(actor: Actor & { status?: string | null; advisorStatus?: string | null }) {
  if (actor.role === "CHAPTER_ADVISOR") {
    if (actor.status === "PENDING" || actor.status === "INACTIVE" || actor.status === "REMOVED") {
      return false;
    }
    if (actor.advisorStatus === "PENDING" || actor.advisorStatus === "SUSPENDED" || actor.advisorStatus === "INACTIVE") {
      return false;
    }
  }
  return isAdvisorRole(actor.role);
}

export function canAwardPoints(actor: Actor) {
  return isAdvisorRole(actor.role);
}

export function canManageEmailSettings(actor: Actor) {
  return isAdvisorRole(actor.role);
}

export function canAccessAdminPortal(role?: string | null) {
  return role === "SUPER_ADMIN" || role === "STATE_ADMIN";
}

export function canAccessAdvisorPortal(role?: string | null) {
  return isAdvisorRole(role);
}

export function canAccessStudentPortal(role?: string | null) {
  return role === "STUDENT" || role === "CHAPTER_OFFICER";
}

export function portalMatchesLogin(
  role: string | null | undefined,
  portal?: string | null,
) {
  if (portal === "student") return canAccessStudentPortal(role);
  if (portal === "advisor") return canAccessAdvisorPortal(role);
  return true;
}
