/* ===========================================================
   Web Wizard PoliPD — HERO MOTION LAYER
   Gives every page hero the same motion: the caption slides in line by line,
   keyword chips float around the art, sparkles twinkle, and the
   01-02-03 process flow plays with a travelling rocket.

   Drop-in: load after script.js, at the end of <body>.
   It only adds decoration, and it never changes the page layout or wording.
   =========================================================== */
(function () {
  'use strict';

  var reduced = window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches;
  var EN = function () { return document.documentElement.lang === 'en'; };
  var T = function (bm, en) { return EN() ? en : bm; };

  /* ---------- the keyword chips for each hero, BM first then EN ---------- */
  /* 'live' marks the chip that gets the pulsing red dot. */
  var WORDS = {
    utama: [
      { bm: '✦ AI sedang menulis kod…', en: '✦ AI is writing the code…' },
      { bm: 'LIVE!', en: 'LIVE!', live: true, cls: 'alt' },
      { bm: 'Anda sudah sedia?', en: 'Are you ready?', cls: 'sun' },
      { bm: 'Jom mula sesi ❤️', en: "Let's start the session ❤️", cls: 'sky' }
    ],
    'atur-cara': [
      { bm: '⏱ 4 jam · 5 bahagian', en: '⏱ 4 hours · 5 parts' },
      { bm: 'LIVE!', en: 'LIVE!', live: true, cls: 'alt' },
      { bm: '8.45 pagi · Google Meet', en: '8.45 am · Google Meet', cls: 'sky' },
      { bm: 'Jom mula ❤️', en: "Let's begin ❤️", cls: 'sun' }
    ],
    fasilitator: [
      { bm: '👋 Madam Julie', en: '👋 Madam Julie' },
      { bm: 'AI Educator', en: 'AI Educator', cls: 'alt' },
      { bm: 'POLIPD · JPA', en: 'POLIPD · JPA', cls: 'sky' },
      { bm: 'Jom belajar ❤️', en: "Let's learn ❤️", cls: 'sun' }
    ],
    persediaan: [
      { bm: '✅ Anda sudah sedia?', en: '✅ Are you ready?' },
      { bm: 'ChatGPT atau Claude', en: 'ChatGPT or Claude', cls: 'sky' },
      { bm: 'Akaun GitHub', en: 'GitHub account', cls: 'alt' },
      { bm: 'Jom mula ❤️', en: "Let's start ❤️", cls: 'sun' }
    ],
    kenali: [
      { bm: '4 jenis laman', en: '4 kinds of site' },
      { bm: '3 gaya reka bentuk', en: '3 design styles', cls: 'sky' },
      { bm: '✦ Pilih idea anda', en: '✦ Pick your idea', cls: 'sun' },
      { bm: 'LIVE!', en: 'LIVE!', live: true, cls: 'alt' }
    ],
    praktikal: [
      { bm: '⚡ Bina sekarang', en: '⚡ Build it now' },
      { bm: 'Tanpa pengekodan', en: 'No coding', cls: 'sun' },
      { bm: 'laman-saya.zip', en: 'my-site.zip', cls: 'alt' },
      { bm: 'LIVE!', en: 'LIVE!', live: true, cls: 'sky' }
    ],
    terbit: [
      { bm: '🚀 Terbitkan!', en: '🚀 Publish it!' },
      { bm: 'GitHub Pages', en: 'GitHub Pages', cls: 'alt' },
      { bm: 'LIVE!', en: 'LIVE!', live: true, cls: 'sun' },
      { bm: 'Pautan awam anda', en: 'Your public link', cls: 'sky' }
    ],
    kongsi: [
      { bm: '❤ 24', en: '❤ 24', cls: 'sun' },
      { bm: 'laman-saya.netlify.app', en: 'my-site.netlify.app', live: true, cls: 'alt' },
      { bm: '⭐ Galeri', en: '⭐ Gallery' },
      { bm: 'Tahniah! 🎉', en: 'Well done! 🎉', cls: 'sky' }
    ]
  };

  /* Where the chips sit, as a share of the art box.
     On the wide heroes (Utama, Agenda, Perkongsian) the art box spans the whole
     hero, so the chips hug the right-hand side where the wizard stands and stay
     clear of the headline. On the narrow section banners the art box is already
     just the picture, so the chips ring the whole of it. */
  var SPOTS_WIDE = [
    { left: '44%', top: '9%',  dur: '5.2s' },
    { left: '76%', top: '3%',  dur: '6.1s' },
    { left: '38%', top: '60%', dur: '5.7s' },
    { left: '72%', top: '73%', dur: '6.6s' }
  ];
  var SPOTS_NARROW = [
    { left: '3%',  top: '13%', dur: '5.2s' },
    { left: '55%', top: '4%',  dur: '6.1s' },
    { left: '1%',  top: '69%', dur: '5.7s' },
    { left: '58%', top: '77%', dur: '6.6s' }
  ];
  var SPARKS_WIDE = [
    { left: '52%', top: '12%', d: '0s'   },
    { left: '88%', top: '30%', d: '.6s'  },
    { left: '47%', top: '44%', d: '1.2s' },
    { left: '81%', top: '62%', d: '1.8s' },
    { left: '64%', top: '18%', d: '2.3s' }
  ];
  var SPARKS_NARROW = [
    { left: '30%', top: '10%', d: '0s'   },
    { left: '82%', top: '27%', d: '.6s'  },
    { left: '24%', top: '58%', d: '1.2s' },
    { left: '70%', top: '66%', d: '1.8s' },
    { left: '46%', top: '20%', d: '2.3s' }
  ];

  /* ---------- which hero is on screen right now ---------- */
  function shown(el) { return el && el.offsetParent !== null; }

  function currentHero() {
    var hx = document.getElementById('hx-art');
    if (shown(hx)) return { art: hx, cap: document.querySelector('.hx-in'), slug: 'utama', big: true };

    var ag = document.querySelector('#agenda-page .ag-art');
    if (shown(ag)) return { art: ag, cap: document.querySelector('#agenda-page .pg-hero-copy'), slug: 'atur-cara', big: true };

    var ab = document.querySelector('#about-page .ab-photo');
    if (shown(ab)) return { art: null, cap: document.querySelector('#about-page .pg-hero-copy'), slug: 'fasilitator', big: true };

    var wi = document.getElementById('wi-art');
    if (shown(wi)) {
      var img = document.getElementById('section-art');
      var m = /hero-([a-z-]+)\.webp/.exec((img && img.getAttribute('src')) || '');
      var slug = m ? m[1] : 'persediaan';
      if (slug === 'home') slug = 'persediaan';
      return {
        art: wi,
        cap: document.querySelector('.workspace-intro'),
        slug: WORDS[slug] ? slug : 'persediaan',
        big: wi.classList.contains('wi-big') || (wi.parentElement && wi.parentElement.classList.contains('wi-big'))
      };
    }
    return null;
  }

  /* ---------- build the chips and sparkles ---------- */
  function decorate(hero) {
    var art = hero.art;
    if (!art) return;

    art.classList.add('hm-art');
    art.classList.toggle('hm-sm', !hero.big);

    // clear what any earlier page left behind, including heroes now hidden
    Array.prototype.forEach.call(document.querySelectorAll('.hm-chip, .hm-tw'), function (n) { n.remove(); });

    var list = WORDS[hero.slug] || WORDS.persediaan;
    var SPOTS = hero.big ? SPOTS_WIDE : SPOTS_NARROW;
    var SPARKS = hero.big ? SPARKS_WIDE : SPARKS_NARROW;

    list.forEach(function (w, i) {
      var spot = SPOTS[i];
      if (!spot) return;
      var chip = document.createElement('span');
      chip.className = 'hm-chip c' + (i + 1) + (w.cls ? ' ' + w.cls : '');
      chip.style.left = spot.left;
      chip.style.top = spot.top;
      chip.style.setProperty('--d', (0.75 + i * 0.16) + 's');
      chip.style.setProperty('--dur', spot.dur);
      chip.setAttribute('aria-hidden', 'true');
      if (w.live) {
        var dot = document.createElement('i');
        dot.className = 'dot';
        chip.appendChild(dot);
      }
      chip.appendChild(document.createTextNode(T(w.bm, w.en)));
      art.appendChild(chip);
    });

    if (!reduced) {
      SPARKS.forEach(function (s) {
        var tw = document.createElement('span');
        tw.className = 'hm-tw';
        tw.style.left = s.left;
        tw.style.top = s.top;
        tw.style.setProperty('--d', s.d);
        tw.setAttribute('aria-hidden', 'true');
        art.appendChild(tw);
      });
    }
  }

  /* ---------- replay the caption slide-in ---------- */
  function playCaption(hero) {
    var cap = hero.cap;
    if (!cap) return;
    cap.classList.add('hm-cap');

    // split the headline into words so they can rise one by one.
    // The workspace reuses one <h1> and rewrites its text on every page, so this
    // has to run again each time rather than only once.
    var h1 = cap.querySelector('h1');
    if (h1 && !h1.querySelector('.hm-word')) {
      var plain = Array.prototype.every.call(h1.childNodes, function (n) { return n.nodeType === 3; });
      if (plain && h1.textContent.trim()) {
        var words = h1.textContent.trim().split(/\s+/);
        h1.textContent = '';
        words.forEach(function (word, i) {
          var span = document.createElement('span');
          span.className = 'hm-word';
          span.style.setProperty('--w', i);
          span.textContent = word;
          h1.appendChild(span);
          if (i < words.length - 1) h1.appendChild(document.createTextNode(' '));
        });
        h1.dataset.hmSplit = '1';
      }
    }

    // restart the animation
    cap.classList.remove('hm-go');
    if (hero.art) hero.art.classList.remove('hm-go');
    void cap.offsetWidth;
    cap.classList.add('hm-go');
    if (hero.art) hero.art.classList.add('hm-go');
  }

  /* ---------- run for whichever hero is showing ---------- */
  var lastKey = '';
  function refresh(force) {
    var hero = currentHero();
    if (!hero) return;
    var key = hero.slug + '|' + (EN() ? 'en' : 'ms') + '|' + (hero.big ? 'b' : 's');
    if (!force && key === lastKey) return;
    lastKey = key;
    decorate(hero);
    playCaption(hero);
  }

  var pending = 0;
  function soon(force) {
    clearTimeout(pending);
    pending = setTimeout(function () { refresh(force); }, 90);
  }

  /* ---------- the five-stage process flow on the landing page ----------
     Same five stages as the Agenda: Mula → Kenali → Bina → Terbit → Kongsi.
     The three cards below light up as the rocket passes their stage. ---------- */
  var flowTimer = 0, flowStep = 0, flowBuilt = false, flowPlayed = false;

  var STAGES = [
    { bm: 'Mula',   en: 'Start',   sub: ['Sedia dan berkenalan', 'Get set and say hello'],      c: 'blue',   go: 'persediaan', card: 0 },
    { bm: 'Kenali', en: 'Explore', sub: ['Faham asas laman web', 'Learn how websites work'],    c: 'yellow', go: 'kenali',     card: 1 },
    { bm: 'Bina',   en: 'Build',   sub: ['Bina, uji dan muat turun', 'Build, test and download'], c: 'red',  go: 'praktikal',  card: 2 },
    { bm: 'Terbit', en: 'Publish', sub: ['Dari fail ke pautan awam', 'From file to public link'], c: 'green', go: 'terbit',    card: 3 },
    { bm: 'Kongsi', en: 'Share',   sub: ['Tunjuk, tanya dan maklum balas', 'Show, ask and give feedback'], c: 'ink', go: 'kongsi', card: 4 }
  ];

  function buildFlow() {
    var grid = document.querySelector('.home-grid');
    if (!grid || flowBuilt) return;
    flowBuilt = true;

    var cards = Array.prototype.slice.call(grid.children);
    var n = STAGES.length;

    var flow = document.createElement('div');
    flow.className = 'hm-flow';

    var rail = document.createElement('div');
    rail.className = 'hm-flow-rail';

    var line = document.createElement('div');
    line.className = 'hm-flow-line';
    var fill = document.createElement('span');
    fill.className = 'hm-flow-fill';
    line.appendChild(fill);

    var rocket = document.createElement('span');
    rocket.className = 'hm-rocket';
    rocket.textContent = '🚀';
    rocket.setAttribute('aria-hidden', 'true');

    rail.appendChild(line);
    rail.appendChild(rocket);

    var stops = STAGES.map(function (st, i) {
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'hm-flow-stop is-' + st.c;
      b.style.left = ((i / (n - 1)) * 100) + '%';
      var num = document.createElement('span');
      num.className = 'hm-stop-num';
      num.textContent = String(i + 1);
      var lab = document.createElement('span');
      lab.className = 'hm-stop-label';
      b.appendChild(num);
      b.appendChild(lab);
      b.addEventListener('click', function () { stop(); paint(i); location.hash = '#' + st.go; });
      rail.appendChild(b);
      return b;
    });

    var tools = document.createElement('div');
    tools.className = 'hm-flow-tools';
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn sm';
    var hint = document.createElement('small');
    hint.className = 'hint';

    function label() {
      btn.textContent = flowTimer ? T('⏸ Jeda', '⏸ Pause') : T('▶ Mainkan aliran', '▶ Play the flow');
      hint.textContent = T('Lima bahagian bengkel. Tekan mana-mana langkah untuk terus ke situ.',
                           'The five parts of the workshop. Tap any step to go straight there.');
      STAGES.forEach(function (st, i) {
        stops[i].querySelector('.hm-stop-label').textContent = T(st.bm, st.en);
        stops[i].setAttribute('aria-label',
          T('Bahagian ', 'Part ') + (i + 1) + ': ' + T(st.bm, st.en) + ' — ' + T(st.sub[0], st.sub[1]));
      });
    }

    function paint(i) {
      flowStep = Math.max(0, Math.min(n - 1, i));
      var pct = (flowStep / (n - 1)) * 100;
      fill.style.width = pct + '%';
      rocket.style.left = pct + '%';
      rocket.classList.toggle('lift', flowStep === n - 1);
      stops.forEach(function (s, j) {
        s.classList.toggle('done', j < flowStep);
        s.classList.toggle('on', j === flowStep);
      });
      var active = STAGES[flowStep].card;
      cards.forEach(function (c, j) { c.classList.toggle('hm-now', j === active); });
    }

    function stop() { clearInterval(flowTimer); flowTimer = 0; label(); }
    function play() {
      if (reduced) { paint(n - 1); return; }
      stop();
      paint(0);
      flowTimer = setInterval(function () {
        if (flowStep >= n - 1) { stop(); return; }
        paint(flowStep + 1);
      }, 1500);
      label();
    }

    btn.addEventListener('click', function () { if (flowTimer) stop(); else play(); });

    tools.appendChild(btn);
    tools.appendChild(hint);
    flow.appendChild(rail);
    flow.appendChild(tools);
    grid.parentNode.insertBefore(flow, grid);

    paint(0);
    label();
    flow.hmLabel = label;

    // play once, the first time it scrolls into view
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (es) {
        if (!es[0].isIntersecting || flowPlayed) return;
        flowPlayed = true;
        io.disconnect();
        setTimeout(play, 500);
      }, { threshold: 0.35 });
      io.observe(grid);
    }
  }

  function relabelFlow() {
    var flow = document.querySelector('.hm-flow');
    if (flow && flow.hmLabel) flow.hmLabel();
  }

  /* ---------- wire it up ---------- */
  function start() {
    buildFlow();
    refresh(true);

    window.addEventListener('hashchange', function () { soon(false); });

    // the section art is swapped in by script.js when a workspace page opens
    var art = document.getElementById('section-art');
    if (art && 'MutationObserver' in window) {
      new MutationObserver(function () { soon(false); }).observe(art, { attributes: true, attributeFilter: ['src'] });
    }

    // follow the BM / EN switch
    if ('MutationObserver' in window) {
      new MutationObserver(function () { soon(true); relabelFlow(); })
        .observe(document.documentElement, { attributes: true, attributeFilter: ['lang'] });

      // a workspace page can also be revealed without the art src changing
      var ws = document.querySelector('.workspace');
      if (ws) new MutationObserver(function () { soon(false); }).observe(ws, { attributes: true, attributeFilter: ['hidden'] });
    }

    window.addEventListener('load', function () { soon(false); });
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start);
  else start();
})();
