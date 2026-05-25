/* ============================================================
   main.js — comportamentos básicos compartilhados pelo template
   Stack mínima sem dependências.

   Cliente premium pode adicionar customizações específicas
   (animações, IntersectionObserver, etc) DEPOIS — esse arquivo
   é o ponto de partida saudável de performance.
   ============================================================ */

// ── GA4: lazy load (dispara no primeiro evento ou após 5s) ────
// Substituir [GA4_ID] pelo ID real do cliente.
// Se ainda não tem GA4, deixa como está — o script não dispara.
(function lazyGA4() {
  var GA4_ID = '[GA4_ID]';
  if (!GA4_ID || GA4_ID === '[GA4_ID]') return;
  var loaded = false;
  function load() {
    if (loaded) return;
    loaded = true;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + GA4_ID;
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function(){ dataLayer.push(arguments); };
    gtag('js', new Date());
    gtag('config', GA4_ID, { send_page_view: true });
    events.forEach(function(ev){ window.removeEventListener(ev, load, opts); });
  }
  var events = ['scroll','mousemove','touchstart','keydown','click'];
  var opts = { passive: true, once: true };
  events.forEach(function(ev){ window.addEventListener(ev, load, opts); });
  setTimeout(load, 5000);
})();

// ── 1. NAV: adiciona classe quando o usuário rola ─────────────
(function navScroll() {
  const nav = document.getElementById('nav') || document.querySelector('.nav');
  if (!nav) return;

  // Sentinel no topo da página — zero getBoundingClientRect em cada scroll
  const sentinel = document.createElement('div');
  sentinel.style.cssText = 'position:absolute;top:50px;left:0;width:1px;height:1px;pointer-events:none';
  document.body.prepend(sentinel);

  const io = new IntersectionObserver(entries => {
    nav.classList.toggle('nav--scrolled', !entries[0].isIntersecting);
  }, { threshold: 0 });
  io.observe(sentinel);
})();

// ── 2. Smooth scroll pra âncoras internas ────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
});

// ── 3. Track de cliques WhatsApp (eventos GA4 quando disponível) ─
(function trackWhatsApp() {
  document.querySelectorAll('a[href*="wa.me"], a[href*="api.whatsapp.com"]').forEach(a => {
    a.addEventListener('click', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'click_whatsapp', {
          event_category: 'CTA',
          event_label: a.dataset.cta || a.textContent.trim().slice(0, 40),
        });
      }
    }, { passive: true });
  });
})();

// ── 4. Track de envios de formulário (genérico) ──────────────
(function trackForms() {
  document.querySelectorAll('form').forEach(form => {
    form.addEventListener('submit', () => {
      if (typeof window.gtag === 'function') {
        window.gtag('event', 'generate_lead', {
          event_category: 'Formulário',
          event_label: form.dataset.form || form.name || 'contato',
        });
      }
    }, { passive: true });
  });
})();
