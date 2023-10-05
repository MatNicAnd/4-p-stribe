const board = document.getElementById("gameBoard");
const currentPlayerEl = document.getElementById("currentPlayer");
const winnerEl = document.getElementById("winner");
const gameTimeEl = document.getElementById("gameTime");
const turnCountEl = document.getElementById("turnCount");

const gameStatsModal = document.getElementById("gameStatsModal");

let gameArray = Array(6)
  .fill()
  .map(() => Array(7).fill(null));
let currentPlayer = 1;
let turnCount = 0;
let gameStartTimestamp;
let isGameComplete = false;

let playerCount = parseInt(localStorage.getItem("playerCount"), 10) || 2; // default value

const GIF_DURATION = 1100; // 1,1 seconds, adjust if the gif duration is different

function initGame() {
  const rows =
    playerCount === 3 ? Math.ceil(6 * 1.5) : playerCount === 4 ? 6 * 2 : 6;
  const cols =
    playerCount === 3 ? Math.ceil(7 * 1.5) : playerCount === 4 ? 7 * 2 : 7;

  gameArray = Array(rows)
    .fill()
    .map(() => Array(cols).fill(null));

  for (let i = 0; i < rows; i++) {
    let row = board.insertRow();
    for (let j = 0; j < cols; j++) {
      let cell = row.insertCell();
      cell.addEventListener("click", () => placeDisc(j));
    }
  }
  gameStartTimestamp = new Date().getTime();
  timerInterval = setInterval(updateTime, 1000);
}

/* function updateStarfishGif() {
  const starfishEl = document.querySelector(
    'img[src*="Starfish_Default_web.gif"]'
  );
  if (!starfishEl) return;

  let newGifSrc = "";
  switch (currentPlayer) {
    case 1:
      newGifSrc = "img/starfish_animations/Starfish_Player_1_web.gif";
      break;
    case 2:
      newGifSrc = "img/starfish_animations/Starfish_Player_2_web.gif";
      break;
    case 3:
      newGifSrc = "img/starfish_animations/Starfish_Player_3_web.gif";
      break;
    case 4:
      newGifSrc = "img/starfish_animations/Starfish_Player_4_web.gif";
      break;
  }

  if (newGifSrc) {
    starfishEl.src = newGifSrc;
    setTimeout(() => {
      starfishEl.src = "img/starfish_animations/Starfish_Default_web.gif";
    }, GIF_DURATION);
  }
} */

function updateStarfishGif() {
  const starfishEl = document.querySelector(
    'img[src*="Starfish_Default.gif"]'
  );
  if (!starfishEl) return;

  let newGifSrc = "";
  switch (currentPlayer) {
    case 1:
      newGifSrc = "img/starfish_animations/Starfish_Player_1.gif";
      break;
    case 2:
      newGifSrc = "img/starfish_animations/Starfish_Player_2.gif";
      break;
    case 3:
      newGifSrc = "img/starfish_animations/Starfish_Player_3.gif";
      break;
    case 4:
      newGifSrc = "img/starfish_animations/Starfish_Player_4.gif";
      break;
  }

  if (newGifSrc) {
    // Introduce a delay of 1.5 seconds (1500 milliseconds) before updating to the new GIF
    setTimeout(() => {
      starfishEl.src = newGifSrc;

      // Show the new GIF for 2.6 seconds (2600 milliseconds)
      setTimeout(() => {
        // Reset to default GIF after 2.6 seconds
        starfishEl.src = "img/starfish_animations/Starfish_Default.gif";
      }, 2600);
    }, 700);
  }
}

