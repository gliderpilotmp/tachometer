// Angles: degrees clockwise from 12 o'clock. v0/a0 and v1/a1 anchor the scale; rest is the needle stop pin.
// Dyane: wide arched dial, needle pivot hidden far below the window.
const DYANE = {
  view: "-110 -66 220 132", pivot: 150,
  frame: {
    bezel: "M-106,60L-106,-10C-106,-52 -62,-64 0,-64C62,-64 106,-52 106,-10L106,60Q106,64 102,64L-102,64Q-106,64 -106,60Z",
    face: "M-100,56L-100,-10C-100,-47 -58,-58 0,-58C58,-58 100,-47 100,-10L100,56Q100,58 98,58L-98,58Q-100,58 -100,56Z",
  },
  clip: "M-90,6C-90,-23 -50,-32 0,-32C50,-32 90,-23 90,6Z",
  under: `<path d="M-90,6C-90,-23 -50,-32 0,-32C50,-32 90,-23 90,6Z" fill="#c9ab8a"/><rect x="-100" y="6" width="200" height="4" fill="#bdbdb8"/>`,
};
const GEARS = `<g stroke="#f6f3ee" stroke-width="1.6" fill="none"><path d="M-7,36V50M0,36V50M7,36V43M-7,43H7"/></g>
<g fill="#f6f3ee" font-size="4.5" text-anchor="middle"><text x="-7" y="34">AR</text><text x="0" y="34">2</text><text x="7" y="34">4</text><text x="-7" y="55">1</text><text x="0" y="55">3</text></g>`;

// Testarossa: dark warning-lamp bar across the bottom of the dial.
const LAMP_BAR = `<path d="M-46,66Q0,58 46,66L42,90Q0,97 -42,90Z" fill="#26272a" stroke="#3a3b3e" stroke-width="1"/>
<g fill="#4a4b4f"><circle cx="-24" cy="78" r="6.5"/><circle cx="0" cy="79" r="6.5"/><circle cx="24" cy="78" r="6.5"/></g>
<g fill="#77787c"><path d="M-27,78L-21,74V82Z"/><path d="M27,78L21,74V82Z"/><circle cx="0" cy="79" r="2.6"/></g>`;

// Glider panel instruments: square housing with brass screws.
const SQ_BOX = "M-96,-108H96Q108,-108 108,-96V96Q108,108 96,108H-96Q-108,108 -108,96V-96Q-108,-108 -96,-108Z";
const ROUND_FACE = "M-97,0A97,97 0 1 0 97,0A97,97 0 1 0 -97,0Z";
const SCREW = (x, y) => `<circle cx="${x}" cy="${y}" r="7" fill="#c9a54e"/><circle cx="${x}" cy="${y}" r="4.2" fill="#141414"/>`;
const GLIDER_RIM = `<circle r="98.5" fill="none" stroke="#2c2c2c" stroke-width="3"/>`;

const ALT_BOX = "M-80,-108H96Q108,-108 108,-96V96Q108,108 96,108H-96Q-108,108 -108,96V-80Z";
const ALT_KNOB = `<circle cx="-93" cy="93" r="16" fill="#141414" stroke="#2e2e2e" stroke-width="2"/><circle cx="-93" cy="93" r="11" fill="#0a0a0a"/><ellipse cx="-97" cy="88" rx="5" ry="3" fill="#fff" opacity=".12"/>`;
// Pressure-setting window (Kollsman window) with its hPa scale, as on the original dial.
const KOLLSMAN = `<rect x="42" y="-15.5" width="31" height="31" rx="2" fill="#050505" stroke="#555" stroke-width=".8"/>
<g fill="#eee" font-size="6" text-anchor="middle" dominant-baseline="central"><text x="52" y="-10">950</text><text x="52" y="0.5">945</text><text x="51" y="10.5">940</text></g>
<g stroke="#eee" stroke-width=".7">${Array.from({ length: 15 }, (_, i) => `<line x1="${i % 5 === 2 ? 61 : 64}" y1="${-14 + i * 2}" x2="69" y2="${-14 + i * 2}"/>`).join("")}</g>
<polygon points="75,-2.5 71,0 75,2.5" fill="#eee"/>`;

