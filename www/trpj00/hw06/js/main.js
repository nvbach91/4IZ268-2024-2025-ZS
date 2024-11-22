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
//              0123456789...
const shiftChar = (c, shift) => {
  if (/^[A-Z]$/.test(c)) {
    const asciiCode = c.charCodeAt(0);
    const result = String.fromCharCode(
      ((asciiCode - 65 - shift + 26) % 26) + 65
    );

    return result;
  } else {
    return c;
  }
};

console.log(shiftChar("A", 1));

const shiftString = (str, shift) => {
  const stringSplit = str.split("");
  const result = stringSplit.map((char) => {
    return shiftChar(char, shift);
  });

  return result.join("");
};

const caesarDecipher = (cipherText, usedKey) => {
  const words = cipherText.split(" ");
  const result = words.map((word) => {
    return shiftString(word, usedKey);
  });

  return result.join(" ");
};

// albert einstein

console.log(caesarDecipher(
  "MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG",
  19
));

// john archibald wheeler
console.log(caesarDecipher(
  "YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW",
  5
));

// charles darwin
console.log(caesarDecipher(
  "M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ",
  12
));


//GUI 

const messageContainer = document.querySelector("#messageContainer");
const messageForm = document.querySelector("#messageForm");
const submitButton = document.querySelector("button")

submitButton.addEventListener("click", (event) => {
  event.preventDefault()
  const formData = new FormData(messageForm);

  const { message, shift } = Object.fromEntries(formData);

  messageContainer.textContent = caesarDecipher(message.toUpperCase(), shift);
})
