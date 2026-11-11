/* Gastos Jolgorio - modo sin señal
   Guarda una copia de la app en el teléfono. Abre al instante desde esa copia
   y, cuando hay señal, la actualiza en segundo plano.
   Si algún día cambias index.html, sube también este archivo con otro número en CACHE. */
const CACHE = 'gastos-jolgorio-v1';
const ARCHIVOS = ['./', './index.html'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ARCHIVOS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    caches.match(e.request, { ignoreSearch: true }).then(guardado => {
      const red = fetch(e.request)
        .then(r => {
          if (r && r.ok) {
            const copia = r.clone();
            caches.open(CACHE).then(c => c.put(e.request, copia));
          }
          return r;
        })
        .catch(() => guardado || caches.match('./index.html'));
      return guardado || red;
    })
  );
});
