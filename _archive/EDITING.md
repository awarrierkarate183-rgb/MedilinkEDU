# MediLink Website — Editing Guide

This site is built with plain HTML, CSS, and JavaScript. **No coding experience required** for most updates — you edit simple data files and redeploy.

---

## Files you will edit most often

| File | What it controls |
|---|---|
| `data/chapters.json` | State chapters, school chapters, contact info, map locations |
| `data/sponsor-tiers.json` | Corporate sponsorship tier names, amounts, and benefits |
| `data/forms.config.js` | Google Form links for volunteer, start chapter, etc. |
| `partials/header.html` | Top navigation (edit once, updates every page) |
| `partials/footer.html` | Footer links (edit once, updates every page) |

---

## Adding or editing chapters

Open **`data/chapters.json`**.

Each **state** looks like this:

```json
{
  "id": "north-carolina",
  "name": "North Carolina",
  "location": "Charlotte, NC",
  "address": "Optional full address",
  "email": "state@example.com",
  "phone": "(704) 555-0100",
  "lat": 35.2271,
  "lng": -80.8431,
  "chapters": []
}
```

Each **school chapter** inside `"chapters"`:

```json
{
  "id": "my-high-school",
  "name": "My High School Chapter",
  "location": "City, NC",
  "address": "123 School Rd",
  "email": "chapter@example.com",
  "phone": "(704) 555-0101",
  "lat": 35.25,
  "lng": -80.85
}
```

### Rules (important)

- Every `"id"` must be **unique**, lowercase, use hyphens only (e.g. `north-carolina`)
- `"lat"` and `"lng"` must be **numbers** (not in quotes) for map pins to work
- To get coordinates: open Google Maps → right-click a location → copy the numbers
- Keep commas between items; the last item in a list has **no comma after it**
- Validate JSON at [jsonlint.com](https://jsonlint.com) if something breaks

---

## Editing corporate sponsorship tiers

Open **`data/sponsor-tiers.json`**.

Change `"name"`, `"amount"`, `"description"`, or `"benefits"` for any tier. Set `"highlight": true` on one tier to feature it visually on the corporate sponsorship page.

---

## Adding Google Form links

Open **`data/forms.config.js`**.

Replace each `PASTE_YOUR_FORM_URL` with your real Google Form URL:

```javascript
window.MEDILINK_FORMS = {
  volunteer: "https://docs.google.com/forms/d/e/.../viewform",
  startChapter: "https://docs.google.com/forms/d/e/.../viewform",
  // ...
};
```

**Do not change** the keys on the left (`volunteer`, `startChapter`, etc.) — only the URLs.

Pages that **keep email** (not forms): Individual Sponsorship, Corporate Sponsorship, and Contact Us.

---

## Editing navigation or footer

- **Header:** `partials/header.html`
- **Footer:** `partials/footer.html`

After saving, push to GitHub (or redeploy on Vercel) to see changes on the live site.

---

## Deploy to Vercel

1. Push this project to a GitHub repository
2. Go to [vercel.com](https://vercel.com) → **Add New Project** → import the repo
3. Framework preset: **Other** (static site)
4. Build command: leave empty
5. Output directory: leave as root (`.`)
6. Deploy

After editing `chapters.json`, `sponsor-tiers.json`, or `forms.config.js`, commit and push — Vercel redeploys automatically.

### Old URLs

These redirect automatically (configured in `vercel.json`):

- `/donate.html` → Individual Sponsorship page
- `/programs.html`, `/podcast.html`, etc. → Home page

---

## Local preview

Because the site loads header/footer via JavaScript `fetch`, open it with a local server (not by double-clicking HTML files):

```bash
cd "/Users/Rudra/MediLink Website"
python3 -m http.server 8080
```

Then visit `http://localhost:8080`

---

## Need help?

If a page looks broken after editing JSON, check for:

- Missing or extra commas
- Quotes around numbers for `lat` / `lng`
- Duplicate `"id"` values

Use [jsonlint.com](https://jsonlint.com) to validate `chapters.json` and `sponsor-tiers.json`.
