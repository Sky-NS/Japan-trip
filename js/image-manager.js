// Менеджер изображений: загружает ссылки из data/images.json и подставляет в <img>
// Поддерживает короткие публичные ссылки Яндекс.Диска, автоматически преобразуя их в прямые
(function() {
    const JSON_URL = 'data/images.json';
    let currentData = {};
    let cityName = '';

    // Определяем город по URL страницы
    function detectCity() {
        const path = window.location.pathname;
        if (path.includes('osaka')) return 'osaka';
        if (path.includes('fuji')) return 'fuji';
        if (path.includes('tokyo')) return 'tokyo';
        if (path.includes('shanghai')) return 'shanghai';
        return null;
    }

    // Преобразует короткую ссылку Яндекс.Диска в прямую (с raw=1)
    function getDirectYandexUrl(url) {
        // Извлекаем ID из ссылки вида https://disk.yandex.ru/i/XXXXXX
        const match = url.match(/disk\.yandex\.ru\/i\/([a-zA-Z0-9_-]+)/);
        if (match) {
            const id = match[1];
            return `https://downloader.disk.yandex.ru/disk/${id}?raw=1`;
        }
        // Если ссылка уже содержит downloader.disk.yandex.ru/preview/... пробуем переделать
        if (url.includes('downloader.disk.yandex.ru/preview/')) {
            // Заменяем preview на disk и добавляем ?raw=1 (упрощённый вариант, может не всегда работать)
            return url.replace('/preview/', '/disk/').replace(/\?.*$/, '?raw=1');
        }
        // Иначе возвращаем как есть
        return url;
    }

    async function loadImageData() {
        try {
            const response = await fetch(JSON_URL);
            if (!response.ok) throw new Error('JSON не загружен');
            currentData = await response.json();
        } catch (err) {
            console.error('Ошибка загрузки images.json:', err);
            return;
        }
        applyLinks();
    }

    function applyLinks() {
        const cards = document.querySelectorAll('.attraction-card');
        cards.forEach(card => {
            const img = card.querySelector('img');
            if (!img) return;
            const day = card.dataset.day;
            const index = card.dataset.index;
            if (!day || !index) return;
            const key = `${day}_${index}`;
            const link = currentData[cityName]?.[key];
            if (link) {
                img.src = getDirectYandexUrl(link);
            }
        });
    }

    async function init() {
        cityName = detectCity();
        if (!cityName) {
            console.warn('Город не определён, подстановка изображений отключена');
            return;
        }
        await loadImageData();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
