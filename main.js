/* ================================================================
   MENTALKRAFT — js/main.js
   ================================================================ */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------------
     NAVIGATION — scroll behaviour
  --------------------------------------------------------------- */
  const nav = document.querySelector('.nav');

  const onScroll = () => {
    nav.classList.toggle('scrolled', window.scrollY > 80);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------------------------------------------------------------
     NAVIGATION — mobile hamburger
  --------------------------------------------------------------- */
  const hamburger      = document.querySelector('.nav-hamburger');
  const mobileOverlay  = document.querySelector('.nav-mobile-overlay');

  if (hamburger && mobileOverlay) {
    const toggleMenu = () => {
      const open = hamburger.classList.toggle('open');
      mobileOverlay.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    };

    hamburger.addEventListener('click', toggleMenu);
    hamburger.setAttribute('aria-expanded', 'false');

    hamburger.addEventListener('click', () => {
      hamburger.setAttribute('aria-expanded',
        hamburger.classList.contains('open') ? 'true' : 'false');
    });

    mobileOverlay.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileOverlay.classList.remove('open');
        document.body.style.overflow = '';
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  /* ---------------------------------------------------------------
     HERO SLIDESHOW (home page only)
  --------------------------------------------------------------- */
  const slides = document.querySelectorAll('.hero-slide');

  if (slides.length > 1) {
    let current = 0;

    const goTo = (index) => {
      slides[current].classList.remove('active');
      /* Outgoing slide: keep animation as-is so it doesn't snap during fade */

      current = index;

      /* Restart Ken Burns only on the incoming slide */
      const newImg = slides[current].querySelector('img');
      if (newImg) {
        newImg.style.animation = 'none';
        void newImg.offsetHeight; /* force reflow */
        newImg.style.animation  = '';
      }

      slides[current].classList.add('active');
    };

    /* Initialise first slide */
    slides[0].classList.add('active');

    setInterval(() => {
      goTo((current + 1) % slides.length);
    }, 5000);
  } else if (slides.length === 1) {
    slides[0].classList.add('active');
  }

  /* ---------------------------------------------------------------
     SCROLL REVEAL — Intersection Observer
     Adds 'will-animate' to body FIRST (scopes the opacity:0 rules),
     then observes each element and adds 'visible' on intersect.
  --------------------------------------------------------------- */
  const revealEls = document.querySelectorAll('.reveal');

  if (revealEls.length > 0 && 'IntersectionObserver' in window) {
    /* Skip animations when ?preview param is present (for static screenshots) */
    const preview = new URLSearchParams(window.location.search).has('preview');

    if (!preview) {
      document.body.classList.add('will-animate');

      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

      revealEls.forEach(el => revealObserver.observe(el));
    }
  }
  /* Without IntersectionObserver support: elements remain visible (no will-animate class) */

  /* ---------------------------------------------------------------
     MEHR LESEN TOGGLES (Klienten page)
  --------------------------------------------------------------- */
  document.querySelectorAll('.mehr-lesen-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const block    = btn.closest('.testimonial-block');
      const fullQuote = block && block.querySelector('.testimonial-full');
      if (!fullQuote) return;

      const isOpen = fullQuote.classList.toggle('open');
      fullQuote.setAttribute('aria-hidden', String(!isOpen));
      btn.setAttribute('aria-expanded', String(isOpen));
      btn.textContent = isOpen ? 'Weniger ↑' : 'Mehr lesen ↓';
    });
  });

  /* ---------------------------------------------------------------
     CONTACT FORM — client-side validation
  --------------------------------------------------------------- */
  const form = document.querySelector('.contact-form');

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      let valid = true;

      form.querySelectorAll('[required]').forEach(field => {
        field.style.borderColor = '';

        if (!field.value.trim()) {
          field.style.borderColor = '#c0392b';
          valid = false;
          return;
        }

        if (field.type === 'email') {
          const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim());
          if (!ok) {
            field.style.borderColor = '#c0392b';
            valid = false;
          }
        }
      });

      if (valid) {
        const btn = form.querySelector('.btn-submit');
        btn.textContent = 'Nachricht gesendet ✓';
        btn.style.backgroundColor = '#3d6b52';
        btn.disabled = true;
      }
    });
  }

  /* ---------------------------------------------------------------
     ACTIVE NAV LINK — mark current page
  --------------------------------------------------------------- */
  const path     = window.location.pathname;
  const filename = path.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .nav-mobile-overlay a').forEach(link => {
    const href = link.getAttribute('href') || '';
    const linkFile = href.split('/').pop();

    const isHome = (filename === '' || filename === 'index.html')
                 && (href === 'index.html' || href === './index.html' || href === '/');

    if (isHome || (linkFile && linkFile === filename && filename !== 'index.html')) {
      link.classList.add('active');
    }
  });

});
