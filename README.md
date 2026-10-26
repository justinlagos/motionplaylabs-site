# motionplaylabs.com

The MotionPlay Labs website. The homepage is a scroll film in eleven beats, each on a macro clip, alternating light and dark. Each hand-over is named for what a camera does: going into a dark clip, the next picture opens out of the dot in the header logo (lens); coming back to light, the dark clip overexposes into the next (exposure); between clips of the same tone, the focus pulls. The circle badge draws itself in on the title and comes back, turning, beside the closing line. The chapter numerals are drawn with the logo's stroke and draw in as each chapter opens. Every other page opens on a clip; Studio and Work end on a dark clip with the next step.

Design: Swiss grid, black and white only, one typeface (Mona Sans) in two widths. Colour is held back in the footage too, except for the Design chapter's pigment, the one colour moment.

## Run it

```bash
npm install
npm run dev              # http://localhost:3000
npm run build            # production build
npm run preview:site     # static, self-contained copy in preview-site/ (no contact API)
```

## Deploy

1. Import this repo into the **MotionPlay Labs** team on Vercel (framework: Next.js, no settings to change).
2. Add environment variables from `.env.example`: `RESEND_API_KEY`, `CONTACT_TO`, `CONTACT_FROM`.
3. Add the domains `motionplaylabs.com` and `www.motionplaylabs.com` to the project. Keep `workshop.motionplaylabs.com` on its own project.
4. Every pull request gets a preview link. Merging to `main` publishes.

## Where things live

| What | File |
| --- | --- |
| Footage library: captions, tone, credits | `src/content/footage.ts` |
| The film: beats, words, which clip plays where | `src/content/film.ts` |
| The five method chapters | `src/content/method.ts` |
| Products | `src/content/products.ts` |
| Case studies | `src/content/work.ts` |
| Company details, nav, page clips | `src/content/site.ts` |
| Legal pages (drafts) and credits | `src/content/legal.ts` |
| Logos (generated from the logo files) | `src/components/logo-art.ts`, `src/components/Logo.tsx` |
| Scroll engine | `src/lib/film-engine.ts` |
| Header tone and clip playback | `src/lib/chrome-tone.ts`, `src/lib/clip-playback.ts` |
| Styles and tokens | `src/app/globals.css` |
| Contact form email | `src/app/api/contact/route.ts` |

## Footage

The clips are real macro footage from free-licence libraries (Mixkit, Pexels), listed with links on `/legal/credits/`. They stand in until we shoot our own. To swap one:

1. Put the source in `media/sources/` (ignored by git).
2. Run `scripts/encode-video.sh media/sources/new.mp4 ink 2 9 50`: source, clip id, start second, loop length, horizontal focus for the phone crop. It writes a seamless loop (the last second dissolves into the first) as AV1 and H.264 at 1080p, a 720x1280 phone crop, a 640x360 thumbnail loop and posters to `public/media/ink/`.
3. Update the caption, tone and credit for that id in `src/content/footage.ts`.

Only the current and next two clips load. Video pauses with the Pause motion button and starts paused for reduced-motion users. To serve media from a CDN, upload `public/media` and set `NEXT_PUBLIC_MEDIA_ROOT` to its URL.

## Waiting on decisions (playbook section 21)

| Decision | In the code |
| --- | --- |
| D5 prices | `src/app/studio/page.tsx` shows the proposed price book |
| D6 client case studies | `src/content/work.ts` has our own products only |
| D9 hero line | `src/content/film.ts`, beat `hero` |
| D4 Nigerian company details | `src/content/site.ts`, `ngCompany` |
| Own footage | `src/content/footage.ts`, one clip at a time |
| Legal text | `src/content/legal.ts` drafts need a solicitor's review |

## Rules the site follows

- No fake proof: no invented testimonials, numbers, logos or people.
- Every word in the film is real HTML text, in reading order.
- Moving footage can always be paused, and starts paused for reduced-motion users.
- No cookies. The pause choice is kept in local storage only.
