gsap.registerPlugin(ScrollTrigger, SplitText);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const media = document.querySelector('[data-media]');
const intro = document.querySelector('[data-video-intro]');
const loop = document.querySelector('[data-video-loop]');
const title = document.querySelector('[data-title]');

// The title decodes (each letter cycles through random glyphs, then lands) once the film reaches its final scene (or when the visitor scrolls / taps / presses a key).
let chars = [], typed = false, settled = false;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Wait for Astrobia itself (fonts.ready can resolve before it has started loading), but never hold the page for more than 3s.
const heroFont = Promise.race([
  Promise.all([document.fonts.ready, document.fonts.load('1em Astrobia', 'UNWORKINGTHEFALL')]),
  new Promise(r => setTimeout(r, 3000))
]);

// Lock each letter's slot to its final glyph width so cycling glyphs never shift the layout.
function lockWidths() {
  chars.forEach(ch => { ch.style.width = ''; });
  chars.forEach(ch => { ch.style.width = ch.getBoundingClientRect().width + 'px'; });
}

heroFont.then(() => {
  const split = new SplitText(title, { type: 'lines,words,chars', linesClass: 'line', wordsClass: 'word', charsClass: 'char' });
  chars = split.chars;
  title.style.position = 'relative';
  title.setAttribute('aria-label', title.textContent);
  if (reduce) return;
  chars.forEach(ch => { ch.dataset.final = ch.textContent; ch.style.textAlign = 'center'; });
  lockWidths();
  let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(() => { if (!typed || settled) lockWidths(); }, 150); });
  gsap.set(chars, { autoAlpha: 0 });
  gsap.set('[data-fade]', { autoAlpha: 0, y: 16 });
  gsap.set('[data-after]', { autoAlpha: 0, y: 16 });
  gsap.set('.nav', { autoAlpha: 0, y: -16 });
  gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .2 })
    .to('.nav', { autoAlpha: 1, y: 0, duration: 1 })
    .to('[data-fade]', { autoAlpha: 1, y: 0, duration: 1 }, .5)
    .fromTo(media, { scale: 1.14 }, { scale: 1.06, duration: 2.6, ease: 'power2.out' }, 0);
});

function scramble(ch, delay, land) {
  const final = ch.dataset.final, state = { t: 0 }, spin = Math.max(.4, land - delay);
  let last = -1;
  gsap.to(state, {
    t: 1, duration: spin, delay, ease: 'none',
    onStart: () => gsap.set(ch, { autoAlpha: 1 }),
    onUpdate: () => {
      const step = Math.floor(state.t * spin / .04); // swap glyph ~25x per second
      if (step !== last) { last = step; ch.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
    },
    onComplete: () => { ch.textContent = final; }
  });
}
// Real seconds left until the film reaches TITLE_END (so the decode finishes as the film hits that mark).
function decodeSpan() {
  if (active === intro && intro.duration && !intro.paused) return Math.max(1.5, (intro.duration * TITLE_END - intro.currentTime) / intro.playbackRate);
  return 3; // no film clock (scroll / tap / autoplay blocked)
}
function typeTitle() {
  if (typed || reduce || !chars.length) return;
  typed = true;
  const span = decodeSpan(), n = chars.length;
  chars.forEach((ch, i) => {
    // everyone starts spinning at once; letters lock in left to right across the back 60% of the window
    const land = span * (.4 + .6 * (i + 1) / n) + (Math.random() - .5) * .15;
    scramble(ch, i * .03, Math.min(span, land));
  });
  gsap.to('[data-after]', { autoAlpha: 1, y: 0, duration: 1, stagger: .15, ease: 'power3.out', delay: span + .05, onStart: startStatus });
  gsap.delayedCall(span + .5, () => { settled = true; });
}
// Status chip: the label decodes from line to line (same glyph-flicker language as the headline), looping.
const statusEl = document.querySelector('[data-status]');
const statusText = document.querySelector('[data-status-text]');
const phrases = statusEl.dataset.phrases.split('|');
let phraseIdx = -1;
if (!reduce) statusText.textContent = phrases[0];
function decodeInto(el, target, dur) {
  const state = { t: 0 }, n = target.length;
  gsap.to(state, {
    t: 1, duration: dur, ease: 'none',
    onUpdate: () => {
      const settled = Math.floor(state.t * n * 1.15); // letters lock in left to right
      el.textContent = target.split('').map((c, i) =>
        i < settled || c === ' ' ? c : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]).join('');
    },
    onComplete: () => { el.textContent = target; }
  });
}
function nextPhrase() {
  phraseIdx = (phraseIdx + 1) % phrases.length;
  decodeInto(statusText, phrases[phraseIdx], .7);
  gsap.delayedCall(.7 + 2.4, nextPhrase);
}
let statusStarted = false;
function startStatus() { if (statusStarted || reduce) return; statusStarted = true; nextPhrase(); }
['wheel', 'touchmove', 'keydown'].forEach(e => addEventListener(e, typeTitle, { once: true, passive: true }));
addEventListener('scroll', typeTitle, { once: true, passive: true });
setTimeout(() => { if (intro.paused) typeTitle(); }, 3500); // autoplay blocked / paused: don't leave the hero without its statement

