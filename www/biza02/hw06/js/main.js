
const style = document.createElement('style');
style.innerHTML = `
    /* Styl pro hlavní stránku */
    body {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 100vh;
        margin: 0;
        font-family: Arial, sans-serif;
        background-color: #f4f4f4;
    }

    /* Kontejner pro formulář */
    form {
        background-color: #e7e7e7;
        padding: 20px;
        border-radius: 8px;
        box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        width: 300px;
        text-align: center;
    }

    /* Nadpis */
    h1 {
        color: #333;
        font-size: 24px;
        margin-bottom: 10px;
    }

    /* Vstupní pole */
    input[type="text"], input[type="number"] {
        width: 100%;
        padding: 10px;
        margin: 10px 0;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }

    /* Tlačítko Decipher */
    button {
        background-color: #4CAF50;
        color: white;
        padding: 10px 20px;
        margin-top: 10px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 16px;
    }

    button:hover {
        background-color: #45a049;
    }

    /* Výstupní oblast */
    #output {
        margin-top: 15px;
        font-size: 16px;
        color: #333;
    }
`;
document.head.appendChild(style);

// Kód pro Caesarovu šifru
const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
    if (alphabet.indexOf(c) === -1) return c; // Pokud znak není v abecedě, vrátíme ho beze změny
    const shiftedIndex = (alphabet.indexOf(c) - shift + 26) % 26;
    return alphabet.charAt(shiftedIndex);
};

const shiftString = (str, shift) => {
    let result = '';
    for (let i = 0; i < str.length; i++) {
        result += shiftChar(str.charAt(i), shift);
    }
    return result;
};

const caesarDecipher = (cipherText, usedKey) => {
    return shiftString(cipherText, usedKey);
};

// Funkce pro zpracování dešifrování
function handleDecipher() {
    const cipherText = document.getElementById('cipherText').value;
    const key = parseInt(document.getElementById('key').value);
    const decryptedText = caesarDecipher(cipherText, key);
    document.getElementById('decryptedText').innerText = decryptedText;
}
