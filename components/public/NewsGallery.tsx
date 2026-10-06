"use client";

import { useEffect, useState } from "react";
import { chapterPhotos } from "@/lib/content/news";

export function NewsGallery() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % chapterPhotos.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, []);

  const photo = chapterPhotos[active];

  return (
    <div className="overflow-hidden rounded-[var(--radius)] bg-navy text-white">
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-[16/10]">
        {chapterPhotos.map((item, index) => (
          <img
            key={item.src}
            src={item.src}
            alt={item.alt}
            className={`news-photo absolute inset-0 h-full w-full object-cover ${
              index === active ? "news-photo--on" : "news-photo--off"
            }`}
          />
        ))}
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-navy/85 to-transparent p-5">
          <p className="kicker">From the chapter</p>
          <p className="tab-heading text-2xl text-white">{photo.caption}</p>
        </div>
      </div>
      <div className="grid gap-3 p-4 md:grid-cols-3">
        {chapterPhotos.map((item, index) => (
          <button
            key={item.src}
            type="button"
            onClick={() => setActive(index)}
            className={`overflow-hidden rounded-lg border ${
              index === active ? "border-gold" : "border-white/15"
            }`}
          >
            <img src={item.src} alt="" className="h-24 w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
