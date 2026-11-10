/* ===========================================================
   Web Wizard PoliPD — PAGE PAGER
   Puts "← Sebelumnya" and "Seterusnya →" at the foot of every page, so nobody
   has to scroll back up to the menu to move on. It follows the workshop order
   and jumps to the top of the next page.

   Drop-in: load after script.js, at the end of <body>.
   Self-contained — it brings its own styles, so there is no extra CSS file.
   =========================================================== */
(function () {
  'use strict';

  /* The workshop in order. Labels are the site's own, in BM then EN.
     'bina' and 'uji' are left out on purpose: the site folds them into
     Studio Builder and redirects them to #praktikal. */
  var PAGES = [
    { r: 'utama',      bm: 'Utama',                            en: 'Home' },
    { r: 'atur-cara',  bm: 'Agenda',                           en: 'Agenda' },
    { r: 'fasilitator',bm: 'Fasilitator',                      en: 'Facilitator' },
    { r: 'persediaan', bm: 'Selamat datang',                   en: 'Welcome' },
    { r: 'pra',        bm: 'Soal selidik awal dan icebreaker', en: 'Pre-workshop survey and icebreaker' },
    { r: 'kenali',     bm: 'Tujuan, contoh dan gaya laman',    en: 'Purpose, samples and website style' },
    { r: 'praktikal',  bm: 'Studio Builder',                   en: 'Studio Builder' },
    { r: 'rehat',      bm: 'Rehat',                            en: 'Break' },
    { r: 'terbit',     bm: 'Pilihan penerbitan',               en: 'Publishing options' },
    { r: 'github',     bm: 'GitHub Pages',                     en: 'GitHub Pages' },
    { r: 'netlify',    bm: 'Kemas kini & Netlify (pilihan)',   en: 'Update & Netlify (optional)' },
    { r: 'kongsi',     bm: 'Kongsi projek',                    en: 'Share your project' },
    { r: 'soal-jawab', bm: 'Soal jawab',                       en: 'Q&A' },
    { r: 'pasca',      bm: 'Soal selidik akhir',               en: 'Post-workshop survey' }
  ];

  /* routes the site folds into another page */
  var ALIAS = { '': 'utama', 'bina': 'praktikal', 'uji': 'praktikal' };

  var EN = function () { return document.documentElement.lang === 'en'; };
  var T = function (bm, en) { return EN() ? en : bm; };

  var CSS = [
    '.pgx{display:grid;grid-template-columns:1fr 1fr;gap:14px;align-items:stretch;',
    '  width:min(1100px,92%);margin:34px auto 44px}',
    '.pgx a{display:flex;flex-direction:column;gap:4px;padding:14px 18px;text-decoration:none;',
    '  background:var(--paper,#fffdf7);color:var(--ink,#10183b);border:2px solid var(--ink,#10183b);',
    '  border-radius:10px;box-shadow:4px 4px 0 var(--ink,#10183b);',
    '  transition:transform .2s ease,box-shadow .2s ease}',
    '.pgx a:hover{transform:translateY(-3px);box-shadow:6px 6px 0 var(--ink,#10183b)}',
    '.pgx a:focus-visible{outline:3px solid var(--blue,#163bcf);outline-offset:3px}',
    '.pgx .k{font:700 .7rem/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;',
    '  text-transform:uppercase;color:#6b7280}',
    '.pgx .t{font:800 1.02rem/1.25 var(--display,system-ui);letter-spacing:-.01em}',
    '.pgx .next{text-align:right;background:var(--blue,#163bcf);color:#fff;border-color:var(--ink,#10183b)}',
    '.pgx .next .k{color:#ffffffbb}',
    '.pgx .done{background:var(--yellow,#ffdf35);color:var(--ink,#10183b)}',
    '.pgx .done .k{color:#10183b99}',
    '.pgx .spacer{visibility:hidden}',
    '.pgx-count{grid-column:1/-1;order:-1;margin:0;text-align:center;',
    '  font:700 .72rem/1 ui-monospace,Menlo,Consolas,monospace;letter-spacing:.12em;',
    '  text-transform:uppercase;color:#6b7280}',
    '@media(max-width:620px){',
    '  .pgx{grid-template-columns:1fr;gap:10px;margin:26px auto 34px}',
    '  .pgx .next{text-align:left}',
    '  .pgx .spacer{display:none}',
    '}',
    '@media(prefers-reduced-motion:reduce){.pgx a{transition:none}}'
  ].join('\n');

  function injectCss() {
    if (document.getElementById('pgx-css')) return;
    var s = document.createElement('style');
    s.id = 'pgx-css';
    s.textContent = CSS;
    document.head.appendChild(s);
  }

  function currentRoute() {
    var h = (location.hash || '').replace('#', '');
    if (ALIAS[h] !== undefined) h = ALIAS[h];
    return h;
  }

  function indexOf(route) {
    for (var i = 0; i < PAGES.length; i++) if (PAGES[i].r === route) return i;
    return -1;
  }

  /* where the pager belongs on the page that is open now */
  function host() {
    var panel = document.getElementById('panel');
    if (panel && panel.offsetParent !== null) return { after: panel, parent: panel.parentNode };

    var ids = ['home', 'agenda-page', 'about-page'];
    for (var i = 0; i < ids.length; i++) {
      var el = document.getElementById(ids[i]);
      if (el && !el.hidden && el.offsetParent !== null) return { after: null, parent: el };
    }
    return null;
  }

  var pager = null;

  function build() {
    pager = document.createElement('nav');
    pager.className = 'pgx';
    pager.setAttribute('aria-label', 'Halaman sebelum dan seterusnya');
    pager.innerHTML =
      '<p class="pgx-count"></p>' +
      '<a class="prev" href="#"><span class="k"></span><span class="t"></span></a>' +
      '<a class="next" href="#"><span class="k"></span><span class="t"></span></a>';
    return pager;
  }

  function go(e) {
    var a = e.currentTarget, route = a.getAttribute('href').replace('#', '');
    if (!route) { e.preventDefault(); return; }
    // let the site route as usual, then start the new page at the top
    setTimeout(function () {
      try { window.scrollTo({ top: 0, behavior: 'smooth' }); }
      catch (err) { window.scrollTo(0, 0); }
    }, 60);
  }

  function render() {
    var place = host();
    if (!place) { if (pager) pager.remove(); return; }

    var i = indexOf(currentRoute());
    if (i < 0) { if (pager) pager.remove(); return; }

    if (!pager) build();
    pager.querySelectorAll('a').forEach(function (a) {
      a.removeEventListener('click', go);
      a.addEventListener('click', go);
    });

    var prev = PAGES[i - 1], next = PAGES[i + 1],
        aPrev = pager.querySelector('.prev'), aNext = pager.querySelector('.next');

    pager.querySelector('.pgx-count').textContent =
      T('Bahagian ', 'Part ') + (i + 1) + T(' daripada ', ' of ') + PAGES.length;

    if (prev) {
      aPrev.href = '#' + prev.r;
      aPrev.classList.remove('spacer');
      aPrev.querySelector('.k').textContent = T('← Sebelumnya', '← Previous');
      aPrev.querySelector('.t').textContent = T(prev.bm, prev.en);
      aPrev.removeAttribute('aria-hidden');
      aPrev.removeAttribute('tabindex');
    } else {
      aPrev.href = '#';
      aPrev.classList.add('spacer');
      aPrev.setAttribute('aria-hidden', 'true');
      aPrev.tabIndex = -1;
      aPrev.querySelector('.k').textContent = '';
      aPrev.querySelector('.t').textContent = '';
    }

    if (next) {
      aNext.href = '#' + next.r;
      aNext.classList.remove('done');
      aNext.querySelector('.k').textContent = T('Seterusnya →', 'Next →');
      aNext.querySelector('.t').textContent = T(next.bm, next.en);
    } else {
      // last page of the workshop
      aNext.href = '#utama';
      aNext.classList.add('done');
      aNext.querySelector('.k').textContent = T('Tamat 🎉', 'All done 🎉');
      aNext.querySelector('.t').textContent = T('Kembali ke Utama', 'Back to Home');
    }

    if (place.after) {
      if (place.after.nextSibling !== pager) place.parent.insertBefore(pager, place.after.nextSibling);
    } else if (pager.parentNode !== place.parent || pager !== place.parent.lastElementChild) {
      place.parent.appendChild(pager);
    }
  }

  var pending = 0;
  function soon() { clearTimeout(pending); pending = setTimeout(render, 120); }

  function start() {
    injectCss();
    render();
    window.addEventListener('hashchange', soon);
    window.addEventListener('load', soon);

    if ('MutationObserver' in window) {
      // the workshop rebuilds #panel on every topic, and the language switch rewrites text
      var panel = document.getElementById('panel');
      if (panel) new MutationObserver(soon).observe(panel, { childList: true });
      new MutationObserver(soon).observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });
      ['home', 'agenda-page', 'about-page'].forEach(function (id) {
        var el = document.getElementById(id);
        if (el) new MutationObserver(soon).observe(el, { attributes: true, attributeFilter: ['hidden'] });
      });
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
