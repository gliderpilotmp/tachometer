const NS = "http://www.w3.org/2000/svg";
let uidSeq = 0;

const P = (a, r) => {
  const t = (a * Math.PI) / 180;
  return [+(r * Math.sin(t)).toFixed(2), +(-r * Math.cos(t)).toFixed(2)];
};

const arc = (a0, a1, r0, r1) => {
  const L = a1 - a0 > 180 ? 1 : 0;
  const [x1, y1] = P(a0, r1), [x2, y2] = P(a1, r1), [x3, y3] = P(a1, r0), [x4, y4] = P(a0, r0);
  return `M${x1},${y1}A${r1},${r1} 0 ${L} 1 ${x2},${y2}L${x3},${y3}A${r0},${r0} 0 ${L} 0 ${x4},${y4}Z`;
};

const el = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
};

// Mechanical counter: digits roll like real drums, higher digits turn only while all lower ones pass 9 -> 0.
function createDrum(group, sk, n, cw, ch, highlightLast) {
  const d = sk.drum, gap = 1.4, pad = 1.6, w = n * cw + (n - 1) * gap, clipId = `c${++uidSeq}`;
  const clip = el("clipPath", { id: clipId }, group);
  el("rect", { x: -w / 2 - pad, y: -ch / 2 - pad, width: w + 2 * pad, height: ch + 2 * pad, fill: d.frame }, group);
  const cells = [];
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + i * (cw + gap), hl = highlightLast && i === n - 1;
    el("rect", { x, y: -ch / 2, width: cw, height: ch }, clip);
    el("rect", { x, y: -ch / 2, width: cw, height: ch, fill: hl ? d.lastBg : d.cell }, group);
    const holder = el("g", { "clip-path": `url(#${clipId})` }, group);
    const roll = el("g", {}, holder);
    const attrs = { x: x + cw / 2, "font-size": ch * 0.8, fill: hl ? d.lastInk : d.ink, "text-anchor": "middle", "dominant-baseline": "central" };
    const a = el("text", { ...attrs, y: 0.5 }, roll), b = el("text", { ...attrs, y: ch + 0.5 }, roll);
    if (d.border !== "none") el("rect", { x, y: -ch / 2, width: cw, height: ch, fill: "none", stroke: d.border, "stroke-width": 0.7 }, group);
    cells.push({ roll, a, b, last: -1, lastOff: NaN });
  }
  return (value) => {
    const x = Math.max(0, value), whole = Math.floor(x), frac = x - whole;
    for (let i = 0; i < n; i++) {
      const p = 10 ** (n - 1 - i), digit = Math.floor(x / p) % 10;
      const f = p === 1 ? frac : whole % p === p - 1 ? frac : 0;
      const c = cells[i], off = +(f * ch).toFixed(2);
      if (digit !== c.last) { c.a.textContent = digit; c.b.textContent = (digit + 1) % 10; c.last = digit; }
      if (off !== c.lastOff) { c.roll.setAttribute("transform", `translate(0 ${-off})`); c.lastOff = off; }
    }
  };
}