function updateTime() {
  //få fat i et felt på modal hvor man gerne ville skrive ud hvor lang tid spillet tog
  //der er 5 mulige scenariere for hvilken modal der udløses så derfor hentes der 5 felter
  let totalTime = document.getElementById("finalTime");
  let totalTime2 = document.getElementById("finalTime2");
  let totalTime3 = document.getElementById("finalTime3");
  let totalTime4 = document.getElementById("finalTime4");
  let totalTime5 = document.getElementById("finalTime5");
  //initialisere tiden til 0 sekunder brugt når spillet starter
  let elapsedSeconds = 0;

  //tæl i sekunder mens spillet erigang
  if (isGameComplete != true) {
    //elapsed seconds is updated here
    elapsedSeconds = Math.floor(
      (new Date().getTime() - gameStartTimestamp) / 1000
    );
    //this is the correct time
    gameTimeEl.textContent = elapsedSeconds;
  }

  //print den samlede tid spillet tog i sekunder samt antal ture brugt
  totalTime.textContent = `Spillet varede ${gameTimeEl.textContent} sekunder og spillet sluttede efter ${turnCountEl.textContent} runde`;
  totalTime2.textContent = `Spillet varede ${gameTimeEl.textContent} sekunder og spillet sluttede efter ${turnCountEl.textContent} runde`;
  totalTime3.textContent = `Spillet varede ${gameTimeEl.textContent} sekunder og spillet sluttede efter ${turnCountEl.textContent} runde`;
  totalTime4.textContent = `Spillet varede ${gameTimeEl.textContent} sekunder og spillet sluttede efter ${turnCountEl.textContent} runde`;
  totalTime5.textContent = `Spillet varede ${gameTimeEl.textContent} sekunder og spillet sluttede efter ${turnCountEl.textContent} runde`;

  //stop timer når spillet er afgjort (når en vinder eller spillet bliver uafgjort)
  if (isGameComplete == true) {
    clearInterval(timerInterval);
  }
}

// Game sound effects
const dropSound = new Audio("sounds/onHit.mp3");
const fallingSound = new Audio("sounds/onTravel.mp3");
dropSound.volume = 0.3; // juster dette efter behov
fallingSound.volume = 0.3; // juster dette efter behov
let playersCompletedTurn = 0; //hold styr på hvilke spillere der har udført deres tur

function placeDisc(col) {
  const rows = gameArray.length;
  for (let row = rows - 1; row >= 0; row--) {
    if (!gameArray[row][col]) {
      gameArray[row][col] = currentPlayer;
      const cell = board.rows[row].cells[col];
      cell.classList.add(`player${currentPlayer}`);
      cell.classList.add("animated");
      cell.style.animationName = `slideDown${row}`; // Vælg animation baseret på rækkenummer

      // Start "falde" lyden
      fallingSound.play();

      // Stop "falde" lyden og afspil "drop" lyd, når animationen er færdig
      setTimeout(() => {
        fallingSound.pause();
        fallingSound.currentTime = 0;
        dropSound.play();
        cell.classList.remove("animated");
      }, 500);

      playersCompletedTurn++;

      if (playersCompletedTurn === playerCount) {
        //når alle spillere har haft deres tur så går turnCount op
        turnCount++;

        //nulstil counteren når alle spillere har gennemført deres tur
        playersCompletedTurn = 0;
      }
      checkWin(row, col);
      currentPlayer = (currentPlayer % playerCount) + 1;
      currentPlayerEl.textContent = currentPlayer;
      updateStarfishGif(); // Update the starfish gif based on the currentPlayer
      //print antal ture på skærmen
      turnCountEl.textContent = turnCount;
      return;
    }
  }
}

initGame();

