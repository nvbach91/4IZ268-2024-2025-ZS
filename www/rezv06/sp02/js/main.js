const config = {
    API_KEY: 'ccdc8c18e7d743faa3a2f3f0abd7b239',
    BASE_URL: 'https://openexchangerates.org/api',
    currencies: {},
    currencyNames: {}
};

const $amount = $('#amount'), $fromCurrency = $('#fromCurrency'), $toCurrencies = $('#toCurrencies'), $result = $('#result'), $loadingOverlay = $('#loadingOverlay'), $currencyModal = $('#currencyModal'), $currencyList = $('#currencyList'), $converterForm = $('#converterForm');

const historyManager = {
    get: () => JSON.parse(localStorage.getItem('conversionHistory') || '[]'),
    save: history => localStorage.setItem('conversionHistory', JSON.stringify(history)),
    add(data) {
        const history = this.get();
        history.unshift({ ...data, id: Date.now(), timestamp: new Date().toLocaleString('cs-CZ', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' }) });
        if (history.length > 10) history.pop();
        this.save(history);
        this.display();
    },
    delete(id) {
        this.save(this.get().filter(item => item.id !== id));
        this.display();
    },
    clear() {
        if (confirm('Opravdu chcete vymazat celou historii převodů?')) {
            localStorage.removeItem('conversionHistory');
            this.display();
        }
    },
    display() {
        const history = this.get();
        const $history = $('#history').empty();
        if (!history.length) {
            $history.html('<div class="text-muted text-center py-3">Historie je prázdná</div>');
            return;
        }
        const fragment = $(document.createDocumentFragment());
        history.forEach(item => {
            if (item.result !== null) {
                const $historyItem = $('<div>').addClass('history-item').append(
                    $('<div>').addClass('history-content').html(`
                        <div class="text-primary">${item.timestamp}</div>
                        <div>${formatNumber(item.amount)} ${item.from} (${config.currencyNames[item.from]}) = ${formatNumber(item.result.toFixed(2))} ${item.to} (${config.currencyNames[item.to]})</div>
                    `),
                    $('<div>').addClass('button-group').append(
                        $('<button>').addClass('btn btn-outline-danger btn-sm delete-item').html('<i class="fas fa-trash"></i>').on('click', () => this.delete(item.id)),
                        $('<button>').addClass('btn btn-outline-primary btn-sm repeat-item').html('<i class="fas fa-redo"></i> Opakovat převod').on('click', () => repeatConversion(item))
                    )
                );
                fragment.append($historyItem);
            }
        });
        $history.append(fragment);
    }
};

const urlManager = {
    update() {
        const params = new URLSearchParams(), amount = $amount.val(), from = $fromCurrency.val(), to = $('.to-currency').map((_, el) => $(el).val()).get().join(',');
        if (amount) params.set('amount', amount);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        history.replaceState({}, '', `?${params.toString()}`);
    },
    async load() {
        const params = new URLSearchParams(window.location.search);
        if (params.has('amount')) $amount.val(params.get('amount'));
        if (params.has('from')) $fromCurrency.val(params.get('from'));
        if (params.has('to')) {
            const toCurrencies = params.get('to').split(',');
            $toCurrencies.empty();
            addNewCurrency(true);
            toCurrencies.forEach((currency, index) => {
                if (index > 0) addNewCurrency();
                $('.to-currency').eq(index).val(currency);
            });
            if (params.has('amount') && params.has('from') && params.has('to')) await performConversion();
        } else {
            $toCurrencies.empty();
            addNewCurrency(true);
        }
    }
};

const addNewCurrency = (isFirst = false) => {
    const $container = $('<div>').addClass('to-currency-item mb-2').append(
        $('<select>').addClass('form-control to-currency').prop('required', true)
    );
    if (!isFirst) {
        $container.append(
            $('<span>').addClass('remove-currency').html('<i class="fas fa-times-circle"></i>').on('click', function() {
                $(this).parent().remove();
                urlManager.update();
            })
        );
    }
    $container.appendTo($toCurrencies).find('select').each(fillCurrencySelect);
    return $container.find('select');
};

const fillCurrencySelect = function() {
    const $select = $(this).empty();
    const availableRates = Object.keys(config.rates); // Předpokládáme, že config.rates obsahuje kurzy z latest.json
    Object.keys(config.currencies).forEach(currency => {
        if (availableRates.includes(currency)) {
            $('<option>').val(currency).text(`${currency} (${config.currencyNames[currency]})`).appendTo($select);
        }
    });
    $select.val($select.hasClass('to-currency') ? 'CZK' : 'USD');
};

const showError = (message, details = '') => {
    const errorMessage = details ? `${message}<br><small class="text-muted">${details}</small>` : message;
    $result.html(`
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            ${errorMessage}
        </div>
    `);
};

const performConversion = async () => {
    const amount = parseFloat($amount.val()), fromCurrency = $fromCurrency.val(), toCurrencies = $('.to-currency').map((_, el) => $(el).val()).get();
    $result.html('<div class="text-center">Převádím...</div>');
    try {
        const results = await convertCurrency(amount, fromCurrency, toCurrencies);
        results.forEach(r => historyManager.add({ amount, from: fromCurrency, to: r.to, result: r.result }));
        $result.html(results.map(r => `
            <div class="result-item">
                <i class="fas fa-exchange-alt text-primary"></i>
                ${formatNumber(amount)} ${fromCurrency} (${config.currencyNames[fromCurrency]}) = <strong>${formatResult(r.result)} ${r.to} (${config.currencyNames[r.to]})</strong>
            </div>
        `).join(''));
    } catch (error) {
        showError('Došlo k chybě při převodu:', error.message);
    } finally {
        $loadingOverlay.hide();
    }
};

const formatResult = result => {
    if (result < 0.01) {
        const resultStr = result.toString();
        const decimalPart = resultStr.split('.')[1] || '';
        const significantDigits = decimalPart.match(/[1-9]/g) || [];
        return `0.00${significantDigits.slice(0, 2).join('')}`;
    }
    return result.toFixed(2);
};

const convertCurrency = async (amount, from, toCurrencies) => {
    try {
        const response = await $.ajax({
            url: `${config.BASE_URL}/latest.json`,
            data: { app_id: config.API_KEY },
            method: 'GET',
            timeout: 10000
        });
        if (!response.rates) throw new Error('Invalid API response');
        const fromRate = response.rates[from];
        return toCurrencies.map(to => {
            const toRate = response.rates[to];
            return { to, result: (amount / fromRate) * toRate };
        });
    } catch (error) {
        throw new Error(`Nepodařilo se provést převod: ${error.responseJSON?.description || error.message || 'Neznámá chyba'}`);
    }
};

const repeatConversion = async item => {
    $amount.val(item.amount);
    $fromCurrency.val(item.from);
    $toCurrencies.empty();
    addNewCurrency(true).val(item.to);
    $converterForm.submit();
};

const formatNumber = number => number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

$(document).ready(async () => {
    $loadingOverlay.append('<div class="loading-message">Načítám data...</div>').show();
    try {
        const [currenciesResponse, ratesResponse] = await Promise.all([
            $.ajax({
                url: `${config.BASE_URL}/currencies.json`,
                data: { app_id: config.API_KEY },
                method: 'GET',
                timeout: 10000
            }),
            $.ajax({
                url: `${config.BASE_URL}/latest.json`,
                data: { app_id: config.API_KEY },
                method: 'GET',
                timeout: 10000
            })
        ]);

        if (!currenciesResponse || !ratesResponse.rates) throw new Error('Invalid API response');
        
        config.currencies = currenciesResponse;
        config.currencyNames = currenciesResponse;
        config.rates = ratesResponse.rates;

        if (!Object.keys(config.currencies).length) throw new Error('Seznam měn je prázdný');
        $('select').each(fillCurrencySelect);
        await urlManager.load();
    } catch (error) {
        showError('Nepodařilo se načíst seznam měn.', `Technické informace: ${error.responseJSON?.description || error.message || 'Neznámá chyba'}`);
    } finally {
        $loadingOverlay.hide();
    }

    historyManager.display();

    $('#selectCurrency').on('click', () => {
        $currencyModal.modal('show');
        loadCurrencyList();
    });

    const loadCurrencyList = () => {
        const usedCurrencies = getUsedCurrencies();
        $currencyList.empty(); // Vyčistí seznam před přidáním nových položek
        const fragment = $(document.createDocumentFragment());
        Object.keys(config.currencies).forEach(currency => {
            if (!usedCurrencies.includes(currency) && config.rates[currency]) {
                const $item = $('<div>').addClass('list-group-item').append(
                    $('<input>').attr('type', 'checkbox').val(currency),
                    $('<span>').text(`${currency} (${config.currencyNames[currency]})`)
                ).on('click', function() {
                    const $checkbox = $(this).find('input[type="checkbox"]');
                    $checkbox.prop('checked', !$checkbox.prop('checked'));
                });
                fragment.append($item);
            }
        });
        $currencyList.append(fragment);
    };

    const getUsedCurrencies = () => {
        const used = [$fromCurrency.val()];
        $('.to-currency').each(function() { used.push($(this).val()); });
        return used;
    };

    $('#sortAsc').on('click', () => sortCurrencyList(true));
    $('#sortDesc').on('click', () => sortCurrencyList(false));

    const sortCurrencyList = asc => {
        const $items = $currencyList.children('.list-group-item').detach();
        const sortedItems = $items.get().sort((a, b) => {
            const textA = $(a).text().toUpperCase(), textB = $(b).text().toUpperCase();
            return asc ? textA.localeCompare(textB) : textB.localeCompare(textA);
        });
        $currencyList.append(sortedItems);
    };

    $('#addSelectedCurrencies').on('click', () => {
        $currencyList.find('input:checked').each(function() {
            const selectedCurrency = $(this).val();
            if (!$('.to-currency').filter(function() { return $(this).val() === selectedCurrency; }).length) {
                addNewCurrency().val(selectedCurrency);
            }
        });
        $currencyModal.modal('hide');
        urlManager.update();
    });

    historyManager.display();

    $('#addCurrency').on('click', () => {
        addNewCurrency();
        urlManager.update();
    });

    $('#clearHistory').on('click', () => historyManager.clear());

    $converterForm.on('submit', async function(e) {
        e.preventDefault();
        urlManager.update();
        $loadingOverlay.show();
        await performConversion();
    });

    $(window).on('popstate', urlManager.load);
});