// js/rates.js
function updateJPYPrices(rubPerJpy) {
    document.querySelectorAll('.rub-value[data-jpy]').forEach(el => {
        let jpy = parseFloat(el.getAttribute('data-jpy'));
        if (!isNaN(jpy)) {
            let rub = Math.round(jpy * rubPerJpy);
            el.textContent = `≈ ${rub} ₽`;
        }
    });
    document.querySelectorAll('.rub-range[data-min][data-max]').forEach(el => {
        let minJpy = parseFloat(el.getAttribute('data-min'));
        let maxJpy = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minJpy) && !isNaN(maxJpy)) {
            let minRub = Math.round(minJpy * rubPerJpy);
            let maxRub = Math.round(maxJpy * rubPerJpy);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });
    let rateDisplay = document.getElementById('jpyRatePlaceholder');
    if (rateDisplay) rateDisplay.textContent = `100 JPY ≈ ${Math.round(100 * rubPerJpy)} RUB`;
}

function updateCNYPrices(rubPerCny) {
    document.querySelectorAll('.rub-value-cny[data-cny]').forEach(el => {
        let cny = parseFloat(el.getAttribute('data-cny'));
        if (!isNaN(cny)) {
            let rub = Math.round(cny * rubPerCny);
            el.textContent = `≈ ${rub} ₽`;
        }
    });
    document.querySelectorAll('.rub-range-cny[data-min][data-max]').forEach(el => {
        let minCny = parseFloat(el.getAttribute('data-min'));
        let maxCny = parseFloat(el.getAttribute('data-max'));
        if (!isNaN(minCny) && !isNaN(maxCny)) {
            let minRub = Math.round(minCny * rubPerCny);
            let maxRub = Math.round(maxCny * rubPerCny);
            el.textContent = `≈ ${minRub}–${maxRub} ₽`;
        }
    });
    let rateDisplay = document.getElementById('cnyRatePlaceholder');
    if (rateDisplay) rateDisplay.textContent = `1 CNY ≈ ${Math.round(rubPerCny)} RUB`;
}

function fetchJPYRate() {
    return fetch('https://api.exchangerate.host/latest?base=JPY&symbols=RUB')
        .then(response => response.json())
        .then(data => data.rates.RUB)
        .catch(() => fetch('https://api.frankfurter.app/latest?from=JPY&to=RUB')
            .then(r => r.json())
            .then(d => d.rates.RUB)
            .catch(() => 0.5));
}

function fetchCNYRate() {
    return fetch('https://api.exchangerate.host/latest?base=CNY&symbols=RUB')
        .then(response => response.json())
        .then(data => data.rates.RUB)
        .catch(() => fetch('https://api.frankfurter.app/latest?from=CNY&to=RUB')
            .then(r => r.json())
            .then(d => d.rates.RUB)
            .catch(() => 14));
}

Promise.all([fetchJPYRate(), fetchCNYRate()])
    .then(([jpyRate, cnyRate]) => {
        updateJPYPrices(jpyRate);
        updateCNYPrices(cnyRate);
    })
    .catch(() => {
        // fallback
        updateJPYPrices(0.5);
        updateCNYPrices(14);
    });
