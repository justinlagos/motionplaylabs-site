# motionplaylabs.com

The MotionPlay Labs website. The homepage is a scroll-driven film in eleven beats; every other page opens on a looping scene. Built from the company playbook (sections 14 to 18).

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # production build
npm run export:preview   # static copy in out/ for preview hosting (no contact API)
```

## Deploy

1. Import this repo into the **MotionPlay Labs** team on Vercel (framework: Next.js, no settings to change).
2. Add environment variables from `.env.example`: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
3. Add the domains `motionplaylabs.com` and `www.motionplaylabs.com` to the project. Keep `workshop.motionplaylabs.com` on its own project.
4. Every pull request gets a preview link. Merging to `main` publishes.

## Where things live

| What | File |
| --- | --- |
| The film: beats, words, which shot plays where | `src/content/film.ts` |
| The five method chapters | `src/content/method.ts` |
| Products | `src/content/products.ts` |
| Case studies | `src/content/work.ts` |
| Company details, nav, page scenes | `src/content/site.ts` |
| Legal pages (drafts) | `src/content/legal.ts` |
| Placeholder footage (WebGL scenes) | `src/lib/gl/shaders.ts` |
| Scroll engine | `src/components/Film.tsx` |
| Styles and tokens | `src/app/globals.css` |
| Contact form email | `src/app/api/contact/route.ts` |

## Swapping placeholder scenes for real footage

Every shot in the shot list is drawn live in WebGL until the shoot. To replace one:

1. Put the graded master in `media/masters/` (ignored by git).
2. Run `scripts/encode-video.sh media/masters/H1.mov H1` (add a portrait master as a third argument if you shot one). It writes AV1 and H.264 files, posters and an index loop to `public/media/H1/` and prints their sizes against the budget.
3. In `src/content/film.ts`, change that beat's media from `scene("ink")` to:

```ts
{
  kind: "video",
  scene: "ink", // stays as the fallback while the video loads
  poster: "/media/H1/H1-poster.jpg",
  src: { av1: "/media/H1/H1-1080.av1.mp4", h264: "/media/H1/H1-1080.h264.mp4" },
  portrait: { av1: "/media/H1/H1-v.av1.mp4", h264: "/media/H1/H1-v.h264.mp4", poster: "/media/H1/H1-poster.jpg" },
}
```

Only the current and next clip load. Video pauses with the Pause motion button and for reduced-motion users. For production, move `public/media` to Cloudflare R2 behind `media.motionplaylabs.com` and use those URLs.

## Waiting on decisions (playbook section 21)

| Decision | In the code |
| --- | --- |
| D5 prices | `src/app/studio/page.tsx` shows the proposed price book |
| D6 client case studies | `src/content/work.ts` has our own products only |
| D8 type and accent | Marcellus and Instrument Sans are free stand-ins; accent is process cyan `#00a0e3` in `globals.css` |
| D9 hero line | `src/content/film.ts`, beat `hero` |
| D4 Nigerian company details | `src/content/site.ts`, `ngCompany` |
| Mark | `src/components/Mark.tsx` and `markPt()` in `shaders.ts` share one path; replace both after the brand sprint |
| Legal text | `src/content/legal.ts` drafts need a solicitor's review |

## Rules the site follows

- No fake proof: no invented testimonials, numbers, logos or people.
- Every word in the film is real HTML text, in reading order.
- Moving footage can always be paused, and starts paused for reduced-motion users.
- No cookies. The pause choice is kept in local storage only.
