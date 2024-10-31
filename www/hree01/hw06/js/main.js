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
    const currentIndex = alphabet.indexOf(c);
    if (currentIndex === -1) { // if c is not found in the string, -1 is returned
        return c;
    }
    const length = alphabet.length;
    const resultIndex = (currentIndex - shift + length)%length;
    const result = alphabet.charAt(resultIndex);
    return result;

    // a helper function to shift one character inside the 
    // alphabet based on the shift value and return the result
};
const shiftString = (str, shift) => {
    const length = str.length;
    let newString = "";
        for(let i = 0; i < (length); i++) {
        const currentChar = str.charAt(i);
        const newChar = shiftChar(currentChar, shift);
        newString += newChar; // expanding the string gradually by individual characters
    }
    return newString;
    // a helper function to shift one entire string inside the 
    // alphabet based on the shift value and return the result
};
const caesarDecipher = (cipherText, usedKey) => {
    return shiftString(cipherText,usedKey);
    // your implementation goes here
    // good to know: 
    //    str.indexOf(c) - get the index of the specified character in the string
    //    str.charAt(i) - get the character at the specified index in the string
    //    String.fromCharCode(x) - get the character based on ASCII value
    //    when the shifted character is out of bound, it goes back to the beginning and count on from there
};

// albert einstein
console.log(caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19));

// john archibald wheeler
console.log(caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5));

// charles darwin
console.log(caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12));

const decryptionForm = document.querySelector('#decryption-machine');
const resultContainer = document.querySelector('#result');
decryptionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const formData = new FormData(decryptionForm);
    const text = formData.get('encrypted-text'); // get text
    const key = formData.get('key'); // get key
    const result = caesarDecipher(text.toUpperCase(), Number(key)); // to be safe, I will convert the input text to uppercase letters
    resultContainer.textContent = result; // writing the result into the result section
})

