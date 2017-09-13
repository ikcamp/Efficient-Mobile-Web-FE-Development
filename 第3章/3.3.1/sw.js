// 需要缓存的资源列表
var cacheFiles = [
    'style.css',
    'main.js'
];
// 在install事件里缓存资源
self.addEventListener('install', function (evt) {
    evt.waitUntil(
        caches.open('mycache').then(function (cache) {
            return cache.addAll(cacheFiles);
        })
    );
});