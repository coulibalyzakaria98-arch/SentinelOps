// Service Worker - Stratégie offline-first
const CACHE_NAME = 'sentinelops-v2';
const API_CACHE_NAME = 'sentinelops-api-v1';
const STATIC_CACHE_NAME = 'sentinelops-static-v1';

// Fichiers statiques à mettre en cache
const STATIC_FILES = [
  '/',
  '/index.html',
  '/offline.html',
  '/manifest.json',
  '/src/main.jsx',
  '/src/index.css'
];

// Installation
self.addEventListener('install', (event) => {
  console.log('[SW] Installation...');
  event.waitUntil(
    Promise.all([
      caches.open(STATIC_CACHE_NAME).then(cache => cache.addAll(STATIC_FILES)),
      self.skipWaiting()
    ])
  );
});

// Activation - nettoyage anciens caches
self.addEventListener('activate', (event) => {
  console.log('[SW] Activation...');
  event.waitUntil(
    Promise.all([
      caches.keys().then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME && k !== API_CACHE_NAME && k !== STATIC_CACHE_NAME)
          .map(k => caches.delete(k))
      )),
      self.clients.claim()
    ])
  );
});

// Interception des requêtes
self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Stratégie pour les API
  if (url.pathname.startsWith('/api/')) {
    event.respondWith(networkFirstStrategy(event.request));
    return;
  }
  
  // Stratégie pour les assets statiques
  if (event.request.method === 'GET') {
    event.respondWith(cacheFirstStrategy(event.request));
    return;
  }
  
  // Par défaut
  event.respondWith(fetch(event.request));
});

// Stratégie: Network First avec fallback cache
async function networkFirstStrategy(request) {
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(API_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    console.log('[SW] Offline - serving from cache');
    const cached = await caches.match(request);
    if (cached) return cached;
    
    // Fallback pour les requêtes API
    if (request.url.includes('/reports')) {
      return new Response(JSON.stringify({ offline: true, message: 'Mode hors ligne' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    }
    
    throw error;
  }
}

// Stratégie: Cache First avec fallback réseau
async function cacheFirstStrategy(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  
  try {
    const response = await fetch(request);
    if (response && response.status === 200) {
      const cache = await caches.open(STATIC_CACHE_NAME);
      cache.put(request, response.clone());
    }
    return response;
  } catch (error) {
    if (request.mode === 'navigate') {
      return caches.match('/offline.html');
    }
    throw error;
  }
}

// Synchronisation en arrière-plan (Background Sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-reports') {
    event.waitUntil(syncPendingReports());
  }
});

async function syncPendingReports() {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_TRIGGERED' });
  });
}
