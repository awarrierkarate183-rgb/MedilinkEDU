import type { Metadata } from "next";
import { StartChapterForm } from "@/components/public/StartChapterForm";

export const metadata: Metadata = {
  title: "Chapter request",
  description: "The student chapter lead submits a MediLink high school chapter request and chooses a portal password.",
};

export default function StartChapterApplyPage() {
  return <StartChapterForm />;
}
