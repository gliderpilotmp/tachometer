// Turns road speed into engine rpm, throttle and gear changes, and drives the engine worklet.
export class Drivetrain {
  constructor(profile) {
    this.p = profile;
    this.gear = 0;
    this.shiftT = 0;
    this.shiftDur = 1;
    this.shiftFrom = 0;
    this.lock = 0;
    this.lastSpeed = 0;
    this.accel = 0;
  }

  // Returns { rpm, load, blow } for the current speed (km/h) after dt seconds.
  step(speed, dt) {
    const p = this.p;
    const a = (speed - this.lastSpeed) / Math.max(dt, 1e-3);
    this.lastSpeed = speed;
    this.accel += (a - this.accel) * (1 - Math.exp(-dt / 0.6));
    let load = Math.min(1, Math.max(0.04, 0.22 + this.accel * 0.09));
    let rpm, blow = 0;
    this.lock -= dt;

    if (speed < 3) {
      this.gear = 0;
      this.shiftT = 0;
      rpm = p.idle;
      load = 0.12;
    } else {
      if (this.gear === 0) this.gear = 1;
      const throttle = Math.min(1, Math.max(0, (load - 0.2) / 0.6));
      const upAt = p.shiftUp[0] + (p.shiftUp[1] - p.shiftUp[0]) * throttle;
      const r = speed * p.ratios[this.gear - 1];
      if (this.shiftT <= 0 && this.lock <= 0) {
        if (r > upAt && this.gear < p.ratios.length) {
          this.shift(this.gear + 1, r);
          blow = p.turbo && load > 0.35 ? 1 : 0;
        } else if (r < p.shiftDown && this.gear > 1) {
          this.shift(this.gear - 1, r);
        }
      }
      rpm = Math.max(p.idle, Math.min(p.redline, speed * p.ratios[this.gear - 1]));
    }

    if (this.shiftT > 0) {
      // Clutch in, throttle lifted: revs glide from the old gear to the new one.
      this.shiftT -= dt;
      const f = Math.max(0, this.shiftT / this.shiftDur);
      rpm += (this.shiftFrom - rpm) * f;
      load = 0.03;
    }
    return { rpm, load, blow };
  }

  shift(gear, fromRpm) {
    this.gear = gear;
    this.shiftFrom = fromRpm;
    this.shiftDur = this.shiftT = this.p.shiftTime;
    this.lock = this.p.shiftTime + 1.2;
  }
}

export class EngineSound {
  constructor() {
    this.ctx = null;
    this.node = null;
    this.profile = null;
    this.drive = null;
    this.on = false;
    this.volume = 0.7;
    this.blowUntil = 0;
  }

  async enable() {
    this.on = true;
    if (!this.ctx) {
      this.ctx = new AudioContext({ latencyHint: "interactive" });
      await this.ctx.audioWorklet.addModule("js/engine-worklet.js");
      this.node = new AudioWorkletNode(this.ctx, "engine", { outputChannelCount: [1], processorOptions: { profile: this.profile } });
      this.node.connect(this.ctx.destination);
    }
    await this.ctx.resume();
    this.applyVolume();
  }

  disable() {
    this.on = false;
    this.applyVolume();
    setTimeout(() => { if (!this.on && this.ctx) this.ctx.suspend(); }, 400);
  }

  pause() { if (this.ctx && this.on) this.ctx.suspend(); }
  resume() { if (this.ctx && this.on) this.ctx.resume(); }

  setVolume(v) {
    this.volume = v;
    this.applyVolume();
  }

  applyVolume() {
    if (!this.node) return;
    const v = this.on && this.profile ? this.volume : 0;
    this.node.parameters.get("vol").setTargetAtTime(v, this.ctx.currentTime, 0.1);
  }

  setProfile(profile) {
    this.profile = profile;
    this.drive = profile ? new Drivetrain(profile) : null;
    this.node?.port.postMessage({ profile });
    this.applyVolume();
  }

  update(speed, dt) {
    if (!this.on || !this.drive || !this.node) return;
    const { rpm, load, blow } = this.drive.step(speed, dt), t = this.ctx.currentTime, P = this.node.parameters;
    P.get("rpm").setTargetAtTime(rpm, t, 0.02);
    P.get("load").setTargetAtTime(load, t, 0.05);
    if (blow) this.blowUntil = t + 0.1;
    P.get("blow").setValueAtTime(t < this.blowUntil ? 1 : 0, t);
  }
}
