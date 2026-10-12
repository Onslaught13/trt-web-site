# The Rescue Tribe — Hero

Static one-page hero for The Rescue Tribe. No build step.

- `index.html` — page
- `assets/hero.css`, `assets/tokens.css` — styles (tokens follow `DESIGN.md`)
- `assets/hero.js` — GSAP animation, typed headline, video hand-off
- `assets/video/hero.mp4` — opening film (plays once)
- `assets/video/hero-loop.mp4` — locked-camera loop (generated in Higgsfield)
- `assets/js/` — GSAP, ScrollTrigger, SplitText
- `DESIGN.md` — design system

## Run locally
```bash
python3 -m http.server 4173
```
Open http://localhost:4173

## Deploy
Netlify: publish directory `.`, no build command.
