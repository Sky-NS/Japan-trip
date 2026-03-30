// Функция для обновления всех цен на странице (юани → рубли)
function updateCNYPrices(rubPerCny) {
    // Обновляем одиночные цены
    document.querySelectorAll('.rub-value-cny[data-cny]').forEach(el => {
        let cny = parseFloat(el.getAttribute('data-cny'));
        if (!isNaN(cny)) {
            let rub = Math.round(cny * rubPerCny);
            el.textContent = `≈ ${rub} ₽`;
        }
    });

    // Обновляем диапазонные цены
    document.querySelectorAll('.rub-range-cny').forEach(el => {
        let minCny = parseFloat(el.getAttribute('data-min'));
        let maxCny = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minCny) && !isNaN(maxCny)) {
            let minRub = Math.round(minCny * rubPerCny);
            let maxRub = Math.round(maxCny * rubPerCny);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });

    // Обновляем блок с курсом
    let rateDisplay = document.getElementById('exchangeRatePlaceholder');
    if (rateDisplay) {
        rateDisplay.textContent = `1 CNY ≈ ${Math.round(rubPerCny)} RUB`;
    }
}

// Запрос к API exchangerate.host (поддерживает CORS, без ключа)
fetch('https://api.exchangerate.host/latest?base=CNY&symbols=RUB')
    .then(response => response.json())
    .then(data => {
        if (data && data.rates && data.rates.RUB) {
            const rubPerCny = data.rates.RUB;
            updateCNYPrices(rubPerCny);
        } else {
            // fallback на статический курс 1 CNY = 14 RUB
            updateCNYPrices(14);
            if (document.getElementById('exchangeRatePlaceholder')) {
                document.getElementById('exchangeRatePlaceholder').textContent = '1 CNY ≈ 14 RUB (офлайн)';
            }
        }
    })
    .catch(() => {
        // fallback при ошибке сети
        updateCNYPrices(14);
        if (document.getElementById('exchangeRatePlaceholder')) {
            document.getElementById('exchangeRatePlaceholder').textContent = '1 CNY ≈ 14 RUB (офлайн)';
        }
    });
