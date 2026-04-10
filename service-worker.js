const CACHE_NAME = 'vetalent-v2';
const ASSETS = [
  '/Umutseker/',
  '/Umutseker/index.html',
  '/Umutseker/script.js',
  '/Umutseker/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  // Sheets API ve Apps Script isteklerini cache'leme
  if (e.request.url.includes('google.com') || e.request.url.includes('script.google')) {
    e.respondWith(fetch(e.request).catch(() => new Response('', {status: 503})));
    return;
  }
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
