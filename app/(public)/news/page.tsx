import type { Metadata } from "next";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { NewsGallery } from "@/components/public/NewsGallery";
import { PhotoCallout } from "@/components/public/PhotoCallout";
import { chapterPhotos } from "@/lib/content/news";
import { actionHref, CONTACT_EMAIL } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "News",
  description: "Photos and chapter news from MediLink. Send pictures of work that actually happened.",
  robots: { index: true, follow: true },
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        kicker="News"
        title="Chapter photos. Real meetings. Send yours."
        lead="These pictures came from an accepted chapter. This page does not invent school names or fake news. Open a section below for how to send photos and what can be published."
      />
      <PhotoCallout />
      <section className="band">
        <div className="container-ml space-y-10">
          <NewsGallery />
          <Accordion
            defaultOpen="photos"
            items={[
              {
                id: "photos",
                subtitle: "Published photos",
                title: "Lake Norman Charter High School",
                children: (
                  <div className="space-y-4">
                    <p>
                      These three photographs are from the Lake Norman Charter
                      High School MediLink chapter in Huntersville, North
                      Carolina. They show a welcome slide, table conversation,
                      and members reading printed materials. Student names are
                      not listed here.
                    </p>
                    <ul className="space-y-2">
                      {chapterPhotos.map((photo) => (
                        <li key={photo.src}>{photo.caption}</li>
                      ))}
                    </ul>
                  </div>
                ),
              },
              {
                id: "send-photos",
                subtitle: "What we want",
                title: "Send pictures from your chapter",
                children: (
                  <div className="space-y-3">
                    <p>
                      Photos are the fastest way for another school to see what
                      a MediLink meeting looks like. Send classroom work,
                      service, competition prep, or a launch night that
                      happened.
                    </p>
                    <p>
                      Write a caption with the school name, city, and what the
                      photo shows. Ask every person in the frame before you
                      send it.
                    </p>
                    <p>
                      <a className="font-semibold underline" href={actionHref("submitNews", "Submit News Chapter Photos")}>
                        Open the photo form
                      </a>
                      {" "}or email {CONTACT_EMAIL}.
                    </p>
                  </div>
                ),
              },
              {
                id: "review",
                subtitle: "How publishing works",
                title: "Leadership reviews every submission",
                children: (
                  <div className="space-y-3">
                    <p>
                      A form or email is a request, not an automatic post.
                      MediLink checks that the school is real, the event
                      happened, and the caption does not invent a win.
                    </p>
                    <p>
                      Accepted photos can appear on this News page, on the
                      homepage strip, or in a later gathering recap. Denied
                      photos stay off the site.
                    </p>
                  </div>
                ),
              },
              {
                id: "what-to-send",
                subtitle: "What to include",
                title: "Chapter news we can actually run",
                children: (
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Chapter meetings and officer work.</li>
                    <li>Service or outreach the chapter completed.</li>
                    <li>Competition prep or conference days after they happen.</li>
                    <li>Research or project updates with a real school name.</li>
                    <li>A short written note if you do not have a photo yet.</li>
                  </ul>
                ),
              },
              {
                id: "boundaries",
                subtitle: "What stays off this page",
                title: "We will not invent news",
                children: (
                  <ul className="list-disc space-y-2 pl-5">
                    <li>No made-up school names or fake placements.</li>
                    <li>No student emails, phone numbers, grades, or login codes.</li>
                    <li>No photos of people who did not agree to be shown.</li>
                    <li>No medical advice or claims that members treated patients.</li>
                  </ul>
                ),
              },
              {
                id: "after-send",
                subtitle: "After you send",
                title: "What happens next",
                children: (
                  <div className="space-y-3">
                    <p>
                      Keep a copy of the files you sent. If MediLink needs a
                      clearer caption or a parent or advisor confirmation, we
                      will write back to the address you used.
                    </p>
                    <p>
                      Until more chapters send photos, this page stays small on
                      purpose. One honest album is better than a feed of
                      invented highlights.
                    </p>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