export const SKINS = [
  {
    id: "w123", logo: [0, 44, 14], name: "Mercedes W123", era: "1976–1985", font: "'Barlow Semi Condensed', sans-serif",
    face: ["#1b1b1b", "#0b0b0b"], bezel: "#1c1c1c", ring: "#8f8f8a", ink: "#f2f1ea", accent: "#ff7d1e",
    needle: { c: "#ff7d1e", b: 4.4, t: 1.6, len: 86, tail: 6 }, hub: { r: 10, silver: true },
    drum: { frame: "#030303", cell: "#0e0e0e", ink: "#f2f1ea", border: "#2e2e2e", lastBg: "#e9e6dc", lastInk: "#111" },
    speed: {
      v0: 20, a0: -150, v1: 200, a1: 135, rest: -160, from: 10, to: 200, minor: 10, major: 20,
      R: 95, majL: 14, majW: 3.2, minL: 11, minW: 3,
      lab: { from: 20, step: 20, r: 67, size: 16, big: 20, bigSize: 16, bigR: 67 },
      zones: [{ from: 50, to: 60, r0: 86, r1: 96, hatch: true }],
      marks: [{ v: 46, r: 57 }, { v: 83, r: 57 }, { v: 123, r: 57, n: 3 }],
      odo: -27, trip: 26,
      texts: [{ y: 60, s: 10, t: "km/h" }, { y: 71, s: 4.6, t: "123 542 50 01" }],
    },
    alt: {
      v0: 0, a0: -135, v1: 40, a1: 135, rest: -138, from: 0, to: 40, minor: 1, major: 5,
      R: 95, majL: 14, majW: 3.2, minL: 7, minW: 2,
      lab: { from: 0, step: 5, r: 66, size: 17, big: 5, bigSize: 17, bigR: 66 },
      drum: 32, texts: [{ y: -32, s: 11, t: "HÖHE" }, { y: -20, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "w198", logo: [0, 62, 12], name: "Mercedes 300 SL", era: "W198 · 1954–1963", font: "'Barlow Semi Condensed', sans-serif",
    face: ["#1f2420", "#181c19"], bezel: "#b8b8b4", chrome: true, ring: "#5d5d5a", ink: "#ece6c0", accent: "#ece6c0",
    bands: [
      { r0: 54, r1: 84, fill: "#1d221e", groove: 2.4, grooveColor: "#2e3530" },
      { r0: 0, r1: 52, fill: "#0d0e0d" },
      { r0: 52, r1: 54, fill: "#9c9e99" },
    ],
    needle: { c: "#e9e3c4", b: 4.6, t: 2.2, len: 74, tail: 0 }, hub: { r: 13, silver: true },
    screws: [[-28, -4], [28, -4]],
    drum: { frame: "#050505", cell: "#0b0b0b", ink: "#f2f2ee", border: "#8d8f8a", lastBg: "#0b0b0b", lastInk: "#f2f2ee" },
    speed: {
      v0: 0, a0: -156, v1: 270, a1: 156, rest: -158, from: 0, to: 270, minor: 10, major: 30,
      R: 87, majL: 8, majW: 2, minL: 4.5, minW: 1.6,
      rimLine: { r: 88, w: 2.2, from: 0, to: 270, hook: 8 },
      lab: { from: 0, step: 30, r: 71, size: 16, big: 30, bigSize: 16, bigR: 71, bigWeight: 600 },
      odo: -24, odoDigits: 5, trip: 24, tripDigits: 3,
      texts: [{ x: 4, y: 76, s: 9, t: "km/h", w: 600 }],
    },
    alt: {
      v0: 0, a0: -150, v1: 40, a1: 150, rest: -153, from: 0, to: 40, minor: 1, major: 5,
      R: 87, majL: 8, majW: 2, minL: 4.5, minW: 1.4,
      rimLine: { r: 88, w: 2.2, from: 0, to: 40, hook: 8 },
      lab: { from: 0, step: 5, r: 70, size: 16, big: 5, bigSize: 16, bigR: 70, bigWeight: 600 },
      drum: 26, texts: [{ y: -30, s: 9, t: "HÖHE", w: 600 }, { y: -20, s: 7, t: "m × 100" }],
    },
  },
  {
    id: "e30", logo: [0, 44, 14], name: "BMW E30", era: "1982–1994", font: "'Archivo Narrow', sans-serif",
    face: ["#151515", "#0c0c0c"], bezel: "#0c0c0c", ring: "#0c0c0c", ink: "#f7f7f4", accent: "#e8261e",
    needle: { c: "#e8261e", b: 4.8, t: 4.2, len: 93, tail: 0 }, hub: { r: 13, fill: "#0a0a0a" },
    screws: [[-42, 2], [42, 2]],
    drum: { frame: "#000", cell: "#0b0b0b", ink: "#d8d8d2", border: "none", lastBg: "#d8d8d2", lastInk: "#222" },
    speed: {
      v0: 20, a0: -119, v1: 240, a1: 132, rest: -133, from: 10, to: 240, minor: 10, major: 20,
      R: 98, majL: 17, majW: 4.6, minL: 14, minW: 1.3,
      lab: { from: 20, step: 20, r: 66, size: 17, big: 20, bigSize: 17, bigR: 66 },
      odo: -24, trip: 26,
      odoStyle: { frame: "#222", cell: "#cfcec7", ink: "#555", border: "none" },
      texts: [
        { y: -40, s: 8, t: "km", w: 700 }, { y: 60, s: 9, t: "km/h", w: 700 },
        { y: 70, s: 5.5, t: "ELECTRONIC", w: 700 }, { y: 86, s: 4.2, t: "K=4838 EG" },
      ],
    },
    alt: {
      v0: 0, a0: -125, v1: 40, a1: 125, rest: -133, from: 0, to: 40, minor: 1, major: 5,
      R: 98, majL: 17, majW: 4.6, minL: 10, minW: 1.3,
      lab: { from: 0, step: 5, r: 66, size: 18, big: 5, bigSize: 18, bigR: 66 },
      drum: 34, texts: [{ y: -32, s: 10, t: "HÖHE" }, { y: -21, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "p911", logo: [0, 62, 16], name: "Porsche 911", era: "G-Modell 1974–1989", font: "'Jost', sans-serif",
    face: ["#22201e", "#121110"], bezel: "#0a0a0a", ring: "#3b3b3b", ink: "#f4f3ee", accent: "#ff6a13",
    needle: { c: "#ff6a13", b: 5.2, t: 4, len: 92, tail: 4 }, hub: { r: 13, fill: "#2b2a29" },
    screws: [[-39, 0], [39, 0]],
    drum: { frame: "#000", cell: "#0a0a0a", ink: "#f4f3ee", border: "#cfcfca", lastBg: "#f4f4f0", lastInk: "#111" },
    speed: {
      v0: 20, a0: -119.5, v1: 260, a1: 119.5, rest: -130, from: 10, to: 260, minor: 10, major: 20,
      R: 97, majL: 10, majW: 5, minL: 7, minW: 3.4,
      lab: {
        values: [[20, 79], [40, 71], [60, 78], [80, 71], [100, 78], [120, 75], [140, 63], [160, 76], [180, 79], [200, 71], [220, 79], [240, 71], [260, 79]],
        from: 20, step: 20, r: 78, size: 8.5, big: 40, bigSize: 15, bigR: 71, bigWeight: 600,
      },
      zones: [{ from: 58.5, to: 61.5, r0: 87, r1: 97 }],
      decor: `<g fill="none" stroke="#f4f3ee" stroke-width="1.1"><path d="M3,-77a4,4 0 0 1 0,8z"/><path d="M-1,-77h-6M-1,-74.5h-6M-1,-72h-6M-1,-69.5h-6M7,-77l4,-1.5M7,-73h4.5M7,-69l4,1.5"/></g>`,
      lamp: [0, -84], dots: [[0, 89, "#111"]], odo: -29, trip: 30,
      texts: [{ y: -41, s: 9.5, t: "KM", w: 600 }, { y: 71, s: 6, t: "ELECTRONIC", w: 600 }],
    },
    alt: {
      v0: 0, a0: -130, v1: 40, a1: 130, rest: -134, from: 0, to: 40, minor: 1, major: 5,
      R: 96, majL: 14, majW: 5, minL: 7, minW: 2.6,
      lab: { from: 0, step: 5, r: 72, size: 11, big: 10, bigSize: 19, bigR: 67 },
      drum: 32, texts: [{ y: -32, s: 10, t: "HÖHE", w: 600 }, { y: -20, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "p944", logo: [0, 62, 16], name: "Porsche 944", era: "1982–1991", font: "'Jost', sans-serif",
    face: ["#2e2e2f", "#262627"], bezel: "#111", ring: "#111", ink: "#f6f6f2", accent: "#ff5a14",
    needle: { c: "#ff5a14", b: 3.6, t: 3, len: 92, tail: 0 }, hub: { r: 14, fill: "#2a2a2a" },
    screws: [[-46, 9], [46, 9]],
    drum: { frame: "#0b0b0b", cell: "#060606", ink: "#f6f6f2", border: "none", lastBg: "#ece9df", lastInk: "#111" },
    speed: {
      v0: 20, a0: -122, v1: 260, a1: 116, rest: -128, from: 10, to: 260, minor: 10, major: 20,
      R: 97, majL: 15, majW: 3.6, minL: 9, minW: 3.2,
      lab: { from: 20, step: 20, r: 74, size: 10, big: 40, bigOffset: 20, bigSize: 18.5, bigR: 63, bigWeight: 700 },
      zones: [{ from: 55.5, to: 62, r0: 80, r1: 92 }],
      odo: -20, trip: 30,
      texts: [{ y: -37, s: 9, t: "KM", w: 700 }],
    },
    alt: {
      v0: 0, a0: -125, v1: 40, a1: 125, rest: -130, from: 0, to: 40, minor: 1, major: 5,
      R: 97, majL: 15, majW: 3.6, minL: 7, minW: 2.4,
      lab: { from: 0, step: 5, r: 73, size: 10, big: 10, bigSize: 21, bigR: 64 },
      drum: 32, texts: [{ y: -32, s: 9, t: "HÖHE", w: 700 }, { y: -21, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "p959", logo: [0, 46, 14], name: "Porsche 959", era: "1986–1988", font: "'Jost', sans-serif",
    face: ["#171717", "#0c0c0c"], bezel: "#0a0a0a", ring: "#8f8f8b", ink: "#f4f4f0", accent: "#ff4419",
    needle: { c: "#ff4d1a", b: 4.6, t: 3.6, len: 92, tail: 0 }, hub: { r: 13, fill: "#262626" },
    screws: [[-30, 0], [30, 0]],
    drum: { frame: "#000", cell: "#0a0a0a", ink: "#f4f3ee", border: "#6a6a6a", lastBg: "#f4f4f0", lastInk: "#111" },
    speed: {
      v0: 20, a0: -122, v1: 340, a1: 124, rest: -130, from: 10, to: 340, minor: 10, major: 20,
      R: 96, majL: 12, majW: 4, minL: 7, minW: 2.6,
      lab: { from: 20, step: 20, r: 75, size: 9.5, big: 40, bigOffset: 20, bigSize: 17, bigR: 69, bigWeight: 700, small: [180] },
      zones: [{ from: 59.2, to: 60.8, r0: 76, r1: 96 }],
      decor: `<g fill="none" stroke="#f4f4f0" stroke-width="1.1"><path d="M3,-64a4,4 0 0 1 0,8z"/><path d="M-1,-64h-6M-1,-61.5h-6M-1,-59h-6M-1,-56.5h-6"/></g>`,
      dots: [[0, 94, "#1a1a1a"]],
      odo: -22, trip: 25,
      texts: [{ y: -38, s: 9, t: "KM", w: 700 }, { y: 64, s: 5.5, t: "ELECTRONIC", w: 600 }],
    },
    alt: {
      v0: 0, a0: -122, v1: 40, a1: 124, rest: -130, from: 0, to: 40, minor: 1, major: 5,
      R: 96, majL: 12, majW: 4, minL: 7, minW: 2.4,
      lab: { from: 0, step: 5, r: 74, size: 10, big: 10, bigSize: 18, bigR: 68, bigWeight: 700 },
      drum: 32, texts: [{ y: -32, s: 10, t: "HÖHE", w: 700 }, { y: -21, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "p356", logo: [0, 62, 14], name: "Porsche 356", era: "1948–1965", font: "'Barlow Semi Condensed', sans-serif",
    face: ["#2c3647", "#222a38"], bezel: "#b8b8b4", chrome: true, ring: "#5d5d5a", ink: "#eef1f3", accent: "#d8333a",
    bands: [
      { r0: 50, r1: 85, fill: "#28313f", groove: 2.6, grooveColor: "#323d4e" },
      { r0: 0, r1: 46, fill: "#1d2430", groove: 2.6, grooveColor: "#262e3c" },
      { r0: 46, r1: 48.5, fill: "#c9ced4" },
    ],
    needle: { c: "#dfe3e6", b: 5, t: 2, len: 80, tail: 0 }, hub: { r: 10, fill: "#101317" },
    drum: { frame: "#000", cell: "#0b0b0b", ink: "#f2f2ee", border: "#9aa0a6", lastBg: "#0b0b0b", lastInk: "#f2f2ee" },
    speed: {
      v0: 0, a0: -142, v1: 200, a1: 142, rest: -146, from: 0, to: 200, minor: 10, major: 20,
      R: 94, majL: 7, majW: 2.2, minL: 7, minW: 2.2,
      rimLine: [{ r: 94, w: 1.4, from: 0, to: 200, hook: 0 }, { r: 87, w: 1.4, from: 0, to: 200, hook: 0 }],
      lab: { from: 0, step: 20, r: 70, size: 15, big: 20, bigSize: 15, bigR: 70, bigWeight: 500 },
      marks: [{ v: 35, r: 88.5, n: 2, w: 1.8 }, { v: 105, r: 88.5, n: 3, w: 1.8 }],
      odo: 22, odoDigits: 5, trip: null,
      texts: [{ y: 36, s: 6, t: "KM", w: 600 }],
    },
    alt: {
      v0: 0, a0: -142, v1: 40, a1: 142, rest: -146, from: 0, to: 40, minor: 2, major: 10,
      R: 94, majL: 7, majW: 2.2, minL: 7, minW: 2.2,
      rimLine: [{ r: 94, w: 1.4, from: 0, to: 40, hook: 0 }, { r: 87, w: 1.4, from: 0, to: 40, hook: 0 }],
      lab: { from: 0, step: 5, r: 70, size: 15, big: 5, bigSize: 15, bigR: 70, bigWeight: 500 },
      drum: 22, texts: [{ y: -24, s: 7.5, t: "HÖHE", w: 600 }, { y: 36, s: 6, t: "m × 100" }],
    },
  },
  {
    id: "vwbus", logo: [0, 64, 12], name: "VW Bus T1", era: "1950–1967", font: "'Barlow Semi Condensed', sans-serif",
    face: ["#c2b796", "#a99e7e"], bezel: "#b8b8b4", chrome: true, ring: "#6a6a66", ink: "#efe0a6", accent: "#d9352a",
    bands: [{ r0: 44, r1: 88, fill: "#26211d", groove: 2.6, grooveColor: "#3d3630" }],
    needle: { c: "#f1ead6", b: 3.4, t: 1.2, len: 64, tail: 0 }, hub: { r: 10, fill: "#151413" },
    screws: [[-36, -8], [36, -8]],
    drum: { frame: "#151413", cell: "#ece6d2", ink: "#151413", border: "#5a554c", lastBg: "#ece6d2", lastInk: "#151413" },
    speed: {
      v0: 20, a0: -135, v1: 120, a1: 125, rest: -142, from: 15, to: 125, minor: 5, major: 10,
      R: 62, majL: 9, majW: 3, minL: 5, minW: 2.4,
      lab: { from: 20, step: 20, r: 75, size: 17, big: 20, bigSize: 17, bigR: 75, bigWeight: 600 },
      zones: [{ from: 33.5, to: 36.5, r0: 53, r1: 62 }],
      dots: [[-14, -91, "#1f3b27"], [24, -90, "#1f3b27"], [-30, 82, "#4a1d1d"], [0, 85, "#1d2440"], [30, 82, "#1d3a26"]],
      odo: 26, odoDigits: 5, trip: null,
      texts: [{ y: 41, s: 7, t: "km", w: 600, c: "#151413" }],
    },
    alt: {
      v0: 0, a0: -135, v1: 40, a1: 125, rest: -142, from: 0, to: 40, minor: 1, major: 5,
      R: 62, majL: 9, majW: 3, minL: 5, minW: 2,
      lab: { from: 0, step: 10, r: 75, size: 17, big: 10, bigSize: 17, bigR: 75, bigWeight: 600 },
      drum: 26, texts: [{ y: -24, s: 8, t: "HÖHE", w: 600, c: "#151413" }, { y: 41, s: 6.5, t: "m × 100", c: "#151413" }],
    },
  },
  {
    id: "golf1", logo: [0, 68, 14], name: "VW Golf 1", era: "1974–1983", font: "'Barlow', sans-serif", squircle: 5,
    face: ["#2f2a26", "#231f1b"], bezel: "#0e0e0e", ring: "#0e0e0e", ink: "#f2efe8", accent: "#e8452c",
    needle: { c: "#f0ead8", b: 5, t: 3, len: 84, tail: 18 }, hub: { r: 8, fill: "#0b0b0b" },
    screws: [[-40, -2], [40, -2]],
    drum: { frame: "#000", cell: "#0b0b0b", ink: "#f2efe8", border: "#9a9890", lastBg: "#0b0b0b", lastInk: "#e8452c" },
    speed: {
      v0: 20, a0: -116, v1: 200, a1: 122, rest: -128, from: 10, to: 200, minor: 10, major: 20,
      R: 92, majL: 14, majW: 3.2, minL: 8, minW: 2.4,
      lab: { from: 20, step: 20, r: 70, size: 14, big: 20, bigSize: 14, bigR: 70, bigWeight: 500 },
      zones: [{ from: 48.5, to: 51.5, r0: 82, r1: 95 }],
      odo: -24, trip: 22,
      texts: [{ y: -38, s: 6, t: "km" }, { y: 50, s: 8, t: "km/h" }],
    },
    alt: {
      v0: 0, a0: -120, v1: 40, a1: 120, rest: -128, from: 0, to: 40, minor: 1, major: 5,
      R: 92, majL: 14, majW: 3.2, minL: 7, minW: 2,
      lab: { from: 0, step: 5, r: 69, size: 15, big: 5, bigSize: 15, bigR: 69, bigWeight: 500 },
      drum: 32, texts: [{ y: -32, s: 10, t: "HÖHE" }, { y: -21, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "rekorde", logo: [-26, 60, 14], name: "Opel Rekord E", era: "1977–1986", font: "'Michroma', sans-serif",
    face: ["#151515", "#0c0c0c"], bezel: "#0a0a0a", ring: "#1c1c1c", ink: "#f4f4f0", accent: "#e8402a",
    needle: { c: "#ffa51c", b: 5.6, t: 4, len: 86, tail: 0 }, hub: { r: 13, fill: "#161616" },
    drum: { frame: "#000", cell: "#0b0b0b", ink: "#ecece6", border: "none", lastBg: "#ecebe3", lastInk: "#111", font: "'Barlow', sans-serif" },
    speed: {
      v0: 20, a0: -160, v1: 200, a1: 130, rest: -166, from: 20, to: 200, minor: 10, major: 20,
      R: 92, majL: 7, majW: 2.6, minL: 7, minW: 2.6,
      lab: { from: 20, step: 20, r: 67, size: 11, big: 20, bigSize: 11, bigR: 67, bigWeight: 400, stroke: 0.7 },
      marks: [{ v: 50, r: 87, w: 2.6 }],
      odo: -22, odoTenths: true, trip: null,
      texts: [{ x: 26, y: 56, s: 6.5, t: "km/h" }, { x: 26, y: 64, s: 4.5, t: "W=788" }],
    },
    alt: {
      v0: 0, a0: -150, v1: 40, a1: 130, rest: -156, from: 0, to: 40, minor: 2.5, major: 5,
      R: 92, majL: 7, majW: 2.6, minL: 7, minW: 2.6,
      lab: { from: 0, step: 5, r: 68, size: 11, big: 5, bigSize: 11, bigR: 68, bigWeight: 400, stroke: 0.7 },
      drum: 32, texts: [{ y: -32, s: 7, t: "HÖHE" }, { y: -22, s: 5.5, t: "m × 100" }],
    },
  },
  {
    id: "dyane", logo: [62, 46, 12], name: "Citroën Dyane", era: "1967–1983", font: "'Jost', sans-serif",
    face: ["#8f6b4f", "#7b5b42"], bezel: "#b8b8b4", chrome: true, ring: "#5d5d5a", ink: "#f6f3ee", accent: "#f0552a",
    needle: { c: "#ff5f2a", b: 2.6, t: 2.2, len: 178, tail: 0 }, hub: { r: 0 },
    drum: { frame: "#3a2d22", cell: "#111", ink: "#eeeeea", border: "none", lastBg: "#111", lastInk: "#eeeeea" },
    speed: {
      ...DYANE, under: DYANE.under + GEARS,
      v0: 20, a0: -21, v1: 120, a1: 21, rest: -26, from: 30, to: 130, minor: 10, major: 20,
      R: 176, majL: 6, majW: 1.6, minL: 4, minW: 1.5, tickInk: "#2a1d14", minorDot: true,
      lab: { from: 20, step: 20, r: 200, size: 14, big: 20, bigSize: 14, bigR: 200, bigWeight: 600 },
      marks: [{ v: 45, r: 170, w: 2.2 }, { v: 65, r: 170, w: 2.2 }, { v: 85, r: 170, w: 2.2 }],
      odo: 21, odoDigits: 5, trip: 33, tripX: -62,
      texts: [{ x: -62, y: 20, s: 7, t: "km" }, { x: 62, y: 30, s: 12, t: "km/h", w: 600 }],
    },
    alt: {
      ...DYANE,
      v0: 0, a0: -22, v1: 40, a1: 23, rest: -27, from: 0, to: 40, minor: 2.5, major: 5,
      R: 176, majL: 6, majW: 1.6, minL: 4, minW: 1.5, tickInk: "#2a1d14", minorDot: true,
      lab: { from: 0, step: 5, r: 200, size: 13, big: 5, bigSize: 13, bigR: 200, bigWeight: 600 },
      drum: 30, texts: [{ x: -62, y: 30, s: 11, t: "HÖHE", w: 600 }, { x: 62, y: 30, s: 11, t: "m × 100", w: 600 }],
    },
  },
  {
    id: "cx", logo: [0, -54, 7], name: "Citroën CX", era: "Lupentacho · 1974–1985", type: "lupe", font: "'Barlow Semi Condensed', sans-serif",
    face: ["#f7d75a", "#e0a92a"], bezel: "#2a2b2e", ring: "#45474b", ink: "#1b1408", accent: "#d8261c",
    drum: { frame: "#0b0b0c", cell: "#111", ink: "#eeeeea", border: "none", lastBg: "#111", lastInk: "#eeeeea" },
    speed: {
      view: "-90 -62 180 124", house: [-86, -58, 172, 116], w: 150, h: 76, wy: -50,
      D: 70, sub: 5, count: 22, labelMul: 10, bigSize: 40,
      odo: 43, odoX: -34, odoDigits: 5, trip: 43, tripX: 38,
      texts: [{ x: 74, y: 43, s: 7, t: "km/h" }],
    },
    alt: {
      view: "-90 -62 180 124", house: [-86, -58, 172, 116], w: 150, h: 76, wy: -50,
      D: 64, sub: 10, count: 40, labelMul: 1, bigSize: 40,
      drum: 43, drumX: 34,
      texts: [{ x: -38, y: 43, s: 7.5, t: "HÖHE · m × 100" }],
    },
  },
  {
    id: "abarth", logo: [0, 70, 18], name: "Fiat 500 Abarth", era: "595/695 · 1963–1971", font: "'Archivo Narrow', sans-serif",
    face: ["#d9262c", "#b91a20"], bezel: "#b8b8b4", chrome: true, ring: "#5d5d5a", ink: "#f3ede0", accent: "#f3ede0",
    needle: { c: "#efe8d8", b: 7, t: 3, len: 84, tail: 0 }, hub: { r: 15, fill: "#efe8d8" },
    screws: [[-34, 4], [34, 4]],
    drum: { frame: "#1a1a1a", cell: "#f3f1ea", ink: "#111", border: "#777", lastBg: "#f3f1ea", lastInk: "#c8201e" },
    speed: {
      v0: 10, a0: -140, v1: 170, a1: 122, rest: -146, from: 10, to: 170, minor: 5, major: 10,
      R: 89, majL: 12, majW: 2.4, minL: 7, minW: 2,
      rimLine: { r: 90, w: 1.8, from: 10, to: 170, hook: 10 },
      lab: { from: 10, step: 20, r: 68, size: 14, big: 20, bigSize: 14, bigR: 68, rotate: true },
      odo: -34, odoTenths: true, trip: null,
      texts: [{ y: 44, s: 9, t: "Km/h" }],
    },
    alt: {
      v0: 0, a0: -135, v1: 40, a1: 135, rest: -140, from: 0, to: 40, minor: 1, major: 5,
      R: 89, majL: 12, majW: 2.4, minL: 7, minW: 2,
      rimLine: { r: 90, w: 1.8, from: 0, to: 40, hook: 10 },
      lab: { from: 0, step: 5, r: 68, size: 15, big: 5, bigSize: 15, bigR: 68, rotate: true },
      drum: 34, texts: [{ y: -32, s: 10, t: "HÖHE" }, { y: -21, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "spider", logo: [0, 48, 16], name: "Alfa Romeo Spider", era: "1966–1993", font: "'Archivo Narrow', sans-serif",
    face: ["#141414", "#0b0b0b"], bezel: "#b8b8b4", chrome: true, ring: "#4f4f4c", ink: "#efeee6", accent: "#d9261c",
    needle: { c: "#f2f2ee", b: 3.4, t: 1.8, len: 90, tail: 10 }, hub: { r: 11, silver: true },
    screws: [[-24, -6], [24, -6]],
    drum: { frame: "#0a0a0a", cell: "#121212", ink: "#f2f2ee", border: "none", lastBg: "#d42a22", lastInk: "#fff" },
    speed: {
      v0: 20, a0: 143.5, v1: 220, a1: 409, rest: 134, from: 15, to: 220, minor: 5, major: 10,
      R: 96, majL: 12, majW: 2, minL: 6, minW: 1.4,
      lab: { from: 20, step: 20, r: 74, size: 14, big: 20, bigSize: 14, bigR: 74, bigWeight: 500 },
      dots: [[57, -22, "#1c1c1c"]],
      odo: -26, odoDigits: 5, trip: 26,
      odoStyle: { frame: "#222", cell: "#ecebe4", ink: "#151515", border: "none" },
      texts: [{ y: -40, s: 9.5, t: "km/h" }, { x: 57, y: -10, s: 5.5, t: "RISCALD.", w: 700 }, { x: 57, y: 10, s: 5.5, t: "GENERAT.", w: 700 }],
    },
    alt: {
      v0: 0, a0: 143.5, v1: 40, a1: 409, rest: 136, from: 0, to: 40, minor: 1, major: 5,
      R: 96, majL: 12, majW: 2, minL: 6, minW: 1.4,
      lab: { from: 0, step: 5, r: 73, size: 15, big: 5, bigSize: 15, bigR: 73, bigWeight: 500 },
      drum: -26, texts: [{ y: -42, s: 9, t: "HÖHE" }, { y: 24, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "stratos", logo: [0, 76, 12], name: "Lancia Stratos", era: "HF Stradale · 1973–1978", font: "'Barlow', sans-serif",
    face: ["#171615", "#0e0d0d"], bezel: "#0b0b0b", ring: "#1a1a1a", ink: "#f0efea", accent: "#d9261c",
    needle: { c: "#eeece4", b: 7, t: 2.4, len: 84, tail: 0 }, hub: { r: 6, fill: "#111" },
    screws: [[-30, -2], [30, -2]],
    drum: { frame: "#0a0a0a", cell: "#101010", ink: "#f2f2ee", border: "#bdbdb6", lastBg: "#d42a22", lastInk: "#fff" },
    speed: {
      v0: 10, a0: -137, v1: 250, a1: 141, rest: -146, from: 0, to: 260, minor: 10, major: 30, majOff: 10,
      R: 93, majL: 12, majW: 2.4, minL: 9, minW: 2,
      lab: { from: 10, step: 30, r: 70, size: 15, big: 30, bigSize: 15, bigR: 70, bigWeight: 400 },
      dots: [[-40, 80, "#1b1b1b"], [40, 80, "#1b1b1b"]],
      odo: -30, odoDigits: 5, trip: 32,
      texts: [{ y: 60, s: 8, t: "km/h" }],
    },
    alt: {
      v0: 0, a0: -137, v1: 40, a1: 137, rest: -142, from: 0, to: 40, minor: 2.5, major: 10,
      R: 93, majL: 12, majW: 2.4, minL: 9, minW: 2,
      lab: { from: 0, step: 5, r: 70, size: 15, big: 5, bigSize: 15, bigR: 70, bigWeight: 400 },
      drum: 32, texts: [{ y: -32, s: 10, t: "HÖHE" }, { y: -21, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "countach", logo: [-2, 76, 18], name: "Lamborghini Countach", era: "1974–1990", font: "'Michroma', sans-serif",
    face: ["#23272a", "#1a1d20"], bezel: "#0c0d0e", ring: "#2a2d30", ink: "#a9dcc7", accent: "#ff8a2a",
    needle: { c: "#ff8a2a", b: 3.8, t: 3, len: 92, tail: 0 }, hub: { r: 14, fill: "#2b2e31" },
    screws: [[-58, 0], [58, 0]],
    drum: { frame: "#050505", cell: "#0e0e0e", ink: "#f2f2ee", border: "none", lastBg: "#0e0e0e", lastInk: "#e3a43a", font: "'Barlow', sans-serif" },
    speed: {
      v0: 0, a0: -134, v1: 320, a1: 134, rest: -136, from: 0, to: 320, minor: 10, major: 20,
      R: 97, majL: 10, majW: 2.2, minL: 6, minW: 1.6,
      lab: { from: 0, step: 20, r: 74, size: 9, big: 20, bigSize: 9, bigR: 74, bigWeight: 400, stroke: 0.6 },
      inner: {
        factor: 1.609, from: 0, to: 200, minor: 10, step: 20, rings: [56, 50], R: 56, L: 6, w: 1.1,
        r: 44, size: 6.5, color: "#f2f2ee", font: "'Barlow Semi Condensed', sans-serif",
      },
      odo: -20, odoCw: 9, trip: 30,
      texts: [
        { x: 34, y: 44, s: 5.5, t: "m.p.h", c: "#f2f2ee", w: 600 },
        { x: 34, y: 66, s: 6, t: "km/h", w: 600 },
      ],
    },
    alt: {
      v0: 0, a0: -134, v1: 40, a1: 134, rest: -136, from: 0, to: 40, minor: 1, major: 5,
      R: 96, majL: 14, majW: 2.2, minL: 7, minW: 1.6,
      lab: { from: 0, step: 5, r: 75, size: 10, big: 5, bigSize: 10, bigR: 75, bigWeight: 400, stroke: 0.6 },
      drum: 32, texts: [{ y: -32, s: 7, t: "HÖHE", c: "#f2f2ee" }, { y: -21, s: 5.5, t: "m × 100", c: "#f2f2ee" }],
    },
  },
  {
    id: "testarossa", logo: [-14, 44, 14], name: "Ferrari Testarossa", era: "1984–1991", font: "'Archivo Narrow', sans-serif",
    face: ["#141414", "#0b0b0b"], bezel: "#1b1c1e", ring: "#2c2d30", ink: "#ff8a1e", accent: "#ff8a1e",
    needle: { c: "#ff8a1e", b: 3.2, t: 2.2, len: 86, tail: 8 }, hub: { r: 6, fill: "#0c0c0c" },
    screws: [[-13, -3], [13, -3]],
    drum: { frame: "#0a0a0a", cell: "#121212", ink: "#ff8a1e", border: "none", lastBg: "#121212", lastInk: "#ff8a1e" },
    speed: {
      v0: 0, a0: -132, v1: 320, a1: 129, rest: -134, from: 0, to: 320, minor: 10, major: 20,
      R: 96, majL: 11, majW: 2.2, minL: 6, minW: 1.6,
      lab: { from: 0, step: 20, r: 74, size: 13, big: 20, bigSize: 13, bigR: 74, bigWeight: 700, italic: true },
      decor: LAMP_BAR,
      odo: null, trip: null,
      texts: [{ y: -30, s: 6.5, t: "electronic", w: 700 }, { x: 18, y: 36, s: 6.5, t: "km/h", w: 700 }],
    },
    alt: {
      v0: 0, a0: -132, v1: 40, a1: 129, rest: -134, from: 0, to: 40, minor: 1, major: 5,
      R: 96, majL: 11, majW: 2.2, minL: 6, minW: 1.6,
      lab: { from: 0, step: 5, r: 74, size: 14, big: 5, bigSize: 14, bigR: 74, bigWeight: 700, italic: true },
      decor: LAMP_BAR,
      drum: null, texts: [{ y: -30, s: 7, t: "HÖHE", w: 700 }, { x: 18, y: 36, s: 7, t: "x 100", w: 700 }],
    },
  },
  {
    id: "f40", logo: [0, -52, 14], name: "Ferrari F40", era: "1987–1992", font: "'Archivo Narrow', sans-serif",
    face: ["#3a3a3b", "#232324"], bezel: "#0b0b0b", ring: "#2c2c2c", ink: "#ecebe6", accent: "#c8201e",
    needle: { c: "#f2f2ec", b: 4, t: 3.2, len: 90, tail: 4 }, hub: { r: 12, fill: "#0c0c0c" },
    screws: [[-30, 5], [30, 5]],
    drum: { frame: "#0a0a0a", cell: "#121212", ink: "#f2f2ec", border: "none", lastBg: "#c8201e", lastInk: "#fff" },
    speed: {
      v0: 0, a0: -122, v1: 360, a1: 122, rest: -124, from: 0, to: 360, minor: 10, major: 20,
      R: 96, majL: 13, majW: 2.4, minL: 7, minW: 1.6,
      lab: { from: 0, step: 20, r: 75, size: 8.5, big: 40, bigSize: 16, bigR: 69, skip: [20] },
      dots: [[-34, 84, "#1f4a3a"], [0, 88, "#4a2a28"], [34, 84, "#2a2a40"]],
      odo: -30, trip: 34,
      texts: [{ x: -40, y: 66, s: 8, t: "km/h" }],
    },
    alt: {
      v0: 0, a0: -122, v1: 40, a1: 122, rest: -124, from: 0, to: 40, minor: 1, major: 5,
      R: 96, majL: 13, majW: 2.4, minL: 7, minW: 1.6,
      lab: { from: 0, step: 5, r: 73, size: 10, big: 10, bigSize: 19, bigR: 68 },
      drum: 32, texts: [{ y: -32, s: 10, t: "HÖHE" }, { y: -20, s: 7.5, t: "m × 100" }],
    },
  },
  {
    id: "arcus", logo: [-30, 52, 12], name: "Arcus · Winter", era: "Segelflug-Instrumente", font: "'Barlow', sans-serif",
    face: ["#151515", "#0d0d0d"], bezel: "#121212", ring: "#2c2c2c", ink: "#f2f2ee", accent: "#f2c230",
    needle: { c: "#f4f4f0", b: 3.4, t: 1.6, len: 92, tail: 30 }, hub: { r: 7, fill: "#1a1a1a" },
    drum: { frame: "#000", cell: "#0e0e0e", ink: "#f2f2ee", border: "#555", lastBg: "#0e0e0e", lastInk: "#f2f2ee" },
    speed: {
      frame: { bezel: SQ_BOX, face: ROUND_FACE },
      under: GLIDER_RIM + SCREW(-92, -92) + SCREW(92, -92) + SCREW(-92, 92) + SCREW(92, 92),
      map: [[0, 180], [40, 202.7], [60, 250.7], [80, 304.5], [100, 353.3], [120, 391.3], [150, 444.3], [200, 545], [250, 612], [300, 680]],
      a1: 680, rest: 180, from: 40, to: 300, minor: 10, majorAt: [40, 60, 80, 100, 120, 150, 200, 250, 300],
      spiral: { a: 202.7, r: 92, k: 0.1027 },
      majL: 9, majW: 2.6, minL: 6, minW: 2,
      zones: [
        { from: 82, to: 95, off: 9, w: 5, color: "#f2f2ee" },
        { from: 95, to: 180, off: 9, w: 5, color: "#16a05c" },
        { from: 180, to: 270, off: 9, w: 5, color: "#f3c623" },
        { from: 270, to: 300, off: 9, w: 1.3, color: "#f2f2ee" },
      ],
      lab: {
        values: [[40, 73], [60, 68], [80, 62], [100, 58], [120, 52], [150, 47], [200, 41], [250, 27], [300, 22]],
        from: 0, step: 1, r: 0, size: 15, big: 1, bigSize: 15, bigR: 0, bigWeight: 600,
      },
      marks: [
        { v: 95, r: 83, tri: true, c: "#f3a623" },
        { v: 90, r: 65, len: 14, w: 3, c: "#2a8be0" },
        { v: 270, r: 30, len: 30, w: 4, c: "#e0261c" },
      ],
      decor: `<g stroke="#f2f2ee" stroke-width="4"><line x1="47" y1="24.8" x2="77" y2="30.1"/><line x1="24" y1="40" x2="58.5" y2="80.3"/></g>`,
      needle: { c: "#f4f4f0", b: 4.6, t: 2.8, len: 90, tail: 30, tb: 4, tailC: "#151515", knob: 5 },
      odo: null, trip: null,
      texts: [
        { x: -8, y: -42, s: 11, t: "winter", w: 600 },
        { x: 30, y: -23, s: 5, t: "HM-8-101", w: 600 },
        { x: 30, y: -16, s: 5, t: "WNr.119468", w: 600 },
        { x: -2, y: 27, s: 10, t: "km/h" },
        { x: 35, y: 23, s: 9, t: "+2+1", c: "#e8743a", w: 600 },
        { x: 83, y: 34, s: 9, t: "L", c: "#e8743a", w: 600 },
        { x: 58.5, y: 63, s: 9, t: "0", c: "#e8743a", w: 600 },
        { x: 38.5, y: 73, s: 9, t: "−", c: "#e8743a", w: 600 },
      ],
    },
    alt: {
      frame: { bezel: ALT_BOX, face: ROUND_FACE },
      under: GLIDER_RIM + SCREW(-88, -88) + SCREW(92, -92) + SCREW(92, 92) + ALT_KNOB,
      hands: true,
      needle: { c: "#f4f4f0", b: 3.4, t: 1.8, len: 84, tail: 20, tb: 2.4, tailC: "#1c1c1c", knob: 0 },
      hand2: { c: "#f4f4f0", b: 5.2, t: 1.6, len: 63, tail: 16, tb: 3, tailC: "#1c1c1c", knob: 0 },
      v0: 0, a0: 180, v1: 1000, a1: 540, rest: 180, from: 0, to: 990, minor: 10, major: 100, mid: 50,
      R: 95, majL: 13, majW: 2.6, midL: 9, midW: 1.8, minL: 6, minW: 1.3,
      lab: {
        values: [0, 100, 200, 300, 400, 500, 600, [700, 71], [800, 71], 900],
        from: 0, step: 100, div: 100, r: 67, size: 17, big: 100, bigSize: 17, bigR: 67, bigWeight: 700,
      },
      decor: KOLLSMAN + `<g fill="#2b2b2b"><circle cx="-34" cy="25.5" r="3.4"/><circle cx="30.6" cy="-29" r="3.4"/></g>`,
      drum: null,
      texts: [
        { y: -46, s: 10, t: "winter", w: 700 },
        { x: -42, y: 0, s: 7.5, t: "WNr. 221500", w: 600 },
        { x: 24, y: 0, s: 5.5, t: "SNr. 422", w: 600 },
        { x: 2, y: 25, s: 11, t: "Höhe" },
        { x: 2, y: 39, s: 11, t: "km" },
        { x: 23, y: 68, s: 5, t: "100 m" },
      ],
    },
    vario: {
      frame: { bezel: SQ_BOX, face: ROUND_FACE },
      under: GLIDER_RIM + SCREW(-92, -92) + SCREW(92, -92) + SCREW(-92, 92) + SCREW(92, 92),
      v0: -5, a0: -225, v1: 5, a1: 45, rest: -229, from: -5, to: 5, minor: 1, major: 1,
      R: 95, majL: 15, majW: 6.5, minL: 15, minW: 6.5,
      lab: {
        values: [[-5, 70], -4, -3, -2, -1, 0, 1, 2, 3, 4, [5, 70]], abs: true,
        from: 0, step: 1, r: 65, size: 20, big: 1, bigSize: 20, bigR: 65, bigWeight: 600,
      },
      needle: { c: "#f4f4f0", b: 6, t: 6, len: 93, tail: 0 },
      over: `<path d="M37.4,-25A45,45 0 1 0 39.3,22L93,22L93,-25Z" fill="#0c0c0c"/>
<circle r="45" fill="none" stroke="#333" stroke-width="1"/>
<g stroke="#f2f2ee" stroke-width="1.6" fill="none"><path d="M-2,-14V-32M-6,-27L-2,-32L2,-27"/><path d="M-2,14V32M-6,27L-2,32L2,27"/></g>
<g fill="#262626" stroke="#000" stroke-width=".6"><circle cx="37" cy="-46" r="4.5"/><circle cx="40" cy="-1" r="4.5"/><circle cx="36" cy="41" r="4.5"/></g>
<g stroke="#555" stroke-width="1"><line x1="34" y1="-48" x2="40" y2="-44"/><line x1="37" y1="-3" x2="43" y2="1"/><line x1="33" y1="39" x2="39" y2="43"/></g>
<g fill="#f2f2ee" font-family="'Barlow', sans-serif" text-anchor="middle" dominant-baseline="central"><text x="-2" y="0" font-size="14" font-weight="600">winter</text>
<text x="66" y="-15" font-size="6.5" font-weight="600">S Nr.05451</text><text x="57" y="-1" font-size="9" font-weight="600">m/s</text><text x="66" y="14" font-size="6.5" font-weight="600">WNr.67564</text></g>`,
      odo: null, trip: null,
    },
  },
];
