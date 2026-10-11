/**
 * Tradução PT/EN sem recarregar a página.
 * O texto em português fica no HTML; o inglês vem do dicionário (i18n-en.js), indexado
 * pelo próprio conteúdo do elemento. Para trocar um texto em inglês, edite o dicionário.
 */
(function () {
  'use strict';

  const INLINE = new Set(['A', 'B', 'STRONG', 'EM', 'I', 'SPAN', 'BR', 'U', 'SMALL', 'MARK', 'CODE', 'KBD', 'SUB', 'SUP']);
  const SKIP = 'script,style,noscript,.typed,.typed-cursor,#fx-info,.cmdk,#focus-summary,#tm-result,.vc-toast,[data-i18n-skip],[data-lang-only],.testimonial-content p';
  const ATTRS = ['alt', 'title', 'aria-label', 'placeholder'];
  const SVGNS = 'http://www.w3.org/2000/svg';

  const hasLetters = s => /[A-Za-zÀ-ÿ]/.test(s);
  const norm = s => s.replace(/\s+/g, ' ').trim();

  function inlineOnly(el) {
    for (const c of el.children) {
      if (!INLINE.has(c.tagName) || !inlineOnly(c)) return false;
    }
    return true;
  }

  function collect(root) {
    const out = [];
    (function walk(el) {
      if (el.matches && el.matches(SKIP)) return;
      if (el.namespaceURI === SVGNS) {
        if (el.tagName === 'text') {
          if (hasLetters(el.textContent)) out.push({ type: 'el', el, key: norm(el.innerHTML) });
          return;
        }
      } else if (inlineOnly(el) && hasLetters(el.textContent) && !el.querySelector(SKIP)) {
        out.push({ type: 'el', el, key: norm(el.innerHTML) });
        return;
      }
      for (const n of el.childNodes) {
        if (n.nodeType === 1) walk(n);
        else if (n.nodeType === 3 && hasLetters(n.nodeValue)) out.push({ type: 'text', node: n, key: norm(n.nodeValue) });
      }
    })(root);
    root.querySelectorAll('[alt],[title],[aria-label],[placeholder]').forEach(el => {
      if (el.closest(SKIP)) return;
      ATTRS.forEach(a => {
        const v = el.getAttribute(a);
        if (v && hasLetters(v)) out.push({ type: 'attr', el, name: a, key: norm(v) });
      });
    });
    return out;
  }

  const touched = [];
  let lang = 'pt';

  function applyEn() {
    const dict = window.I18N_EN || {};
    const attrs = window.I18N_EN_ATTR || {};
    collect(document.body).forEach(u => {
      if (u.type === 'attr') {
        const en = attrs[u.key];
        if (en === undefined) return;
        touched.push({ type: 'attr', el: u.el, name: u.name, orig: u.el.getAttribute(u.name) });
        u.el.setAttribute(u.name, en);
        return;
      }
      const en = dict[u.key];
      if (en === undefined) return;
      if (u.type === 'el') {
        touched.push({ type: 'el', el: u.el, orig: u.el.innerHTML });
        u.el.innerHTML = en;
      } else {
        const v = u.node.nodeValue;
        touched.push({ type: 'text', node: u.node, orig: v });
        u.node.nodeValue = v.replace(v.trim(), en);
      }
    });
  }

  function revert() {
    while (touched.length) {
      const t = touched.pop();
      if (t.type === 'el') t.el.innerHTML = t.orig;
      else if (t.type === 'text') t.node.nodeValue = t.orig;
      else t.el.setAttribute(t.name, t.orig);
    }
  }

  function setMeta() {
    const M = window.I18N_META;
    if (!M) return;
    const en = lang === 'en';
    if (!setMeta.pt) {
      const q = s => document.querySelector(s);
      setMeta.pt = {
        title: document.title,
        description: (q('meta[name="description"]') || {}).content,
        ogTitle: (q('meta[property="og:title"]') || {}).content,
        ogDescription: (q('meta[property="og:description"]') || {}).content
      };
    }
    const src = en ? M : setMeta.pt;
    document.title = src.title;
    [['meta[name="description"]', src.description], ['meta[property="og:title"]', src.ogTitle],
     ['meta[property="og:description"]', src.ogDescription], ['meta[name="twitter:title"]', src.ogTitle],
     ['meta[name="twitter:description"]', src.ogDescription]].forEach(([sel, val]) => {
      const el = document.querySelector(sel);
      if (el && val) el.setAttribute('content', val);
    });
  }

  function set(next, opts) {
    opts = opts || {};
    next = next === 'en' ? 'en' : 'pt';
    if (next === lang && !opts.force) return;
    revert();
    lang = next;
    if (lang === 'en') applyEn();
    document.documentElement.lang = lang === 'en' ? 'en' : 'pt-BR';
    setMeta();
    document.querySelectorAll('[data-lang-set]').forEach(b => {
      b.setAttribute('aria-pressed', String(b.getAttribute('data-lang-set') === lang));
    });
    if (opts.persist !== false) {
      try { localStorage.setItem('lang', lang); } catch (e) {}
    }
    document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: lang, initial: !!opts.initial } }));
  }

  function detect() {
    try {
      const q = new URLSearchParams(location.search).get('lang');
      if (q === 'en' || q === 'pt') return q;
    } catch (e) {}
    try {
      const s = localStorage.getItem('lang');
      if (s === 'en' || s === 'pt') return s;
    } catch (e) {}
    const nav = ((navigator.languages && navigator.languages[0]) || navigator.language || 'pt').toLowerCase();
    return nav.indexOf('en') === 0 ? 'en' : 'pt';
  }

  window.I18N = {
    get lang() { return lang; },
    t: (pt, en) => (lang === 'en' ? en : pt),
    set: set,
    collect: collect,
    missing: function () {
      const dict = window.I18N_EN || {};
      const attrs = window.I18N_EN_ATTR || {};
      return collect(document.body).filter(u => (u.type === 'attr' ? attrs[u.key] : dict[u.key]) === undefined)
        .map(u => u.key);
    }
  };

  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('[data-lang-set]').forEach(btn => {
      btn.addEventListener('click', () => set(btn.getAttribute('data-lang-set')));
    });
    const first = detect();
    if (first === 'en') set('en', { initial: true, persist: false });
    else document.dispatchEvent(new CustomEvent('langchange', { detail: { lang: 'pt', initial: true } }));
  });
})();
