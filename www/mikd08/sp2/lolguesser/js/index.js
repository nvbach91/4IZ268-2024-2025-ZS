const requestHeader = {
   "User-Agent":
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36 OPR/105.0.0.0",
   "Accept-Language": "cs-CZ,cs;q=0.9",
   "Accept-Charset": "application/x-www-form-urlencoded; charset=UTF-8",
   Origin: "https://developer.riotgames.com",
   "X-Riot-Token": "RGAPI-94f1441d-5aa9-4178-b4c4-22d14bf39ad9",
};

const champs = [];
const BASE_URL = 'https://ddragon.leagueoflegends.com';
const img = document.querySelector("#splashArt");
const champList = document.querySelector("#champList");
const boxSideLength = 150;
const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");
const canvasImg = new Image();
const body = document.querySelector("body");
const userInput = document.querySelector("#guess");
const guessBtn = document.querySelector("#guessBtn");
const randomBtn = document.querySelector("#random");
const error = document.querySelector("#error");
const loader = document.querySelector("#loader");
const streakCount = document.querySelector("#streakCount");
const guessedListContainer = document.querySelector("#guessedList");
const clear = document.querySelector("#clear");
const errorMsg = "Enter a guess";
const alias = {
   wukong: "monkey king",
};
let champsAmount = 0;

let champToGuess = "";
let imgHeight;
let imgWidth;
let offsetTop;
let offsetLeft;

const logo = document.querySelector("#trademark");
const lolguesser = document.querySelector("#lolguesser");
const randomPick = document.querySelector("#randomPick");

guessBtn.addEventListener("click", checkAnswer);
randomBtn.addEventListener("click", random);
clear.addEventListener("click", () => {
   localStorage.removeItem("guessedList");
   renderGuessedList();
});

init();

async function init() {
   await getChamps();
   renderGuessedList();
   if (localStorage.getItem("streak")) {
      streakCount.textContent = localStorage.getItem("streak");
   } else {
      streakCount.textContent = 0;
   }

   champsAmount = champs.length;

   champs.forEach((champ) => {
      for (const key in alias) {
         let newName = alias[key];
         if (cleanString(newName) == cleanString(champ.name)) {
            champ.name = key;
         }
      }
   });

   body.addEventListener("keyup", (e) => {
      if (e.key == "Enter") {
         if (e.target.classList.contains("champ")) {
            userInput.value = e.target.id;
            userInput.focus();
         }
         guessBtn.click();
      }
   });
   img.addEventListener("animationend", (e) => {
      img.classList.toggle(img.classList[0]);
      random();
   });

   userInput.addEventListener("input", (e) => {
      if (userInput.value == "") {
         champList.classList.remove("show");
         return;
      }
      champList.classList.add("show");
      let yPos = champList.getBoundingClientRect().top
      
      champList.style.height = window.innerHeight - yPos - 10 + "px"
      
      champList.innerHTML = "";
      let champsListHTML = ''; 
      champs.forEach((champ) => {
         if (cleanString(champ.name).includes(cleanString(userInput.value))) {
            champsListHTML += `       
            <div class="champ" id="${champ.name}" tabindex="0">
                <img src="${champ.icon}" alt="${champ.name}">
                <span>${champ.name}</span>
            </div>`
         //    champList.insertAdjacentHTML(
         //       "beforeend",
         //       `       
         //   <div class="champ" id="${champ.name}" tabindex="0">
         //       <img src="${champ.icon}" alt="${champ.name}">
         //       <span>${champ.name}</span>
         //   </div>`
         //    );
         }
      });
      champList.innerHTML = champsListHTML;
      if (document.querySelectorAll(".champ").length <= 0) {
         champList.classList.remove("show");
         return;
      }
      document.querySelectorAll(".champ").forEach((row) => {
         row.addEventListener("click", () => {
            userInput.value = row.id;
            checkAnswer();
         });
      });
   });

   random();
}

logo.addEventListener("click", (e) => {
   lolguesser.classList.toggle("displayNone");
   randomPick.classList.toggle("displayNone");
});

async function getChamps() {
   let response = await fetch(`${BASE_URL}/cdn/14.1.1/data/en_US/champion.json`, requestHeader);
   let data = await response.json();
   let champsData = data.data;
   for (const key in champsData) {
      let obj = {};
      obj.name = key;
      obj.icon = `${BASE_URL}/cdn/14.1.1/img/champion/${key}.png`;
      champs.push(obj);
   }
}

async function getChamp(name) {
   let response = await fetch(
      `${BASE_URL}/cdn/14.1.1/data/en_US/champion/${name}.json`,
      requestHeader
   );
   let data = await response.json();
   let champ = data.data[name];
   return champ;
}

async function getSkin(name) {
   let champ = await getChamp(name);
   let skins = champ.skins;
   return skins[Math.floor(Math.random() * skins.length)].num;
}


