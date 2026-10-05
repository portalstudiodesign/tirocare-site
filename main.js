(() => {
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => [...el.querySelectorAll(s)];

  /* Header: hairline + shadow once the page scrolls */
  const header = $('.site-header');
  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 8);
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  /* Mobile menu */
  const menuBtn = $('#menuBtn');
  const setMenu = open => {
    document.body.classList.toggle('menu-open', open);
    menuBtn.setAttribute('aria-expanded', String(open));
    menuBtn.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
  };
  menuBtn.addEventListener('click', () => setMenu(!document.body.classList.contains('menu-open')));
  $$('#nav a').forEach(a => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', e => { if (e.key === 'Escape') setMenu(false); });
  window.matchMedia('(min-width: 961px)').addEventListener('change', e => { if (e.matches) setMenu(false); });

  /* Active nav link follows the section in view */
  const navLinks = $$('.nav a[href^="#"]');
  const sections = navLinks.map(a => $(a.getAttribute('href'))).filter(Boolean);
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + en.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    sections.forEach(s => spy.observe(s));
  }

  /* Screen showcase: accessible tabs, images preloaded so swaps are instant */
  const tabs = $$('.show-tab');
  const img = $('#showImg');
  const panel = $('#show-panel');
  tabs.forEach(t => { const p = new Image(); p.decoding = 'async'; p.src = t.dataset.src; });
  let swapTimer;
  const select = (tab, focus) => {
    if (tab.getAttribute('aria-selected') === 'true') return;
    tabs.forEach(t => {
      const on = t === tab;
      t.setAttribute('aria-selected', String(on));
      t.tabIndex = on ? 0 : -1;
    });
    panel.setAttribute('aria-labelledby', tab.id);
    if (focus) tab.focus();
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    clearTimeout(swapTimer);
    if (reduce) { img.src = tab.dataset.src; img.alt = tab.dataset.alt; return; }
    img.classList.add('swap');
    swapTimer = setTimeout(() => {
      img.src = tab.dataset.src;
      img.alt = tab.dataset.alt;
      const show = () => img.classList.remove('swap');
      // Never leave the screen blank: fall back after 300 ms if decode stalls
      const fallback = setTimeout(show, 300);
      const done = () => { clearTimeout(fallback); show(); };
      img.decode ? img.decode().then(done, done) : done();
    }, 180);
  };
  tabs.forEach((t, i) => {
    t.addEventListener('click', () => select(t));
    t.addEventListener('keydown', e => {
      const keys = { ArrowDown: 1, ArrowRight: 1, ArrowUp: -1, ArrowLeft: -1 };
      if (e.key in keys) {
        e.preventDefault();
        select(tabs[(i + keys[e.key] + tabs.length) % tabs.length], true);
      } else if (e.key === 'Home') { e.preventDefault(); select(tabs[0], true); }
      else if (e.key === 'End') { e.preventDefault(); select(tabs[tabs.length - 1], true); }
    });
  });

  /* Pricing: monthly / yearly */
  const periodBtns = $$('.bt-opt');
  const priced = $$('[data-monthly]');
  periodBtns.forEach(b => b.addEventListener('click', () => {
    const period = b.dataset.period;
    periodBtns.forEach(x => x.setAttribute('aria-pressed', String(x === b)));
    priced.forEach(el => { el.textContent = el.dataset[period]; });
  }));

  /* Reveal on scroll */
  const reveals = $$('.reveal');
  if (!('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    reveals.forEach(el => el.classList.add('in'));
  } else {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (!en.isIntersecting) return;
        const el = en.target;
        // Stagger siblings that enter together
        const sibs = [...el.parentElement.children].filter(c => c.classList.contains('reveal'));
        el.style.transitionDelay = Math.min(sibs.indexOf(el), 5) * 70 + 'ms';
        el.classList.add('in');
        // Drop the delay afterwards so hover transitions stay instant
        el.addEventListener('transitionend', () => { el.style.transitionDelay = ''; }, { once: true });
        io.unobserve(el);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
    reveals.forEach(el => io.observe(el));
  }
})();
