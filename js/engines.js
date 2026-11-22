// Engine sound profiles per skin. ratios: engine rpm per km/h in each gear. shiftUp: [gentle, full throttle] rpm.
// tau: exhaust pulse length (ms); pipe: resonance delays (ms) with feedback fb; lp*: low-pass cutoff (Hz) from base, per 1000 rpm, per load.
export const ENGINES = {
  w123: {
    label: "300 D · 5-Zylinder-Diesel", cyl: 5, idle: 700, redline: 4400,
    ratios: [100, 58, 37, 27], shiftUp: [2000, 3400], shiftDown: 1100, shiftTime: 0.8,
    tau: 1.8, thump: 1.6, thumpTau: 6, noise: 0.05, clatter: 0.9, clTau: 1.2, clHp: 0.04, clLpHz: 900,
    cylVar: 0.22, jitter: 0.12,
    pipe: [7.5, 3.2], fb: [0.25, 0.1], lpBase: 260, lpRpm: 220, lpLoad: 400, drive: 1.1, gain: 0.97,
  },
  rekorde: {
    label: "Reihenmotor, kernig", cyl: 5, idle: 720, redline: 4400,
    ratios: [100, 58, 37, 27], shiftUp: [2200, 3600], shiftDown: 1150, shiftTime: 0.7,
    tau: 0.9, noise: 0.25, clatter: 0.9, cylVar: 0.12, jitter: 0.1,
    pipe: [4.5, 2.1], fb: [0.45, 0.3], lpBase: 500, lpRpm: 400, lpLoad: 800, drive: 1.6, gain: 1.14,
  },
  p911: {
    label: "3.2 Carrera · Boxer-6, luftgekühlt", cyl: 6, idle: 900, redline: 6500,
    ratios: [100, 57, 40, 31, 24.5], shiftUp: [3200, 5800], shiftDown: 1600, shiftTime: 0.4,
    tau: 0.9, thump: 1.0, thumpTau: 4.5, noise: 0.2, clatter: 0.1, cylVar: 0.3, jitter: 0.2,
    pipe: [5.2, 2.3], fb: [0.45, 0.25], lpBase: 370, lpRpm: 350, lpLoad: 1000, drive: 2.2, gain: 0.45,
  },
  f40: {
    label: "V8 Biturbo", cyl: 8, idle: 1000, redline: 7750, turbo: true,
    ratios: [91, 57, 42, 32, 24.5], shiftUp: [3800, 7000], shiftDown: 2000, shiftTime: 0.3,
    tau: 0.45, thump: 1.4, thumpTau: 4, noise: 0.3, clatter: 0.05, cylVar: 0.08, jitter: 0.1,
    pipe: [3.6, 1.6], fb: [0.55, 0.35], lpBase: 420, lpRpm: 520, lpLoad: 1400, drive: 3.6, gain: 0.35,
  },
  testarossa: {
    label: "Boxer-12", cyl: 12, idle: 950, redline: 6800,
    ratios: [90, 56, 41, 32, 24], shiftUp: [3500, 6300], shiftDown: 1900, shiftTime: 0.35,
    tau: 0.5, thump: 2.2, thumpTau: 5, noise: 0.15, clatter: 0.03, cylVar: 0.1, jitter: 0.1,
    pipe: [4.0, 1.8], fb: [0.5, 0.3], lpBase: 420, lpRpm: 450, lpLoad: 1300, drive: 2.8, gain: 0.36,
  },
  vwbus: {
    label: "Boxer-4, luftgekühlt", cyl: 4, offsets: [0, 0.24, 0.5, 0.74], idle: 850, redline: 4200,
    ratios: [160, 89, 57, 40], shiftUp: [2600, 3800], shiftDown: 1300, shiftTime: 0.8,
    tau: 1.0, thump: 1.1, thumpTau: 4, noise: 0.2, clatter: 0.35, clTau: 0.4, clHp: 0.1, clLpHz: 2500,
    cylVar: 0.25, jitter: 0.18,
    pipe: [4.8, 2.0], fb: [0.4, 0.2], lpBase: 330, lpRpm: 380, lpLoad: 700, drive: 2.0, gain: 0.67,
  },
  abarth: {
    label: "2-Zylinder, luftgekühlt", cyl: 2, idle: 1000, redline: 6000,
    ratios: [171, 100, 67, 48], shiftUp: [3200, 5600], shiftDown: 1600, shiftTime: 0.45,
    tau: 0.45, thump: 0.6, thumpTau: 2.5, noise: 0.6, clatter: 0.5, clTau: 0.2, clHp: 0.15, clLpHz: 4000,
    cylVar: 0.15, jitter: 0.25, pops: 0.12,
    pipe: [2.0, 0.9], fb: [0.4, 0.2], lpBase: 1200, lpRpm: 900, lpLoad: 1500, drive: 3.5, gain: 0.42,
  },
};

// All Porsche skins share the 911 flat-six sound.
for (const id of ["p944", "p959", "p356"]) ENGINES[id] = { ...ENGINES.p911, label: "Porsche-Boxerklang wie beim 911" };
