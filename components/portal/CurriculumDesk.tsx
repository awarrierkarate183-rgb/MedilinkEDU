import { attachedCurriculumFiles, tracks } from "@/lib/content/curriculum";

function fileLabel(kind: "slideshow" | "task") {
  return kind === "slideshow" ? "Open slideshow" : "Open task";
}

export function CurriculumDesk({ audience }: { audience: "advisor" | "student" }) {
  const ready = attachedCurriculumFiles();

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <p className="kicker">Starting files</p>
        <h2 className="text-xl font-semibold">Track 1. Module 1.1</h2>
        <p className="mt-2 max-w-2xl text-sm text-muted">
          {audience === "advisor"
            ? "These are the first lesson files. Open them with your chapter. Other modules stay listed until more files are uploaded."
            : "These are the first lesson files you can open. Other modules stay listed until more files are uploaded."}
        </p>
        <ul className="mt-5 space-y-3">
          {ready.map((file) => (
            <li
              key={file.id}
              className="flex flex-wrap items-center justify-between gap-3 border-t border-border pt-3 first:border-t-0 first:pt-0"
            >
              <div>
                <p className="font-semibold">{file.title}</p>
                <p className="text-sm text-muted">
                  {file.moduleCode} {file.moduleName}
                </p>
              </div>
              <a
                href={file.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center rounded-md bg-gold px-3.5 py-2 text-xs font-semibold text-navy hover:bg-gold-hover"
              >
                {fileLabel(file.kind)}
              </a>
            </li>
          ))}
        </ul>
      </section>

      {tracks.map((track) => (
        <article key={track.id} className="rounded-[var(--radius)] bg-white p-5">
          <p className="kicker">Track {track.number}</p>
          <h2 className="font-semibold">{track.name}</h2>
          <ul className="mt-4 space-y-4">
            {track.modules.map((mod) => (
              <li key={mod.code} className="border-t border-border pt-4 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold">
                      {mod.code} {mod.name}
                    </p>
                    <p className="mt-1 max-w-2xl text-sm text-muted">{mod.description}</p>
                  </div>
                  {audience === "student" && !mod.files?.length ? (
                    <span className="text-sm text-muted">Not started</span>
                  ) : null}
                </div>
                {mod.files?.length ? (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {mod.files.map((file) => (
                      <a
                        key={file.id}
                        href={file.href}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center rounded-md border border-navy px-3.5 py-2 text-xs font-semibold text-navy hover:bg-surface"
                      >
                        {file.title}
                      </a>
                    ))}
                  </div>
                ) : (
                  <p className="mt-2 text-sm text-muted">Lesson files are not attached yet.</p>
                )}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}
