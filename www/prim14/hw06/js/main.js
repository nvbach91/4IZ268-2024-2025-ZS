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
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const shiftChar = (c, shift) => {
  shift = shift % alphabet.length;
  let index = alphabet.indexOf(c.toUpperCase());
  if (index === -1) return c;
  let shiftedIndex = (index - shift + alphabet.length) % alphabet.length;
  return alphabet[shiftedIndex];
};

const shiftString = (str, shift) => {
  return str
    .split("")
    .map((c) => {
      return shiftChar(c, shift);
    })
    .join("");
};

const caesarDecipher = (cipherText, usedKey, logText = true) => {
  const shift = Number(usedKey);
  const words = cipherText.split(" ");
  const decipheredWords = words.map((word) => {
    return shiftString(word, shift);
  });
  const finalText = decipheredWords.join(" ");

  if (logText) {
    console.log(finalText);
    return;
  }

  return finalText;
};

// albert einstein
caesarDecipher(
  "MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG",
  19
);

// john archibald wheeler
caesarDecipher(
  "YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW",
  5
);

// charles darwin
caesarDecipher(
  "M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ",
  12
);

const decipherButton = document.getElementById("decipherButton");

decipherButton.addEventListener("click", () => {
  const cipherText = document.getElementById("encryptedText").value;
  const usedKey = document.getElementById("cipherKey").value;

  const res = caesarDecipher(cipherText, usedKey, false);

  const resultElement = document.getElementById("decipheredText");
  resultElement.textContent = res;
});
