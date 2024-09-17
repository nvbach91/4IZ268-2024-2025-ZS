- register serviceWorker
```js
if (navigator.serviceWorker) {
    $.get('/serviceWorker.js').done((data) => {
        navigator.serviceWorker.register('/serviceWorker.js').then((reg) => {
            console.log('serviceWorker registered with scope', reg.scope);
        }).catch((err) => {
            console.log('serviceWorker registration failed:', err);
        });
    });
}
```
- serviceWorker.js
```js

// the cache version gets updated every time there is a new deployment
const CACHE_VERSION = '1.0.980';
const DYNAMIC_CACHE = `dynamic-${CACHE_VERSION}`;
const STATIC_CACHE = `static-${CACHE_VERSION}`;
const CACHE_NAMES = [DYNAMIC_CACHE, STATIC_CACHE];

// these are the routes we are going to cache for offline support
const cacheFiles = {};

cacheFiles[DYNAMIC_CACHE] = [
  '/',
  '/css/styles.min.css',
  '/js/build.min.js',
];
cacheFiles[STATIC_CACHE] = [
  '/css/colpick.css',
  '/css/pikaday.css',
  'https://fonts.googleapis.com/css?family=Open+Sans:700,400,300&subset=latin,vietnamese',
  'https://ajax.googleapis.com/ajax/libs/jquery/2.2.0/jquery.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.2.1/Chart.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.18.1/moment.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/Sortable/1.10.2/Sortable.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/locale/cs.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/locale/sk.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/locale/vi.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/locale/ru.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/locale/zh-cn.js',
  'https://cdnjs.cloudflare.com/ajax/libs/fullcalendar/3.4.0/fullcalendar.min.css',
  '/img/app-store-badge.png',
  '/img/google-play-badge.png',
  '/img/colors.jpg',
  '/img/favicon.png',
  '/img/logo_white_in_circle.svg',
  '/img/logow.svg',
  '/img/ico/en.svg',
  '/img/ico/cs.svg',
  '/img/ico/vi.svg',
  '/img/ico/sk.svg',
  '/img/ico/ru.svg',
  '/img/ico/zh.svg',
  '/img/ico/email.svg',
  '/img/ico/lock.svg',
  '/img/ico/subdomain.svg',
  '/img/ico/hu.svg',
  '/img/ico/growth.svg',
  '/img/ico/ors-logo.svg',
  '/img/ico/bell.svg',
  '/img/ico/gear.svg',
  '/img/ico/printw.svg',
  '/img/ico/backspace.svg',
  '/img/ico/keypadclose.svg',
  '/img/ico/ors-logo-black.svg',
  '/img/ico/bin.svg',
  '/img/ico/clock.svg',
  '/img/ico/print.svg',
  '/img/ico/dollar.svg',
  '/img/ico/drawer.svg',
  '/img/ico/scale.svg',
  '/img/ico/angle.svg',
  '/img/ico/userwhite.svg',
  '/img/ico/fullscreen.svg',
  '/img/ico/sg.svg',
  '/img/ico/help.svg',
  '/img/ico/unmuted.svg',
  '/img/ico/refresh.svg',
  '/img/ico/calendar.svg',
  '/img/ico/menu.svg',
  '/img/ico/dashboard.svg',
  '/img/ico/history.svg',
  '/img/ico/report.svg',
  '/img/ico/barcode.svg',
  '/img/ico/stock.svg',
  '/img/ico/star.svg',
  '/img/ico/receipt.svg',
  '/img/ico/peripherals.svg',
  '/img/ico/training.svg',
  '/img/ico/conversion.svg',
  '/img/ico/table.svg',
  '/img/ico/pos.svg',
  '/img/ico/staff.svg',
  '/img/ico/companyw.svg',
  '/img/ico/bulb.svg',
  '/img/ico/offline.svg',
  '/img/ico/outofsync.svg',
  '/img/ico/info.svg',
  '/img/ico/plulinks.svg',
  '/img/ico/compositions.svg',
  '/img/ico/pricetag.svg',
  '/img/ico/campaign.svg',
  '/img/ico/magnifier.svg',
  '/img/ico/inventories.svg',
  '/img/ico/tabs.svg',
  '/img/ico/screen.svg',
  '/img/ico/tare.svg',
  '/img/ico/ticket.svg',
  '/img/ico/payment-terminal.svg',
  '/img/ico/asterisk.svg',
  '/img/ico/customers.svg',
  '/img/ico/power.svg',
  '/sound/beep2.mp3',
  '/sound/longbeep.mp3',
];

// on activation we clean up the previously registered service workers
self.addEventListener('activate', (e) => {
  return e.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!CACHE_NAMES.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// on install we download the routes we want to cache for offline
self.addEventListener('install', (e) => {
  return e.waitUntil(
    Promise.all(
      CACHE_NAMES.map((cacheName) => {
        return caches.open(cacheName).then((cache) => {
          return cache.addAll(cacheFiles[cacheName]);
        })
      })
    )
  );
});

// general strategy when making a request (eg if online try to fetch it
// from the network with a timeout, if something fails serve from cache)
self.addEventListener('fetch', (e) => {
  const response = (() => {
    if (cacheFiles[STATIC_CACHE].includes(e.request.url.replace(location.origin, ''))) {
      // console.log('serviceWorker fetching', 'STATIC_CACHE', e.request.url);
      return caches.match(e.request).then((resp) => {
        return resp || fetch(e.request);
      })
    }
    if (cacheFiles[DYNAMIC_CACHE].includes(e.request.url.replace(location.origin, ''))) {
      // console.log('serviceWorker fetching', 'DYNAMIC_CACHE', e.request.url);
      return fetch(e.request).catch(() => {
        return caches.match(e.request);
      });
    }
    return fetch(e.request);
  })();
  e.respondWith(response);
});
```
