/**
* Template Name: Craftivo
* Template URL: https://bootstrapmade.com/craftivo-bootstrap-portfolio-template/
* Updated: Oct 04 2025 with Bootstrap v5.3.8
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/

(function() {
  "use strict";

  /**
   * Apply .scrolled class to the body as the page is scrolled down
   */
  function toggleScrolled() {
    const selectBody = document.querySelector('body');
    const selectHeader = document.querySelector('#header');
    if (!selectHeader.classList.contains('scroll-up-sticky') && !selectHeader.classList.contains('sticky-top') && !selectHeader.classList.contains('fixed-top')) return;
    window.scrollY > 100 ? selectBody.classList.add('scrolled') : selectBody.classList.remove('scrolled');
  }

  document.addEventListener('scroll', toggleScrolled);
  window.addEventListener('load', toggleScrolled);

  /**
   * Tema claro/escuro (o valor inicial é aplicado no <head> para evitar piscar)
   */
  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    document.querySelectorAll('[data-theme-set]').forEach(btn => {
      btn.setAttribute('aria-pressed', String(btn.getAttribute('data-theme-set') === theme));
    });
    try { localStorage.setItem('theme', theme); } catch (e) {}
  }
  document.querySelectorAll('[data-theme-set]').forEach(btn => {
    btn.addEventListener('click', () => applyTheme(btn.getAttribute('data-theme-set')));
  });
  applyTheme(document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light');

  /**
   * Mobile nav toggle
   */
  const mobileNavToggleBtn = document.querySelector('.mobile-nav-toggle');

  function mobileNavToogle() {
    document.querySelector('body').classList.toggle('mobile-nav-active');
    mobileNavToggleBtn.classList.toggle('bi-list');
    mobileNavToggleBtn.classList.toggle('bi-x');
  }
  if (mobileNavToggleBtn) {
    mobileNavToggleBtn.addEventListener('click', mobileNavToogle);
  }

  /**
   * Hide mobile nav on same-page/hash links
   */
  document.querySelectorAll('#navmenu a').forEach(navmenu => {
    navmenu.addEventListener('click', () => {
      if (document.querySelector('.mobile-nav-active')) {
        mobileNavToogle();
      }
    });

  });

  /**
   * Toggle mobile nav dropdowns
   */
  document.querySelectorAll('.navmenu .toggle-dropdown').forEach(navmenu => {
    navmenu.addEventListener('click', function(e) {
      e.preventDefault();
      this.parentNode.classList.toggle('active');
      this.parentNode.nextElementSibling.classList.toggle('dropdown-active');
      e.stopImmediatePropagation();
    });
  });

  /**
   * Preloader
   */
  const preloader = document.querySelector('#preloader');
  if (preloader) {
    window.addEventListener('load', () => {
      preloader.remove();
    });
  }

  /**
   * Scroll top button
   */
  let scrollTop = document.querySelector('.scroll-top');

  function toggleScrollTop() {
    if (scrollTop) {
      window.scrollY > 100 ? scrollTop.classList.add('active') : scrollTop.classList.remove('active');
    }
  }
  scrollTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  window.addEventListener('load', toggleScrollTop);
  document.addEventListener('scroll', toggleScrollTop);

  /**
   * Animation on scroll function and init
   */
  function aosInit() {
    AOS.init({
      duration: 600,
      easing: 'ease-in-out',
      once: true,
      mirror: false
    });
  }
  window.addEventListener('load', aosInit);

  /**
   * Init typed.js
   */
  const selectTyped = document.querySelector('.typed');
  let typedInstance = null;
  const typedPT = selectTyped ? selectTyped.getAttribute('data-typed-items') : '';
  function startTyped(items) {
    if (!selectTyped) return;
    if (typedInstance) typedInstance.destroy();
    selectTyped.textContent = '';
    typedInstance = new Typed('.typed', {
      strings: items.split(','),
      loop: true,
      typeSpeed: 100,
      backSpeed: 50,
      backDelay: 2000
    });
  }
  if (selectTyped) startTyped(typedPT);
  document.addEventListener('langchange', e => {
    if (!selectTyped || e.detail.initial && e.detail.lang === 'pt') return;
    startTyped(e.detail.lang === 'en' && window.I18N_TYPED_EN ? window.I18N_TYPED_EN : typedPT);
  });

  /**
   * Animate the skills items on reveal
   */
  let skillsAnimation = document.querySelectorAll('.skills-animation');
  skillsAnimation.forEach((item) => {
    new Waypoint({
      element: item,
      offset: '80%',
      handler: function(direction) {
        let progress = item.querySelectorAll('.progress .progress-bar');
        progress.forEach(el => {
          el.style.width = el.getAttribute('aria-valuenow') + '%';
        });
      }
    });
  });

  /**
   * Initiate glightbox
   */
  const glightbox = GLightbox({
    selector: '.glightbox'
  });

  /**
   * Init isotope layout and filters
   */
  document.querySelectorAll('.isotope-layout').forEach(function(isotopeItem) {
    let layout = isotopeItem.getAttribute('data-layout') ?? 'masonry';
    let filter = isotopeItem.getAttribute('data-default-filter') ?? '*';
    let sort = isotopeItem.getAttribute('data-sort') ?? 'original-order';

    let initIsotope;
    imagesLoaded(isotopeItem.querySelector('.isotope-container'), function() {
      initIsotope = new Isotope(isotopeItem.querySelector('.isotope-container'), {
        itemSelector: '.isotope-item',
        layoutMode: layout,
        filter: filter,
        sortBy: sort
      });
    });

    isotopeItem.querySelectorAll('.isotope-filters li').forEach(function(filters) {
      filters.addEventListener('click', function() {
        isotopeItem.querySelector('.isotope-filters .filter-active').classList.remove('filter-active');
        this.classList.add('filter-active');
        initIsotope.arrange({
          filter: this.getAttribute('data-filter')
        });
        if (typeof aosInit === 'function') {
          aosInit();
        }
      }, false);
    });

  });

 
  /**
   * Correct scrolling position upon page load for URLs containing hash links.
   */
  window.addEventListener('load', function(e) {
    if (window.location.hash) {
      if (document.querySelector(window.location.hash)) {
        setTimeout(() => {
          let section = document.querySelector(window.location.hash);
          let scrollMarginTop = getComputedStyle(section).scrollMarginTop;
          window.scrollTo({
            top: section.offsetTop - parseInt(scrollMarginTop),
            behavior: 'smooth'
          });
        }, 100);
      }
    }
  });


  /**
   * Inicialização unificada dos Swipers
   */
  function initSwiper() {
    // 1. Inicializa Swipers que usam configuração via JSON no HTML (Ex: Recomendações)
    document.querySelectorAll(".init-swiper").forEach(function(swiperElement) {
      let configElement = swiperElement.querySelector(".swiper-config");
      if (configElement) {
        let config = JSON.parse(configElement.innerHTML.trim());
        
        if (swiperElement.classList.contains("swiper-tab")) {
          initSwiperWithCustomPagination(swiperElement, config);
        } else {
          new Swiper(swiperElement, config);
        }
      }
    });

    // Carrossel de Certificações (duplica os selos se forem poucos, para o loop contínuo funcionar)
    const certsEl = document.querySelector('.certs-slider');
    if (certsEl) {
      const wrapper = certsEl.querySelector('.swiper-wrapper');
      const originals = Array.from(wrapper.children);
      while (wrapper.children.length < 12 && originals.length) {
        originals.forEach(el => {
          const clone = el.cloneNode(true);
          clone.setAttribute('aria-hidden', 'true');
          wrapper.appendChild(clone);
        });
      }
      new Swiper(certsEl, {
        speed: 5000,
        loop: true,
        allowTouchMove: true,
        freeMode: true,
        autoplay: { delay: 0, disableOnInteraction: false },
        slidesPerView: 3,
        spaceBetween: 20,
        breakpoints: {
          768: { slidesPerView: 5, spaceBetween: 30 },
          1200: { slidesPerView: 7, spaceBetween: 40 }
        }
      });
    }

    // 2. Inicializa o carrossel de Marcas (Movimento Contínuo)
    if (document.querySelector('.clients-slider')) {
      new Swiper('.clients-slider', {
        speed: 5000,
        loop: true,
        allowTouchMove: true,
        freeMode: true,
        autoplay: {
          delay: 0,
          disableOnInteraction: false,
        },
        slidesPerView: 2,
        spaceBetween: 40,
        breakpoints: {
          480: { slidesPerView: 3, spaceBetween: 60 },
          768: { slidesPerView: 4, spaceBetween: 80 },
          1200: { slidesPerView: 6, spaceBetween: 100 }
        }
      });
    }
  }

  // Executa ao carregar a página
  window.addEventListener('load', initSwiper);


  /**
   * Barra de progresso, botão do WhatsApp e linha do tempo (efeitos de rolagem)
   */
  const progressBar = document.getElementById('read-progress');
  const waFab = document.getElementById('wa-fab');
  const expCards = document.querySelector('.experience-cards');
  let fxTicking = false;

  function onScrollFx() {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.transform = 'scaleX(' + (max > 0 ? Math.min(window.scrollY / max, 1) : 0) + ')';
    }
    if (waFab) waFab.classList.toggle('active', window.scrollY > 400);
    if (expCards) {
      const r = expCards.getBoundingClientRect();
      const t = (window.innerHeight * 0.6 - r.top) / r.height;
      expCards.style.setProperty('--tl', Math.max(0, Math.min(1, t)).toFixed(3));
    }
    fxTicking = false;
  }
  window.addEventListener('scroll', () => {
    if (!fxTicking) { fxTicking = true; requestAnimationFrame(onScrollFx); }
  }, { passive: true });
  window.addEventListener('resize', onScrollFx);
  window.addEventListener('load', onScrollFx);

  /**
   * Contadores animados (faixa de números)
   */
  const reduceMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const countDone = new Set();
  const fmtCount = n => n.toLocaleString(window.I18N && window.I18N.lang === 'en' ? 'en-US' : 'pt-BR');
  function runCount(el) {
    const end = Number(el.dataset.count);
    const t0 = performance.now();
    const dur = 1600;
    (function step(now) {
      const p = Math.min((now - t0) / dur, 1);
      el.textContent = fmtCount(Math.round(end * (1 - Math.pow(1 - p, 3))));
      if (p < 1) requestAnimationFrame(step);
      else countDone.add(el.dataset.count);
    })(t0);
  }
  let countIO = null;
  function armCounters() {
    const list = document.querySelectorAll('.count[data-count]');
    if (!list.length) return;
    if (!('IntersectionObserver' in window) || reduceMotion) {
      list.forEach(el => { el.textContent = fmtCount(Number(el.dataset.count)); });
      return;
    }
    if (countIO) countIO.disconnect();
    countIO = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) { runCount(en.target); countIO.unobserve(en.target); }
      });
    }, { threshold: 0.6 });
    list.forEach(el => {
      if (countDone.has(el.dataset.count)) el.textContent = fmtCount(Number(el.dataset.count));
      else { el.textContent = '0'; countIO.observe(el); }
    });
  }
  armCounters();
  document.addEventListener('langchange', armCounters);

  /**
   * Navegação rápida (Ctrl/⌘ + K ou "/")
   */
  const waUrl = () => 'https://wa.me/5521993072147?text=' + encodeURIComponent(
    window.I18N && window.I18N.lang === 'en'
      ? "Hello André, I saw your résumé online and would like to talk."
      : 'Olá André, vi seu currículo online e gostaria de conversar.');
  function syncWa() { document.querySelectorAll('a[data-wa]').forEach(a => { a.href = waUrl(); }); }
  syncWa();
  document.addEventListener('langchange', syncWa);
  const T = (pt, en) => (window.I18N ? window.I18N.t(pt, en) : pt);
  const cmdItems = [
    { t: ['Início', 'Home'], i: 'bi-house', h: '#hero' },
    { t: ['Meu perfil', 'About me'], i: 'bi-person', h: '#about' },
    { t: ['Formação', 'Education'], i: 'bi-mortarboard', h: '#services' },
    { t: ['Certificações', 'Certifications'], i: 'bi-patch-check', h: '#certificacoes' },
    { t: ['Experiência profissional', 'Professional experience'], i: 'bi-briefcase', h: '#resume' },
    { t: ['Mapa de tecnologias', 'Technology map'], i: 'bi-diagram-2', h: '#tecnologias' },
    { t: ['Manuais', 'Manuals'], i: 'bi-journal-text', h: '#manuais' },
    { t: ['Recomendações', 'Recommendations'], i: 'bi-chat-quote', h: '#recommendation' },
    { t: ['Contato', 'Contact'], i: 'bi-envelope', h: '#contact' },
    { t: ['Baixar currículo (PDF)', 'Download résumé (PDF)'], i: 'bi-download', url: 'arquivos/analista_andrepedroso.pdf', act: true },
    { t: ['Cartão de visita digital (QR)', 'Digital business card (QR)'], i: 'bi-qr-code', modal: 'modalCartao', act: true },
    { t: ['Chamar no WhatsApp', 'Message on WhatsApp'], i: 'bi-whatsapp', get url() { return waUrl(); }, act: true },
    { t: ['Abrir LinkedIn', 'Open LinkedIn'], i: 'bi-linkedin', url: 'https://www.linkedin.com/in/andrelpedroso', act: true },
    { t: ['Enviar e-mail', 'Send an email'], i: 'bi-envelope-at', url: 'mailto:andrelp.pedroso@gmail.com', act: true },
    { t: ['Mudar idioma (PT/EN)', 'Switch language (PT/EN)'], i: 'bi-translate', lang: true, act: true },
    { t: ['Alternar tema claro/escuro', 'Toggle light/dark theme'], i: 'bi-circle-half', theme: true, act: true }
  ];
  const norm = str => str.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

  const cmdk = document.createElement('div');
  cmdk.className = 'cmdk';
  cmdk.setAttribute('role', 'dialog');
  cmdk.setAttribute('aria-modal', 'true');
  cmdk.setAttribute('aria-label', 'Navegação rápida');
  cmdk.innerHTML =
    '<div class="cmdk-box">' +
    '<input class="cmdk-input" type="text" autocomplete="off" spellcheck="false">' +
    '<ul class="cmdk-list" role="listbox"></ul>' +
    '<div class="cmdk-foot"><span></span><span></span><span></span></div>' +
    '</div>';
  document.body.appendChild(cmdk);
  const cmdInput = cmdk.querySelector('.cmdk-input');
  const cmdList = cmdk.querySelector('.cmdk-list');
  const cmdFoot = cmdk.querySelectorAll('.cmdk-foot span');
  function cmdLabels() {
    cmdInput.placeholder = T('Para onde você quer ir?', 'Where do you want to go?');
    cmdInput.setAttribute('aria-label', T('Buscar seção ou ação', 'Search sections or actions'));
    cmdk.setAttribute('aria-label', T('Navegação rápida', 'Quick navigation'));
    cmdFoot[0].textContent = T('↑ ↓ navegar', '↑ ↓ navigate');
    cmdFoot[1].textContent = T('Enter abrir', 'Enter open');
    cmdFoot[2].textContent = T('Esc fechar', 'Esc close');
  }
  cmdLabels();
  document.addEventListener('langchange', () => { cmdLabels(); cmdRender(); });
  let cmdFiltered = [];
  let cmdIndex = 0;
  let cmdPrevFocus = null;

  function cmdRender() {
    const q = norm(cmdInput.value.trim());
    cmdFiltered = cmdItems.filter(it => norm(it.t[0] + ' ' + it.t[1]).includes(q));
    cmdIndex = 0;
    cmdList.innerHTML = '';
    if (!cmdFiltered.length) {
      cmdList.innerHTML = '<li class="cmdk-empty"></li>';
      cmdList.firstChild.textContent = T('Nada encontrado', 'Nothing found');
      return;
    }
    cmdFiltered.forEach((it, idx) => {
      const li = document.createElement('li');
      li.className = 'cmdk-item';
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(idx === 0));
      li.innerHTML = '<i class="bi ' + it.i + '" aria-hidden="true"></i><span></span><small></small>';
      li.querySelector('span').textContent = T(it.t[0], it.t[1]);
      li.querySelector('small').textContent = it.act ? T('Ação', 'Action') : T('Seção', 'Section');
      li.addEventListener('mousemove', () => cmdSelect(idx));
      li.addEventListener('click', () => cmdRun(it));
      cmdList.appendChild(li);
    });
  }
  function cmdSelect(idx) {
    const items = cmdList.querySelectorAll('.cmdk-item');
    if (!items.length) return;
    cmdIndex = (idx + items.length) % items.length;
    items.forEach((el, n) => el.setAttribute('aria-selected', String(n === cmdIndex)));
    items[cmdIndex].scrollIntoView({ block: 'nearest' });
  }
  function cmdOpen() {
    cmdPrevFocus = document.activeElement;
    cmdInput.value = '';
    cmdRender();
    cmdk.classList.add('open');
    cmdInput.focus();
  }
  function cmdClose() {
    cmdk.classList.remove('open');
    if (cmdPrevFocus && cmdPrevFocus.focus) cmdPrevFocus.focus();
  }
  function cmdRun(it) {
    cmdClose();
    if (it.h) {
      const target = document.querySelector(it.h);
      if (target) target.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth' });
    } else if (it.modal) {
      const m = document.getElementById(it.modal);
      if (m && window.bootstrap) window.bootstrap.Modal.getOrCreateInstance(m).show();
    } else if (it.lang) {
      if (window.I18N) window.I18N.set(window.I18N.lang === 'en' ? 'pt' : 'en');
    } else if (it.theme) {
      applyTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'dark' : 'light');
    } else if (it.url && it.url.indexOf('mailto:') === 0) {
      window.location.href = it.url;
    } else if (it.url) {
      window.open(it.url, '_blank', 'noopener');
    }
  }
  cmdInput.addEventListener('input', cmdRender);
  cmdInput.addEventListener('keydown', e => {
    if (e.key === 'ArrowDown') { e.preventDefault(); cmdSelect(cmdIndex + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); cmdSelect(cmdIndex - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); if (cmdFiltered[cmdIndex]) cmdRun(cmdFiltered[cmdIndex]); }
  });
  cmdk.addEventListener('mousedown', e => { if (e.target === cmdk) cmdClose(); });
  document.addEventListener('keydown', e => {
    const isOpen = cmdk.classList.contains('open');
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      isOpen ? cmdClose() : cmdOpen();
    } else if (e.key === 'Escape' && isOpen) {
      cmdClose();
    } else if (e.key === '/' && !isOpen && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
      e.preventDefault();
      cmdOpen();
    }
  });


  /**
   * Diagrama interativo do projeto Fábrica Conectada (delegação de eventos: o modal vem depois do script)
   */
  const FX = {
    internet: [['Internet', 'Internet'], ['Saída para a internet. Todo o tráfego passa pelo firewall antes de chegar às redes internas.', 'Internet access. All traffic goes through the firewall before reaching the internal networks.']],
    fw: [['Firewall', 'Firewall'], ['Núcleo da rede: aplica as policies de acesso entre as redes e atende o DHCP. Conecta-se ao UniFi Gateway Ultra, que leva a rede aos access points.', 'Network core: enforces access policies between networks and serves DHCP. It connects to the UniFi Gateway Ultra, which carries the network to the access points.']],
    gateway: [['UniFi Gateway Ultra', 'UniFi Gateway Ultra'], ['Gateway UniFi posicionado entre o firewall e os 12 access points, integrando a rede Wi-Fi ao ecossistema UniFi.', 'UniFi gateway placed between the firewall and the 12 access points, integrating the Wi-Fi network into the UniFi ecosystem.']],
    radius: [['Servidor NPS / RADIUS', 'NPS / RADIUS server'], ['Autentica o acesso às redes configuradas para usar RADIUS, de acordo com as políticas de acesso definidas no projeto.', 'Authenticates access to the networks set up to use RADIUS, according to the access policies defined in the project.']],
    aps: [['12 Access Points UniFi', '12 UniFi access points'], ['Equipamentos que substituíram os Twibi, gerenciados no ecossistema UniFi, com a cobertura otimizada após a instalação.', 'Devices that replaced the Twibi units, managed in the UniFi ecosystem, with coverage optimized after installation.']],
    ssid: [['SSIDs segmentados', 'Segmented SSIDs'], ['Redes sem fio separadas por perfil de acesso, integradas às regras do firewall. São 5 SSIDs no total, incluindo a rede Guest.', 'Wireless networks separated by access profile and integrated with the firewall rules. There are 5 SSIDs in total, including the Guest network.']],
    guest: [['SSID Guest', 'Guest SSID'], ['Rede para visitantes, segmentada das demais redes.', 'Visitor network, segmented from the other networks.']]
  };
  let fxCurrent = null;
  function fxPick(key) {
    const info = document.getElementById('fx-info');
    const d = FX[key];
    if (!info || !d) return;
    fxCurrent = key;
    info.innerHTML = '<strong></strong><span></span>';
    info.firstChild.textContent = T(d[0][0], d[0][1]);
    info.lastChild.textContent = T(d[1][0], d[1][1]);
    document.querySelectorAll('.fx-node').forEach(n => n.classList.toggle('is-active', n.dataset.key === key));
  }
  document.addEventListener('langchange', () => {
    const info = document.getElementById('fx-info');
    if (!info) return;
    if (fxCurrent) { fxPick(fxCurrent); return; }
    info.innerHTML = '<strong></strong><span></span>';
    info.firstChild.textContent = T('Clique em um elemento', 'Click an element');
    info.lastChild.textContent = T('Toque ou clique em qualquer parte do diagrama para ver o papel dela na solução.', 'Tap or click any part of the diagram to see its role in the solution.');
  });
  document.addEventListener('click', e => {
    const n = e.target.closest && e.target.closest('.fx-node');
    if (n) fxPick(n.dataset.key);
  });
  document.addEventListener('keydown', e => {
    const n = e.target.closest && e.target.closest('.fx-node');
    if (n && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); fxPick(n.dataset.key); }
  });
  if (reduceMotion) window.addEventListener('load', () => document.querySelectorAll('.fx-pkt').forEach(el => el.remove()));

  /**
   * Navmenu Scrollspy
   */
  let navmenulinks = document.querySelectorAll('.navmenu a');

  function navmenuScrollspy() {
    navmenulinks.forEach(navmenulink => {
      if (!navmenulink.hash) return;
      let section = document.querySelector(navmenulink.hash);
      if (!section) return;
      let position = window.scrollY + 200;
      if (position >= section.offsetTop && position <= (section.offsetTop + section.offsetHeight)) {
        document.querySelectorAll('.navmenu a.active').forEach(link => link.classList.remove('active'));
        navmenulink.classList.add('active');
      } else {
        navmenulink.classList.remove('active');
      }
    })
  }
  window.addEventListener('load', navmenuScrollspy);
  document.addEventListener('scroll', navmenuScrollspy);

})();