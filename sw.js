// Service worker : mise en cache de l'application pour un fonctionnement 100 % hors ligne.
// Stratégie : cache d'abord + rafraîchissement en arrière-plan. Incrémenter VERSION à chaque publication.
const VERSION = 'budget-familial-v1.0.0';
const CORE = [
  "./",
  "./css/app.css",
  "./icons/icon-192.png",
  "./icons/icon-512.png",
  "./icons/icon-maskable-512.png",
  "./index.html",
  "./js/app.js",
  "./js/calc.js",
  "./js/defaults.js",
  "./js/notify.js",
  "./js/screens/add.js",
  "./js/screens/analysis.js",
  "./js/screens/budget.js",
  "./js/screens/categories.js",
  "./js/screens/expenses.js",
  "./js/screens/forms.js",
  "./js/screens/home.js",
  "./js/screens/settings.js",
  "./js/security.js",
  "./js/storage.js",
  "./js/store.js",
  "./js/ui/charts.js",
  "./js/ui/components.js",
  "./js/ui/dom.js",
  "./js/utils.js",
  "./js/validators.js",
  "./manifest.webmanifest",
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(VERSION).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => k !== VERSION).map((k) => caches.delete(k)))).then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== location.origin) return;
  event.respondWith(
    caches.open(VERSION).then(async (cache) => {
      const cached = await cache.match(req, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => {
          if (res.ok) cache.put(req, res.clone());
          return res;
        })
        .catch(() => null);
      if (cached) {
        event.waitUntil(network);
        return cached;
      }
      return (await network) || (req.mode === 'navigate' ? cache.match('./index.html') : Response.error());
    }),
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => (list.length ? list[0].focus() : self.clients.openWindow('./'))),
  );
});
