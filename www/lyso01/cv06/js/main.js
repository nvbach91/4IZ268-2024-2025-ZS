/**
 * Long live Sparta! Vytvořte funkci, která vyřeší Caesarovu širfu. Funkce dostane 
 * na vstup zašifrovaný text a také hodnotu, která byla použita při šifrování, a pak 
 * vrátí dešifrovaný text. Předpokládejte pouze anglickou abecedu s velkými 
 * písmeny, ostatní znaky ignorujte. Poté v konzoli dešifrujte/dešiftujte následující texty.
 * 
 * key used - encrypted text
 *       19 - MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG
 *        5 - YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW
 *       12 - M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ
 * 
 * Následně vytvořte uživatelské rozhraní, ve kterém bude možné zadat zmíněné dvě 
 * vstupní hodnoty (zašifrovaný text a použitý klíč) a po kliknutí na tlačítko 
 * "Decipher!" se na určeném místě zobrazí dešifrovaný text. Rozhraní také vhodně
 * nastylujte.
 */
//         index: 0123456789...
var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function shiftChar(char, shift) {
    if (alphabet.indexOf(char) !== -1) {
        var position = alphabet.indexOf(char) - shift;
        if (position < 0) {
            position += 26;
        }
        return alphabet.charAt(position % 26);
    } else {
        return char;
    }
}

function shiftString(text, shift) {
    var result = '';
    for (var i = 0; i < text.length; i++) {
        var char = text.charAt(i);
        result += shiftChar(char, shift);
    }
    return result;
}

function caesarDecipher(cipherText, key) {
    return shiftString(cipherText, key);
}

document.getElementById('button').addEventListener('click', function() {
    var cipherText = document.getElementById('cipherText').value;
    cipherText = cipherText ? cipherText.trim() : '';
    var key = parseInt(document.getElementById('key').value);

    if (cipherText === '' || isNaN(key)) {
        alert('Please provide "ciphered text" and a valid numeric "key".');
        return;
    }

    document.getElementById('resultText').textContent = caesarDecipher(cipherText, key);
});

// albert einstein
caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19);

// john archibald wheeler
caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5);

// charles darwin
caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12);