// Функция для обновления всех цен на странице
function updatePrices(rubPerJpy) {
    // Обновляем одиночные цены (элементы с атрибутом data-jpy и классом rub-value)
    document.querySelectorAll('.rub-value[data-jpy]').forEach(el => {
        let jpy = parseFloat(el.getAttribute('data-jpy'));
        if (!isNaN(jpy)) {
            let rub = Math.round(jpy * rubPerJpy);
            el.textContent = `≈ ${rub} ₽`;
        }
    });

    // Обновляем диапазонные цены (элементы с классом rub-range и атрибутами data-min / data-max)
    document.querySelectorAll('.rub-range').forEach(el => {
        let minJpy = parseFloat(el.getAttribute('data-min'));
        let maxJpy = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minJpy) && !isNaN(maxJpy)) {
            let minRub = Math.round(minJpy * rubPerJpy);
            let maxRub = Math.round(maxJpy * rubPerJpy);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });

    // Обновляем блок с курсом валют (если есть)
    let rateDisplay = document.getElementById('exchangeRatePlaceholder');
    if (rateDisplay) {
        rateDisplay.textContent = `100 JPY ≈ ${Math.round(100 * rubPerJpy)} RUB`;
    }
}

// Запрос к API exchangerate.host (бесплатный, без ключа)
fetch('https://api.exchangerate.host/latest?base=JPY&symbols=RUB')
    .then(response => response.json())
    .then(data => {
        if (data && data.rates && data.rates.RUB) {
            const rubPerJpy = data.rates.RUB;
            updatePrices(rubPerJpy);
        } else {
            // fallback на статический курс 0.5 (100 JPY = 50 RUB)
            updatePrices(0.5);
            if (document.getElementById('exchangeRatePlaceholder')) {
                document.getElementById('exchangeRatePlaceholder').textContent = '100 JPY ≈ 50 RUB (офлайн на статический)';
            }
        }
    })
    .catch(() => {
        // fallback при ошибке сети
        updatePrices(0.5);
        if (document.getElementById('exchangeRatePlaceholder')) {
            document.getElementById('exchangeRatePlaceholder').textContent = '100 JPY ≈ 50 RUB (офлайн по ошибке)';
        }
    });
