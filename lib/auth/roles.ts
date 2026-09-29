import type { AppRole } from "@/lib/constants";

export const ADVISOR_ROLES: AppRole[] = ["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"];
export const ADMIN_ROLES: AppRole[] = ["STATE_ADMIN", "SUPER_ADMIN"];
export const STUDENT_ROLES: AppRole[] = ["STUDENT", "CHAPTER_OFFICER"];

export function homeForRole(role?: string | null) {
  if (role === "SUPER_ADMIN" || role === "STATE_ADMIN") return "/portal/admin";
  if (role === "CHAPTER_ADVISOR") return "/portal/advisor";
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

export function canApproveMembers(actor: Actor) {
  return isAdvisorRole(actor.role);
}

export function canAwardPoints(actor: Actor) {
  return isAdvisorRole(actor.role);
}

export function canAccessAdminPortal(role?: string | null) {
  return role === "SUPER_ADMIN" || role === "STATE_ADMIN";
}

export function canAccessAdvisorPortal(role?: string | null) {
  return isAdvisorRole(role);
}

export function canAccessStudentPortal(role?: string | null) {
  return Boolean(role);
}
