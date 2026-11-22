// Procedural engine: every cylinder fires an exhaust pulse; pipe resonances, filtering and soft clipping shape the timbre.
const POOL = 32;

class EngineProcessor extends AudioWorkletProcessor {
  static get parameterDescriptors() {
    return [
      { name: "rpm", defaultValue: 800, minValue: 0, maxValue: 12000, automationRate: "k-rate" },
      { name: "load", defaultValue: 0.2, minValue: 0, maxValue: 1, automationRate: "k-rate" },
      { name: "vol", defaultValue: 0, minValue: 0, maxValue: 1, automationRate: "k-rate" },
      { name: "blow", defaultValue: 0, minValue: 0, maxValue: 1, automationRate: "k-rate" },
    ];
  }

  constructor(options) {
    super();
    this.pa = new Float32Array(POOL);
    this.pt = new Float32Array(POOL).fill(1e9);
    this.pi = 0;
    this.del = new Float32Array(16384);
    this.w = 0;
    this.rpm = 0; this.load = 0.2; this.vol = 0;
    this.lp = 0; this.clLp = 0; this.clBand = 0; this.dcIn = 0; this.dcOut = 0; this.popEnv = 0; this.popPh = 0; this.popF = 100; this.popLp = 0; this.popGap = 0; this.hpIn = 0; this.hpOut = 0;
    this.boost = 0; this.tph = 0; this.blowEnv = 0; this.lastBlow = 0; this.blLp = 0;
    this.setProfile(options.processorOptions?.profile || null);
    this.port.onmessage = (e) => { if ("profile" in e.data) this.setProfile(e.data.profile); };
  }

  setProfile(p) {
    // Pipe feedback must stay below 1 in total, or the resonances run away and the clipper sticks at full scale.
    if (p) { const f = p.fb[0] + p.fb[1]; if (f > 0.92) p = { ...p, fb: p.fb.map((v) => (v * 0.92) / f) }; }
    this.p = p;
    if (!p) return;
    this.amps = Float32Array.from({ length: p.cyl }, () => 1 + (Math.random() * 2 - 1) * p.cylVar);
    this.offsets = p.offsets || Array.from({ length: p.cyl }, (_, i) => i / p.cyl);
    this.rpm = p.idle; this.cyc = 0; this.base = 0; this.k = 0;
    this.del.fill(0);
  }