function renderImg(champName, id) {
   loader.classList.remove("load")
   let link = BASE_URL+"/cdn/img/champion/splash/" + champName + "_" + id + ".jpg"
   img.src = link
   img.alt = champName
   canvasImg.onload = () => {
      imgHeight = canvasImg.height;
      imgWidth = canvasImg.width;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      offsetTop = Math.ceil(Math.random() * (imgHeight - boxSideLength)) * -1;
      offsetLeft = Math.ceil(Math.random() * (imgWidth - boxSideLength)) * -1;
      ctx.drawImage(canvasImg, offsetLeft, offsetTop, imgWidth, imgHeight);
   };
   canvasImg.src = link;
}

function rescaleImg() {
   let rescale = 1.2;

   let oldCanvasWidth = canvas.width;
   if (canvas.width * rescale < imgWidth) {
      canvas.width = canvas.width * rescale;
      let canvasWidthChange = canvas.width - oldCanvasWidth;
      let oldCanvasHeight = canvas.height;
      canvas.height = canvas.height * rescale;
      let canvasHeightChange = canvas.height - oldCanvasHeight;
   
      offsetLeft = offsetLeft + canvasWidthChange < 0 ? offsetLeft + canvasWidthChange : 0;
      
      offsetTop = offsetTop + canvasHeightChange < 0 ? offsetTop + canvasHeightChange : (canvas.height - imgHeight) / 2;
      
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(canvasImg, offsetLeft, offsetTop, imgWidth, imgHeight);
   }
}

function chooseRandomChamp() {
   return champs[Math.floor(Math.random() * champs.length)];
}

async function random() {
   loader.classList.add("load")
   canvas.width = boxSideLength;
   canvas.height = boxSideLength;
   errorMsg.textContent = "";

   let chosenChamp = chooseRandomChamp();
   let chosenChampName = chosenChamp.name;
   champToGuess = chosenChampName;
   let chosenSkin = await getSkin(chosenChampName);
   renderImg(chosenChampName, chosenSkin);
}

function checkAnswer() {
   let champToGuessLowerCase = champToGuess.toLowerCase();
   let answerLowerCase = cleanString(userInput.value);

   let isCorrect = answerLowerCase == champToGuessLowerCase;
   if (answerLowerCase != "" && champToGuess != "") {
      WinLoss(isCorrect);
      error.textContent = "";
   } else {
      error.textContent = errorMsg;
   }
   userInput.value = "";
   userInput.dispatchEvent(new Event("input"))
}

function cleanString(string) {
   return string.toLowerCase().replace(/[\s'\.]/gi, "");
}

function WinLoss(isCorrect) {
   if (isCorrect) {
      champList.classList.remove("show");
      showFullImg();
      userInput.value = "";
      changeBoxShadow("green");
      localStorage.setItem("streak", parseInt(localStorage.getItem("streak") ?? 0) + 1);
      let json = localStorage.getItem("guessedList");
      let guessedList = json ? JSON.parse(json) : {};
      if (!guessedList[champToGuess]) {
         guessedList[champToGuess] = {
            icon: `${BASE_URL}/cdn/14.1.1/img/champion/${champToGuess}.png`,
            count: 1,
         };
      } else {
         guessedList[champToGuess].count++;
      }
      localStorage.setItem("guessedList", JSON.stringify(guessedList));
      renderGuessedList();
   } else {
      changeBoxShadow("red");
      rescaleImg();
      localStorage.setItem("streak", 0);
   }
   streakCount.textContent = localStorage.getItem("streak");
}

function showFullImg() {
   if (!img.classList.contains("show")) {
      img.classList.toggle("show");
   }
}

function changeBoxShadow(color) {
   canvas.style.setProperty("--clr", color);
   setTimeout((e) => {
      canvas.style.setProperty("--clr", "black");
   }, 1000);
}

window.addEventListener("click", (event) => {
   if (champList != event.target) {
      champList.classList.remove("show");
   }
});

function renderGuessedList() {
   let json = localStorage.getItem("guessedList");
   let guessedList = json ? JSON.parse(json) : {};
   let guessedListHTML = '';
   Object.keys(guessedList).reverse().forEach(champName => {
      guessedListHTML += `       
      <div class="guessedChamp">
          <img src="${guessedList[champName].icon}" alt="${champName}" width="50" height="50">
          <span style="margin-left: 10px;">${champName}</span>
          <span>(${guessedList[champName].count} times)</span>
          <span class="close">X</span>
      </div>`
   });
   

   guessedListContainer.innerHTML = guessedListHTML;
   document.querySelectorAll(".guessedChamp .close").forEach((row) => {
      row.addEventListener("click", () => {
         let champName = row.previousElementSibling.previousElementSibling.textContent;
         delete guessedList[champName];
         localStorage.setItem("guessedList", JSON.stringify(guessedList));
         renderGuessedList();
      });
   });
}