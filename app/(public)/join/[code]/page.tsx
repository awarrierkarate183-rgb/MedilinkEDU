import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink } from "@/components/ui/Button";
import { getStateListings } from "@/lib/content/chapters";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

type Props = { params: Promise<{ code: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { code } = await params;
  return {
    title: "Join a chapter",
    description: `Join a MediLink chapter using code ${code}.`,
    robots: { index: false, follow: false },
  };
}

export default async function JoinPage({ params }: Props) {
  const { code } = await params;
  const listings = getStateListings();
  const school = listings
    .flatMap((state) => (state.chapters || []).map((chapter) => ({ ...chapter, stateName: state.name })))
    .find((chapter) => chapter.id === code);
  let chapterName = school?.name;
  let schoolName = school?.name;

  if (isSupabaseConfigured()) {
    const supabase = await createClient();
    if (supabase) {
      const { data } = await supabase
        .from("chapters")
        .select("name, school, join_code, public_visibility")
        .eq("join_code", code)
        .eq("public_visibility", true)
        .maybeSingle();
      if (data) {
        chapterName = data.name;
        schoolName = data.school;
      }
    }
  }

  if (!chapterName && !schoolName) {
    notFound();
  }

  return (
    <section className="band">
      <div className="container-ml max-w-2xl pt-16">
        <p className="kicker">Welcome to MediLink</p>
        <h1 className="display">You are joining the MediLink chapter at {schoolName || chapterName}.</h1>
        <p className="mt-5 text-muted">
          This page is tied to that school. It does not contain login secrets.
          After you continue, an advisor still has to invite or approve you.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={`/portal/login?chapter=${encodeURIComponent(code)}`}>
            Join this chapter
          </ButtonLink>
          <ButtonLink href="/chapters" variant="outline">
            Find another chapter
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
