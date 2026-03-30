// Функция для обновления всех цен на странице
function updatePrices(rubPerJpy) {
    // Обновляем одиночные цены
    document.querySelectorAll('.rub-value[data-jpy]').forEach(el => {
        let jpy = parseFloat(el.getAttribute('data-jpy'));
        if (!isNaN(jpy)) {
            let rub = Math.round(jpy * rubPerJpy);
            el.textContent = `≈ ${rub} ₽`;
        }
    });

    // Обновляем диапазонные цены
    document.querySelectorAll('.rub-range').forEach(el => {
        let minJpy = parseFloat(el.getAttribute('data-min'));
        let maxJpy = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minJpy) && !isNaN(maxJpy)) {
            let minRub = Math.round(minJpy * rubPerJpy);
            let maxRub = Math.round(maxJpy * rubPerJpy);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });

    // Обновляем блок с курсом
    let rateDisplay = document.getElementById('exchangeRatePlaceholder');
    if (rateDisplay) {
        rateDisplay.textContent = `100 JPY ≈ ${Math.round(100 * rubPerJpy)} RUB`;
    }
}

// 1. Попытка через currency-api (исправленный URL)
fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/jpy/rub.json')
    .then(response => {
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        return response.json();
    })
    .then(data => {
        let rubPerJpy = null;
        if (data && typeof data.rub === 'number') rubPerJpy = data.rub;
        else if (data && data.jpy && typeof data.jpy.rub === 'number') rubPerJpy = data.jpy.rub;
        if (rubPerJpy && rubPerJpy > 0) {
            updatePrices(rubPerJpy);
        } else {
            throw new Error('Курс не найден');
        }
    })
    .catch(error => {
        console.error('Ошибка currency-api:', error);
        // 2. Попытка через exchangerate.host (уже работал, но возвращал ошибку, попробуем с правильными параметрами)
        fetch('https://api.exchangerate.host/latest?base=JPY&symbols=RUB')
            .then(response => response.json())
            .then(data => {
                if (data && data.rates && data.rates.RUB) {
                    updatePrices(data.rates.RUB);
                } else {
                    throw new Error('Курс не найден');
                }
            })
            .catch(error2 => {
                console.error('Ошибка exchangerate.host:', error2);
                // 3. Попытка через exchangerate-api.com (бесплатный без ключа, лимит 1500 запросов/месяц)
                fetch('https://api.exchangerate-api.com/v4/latest/JPY')
                    .then(response => response.json())
                    .then(data => {
                        if (data && data.rates && data.rates.RUB) {
                            updatePrices(data.rates.RUB);
                        } else {
                            throw new Error('Курс не найден');
                        }
                    })
                    .catch(error3 => {
                        console.error('Ошибка exchangerate-api.com:', error3);
                        // Финальный fallback
                        updatePrices(0.5);
                        if (document.getElementById('exchangeRatePlaceholder')) {
                            document.getElementById('exchangeRatePlaceholder').textContent = '100 JPY ≈ 50 RUB (офлайн)';
                        }
                    });
            });
    });
