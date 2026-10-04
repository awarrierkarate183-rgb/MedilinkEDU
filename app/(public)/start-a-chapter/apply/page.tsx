import type { Metadata } from "next";
import { StartChapterForm } from "@/components/public/StartChapterForm";

export const metadata: Metadata = {
  title: "Chapter request",
  description: "Submit a MediLink high school chapter request and choose your portal password.",
};

export default function StartChapterApplyPage() {
  return <StartChapterForm />;
}
