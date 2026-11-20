const VERSION = "tacho-v10";
const SHELL = [
  "./",
  "index.html",
  "css/style.css",
  "js/app.js",
  "js/gauge.js",
  "js/skins.js",
  "manifest.webmanifest",
  "icons/icon-192.png",
  "icons/icon-512.png",
];
const FONT_HOSTS = ["fonts.googleapis.com", "fonts.gstatic.com"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(VERSION).then((c) => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);

  if (FONT_HOSTS.includes(url.hostname)) {
    e.respondWith(
      caches.open(VERSION).then(async (c) => {
        const hit = await c.match(req);
        const fresh = fetch(req).then((res) => { c.put(req, res.clone()); return res; }).catch(() => hit);
        return hit || fresh;
      })
    );
    return;
  }

  if (url.origin !== location.origin) return;
  // Network first so a new deploy shows up right away; cache keeps the app working without signal.
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok) caches.open(VERSION).then((c) => c.put(req, res.clone()));
        return res;
      })
      .catch(() => caches.match(req, { ignoreSearch: true }).then((hit) => hit || caches.match("index.html")))
  );
});
