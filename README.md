# Premiumfangirls

Marketing website for **Premiumfangirls** — a Florida-based creator management & production company.

Static multi-page site (HTML / CSS / vanilla JS). Subpages are generated from a small Node template script; the home page is hand-authored.

## Develop
```bash
npm install
npm run dev        # serves /public at http://localhost:5173
```

## Build
```bash
npm run build:img            # process logo/photos into web assets (sharp)
node scripts/build-pages.js  # regenerate subpages (services, agencies, apply, etc.)
```

## Structure
- `public/` — the served site (index.html, styles.css, main.js, assets, generated subpages)
- `scripts/` — build scripts (image processing + page generator with shared nav/footer)
- `server.js` — dev static server (no-store caching, clean URLs)

## Notes
- Stream Hookups clips live in `public/assets/videos/`; add filenames to `STREAM_CLIPS` in `scripts/build-pages.js` and rebuild.
- Agencies book via Calendly; the creator application form is front-end only and needs a backend endpoint before launch.
