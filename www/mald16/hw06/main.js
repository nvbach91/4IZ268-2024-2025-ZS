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
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

const shiftChar = (c, shift) => {
	const index = alphabet.indexOf(c);
	if (index === -1) return c;
	const shiftedIndex = (index - shift + 26) % 26;
	return alphabet.charAt(shiftedIndex);
};

const shiftString = (str, shift) => {
	return str
		.split("")
		.map((char) => shiftChar(char, shift))
		.join("");
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

var isResultVisible = false;

document.getElementById("submit").addEventListener("click", () => {
	const cipherText = document.getElementById("input").value.toUpperCase();
	const key = parseInt(document.getElementById("key").value, 10);
	if (isNaN(key)) {
		alert("Please enter a valid key number.");
		return;
	}

	if (!isResultVisible) {
		document.getElementById("result-box").style.display = "block";
	}
	const decryptedText = caesarDecipher(cipherText, key);
	document.getElementById("result").textContent = decryptedText;
});
