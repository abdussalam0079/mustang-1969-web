# Mustang Reveal — Ducati-style cinematic microsite

## What this is
A Next.js 14 + Tailwind + GSAP single-page site built in the same structure as the
Ducati Superleggera V4 Centenario site: fixed nav, a scroll-scrubbed hero (your real
Mustang footage — scrolling seeks through the video instead of playing it linearly),
a stats bar, five full-bleed story sections using your real Mustang photos, and a
closing CTA.

## Your assets, and how they were used
- `public/frames/f_001.jpg` ... `f_090.jpg` — 90 frames extracted directly from your
  "Video Project.mp4" at evenly-spaced intervals, used for the scroll-scrubbed hero.
  **Fix from the first version:** the hero originally seeked your raw .mp4 by
  `currentTime`, but that video only had 3 real keyframes across ~390 frames, so the
  browser had to decode backwards from a keyframe on every scroll tick — that's what
  caused the stutter you saw. Pre-extracting frames to images and drawing them on a
  `<canvas>` (the technique the Ducati site itself actually uses) removes video
  decoding from the scroll path entirely, so it's instant at any scroll speed now.
- `public/images/frame_00X.jpg` — 7 of your original 13 PNG frames, compressed to
  web-ready JPGs, used as the background images for the 5 story sections + closing CTA.
- `public/images/loading.jpg` — shown behind a loading percentage while the 90 frames
  preload on first visit.
- NOT used: `mustang.glb` (this was a placeholder text file, not a real 3D model),
  `index.html`/`home.html` (unrelated placeholder scaffold), `helpers.js` (empty stub).

## Run it
```
npm install
npm run dev
```
Open http://localhost:3000

## Deploy it
Push to GitHub, then import into Vercel (or run `npm run build && npm run start`
on any Node host). No environment variables needed.

## To customize
- Real specs: edit the `stats` array in `components/Stats.tsx`
- Copy/section order: edit `app/page.tsx`
- Colors/typography: edit `tailwind.config.ts` and `app/globals.css`
- Swap in more/better photos: drop them in `public/images/` and reference in `app/page.tsx`
