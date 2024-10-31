const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftChar = (c, shift) => {
    if (alphabet.includes(c)) {
        let originalIndex = alphabet.indexOf(c);
        let shiftedIndex = (originalIndex - shift + 26) % 26;
        return alphabet.charAt(shiftedIndex);
    }
    return c;
};

const shiftString = (str, shift) => {
    return str.split('').map(char => shiftChar(char, shift)).join('');
};

const caesarDecipher = (cipherText, usedKey) => {
    return shiftString(cipherText.toUpperCase(), usedKey);
};

// Event listener for the button click
document.getElementById('decipherButton').addEventListener('click', () => {
    const cipherText = document.getElementById('cipherText').value;
    const usedKey = parseInt(document.getElementById('key').value, 10);
    const result = caesarDecipher(cipherText, usedKey);
    document.getElementById('output').textContent = result;
});
