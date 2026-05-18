// Bhumilinks — small, focused enhancements.
// Everything here is progressive: the page works without JS.

(function () {
  'use strict';

  // 1) Update copyright year
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // 2) Sticky nav border on scroll
  const nav = document.querySelector('.nav');
  if (nav) {
    let ticking = false;
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          nav.classList.toggle('is-scrolled', window.scrollY > 12);
          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // 3) Reveal-on-scroll using IntersectionObserver
  const supportsIO = 'IntersectionObserver' in window;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!supportsIO || reduced) {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('is-revealed'));
    document.querySelectorAll('.flow, .credit-visual').forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const itemObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          itemObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.12 }
  );
  document.querySelectorAll('.reveal').forEach(el => itemObserver.observe(el));

  // Anything within the first ~110vh on load gets revealed immediately
  // so above-the-fold content doesn't depend on scroll
  const initialFold = window.innerHeight * 1.1;
  requestAnimationFrame(() => {
    document.querySelectorAll('.reveal').forEach(el => {
      const rect = el.getBoundingClientRect();
      if (rect.top < initialFold) {
        el.classList.add('is-revealed');
      }
    });
  });

  // 4) Larger reveal containers (flow diagram, credit visual)
  //    These have multi-step internal animations driven by the .is-revealed class
  const containerObserver = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          containerObserver.unobserve(entry.target);
        }
      });
    },
    { rootMargin: '0px 0px -10% 0px', threshold: 0.3 }
  );
  document.querySelectorAll('.flow, .credit-visual').forEach(el => containerObserver.observe(el));
})();
