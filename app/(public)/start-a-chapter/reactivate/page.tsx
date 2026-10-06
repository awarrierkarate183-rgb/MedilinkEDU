import type { Metadata } from "next";
import { ReactivateChapterForm } from "@/components/public/ReactivateChapterForm";

export const metadata: Metadata = {
  title: "Reactivate a chapter",
  description: "Ask MediLink to bring back an inactive high school chapter and choose a portal password.",
};

export default function ReactivateChapterPage() {
  return <ReactivateChapterForm />;
}
