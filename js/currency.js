// Функция для обновления всех цен на странице
function updatePrices(rubPerJpy) {
    console.log('Применяем курс:', rubPerJpy);
    
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

// Пытаемся получить курс через currency-api на jsDelivr
fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/jpy/rub.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
    })
    .then(data => {
        console.log('Данные от currency-api:', data);
        // Формат ответа может быть { "date": "...", "rub": 0.5 } или { "jpy": { "rub": 0.5 } }
        let rubPerJpy = null;
        if (data && typeof data.rub === 'number') {
            rubPerJpy = data.rub;
        } else if (data && data.jpy && typeof data.jpy.rub === 'number') {
            rubPerJpy = data.jpy.rub;
        }
        
        if (rubPerJpy && rubPerJpy > 0) {
            updatePrices(rubPerJpy);
        } else {
            throw new Error('Курс не найден в ответе');
        }
    })
    .catch(error => {
        console.error('Ошибка currency-api:', error);
        // Второй вариант: через exchangerate.host (поддерживает CORS)
        fetch('https://api.exchangerate.host/latest?base=JPY&symbols=RUB')
            .then(response => {
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            })
            .then(data => {
                console.log('Данные от exchangerate.host:', data);
                if (data && data.rates && data.rates.RUB) {
                    updatePrices(data.rates.RUB);
                } else {
                    throw new Error('Курс не найден');
                }
            })
            .catch(fallbackError => {
                console.error('Ошибка exchangerate.host:', fallbackError);
                // Финальный fallback
                updatePrices(0.5);
                if (document.getElementById('exchangeRatePlaceholder')) {
                    document.getElementById('exchangeRatePlaceholder').textContent = '100 JPY ≈ 50 RUB (офлайн)';
                }
            });
    });
