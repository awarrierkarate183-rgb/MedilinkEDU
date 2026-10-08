import type { Metadata } from "next";
import { ReactivateChapterForm } from "@/components/public/ReactivateChapterForm";

export const metadata: Metadata = {
  title: "Get a chapter portal",
  description: "Ask MediLink for a portal login if the school already has a chapter, or to bring a paused chapter back.",
};

export default function ReactivateChapterPage() {
  return <ReactivateChapterForm />;
}
