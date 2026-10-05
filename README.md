# TiroCare — presentation site

English-language marketing site for TiroCare (the app itself is Romanian and lives in a separate, private project).
Static HTML/CSS/JS, no build step, no third-party requests (Manrope is self-hosted).

- `index.html` — all content
- `styles.css` — design tokens mirror the app's palette (teal → cyan → blue)
- `main.js` — header, mobile menu, screen showcase tabs, pricing toggle, reveal on scroll
- `assets/img/screen-*.webp` — from the fictitious "Ana" demo profile (same as the case study)
- `assets/img/og.png` — 1200×630 social preview

Preview locally: `python -m http.server 5182` in this folder.

Before publishing: set `og:image` to an absolute URL once the domain is known.
Content rules: no lab names; never claim diagnosis, dose advice or automatic retest scheduling;
keep the "not a medical device" disclaimer.
