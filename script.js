/* ============================================================
   ETHICAL HACKING · INTERACTIVE FIELD NOTES — behaviour
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) =>
    ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     TOAST
     ========================================================== */
  let toastEl, toastTimer;
  function toast(msg) {
    if (!toastEl) {
      toastEl = document.createElement('div');
      toastEl.className = 'toast';
      document.body.appendChild(toastEl);
    }
    toastEl.textContent = msg;
    toastEl.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toastEl.classList.remove('show'), 1700);
  }

  /* ==========================================================
     BOOT SEQUENCE
     ========================================================== */
  function boot() {
    const wrap = $('#boot'), log = $('#bootLog'), bar = $('#bootBar');
    if (!wrap) return;

    let finished = false;
    const finish = () => {
      if (finished) return;          // guard: skip + auto-complete must not both run
      finished = true;
      wrap.classList.add('done');
      document.body.classList.remove('locked');
      setTimeout(() => { wrap.remove(); }, 650);
      startTyping();
      startTerminal();
    };

    if (reduced || sessionStorage.getItem('eh-booted')) { finish(); return; }

    document.body.classList.add('locked');
    sessionStorage.setItem('eh-booted', '1');

    let i = 0;
    const lines = DATA.boot;
    const step = () => {
      if (i >= lines.length) { setTimeout(finish, 420); return; }
      const line = lines[i];
      const cls = /\[\s*(OK|SIGNED)\s*\]/.test(line) ? 'ok' : 'dim';
      log.insertAdjacentHTML('beforeend',
        '<span class="' + cls + '">$ ' + esc(line) + '</span>\n');
      i++;
      bar.style.width = (i / lines.length * 100) + '%';
      setTimeout(step, 210 + Math.random() * 170);
    };
    step();

    $('#bootSkip').addEventListener('click', finish);
    document.addEventListener('keydown', function onEsc(e) {
      if (e.key === 'Escape') { finish(); document.removeEventListener('keydown', onEsc); }
    });
  }

  /* ==========================================================
     MATRIX RAIN
     ========================================================== */
  function matrix() {
    const cv = $('#matrix');
    if (!cv || reduced) return;
    const ctx = cv.getContext('2d');
    const chars = '01<>{}[]()/\\|#$%&*+=?!;:nmapxsssqli0x1fAEBCD'.split('');
    let cols, drops, fs = 14;

    function size() {
      cv.width = window.innerWidth;
      cv.height = window.innerHeight;
      cols = Math.floor(cv.width / fs);
      drops = new Array(cols).fill(0).map(() => Math.random() * -60);
    }
    size();
    window.addEventListener('resize', size);

    let last = 0;
    (function draw(ts) {
      requestAnimationFrame(draw);
      if (ts - last < 58) return;
      last = ts;
      ctx.fillStyle = 'rgba(5,7,10,.09)';
      ctx.fillRect(0, 0, cv.width, cv.height);
      ctx.font = fs + 'px JetBrains Mono, monospace';
      const acc = getComputedStyle(document.documentElement)
        .getPropertyValue('--acc').trim() || '#22e88a';
      for (let i = 0; i < cols; i++) {
        const ch = chars[(Math.random() * chars.length) | 0];
        ctx.fillStyle = Math.random() > .975 ? '#ffffff' : acc;
        ctx.fillText(ch, i * fs, drops[i] * fs);
        if (drops[i] * fs > cv.height && Math.random() > .972) drops[i] = 0;
        drops[i]++;
      }
    })(0);
  }

  /* ==========================================================
     HERO TYPING
     ========================================================== */
  function startTyping() {
    const el = $('#typeTarget');
    if (!el) return;
    if (reduced) { el.textContent = DATA.typeLines[0]; return; }
    let li = 0, ci = 0, del = false;
    (function tick() {
      const full = DATA.typeLines[li];
      el.textContent = full.slice(0, ci);
      if (!del && ci < full.length) { ci++; setTimeout(tick, 42); }
      else if (!del && ci === full.length) { del = true; setTimeout(tick, 1900); }
      else if (del && ci > 0) { ci--; setTimeout(tick, 20); }
      else { del = false; li = (li + 1) % DATA.typeLines.length; setTimeout(tick, 320); }
    })();
  }

  /* ==========================================================
     HERO TERMINAL
     ========================================================== */
  function startTerminal() {
    const el = $('#termBody');
    if (!el) return;
    const script = DATA.terminal;

    if (reduced) {
      el.innerHTML = script.map(l => l.t === 'gap' ? '\n'
        : '<span class="' + (l.t === 'ps1' ? 'ps1' : l.t) + '">' + esc(l.v) + '</span>' +
          (l.cmd ? '<span class="cmd">' + esc(l.cmd) + '</span>' : '') + '\n').join('');
      return;
    }

    let i = 0;
    function next() {
      if (i >= script.length) { setTimeout(() => { el.innerHTML = ''; i = 0; next(); }, 5200); return; }
      const l = script[i];
      if (l.t === 'gap') { el.insertAdjacentHTML('beforeend', '\n'); i++; return next(); }
      if (l.t === 'ps1') {
        el.insertAdjacentHTML('beforeend', '<span class="ps1">' + esc(l.v) + '</span>');
        const span = document.createElement('span');
        span.className = 'cmd';
        el.appendChild(span);
        let c = 0;
        (function typeCmd() {
          if (c <= l.cmd.length) {
            span.textContent = l.cmd.slice(0, c);
            c++;
            setTimeout(typeCmd, 46);
          } else {
            el.insertAdjacentHTML('beforeend', '\n');
            i++;
            setTimeout(next, 340);
          }
        })();
        return;
      }
      el.insertAdjacentHTML('beforeend',
        '<span class="' + l.t + '">' + esc(l.v) + '</span>\n');
      i++;
      setTimeout(next, 170);
    }
    next();
  }

  /* ==========================================================
     COUNTERS
     ========================================================== */
  function counters() {
    $$('[data-count]').forEach((el) => {
      const target = +el.dataset.count;
      const io = new IntersectionObserver((es) => {
        es.forEach((e) => {
          if (!e.isIntersecting) return;
          io.disconnect();
          if (reduced) { el.textContent = target; return; }
          let v = 0;
          const t = setInterval(() => {
            v++;
            el.textContent = v;
            if (v >= target) clearInterval(t);
          }, 130);
        });
      }, { threshold: .4 });
      io.observe(el);
    });
  }

  /* ==========================================================
     TERMS ACCORDION
     ========================================================== */
  function terms() {
    const box = $('#termList');
    if (!box) return;
    box.innerHTML = DATA.terms.map((t, i) =>
      '<details' + (i === 0 ? ' open' : '') + '>' +
        '<summary><b>' + esc(t.term) + '</b><i>' + esc(t.short) + '</i></summary>' +
        '<p>' + esc(t.body) + '</p>' +
      '</details>').join('');
  }

  /* ==========================================================
     PHASES
     ========================================================== */
  function phases() {
    const rail = $('#phaseRail'), detail = $('#phaseDetail');
    if (!rail) return;

    rail.innerHTML = DATA.phases.map((p, i) =>
      '<button class="phase-btn' + (i === 0 ? ' on' : '') + '" data-i="' + i + '" ' +
        'style="--pc:' + p.colour + '">' +
        '<span class="pn">PHASE ' + p.n + '</span>' +
        '<span class="pt">' + esc(p.name) + '</span>' +
        '<span class="pd">' + esc(p.short) + '</span>' +
      '</button>').join('');

    function render(i) {
      const p = DATA.phases[i];
      detail.style.setProperty('--pcc', p.colour);
      detail.innerHTML =
        '<div class="pd-top">' +
          '<span class="pd-badge" style="color:' + p.colour + '">PHASE ' + p.n + ' / 6</span>' +
          '<h3>' + esc(p.name) + '</h3>' +
        '</div>' +
        '<p class="pd-sum">' + esc(p.summary) + '</p>' +
        '<div class="pd-grid">' +
          '<ul class="pd-tasks">' +
            p.tasks.map((t, k) =>
              '<li><span class="idx">' + String(k + 1).padStart(2, '0') + '</span>' +
              '<span class="tx"><b>' + esc(t[0]) + '</b><span>' + esc(t[1]) + '</span></span></li>').join('') +
          '</ul>' +
          '<div class="pd-side">' +
            '<h4>Deliverable</h4>' +
            '<div class="pd-out"><b>Output of this phase</b>' + esc(p.deliverable) + '</div>' +
            '<h4>Common pitfall</h4>' +
            '<div class="pd-out"><b>Watch out</b>' + esc(p.pitfall) + '</div>' +
          '</div>' +
        '</div>';
      $$('.phase-btn', rail).forEach((b) => b.classList.toggle('on', +b.dataset.i === i));
    }

    rail.addEventListener('click', (e) => {
      const b = e.target.closest('.phase-btn');
      if (b) render(+b.dataset.i);
    });
    render(0);
    window.__ehPhase = render;
  }

  /* ==========================================================
     SCANNING STEPS
     ========================================================== */
  function scanning() {
    const box = $('#scanSteps');
    if (!box) return;
    box.innerHTML = DATA.scan.map((s) =>
      '<li><b>' + esc(s[0]) + '</b><span>' + esc(s[1]) + '</span>' +
      '<code>' + esc(s[2]) + '</code></li>').join('');
  }

  /* ==========================================================
     TOOLS + FILTERS
     ========================================================== */
  function tools() {
    const grid = $('#toolGrid'), filters = $('#toolFilters');
    if (!grid) return;

    filters.innerHTML = DATA.toolCats.map((c, i) =>
      '<button class="filter' + (i === 0 ? ' on' : '') + '" data-cat="' + c[0] + '">' +
      esc(c[1]) + '</button>').join('');

    grid.innerHTML = DATA.tools.map((t) =>
      '<article class="tool" data-cat="' + t.cat + '">' +
        '<div class="tool-top">' +
          '<span class="tool-name">' + esc(t.name) + '</span>' +
          '<span class="tool-cat">' + esc(t.cat) + '</span>' +
        '</div>' +
        '<p class="tool-role">' + esc(t.role) + '</p>' +
        '<p class="tool-desc">' + esc(t.desc) + '</p>' +
        '<div class="code-line"><code>' + esc(t.cmd) + '</code>' +
        '<button class="copy" data-copy="' + esc(t.cmd) + '">copy</button></div>' +
      '</article>').join('');

    filters.addEventListener('click', (e) => {
      const b = e.target.closest('.filter');
      if (!b) return;
      $$('.filter', filters).forEach((f) => f.classList.toggle('on', f === b));
      const cat = b.dataset.cat;
      $$('.tool', grid).forEach((t) => {
        t.classList.toggle('hide', cat !== 'all' && t.dataset.cat !== cat);
      });
    });

    grid.addEventListener('mousemove', (e) => {
      const t = e.target.closest('.tool');
      if (!t) return;
      const r = t.getBoundingClientRect();
      t.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      t.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  }

  /* ==========================================================
     ICONS (inline SVG — no emoji-font dependency)
     ========================================================== */
  const ICONS = {
    key: '<circle cx="8.5" cy="8.8" r="4.6"/><path d="M11.9 12.2 20 20.3"/>' +
         '<path d="m16.4 16.7 2-2"/><path d="m18.9 19.2 2-2"/>',
    nodes: '<circle cx="5" cy="6" r="2.1"/><circle cx="19" cy="6" r="2.1"/>' +
           '<circle cx="12" cy="18.2" r="2.1"/>' +
           '<path d="M6.6 7.6l4.1 8.9M17.4 7.6l-4.1 8.9M7.1 6h9.8"/>',
    globe: '<circle cx="12" cy="12" r="9"/><path d="M3.2 12h17.6"/>' +
           '<path d="M12 3c3.1 3.7 3.1 14.3 0 18M12 3c-3.1 3.7-3.1 14.3 0 18"/>',
    wifi: '<path d="M2.6 9.2a15 15 0 0 1 18.8 0"/><path d="M6.2 12.9a10 10 0 0 1 11.6 0"/>' +
          '<path d="M9.7 16.5a5 5 0 0 1 4.6 0"/>' +
          '<circle cx="12" cy="19.8" r="1.1" fill="currentColor" stroke="none"/>',
    mask: '<path d="M4 6.2h16v4.6c0 4.5-3.6 8.2-8 8.2s-8-3.7-8-8.2z"/>' +
          '<circle cx="9.2" cy="11" r="1.2" fill="currentColor" stroke="none"/>' +
          '<circle cx="14.8" cy="11" r="1.2" fill="currentColor" stroke="none"/>'
  };
  const icon = (n) => '<svg viewBox="0 0 24 24" aria-hidden="true" fill="none" ' +
    'stroke="currentColor" stroke-width="1.7" stroke-linecap="round" ' +
    'stroke-linejoin="round">' + (ICONS[n] || '') + '</svg>';

  /* ==========================================================
     ATTACKS
     ========================================================== */
  function attacks() {
    const grid = $('#attackGrid');
    if (!grid) return;
    grid.innerHTML = DATA.attacks.map((a) =>
      '<article class="attack reveal" style="--ac:' + a.colour + '">' +
        '<span class="a-icon">' + icon(a.icon) + '</span>' +
        '<h3>' + esc(a.name) + '</h3>' +
        '<p class="a-sub">' + esc(a.sub) + '</p>' +
        '<ul class="a-vars">' + a.vars.map((v) => '<li>' + esc(v) + '</li>').join('') + '</ul>' +
        '<div class="a-def"><b>Defence</b>' + esc(a.def) + '</div>' +
      '</article>').join('');
  }

  /* ==========================================================
     PRINCIPLES CHECKLIST
     ========================================================== */
  function principles() {
    const box = $('#principleList');
    if (!box) return;
    let saved = {};
    try { saved = JSON.parse(localStorage.getItem('eh-principles') || '{}'); } catch (e) { saved = {}; }

    box.innerHTML = DATA.principles.map((p, i) =>
      '<li><button data-i="' + i + '" class="' + (saved[i] ? 'done' : '') + '">' +
        '<span class="box"><svg viewBox="0 0 24 24" width="12" height="12" aria-hidden="true">' +
          '<path d="m4 12.5 5 5L20 6.5" fill="none" stroke="currentColor" ' +
          'stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>' +
        '<span><span class="lbl">' + esc(p[0]) + '</span>' +
        '<span class="sub">' + esc(p[1]) + '</span></span>' +
      '</button></li>').join('');

    box.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      b.classList.toggle('done');
      saved[b.dataset.i] = b.classList.contains('done');
      try { localStorage.setItem('eh-principles', JSON.stringify(saved)); } catch (err) {}
      if ($$('button.done', box).length === DATA.principles.length) {
        toast('All five principles locked in.');
      }
    });
  }

  /* ==========================================================
     CIA TRIAD
     ========================================================== */
  function triad() {
    const info = $('#triadInfo'), nodes = $$('.triad-svg .node');
    if (!info) return;

    function show(key) {
      const t = DATA.triad[key];
      info.innerHTML = '<b>' + esc(t.title) + '</b><p>' + esc(t.body) +
        '<span class="ti-ex">' + esc(t.ex) + '</span></p>';
      nodes.forEach((n) => n.classList.toggle('on', n.dataset.key === key));
    }

    nodes.forEach((n) => {
      n.addEventListener('mouseenter', () => show(n.dataset.key));
      n.addEventListener('click', () => show(n.dataset.key));
      n.addEventListener('focus', () => show(n.dataset.key));
      n.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); show(n.dataset.key); }
      });
    });
    show('c');
  }

  /* ==========================================================
     QUIZ
     ========================================================== */
  function quiz() {
    const box = $('#quizBox');
    if (!box) return;
    const qs = DATA.quiz;
    let idx = 0, score = 0, answered = false;

    function render() {
      const q = qs[idx];
      box.innerHTML =
        '<div class="q-head">' +
          '<span class="q-count">Q' + String(idx + 1).padStart(2, '0') + ' / ' +
            String(qs.length).padStart(2, '0') + '</span>' +
          '<span class="q-track"><span style="width:' + (idx / qs.length * 100) + '%"></span></span>' +
          '<span class="q-score">score ' + score + '</span>' +
        '</div>' +
        '<p class="q-text">' + esc(q.q) + '</p>' +
        '<div class="q-opts">' +
          q.opts.map((o, i) =>
            '<button class="q-opt" data-i="' + i + '">' +
            '<span class="key">' + 'ABCD'[i] + '</span><span>' + esc(o) + '</span></button>').join('') +
        '</div>' +
        '<div class="q-slot"></div>';
      answered = false;
    }

    function answer(i) {
      if (answered) return;
      answered = true;
      const q = qs[idx];
      const opts = $$('.q-opt', box);
      opts.forEach((o, k) => {
        o.disabled = true;
        if (k === q.a) o.classList.add('right');
        else if (k === i) o.classList.add('wrong');
      });
      if (i === q.a) { score++; $('.q-score', box).textContent = 'score ' + score; }

      const last = idx === qs.length - 1;
      $('.q-slot', box).innerHTML =
        '<div class="q-exp"><b>' + (i === q.a ? 'Correct — ' : 'Not quite — ') + '</b>' +
        esc(q.exp) + '</div>' +
        '<div class="q-nav"><button class="btn primary" id="qNext">' +
        (last ? 'See result' : 'Next question ->') + '</button></div>';

      $('#qNext').addEventListener('click', () => {
        if (last) return final();
        idx++; render();
      });
    }

    function final() {
      const pct = Math.round(score / qs.length * 100);
      const verdict =
        pct === 100 ? 'Flawless. You could teach this page.' :
        pct >= 75  ? 'Strong grasp — revisit the phases you missed.' :
        pct >= 50  ? 'Solid start. Re-read the phases and attack families.' :
                     'Worth another pass from the top — the notes cover every answer.';
      box.innerHTML =
        '<div class="q-final">' +
          '<span class="big">' + score + '/' + qs.length + '</span>' +
          '<p>' + esc(verdict) + '</p>' +
          '<div class="q-nav" style="justify-content:center">' +
            '<button class="btn primary" id="qAgain">Try again</button>' +
            '<a class="btn" href="#phases">Back to phases</a>' +
          '</div>' +
        '</div>';
      $('#qAgain').addEventListener('click', () => { idx = 0; score = 0; render(); });
    }

    box.addEventListener('click', (e) => {
      const o = e.target.closest('.q-opt');
      if (o) answer(+o.dataset.i);
    });
    render();
  }

  /* ==========================================================
     COPY BUTTONS (delegated)
     ========================================================== */
  function copyButtons() {
    document.addEventListener('click', (e) => {
      const b = e.target.closest('.copy');
      if (!b) return;
      const text = b.dataset.copy || '';
      const done = () => {
        b.classList.add('ok');
        b.textContent = 'copied';
        toast('Copied to clipboard');
        setTimeout(() => { b.classList.remove('ok'); b.textContent = 'copy'; }, 1500);
      };
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(done).catch(fallback);
      } else fallback();

      function fallback() {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); done(); } catch (err) { toast('Copy failed'); }
        ta.remove();
      }
    });
  }

  /* ==========================================================
     SEARCH PALETTE
     ========================================================== */
  function palette() {
    const wrap = $('#palette'), input = $('#paletteInput'), out = $('#paletteResults');
    if (!wrap) return;

    const index = [];
    DATA.phases.forEach((p, i) => index.push({
      tag: 'phase ' + p.n, title: p.name, sub: p.short,
      body: p.summary + ' ' + p.tasks.map(t => t[0] + ' ' + t[1]).join(' '),
      go: () => { location.hash = '#phases'; if (window.__ehPhase) window.__ehPhase(i); }
    }));
    DATA.terms.forEach(t => index.push({
      tag: 'term', title: t.term, sub: t.short, body: t.body, hash: '#intro'
    }));
    DATA.tools.forEach(t => index.push({
      tag: 'tool', title: t.name, sub: t.role, body: t.desc + ' ' + t.cmd, hash: '#tools'
    }));
    DATA.attacks.forEach(a => index.push({
      tag: 'attack', title: a.name, sub: a.vars.join(' · '),
      body: a.sub + ' ' + a.def, hash: '#attacks'
    }));
    DATA.scan.forEach(s => index.push({
      tag: 'scanning', title: s[0], sub: s[1], body: s[2], hash: '#scanning'
    }));
    DATA.principles.forEach(p => index.push({
      tag: 'principle', title: p[0], sub: p[1], body: p[1], hash: '#cia'
    }));
    Object.keys(DATA.triad).forEach(k => index.push({
      tag: 'CIA', title: DATA.triad[k].title, sub: DATA.triad[k].body,
      body: DATA.triad[k].ex, hash: '#cia'
    }));

    let results = [], sel = 0;

    function search(q) {
      q = q.trim().toLowerCase();
      results = !q ? index.slice(0, 8) : index.filter(it =>
        (it.title + ' ' + it.sub + ' ' + it.body + ' ' + it.tag).toLowerCase().includes(q)
      ).slice(0, 20);
      sel = 0;
      draw();
    }

    function draw() {
      if (!results.length) {
        out.innerHTML = '<li class="palette-empty">no match — try “nmap”, “xss”, “scope”</li>';
        return;
      }
      out.innerHTML = results.map((r, i) =>
        '<li data-i="' + i + '" class="' + (i === sel ? 'sel' : '') + '">' +
          '<span class="pr-tag">' + esc(r.tag) + '</span>' +
          '<span class="pr-title">' + esc(r.title) + '</span>' +
          '<span class="pr-sub">' + esc(r.sub) + '</span>' +
        '</li>').join('');
    }

    function open() {
      wrap.hidden = false;
      document.body.classList.add('locked');
      input.value = '';
      search('');
      input.focus();
    }
    function close() {
      wrap.hidden = true;
      document.body.classList.remove('locked');
    }
    function pick(i) {
      const r = results[i];
      if (!r) return;
      close();
      if (r.go) r.go();
      else if (r.hash) location.hash = r.hash;
    }

    $('#searchBtn').addEventListener('click', open);
    input.addEventListener('input', () => search(input.value));
    out.addEventListener('click', (e) => {
      const li = e.target.closest('li[data-i]');
      if (li) pick(+li.dataset.i);
    });
    wrap.addEventListener('click', (e) => { if (e.target === wrap) close(); });

    document.addEventListener('keydown', (e) => {
      const bootOpen = $('#boot') && !$('#boot').classList.contains('done');
      if (bootOpen) return;
      const typing = /^(INPUT|TEXTAREA)$/.test(document.activeElement.tagName);

      if (e.key === '/' && !typing) { e.preventDefault(); open(); return; }
      if (wrap.hidden) return;

      if (e.key === 'Escape') { close(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); sel = Math.min(sel + 1, results.length - 1); draw(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); sel = Math.max(sel - 1, 0); draw(); }
      else if (e.key === 'Enter') { e.preventDefault(); pick(sel); }
    });
  }

  /* ==========================================================
     THEME CYCLING
     ========================================================== */
  function themes() {
    const btn = $('#themeBtn');
    if (!btn) return;
    let i = +(localStorage.getItem('eh-theme') || 0) % DATA.themes.length;

    function apply(k) {
      const t = DATA.themes[k];
      const r = document.documentElement.style;
      r.setProperty('--acc', t.acc);
      r.setProperty('--acc-2', t.acc2);
      r.setProperty('--acc-glow', t.glow);
      try { localStorage.setItem('eh-theme', k); } catch (e) {}
    }
    apply(i);

    btn.addEventListener('click', () => {
      i = (i + 1) % DATA.themes.length;
      apply(i);
      toast('Accent: ' + DATA.themes[i].name);
    });
  }

  /* ==========================================================
     SCROLL: progress, nav state, reveal, to-top
     ========================================================== */
  function scrollFx() {
    const bar = $('#progress'), nav = $('#nav'), top = $('#toTop');
    const links = $$('.nav-links a');
    const sections = links.map(a => $(a.hash)).filter(Boolean);

    function onScroll() {
      const h = document.documentElement;
      const max = h.scrollHeight - h.clientHeight;
      const pct = max > 0 ? (h.scrollTop / max) * 100 : 0;
      if (bar) bar.style.width = pct + '%';
      if (nav) nav.classList.toggle('stuck', h.scrollTop > 20);
      if (top) top.classList.toggle('show', h.scrollTop > 600);

      let current = null;
      sections.forEach((s) => {
        if (s.getBoundingClientRect().top <= 140) current = s.id;
      });
      links.forEach(a => a.classList.toggle('active', a.hash === '#' + current));
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    if (top) top.addEventListener('click', () =>
      window.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }));

    const io = new IntersectionObserver((es) => {
      es.forEach((e) => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: .12 });
    $$('.reveal').forEach(el => io.observe(el));
  }

  /* ==========================================================
     MOBILE MENU
     ========================================================== */
  function mobileMenu() {
    const burger = $('#burger'), links = $('#navLinks');
    if (!burger || !links) return;
    burger.addEventListener('click', () => {
      burger.classList.toggle('open');
      links.classList.toggle('open');
    });
    links.addEventListener('click', (e) => {
      if (e.target.tagName === 'A') {
        burger.classList.remove('open');
        links.classList.remove('open');
      }
    });
  }

  /* ==========================================================
     INIT
     ========================================================== */
  function init() {
    terms();
    phases();
    scanning();
    tools();
    attacks();
    principles();
    triad();
    quiz();
    copyButtons();
    palette();
    themes();
    counters();
    scrollFx();
    mobileMenu();
    matrix();
    boot();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else init();
})();
