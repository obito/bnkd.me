// The BNKD sticker pile. Used as the homepage logo and full screen on /stickers.
//   const logo = bnkdLogo(el, { base: 'stickers/', flash: someEl, mode: 'play' | 'still' | 'k:fire' });
//   logo.play() replays it.
window.bnkdLogo = (root, opts = {}) => {
  const base = opts.base ?? 'stickers/';
  const mode = opts.mode ?? 'play';
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  // still: everything is placed where it ends up, nothing moves
  const still = mode === 'still' || reduced;

  if (!document.getElementById('bnkd-logo-css')) {
    const css = document.createElement('style');
    css.id = 'bnkd-logo-css';
    css.textContent = `
      .bnkd-stage { position: relative; width: 100%; aspect-ratio: 2.1 / 1; }
      /* the glow around the whole pile */
      .bnkd-stage.lit { filter: drop-shadow(0 0 5px rgba(255, 60, 140, .5)) drop-shadow(0 0 18px rgba(255, 40, 90, .3)); }
      .bnkd-stage .s { position: absolute; left: 50%; top: 50%; will-change: transform; }
      .bnkd-stage .s img, .bnkd-stage .s svg { display: block; width: 100%; height: auto; }
      /* animated ones: the clip plays on top of its still, cut to the still's shape */
      .bnkd-stage .s video { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: fill;
        -webkit-mask-size: 100% 100%; mask-size: 100% 100%; -webkit-mask-repeat: no-repeat; mask-repeat: no-repeat; }
      .bnkd-stage .smear { position: absolute; inset: 0; pointer-events: none; z-index: 900; color: var(--bnkd-smear, #fff); }
      .bnkd-stage .smear > * { position: absolute; inset: 0; }
      .bnkd-stage .hole { position: absolute; width: 17%; transform: translate(-50%, -50%); pointer-events: none; }
      .bnkd-stage .hole svg { overflow: visible; }
      .bnkd-flash { position: absolute; inset: 0; background: #fff; pointer-events: none; opacity: 0; z-index: 1000; }`;
    document.head.appendChild(css);
  }

  const stage = document.createElement('div');
  stage.className = 'bnkd-stage';
  root.appendChild(stage);
  let flash = opts.flash;
  if (!flash) { flash = document.createElement('div'); flash.className = 'bnkd-flash'; stage.after(flash); }

  // the one drawn in code: the little seal that opens it
  const SVG = {
    seal: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-100 -100 200 200">
      <circle r="92" fill="#000" stroke="#fff" stroke-width="6"/>
      <circle r="74" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="4 6"/>
      <text y="18" text-anchor="middle" font-family="UnifrakturMaguntia" font-size="54" fill="#fff">bnkd</text>
      <text y="50" text-anchor="middle" font-family="Press Start 2P" font-size="11" fill="#fff">★ ★ ★</text></svg>`,
  };

  // ---------- the score ----------
  // w = width in % of the stage, dx/dy = nudge in %, r = tilt, gap = ms before it lands
  const score = [
    { k: 'seal', w: 13, gap: 300, solo: true },
    { k: 'chrome', w: 70, gap: 1000, solo: true, clip: true },
    { k: 'gold', w: 90, gap: 900 },
    { k: 'scan', w: 96, dx: -2, dy: 2, r: -2, gap: 800 },
    { k: 'flag', w: 98, dx: 3, dy: -3, r: 1.5, gap: 700 },
    { k: 'fire', w: 100, dy: 2, r: -1, gap: 620, clip: true },
    { k: 'bubble', w: 102, dx: -3, r: 2, gap: 560 },
    { k: 'candy', w: 98, dx: 2, dy: 3, r: -2.5, gap: 500 },
    { k: 'marker', w: 104, dx: -1, dy: -2, r: 3, gap: 440 },
    { k: 'angular', w: 100, dx: 2, r: -1.5, gap: 400 },
    { k: 'gothic', w: 98, dx: -2, dy: 2, r: 1, gap: 360 },
    { k: 'pixel', w: 102, dy: -1, r: -2, gap: 320 },
    { k: 'smear', gap: 380, fx: true },
    { k: 'labels', w: 100, gap: 240, texture: true },
    { k: 'italic', w: 84, gap: 900, finale: true, shots: [[24, 40], [63, 58], [83, 30]] },
  ];

  const src = k => `${base}${k}.webp`;
  let timers = [];
  const later = (fn, ms) => timers.push(setTimeout(fn, ms));

  // a bullet hole: dark core, bent metal rim, cracks running out of it
  const hole = () => {
    const cracks = Array.from({ length: 5 + (Math.random() * 3 | 0) }, () => {
      const a = Math.random() * Math.PI * 2, l = 30 + Math.random() * 18, k = (Math.random() - .5) * .6;
      return `M${(Math.cos(a) * 18).toFixed(1)} ${(Math.sin(a) * 18).toFixed(1)}L${(Math.cos(a + k) * l * .6).toFixed(1)} ${(Math.sin(a + k) * l * .6).toFixed(1)}L${(Math.cos(a) * l).toFixed(1)} ${(Math.sin(a) * l).toFixed(1)}`;
    }).join('');
    // torn metal petals bent outwards around the hole
    const petals = Array.from({ length: 22 }, (_, i) => {
      const a = i / 22 * Math.PI * 2, r = i % 2 ? 17 : 23 + Math.random() * 6;
      return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`;
    }).join(' ');
    const gid = 'm' + Math.random().toString(36).slice(2, 8);
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100">
      <defs><radialGradient id="${gid}" cx="35%" cy="30%" r="80%"><stop offset="0" stop-color="#f4f4f4"/><stop offset=".5" stop-color="#9a9a9a"/><stop offset="1" stop-color="#3a3a3a"/></radialGradient></defs>
      <path d="${cracks}" fill="none" stroke="#000" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${cracks}" fill="none" stroke="#bdbdbd" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      <polygon points="${petals}" fill="url(#${gid})" stroke="#111" stroke-width="2.5" stroke-linejoin="round"/>
      <circle r="13" fill="#1c1c1c" stroke="#000" stroke-width="2"/>
      <circle r="8" fill="#000"/><path d="M-9-4A10 10 0 0 1 -2-10" fill="none" stroke="#777" stroke-width="2" stroke-linecap="round"/></svg>`;
  };
  const spark = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="-50 -50 100 100">${
    Array.from({ length: 8 }, (_, i) => { const a = i / 8 * Math.PI * 2;
      return `<line x1="${(Math.cos(a) * 8).toFixed(1)}" y1="${(Math.sin(a) * 8).toFixed(1)}" x2="${(Math.cos(a) * 44).toFixed(1)}" y2="${(Math.sin(a) * 44).toFixed(1)}" stroke="#fff6b0" stroke-width="5" stroke-linecap="round"/>`; }).join('')
  }<circle r="14" fill="#fff"/></svg>`;

  function shoot(el, [x, y]) {
    const h = document.createElement('div');
    h.className = 'hole';
    h.style.left = x + '%'; h.style.top = y + '%';
    h.innerHTML = hole();
    el.appendChild(h);
    if (still) return;
    h.animate([{ transform: 'translate(-50%, -50%) scale(0)' }, { transform: 'translate(-50%, -50%) scale(1.25)', offset: .5 }, { transform: 'translate(-50%, -50%) scale(1)' }],
      { duration: 110, easing: 'ease-out' });
    const sp = document.createElement('div');
    sp.className = 'hole';
    sp.style.left = x + '%'; sp.style.top = y + '%';
    sp.innerHTML = spark;
    el.appendChild(sp);
    sp.animate([{ transform: 'translate(-50%, -50%) scale(.4) rotate(0deg)', opacity: 1 }, { transform: 'translate(-50%, -50%) scale(1.6) rotate(20deg)', opacity: 0 }],
      { duration: 160, easing: 'ease-out' }).onfinish = () => sp.remove();
    stage.animate(Array.from({ length: 5 }, (_, i) => ({ transform: `translate(${(Math.random() - .5) * (5 - i) * 5}px, ${(Math.random() - .5) * (5 - i) * 5}px)` }))
      .concat({ transform: 'none' }), { duration: 150 });
    flash.animate([{ opacity: .3 }, { opacity: 0 }], { duration: 120 });
  }

  // a tile of little black and white "BNKD" labels, packed in rows
  const labels = (() => {
    const W = 300, rows = [];
    let y = 0, i = 0;
    while (y < 300) {
      const h = 9 + (i++ % 3) * 4; let x = -Math.random() * 30;
      while (x < W) {
        const w = 26 + Math.random() * 60, dark = Math.random() < .55;
        rows.push(`<rect x="${x.toFixed(1)}" y="${y}" width="${(w - 2).toFixed(1)}" height="${h - 2}" fill="${dark ? '#111' : '#f2f2f2'}"/>` +
          `<text x="${(x + 2).toFixed(1)}" y="${y + h - 4}" font-family="Arial Black, Arial, sans-serif" font-weight="900" font-size="${h - 3}" fill="${dark ? '#f2f2f2' : '#111'}" textLength="${(w - 6).toFixed(1)}" lengthAdjust="spacingAndGlyphs">BNKD</text>`);
        x += w;
      }
      y += h;
    }
    return `<rect width="${W}" height="300" fill="#777"/>${rows.join('')}`;
  })();
  // the label-collage logo: heavy type filled with the labels, thick black outline
  const pid = 'lp' + Math.random().toString(36).slice(2, 8);
  SVG.labels = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 400">
    <defs><pattern id="${pid}" width="300" height="300" patternUnits="userSpaceOnUse">${labels}</pattern></defs>
    <text x="500" y="372" text-anchor="middle" font-family="Bowlby One" font-size="400" textLength="960" lengthAdjust="spacingAndGlyphs"
      fill="url(#${pid})" stroke="#000" stroke-width="16" stroke-linejoin="round" paint-order="stroke">BNKD</text>
    <text x="500" y="372" text-anchor="middle" font-family="Bowlby One" font-size="400" textLength="960" lengthAdjust="spacingAndGlyphs"
      fill="none" stroke="#fff" stroke-width="3" stroke-linejoin="round">BNKD</text></svg>`;

  // the camera punch: the pile smears out from the centre with speed lines
  function smear() {
    const layer = document.createElement('div');
    layer.className = 'smear';
    const pile = [...stage.querySelectorAll('.s')];
    for (let i = 1; i <= 6; i++) {
      const ghost = document.createElement('div');
      pile.forEach(s => { const c = s.cloneNode(true); c.querySelectorAll('video').forEach(v => v.remove()); ghost.appendChild(c); });
      layer.appendChild(ghost);
      ghost.animate([{ transform: 'scale(1)', opacity: .32 }, { transform: `scale(${1 + i * .07})`, opacity: 0 }],
        { duration: 300, easing: 'ease-in', fill: 'forwards' });
    }
    const lines = Array.from({ length: 36 }, (_, i) => {
      const a = i / 36 * Math.PI * 2 + Math.random() * .1, r0 = 140 + Math.random() * 80, r1 = r0 + 160 + Math.random() * 200;
      return `<line x1="${(Math.cos(a) * r0).toFixed(0)}" y1="${(Math.sin(a) * r0 * .5).toFixed(0)}" x2="${(Math.cos(a) * r1).toFixed(0)}" y2="${(Math.sin(a) * r1 * .5).toFixed(0)}" stroke="currentColor" stroke-width="${(2 + Math.random() * 5).toFixed(1)}" stroke-linecap="round"/>`;
    }).join('');
    const burst = document.createElement('div');
    burst.innerHTML = `<svg viewBox="-500 -250 1000 500" width="100%" height="100%" preserveAspectRatio="none">${lines}</svg>`;
    layer.appendChild(burst);
    burst.animate([{ transform: 'scale(.6)', opacity: 0 }, { transform: 'scale(1)', opacity: 1, offset: .4 }, { transform: 'scale(1.5)', opacity: 0 }],
      { duration: 320, easing: 'ease-out', fill: 'forwards' });
    stage.appendChild(layer);
    stage.animate([{ transform: 'scale(1)', filter: 'blur(0)' }, { transform: 'scale(1.06)', filter: 'blur(3px)', offset: .6 }, { transform: 'scale(1.1)', filter: 'blur(6px)' }],
      { duration: 300, easing: 'ease-in' });
    later(() => layer.remove(), 340);
  }

  function place(item, z) {
    if (item.fx) { if (!still) smear(); return null; }
    const el = document.createElement('div');
    el.className = 's';
    el.innerHTML = SVG[item.k] || `<img src="${src(item.k)}" alt="" draggable="false">`;
    if (item.clip && !still) {
      const v = document.createElement('video');
      Object.assign(v, { src: `${base}${item.k}.mp4`, muted: true, loop: true, autoplay: true, playsInline: true });
      v.style.webkitMaskImage = v.style.maskImage = `url(${src(item.k)})`;
      el.appendChild(v);
      v.play().catch(() => {});
    }
    el.style.width = item.w + '%';
    el.style.zIndex = z;
    stage.appendChild(el);
    const r = item.r || 0;
    const at = `translate(-50%, -50%) translate(${item.dx || 0}%, ${item.dy || 0}%)`;
    el.style.transform = `${at} rotate(${r}deg)`;
    if (still) { (item.shots || []).forEach(p => shoot(el, p)); return el; }
    // bang, bang, bang, after it lands
    (item.shots || []).forEach((p, i) => later(() => shoot(el, p), 620 + i * 300));
    if (item.texture) {
      el.animate([{ transform: `${at} scale(1.14)`, opacity: .2, filter: 'blur(7px)' }, { transform: `${at} scale(1)`, opacity: 1, filter: 'blur(0)' }],
        { duration: 220, easing: 'ease-out' });
      return el;
    }
    el.animate([
      { transform: `${at} rotate(${r * 4}deg) scale(${item.finale ? 2.6 : 1.8})`, opacity: 0, filter: 'blur(8px)' },
      { transform: `${at} rotate(${r}deg) scale(.95)`, opacity: 1, filter: 'blur(0)', offset: .7 },
      { transform: `${at} rotate(${r}deg) scale(1)`, opacity: 1 },
    ], { duration: item.finale ? 240 : 140, easing: 'cubic-bezier(.2,.9,.3,1.2)' });

    // landing thump
    later(() => {
      const amp = item.finale ? 5 : 2;
      stage.animate(
        Array.from({ length: 6 }, (_, i) => ({ transform: `translate(${(Math.random() - .5) * (6 - i) * amp}px, ${(Math.random() - .5) * (6 - i) * amp}px)` }))
          .concat({ transform: 'none' }), { duration: item.finale ? 360 : 160 });
      if (item.finale) flash.animate([{ opacity: .85 }, { opacity: 0 }], { duration: 420, easing: 'ease-out' });
    }, item.finale ? 180 : 100);

    return el;
  }

  const reset = () => { timers.forEach(clearTimeout); timers = []; stage.innerHTML = ''; stage.classList.remove('lit'); };
  // the finished pile, no motion
  const rest = () => { reset(); stage.classList.add('lit'); score.filter(s => !s.solo).forEach((s, i) => place(s, i + 1)); };

  let ready = false;
  function play() {
    if (!ready) return;
    if (still) return rest();
    reset();
    let t = 0, prevSolo = null;
    score.forEach((item, i) => {
      t += item.gap;
      later(() => {
        // the first couple replace each other, after that they pile up
        if (prevSolo) prevSolo.remove();
        if (!item.solo) stage.classList.add('lit');
        const el = place(item, i + 1);
        prevSolo = item.solo ? el : null;
      }, t);
    });
    if (opts.onDone) later(opts.onDone, t + 2000);
  }

  const images = score.filter(s => !SVG[s.k] && !s.fx).map(s => new Promise(ok => {
    const im = new Image(); im.onload = im.onerror = ok; im.src = src(s.k);
  }));
  // fetch the fonts the drawn stickers use up front, so nothing pops in blank
  const fonts = ['330px "Bowlby One"', '54px UnifrakturMaguntia', '11px "Press Start 2P"'].map(f => document.fonts.load(f, 'BNKD★'));
  Promise.all([...fonts, ...images]).then(() => {
    ready = true;
    const pick = mode.startsWith('k:') && score.find(s => s.k === mode.slice(2));
    if (pick) { stage.classList.add('lit'); place({ ...pick, gap: 0 }, 1); return; }
    if (still) return rest();
    play();
  });

  return { play };
};
