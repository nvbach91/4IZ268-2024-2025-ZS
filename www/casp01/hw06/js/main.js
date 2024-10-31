const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const shiftString = (c, shift) => {
    if (alphabet.indexOf(c)!=-1){
        currIndex = alphabet.indexOf(c);
    }else if(alphabet.toLocaleLowerCase().indexOf(c)!=-1){
        currIndex = alphabet.toLocaleLowerCase().indexOf(c);
    }else{
        return -1;
    }
    newIndex = currIndex - shift;
    if(newIndex<0){
        newIndex = newIndex+26;
    }
    return newIndex;
};

const caesarDecipher = (cipherText, usedKey) => {
    let decipherText = "";
    for (let i = 0; i < cipherText.length; i++){
        const c = shiftString(cipherText[i],usedKey);
        if (c != -1){
            decipherText = decipherText + alphabet[c];
        }else{
            decipherText = decipherText + cipherText[i];
        }
    }
    console.log(decipherText);
    return decipherText;
};

const decipherForm = document.querySelector("#deci");
const outputArea = document.querySelector("#output");
decipherForm.addEventListener("submit", (event)=>{
    event.preventDefault();
    const formData = new FormData(decipherForm);
    const text = formData.get("text");
    const key = Number(formData.get("key"));
    const res = caesarDecipher(text,key);
    console.log([text,key]);
    outputArea.textContent="Result: " + res;
    //console.log([text,key]);
});



// albert einstein
caesarDecipher("MPH MABGZL TKX BGYBGBMX: MAX NGBOXKLX TGW ANFTG LMNIBWBMR; TGW B'F GHM LNKX TUHNM MAX NGBOXKLX. - TEUXKM XBGLMXBG", 19);

// john archibald wheeler
caesarDecipher("YMJWJ NX ST QFB JCHJUY YMJ QFB YMFY YMJWJ NX ST QFB. - OTMS FWHMNGFQI BMJJQJW", 5);

// charles darwin
caesarDecipher("M YMZ ITA PMDQE FA IMEFQ AZQ TAGD AR FUYQ TME ZAF PUEOAHQDQP FTQ HMXGQ AR XURQ. ― OTMDXQE PMDIUZ", 12);
