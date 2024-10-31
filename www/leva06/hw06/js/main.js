const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Function to shift a character based on the shift value
const shiftChar = (char, shift) => {
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (!isUpper && !isLower) {
        return char; // Return non-alphabet characters unchanged
    }

    const base = isUpper ? 'A' : 'a';
    const letterIndex = char.charCodeAt(0) - base.charCodeAt(0);

    // Calculate shifted index with wrapping
    const charShifted = (letterIndex + shift + 26) % 26; // Shift to the right for encoding
    return String.fromCharCode(charShifted + base.charCodeAt(0));
};

// Function to shift an entire string
const shiftString = (str, shift) => {
    return str.split('').map(char => shiftChar(char, shift)).join('');
};

// Main function to encode and decode the Caesar cipher
const caesarShift = (inputText, shiftValue) => {
    return shiftString(inputText, shiftValue);
};

// Form handling
const cipherForm = document.querySelector('#cipher-form');
const resultContainer = document.querySelector('#cipher-results');

cipherForm.addEventListener('submit', (event) => {
    event.preventDefault(); // Prevent form submission

    const formData = new FormData(cipherForm);
    const inputText = formData.get('cipher-text');
    const shiftValue = Number(formData.get('cipher-shift'));

    // Validate shift value
    if (isNaN(shiftValue)) {
        alert('Please enter a valid shift value.');
        return;
    }

    const decryptedMsg = caesarShift(inputText, shiftValue);
    resultContainer.textContent = `Result: ${decryptedMsg}`;
});

