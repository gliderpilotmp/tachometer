import { SKINS } from "./skins.js";
import { createGauge } from "./gauge.js";

const $ = (id) => document.getElementById(id);
const STORE_KEY = "klassik-tacho";

const state = { skin: "w123", odo: 0, trip: 0, altOffset: 0, demo: false };
try { Object.assign(state, JSON.parse(localStorage.getItem(STORE_KEY)) || {}); } catch {}
let dirty = false;
const save = () => {
  if (!dirty) return;
  try { localStorage.setItem(STORE_KEY, JSON.stringify(state)); dirty = false; } catch {}
};
setInterval(save, 3000);
addEventListener("pagehide", save);

// ---------- dashboard ----------
let dash = null;
function buildDash() {
  const sk = SKINS.find((s) => s.id === state.skin) || SKINS[0];
  state.skin = sk.id;
  const speedo = createGauge($("speedo"), sk, sk.speed, `Tachometer im Stil ${sk.name}`);
  const alti = createGauge($("alti"), sk, sk.alt, `Höhenmesser im Stil ${sk.name}`);
  const tenths = !!sk.speed.odoTenths, odoDrum = speedo.addDrum(sk.speed.odo, sk.speed.odoDigits || 6, 10.5, 14, tenths, sk.speed.odoStyle);
  dash = {
    speedo, alti,
    odo: tenths ? (km) => odoDrum(km * 10) : odoDrum,
    trip: sk.speed.trip == null ? () => {} : speedo.addDrum(sk.speed.trip, sk.speed.tripDigits || 4, 10.5, 14, true, undefined, sk.speed.tripX),
    alt: alti.addDrum(sk.alt.drum, 4, 12, 16, false),
  };
  $("skinName").textContent = sk.name;
  const radio = document.querySelector(`input[name="skin"][value="${sk.id}"]`);
  if (radio) radio.checked = true;
}

function setSkin(id) {
  state.skin = id; dirty = true;
  buildDash();
}
function stepSkin(dir) {
  const i = SKINS.findIndex((s) => s.id === state.skin);
  setSkin(SKINS[(i + dir + SKINS.length) % SKINS.length].id);
}

// ---------- GPS ----------
const target = { speed: 0, alt: null };
const shown = { speed: 0, alt: null, trip: state.trip };
let rawAlt = null, lastFix = 0, lastPos = null, watchId = null, gpsError = null, accuracy = null;

const haversine = (a, b) => {
  const R = 6371000, r = Math.PI / 180;
  const dLat = (b.lat - a.lat) * r, dLon = (b.lon - a.lon) * r;
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * r) * Math.cos(b.lat * r) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
};

function addDistance(km) {
  state.odo += km; state.trip += km; dirty = true;
}

function onPosition(p) {
  const c = p.coords, now = { lat: c.latitude, lon: c.longitude, t: p.timestamp, v: null };
  gpsError = null; lastFix = performance.now(); accuracy = c.accuracy;
  const dt = lastPos ? (now.t - lastPos.t) / 1000 : 0;
  const moved = lastPos ? haversine(lastPos, now) : 0;

  // Doppler speed from the GPS chip is far steadier than position deltas; fall back only when missing.
  let v = c.speed;
  if (v == null || Number.isNaN(v)) v = dt > 0 && c.accuracy <= 30 ? moved / dt : 0;
  now.v = v;
  const kmh = v * 3.6;
  target.speed = kmh < 2 ? 0 : kmh;

  if (lastPos && dt > 0 && dt < 10 && c.accuracy <= 35 && kmh >= 3) {
    const meters = c.speed != null && lastPos.v != null ? ((v + lastPos.v) / 2) * dt : moved;
    addDistance(meters / 1000);
  }
  lastPos = now;

  if (c.altitude != null && !Number.isNaN(c.altitude)) {
    rawAlt = c.altitude;
    target.alt = rawAlt + state.altOffset;
    if (shown.alt == null) shown.alt = target.alt;
  }
}

function onGpsError(e) {
  gpsError = e.code === 1 ? "GPS-Zugriff verweigert" : e.code === 2 ? "Kein GPS-Empfang" : "GPS antwortet nicht";
}

