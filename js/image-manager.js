// Менеджер ссылок на изображения из внешнего JSON
(function() {
    const JSON_URL = 'data/images.json';
    let currentData = {};
    let cityName = '';

    // Определяем текущий город по URL или атрибуту body
    function detectCity() {
        const path = window.location.pathname;
        if (path.includes('osaka')) return 'osaka';
        if (path.includes('fuji')) return 'fuji';
        if (path.includes('tokyo')) return 'tokyo';
        if (path.includes('shanghai')) return 'shanghai';
        return null;
    }

    // Загрузка JSON
    async function loadImageData() {
        try {
            const response = await fetch(JSON_URL);
            if (!response.ok) throw new Error('JSON not loaded');
            currentData = await response.json();
        } catch (err) {
            console.warn('Не удалось загрузить images.json, используется localStorage');
            const saved = localStorage.getItem('imageLinks');
            if (saved) {
                currentData = JSON.parse(saved);
            } else {
                currentData = { [cityName]: {} };
            }
        }
        // Слияние с localStorage (приоритет у localStorage)
        const saved = localStorage.getItem('imageLinks');
        if (saved) {
            const local = JSON.parse(saved);
            if (local[cityName]) {
                currentData[cityName] = { ...currentData[cityName], ...local[cityName] };
            }
        }
        applyLinks();
    }

    // Применение ссылок к карточкам
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
            } else {
                // Можно оставить заглушку или текущий src
            }
            // Добавляем подсказку
            let hint = card.querySelector('.link-hint');
            if (!hint) {
                hint = document.createElement('small');
                hint.className = 'link-hint';
                hint.style.cssText = 'display:block; text-align:center; opacity:0.7; font-size:0.8rem; margin-top:5px;';
                hint.textContent = '🖱️ Двойной клик — изменить ссылку';
                card.appendChild(hint);
            }
        });
    }

    // Редактирование ссылки по двойному клику
    function setupEditMode() {
        document.querySelectorAll('.attraction-card').forEach(card => {
            const img = card.querySelector('img');
            if (!img) return;
            img.addEventListener('dblclick', (e) => {
                e.stopPropagation();
                const day = card.dataset.day;
                const index = card.dataset.index;
                if (!day || !index) return;
                const key = `${day}_${index}`;
                const currentLink = currentData[cityName]?.[key] || '';
                const newLink = prompt('Введите новую ссылку на изображение (URL):', currentLink);
                if (newLink !== null) {
                    // Сохраняем в объект
                    if (!currentData[cityName]) currentData[cityName] = {};
                    currentData[cityName][key] = newLink;
                    // Обновляем картинку
                    if (newLink) {
                        img.src = newLink;
                    } else {
                        // Если пусто, можно вернуть исходную заглушку
                        img.src = `images/${key}.jpg`; // fallback
                    }
                    // Сохраняем в localStorage
                    localStorage.setItem('imageLinks', JSON.stringify(currentData));
                    alert('Ссылка сохранена локально. Не забудьте экспортировать JSON и обновить файл в репозитории!');
                }
            });
        });
    }

    // Кнопка экспорта JSON
    function addExportButton() {
        const btn = document.createElement('button');
        btn.textContent = '📤 Экспорт ссылок (JSON)';
        btn.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 20px;
            z-index: 999;
            padding: 10px 20px;
            background: #2d7a6e;
            color: white;
            border: none;
            border-radius: 30px;
            cursor: pointer;
            font-weight: bold;
            box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        `;
        btn.onclick = () => {
            const dataStr = JSON.stringify(currentData, null, 2);
            const blob = new Blob([dataStr], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'images.json';
            a.click();
            URL.revokeObjectURL(url);
        };
        document.body.appendChild(btn);
    }

    // Инициализация
    async function init() {
        cityName = detectCity();
        if (!cityName) {
            console.warn('Город не определён, менеджер изображений не запущен');
            return;
        }
        await loadImageData();
        setupEditMode();
        addExportButton();
    }

    document.addEventListener('DOMContentLoaded', init);
})();
