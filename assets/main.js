/* ============================================================
   main.js — Felipe Tecco Portfolio
   ============================================================ */
(function () {
  'use strict';

  function $(sel, ctx)  { return (ctx || document).querySelector(sel); }
  function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

  /* ----------------------------------------------------------
     NAV — active link
     ---------------------------------------------------------- */
  function setActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    $$('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
    $$('.nav__dropdown-item').forEach(function (item) {
      var href = item.getAttribute('href') || '';
      if (href === current) {
        item.classList.add('active');
        var parent = item.closest('.nav__dropdown');
        if (parent) {
          var toggle = $('.nav__dropdown-toggle', parent);
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  /* ----------------------------------------------------------
     NAV — glassmorphism on scroll
     ---------------------------------------------------------- */
  function initNavScroll() {
    var nav = $('.nav');
    if (!nav) return;
    function onScroll() {
      nav.classList.toggle('scrolled', window.scrollY > 20);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ----------------------------------------------------------
     DROPDOWN
     ---------------------------------------------------------- */
  function initDropdowns() {
    $$('.nav__dropdown').forEach(function (dropdown) {
      var toggle = $('.nav__dropdown-toggle', dropdown);
      if (!toggle) return;
      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('open');
        $$('.nav__dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        if (!isOpen) dropdown.classList.add('open');
      });
    });
    document.addEventListener('click', function () {
      $$('.nav__dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        $$('.nav__dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      }
    });
  }

  /* ----------------------------------------------------------
     HAMBURGER
     ---------------------------------------------------------- */
  function initHamburger() {
    var hamburger = $('.nav__hamburger');
    var mobileNav = $('.nav__mobile');
    if (!hamburger || !mobileNav) return;

    hamburger.addEventListener('click', function (e) {
      e.stopPropagation();
      var isOpen = hamburger.classList.contains('open');
      hamburger.classList.toggle('open', !isOpen);
      mobileNav.classList.toggle('open', !isOpen);
      document.body.style.overflow = isOpen ? '' : 'hidden';
    });
    mobileNav.addEventListener('click', function (e) {
      if (e.target.closest('a')) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     ACCORDION — smooth max-height animation
     ---------------------------------------------------------- */
  function initAccordions() {
    $$('.accordion-header').forEach(function (header) {
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');

      header.addEventListener('click', function () {
        var accordion = header.closest('.accordion');
        if (!accordion) return;
        var isOpen = accordion.classList.contains('open');

        /* Close siblings */
        var parent = accordion.parentElement;
        if (parent) {
          $$('.accordion.open', parent).forEach(function (a) {
            if (a !== accordion) a.classList.remove('open');
          });
        }
        accordion.classList.toggle('open', !isOpen);
      });

      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL — Intersection Observer
     ---------------------------------------------------------- */
  function initScrollReveal() {
    var elements = $$('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(function (el) { el.classList.add('visible'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     AUTO-REVEAL — add .reveal to key elements automatically
     ---------------------------------------------------------- */
  function autoReveal() {
    var selectors = [
      '.section-label',
      '.section-title',
      '.section-intro',
      '.card',
      '.accordion',
      '.timeline__item',
      '.intro-stat',
      '.comp-strip__item',
      '.contact-link',
      '.profil-info-item'
    ];

    selectors.forEach(function (sel) {
      $$(sel).forEach(function (el, i) {
        if (!el.classList.contains('reveal')) {
          el.classList.add('reveal');
          /* Stagger cards and strip items */
          if (sel === '.card' || sel === '.comp-strip__item' || sel === '.intro-stat') {
            var delay = (i % 3) + 1;
            el.classList.add('reveal-delay-' + delay);
          }
        }
      });
    });
  }

  /* ----------------------------------------------------------
     SMOOTH COUNTER animation for stat numbers
     ---------------------------------------------------------- */
  function initCounters() {
    var stats = $$('.intro-stat h3');
    if (!stats.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var el = entry.target;
        var text = el.textContent.trim();
        var num = parseInt(text, 10);
        if (isNaN(num)) return;

        var duration = 1200;
        var start = performance.now();
        function update(now) {
          var progress = Math.min((now - start) / duration, 1);
          var eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * num);
          if (progress < 1) requestAnimationFrame(update);
          else el.textContent = text;
        }
        requestAnimationFrame(update);
        observer.unobserve(el);
      });
    }, { threshold: 0.5 });

    stats.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     INIT
     ---------------------------------------------------------- */
  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initNavScroll();
    initDropdowns();
    initHamburger();
    initAccordions();
    autoReveal();
    initScrollReveal();
    initCounters();
  });

}());
