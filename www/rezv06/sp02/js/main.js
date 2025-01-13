const config = {
    API_KEY: '6cecca922d31ea317cafbf97bd96b30e',
    BASE_URL: 'https://api.exchangeratesapi.io/v1',
    currencies: []
};

// Helper funkce pro práci s historií
const historyManager = {
    get() {
        return JSON.parse(localStorage.getItem('conversionHistory') || '[]');
    },
    save(history) {
        localStorage.setItem('conversionHistory', JSON.stringify(history));
    },
    add(data) {
        const history = this.get();
        history.unshift({ ...data, id: Date.now(), timestamp: new Date().toLocaleString() });
        if (history.length > 10) history.pop();
        this.save(history);
        this.display();
    },
    delete(id) {
        const history = this.get().filter(item => item.id !== id);
        this.save(history);
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

        if (history.length === 0) {
            $history.html('<div class="text-muted text-center py-3">Historie je prázdná</div>');
            return;
        }

        history.forEach(item => {
            $('<div>')
                .addClass('history-item')
                .append(
                    $('<div>').addClass('history-content').html(`
                        <div class="text-primary">${item.timestamp}</div>
                        <div>${item.amount} ${item.from} = ${item.result.toFixed(2)} ${item.to}</div>
                    `),
                    $('<button>')
                        .addClass('btn btn-outline-danger btn-sm delete-item')
                        .html('<i class="fas fa-trash"></i>')
                        .on('click', () => this.delete(item.id))
                )
                .appendTo($history);
        });
    }
};

// URL parametry
const urlManager = {
    update() {
        const params = new URLSearchParams();
        const amount = $('#amount').val();
        const from = $('#fromCurrency').val();
        const to = $('.to-currency').map((_, el) => $(el).val()).get().join(',');
        
        if (amount) params.set('amount', amount);
        if (from) params.set('from', from);
        if (to) params.set('to', to);
        
        history.pushState({}, '', `?${params.toString()}`);
    },
    load() {
        const params = new URLSearchParams(window.location.search);
        
        if (params.has('amount')) $('#amount').val(params.get('amount'));
        if (params.has('from')) $('#fromCurrency').val(params.get('from'));
        if (params.has('to')) {
            const toCurrencies = params.get('to').split(',');
            $('#toCurrencies').empty();
            toCurrencies.forEach((currency, index) => {
                if (index > 0) addNewCurrency();
                $('.to-currency').eq(index).val(currency);
            });
        }
    }
};

// Přidání nové měny
function addNewCurrency() {
    $('<div>')
        .addClass('to-currency-item mb-2')
        .append(
            $('<select>').addClass('form-control to-currency').prop('required', true),
            $('<span>')
                .addClass('remove-currency')
                .html('<i class="fas fa-times-circle"></i>')
                .on('click', function() {
                    $(this).parent().remove();
                    urlManager.update();
                })
        )
        .appendTo('#toCurrencies')
        .find('select')
        .each(fillCurrencySelect);
}

// Naplnění select boxu měnami
function fillCurrencySelect() {
    const $select = $(this);
    $select.empty();
    config.currencies.forEach(currency => {
        $('<option>').val(currency).text(currency).appendTo($select);
    });
    $select.val($select.hasClass('to-currency') ? 'CZK' : 'EUR');
}

// Zobrazení chyb
function showError(message, details = '') {
    const errorMessage = details ? `${message}<br><small class="text-muted">${details}</small>` : message;
    $('#result').html(`
        <div class="alert alert-danger">
            <i class="fas fa-exclamation-circle"></i>
            ${errorMessage}
        </div>
    `);
}

// Převod měny
async function convertCurrency(amount, from, to) {
    try {
        const response = await $.ajax({
            url: `${config.BASE_URL}/latest`,
            data: {
                access_key: config.API_KEY,
                base: from,
                symbols: to
            },
            method: 'GET',
            timeout: 10000 // Přidáme timeout 10 sekund
        });

        if (response.success === false) {
            throw new Error(response.error.type || 'API Error');
        }

        return amount * response.rates[to];
    } catch (error) {
        const errorMessage = error.responseJSON?.error?.type || error.message || 'Neznámá chyba';
        throw new Error(`Nepodařilo se provést převod: ${errorMessage}`);
    }
}

$(document).ready(async function() {
    $('#loadingOverlay').append('<div class="loading-message">Načítám data...</div>');
    // Načtení měn
    $('#loadingOverlay').show();
    try {
        const response = await $.ajax({
            url: `${config.BASE_URL}/symbols`,
            data: { access_key: config.API_KEY },
            method: 'GET',
            timeout: 10000
        });

        if (response.success === false) {
            throw new Error(response.error.type || 'API Error');
        }

        config.currencies = Object.keys(response.symbols);
        if (config.currencies.length === 0) {
            throw new Error('Seznam měn je prázdný');
        }

        $('select').each(fillCurrencySelect);
        urlManager.load();
    } catch (error) {
        const errorDetails = error.responseJSON?.error?.type || error.message || 'Neznámá chyba';
        showError(
            'Nepodařilo se načíst seznam měn.',
            `Technické informace: ${errorDetails}`
        );
    } finally {
        $('#loadingOverlay').hide();
    }


    // Inicializace historie
    historyManager.display();

    // Event listeners
    $('#addCurrency').on('click', () => {
        addNewCurrency();
        urlManager.update();
    });

    $('#clearHistory').on('click', () => historyManager.clear());

    $('#converterForm').on('submit', async function(e) {
        e.preventDefault();
        urlManager.update();
        $('#loadingOverlay').show();

        const amount = parseFloat($('#amount').val());
        const fromCurrency = $('#fromCurrency').val();
        const $result = $('#result').html('<div class="text-center">Převádím...</div>');

        try {
            const results = await Promise.all(
                $('.to-currency').map(async function() {
                    const toCurrency = $(this).val();
                    const result = await convertCurrency(amount, fromCurrency, toCurrency);
                    historyManager.add({ amount, from: fromCurrency, to: toCurrency, result });
                    return { to: toCurrency, result };
                }).get()
            );

            $result.html(
                results.map(r => `
                    <div class="result-item">
                        <i class="fas fa-exchange-alt text-primary"></i>
                        ${amount} ${fromCurrency} = <strong>${r.result.toFixed(2)} ${r.to}</strong>
                    </div>
                `).join('')
            );
        } catch (error) {
            $result.html(`
                <div class="alert alert-danger">
                    <i class="fas fa-exclamation-circle"></i>
                    Došlo k chybě při převodu: ${error.message}
                </div>
            `);
        } finally {
            $('#loadingOverlay').hide();
        }
    });

    $(window).on('popstate', urlManager.load);
});