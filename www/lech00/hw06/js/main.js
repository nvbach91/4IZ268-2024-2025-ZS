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
    const index = alphabet.indexOf(c);
    if (index === -1) return c;

    const shiftedIndex = (index - shift + 26) % 26;
    return alphabet.charAt(shiftedIndex);
};
const shiftString = (str, shift) => {
    const arrayOfChars = str.split('');
    for (let i = 0; i < arrayOfChars.length; i++) {
        arrayOfChars[i] = shiftChar(arrayOfChars[i], shift);
    }
    const decipheredString = arrayOfChars.join('');
    return decipheredString;
};
const caesarDecipher = (cipherText, usedKey) => {
    console.log(shiftString(cipherText, usedKey));
    return shiftString(cipherText, usedKey);
};

// albert einstein
caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19);

// john archibald wheeler
caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5);

// charles darwin
caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12);

const decryptionForm = document.querySelector('#decryption-form');
const resultElement = document.querySelector('#result');
decryptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(decryptionForm);
    const encryptedText = Object.fromEntries(formData)['encrypted-text'];
    const keyUsed = Object.fromEntries(formData)['key-used'];
    console.log(keyUsed);
    if (keyUsed === '') {
        alert('Missing key value!');
    } else {
        const result = caesarDecipher(String(encryptedText), Number(keyUsed));
        resultElement.textContent = result;
    };
});