// Page rail: shows position in the sequence of [data-page] sections. Needs hero.js loaded first (uses decodeInto).
(() => {
  const pages = [...document.querySelectorAll('[data-page]')];
  if (pages.length < 2) return; // nothing to track yet
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const STEP = 36, n = pages.length, pad = v => String(v).padStart(2, '0');
  const nav = document.createElement('nav');
  nav.className = 'pager'; nav.setAttribute('aria-label', 'Page position');
  nav.innerHTML = `<div class="pager__count" aria-hidden="true"><span data-pager-now>01</span><i>/${pad(n)}</i></div>
    <div class="pager__rail" style="height:${(n - 1) * STEP}px;--h:${(n - 1) * STEP}px"></div>`;
  const rail = nav.querySelector('.pager__rail');
  const now = nav.querySelector('[data-pager-now]');
  pages.forEach((pg, i) => {
    if (i < n - 1) { const m = document.createElement('span'); m.className = 'pager__minor'; m.style.top = (i * STEP + STEP / 2) + 'px'; rail.append(m); }
    const b = document.createElement('button');
    b.className = 'pager__tick'; b.style.top = (i * STEP) + 'px'; b.type = 'button';
    b.setAttribute('aria-label', `Page ${i + 1} of ${n}: ${pg.dataset.pageLabel || 'Page ' + (i + 1)}`);
    b.addEventListener('click', () => pg.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' }));
    rail.append(b);
  });
  const marker = document.createElement('span'); marker.className = 'pager__marker'; marker.setAttribute('aria-hidden', 'true');
  const label = document.createElement('span'); label.className = 'pager__label'; label.setAttribute('aria-hidden', 'true');
  rail.append(marker, label);
  document.body.append(nav);

  let active = -1, hideT, ticking = false;
  function progress() { // 0..n-1, fractional between pages
    const y = scrollY;
    for (let i = n - 1; i >= 0; i--) {
      const top = pages[i].offsetTop;
      if (y >= top || i === 0) {
        const next = pages[i + 1];
        return i + (next ? Math.min(1, Math.max(0, (y - top) / (next.offsetTop - top))) : 0);
      }
    }
    return 0;
  }
  function showLabel(i) {
    const text = (pages[i].dataset.pageLabel || 'Page ' + (i + 1));
    label.classList.add('is-on');
    if (reduceMotion) label.textContent = text; else decodeInto(label, text, .6);
    clearTimeout(hideT); hideT = setTimeout(() => label.classList.remove('is-on'), 2600);
  }
  function update() {
    ticking = false;
    const p = progress();
    marker.style.transform = `translateY(${p * STEP}px)`;
    label.style.transform = `translateY(${p * STEP - 5}px)`;
    const i = Math.round(p);
    if (i !== active) {
      active = i; now.textContent = pad(i + 1);
      rail.querySelectorAll('.pager__tick').forEach((t, k) => t.setAttribute('aria-current', k === i ? 'true' : 'false'));
      showLabel(i);
    }
  }
  const req = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  addEventListener('scroll', req, { passive: true });
  addEventListener('resize', req);
  update();
})();
