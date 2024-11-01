
//         index: 0123456789...
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
   if (index === -1) return c;
    const index = alphabet.indexOf(c);
    const shiftedIndex = (index - shift + alphabet.length) % alphabet.length;
    return alphabet.charAt(shiftedIndex);
};

const shiftString = (str, shift) => {
    return str.split('').map(c => shiftChar(c, shift)).join('');
    // nebo hiftChar(char, shift))?
};
const caesarDecipher = (cipherText, usedKey) => {
    let decipheredText = '';
    for (let i = 0; i < cipherText.length; i++) {
        let char = cipherText.charAt(i);
        if (char >= 'A' && char <= 'Z') {
            let shiftedCharCode = char.charCodeAt(0) - usedKey;
            if (shiftedCharCode < 'A'.charCodeAt(0)) {
                shiftedCharCode += 26;
            }
            decipheredText += String.fromCharCode(shiftedCharCode);
        } else {
            decipheredText += char;
        }
    }
    return decipheredText;
};

document.getElementById("decipherButton").addEventListener("click", () => {
    const cipherText = document.getElementById("cipherText").value.toUpperCase();
    const shiftKey = parseInt(document.getElementById("key").value);
    const result = caesarDecipher(cipherText, shiftKey);
    document.getElementById("output").textContent = result;
});


// albert einstein
console.log(caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19));

// john archibald wheeler
console.log(caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5));

// charles darwin
console.log(caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12));