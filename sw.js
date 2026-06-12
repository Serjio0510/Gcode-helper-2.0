self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open('my-cache').then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/manifest.json',
          '/src/styles.css',
          '/src/script.js',
          '/src/app.js',
          '/src/calc.js',
          '/src/ui.js',
          '/src/state.js',
          'src/images/favicon.png',
          'src/images/topPoint.png',
          'src/images/manif.png',
          'src/images/CoordinateAngle.png',
          'src/images/Faska.png'
        ]);
      })
    );
  });
  
  self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  });