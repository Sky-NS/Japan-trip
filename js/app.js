// ==============================
// Общие функции для всего сайта
// ==============================

// Регистрация Service Worker
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js')
            .then(registration => console.log('ServiceWorker registered'))
            .catch(err => console.log('ServiceWorker error:', err));
    });
}

// Кнопка "Наверх"
function initBackToTop() {
    const btn = document.createElement('button');
    btn.innerHTML = '⬆️';
    btn.id = 'back-to-top';
    btn.setAttribute('aria-label', 'Наверх');
    btn.style.cssText = `
        position: fixed; bottom: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%;
        background-color: rgba(176, 62, 62, 0.7); backdrop-filter: blur(4px); color: white;
        border: none; font-size: 1.5rem; cursor: pointer; display: none; z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.2s;
        align-items: center; justify-content: center;
    `;
    btn.onmouseenter = () => {
        btn.style.backgroundColor = 'rgba(176, 62, 62, 1)';
        btn.style.transform = 'scale(1.05)';
    };
    btn.onmouseleave = () => {
        btn.style.backgroundColor = 'rgba(176, 62, 62, 0.7)';
        btn.style.transform = 'scale(1)';
    };
    btn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
    document.body.appendChild(btn);
    window.addEventListener('scroll', () => {
        btn.style.display = window.scrollY > 100 ? 'flex' : 'none';
    });
}

// Сохранение курсов в localStorage
function saveRatesToLocalStorage() {
    const jpyRate = document.getElementById('jpyRate');
    const cnyRate = document.getElementById('cnyRate');
    if (jpyRate && cnyRate) {
        jpyRate.addEventListener('change', () => localStorage.setItem('userJpyRate', jpyRate.value));
        cnyRate.addEventListener('change', () => localStorage.setItem('userCnyRate', cnyRate.value));
        const savedJpy = localStorage.getItem('userJpyRate');
        const savedCny = localStorage.getItem('userCnyRate');
        if (savedJpy) jpyRate.value = savedJpy;
        if (savedCny) cnyRate.value = savedCny;
    }
}

// Сворачиваемые блоки
function initCollapsibleBlocks() {
    document.querySelectorAll('.collapsible-header').forEach(header => {
        header.addEventListener('click', () => {
            const content = header.nextElementSibling;
            const isExpanded = header.getAttribute('aria-expanded') === 'true';
            header.setAttribute('aria-expanded', !isExpanded);
            content.style.display = isExpanded ? 'none' : 'block';
        });
    });
}

// Индикатор загрузки курсов
function addRateLoadingIndicator() {
    document.querySelectorAll('#exchangeRatePlaceholder').forEach(el => {
        if (el.textContent === 'загрузка...') {
            const loadingSpan = document.createElement('span');
            loadingSpan.textContent = '🔄';
            loadingSpan.style.cssText = 'display:inline-block; animation:spin 1s linear infinite';
            el.textContent = '';
            el.appendChild(loadingSpan);
        }
    });
}
const spinStyle = document.createElement('style');
spinStyle.textContent = '@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }';
document.head.appendChild(spinStyle);

// Кнопка смены темы
let themeBtn = null;
function initThemeToggle() {
    themeBtn = document.createElement('button');
    themeBtn.id = 'theme-toggle';
    themeBtn.setAttribute('aria-label', 'Переключить тему');
    themeBtn.style.cssText = `
        position: fixed; top: 20px; left: 20px; width: 50px; height: 50px; border-radius: 50%;
        background-color: rgba(176, 62, 62, 0.7); backdrop-filter: blur(4px); color: white;
        border: none; font-size: 1.5rem; cursor: pointer; z-index: 1001;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.2s;
        display: flex; align-items: center; justify-content: center;
    `;
    themeBtn.onmouseenter = () => {
        themeBtn.style.backgroundColor = 'rgba(176, 62, 62, 1)';
        themeBtn.style.transform = 'scale(1.05)';
    };
    themeBtn.onmouseleave = () => {
        themeBtn.style.backgroundColor = 'rgba(176, 62, 62, 0.7)';
        themeBtn.style.transform = 'scale(1)';
    };
    document.body.appendChild(themeBtn);
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeBtn.innerHTML = '☀️';
    } else {
        themeBtn.innerHTML = '🌙';
    }
    themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        const isDark = document.body.classList.contains('dark-mode');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        themeBtn.innerHTML = isDark ? '☀️' : '🌙';
    });
}

// Плавающая кнопка бургер-меню
let floatingMenuBtn = null;
let floatingMenuPanel = null;

