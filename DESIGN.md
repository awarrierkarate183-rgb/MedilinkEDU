# MediLink visual plan

Approved Phase 1, built in Phase 2, then locked as **Option B** in the finalized content plan: blue / white / gold, but not generic DECA navy. Ink is a deep ink-adjacent blue. Drape is a clinical blue. Gala is rationed the same way as Phase 1.

Public slogan: “Where medicine, money, and code finally meet.”
Internal method name (curriculum + cases only): Care, Cost, Code.
Full framework explanation lives on `about.html` only.

---

## Color

Six tokens. Named for what they come from, not “Primary / Accent.”

| Token | Hex | Why it exists |
|---|---|---|
| **Ink** | `#152A38` | Deep blue-ink. Text, hero field, footer. Clinical-and-financial without royal club-navy. |
| **Drape** | `#1B5470` | Clinical blue. Util bar, links, structural chrome. |
| **Gala** | `#C8961A` | Awards gold. Nationals rule + primary buttons only. |
| **Ledger** | `#3E4A52` | Secondary text. Fiscal, quiet, readable. |
| **Lab** | `#F4F7F9` | Cool paper ground. Not warm cream. |
| **White** | `#FFFFFF` | Cards and surfaces that lift off Lab. |

**Contrast (measured — do not ignore):**
- Gala + **white text fails** (~2.7:1). Never put white on a Gala button or Gala text on white for body copy.
- Gala + **Ink text passes** (~5.2:1). Primary buttons, Join CTA, and mega-banner CTAs = Gala background + Ink text.
- White on Drape (~6.2:1) and White on Ink are safe.

Rules:
- Do not rebuild a royal-blue gradient hero.
- Do not use terracotta, sand, or cream. Do not use near-black + electric cyan.
- Gala stays decorative/button-only. The one distinctive visual is a thin Gala rule on Nationals (homepage feature, hub feature, Nationals page hero). Do not copy that rule onto other sections.

---

## Type

- **Newsreader** — headlines. Case-brief / policy-title feel.
- **Atkinson Hyperlegible** — body, UI, nav. Accessibility-first; sponsors, parents, and judges will all be reading this.

Do not bring back Outfit + Inter.

---

## Layout

Homepage is four sections: a loud opening, one explanation of the framework, an asymmetric competition spread, then a short close.

```
+----------------------------------------------------------+
|  thin utility  [Submit News]              [Sponsor]      |
|  MediLink          nav                    [Join]         |
+----------------------------------------------------------+
|  HERO  (Ink field)                                       |
|  One sentence. Two actions. No pills. No tricolon.       |
+----------------------------------------------------------+
|  FRAMEWORK  (stacked legend, not 3 icon tiles)           |
|  + quiet link to curriculum.html                         |
+----------------------------------------------------------+
|  COMPETITIONS  (Nationals featured + list)               |
|  + quiet link to competition.html#ladder                 |
+----------------------------------------------------------+
|  CLOSE  Start a chapter  |  Get involved                 |
+----------------------------------------------------------+
|  footer                                                  |
+----------------------------------------------------------+
```

Off the homepage (content still on their own pages): cluster pills, program panels, curriculum band, four Get Involved tiles, news placeholders. Nav and in-page links still find those pages so a first-time visitor does not need to already know the filenames.

---

## Principles

MediLink should look like students who write case briefs and then put on a gala — not like a career-club franchise and not like a hospital foundation. Charlotte stays in the footer and contact, not as a skyline illustration. Care / Cost / Code is a legend you read twice (home + About), not a slogan reprinted on every section.

---

## Self-review (kept from Phase 1)

Question: does any of this sound like what any AI would produce for “a clean nonprofit / student org website”?

**Rejected first draft, and why:**
1. *“Keep navy + gold, add teal.”* That is the old site with a third swatch. Changed: Ink/Drape blue, Gala rationed.
2. *“Outfit / Inter, 4 equal Get Involved tiles, pill row under the hero.”* Template. Changed: new type; pills and the four-tile grid left the homepage.
3. *“Three icon cards for Care / Cost / Code.”* Generic pillars. Changed: stacked legend.
4. *“Warm paper + terracotta” and “black + neon”* — banned. Not used.
5. *Skyline / heartbeat / stethoscope decoration on every section.* Forced motif. Changed: one Gala rule on Nationals only.