// Scroll: gentle parallax + fade of the content
if (!reduce) {
  gsap.to(media, { yPercent: 8, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero__content', { y: -60, autoAlpha: .2, ease: 'none', scrollTrigger: { trigger: '[data-hero]', start: 'top top', end: 'bottom 30%', scrub: true } });
}

// Playback: the film plays once; its last frame is the first frame of a locked-camera loop (generated in Higgsfield),
// so the hand-off is invisible and the loop never zooms or fades.
const bar = document.querySelector('[data-progress]');
let active = intro;
const TITLE_END = .8; // fraction of the film at which the headline has fully decoded and the subline appears
const TITLE_AT = 5; // seconds of footage at which the headline starts decoding (film is ~15s)

function handOff() {
  if (active === loop) return;
  active = loop;
  typeTitle();
  loop.play().catch(() => {});
  gsap.to(intro, { opacity: 0, duration: .6, ease: 'none', onComplete: () => intro.pause() });
  gsap.to(bar.parentNode, { opacity: 0, duration: 1 });
}
intro.addEventListener('ended', handOff);
gsap.ticker.add(() => {
  if (active === intro && intro.duration) {
    gsap.set(bar, { scaleX: intro.currentTime / intro.duration });
    if (intro.currentTime >= TITLE_AT) typeTitle();
    if (intro.currentTime >= intro.duration - .15) handOff();
  }
});

if (reduce) { loop.style.zIndex = 2; intro.style.display = 'none'; }
else {
  const INTRO_RATE = 1.4; // speed up the opening film
  intro.playbackRate = INTRO_RATE;
  intro.addEventListener('loadedmetadata', () => { intro.playbackRate = INTRO_RATE; });
  intro.play().catch(() => {});
}


// Pointer light: halo follows the mouse; on touch, a tap makes a patch of the screen glow and it recedes 3s after the finger lifts.
if (!reduce) {
  const hero = document.querySelector('[data-hero]');
  const L = { x: 0, y: 0, r: 0, o: 0 };
  const R_MOUSE = 300, R_TOUCH = 210, HOLD = 3;
  let hold, live = false;
  const toX = gsap.quickTo(L, 'x', { duration: .55, ease: 'power3.out' });
  const toY = gsap.quickTo(L, 'y', { duration: .55, ease: 'power3.out' });
  const spot = e => { const b = hero.getBoundingClientRect(); return [e.clientX - b.left, e.clientY - b.top]; };
  gsap.ticker.add(() => {
    if (!live && L.o < .001) return;
    hero.style.setProperty('--lx', L.x + 'px'); hero.style.setProperty('--ly', L.y + 'px');
    hero.style.setProperty('--lr', L.r + 'px'); hero.style.setProperty('--lo', L.o);
    if (!live && L.o < .001) hero.style.setProperty('--lo', 0);
  });
  function light(e, radius, snap) {
    const [x, y] = spot(e);
    if (snap || L.o < .05) { L.x = x; L.y = y; } else { toX(x); toY(y); } // jump on first contact, glide afterwards
    live = true; hold?.kill();
    gsap.to(L, { o: 1, duration: .5, ease: 'power2.out', overwrite: 'auto' });
    gsap.to(L, { r: radius, duration: snap ? .6 : 1, ease: 'power3.out' });
  }
  function dim(delay, dur) {
    hold?.kill();
    hold = gsap.delayedCall(delay, () => {
      gsap.to(L, { o: 0, duration: dur, ease: 'power2.inOut' });
      gsap.to(L, { r: L.r * .55, duration: dur, ease: 'power2.inOut', onComplete: () => { live = false; } });
    });
  }
  hero.addEventListener('pointermove', e => { if (e.pointerType === 'mouse' || e.pointerType === 'pen') light(e, R_MOUSE, false); else if (live) { const [x, y] = spot(e); toX(x); toY(y); } });
  hero.addEventListener('pointerleave', e => { if (e.pointerType !== 'touch') dim(0, .7); });
  hero.addEventListener('pointerdown', e => { if (e.pointerType === 'touch') light(e, R_TOUCH, true); });
  ['pointerup', 'pointercancel'].forEach(t => hero.addEventListener(t, e => { if (e.pointerType === 'touch') dim(HOLD, .9); }));
}
