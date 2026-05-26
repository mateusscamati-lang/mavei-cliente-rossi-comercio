/* ============================================================
   animations.js — vida ao site institucional
   - scroll-reveal via IntersectionObserver
   - contadores numericos animados
   - parallax suave em imagens .parallax
   - page transition (fade in ao carregar, fade out ao navegar)
   - respeita prefers-reduced-motion
   ============================================================ */

(function () {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ── 1. Page transition (fade out ao navegar) ──────────────
  if (!reduceMotion) {
    document.documentElement.classList.add('page-enter');
    window.addEventListener('load', () => {
      requestAnimationFrame(() => document.documentElement.classList.add('page-loaded'));
    });
    document.addEventListener('click', (e) => {
      const a = e.target.closest('a');
      if (!a) return;
      const href = a.getAttribute('href');
      if (!href) return;
      if (a.target === '_blank') return;
      if (href.startsWith('#') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('http')) return;
      if (a.hasAttribute('download')) return;
      e.preventDefault();
      document.documentElement.classList.add('page-leaving');
      setTimeout(() => { window.location.href = href; }, 260);
    });
  }

  // ── 2. Scroll-reveal ──────────────────────────────────────
  const revealEls = document.querySelectorAll('[data-reveal]');
  if (revealEls.length && 'IntersectionObserver' in window && !reduceMotion) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const delay = entry.target.dataset.revealDelay || 0;
          setTimeout(() => entry.target.classList.add('is-revealed'), delay);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -8% 0px' });
    revealEls.forEach((el) => io.observe(el));
  } else {
    revealEls.forEach((el) => el.classList.add('is-revealed'));
  }

  // ── 3. Contadores animados ────────────────────────────────
  const counters = document.querySelectorAll('[data-counter]');
  if (counters.length && 'IntersectionObserver' in window) {
    const animateCounter = (el) => {
      const target = parseInt(el.dataset.counter, 10);
      const duration = parseInt(el.dataset.counterDuration || 1800, 10);
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - t, 3);
        el.textContent = Math.round(target * eased);
        if (t < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      };
      requestAnimationFrame(tick);
    };
    const io2 = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          if (reduceMotion) entry.target.textContent = entry.target.dataset.counter;
          else animateCounter(entry.target);
          io2.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((el) => { el.textContent = '0'; io2.observe(el); });
  }

  // ── 4. Parallax suave ─────────────────────────────────────
  const parallaxEls = document.querySelectorAll('[data-parallax]');
  if (parallaxEls.length && !reduceMotion) {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const vh = window.innerHeight;
        parallaxEls.forEach((el) => {
          const rect = el.getBoundingClientRect();
          if (rect.bottom < 0 || rect.top > vh) return;
          const speed = parseFloat(el.dataset.parallax) || 0.15;
          const offset = (rect.top + rect.height / 2 - vh / 2) * speed * -1;
          el.style.transform = `translate3d(0, ${offset.toFixed(1)}px, 0)`;
        });
        ticking = false;
      });
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ── 4.4 FAB WhatsApp: esconde quando footer aparece ───────
  const fab = document.getElementById('fab-wpp');
  const footer = document.querySelector('.footer');
  if (fab && footer && 'IntersectionObserver' in window) {
    const ioFab = new IntersectionObserver((entries) => {
      fab.classList.toggle('is-hidden', entries[0].isIntersecting);
    }, { threshold: 0 });
    ioFab.observe(footer);
  }

  // ── 4.5 Menu mobile (hamburguer + overlay) ────────────────
  const burger = document.querySelector('.nav__burger');
  const overlay = document.getElementById('nav-overlay');
  if (burger && overlay) {
    // Inicia fechado: inert remove do tab order + aria-hidden pra leitor de tela
    overlay.inert = true;

    const open = () => {
      overlay.classList.add('is-open');
      overlay.removeAttribute('aria-hidden');
      overlay.inert = false;
      burger.setAttribute('aria-expanded', 'true');
      burger.setAttribute('aria-label', 'Fechar menu');
      document.body.classList.add('nav-open');
      // Move foco pro primeiro link do overlay
      const firstLink = overlay.querySelector('a');
      if (firstLink) setTimeout(() => firstLink.focus(), 350);
    };
    const close = () => {
      overlay.classList.remove('is-open');
      overlay.setAttribute('aria-hidden', 'true');
      overlay.inert = true;
      burger.setAttribute('aria-expanded', 'false');
      burger.setAttribute('aria-label', 'Abrir menu');
      document.body.classList.remove('nav-open');
      // Devolve foco pro burger
      burger.focus();
    };
    burger.addEventListener('click', () => {
      if (overlay.classList.contains('is-open')) close(); else open();
    });
    overlay.querySelectorAll('a').forEach((a) => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && overlay.classList.contains('is-open')) close();
    });
    // Fecha se redimensionar pra desktop
    const mq = window.matchMedia('(min-width: 861px)');
    mq.addEventListener('change', (e) => { if (e.matches) close(); });
  }

  // ── 5. Nav muda no scroll ─────────────────────────────────
  const nav = document.getElementById('nav') || document.querySelector('.nav');
  if (nav) {
    const sentinel = document.createElement('div');
    sentinel.style.cssText = 'position:absolute;top:60px;left:0;width:1px;height:1px;pointer-events:none';
    document.body.prepend(sentinel);
    const ioNav = new IntersectionObserver((entries) => {
      nav.classList.toggle('nav--scrolled', !entries[0].isIntersecting);
    }, { threshold: 0 });
    ioNav.observe(sentinel);
  }

  // ── 6. Hover magnético em botões primários ────────────────
  if (!reduceMotion && !('ontouchstart' in window)) {
    document.querySelectorAll('[data-magnetic]').forEach((el) => {
      el.addEventListener('mousemove', (e) => {
        const rect = el.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * 0.18;
        const y = (e.clientY - rect.top - rect.height / 2) * 0.18;
        el.style.transform = `translate(${x}px, ${y}px)`;
      });
      el.addEventListener('mouseleave', () => { el.style.transform = ''; });
    });
  }

  // ── 6.5 Carrossel hero ────────────────────────────────────
  document.querySelectorAll('[data-carousel]').forEach((root) => {
    const slides = root.querySelectorAll('.hero-carousel__slide');
    const dots = root.querySelectorAll('.hero-carousel__dot');
    if (slides.length < 2) return;
    let current = 0;
    let timer = null;
    const interval = parseInt(root.dataset.carouselInterval || 5500, 10);

    const go = (idx) => {
      slides[current].classList.remove('is-active');
      if (dots[current]) {
        dots[current].classList.remove('is-active');
        dots[current].setAttribute('aria-selected', 'false');
      }
      current = (idx + slides.length) % slides.length;
      slides[current].classList.add('is-active');
      if (dots[current]) {
        dots[current].classList.add('is-active');
        dots[current].setAttribute('aria-selected', 'true');
      }
      // restart ken burns animation
      const img = slides[current].querySelector('img');
      if (img && !reduceMotion) {
        img.style.animation = 'none';
        img.offsetHeight;
        img.style.animation = '';
      }
    };

    const start = () => {
      if (reduceMotion) return;
      stop();
      timer = setInterval(() => go(current + 1), interval);
    };
    const stop = () => { if (timer) { clearInterval(timer); timer = null; } };

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => { go(i); start(); });
    });

    // Pause when tab hidden
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop(); else start();
    });

    // Pause on hover
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);

    start();
  });

  // ── 7. Texto que aparece letra-por-letra (split) ──────────
  document.querySelectorAll('[data-split]').forEach((el) => {
    const text = el.textContent.trim();
    const words = text.split(/(\s+)/);
    el.textContent = '';
    words.forEach((word, i) => {
      if (/\s+/.test(word)) {
        el.appendChild(document.createTextNode(' '));
        return;
      }
      const span = document.createElement('span');
      span.className = 'split-word';
      span.style.transitionDelay = `${i * 60}ms`;
      span.textContent = word;
      el.appendChild(span);
    });
  });
})();