  process(_, outputs, params) {
    const out = outputs[0][0], p = this.p;
    if (!out) return true;
    if (!p) { out.fill(0); return true; }
    const sr = sampleRate, tau = (p.tau * sr) / 1000, thTau = ((p.thumpTau || p.tau) * sr) / 1000, life = Math.max(tau, p.thump ? thTau : 0) * 12;
    const clTau = ((p.clTau || 0.25) * sr) / 1000, clHp = p.clHp || 0.15, clLp = p.clLpHz ? 1 - Math.exp((-2 * Math.PI * p.clLpHz) / sr) : 1, N = this.del.length;
    const d1 = Math.round((p.pipe[0] * sr) / 1000), d2 = Math.round((p.pipe[1] * sr) / 1000);
    const sm = 1 - Math.exp(-1 / (0.03 * sr)), smv = 1 - Math.exp(-1 / (0.15 * sr));
    const tRpm = params.rpm[0], tLoad = params.load[0], tVol = params.vol[0], blow = params.blow[0];
    if (blow > 0.5 && this.lastBlow <= 0.5) this.blowEnv = 1;
    this.lastBlow = blow;
    const popDecay = Math.exp(-1 / (0.025 * sr)), blowDecay = Math.exp(-1 / (0.35 * sr)), boostSm = 1 - Math.exp(-1 / (0.6 * sr));

    for (let i = 0; i < out.length; i++) {
      this.rpm += (tRpm - this.rpm) * sm;
      this.load += (tLoad - this.load) * sm;
      this.vol += (tVol - this.vol) * smv;

      // Four-stroke: one full firing cycle every two crank revolutions.
      this.cyc += this.rpm / 120 / sr;
      while (this.cyc >= this.base + this.offsets[this.k]) {
        const j = this.pi;
        this.pi = (this.pi + 1) % POOL;
        this.pa[j] = this.amps[this.k] * (1 + (Math.random() - 0.5) * p.jitter) * (0.3 + 0.7 * this.load);
        this.pt[j] = 0;
        if (++this.k === p.cyl) { this.k = 0; this.base += 1; }
        // Overrun backfire: on a closed throttle at speed an occasional firing bangs in the exhaust.
        if (p.pops && this.load < 0.12 && this.rpm > 1800 && this.popGap <= 0 && Math.random() < p.pops) {
          this.popEnv = 0.7 + Math.random() * 0.3;
          this.popF = 80 + Math.random() * 80;
          this.popPh = 0;
          this.popGap = (0.06 + Math.random() * 0.12) * sr;
        }
      }

      let x = 0, c = 0;
      for (let j = 0; j < POOL; j++) {
        const t = this.pt[j];
        if (t > life) continue;
        const u = t / tau, a = this.pa[j], n = Math.random() * 2 - 1;
        x += a * (u * Math.exp(1 - u) + p.noise * n * Math.exp(-u / 3));
        if (p.thump) { const v = t / thTau; x += a * p.thump * v * Math.exp(1 - v); }
        c += a * n * Math.exp(-t / clTau);
        this.pt[j] = t + 1;
      }
      // Overlapping one-sided pulses build up a large DC offset under load; remove it before the pipes and the
      // soft clipper, otherwise the clipper saturates into a flat line and the engine falls silent when accelerating.
      const xd = x * 0.5 - this.dcIn + 0.998 * this.dcOut;
      this.dcIn = x * 0.5;
      this.dcOut = xd;
      x = xd;

      // A backfire is a short pressure bang with a low body and some crack, shaped further by the pipes.
      this.popGap--;
      if (this.popEnv > 0.001) {
        this.popPh += this.popF / sr;
        this.popLp += (Math.random() * 2 - 1 - this.popLp) * 0.25;
        x += this.popEnv * (Math.sin(2 * Math.PI * this.popPh) * 1.6 + this.popLp * 0.8);
        this.popEnv *= popDecay;
      }

      // Exhaust pipe resonances (two feedback combs).
      const y = x + p.fb[0] * this.del[(this.w - d1 + N) % N] + p.fb[1] * this.del[(this.w - d2 + N) % N];
      this.del[this.w] = y;
      this.w = (this.w + 1) % N;

      const fc = p.lpBase + (p.lpRpm * this.rpm) / 1000 + p.lpLoad * this.load;
      this.lp += (y - this.lp) * (1 - Math.exp((-2 * Math.PI * fc) / sr));

      // Diesel knock / valve train: band-limited noise bursts at each firing.
      this.clLp += (c - this.clLp) * clHp;
      this.clBand += (c - this.clLp - this.clBand) * clLp;
      let s = this.lp + p.clatter * this.clBand * 0.5;

      if (p.turbo) {
        this.boost += (this.load * Math.min(1, this.rpm / p.redline) - this.boost) * boostSm;
        this.tph += (1800 + this.rpm * 0.55) / sr;
        if (this.tph > 1) this.tph -= 1;
        s += Math.sin(2 * Math.PI * this.tph) * this.boost * this.boost * 0.05;
        if (this.blowEnv > 0.001) {
          const n = Math.random() * 2 - 1;
          this.blLp += (n - this.blLp) * 0.4;
          s += (n - this.blLp) * this.blowEnv * 0.35;
          this.blowEnv *= blowDecay;
        }
      }

      s = Math.tanh(s * p.drive);
      const o = s - this.hpIn + 0.995 * this.hpOut;
      this.hpIn = s;
      this.hpOut = o;
      out[i] = o * p.gain * this.vol;
    }
    for (let ch = 1; ch < outputs[0].length; ch++) outputs[0][ch].set(out);
    return true;
  }
}

registerProcessor("engine", EngineProcessor);