export function createGauge(container, sk, sc, label) {
  const uid = ++uidSeq, ink = sk.ink;
  const ang = (v) => sc.a0 + ((v - sc.v0) * (sc.a1 - sc.a0)) / (sc.v1 - sc.v0);
  let s = `<svg viewBox="-110 -110 220 220" role="img" aria-label="${label}" font-family="${sk.font}"><defs>
<radialGradient id="f${uid}" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="${sk.face[0]}"/><stop offset="1" stop-color="${sk.face[1]}"/></radialGradient>
<radialGradient id="h${uid}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f6f6f4"/><stop offset=".55" stop-color="#acaca8"/><stop offset="1" stop-color="#5f5f5c"/></radialGradient>
<linearGradient id="g${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="p${uid}" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="1.7" height="3.4" fill="${sk.accent}"/></pattern>
<linearGradient id="b${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f7f5"/><stop offset=".35" stop-color="#8d8d8a"/><stop offset=".6" stop-color="#e4e4e0"/><stop offset="1" stop-color="#5c5c59"/></linearGradient></defs>
<circle r="109" fill="${sk.chrome ? `url(#b${uid})` : sk.bezel}"/><circle r="101.6" fill="none" stroke="${sk.ring}" stroke-width="1.4"/><circle r="100" fill="url(#f${uid})"/>`;

  for (const b of sk.bands || []) {
    s += `<circle r="${(b.r0 + b.r1) / 2}" fill="none" stroke="${b.fill}" stroke-width="${b.r1 - b.r0}"/>`;
    if (b.groove) for (let r = b.r0 + b.groove; r < b.r1 - 0.5; r += b.groove) s += `<circle r="${r.toFixed(2)}" fill="none" stroke="${b.grooveColor}" stroke-width=".5"/>`;
  }
  if (sc.rimLine) {
    const { r, w, from, to, hook } = sc.rimLine, a0 = ang(from), a1 = ang(to);
    const [x1, y1] = P(a0, r), [x2, y2] = P(a1, r), [hx1, hy1] = P(a0, r - hook), [hx2, hy2] = P(a1, r - hook);
    s += `<path d="M${hx1},${hy1}L${x1},${y1}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x2},${y2}L${hx2},${hy2}" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linejoin="round"/>`;
  }

  for (const z of sc.zones || []) s += `<path d="${arc(ang(z.from), ang(z.to), z.r0, z.r1)}" fill="${z.hatch ? `url(#p${uid})` : sk.accent}"/>`;
  for (let v = sc.from; v <= sc.to; v += sc.minor) {
    if ((sc.zones || []).some((z) => !z.hatch && v > z.from && v < z.to)) continue;
    const M = v % sc.major === 0, an = ang(v);
    const [x1, y1] = P(an, sc.R), [x2, y2] = P(an, sc.R - (M ? sc.majL : sc.minL));
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${ink}" stroke-width="${M ? sc.majW : sc.minW}"/>`;
  }
  const L = sc.lab;
  for (let v = L.from; v <= sc.to; v += L.step) {
    if (L.skip && L.skip.includes(v)) continue;
    const big = (v - (L.bigOffset || 0)) % L.big === 0, an = ang(v), [x, y] = P(an, big ? L.bigR : L.r);
    const rot = L.rotate ? ` transform="rotate(${an.toFixed(1)} ${x} ${y})"` : "";
    s += `<text x="${x}" y="${y}"${rot} font-size="${big ? L.bigSize : L.size}" font-weight="${big ? L.bigWeight || 700 : 500}" fill="${ink}" text-anchor="middle" dominant-baseline="central">${v}</text>`;
  }
  for (const m of sc.marks || []) {
    const n = m.n || 1;
    for (let k = 0; k < n; k++) {
      const an = ang(m.v) + (k - (n - 1) / 2) * 2.2, [x1, y1] = P(an, m.r), [x2, y2] = P(an, m.r + 5);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sk.accent}" stroke-width="1.6"/>`;
    }
  }
  for (const t of sc.texts || []) s += `<text x="${t.x || 0}" y="${t.y}" font-size="${t.s}" font-weight="${t.w || 500}" fill="${t.c || ink}" text-anchor="middle" dominant-baseline="central" letter-spacing=".04em">${t.t}</text>`;
  if (sc.lamp) s += `<circle cx="${sc.lamp[0]}" cy="${sc.lamp[1]}" r="4" fill="#0f2a1e" stroke="#000"/>`;
  for (const d of sc.dots || []) s += `<circle cx="${d[0]}" cy="${d[1]}" r="5" fill="${d[2]}"/>`;
  for (const p of sk.screws || []) s += `<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="#1a1a1a" stroke="#000" stroke-width=".6"/><line x1="${p[0] - 2}" y1="${p[1]}" x2="${p[0] + 2}" y2="${p[1]}" stroke="#444" stroke-width=".8"/>`;
  s += `<g class="drums"></g>`;
  const nd = sk.needle, pts = `${-nd.b / 2},${nd.tail} ${nd.b / 2},${nd.tail} ${nd.t / 2},${-nd.len} ${-nd.t / 2},${-nd.len}`;
  s += `<g class="needle"><polygon points="${pts}" fill="#000" opacity=".4" transform="translate(1.6 2.2)"/><polygon points="${pts}" fill="${nd.c}"/></g>`;
  s += `<circle r="${sk.hub.r}" fill="${sk.hub.silver ? `url(#h${uid})` : sk.hub.fill}" stroke="#000" stroke-width=".8"/>`;
  s += `<ellipse cx="0" cy="-52" rx="80" ry="44" fill="url(#g${uid})" pointer-events="none"/></svg>`;

  container.innerHTML = s;
  const svg = container.firstElementChild, needle = svg.querySelector(".needle"), drums = svg.querySelector(".drums");
  let lastA = NaN;
  return {
    setValue(v) {
      const a = +Math.max(sc.rest, Math.min(sc.a1 + 3, ang(v))).toFixed(2);
      if (a !== lastA) { needle.setAttribute("transform", `rotate(${a})`); lastA = a; }
    },
    addDrum(y, n, cw, ch, highlightLast) {
      return createDrum(el("g", { transform: `translate(0 ${y})` }, drums), sk, n, cw, ch, highlightLast);
    },
  };
}
