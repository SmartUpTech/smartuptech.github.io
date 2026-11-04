# Play Store listing documents (SmartUp Tech)

Paste-ready **App title**, **Short description**, and **Full description (HTML)** for Google Play Console, plus screenshot order guidance. These docs support ASO for:

- [Anant Panchang](anant-panchang.md)
- [Today](today.md)
- [Citizen Calculator Plus](citizen-calculator-plus.md) (website: **Citizen Calculator**)

Portfolio comparison: [peer-comparison.md](peer-comparison.md)

---

## How to apply in Google Play Console

1. Open [Google Play Console](https://play.google.com/console) → select the app.
2. Go to **Grow** → **Store presence** → **Main store listing** (or **Store settings** → **Main store listing**, depending on Console layout).
3. Update fields:
   - **App name** — 30 character maximum (same as “App title” in these docs).
   - **Short description** — 80 character maximum.
   - **Full description** — 4,000 character maximum; paste HTML from the fenced block in each app doc.
4. For **Phone screenshots**, upload assets from `public/screenshots/<app>/` in the order listed in each doc. Add optional captions in Console if your listing uses graphic overlays.
5. Save and submit the listing for review if Console prompts you (some changes publish without a full app release).

**Allowed HTML in full description:** `<b>`, `<br>`, `<ul>`, `<li>` only. Do not paste `<p>`, `<div>`, or links with custom styling unless Console accepts them (plain URLs on their own line are fine).

---

## Character limits checklist

Before publishing, verify counts in Console’s counter (or run locally):

| Field | Limit | Verified in docs |
|-------|------:|------------------|
| App name | 30 | Each app doc lists count |
| Short description | 80 | Each app doc lists count |
| Full description | 4,000 | Each HTML block noted as within limit |
| Promotional text (optional) | 170 | Provided only for Today and Citizen where useful |

---

## Calendar year rollover

Apps that include the calendar year in the **short description** or **long description**:

- **Anant Panchang** — Replace `2027` with the new year in short description and in long description sections (see [anant-panchang.md](anant-panchang.md) rollover section).
- **Today** — If you use `Today: International Days 2027` as the app name, bump the year in the title when you align with Panchang marketing (max 30 characters).

Suggested annual task: each Q4 or when publishing the next year’s calendar content, search these docs and Console for the old year string.

---

## Screenshot source paths (repository)

| App | Folder |
|-----|--------|
| Anant Panchang | [`public/screenshots/panchang/`](../../public/screenshots/panchang/) |
| Today | [`public/screenshots/today/`](../../public/screenshots/today/) |
| Citizen Calculator Plus | [`public/screenshots/citizen-calculator/`](../../public/screenshots/citizen-calculator/) |

Use WebP files as uploaded to Play, or export PNG/JPEG if Console requires a specific format for a given slot.

---

## After you publish

1. Open the public Play URL for each app in an incognito window and confirm title, short description, and the first lines of the full description.
2. Allow up to 24–48 hours for Play to refresh cached listing text in some regions.
3. Optional: align website copy in [`src/data/apps.ts`](../../src/data/apps.ts) with finalized Play strings for SEO parity (not required for Play ASO itself).

---

## What these docs deliberately omit

- **Graphy Calculator** Play listing still uses the legacy **Unit & Currency Converter** title — a separate rebrand/ASO project.
- Product fixes (crashes, ratings, ad frequency) — called out in peer comparison where they affect conversion, but not solved by listing text alone.
