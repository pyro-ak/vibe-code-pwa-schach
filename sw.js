// Service Worker: App offline verfuegbar, Daten immer zuerst frisch aus dem Netz.
const CACHE = "schach-top5-v1";
const SHELL = [
  "./",
  "index.html",
  "manifest.json",
  "icons/icon-192.png",
  "icons/icon-512.png"
];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)));
  self.skipWaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return;

  // data.json: Netz zuerst, bei Fehler letzte Version aus dem Cache
  if (url.pathname.endsWith("data.json")) {
    e.respondWith(
      fetch(e.request)
        .then(res => {
          const copy = res.clone();
          caches.open(CACHE).then(c => c.put("data.json", copy));
          return res;
        })
        .catch(() => caches.match("data.json"))
    );
    return;
  }

  // Rest: Cache zuerst
  e.respondWith(caches.match(e.request).then(r => r || fetch(e.request)));
});
