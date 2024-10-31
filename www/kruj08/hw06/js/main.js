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

// a helper function to shift one character inside the alphabet based on the shift value and return the result
const shiftChar = (c, shift) => {
    let startCharIndex = alphabet.indexOf(c);
    let shiftedCharIndex = alphabet.charAt(startCharIndex + shift);

    return shiftedCharIndex;
};

// a helper function to shift one entire string inside the alphabet based on the shift value and return the result
const shiftString = (str, shift) => {
    const charArray = str.split("");
    let shiftedArray = [];

    charArray.forEach(c => {
        shiftedArray.push(c === " " ? " " : shiftChar(c, shift));
    });

    result = shiftedArray.join("");
    return result;
};

const caesarDecipher = (cipherText, usedKey) => {
    // your implementation goes here
    // good to know: 
    //    str.indexOf(c) - get the index of the specified character in the string
    //    str.charAt(i) - get the character at the specified index in the string
    //    String.fromCharCode(x) - get the character based on ASCII value
    //    when the shifted character is out of bound, it goes back to the beginning and count on from there
    const charArray = cipherText.split("");
    let unshiftedArray = [];

    charArray.forEach(c => {

        if (c === " ") {
            unshiftedArray.push(" ");
        } else if (!alphabet.includes(c)) {
            unshiftedArray.push(c);
        } else {
            
            for (let i = 1; i <= usedKey; i++) {
                let shiftedChar = shiftChar(c, -1);
                let outOfBound = 0;

                if (shiftedChar == '') {
                    outOfBound+=1;
                    if (outOfBound == 1) {
                        c = 'Z';
                    } else {
                        c = shiftChar('Z', -1);
                    }
                } else {
                    c = shiftedChar;
                };
            };

            unshiftedArray.push(c);

        };

    });

    result = unshiftedArray.join("");
    return result;
};

resultDiv = document.getElementById('result');

document.getElementById('decipher').addEventListener("click", () => {
    const cipherText = document.getElementById('cipher').value.toUpperCase();
    const cipherKey = parseInt(document.getElementById('key').value);
    resultDiv.innerText = caesarDecipher(cipherText, cipherKey);
});

// // albert einstein
//caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19);

// // john archibald wheeler
// caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5);

// // charles darwin
// caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12);
