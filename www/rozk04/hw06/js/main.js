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
    const shiftedIndex = (index + shift + alphabet.length) % alphabet.length;
    return alphabet.charAt(shiftedIndex);
};

const shiftString = (str, shift) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        const currentChar = str.charAt(i);
        result += shiftChar(currentChar, shift);
    }
    return result;
};

const caesarDecipher = (cipherText, usedKey) => {
    return shiftString(cipherText, -usedKey);
};

document.getElementById('decipherButton').addEventListener('click', () => {
    const cipherText = document.getElementById('cipherText').value.toUpperCase();
    const usedKey = parseInt(document.getElementById('usedKey').value, 10);
    const decryptedText = caesarDecipher(cipherText, usedKey);
    document.getElementById('decryptedText').innerText = decryptedText;
});


// albert einstein
caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19);

// john archibald wheeler
caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5);

// charles darwin
caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12);

function applyStyles() {
    const body = document.body;
    body.style.fontFamily = 'Arial, sans-serif';
    body.style.backgroundColor = '#f4f4f4';
    body.style.color = '#333';
    body.style.lineHeight = '1.6';
    body.style.padding = '20px';

    const title = document.querySelector('h1');
    title.style.textAlign = 'center';
    title.style.color = '#2c3e50';
    title.style.marginBottom = '20px';

    const labels = document.querySelectorAll('label');
    labels.forEach(label => {
        label.style.fontWeight = 'bold';
    });

    const textArea = document.getElementById('cipherText');
    textArea.style.width = '100%';
    textArea.style.height = '100px';
    textArea.style.padding = '10px';
    textArea.style.marginBottom = '10px';
    textArea.style.border = '1px solid #ccc';
    textArea.style.borderRadius = '5px';
    textArea.style.resize = 'none'; 

    const input = document.getElementById('usedKey');
    input.style.width = '100%';
    input.style.padding = '10px';
    input.style.marginBottom = '10px';
    input.style.border = '1px solid #ccc';
    input.style.borderRadius = '5px';

    const button = document.getElementById('decipherButton');
    button.style.backgroundColor = '#3498db';
    button.style.color = 'white';
    button.style.border = 'none';
    button.style.padding = '10px 15px';
    button.style.borderRadius = '5px';
    button.style.cursor = 'pointer';
    button.style.fontSize = '16px';

    button.addEventListener('mouseover', () => {
        button.style.backgroundColor = '#14b53f';
    });

    button.addEventListener('mouseout', () => {
        button.style.backgroundColor = '#3498db';
    });

    const decryptedTextHeader = document.querySelector('h2');
    decryptedTextHeader.style.marginTop = '20px';
    decryptedTextHeader.style.color = '#2c3e50';

    const decryptedText = document.getElementById('decryptedText');
    decryptedText.style.padding = '10px';
    decryptedText.style.backgroundColor = '#ecf0f1';
    decryptedText.style.border = '1px solid #bdc3c7';
    decryptedText.style.borderRadius = '5px';
}

window.onload = applyStyles;