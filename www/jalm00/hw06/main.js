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
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
    let letterIndex = alphabet.indexOf(c);
    if (letterIndex === -1) {
        return c;
    }
    let charShifted = (letterIndex - shift + 26) % 26;
    return alphabet.charAt(charShifted);
};
const shiftString = (str, shift) => {
    var wordLetters = str.split('');
    for (let i = 0; i < str.length; i++) {
        wordLetters[i] = shiftChar(wordLetters[i], shift);
    }
    var word = wordLetters.join('');
    return word;
};
const caesarDecipher = (cipherText, usedKey) => {
    var encryptedMsg = cipherText.toUpperCase();
    return shiftString(encryptedMsg, usedKey);
};

// albert einstein
//console.log(caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19));

// john archibald wheeler
//console.log(caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5));

// charles darwin
//console.log(caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12));

const cipherForm = document.querySelector('#cipher-form');
const resultContainer = document.querySelector('#cipher-results')

cipherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(cipherForm);
    const cipherText = formData.get('cipher-text');
    const cipherShift = Number(formData.get('cipher-shift'));
    const decryptedMsg = caesarDecipher(cipherText, cipherShift);

    resultContainer.textContent = `${decryptedMsg}`;
});