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

function checkWin(row, col) {
  // Tjek for vinder eller uafgjort her...
  // For enkelheds skyld vil jeg ikke tilføje hele vinderlogikken her, men det kan tilføjes efter behov.
}

initGame();
