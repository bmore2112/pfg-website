// ---------- Year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Nav: scrolled state + mobile menu ----------
const nav = document.getElementById('nav');
if (nav) {
  const burger = nav.querySelector('.nav__burger');
  const mobile = document.getElementById('mobileMenu');
  const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 30);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  if (burger && mobile) {
    burger.addEventListener('click', () => {
      const open = nav.classList.toggle('open');
      burger.setAttribute('aria-expanded', String(open));
      mobile.hidden = !open;
    });
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
      nav.classList.remove('open');
      burger.setAttribute('aria-expanded', 'false');
      mobile.hidden = true;
    }));
  }
}

// ---------- Reveal on scroll ----------
const io = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// ---------- Animated counters ----------
const fmt = (n) => n.toLocaleString('en-US');
const runCounter = (el) => {
  const target = parseFloat(el.dataset.count);
  const suffix = el.dataset.suffix || '';
  const prefix = el.dataset.prefix || '';
  const dur = 1600;
  const start = performance.now();
  const tick = (now) => {
    const p = Math.min((now - start) / dur, 1);
    const eased = 1 - Math.pow(1 - p, 3);
    el.textContent = prefix + fmt(Math.round(target * eased)) + suffix;
    if (p < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};
const counters = document.querySelectorAll('.stat__num');
if (counters.length) {
  const counterIO = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { runCounter(e.target); counterIO.unobserve(e.target); } });
  }, { threshold: 0.6 });
  counters.forEach(el => counterIO.observe(el));
}

// ---------- Apply form ----------
const form = document.getElementById('applyForm');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form).entries());
    data.goal = 'creator';
    // TODO: POST to a real endpoint, e.g. fetch('/api/apply', {...})
    console.log('Application submitted:', data);
    const success = document.getElementById('formSuccess');
    if (success) {
      success.hidden = false;
      success.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
}

// ---------- Video carousels (Stream Hookups) ----------
document.querySelectorAll('[data-vcarousel]').forEach((car) => {
  const track = car.querySelector('.vcarousel__track');
  const slides = [...car.querySelectorAll('.vcarousel__slide')];
  const prev = car.querySelector('.vcarousel__btn--prev');
  const next = car.querySelector('.vcarousel__btn--next');
  const dotsWrap = car.querySelector('.vcarousel__dots');
  if (!track || !slides.length) return;
  let i = 0;
  if (dotsWrap) slides.forEach((_, idx) => {
    const d = document.createElement('button');
    d.className = 'vcarousel__dot' + (idx === 0 ? ' is-active' : '');
    d.type = 'button';
    d.setAttribute('aria-label', 'Go to video ' + (idx + 1));
    d.addEventListener('click', () => go(idx));
    dotsWrap.appendChild(d);
  });
  function go(n) {
    i = Math.max(0, Math.min(slides.length - 1, n));
    track.style.transform = 'translateX(-' + (i * 100) + '%)';
    slides.forEach((s) => { const v = s.querySelector('video'); if (v) v.pause(); });
    if (prev) prev.disabled = i === 0;
    if (next) next.disabled = i === slides.length - 1;
    if (dotsWrap) [...dotsWrap.children].forEach((d, idx) => d.classList.toggle('is-active', idx === i));
  }
  if (prev) prev.addEventListener('click', () => go(i - 1));
  if (next) next.addEventListener('click', () => go(i + 1));
  go(0);
});