function checkWin(row, col) {
  // Tjek for vinder eller uafgjort her...
  // Vi opretter en liste af retninger, vi skal tjekke for fire på stribe.
  const directions = [
    { row: -1, col: 0 }, // lodret (opad)
    { row: 0, col: 1 }, // vandret (højre)
    { row: 1, col: 1 }, // diagonalt (nedad mod højre)
    { row: 1, col: -1 }, // diagonalt (nedad mod venstre)
  ];

  const gameStats = {
    gameTime: gameTimeEl.textContent,
    turnCount: turnCountEl.textContent
  }
  
  // Vi gemmer den aktuelle spiller, som vi vil tjekke for en vinder.
  const playerToCheck = gameArray[row][col];
  // Nu går vi igennem hver retning for at se, om der er fire på stribe.
  for(const dir of directions)
  {
      let count = 1; // Vi starter med en, da vi allerede har den aktuelle brik.
      // Tjek i positiv retning (fremad i retningen).
      for(let i = 1; i < 4; i++) 
      {
          const newRow = row + dir.row * i;
          const newCol = col + dir.col * i;
          // Vi tjekker, om den nye position er inden for brættet og om brikken er den samme som den aktuelle spillers.
          if(
            newRow >= 0 &&
            newRow < gameArray.length &&
            newCol >= 0 &&
            newCol < gameArray[0].length &&
            gameArray[newRow][newCol] === playerToCheck
          ) {
              count++;
          }
          else {
            break;
          }
      }
      // Tjek i negativ retning (baglæns i retningen).
      for(let i = 1; i < 4; i++) {
          const newRow = row - dir.row * i;
          const newCol = col - dir.col * i;
          if (
            newRow >= 0 &&
            newRow < gameArray.length &&
            newCol >= 0 &&
            newCol < gameArray[0].length &&
            gameArray[newRow][newCol] === playerToCheck
          ) {
          count++;
          }
          else {
            break;
          }
      }
      // Hvis vi har fundet fire brikker på stribe i en retning, har vi en vinder.
      if(count >= 4) {
          //hver spiller får en unik predefineret victory screen og checkes der hvilken spiller der vandt
          //og så åbnes der en bestemt modal der ønsker spilleren tilykke med sejren
          if(playerToCheck === 1){
              //når spiller 1 har 4 på stribe sættes isGameComplete til true
              isGameComplete = true;
              storeGameStats(gameStats);
              player1WinsModal();
          }
          else if(playerToCheck === 2){
              //når spiller 2 har 4 på stribe sættes isGameComplete til true
              isGameComplete = true;
              storeGameStats(gameStats);
              player2WinsModal();
          }
          else if(playerToCheck === 3){
              //når spiller 2 har 4 på stribe sættes isGameComplete til true
              isGameComplete = true;
              storeGameStats(gameStats);
              player3WinsModal();
          }
          else if(playerToCheck === 4){
              //når spiller 2 har 4 på stribe sættes isGameComplete til true
              isGameComplete = true;
              storeGameStats(gameStats);
              player4WinsModal();
          }
      }
      console.log(gameStats);
  }
  //hvis pladen bliver helt fyldt med brikker så ender spillet uafgjort
  if(turnCount === gameArray.length * gameArray[0].length)
  {
      //IsGameComplete sættes til true hvis spillet ender uafgjort
      isGameComplete = true;
      storeGameStats(gameStats);
      drawModal();
  }
}
//her laves en modal som vises hvis spillet bliver uafgjort
function drawModal() {
  //hent modal samt dens lukke knap. Modallen er skjult før denne function kaldes
  const drawModal = document.getElementById("drawModal");
  const closeDrawModalButton = document.querySelector(".closeModal");
  //fremvis modal
  drawModal.style.display = "block";

  function closeModal() {
    //modal sættes til at være skjult når brugeren trykker på nyt spil knappen eller luk knappen
    drawModal.style.display = "none";
    window.location.href = "start.html";
  }

  //event listener på siden der lytter efter et click event
  closeDrawModalButton.addEventListener("click", closeModal);
  window.addEventListener("click", function (event) {
    //hvis det var denne bestemte modal der triggered et click event så kald closeModal()
    if (event.target === drawModal) {
      //lukker modallen kaldet drawModal
      closeModal();
    }
  });

  //En knap der lukker modallen og navigerer spillerne tilbage til hovedmenuen
  const closeButton = document.querySelector(".closeModalButton3");
  closeButton.onclick = closeModal;
}
//en modal til når spiller 1 vinder
function player1WinsModal() {
  const player1WinsModal = document.getElementById("player1WinsModal");
  const closePlayer1WinsModalButton = document.querySelector(".closeModal1");

  player1WinsModal.style.display = "block";

  function closeModal1() {
    //invoke this function when clicking a button in html
    player1WinsModal.style.display = "none";
    window.location.href = "start.html";
  }

  closePlayer1WinsModalButton.addEventListener("click", closeModal1);
  window.addEventListener("click", function (event) {
    if (event.target === player1WinsModal) {
      closeModal1();
    }
  });

  const closeButton = document.querySelector(".closeModalButton");
  closeButton.onclick = closeModal1;
}
//en modal til når spiller 2 vinder
function player2WinsModal() {
  const player2WinsModal = document.getElementById("player2WinsModal");
  const closePlayer2WinsModal = document.querySelector(".closeModal2");

  player2WinsModal.style.display = "block";

  function closeModal2() {
    player2WinsModal.style.display = "none";
    window.location.href = "start.html";
  }

  closePlayer2WinsModal.addEventListener("click", closeModal2);
  window.addEventListener("click", function (event) {
    if (event.target === player2WinsModal) {
      closeModal2();
    }
  });

  const closeButton = document.querySelector(".closeModalButton2");
  closeButton.onclick = closeModal2;
}
//en modal til når spiller 3 vinder
function player3WinsModal() {
  const player3WinsModal = document.getElementById("player3WinsModal");
  const closePlayer3WinsModal = document.querySelector(".closeModal3");

  player3WinsModal.style.display = "block";

  function closeModal3() {
    player3WinsModal.style.display = "none";
    window.location.href = "start.html";
  }

  closePlayer3WinsModal.addEventListener("click", closeModal3);
  window.addEventListener("click", function (event) {
    if (event.target === player3WinsModal) {
      closeModal3();
    }
  });

  const closeButton = document.querySelector(".closeModalButton4");
  closeButton.onclick = closeModal3;
}
//en modal til når spiller 4 vinder
function player4WinsModal() {
  const player4WinsModal = document.getElementById("player4WinsModal");
  const closePlayer4WinsModal = document.querySelector(".closeModal4");

  player4WinsModal.style.display = "block";

  function closeModal4() {
    player4WinsModal.style.display = "none";
    window.location.href = "start.html";
  }

  closePlayer4WinsModal.addEventListener("click", closeModal4);
  window.addEventListener("click", function (event) {
    if (event.target === player4WinsModal) {
      closeModal4();
    }
  });

  const closeButton = document.querySelector(".closeModalButton5");
  closeButton.onclick = closeModal4;
}
//store de seneste 3 spil
function storeGameStats(gameStats) {
  // Retrieve existing game history from local storage
  let gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];

  // Add the new game stats to the beginning of the array (most recent game first)
  gameHistory.unshift(gameStats);

  // Ensure that only the three most recent games are stored
  if (gameHistory.length > 3) {
    gameHistory.pop(); // Remove the oldest game stats
  }

  // Store the updated game history back in local storage
  localStorage.setItem('gameHistory', JSON.stringify(gameHistory));
}