function startGps() {
  if (watchId != null || !("geolocation" in navigator)) {
    if (!("geolocation" in navigator)) gpsError = "Kein GPS verfügbar";
    return;
  }
  watchId = navigator.geolocation.watchPosition(onPosition, onGpsError, { enableHighAccuracy: true, maximumAge: 0, timeout: 15000 });
}

// ---------- demo drive ----------
function demoTargets(t) {
  target.speed = Math.max(0, 70 + 55 * Math.sin(t * 0.11) + 18 * Math.sin(t * 0.37) + 4 * Math.sin(t * 1.3));
  target.alt = 520 + 260 * Math.sin(t * 0.03) + state.altOffset;
  if (shown.alt == null) shown.alt = target.alt;
}

// ---------- status chip ----------
const chip = $("status");
function updateStatus(now) {
  let text, s;
  if (state.demo) { text = "Demo-Fahrt"; s = "demo"; }
  else if (gpsError) { text = gpsError; s = "lost"; }
  else if (!lastFix) { text = watchId != null ? "Suche GPS …" : "GPS aus"; s = "weak"; }
  else if (now - lastFix > 6000) { text = "GPS-Signal verloren"; s = "lost"; }
  else {
    text = `GPS ±${Math.round(accuracy)} m${rawAlt == null ? " · ohne Höhe" : ""}`;
    s = accuracy <= 15 ? "ok" : "weak";
  }
  if (chip.textContent !== text) chip.textContent = text;
  if (chip.dataset.state !== s) chip.dataset.state = s;
}

// ---------- render loop ----------
let prev = performance.now(), statusTick = 0;
function frame(now) {
  const dt = Math.min(0.2, (now - prev) / 1000);
  prev = now;

  if (state.demo) {
    demoTargets(now / 1000);
    addDistance((target.speed / 3600) * dt);
  } else if (lastFix && now - lastFix > 6000) {
    target.speed = 0;
  }

  shown.speed += (target.speed - shown.speed) * (1 - Math.exp(-dt / 0.35));
  if (target.alt != null) shown.alt += (target.alt - shown.alt) * (1 - Math.exp(-dt / 1.5));
  shown.trip += (state.trip - shown.trip) * (1 - Math.exp(-dt / 0.8));
  if (state.trip < shown.trip - 0.5) shown.trip = state.trip;

  dash.speedo.setValue(shown.speed);
  dash.odo(state.odo - (state.trip - shown.trip));
  dash.trip(shown.trip * 10);
  dash.alti.setValue(shown.alt == null ? -10 : Math.max(0, shown.alt) / 100);
  dash.alt(shown.alt == null ? 0 : Math.max(0, Math.round(shown.alt)));

  if (now - statusTick > 500) { updateStatus(now); statusTick = now; }
  requestAnimationFrame(frame);
}

// ---------- screen wake lock & fullscreen ----------
let wakeLock = null;
async function keepAwake() {
  if (!("wakeLock" in navigator) || document.visibilityState !== "visible") return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; });
  } catch {}
}
document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && !wakeLock && started) keepAwake();
  if (document.visibilityState === "hidden") save();
});
function toggleFullscreen(forceOn) {
  const d = document;
  if (!d.fullscreenElement) d.documentElement.requestFullscreen?.({ navigationUI: "hide" }).catch(() => {});
  else if (!forceOn) d.exitFullscreen?.().catch(() => {});
}

// ---------- start ----------
let started = false;
function start(demo) {
  started = true;
  state.demo = demo; dirty = true;
  $("demoToggle").checked = demo;
  $("start").hidden = true;
  toggleFullscreen(true);
  keepAwake();
  if (!demo) startGps();
  armIdle();
}
$("startBtn").addEventListener("click", () => start(false));
$("demoBtn").addEventListener("click", () => start(true));

// ---------- controls auto-hide ----------
let idleTimer = 0;
function armIdle() {
  document.body.classList.remove("idle");
  clearTimeout(idleTimer);
  idleTimer = setTimeout(() => {
    if (started && !$("settings").open) document.body.classList.add("idle");
  }, 4000);
}
document.addEventListener("pointerdown", armIdle);

