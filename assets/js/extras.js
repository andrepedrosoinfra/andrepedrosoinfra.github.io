/**
 * Recursos extras: mapa de tecnologias e cartão de visita digital.
 */
(function () {
  'use strict';

  function init() {

    const T = (pt, en) => (window.I18N ? window.I18N.t(pt, en) : pt);
    const SITE = 'https://andrepedrosoinfra.github.io/';

    /* ---------- Copiar texto ---------- */
    function copyText(text) {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        return navigator.clipboard.writeText(text).catch(() => legacyCopy(text));
      }
      return legacyCopy(text);
    }
    function legacyCopy(text) {
      return new Promise(resolve => {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); } catch (e) {}
        ta.remove();
        resolve();
      });
    }

    /* ---------- Mapa de tecnologias ---------- */
    const map = document.getElementById('tecnologias');
    const techEls = map ? Array.from(map.querySelectorAll('.tm-tech')) : [];
    const itemEls = map ? Array.from(map.querySelectorAll('.tm-item')) : [];
    const itemsOfTech = {};
    itemEls.forEach(i => i.dataset.techs.split(' ').forEach(t => { (itemsOfTech[t] = itemsOfTech[t] || []).push(i); }));
    let sel = null;

    function openTarget(el) {
      if (el.dataset.modal && window.bootstrap) {
        const m = document.getElementById(el.dataset.modal);
        if (m) window.bootstrap.Modal.getOrCreateInstance(m).show();
      } else if (el.dataset.target) {
        const t = document.querySelector(el.dataset.target);
        if (t) t.scrollIntoView({ behavior: 'smooth' });
      }
    }

    function paintMap() {
      if (!map) return;
      const on = { tech: new Set(), item: new Set() };
      let selItem = null;
      if (sel && sel.kind === 'tech') {
        on.tech.add(sel.key);
        (itemsOfTech[sel.key] || []).forEach(i => on.item.add(i.dataset.item));
      } else if (sel && sel.kind === 'item') {
        selItem = itemEls.find(i => i.dataset.item === sel.key);
        on.item.add(sel.key);
        selItem.dataset.techs.split(' ').forEach(t => on.tech.add(t));
      }
      map.classList.toggle('has-sel', !!sel);
      techEls.forEach(e => {
        e.classList.toggle('is-on', on.tech.has(e.dataset.tech));
        e.setAttribute('aria-pressed', String(!!sel && sel.kind === 'tech' && sel.key === e.dataset.tech));
      });
      itemEls.forEach(e => {
        e.classList.toggle('is-on', on.item.has(e.dataset.item));
        e.setAttribute('aria-pressed', String(!!sel && sel.kind === 'item' && sel.key === e.dataset.item));
      });

      const out = document.getElementById('tm-result');
      out.innerHTML = '';
      if (!sel) {
        const h = document.createElement('span');
        h.className = 'tm-hint';
        h.textContent = T('Clique em uma tecnologia ou em um item para ver as conexões.', 'Click a technology or an item to see the connections.');
        out.appendChild(h);
        return;
      }
      const title = document.createElement('strong');
      out.appendChild(title);
      const line = document.createElement('span');
      out.appendChild(line);
      const list = document.createElement('div');
      list.className = 'tm-links';
      out.appendChild(list);

      if (sel.kind === 'tech') {
        const el = techEls.find(e => e.dataset.tech === sel.key);
        const n = (itemsOfTech[sel.key] || []).length;
        title.textContent = el.textContent;
        line.textContent = T(
          ' aparece em ' + n + (n === 1 ? ' frente:' : ' frentes:'),
          ' appears in ' + n + (n === 1 ? ' area:' : ' areas:'));
        (itemsOfTech[sel.key] || []).forEach(i => {
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'tm-go';
          b.textContent = i.textContent;
          if (i.dataset.modal || i.dataset.target) {
            b.insertAdjacentHTML('beforeend', ' <i class="bi bi-box-arrow-up-right" aria-hidden="true"></i>');
            b.addEventListener('click', () => openTarget(i));
          } else {
            b.addEventListener('click', () => { sel = { kind: 'item', key: i.dataset.item }; paintMap(); });
          }
          list.appendChild(b);
        });
      } else {
        title.textContent = selItem.textContent;
        line.textContent = T(' envolve:', ' involves:');
        selItem.dataset.techs.split(' ').forEach(t => {
          const el = techEls.find(e => e.dataset.tech === t);
          if (!el) return;
          const b = document.createElement('button');
          b.type = 'button';
          b.className = 'tm-go';
          b.textContent = el.textContent;
          b.addEventListener('click', () => { sel = { kind: 'tech', key: t }; paintMap(); });
          list.appendChild(b);
        });
        if (selItem.dataset.modal || selItem.dataset.target) {
          const open = document.createElement('button');
          open.type = 'button';
          open.className = 'tm-open';
          open.innerHTML = '<i class="bi bi-box-arrow-up-right" aria-hidden="true"></i> ';
          open.appendChild(document.createTextNode(selItem.dataset.modal ? T('Ver detalhes do projeto', 'View project details') : T('Ver na página', 'See on the page')));
          open.addEventListener('click', () => openTarget(selItem));
          out.appendChild(open);
        }
      }
    }

    if (map) {
      map.addEventListener('click', e => {
        const chip = e.target.closest('.tm-chip');
        if (!chip) return;
        const next = chip.classList.contains('tm-tech')
          ? { kind: 'tech', key: chip.dataset.tech }
          : { kind: 'item', key: chip.dataset.item };
        sel = sel && sel.kind === next.kind && sel.key === next.key ? null : next;
        paintMap();
      });
    }

    /* ---------- Cartão de visita digital ---------- */
    const copyBtn = document.querySelector('.vc-copy');
    const shareBtn = document.querySelector('.vc-share');
    const toast = document.querySelector('.vc-toast');
    function say(pt, en) {
      if (!toast) return;
      toast.textContent = T(pt, en);
      clearTimeout(say.t);
      say.t = setTimeout(() => { toast.textContent = ''; }, 2200);
    }
    if (copyBtn) copyBtn.addEventListener('click', () => copyText(SITE).then(() => say('Link copiado!', 'Link copied!')));
    if (shareBtn && navigator.share) {
      shareBtn.hidden = false;
      shareBtn.addEventListener('click', () => {
        navigator.share({
          title: 'André Pedroso',
          text: T('André Pedroso | Analista de Infraestrutura e Suporte', 'André Pedroso | Infrastructure and Support Analyst'),
          url: SITE
        }).catch(() => {});
      });
    }

    /* ---------- Idioma e URL ---------- */
    document.addEventListener('langchange', () => {
      paintMap();
    });

    paintMap();
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();
})();
