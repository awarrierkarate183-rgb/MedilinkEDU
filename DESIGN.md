# MediLink visual plan

Navy, gold, and white. This replaces the earlier teal / clinical-blue palette. Do not mix the two systems.

Public slogan stays on the homepage hero. Internal method name (curriculum and cases only): Care, Cost, Code. Full framework explanation lives on `about.html` only, as a clickable lens widget.

---

## Color

| Token | Hex | Why it exists |
|---|---|---|
| **Navy** | `#0B1F3A` | Deep, muted navy. Header, footer, primary text. Distinct from bright competition-club royal blue. |
| **Gold** | `#C9A227` | Muted antique gold. Primary buttons, Nationals and Apex cards, Submit News. Rationed. |
| **White** | `#FFFFFF` | Primary background. |
| **Paper** | `#F3F4F6` | Pale gray section ground so pages have depth without extra color. |

**Contrast:**
- Gold background always uses navy text. White on gold fails.
- Navy background uses white text. Gold text on navy is for small accents (Submit News, hover).
- Gold text on white fails for body copy. Do not use it.

---

## Type

- **Newsreader** for headlines.
- **Atkinson Hyperlegible** for body, nav, and UI.

Scale: `--fs-hero`, `--fs-section`, `--fs-body`, `--fs-label`. Use those instead of one-off sizes.

---

## Motion

Hero fades up on load. Section headlines use `.reveal`. Competition and lens widgets open in place. Do not animate every element.

---

## Navigation

One navy bar. Flat links: Home, About, Competitions, Chapters, Get Involved, Contact. Submit News is a gold action in the same bar. No dropdown menus.