// ---------- swipe to change skin ----------
let swipeX = null, swipeY = null;
$("dash").addEventListener("pointerdown", (e) => { swipeX = e.clientX; swipeY = e.clientY; });
$("dash").addEventListener("pointerup", (e) => {
  if (swipeX == null) return;
  const dx = e.clientX - swipeX, dy = e.clientY - swipeY;
  swipeX = null;
  if (Math.abs(dx) > 60 && Math.abs(dx) > Math.abs(dy) * 1.5) stepSkin(dx < 0 ? 1 : -1);
});
$("prevSkin").addEventListener("click", () => stepSkin(-1));
$("nextSkin").addEventListener("click", () => stepSkin(1));
$("skinName").addEventListener("click", () => stepSkin(1));

// ---------- settings ----------
const fmtKm = (km, d) => km.toLocaleString("de-DE", { minimumFractionDigits: d, maximumFractionDigits: d }) + " km";
const skinList = $("skinList");
for (const sk of SKINS) {
  const lab = document.createElement("label");
  lab.className = "skin-opt";
  lab.innerHTML = `<input type="radio" name="skin" id="skin-${sk.id}" value="${sk.id}"><span class="thumb"></span><span>${sk.name}</span><small>${sk.era}</small>`;
  skinList.appendChild(lab);
  createGauge(lab.querySelector(".thumb"), sk, sk.speed, sk.name).setValue(80);
  lab.querySelector("input").addEventListener("change", () => setSkin(sk.id));
}

function refreshReadouts() {
  $("tripReadout").textContent = fmtKm(state.trip, 1);
  $("odoReadout").textContent = fmtKm(state.odo, 0);
}

$("openSettings").addEventListener("click", () => {
  $("altOffset").value = Math.round(state.altOffset);
  $("demoToggle").checked = state.demo;
  refreshReadouts();
  $("settings").showModal();
});
$("settings").addEventListener("close", () => { armIdle(); save(); });

$("altOffset").addEventListener("input", (e) => {
  const v = parseFloat(e.target.value);
  setAltOffset(Number.isFinite(v) ? v : 0);
});
function setAltOffset(v) {
  const diff = v - state.altOffset;
  state.altOffset = v; dirty = true;
  if (target.alt != null) { target.alt += diff; shown.alt += diff; }
}
$("altCalibrate").addEventListener("click", () => {
  const known = parseFloat($("altKnown").value);
  const base = state.demo ? (target.alt ?? 0) - state.altOffset : rawAlt;
  if (!Number.isFinite(known)) { $("altHint").textContent = "Bitte zuerst die bekannte Höhe in Metern eingeben."; return; }
  if (base == null) { $("altHint").textContent = "Noch keine GPS-Höhe empfangen. Versuche es unter freiem Himmel nochmal."; return; }
  setAltOffset(Math.round(known - base));
  $("altOffset").value = Math.round(state.altOffset);
  $("altHint").textContent = `Höhe auf ${Math.round(known)} m abgeglichen.`;
});

$("resetTrip").addEventListener("click", () => {
  state.trip = 0; shown.trip = 0; dirty = true; refreshReadouts();
});
let odoConfirm = 0;
$("resetOdo").addEventListener("click", () => {
  if (performance.now() - odoConfirm < 4000) {
    state.odo = 0; state.trip = 0; shown.trip = 0; dirty = true;
    $("resetConfirm").hidden = true; odoConfirm = 0; refreshReadouts();
  } else {
    odoConfirm = performance.now();
    $("resetConfirm").hidden = false;
    setTimeout(() => { $("resetConfirm").hidden = true; }, 4000);
  }
});

$("demoToggle").addEventListener("change", (e) => {
  state.demo = e.target.checked; dirty = true;
  if (!state.demo) {
    target.speed = 0; target.alt = rawAlt == null ? null : rawAlt + state.altOffset;
    if (target.alt == null) shown.alt = null;
    startGps();
  }
});
$("fullscreenBtn").addEventListener("click", () => toggleFullscreen(false));

// ---------- boot ----------
buildDash();
requestAnimationFrame(frame);
if ("serviceWorker" in navigator) navigator.serviceWorker.register("sw.js").catch(() => {});
