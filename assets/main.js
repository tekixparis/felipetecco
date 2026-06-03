/* ============================================================
   main.js — Felipe Tecco Portfolio
   BTS Techniques de Commercialisation
   ============================================================ */

(function () {
  'use strict';

  /* ----------------------------------------------------------
     HELPERS
     ---------------------------------------------------------- */
  function $(sel, ctx) {
    return (ctx || document).querySelector(sel);
  }
  function $$(sel, ctx) {
    return Array.from((ctx || document).querySelectorAll(sel));
  }

  /* ----------------------------------------------------------
     ACTIVE NAV LINK
     Highlights the nav link that matches the current page.
     ---------------------------------------------------------- */
  function setActiveNav() {
    var current = window.location.pathname.split('/').pop() || 'index.html';
    // Mark desktop links
    $$('.nav__link').forEach(function (link) {
      var href = link.getAttribute('href') || '';
      if (href === current || (current === '' && href === 'index.html')) {
        link.classList.add('active');
      }
    });
    // Mark dropdown items
    $$('.nav__dropdown-item').forEach(function (item) {
      var href = item.getAttribute('href') || '';
      if (href === current) {
        item.classList.add('active');
        // Also flag the parent toggle
        var parent = item.closest('.nav__dropdown');
        if (parent) {
          var toggle = $('.nav__dropdown-toggle', parent);
          if (toggle) toggle.classList.add('active');
        }
      }
    });
  }

  /* ----------------------------------------------------------
     DROPDOWN (desktop — click to open/close)
     ---------------------------------------------------------- */
  function initDropdowns() {
    $$('.nav__dropdown').forEach(function (dropdown) {
      var toggle = $('.nav__dropdown-toggle', dropdown);
      if (!toggle) return;

      toggle.addEventListener('click', function (e) {
        e.stopPropagation();
        var isOpen = dropdown.classList.contains('open');
        // Close all dropdowns first
        $$('.nav__dropdown.open').forEach(function (d) { d.classList.remove('open'); });
        if (!isOpen) {
          dropdown.classList.add('open');
        }
      });
    });

    // Close on outside click
    document.addEventListener('click', function () {
      $$('.nav__dropdown.open').forEach(function (d) { d.classList.remove('open'); });
    });

    // Close on Escape
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') {
        $$('.nav__dropdown.open').forEach(function (d) { d.classList.remove('open'); });
      }
    });
  }

  /* ----------------------------------------------------------
     HAMBURGER / MOBILE MENU
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

    // Close when a link inside is clicked
    mobileNav.addEventListener('click', function (e) {
      var target = e.target.closest('a');
      if (target) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });

    // Close on outside click
    document.addEventListener('click', function (e) {
      if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      }
    });
  }

  /* ----------------------------------------------------------
     ACCORDION
     Clicking .accordion-header toggles its parent .accordion
     between open and closed state.
     ---------------------------------------------------------- */
  function initAccordions() {
    $$('.accordion-header').forEach(function (header) {
      header.addEventListener('click', function () {
        var accordion = header.closest('.accordion');
        if (!accordion) return;
        var isOpen = accordion.classList.contains('open');

        // Optional: close others in same group
        var parent = accordion.parentElement;
        if (parent) {
          $$('.accordion.open', parent).forEach(function (a) {
            if (a !== accordion) a.classList.remove('open');
          });
        }

        accordion.classList.toggle('open', !isOpen);
      });

      // Keyboard accessibility
      header.setAttribute('role', 'button');
      header.setAttribute('tabindex', '0');
      header.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          header.click();
        }
      });
    });
  }

  /* ----------------------------------------------------------
     SCROLL REVEAL
     ---------------------------------------------------------- */
  function initReveal() {
    var elements = $$('.reveal');
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ----------------------------------------------------------
     INIT
     ---------------------------------------------------------- */
  function initHeroAnimations() {
    var hero = document.querySelector('.hero');
    if (!hero) return;
    /* rAF ensures the browser has painted the initial state (opacity:0)
       before we flip the class, so the transition is always visible */
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        hero.classList.add('hero--ready');
      });
    });
  }

  document.addEventListener('DOMContentLoaded', function () {
    setActiveNav();
    initDropdowns();
    initHamburger();
    initAccordions();
    initReveal();
    initHeroAnimations();
  });

}());
