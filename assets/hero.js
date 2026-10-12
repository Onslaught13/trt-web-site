gsap.registerPlugin(ScrollTrigger, SplitText);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const media = document.querySelector('[data-media]');
const intro = document.querySelector('[data-video-intro]');
const loop = document.querySelector('[data-video-loop]');
const title = document.querySelector('[data-title]');

// The title decodes (each letter cycles through random glyphs, then lands) once the film reaches its final scene (or when the visitor scrolls / taps / presses a key).
let chars = [], typed = false;
const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

document.fonts.ready.then(() => {
  const split = new SplitText(title, { type: 'lines,words,chars', linesClass: 'line', wordsClass: 'word', charsClass: 'char' });
  chars = split.chars;
  title.style.position = 'relative';
  title.setAttribute('aria-label', title.textContent);
  if (reduce) return;
  // Lock each letter's slot to its final glyph width so cycling glyphs never shift the layout.
  chars.forEach(ch => { ch.dataset.final = ch.textContent; ch.style.width = ch.getBoundingClientRect().width + 'px'; ch.style.textAlign = 'center'; });
  gsap.set(chars, { autoAlpha: 0 });
  gsap.set('[data-fade]', { autoAlpha: 0, y: 16 });
  gsap.set('[data-after]', { autoAlpha: 0, y: 16 });
  gsap.set('.nav', { autoAlpha: 0, y: -16 });
  gsap.timeline({ defaults: { ease: 'power3.out' }, delay: .2 })
    .to('.nav', { autoAlpha: 1, y: 0, duration: 1 })
    .to('[data-fade]', { autoAlpha: 1, y: 0, duration: 1 }, .5)
    .fromTo(media, { scale: 1.14 }, { scale: 1.06, duration: 2.6, ease: 'power2.out' }, 0);
});

function scramble(ch, delay) {
  const final = ch.dataset.final, state = { t: 0 }, spin = .5 + Math.random() * .45;
  let last = -1;
  gsap.to(state, {
    t: 1, duration: spin, delay, ease: 'none',
    onStart: () => gsap.set(ch, { autoAlpha: 1 }),
    onUpdate: () => {
      const step = Math.floor(state.t * spin / .045); // swap glyph ~22x per second
      if (step !== last) { last = step; ch.textContent = GLYPHS[Math.floor(Math.random() * GLYPHS.length)]; }
    },
    onComplete: () => { ch.textContent = final; }
  });
}
function typeTitle() {
  if (typed || reduce || !chars.length) return;
  typed = true;
  chars.forEach((ch, i) => scramble(ch, i * .07 + Math.random() * .05));
  gsap.to('[data-after]', { autoAlpha: 1, y: 0, duration: 1, stagger: .15, ease: 'power3.out', delay: chars.length * .07 + .9 });
}
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
