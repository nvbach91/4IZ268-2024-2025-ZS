const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
    const index = alphabet.indexOf(c);
    if (index === -1) return c; 
    const shiftedIndex = (index - shift + 26) % 26;
    return alphabet.charAt(shiftedIndex);
};

const shiftString = (str, shift) => {
    return str.split('').map(c => shiftChar(c, shift)).join('');
};

const caesarDecipher = (cipherText, usedKey) => {
    return shiftString(cipherText, usedKey);
};

console.log(
	caesarDecipher(
		"MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG",
		19
	)
);

console.log(
	caesarDecipher(
		"YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW",
		5
	)
);

console.log(
	caesarDecipher(
		"M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ",
		12
	)
);
const cipherForm = document.getElementById('cipher-form');
const decipheredTextElement = document.getElementById('deciphered-text');


let isResultVisible = false;

cipherForm.addEventListener('submit', (event) => {
    event.preventDefault();
    
    const cipherText = document.getElementById('cipher-text').value.toUpperCase();
    const shiftKey = parseInt(document.getElementById('shift-key').value, 10);

   
    if (isNaN(shiftKey) || shiftKey < 0 || shiftKey > 25) {
        alert("Prosím, zadejte platné číslo klíče (0-25).");
        return;
    }

    const decipheredText = caesarDecipher(cipherText, shiftKey);
    
  
    decipheredTextElement.textContent = decipheredText; 
    decipheredTextElement.style.display = "block"; 
});
