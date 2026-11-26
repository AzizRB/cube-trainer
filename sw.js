// Speedcubing trener (3x3 + Pyraminx) — offline service worker. Bump CACHE on every release.
const CACHE='cube-trener-v20';
const FILES=['./','./2x2.html','./css/learn.css','./css/pyra.css','./css/style.css','./icons/apple-touch-icon.png','./icons/icon-192.png','./icons/icon-512.png','./icons/maskable-512.png','./index.html','./js/core/core.js','./js/core/glossary.js','./js/core/learn.js','./js/cube2/app.js','./js/cube2/data.js','./js/cube2/lessons.js','./js/cube2/solver.js','./js/cube3/app.js','./js/cube3/data.js','./js/cube3/f2l41.js','./js/cube3/lessons.js','./js/cube3/minimal.js','./js/cube3/model.js','./js/cube3/solver.worker.js','./js/pyraminx/app.js','./js/pyraminx/data.js','./js/pyraminx/lessons.js','./js/pyraminx/model.js','./js/pyraminx/solver.js','./js/pyraminx/view3d.js','./manifest.json','./pyraminx.html'];
self.addEventListener('install',e=>{e.waitUntil(caches.open(CACHE).then(c=>c.addAll(FILES)).then(()=>self.skipWaiting()));});
self.addEventListener('activate',e=>{e.waitUntil(caches.keys().then(k=>Promise.all(k.filter(x=>x!==CACHE).map(x=>caches.delete(x)))).then(()=>self.clients.claim()));});
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET'||new URL(e.request.url).origin!==location.origin) return;
  e.respondWith(caches.open(CACHE).then(async cache=>{
    const cached=await cache.match(e.request,{ignoreSearch:true});
    const net=fetch(e.request).then(r=>{if(r&&r.ok)cache.put(e.request,r.clone());return r;}).catch(()=>cached);
    return cached||net;
  }));
});
