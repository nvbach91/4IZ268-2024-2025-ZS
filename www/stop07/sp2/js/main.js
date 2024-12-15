document.addEventListener("DOMContentLoaded", () => {
    const startBtn = document.getElementById("start-button");
    const colorButtons = {
        1: document.getElementById("yellow"), 
        2: document.getElementById("red"),    
        3: document.getElementById("blue"),   
        4: document.getElementById("green")  
    };

    let sequence = []; 
    let level = 0; 

    // ziskani sekvence z random
    async function fetchRandomSequence(count) {
        const url = `https://www.random.org/integers/?num=${count}&min=1&max=4&col=1&base=10&format=plain&rnd=new`;
        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error("Chyba při načítání dat.");
            }
            const text = await response.text();
            const numbers = text.trim().split("\n").map(Number);
            console.log("Random Sequence:", numbers);
            return numbers;
        } catch (error) {
            console.error("Random.org API Error:", error);
            return []; // prazdna sekvence kdyz se vyskytne chyba
        }
    }

    // rozsviceni barvy
    function flashButton(buttonId) {
        const button = colorButtons[buttonId];
        if (button) {
            button.style.opacity = "0.5"; 
            setTimeout(() => {
                button.style.opacity = "2"; 
            }, 500); 
        }
    }

    // prehrani cele sekvence
    function playSequence() {
        let index = 0;
        const interval = setInterval(() => {
            flashButton(sequence[index]); 
            index++;
            if (index >= sequence.length) {
                clearInterval(interval); 
            }
        }, 1000);
    }

    // event listener pro start
    startBtn.addEventListener("click", async () => {
        sequence = []; // reset sekvence
        level = 0; // reset urovne

        level++; // zvyseni urovne
        sequence = await fetchRandomSequence(level); // nacteni nahodne urovne
        playSequence(); // prehrani sekvence
    });
});
