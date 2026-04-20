// Менеджер локальных изображений для карточек достопримечательностей
// Имена файлов: images/{day}_{index}.jpg
// Загруженные изображения сохраняются в localStorage в виде Data URL

(function() {
    const STORAGE_PREFIX = 'img_';

    // Функция получения ключа для localStorage
    function getStorageKey(day, index) {
        return STORAGE_PREFIX + day + '_' + index;
    }

    // Создание кнопки загрузки
    function createUploadButton(container, img, day, index) {
        const btn = document.createElement('button');
        btn.textContent = '📁 Загрузить изображение';
        btn.className = 'upload-image-btn';
        btn.style.cssText = `
            display: block;
            margin: 10px auto;
            padding: 8px 16px;
            background: #b03e3e;
            color: white;
            border: none;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
        `;
        
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.accept = 'image/jpeg,image/png,image/gif';
        fileInput.style.display = 'none';
        
        btn.addEventListener('click', () => fileInput.click());
        
        fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (ev) => {
                const dataUrl = ev.target.result;
                // Сохраняем в localStorage
                try {
                    localStorage.setItem(getStorageKey(day, index), dataUrl);
                    img.src = dataUrl;
                    // Удаляем кнопку, если она есть
                    if (btn.parentNode) btn.remove();
                    // Показываем подсказку о двойном клике
                    showReplaceHint(container);
                } catch (err) {
                    alert('Ошибка сохранения: возможно, изображение слишком большое.');
                }
            };
            reader.readAsDataURL(file);
        });
        
        container.appendChild(btn);
        container.appendChild(fileInput);
    }

    // Показать подсказку о замене по двойному клику
    function showReplaceHint(container) {
        let hint = container.querySelector('.replace-hint');
        if (!hint) {
            hint = document.createElement('small');
            hint.className = 'replace-hint';
            hint.style.cssText = 'display:block; text-align:center; opacity:0.7; font-size:0.8rem; margin-top:5px;';
            hint.textContent = '🖱️ Двойной клик по картинке — заменить';
            container.appendChild(hint);
        }
    }

    // Инициализация всех изображений на странице
    function initImages() {
        const cards = document.querySelectorAll('.attraction-card');
        
        cards.forEach(card => {
            const img = card.querySelector('img');
            if (!img) return;
            
            const day = card.dataset.day;
            const index = card.dataset.index;
            if (!day || !index) {
                console.warn('Карточка без data-day или data-index:', card);
                return;
            }
            
            // Создаём контейнер для картинки и кнопки
            const imgContainer = document.createElement('div');
            imgContainer.className = 'attraction-img-container';
            img.parentNode.insertBefore(imgContainer, img);
            imgContainer.appendChild(img);
            
            // Проверяем localStorage
            const saved = localStorage.getItem(getStorageKey(day, index));
            if (saved) {
                img.src = saved;
                showReplaceHint(imgContainer);
            } else {
                // Если изображение не загружено, оставляем src как есть (может быть локальный путь)
                // Но если src пуст или битый, показываем кнопку загрузки
                if (!img.src || img.src.endsWith('images/.jpg') || img.src === '') {
                    createUploadButton(imgContainer, img, day, index);
                } else {
                    // Проверяем, загружено ли изображение с сервера (для локальных файлов)
                    // Для локального запуска file:// проверка не сработает, поэтому просто доверяем src
                    // Если нужно, можно добавить обработку onerror для показа кнопки при битой ссылке
                    img.onerror = () => {
                        createUploadButton(imgContainer, img, day, index);
                    };
                    showReplaceHint(imgContainer);
                }
            }
            
            // Двойной клик для замены
            img.addEventListener('dblclick', () => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/jpeg,image/png,image/gif';
                input.onchange = (e) => {
                    const file = e.target.files[0];
                    if (!file) return;
                    const reader = new FileReader();
                    reader.onload = (ev) => {
                        const dataUrl = ev.target.result;
                        localStorage.setItem(getStorageKey(day, index), dataUrl);
                        img.src = dataUrl;
                        // Убираем кнопку загрузки, если она есть
                        const existingBtn = imgContainer.querySelector('.upload-image-btn');
                        if (existingBtn) existingBtn.remove();
                        showReplaceHint(imgContainer);
                    };
                    reader.readAsDataURL(file);
                };
                input.click();
            });
        });
    }

    document.addEventListener('DOMContentLoaded', initImages);
})();
