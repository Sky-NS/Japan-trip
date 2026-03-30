// Текущий курс 1 CNY к RUB (обновить здесь при необходимости)
const STATIC_RATE = 14;

// Функция для обновления всех цен на странице
function updateCNYPrices(rubPerCny) {
    document.querySelectorAll('.rub-value-cny[data-cny]').forEach(el => {
        let cny = parseFloat(el.getAttribute('data-cny'));
        if (!isNaN(cny)) {
            let rub = Math.round(cny * rubPerCny);
            el.textContent = `≈ ${rub} ₽`;
        }
    });

    document.querySelectorAll('.rub-range-cny').forEach(el => {
        let minCny = parseFloat(el.getAttribute('data-min'));
        let maxCny = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minCny) && !isNaN(maxCny)) {
            let minRub = Math.round(minCny * rubPerCny);
            let maxRub = Math.round(maxCny * rubPerCny);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });

    let rateDisplay = document.getElementById('exchangeRatePlaceholder');
    if (rateDisplay) {
        rateDisplay.textContent = `1 CNY ≈ ${Math.round(rubPerCny)} RUB`;
    }
}

// Используем статический курс (при желании можно изменить число выше)
updateCNYPrices(STATIC_RATE);
