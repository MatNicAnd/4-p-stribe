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

function initGame() {
  for (let i = 0; i < 6; i++) {
    let row = board.insertRow();
    for (let j = 0; j < 7; j++) {
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

function placeDisc(col) {
  for (let row = 5; row >= 0; row--) {
    if (!gameArray[row][col]) {
      gameArray[row][col] = currentPlayer;
      const cell = board.rows[row].cells[col];
      cell.classList.add(`player${currentPlayer}`);
      cell.classList.add("animated"); // Tilføjelse af animationen her
      setTimeout(() => {
        cell.classList.remove("animated"); // Fjern animationen efter den er færdig
      }, 500);
      turnCount++;
      checkWin(row, col);
      currentPlayer = currentPlayer === 1 ? 2 : 1;
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