function initFloatingMenuButton() {
    floatingMenuBtn = document.createElement('button');
    floatingMenuBtn.id = 'floating-menu-btn';
    floatingMenuBtn.setAttribute('aria-label', 'Меню');
    floatingMenuBtn.innerHTML = '☰';
    floatingMenuBtn.style.cssText = `
        position: fixed; top: 20px; right: 20px; width: 50px; height: 50px; border-radius: 50%;
        background-color: rgba(176, 62, 62, 0.7); backdrop-filter: blur(4px); color: white;
        border: none; font-size: 1.8rem; font-weight: normal; cursor: pointer; z-index: 1001;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2); transition: all 0.2s;
        display: flex; align-items: center; justify-content: center;
    `;
    floatingMenuBtn.onmouseenter = () => {
        floatingMenuBtn.style.backgroundColor = 'rgba(176, 62, 62, 1)';
        floatingMenuBtn.style.transform = 'scale(1.05)';
    };
    floatingMenuBtn.onmouseleave = () => {
        floatingMenuBtn.style.backgroundColor = 'rgba(176, 62, 62, 0.7)';
        floatingMenuBtn.style.transform = 'scale(1)';
    };
    document.body.appendChild(floatingMenuBtn);
    
    floatingMenuPanel = document.createElement('div');
    floatingMenuPanel.id = 'floating-menu-panel';
    floatingMenuPanel.style.cssText = `
        position: fixed; top: 80px; right: 20px; border-radius: 16px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.15); padding: 12px 0; min-width: 180px;
        z-index: 1000; display: none; flex-direction: column; gap: 4px; backdrop-filter: blur(8px);
    `;
    
    const originalMenuList = document.querySelector('.menu-box');
    if (originalMenuList) {
        const links = originalMenuList.querySelectorAll('a');
        links.forEach(link => {
            const newLink = document.createElement('a');
            newLink.href = link.href;
            newLink.textContent = link.textContent;
            floatingMenuPanel.appendChild(newLink);
        });
    }
    document.body.appendChild(floatingMenuPanel);
    
    let isMenuOpen = false;
    floatingMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        if (isMenuOpen) {
            floatingMenuPanel.style.display = 'none';
            isMenuOpen = false;
        } else {
            floatingMenuPanel.style.display = 'flex';
            isMenuOpen = true;
        }
    });
    
    document.addEventListener('click', (e) => {
        if (isMenuOpen && !floatingMenuPanel.contains(e.target) && e.target !== floatingMenuBtn) {
            floatingMenuPanel.style.display = 'none';
            isMenuOpen = false;
        }
    });
}

// Кнопка установки приложения (PWA) + пункт в меню
localStorage.removeItem('pwa-installed');
let deferredPrompt;
let installBtn;

function initInstallButton() {
    const isIOS = /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase());
    const alreadyInstalled = localStorage.getItem('pwa-installed') === 'true';

    // Плавающая кнопка (внизу) — показываем только если не установлено и есть поддержка
    installBtn = document.createElement('button');
    installBtn.id = 'pwa-install-btn';
    installBtn.style.cssText = `
        position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%);
        background-color: #b03e3e; color: white; border: none; border-radius: 30px;
        padding: 12px 24px; font-size: 1rem; font-weight: bold; cursor: pointer;
        z-index: 1002; box-shadow: 0 4px 16px rgba(0,0,0,0.3); display: none;
        transition: all 0.2s; white-space: nowrap;
    `;
    installBtn.onclick = async () => {
        if (deferredPrompt) {
            deferredPrompt.prompt();
            const { outcome } = await deferredPrompt.userChoice;
            if (outcome === 'accepted') {
                console.log('Установка принята');
                installBtn.style.display = 'none';
                localStorage.setItem('pwa-installed', 'true');
            }
            deferredPrompt = null;
        } else {
            if (isIOS) {
                alert('Нажмите кнопку "Поделиться" и выберите "На экран Домой"');
            } else {
                alert('Используйте пункт "Установить" в меню или дождитесь появления кнопки установки браузера.');
            }
        }
    };
    document.body.appendChild(installBtn);

    // Если уже установлено — плавающую кнопку не показываем
    if (alreadyInstalled) {
        installBtn.style.display = 'none';
    } else {
        // Для iOS сразу показываем инструкцию на 10 секунд
        if (isIOS && !navigator.standalone) {
            installBtn.textContent = '📱 Нажмите "Поделиться" → "На экран Домой"';
            installBtn.style.display = 'block';
            setTimeout(() => {
                if (!navigator.standalone && !localStorage.getItem('pwa-installed')) {
                    installBtn.style.display = 'none';
                }
            }, 10000);
        }
        // Для Android ждём beforeinstallprompt
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            deferredPrompt = e;
            if (!alreadyInstalled) {
                installBtn.style.display = 'block';
            }
        });
    }

    // Обработчик установки
    window.addEventListener('appinstalled', () => {
        installBtn.style.display = 'none';
        localStorage.setItem('pwa-installed', 'true');
    });

    // Обработчик для пункта меню "📱 Установить"
    const menuInstallBtn = document.getElementById('menu-install-btn');
    if (menuInstallBtn) {
        menuInstallBtn.addEventListener('click', (e) => {
            e.preventDefault();
            if (deferredPrompt) {
                deferredPrompt.prompt();
                deferredPrompt.userChoice.then((choiceResult) => {
                    if (choiceResult.outcome === 'accepted') {
                        console.log('Установка из меню');
                        installBtn.style.display = 'none';
                        localStorage.setItem('pwa-installed', 'true');
                    }
                    deferredPrompt = null;
                });
            } else {
                if (isIOS) {
                    alert('Нажмите кнопку "Поделиться" и выберите "На экран Домой"');
                } else if (localStorage.getItem('pwa-installed') === 'true') {
                    alert('Приложение уже установлено!');
                } else {
                    alert('Нажмите кнопку "Установить" внизу экрана или дождитесь появления установки в браузере.');
                }
            }
        });
    }
}

// Инициализация
document.addEventListener('DOMContentLoaded', () => {
    initBackToTop();
    saveRatesToLocalStorage();
    initCollapsibleBlocks();
    addRateLoadingIndicator();
    initThemeToggle();
    initFloatingMenuButton();
    initInstallButton();
});