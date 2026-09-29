"use server";

import { requireRole } from "@/lib/auth/session";
import { createClient } from "@/lib/supabase/server";
import { IDEA_CATEGORIES } from "@/lib/constants";

export async function createIdeaAction(formData: FormData) {
  const { user, profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const supabase = await createClient();
  if (!supabase || !profile?.chapter_id) {
    return { error: "Your student account is not attached to a chapter yet." };
  }
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Give the idea a title." };
  const category = String(formData.get("category") || "OTHER");
  if (!IDEA_CATEGORIES.includes(category as (typeof IDEA_CATEGORIES)[number])) {
    return { error: "Choose a valid category." };
  }
  const { error } = await supabase.from("ideas").insert({
    owner_id: user!.id,
    chapter_id: profile.chapter_id,
    title,
    problem: String(formData.get("problem") || ""),
    who_affected: String(formData.get("who") || ""),
    proposed_solution: String(formData.get("solution") || ""),
    why_it_matters: String(formData.get("why") || ""),
    technology_component: String(formData.get("technology") || ""),
    financial_component: String(formData.get("financial") || ""),
    healthcare_component: String(formData.get("healthcare") || ""),
    category,
    status: "DRAFT",
  });
  if (error) return { error: "The idea could not be saved." };
  return { ok: true };
}
