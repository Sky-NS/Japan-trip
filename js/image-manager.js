// Простой менеджер изображений: загружает ссылки из data/images.json и подставляет в <img>
(function() {
    const JSON_URL = 'data/images.json';
    let currentData = {};
    let cityName = '';

    function detectCity() {
        const path = window.location.pathname;
        if (path.includes('osaka')) return 'osaka';
        if (path.includes('fuji')) return 'fuji';
        if (path.includes('tokyo')) return 'tokyo';
        if (path.includes('shanghai')) return 'shanghai';
        return null;
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
                img.src = link;
            }
            // Если ссылки нет, остаётся то, что прописано в HTML (локальная заглушка)
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
