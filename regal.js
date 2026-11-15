/* Bücherregal: liest die Buchkarten aus #buecher und stellt sie als Regal dar. */
(function () {
  document.documentElement.classList.add('js');

  // Deko in Grün, Gold und Creme: Bücherstapel, Pflanze, Laterne, Tasse, Buchrücken
  const rad = d => d * Math.PI / 180;
  const DECO = [
    { w: 118, h: 84, svg: `<rect x="6" y="6" width="96" height="20" rx="3" fill="#f2b632"/><rect x="20" y="13" width="40" height="3.5" rx="2" fill="#fff6e6" opacity=".8"/>
      <rect x="12" y="28" width="92" height="22" rx="3" fill="#fff6e6"/><rect x="26" y="36" width="44" height="3.5" rx="2" fill="#1f5e5b" opacity=".6"/>
      <rect x="2" y="52" width="100" height="22" rx="3" fill="#3f8a84"/><rect x="16" y="60" width="50" height="3.5" rx="2" fill="#fff6e6" opacity=".7"/>
      <rect x="98" y="18" width="16" height="64" rx="3" transform="rotate(12 106 50)" fill="#c9784a"/>` },
    { w: 150, h: 170, svg: `<g fill="#8fc48a">${Array.from({ length: 26 }, (_, i) => { const a = -160 + i * 5.2, r = 40 + (i * 37 % 30), x = 75 + Math.cos(rad(a)) * r * 1.25, y = 92 + Math.sin(rad(a)) * r;
        return `<ellipse cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" rx="11" ry="7" transform="rotate(${(a + 90).toFixed(0)} ${x.toFixed(1)} ${y.toFixed(1)})" opacity="${.7 + (i % 3) * .1}"/>`; }).join('')}</g>
      <g stroke="#6aa365" stroke-width="2.2" fill="none">${Array.from({ length: 9 }, (_, i) => { const a = -165 + i * 19;
        return `<path d="M75 112 Q${(75 + Math.cos(rad(a)) * 30).toFixed(0)} ${(95 + Math.sin(rad(a)) * 30).toFixed(0)} ${(75 + Math.cos(rad(a)) * 58).toFixed(0)} ${(92 + Math.sin(rad(a)) * 45).toFixed(0)}"/>`; }).join('')}</g>
      <path d="M42 112h66l-8 54H50z" fill="#fff6e6"/><rect x="38" y="106" width="74" height="12" rx="3" fill="#f2b632"/>` },
    { w: 64, h: 120, svg: `<defs><radialGradient id="fl" cx=".5" cy=".6" r=".6"><stop offset="0" stop-color="#ffe7a8"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs>
      <circle cx="32" cy="70" r="34" fill="url(#fl)" opacity=".7"/><path d="M22 8h20l-4 10H26z" fill="#f2b632"/><circle cx="32" cy="6" r="5" fill="none" stroke="#f2b632" stroke-width="3"/>
      <rect x="14" y="18" width="36" height="88" rx="6" fill="rgba(255,230,170,.16)" stroke="#f2b632" stroke-width="4"/><path d="M32 52c6 8 6 16 0 22-6-6-6-14 0-22z" fill="#ffd66b"/>
      <rect x="28" y="74" width="8" height="22" rx="2" fill="#fff6e6"/><rect x="10" y="104" width="44" height="10" rx="3" fill="#f2b632"/>` },
    { w: 80, h: 70, svg: `<path d="M18 34 q-2 -10 4 -16 M30 30 q-2 -12 4 -18 M42 34 q-2 -10 4 -16" stroke="#cfe3df" stroke-width="2.5" fill="none" opacity=".55"/>
      <path d="M8 36h50v18a14 14 0 0 1-14 14H22A14 14 0 0 1 8 54z" fill="#fff6e6"/><path d="M58 42h6a8 8 0 0 1 0 16h-6" fill="none" stroke="#fff6e6" stroke-width="5"/>
      <rect x="8" y="44" width="50" height="6" fill="#3f8a84"/>` },
    { w: 124, h: 150, svg: [[0, 14, 118, '#e9dcc0'], [15, 18, 136, '#f2b632'], [34, 12, 108, '#3f8a84'], [47, 20, 144, '#c9784a'], [68, 14, 124, '#fff6e6']]
        .map(([x, w, h, c]) => `<rect x="${x}" y="${150 - h}" width="${w}" height="${h}" rx="2" fill="${c}"/><rect x="${x}" y="${150 - h + 10}" width="${w}" height="3" fill="#000" opacity=".18"/><rect x="${x}" y="${150 - 16}" width="${w}" height="3" fill="#000" opacity=".18"/>`).join('')
        + '<g transform="rotate(16 84 150)"><rect x="84" y="20" width="17" height="130" rx="2" fill="#2f7b76"/><rect x="84" y="31" width="17" height="3" fill="#000" opacity=".2"/><rect x="84" y="132" width="17" height="3" fill="#000" opacity=".2"/></g>' }
  ];

  // Bücher aus den Karten lesen
  const GENRES = [], BOOKS = [];
  let genre = null;
  document.querySelectorAll('#buecher h3.category, #buecher article.book').forEach(el => {
    if (el.matches('h3')) {
      const sub = el.nextElementSibling && el.nextElementSibling.matches('.category-sub') ? el.nextElementSibling.textContent : '';
      genre = { name: el.textContent.trim(), desc: sub };
      GENRES.push(genre);
      return;
    }
    const img = el.querySelector('img'), link = el.querySelector('a.btn'), ps = el.querySelectorAll(':scope > p:not(.by):not(.meta):not(.flag)');
    const title = el.querySelector('h4').textContent.trim();
    BOOKS.push({
      i: BOOKS.length, cat: genre.name, title, img: img.getAttribute('src'),
      r: (+img.getAttribute('width') || 2) / (+img.getAttribute('height') || 3),
      by: el.querySelector('.by').textContent.trim(), meta: (el.querySelector('.meta') || {}).textContent || '',
      text: ps.length ? ps[ps.length - 1].textContent.trim() : '', link: link ? link.href : '', fuer: el.dataset.fuer || '',
      facts: [...el.querySelectorAll('.facts > div')].map(d => [d.querySelector('dt').textContent, d.querySelector('dd').textContent]),
      slug: title.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/ß/g, 'ss').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')
    });
  });

  let filter = 'alle', query = '', big = false, list = [], current = -1;
  const esc = s => s.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
  const match = b => (filter === 'alle' || b.by === filter || b.fuer === filter)
    && (!query || (b.title + ' ' + b.meta + ' ' + b.text + ' ' + b.cat).toLowerCase().includes(query));

  function lights(w, seed) {
    const n = Math.max(2, Math.round(w / 160)), seg = w / n; let d = 'M0 5', bulbs = '';
    for (let k = 0; k < n; k++) {
      const x0 = k * seg; d += ` Q${x0 + seg / 2} 24 ${x0 + seg} 5`;
      for (let j = 1; j <= 3; j++) {
        const t = j / 4, x = x0 + seg * t, y = 5 + 2 * (1 - t) * t * 19;
        bulbs += `<g class="b" style="animation-delay:${((k * 3 + j + seed) * 0.41) % 3.4}s"><circle cx="${x.toFixed(1)}" cy="${(y + 5).toFixed(1)}" r="10" fill="url(#glow)"/><circle cx="${x.toFixed(1)}" cy="${(y + 4).toFixed(1)}" r="3.4" fill="#fff3cf"/></g>`;
      }
    }
    return `<svg class="lights" width="${w}" height="40" viewBox="0 0 ${w} 40" aria-hidden="true"><path d="${d}" stroke="rgba(0,0,0,.55)" stroke-width="1.5" fill="none"/>${bulbs}</svg>`;
  }
  function decoHTML(k, ch) {
    const D = DECO[k], h = Math.round(D.h * ch / 200);
    return `<svg class="deco" viewBox="0 0 ${D.w} ${D.h}" height="${h}" width="${Math.round(D.w * h / D.h)}" aria-hidden="true">${D.svg}</svg>`;
  }
  function bookHTML(b, delay) {
    return `<button class="book-b" data-i="${b.i}" style="animation-delay:${delay}ms" aria-label="${esc(b.title)}"><img src="${b.img}" alt="Cover: ${esc(b.title)}" loading="lazy"></button>`;
  }

  const box = document.getElementById('regal');

  // Buchtitel beim Darüberfahren: eigene Ebene über dem Regal, damit nichts davor liegt
  const tip = document.createElement('div'); tip.className = 'tip'; tip.setAttribute('aria-hidden', 'true'); document.body.appendChild(tip);
  function showTip(el) {
    if (matchMedia('(hover: none)').matches) return;
    tip.textContent = BOOKS[+el.dataset.i].title; tip.classList.add('show');
    const r = el.getBoundingClientRect(), w = tip.offsetWidth;
    tip.style.left = Math.min(innerWidth - w - 8, Math.max(8, r.left + r.width / 2 - w / 2)) + 'px';
    tip.style.top = Math.max(8, r.top - tip.offsetHeight - 22) + 'px';
  }
  function hideTip() { tip.classList.remove('show'); }
  addEventListener('scroll', hideTip, { passive: true });
  // Regalfächer: jede Rubrik eigene Böden; Bücher ohne Amazon-Link werden (noch) nicht gezeigt
  let n = 0, s = 0, decoN = 0;
  function shelvesHTML(groups, ch, gap, inner) {
    let html = '';
    groups.forEach((g, gi) => {
      const rows = []; let row = [], used = 0;
      g.books.forEach(b => { const w = b.r * ch; if (row.length && used + w > inner) { rows.push({ row, used }); row = []; used = 0; } row.push(b); used += w + gap; });
      rows.push({ row, used });
      // Freien Platz im letzten Boden mit Deko füllen, Buchrücken zuerst
      const last = rows[rows.length - 1];
      for (let t = 0; t < 2; t++) {
        const k = t === 0 ? 4 : (gi + decoN) % 4, w = DECO[k].w * ch / 200;
        if (last.used + w <= inner && (t === 0 || last.row.length < 4)) { (gi + t) % 2 ? last.row.unshift({ deco: k }) : last.row.push({ deco: k }); last.used += w + gap; decoN++; }
      }
      rows.forEach(({ row }, ri) => {
        html += `<div class="shelf"><div class="back" data-s="${s++}"><div class="items">${row.map(x => x.deco !== undefined ? decoHTML(x.deco, ch) : bookHTML(x, (n++) * 30)).join('')}</div></div>`
          + `<div class="board"><div class="top"></div><div class="front">${ri === 0 && g.name ? `<span class="plate" title="${esc(g.desc)}">${esc(g.name)}</span>` : ''}</div></div></div>`;
      });
    });
    return html;
  }
  const bookcase = (inner, cls = '') => `<div class="bookcase ${cls}"><div class="cornice"></div><div class="carcass">${inner}</div><div class="plinth"></div></div>`;

  function render() {
    list = BOOKS.filter(match);
    const ch = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--ch')), m = innerWidth < 760;
    const gap = m ? 12 : 28; document.documentElement.style.setProperty('--gap', gap + 'px');
    const inner = (box.clientWidth || innerWidth) - (m ? 24 : 44) - (m ? 24 : 44) - (m ? 20 : 36);
    n = 0; s = 0; decoN = 0;
    const ready = GENRES.map(g => ({ name: g.name, desc: g.desc, books: list.filter(b => b.cat === g.name && b.link) })).filter(g => g.books.length);
    let html = '';
    if (ready.length) html += `<div class="case-title"><h2>Unser Bücherregal</h2><p>Zum Stöbern einfach ein Buch anklicken.</p></div>` + bookcase(shelvesHTML(ready, ch, gap, inner));
    box.innerHTML = html ? `<svg width="0" height="0" style="position:absolute" aria-hidden="true"><defs><radialGradient id="glow"><stop offset="0" stop-color="#ffe2a0" stop-opacity=".85"/><stop offset="1" stop-color="#ffb347" stop-opacity="0"/></radialGradient></defs></svg>` + html
      : '<p class="empty">Kein Buch gefunden.</p>';
    box.querySelectorAll('.book-b').forEach(el => {
      el.onclick = () => openBook(+el.dataset.i);
      el.onmouseenter = el.onfocus = () => showTip(el);
      el.onmouseleave = el.onblur = hideTip;
    });
    // Lichterketten erst nach dem Aufbau, damit die echte Breite stimmt
    box.querySelectorAll('.back').forEach(bk => bk.insertAdjacentHTML('afterbegin', lights(Math.max(200, bk.clientWidth), +bk.dataset.s)));
  }

  document.querySelectorAll('.pill[data-f]').forEach(p => p.onclick = () => {
    document.querySelectorAll('.pill[data-f]').forEach(x => x.classList.remove('on')); p.classList.add('on'); filter = p.dataset.f; render();
  });
  document.getElementById('fabZoom').onclick = () => { big = !big; setSize(); render(); };
  const q = document.getElementById('q');
  document.getElementById('fabSearch').onclick = () => { q.classList.toggle('open'); if (q.classList.contains('open')) q.focus(); else { q.value = ''; query = ''; render(); } };
  q.oninput = () => { query = q.value.trim().toLowerCase(); render(); };
  function setSize() {
    const m = innerWidth < 760;
    document.documentElement.style.setProperty('--ch', (m ? (big ? 210 : Math.max(120, Math.min(160, (innerWidth - 80) / 3 / 0.72))) : (big ? 270 : 205)) + 'px');
  }
  let rt, lastW = innerWidth;
  addEventListener('resize', () => { if (innerWidth === lastW) return; lastW = innerWidth; clearTimeout(rt); rt = setTimeout(() => { setSize(); render(); }, 120); });

  // Leseansicht
  const reader = document.getElementById('reader'), $ = id => document.getElementById(id);
  function openBook(i) {
    const b = BOOKS[i]; current = i; reader.classList.remove('open'); void reader.offsetWidth;
    $('rimg').src = b.img; $('rimg').alt = 'Cover: ' + b.title;
    $('rcat').textContent = b.cat; $('rtitle').textContent = b.title; $('rby').textContent = 'von ' + b.by;
    $('rmeta').textContent = b.meta; $('rtxt').textContent = b.text;
    $('rfacts').innerHTML = b.facts.map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('');
    $('rbtn').innerHTML = b.link ? `<a class="btn" href="${b.link}" target="_blank" rel="noopener">Bei Amazon ansehen →</a>` : '<span class="btn btn-soon">Bald erhältlich</span>';
    reader.classList.add('open'); reader.setAttribute('aria-hidden', 'false'); history.replaceState(null, '', '#' + b.slug);
    $('close').focus({ preventScroll: true });
  }
  function closeBook() {
    reader.classList.remove('open'); reader.setAttribute('aria-hidden', 'true');
    const el = box.querySelector(`[data-i="${current}"]`); current = -1;
    history.replaceState(null, '', location.pathname + location.search); if (el) el.focus({ preventScroll: true });
  }
  $('close').onclick = closeBook; reader.onclick = e => { if (e.target === reader) closeBook(); };
  addEventListener('keydown', e => {
    if (current < 0) return;
    if (e.key === 'Escape') closeBook();
  });

  setSize(); render();
  const start = BOOKS.find(b => '#' + b.slug === location.hash);
  if (start) setTimeout(() => openBook(start.i), 300);
})();
