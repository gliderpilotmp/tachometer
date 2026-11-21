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

// Superellipse |x|^n + |y|^n = a^n: a rounded square for n around 4–6.
const squircle = (a, n) => {
  let d = "";
  for (let i = 0; i < 360; i += 3) {
    const t = (i * Math.PI) / 180, c = Math.cos(t), s = Math.sin(t);
    const x = a * Math.sign(c) * Math.abs(c) ** (2 / n), y = a * Math.sign(s) * Math.abs(s) ** (2 / n);
    d += `${i ? "L" : "M"}${x.toFixed(2)},${y.toFixed(2)}`;
  }
  return d + "Z";
};

const el = (tag, attrs, parent) => {
  const e = document.createElementNS(NS, tag);
  for (const k in attrs) e.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(e);
  return e;
};

// Mechanical counter: digits roll like real drums, higher digits turn only while all lower ones pass 9 -> 0.
function createDrum(group, sk, n, cw, ch, highlightLast, style) {
  const d = { ...sk.drum, ...style }, gap = 1.4, pad = 1.6, w = n * cw + (n - 1) * gap, clipId = `c${++uidSeq}`;
  const clip = el("clipPath", { id: clipId }, group);
  el("rect", { x: -w / 2 - pad, y: -ch / 2 - pad, width: w + 2 * pad, height: ch + 2 * pad, fill: d.frame }, group);
  const cells = [];
  for (let i = 0; i < n; i++) {
    const x = -w / 2 + i * (cw + gap), hl = highlightLast && i === n - 1;
    el("rect", { x, y: -ch / 2, width: cw, height: ch }, clip);
    el("rect", { x, y: -ch / 2, width: cw, height: ch, fill: hl ? d.lastBg : d.cell }, group);
    const holder = el("g", { "clip-path": `url(#${clipId})` }, group);
    const roll = el("g", {}, holder);
    const attrs = { x: x + cw / 2, "font-size": ch * 0.8, ...(d.font && { "font-family": d.font }), fill: hl ? d.lastInk : d.ink, "text-anchor": "middle", "dominant-baseline": "central" };
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
  // sc.map: [value, angle] pairs for non-linear scales such as an airspeed indicator.
  const ang = sc.map
    ? (v) => {
        const m = sc.map;
        if (v <= m[0][0]) return m[0][1];
        for (let i = 1; i < m.length; i++) {
          if (v <= m[i][0]) { const [v0, a0] = m[i - 1], [v1, a1] = m[i]; return a0 + ((v - v0) * (a1 - a0)) / (v1 - v0); }
        }
        return m[m.length - 1][1];
      }
    : (v) => sc.a0 + ((v - sc.v0) * (sc.a1 - sc.a0)) / (sc.v1 - sc.v0);
  const n = sk.squircle;
  const outline = (r, attrs) => (n ? `<path d="${squircle(r, n)}" ${attrs}/>` : `<circle r="${r}" ${attrs}/>`);
  const k = (an) => {
    if (!n) return 1;
    const t = (an * Math.PI) / 180;
    return (Math.abs(Math.cos(t)) ** n + Math.abs(Math.sin(t)) ** n) ** (-1 / n);
  };
  const pv = sc.pivot || 0;
  let s = `<svg viewBox="${sc.view || "-110 -110 220 220"}" role="img" aria-label="${label}" font-family="${sk.font}"><defs>
<radialGradient id="f${uid}" cx="50%" cy="42%" r="62%"><stop offset="0" stop-color="${sk.face[0]}"/><stop offset="1" stop-color="${sk.face[1]}"/></radialGradient>
<radialGradient id="h${uid}" cx="38%" cy="32%" r="75%"><stop offset="0" stop-color="#f6f6f4"/><stop offset=".55" stop-color="#acaca8"/><stop offset="1" stop-color="#5f5f5c"/></radialGradient>
<linearGradient id="g${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="p${uid}" width="3.4" height="3.4" patternUnits="userSpaceOnUse" patternTransform="rotate(40)"><rect width="1.7" height="3.4" fill="${sk.accent}"/></pattern>
<linearGradient id="b${uid}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f7f7f5"/><stop offset=".35" stop-color="#8d8d8a"/><stop offset=".6" stop-color="#e4e4e0"/><stop offset="1" stop-color="#5c5c59"/></linearGradient>
${sc.clip ? `<clipPath id="w${uid}"><path d="${sc.clip}"/></clipPath>` : ""}</defs>`;
  const bezelFill = sk.chrome ? `url(#b${uid})` : sk.bezel;
  if (sc.frame) s += `<path d="${sc.frame.bezel}" fill="${bezelFill}"/><path d="${sc.frame.face}" fill="url(#f${uid})"/>${sc.under || ""}`;
  else s += `${outline(n ? 104 : 109, `fill="${bezelFill}"`)}${outline(n ? 97.4 : 101.6, `fill="none" stroke="${sk.ring}" stroke-width="1.4"`)}${outline(n ? 96 : 100, `fill="url(#f${uid})"`)}`;

  for (const b of sk.bands || []) {
    s += `<circle r="${(b.r0 + b.r1) / 2}" fill="none" stroke="${b.fill}" stroke-width="${b.r1 - b.r0}"/>`;
    if (b.groove) for (let r = b.r0 + b.groove; r < b.r1 - 0.5; r += b.groove) s += `<circle r="${r.toFixed(2)}" fill="none" stroke="${b.grooveColor}" stroke-width=".5"/>`;
  }
  for (const rl of [].concat(sc.rimLine || [])) {
    const { r, w, from, to, hook } = rl, a0 = ang(from), a1 = ang(to);
    const [x1, y1] = P(a0, r), [x2, y2] = P(a1, r), [hx1, hy1] = P(a0, r - hook), [hx2, hy2] = P(a1, r - hook);
    s += `<path d="M${hx1},${hy1}L${x1},${y1}A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x2},${y2}L${hx2},${hy2}" fill="none" stroke="${ink}" stroke-width="${w}" stroke-linejoin="round"/>`;
  }

  // sc.spiral: the scale winds inward, radius shrinking by k per degree from angle a (for scales longer than one turn).
  const spR = (an) => sc.spiral.r - sc.spiral.k * (an - sc.spiral.a);
  s += `<g transform="translate(0 ${pv})">`;
  for (const z of sc.zones || []) {
    if (sc.spiral && z.off != null) {
      let d = "";
      for (let a = ang(z.from), end = ang(z.to); ; a = Math.min(end, a + 2)) {
        const [x, y] = P(a, spR(a) + z.off);
        d += `${d ? "L" : "M"}${x},${y}`;
        if (a >= end) break;
      }
      s += `<path d="${d}" fill="none" stroke="${z.color}" stroke-width="${z.w}"/>`;
    } else s += `<path d="${arc(ang(z.from), ang(z.to), z.r0, z.r1)}" fill="${z.color || (z.hatch ? `url(#p${uid})` : sk.accent)}"/>`;
  }
  for (let v = sc.from; v <= sc.to; v += sc.minor) {
    if ((sc.zones || []).some((z) => !z.hatch && !z.color && v > z.from && v < z.to)) continue;
    const M = sc.majorAt ? sc.majorAt.includes(v) : (v - (sc.majOff || 0)) % sc.major === 0, an = ang(v), R = sc.spiral ? spR(an) : sc.R * k(an);
    if (!M && sc.minorDot) { const [cx, cy] = P(an, R - sc.minL / 2); s += `<circle cx="${cx}" cy="${cy}" r="${sc.minW}" fill="${sc.tickInk || ink}"/>`; continue; }
    const [x1, y1] = P(an, R), [x2, y2] = P(an, R - (M ? sc.majL : sc.minL));
    s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${sc.tickInk || ink}" stroke-width="${M ? sc.majW : sc.minW}"/>`;
  }
  const L = sc.lab;
  const labelValues = L.values || Array.from({ length: Math.floor((sc.to - L.from) / L.step) + 1 }, (_, i) => L.from + i * L.step);
  for (const e of labelValues) {
    const [v, rr] = Array.isArray(e) ? e : [e];
    if (L.skip && L.skip.includes(v)) continue;
    const big = (v - (L.bigOffset || 0)) % L.big === 0 && !(L.small || []).includes(v), an = ang(v), [x, y] = P(an, rr ?? (big ? L.bigR : L.r) * k(an));
    const rot = L.rotate ? ` transform="rotate(${an.toFixed(1)} ${x} ${y})"` : "";
    const stroke = (L.stroke ? ` stroke="${ink}" stroke-width="${L.stroke}"` : "") + (L.italic ? ` font-style="italic"` : "");
    s += `<text x="${x}" y="${y}"${rot}${stroke} font-size="${big ? L.bigSize : L.size}" font-weight="${big ? L.bigWeight || 700 : 500}" fill="${ink}" text-anchor="middle" dominant-baseline="central">${L.div ? v / L.div : v}</text>`;
  }
  for (const m of sc.marks || []) {
    if (m.tri) {
      const an = ang(m.v), [x, y] = P(an, m.r), [x2, y2] = P(an - 3.2, m.r + 9), [x3, y3] = P(an + 3.2, m.r + 9);
      s += `<polygon points="${x},${y} ${x2},${y2} ${x3},${y3}" fill="${m.c || sk.accent}"/>`;
      continue;
    }
    const n = m.n || 1;
    for (let k = 0; k < n; k++) {
      const an = ang(m.v) + (k - (n - 1) / 2) * 2.2, [x1, y1] = P(an, m.r), [x2, y2] = P(an, m.r + (m.len || 5));
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${m.c || sk.accent}" stroke-width="${m.w || 1.6}"/>`;
    }
  }
  if (sc.inner) {
    // Secondary scale (e.g. mph) drawn at the angles its values reach on the main scale.
    const I = sc.inner, ia = (w) => ang(w * I.factor), b0 = ia(I.from), b1 = ia(I.to), big = b1 - b0 > 180 ? 1 : 0;
    for (const r of I.rings) {
      const [x1, y1] = P(b0, r), [x2, y2] = P(b1, r);
      s += `<path d="M${x1},${y1}A${r},${r} 0 ${big} 1 ${x2},${y2}" fill="none" stroke="${I.color}" stroke-width="${I.w}"/>`;
    }
    for (let w = I.from; w <= I.to; w += I.minor) {
      const [x1, y1] = P(ia(w), I.R), [x2, y2] = P(ia(w), I.R - I.L);
      s += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${I.color}" stroke-width="${I.w}"/>`;
    }
    for (let w = I.from; w <= I.to; w += I.step) {
      const [x, y] = P(ia(w), I.r);
      s += `<text x="${x}" y="${y}" font-size="${I.size}" font-weight="${I.weight || 400}" font-family="${I.font || sk.font}" fill="${I.color}" text-anchor="middle" dominant-baseline="central">${w}</text>`;
    }
  }
  s += `</g>`;
  for (const t of sc.texts || []) s += `<text x="${t.x || 0}" y="${t.y}" font-size="${t.s}" font-weight="${t.w || 500}" fill="${t.c || ink}" text-anchor="middle" dominant-baseline="central" letter-spacing=".04em">${t.t}</text>`;
  if (sc.decor) s += sc.decor;
  if (sc.lamp) s += `<circle cx="${sc.lamp[0]}" cy="${sc.lamp[1]}" r="4" fill="#0f2a1e" stroke="#000"/>`;
  for (const d of sc.dots || []) s += `<circle cx="${d[0]}" cy="${d[1]}" r="5" fill="${d[2]}"/>`;
  for (const p of sk.screws || []) s += `<circle cx="${p[0]}" cy="${p[1]}" r="3.2" fill="#1a1a1a" stroke="#000" stroke-width=".6"/><line x1="${p[0] - 2}" y1="${p[1]}" x2="${p[0] + 2}" y2="${p[1]}" stroke="#444" stroke-width=".8"/>`;
  s += `<g class="drums"></g>`;
  const nd = sc.needle || sk.needle, pts = `${-nd.b / 2},${nd.tail} ${nd.b / 2},${nd.tail} ${nd.t / 2},${-nd.len} ${-nd.t / 2},${-nd.len}`;
  s += `<g${sc.clip ? ` clip-path="url(#w${uid})"` : ""}><g transform="translate(0 ${pv})">`;
  if (nd.tailC) {
    // Pointer with a separate dark counterweight ending in a round knob.
    const main = `${-nd.b / 2},0 ${nd.b / 2},0 ${nd.t / 2},${-nd.len} 0,${-nd.len - nd.t} ${-nd.t / 2},${-nd.len}`;
    const tail = `${-nd.b / 2},0 ${nd.b / 2},0 ${nd.tb / 2},${nd.tail} ${-nd.tb / 2},${nd.tail}`;
    s += `<g class="needle"><g fill="#000" opacity=".4" transform="translate(1.6 2.2)"><polygon points="${main}"/><polygon points="${tail}"/><circle cy="${nd.tail}" r="${nd.knob}"/></g>`;
    s += `<polygon points="${tail}" fill="${nd.tailC}"/><circle cy="${nd.tail}" r="${nd.knob}" fill="${nd.tailC}"/><polygon points="${main}" fill="${nd.c}"/></g>`;
  } else s += `<g class="needle"><polygon points="${pts}" fill="#000" opacity=".4" transform="translate(1.6 2.2)"/><polygon points="${pts}" fill="${nd.c}"/></g>`;
  if (sc.hand2) {
    const h = sc.hand2, p2 = `${-h.b / 2},${h.tail} ${h.b / 2},${h.tail} ${h.t / 2},${-h.len} ${-h.t / 2},${-h.len}`;
    s += `<g class="needle2"><polygon points="${p2}" fill="#000" opacity=".4" transform="translate(1.6 2.2)"/><polygon points="${p2}" fill="${h.c}"/></g>`;
  }
  if (sk.hub.r) s += `<circle r="${sk.hub.r}" fill="${sk.hub.silver ? `url(#h${uid})` : sk.hub.fill}" stroke="#000" stroke-width=".8"/>`;
  s += `</g></g>`;
  if (!sc.frame) s += `<ellipse cx="0" cy="-52" rx="80" ry="44" fill="url(#g${uid})" pointer-events="none"/>`;
  s += `</svg>`;

  container.innerHTML = s;
  const svg = container.firstElementChild, needle = svg.querySelector(".needle"), drums = svg.querySelector(".drums");
  const needle2 = svg.querySelector(".needle2");
  let lastA = NaN;
  return {
    setValue(v) {
      if (sc.hands) {
        // Two-hand altimeter: long hand one turn per 1000 m, short hand one turn per 10 km; v is in units of 100 m.
        const m = Math.max(0, v * 100), a = +ang(m % 1000).toFixed(2);
        if (a !== lastA) { needle.setAttribute("transform", `rotate(${a})`); lastA = a; }
        needle2.setAttribute("transform", `rotate(${(sc.a0 + m * 0.036).toFixed(2)})`);
        return;
      }
      const a = +Math.max(sc.rest, Math.min(sc.a1 + 3, ang(v))).toFixed(2);
      if (a !== lastA) { needle.setAttribute("transform", `rotate(${a})`); lastA = a; }
    },
    addDrum(y, digits, cw, ch, highlightLast, style, x = 0) {
      return createDrum(el("g", { transform: `translate(${x} ${y})` }, drums), sk, digits, cw, ch, highlightLast, style);
    },
  };
}

// Citroën CX style: a numbered band slides sideways behind a magnifier; a fixed index line marks the value.
function createLupe(container, sk, sc, label) {
  const uid = ++uidSeq, { w: W, h: H, wy, D, sub, count, labelMul, bigSize } = sc, x0 = -W / 2, yb = wy + H - 4;
  let band = "";
  for (let i = 0; i <= count * sub; i++) {
    const x = +((i * D) / sub).toFixed(2), len = i % sub === 0 ? 11 : sub % 2 === 0 && i % (sub / 2) === 0 ? 7 : 4;
    band += `<line x1="${x}" y1="${yb}" x2="${x}" y2="${yb - len}" stroke="${sk.ink}" stroke-width="${len > 4 ? 1.6 : 1}"/>`;
  }
  for (let j = 0; j <= count; j++) {
    band += `<text x="${j * D}" y="${wy + H * 0.42}" font-size="${bigSize}" font-weight="700" fill="${sk.ink}" text-anchor="middle" dominant-baseline="central">${j * labelMul}</text>`;
  }
  let s = `<svg viewBox="${sc.view}" role="img" aria-label="${label}" font-family="${sk.font}"><defs>
<clipPath id="w${uid}"><rect x="${x0}" y="${wy}" width="${W}" height="${H}" rx="5"/></clipPath>
<linearGradient id="y${uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${sk.face[0]}"/><stop offset="1" stop-color="${sk.face[1]}"/></linearGradient>
<linearGradient id="l${uid}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".6"/><stop offset=".22" stop-color="#000" stop-opacity="0"/><stop offset=".78" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></linearGradient></defs>
<rect x="${sc.house[0]}" y="${sc.house[1]}" width="${sc.house[2]}" height="${sc.house[3]}" rx="8" fill="${sk.bezel}" stroke="${sk.ring}" stroke-width="1.5"/>
<rect x="${x0 - 3}" y="${wy - 3}" width="${W + 6}" height="${H + 6}" rx="7" fill="#0b0b0c"/>
<rect x="${x0}" y="${wy}" width="${W}" height="${H}" rx="5" fill="url(#y${uid})"/>
<g clip-path="url(#w${uid})"><g class="band">${band}</g>
<rect x="${x0}" y="${wy}" width="${W}" height="${H}" fill="url(#l${uid})"/>
<rect x="${x0}" y="${wy}" width="${W}" height="${H * 0.16}" fill="#fff" opacity=".16"/>
<rect x="-0.9" y="${wy}" width="1.8" height="${H}" fill="${sk.accent}"/></g>`;
  for (const t of sc.texts || []) s += `<text x="${t.x || 0}" y="${t.y}" font-size="${t.s}" font-weight="${t.w || 500}" fill="${t.c || "#cfcfca"}" text-anchor="middle" dominant-baseline="central" letter-spacing=".04em">${t.t}</text>`;
  s += `<g class="drums"></g></svg>`;

  container.innerHTML = s;
  const svg = container.firstElementChild, bandEl = svg.querySelector(".band"), drums = svg.querySelector(".drums");
  let lastX = NaN;
  return {
    setValue(v) {
      const units = Math.max(0, Math.min(count, v / labelMul));
      const x = +(-units * D).toFixed(2);
      if (x !== lastX) { bandEl.setAttribute("transform", `translate(${x} 0)`); lastX = x; }
    },
    addDrum(y, digits, cw, ch, highlightLast, style, x = 0) {
      return createDrum(el("g", { transform: `translate(${x} ${y})` }, drums), sk, digits, cw, ch, highlightLast, style);
    },
  };
}

export function createInstrument(container, sk, sc, label) {
  return (sk.type === "lupe" ? createLupe : createGauge)(container, sk, sc, label);
}
