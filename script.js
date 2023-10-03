const board = document.getElementById("gameBoard");
const currentPlayerEl = document.getElementById("currentPlayer");
const winnerEl = document.getElementById("winner");
const gameTimeEl = document.getElementById("gameTime");
const turnCountEl = document.getElementById("turnCount");

let gameArray = Array(6)
  .fill()
  .map(() => Array(7).fill(null));
let currentPlayer = 1;
let turnCount = 0;
let gameStartTimestamp;

let playerCount = parseInt(localStorage.getItem("playerCount"), 10) || 2; // default value

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
  setInterval(updateTime, 1000);
}

function updateTime() {
  const elapsedSeconds = Math.floor(
    (new Date().getTime() - gameStartTimestamp) / 1000
  );
  gameTimeEl.textContent = elapsedSeconds;
}

// Game sound effects
const dropSound = new Audio("sounds/onHit.mp3");
const fallingSound = new Audio("sounds/onTravel.mp3");
dropSound.volume = 0.3; // juster dette efter behov
fallingSound.volume = 0.3; // juster dette efter behov

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

      turnCount++;
      checkWin(row, col);
      currentPlayer = (currentPlayer % playerCount) + 1;
      currentPlayerEl.textContent = currentPlayer;
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
      { row: 1, col: -1 } // diagonalt (nedad mod venstre)
  ];
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
            newRow < 6 &&
            newCol >= 0 &&
            newCol < 7 &&
            gameArray[newRow][newCol] === playerToCheck
          ) {
              count++;
          }
      }
      // Tjek i negativ retning (baglæns i retningen).
      for(let i = 1; i < 4; i++) {
          const newRow = row - dir.row * i;
          const newCol = col - dir.col * i;
          if (
            newRow >= 0 &&
            newRow < 6 &&
            newCol >= 0 &&
            newCol < 7 &&
            gameArray[newRow][newCol] === playerToCheck
          ) {
          count++;
          }
      }
      // Hvis vi har fundet fire brikker på stribe i en retning, har vi en vinder.
      if(count >= 4) {
          //hver spiller får en unik predefineret victory screen og checkes der hvilken spiller der vandt
          //og så åbnes der en bestemt modal der ønsker spilleren tilykke med sejren
          if(playerToCheck === 1){
              player1WinsModal();
          }
          else if(playerToCheck === 2){
              player2WinsModal();
          }
      }
  }
  //hvis der går 42 runder (note skal ændres afhængigt af hvor mange spillere der er da board størrelsen
  //ville ændre sig ift hvor mange spillere der spiller med) så hvis uafgjort skærmen
  if(turnCount === 42)
  {
      drawModal();
  }
}
//her laves en modal som vises hvis spillet bliver uafgjort
function drawModal() {
  const drawModal = document.getElementById("drawModal");
  const closeDrawModalButton = document.querySelector(".closeModal");

  drawModal.style.display = "block";

  function closeModal() {
      drawModal.style.display = "none";
      window.location.href = "start.html";
  }

  closeDrawModalButton.addEventListener("click", closeModal);
  window.addEventListener("click", function (event) {
  if(event.target === drawModal) {
      closeModal();
  }
  });

  //Use this to close the modal via a button and navigate to the title screen
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
  if(event.target === player1WinsModal) {
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
  if(event.target === player2WinsModal) {
      closeModal2();
  }
  });

  const closeButton = document.querySelector(".closeModalButton2");
  closeButton.onclick = closeModal2;
}