function displayGameHistory() {
  //vi henter fra local storage
  const gameHistory = JSON.parse(localStorage.getItem('gameHistory')) || [];
  //her vil historik displayes
  const history = document.getElementById('gameHistoryList');

  history.innerHTML = '';

  // vi skal bruge et li for hver historiks spil
  gameHistory.forEach((gameStats, index) => {
    const listItem = document.createElement('li');
    listItem.textContent = `Spil ${index + 1}: Varighed ${gameStats.gameTime} sekunder. Antal runder: ${gameStats.turnCount}`;
    history.appendChild(listItem);
  });
  }

document.addEventListener('DOMContentLoaded', function(){
//function til at kalde på game history
  displayGameHistory();
})

function openGameStatsModal() {
  gameStatsModal.style.display = "block";
  // invoke displayGameHistory for at opdatere historik
  displayGameHistory();
}

// Get the closeGameStatsModal and openGameStats elements
const closeGameStatsModal = document.querySelector(".closeGameStatsModal");
const openGameStats = document.getElementById("openGameStatsModal");

function closeStatsModal() {
  gameStatsModal.style.display = "none";
  window.location.href = "start.html";
}

// Add event listeners directly to the elements
openGameStats.addEventListener("click", openGameStatsModal);
closeGameStatsModal.addEventListener("click", closeStatsModal);
window.addEventListener("click", function (event) {
  if (event.target === gameStatsModal) {
    closeStatsModal();
  }
});