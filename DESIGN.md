# The Rescue Tribe — Design System
> Derived from the Agility Digit 5 reference. A rescue crew at dusk: warm-white technical documentation emerging from a near-black working bay. Calm, exact, almost colorless — the footage and the type carry the emotion.

**Theme:** light canvas, dark cinematic hero · **Voice:** quiet, precise, human. Short declaratives. Sentence case. No exclamation marks.

## Principles
1. **Colour is absent on purpose.** The neutral palette runs `#f0eeeb → #000000`. The only "signal" is the live-status dot (Signal Amber), used once per view.
2. **Type is the hero.** Light-weight (400) display type, tightly tracked, set large. Never bold for display.
3. **Equipment markings.** All labels, eyebrows and buttons are uppercase mono 700 / 12px — like stencilling on a rescue kit.
4. **Geometry over shadow.** 12px clipped corners, hairline strokes, translucency. No drop shadows on surfaces.
5. **Motion is calm.** Slow eases (`power3.out`, 1–1.4s), staggered line reveals, nothing bounces.

## Brand mark
A modular, stencil-like glyph built from right-angled bars on a single grid (a stacked T · P · T monogram). It is drawn in one flat colour via `currentColor` ([assets/logo.svg](assets/logo.svg)): off-black on light surfaces, warm-white on dark/media. Never recoloured with the signal amber, never outlined, never rounded.
- Nav: 26px tall beside the wordmark (Inter 700, 14px). Hero meta: 16px, paired with a mono label. Clear space ≥ one bar-width (≈ 1/6 of mark width). Minimum height 16px.
- Its square geometry is why corners elsewhere stay restrained (6/12px) and strokes stay hairline.

## Positioning (copy source)
The Rescue Tribe is a **redemptive tech company** whose vision is **tech abundance** — increasing access for businesses across the **Global South**. Copy is plain, hopeful, concrete; no jargon, no rescue/safety-gear language.

## Colour
| Token | Value | Role |
|---|---|---|
| `--tribe-warm-white` | `#f0eeeb` | Canvas, light-on-dark text, pale button fill |
| `--tribe-off-black` | `#292827` | Primary text, dark sections, button text |
| `--tribe-true-black` | `#000000` | Hero media base |
| `--tribe-graphite` | `#393837` | Large dark destination panels |
| `--tribe-charcoal` | `#30302f` | Alt dark controls |
| `--tribe-light-gray` | `#d6d3ce` | Utility cards |
| `--tribe-bright-white` | `#ffffff` | Raised media cards only |
| `--tribe-middle-gray` | `#938f89` | Secondary copy, hairlines |
| `--tribe-pale-steel` | `#c2bfba` | Borders, separators (never a CTA fill) |
| `--tribe-signal` | `#e8a33d` | **Live status dot only** — the sole accent |

## Typography
Primary **Inter** (substitute for Agility Diatype), mono **IBM Plex Mono**. OpenType `ss01` where supported.

**Hero title only:** **Astrobia** (`--font-hero`, `assets/fonts/astrobia.woff2`) — hairline display face, uppercase only, tracking 0, `--text-display-hero` clamp(40, 7.2vw, 104px). A deliberate exception to sentence case and to the Inter display rule; never used for body, nav or labels. **Licence:** the bundled file is the *Freeware, Non-Commercial* version — buy the full licence (and confirm web embedding) and swap the font file before this ships to production.

The hero title *decodes* on load: each letter cycles through random A–Z glyphs (~22/s, 0.5–0.95s), staggered left to right, then lands on its real character. Letter slots are width-locked so nothing shifts. Reduced-motion users get the static title.

| Role | Family | Wt | Size | LH | Tracking |
|---|---|---|---|---|---|
| display-xl (hero) | Inter | 400 | clamp(56, 10vw, 140px) | 0.88 | -0.04em |
| hero-heading | Inter | 400 | 62px | 0.93 | -1.86px |
| section-heading | Inter | 400 | 36px | 1.0 | -1.08px |
| card-heading | Inter | 400 | 28px | 1.0 | -0.56px |
| interface-text | Inter | 400 | 19px | 1.2 | -0.19px |
| feature-heading | Inter | 700 | 19px | 1.2 | -0.19px |
| nav | Inter | 400 | 14px | 1.25 | -0.14px |
| eyebrow (hero) | Plex Mono | 700 | 12px | 1 | 0.96px |
| technical-label / button | Plex Mono | 700 | 12px | 1 | 0.72px |

## Spacing & shape
Scale: 5 · 6 · 8 · 10 · 12 · 13 · 15 · 18 · 30 · 50 · 55 · 88 · 100 · 143 · 150 px. Element gap 18, card padding 18, section gap 55.
Radii: buttons 6 · cards/nav 12 · icons 2 · destination pills 24. Nothing larger.

## Components
- **Floating nav** — 12px radius, `rgba(232,227,216,.70)` fill, `backdrop-filter: blur(57px)`, text off-black 14px, 10px item gaps, 6px-radius controls inside.
- **Hero media stage** — full-bleed video over true black; gradient overlay darkest bottom-left where copy sits. Eyebrow + display headline low-left, in warm-white.
- **Warm-white compact button** — fill `#f0eeeb`, text `#292827`, mono 700 12px/.72px, radius 6, padding 13×15.
- **Black outline button** — fill `rgba(0,0,0,.8)`, text + 1px border `#f0eeeb`, radius 6, padding 15.
- **Playback control** — lower-right, mono label "PAUSE / PLAY" with a 2px-radius square icon.
- **Status chip** — mono label with Signal dot (pulses slowly); the only place colour appears.
- **Utility card / media card / graphite pill / footer** — as in the Digit 5 reference (see tokens above); not used in the hero build.

## Do
- `#f0eeeb` canvas, `#292827` text. Display weight 400, negative tracking. Mono 700 for every label.
- Keep controls minimal; one primary and one secondary action per view.
## Don't
- No saturated UI colours beyond the single status dot. No 9999px pills. No shadows on cards. No radius > 12px (except 24px destination pills). No bold display type.
