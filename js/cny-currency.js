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

// Функция для попытки получения курса с разных API
function fetchRate() {
    // 1. Попытка через exchangerate.host
    fetch('https://api.exchangerate.host/latest?base=CNY&symbols=RUB')
        .then(response => response.json())
        .then(data => {
            if (data && data.rates && data.rates.RUB) {
                updateCNYPrices(data.rates.RUB);
                return true;
            }
            throw new Error('No RUB rate');
        })
        .catch(error => {
            console.warn('exchangerate.host failed:', error);
            // 2. Попытка через frankfurter (поддерживает RUB?)
            fetch('https://api.frankfurter.app/latest?from=CNY&to=RUB')
                .then(response => response.json())
                .then(data => {
                    if (data && data.rates && data.rates.RUB) {
                        updateCNYPrices(data.rates.RUB);
                        return true;
                    }
                    throw new Error('No RUB rate');
                })
                .catch(error2 => {
                    console.warn('frankfurter failed:', error2);
                    // 3. Попытка через currency-api (jsDelivr) для CNY
                    fetch('https://cdn.jsdelivr.net/gh/fawazahmed0/currency-api@1/latest/currencies/cny/rub.json')
                        .then(response => response.json())
                        .then(data => {
                            if (data && data.rub) {
                                updateCNYPrices(data.rub);
                                return true;
                            }
                            throw new Error('No rub field');
                        })
                        .catch(error3 => {
                            console.error('Все API не сработали:', error3);
                            // Финальный fallback
                            updateCNYPrices(14);
                            if (document.getElementById('exchangeRatePlaceholder')) {
                                document.getElementById('exchangeRatePlaceholder').textContent = '1 CNY ≈ 14 RUB (офлайн)';
                            }
                        });
                });
        });
}

// Запускаем получение курса
fetchRate();
