const cells = document.querySelectorAll(".cell");
const resetBtn = document.querySelector(".reset");
const winMessage = document.querySelector(".win");
const player1Score = document.querySelector(".first");
const player2Score = document.querySelector(".second");
const overlay = document.querySelector(".overlay");
const playAgainBtn = document.querySelector(".play__again");
const turn = document.querySelector(".turn");
const winnerMessage = document.querySelector(".winner__message");
const gameHistoryEl = document.querySelector(".game-history");

let gameLimit = +prompt("enter limit of games");
let isX = true;
let player1Points = 0;
let player2Points = 0;
let gamesPlayed = 0;

let board = [
  [0, 0, 0],
  [0, 0, 0],
  [0, 0, 0]
];

let gameHistory = [];
resetBtn.addEventListener("click", resetGame);
playAgainBtn.addEventListener("click", () => {
  overlay.style.display = "none";
  winMessage.style = "display: none;";
  playAgainBtn.style = "display: none;";
  gameLimit = +prompt("enter limit of games");
})

cells.forEach(cell => {
  cell.addEventListener("click", handleClickCell);
});

function navigateToMove(moveIndex) {
  board = JSON.parse(JSON.stringify(gameHistory[moveIndex]));
  cells.forEach((cell, index) => {
    const row = Math.floor(index / 3);
    const column = index % 3;
    if (board[row][column] === 1) {
      cell.innerHTML = "X";
    } else if (board[row][column] === 2) {
      cell.innerHTML = "O";
    } else {
      board[row][column] = 0;
      cell.innerHTML = "";
    }
  });
  isX = moveIndex % 2 !== 0;
  turn.innerHTML = isX ? "X's Turn" : "O's Turn";
}

gameHistoryEl.innerHTML = "";
function handleClickCell(event) {
  const coordinates = event.target.dataset.index;
  const [row, column] = coordinates.split('').map(Number);


  if (board[row][column] !== 0) {
    return;
  }

  if (isX) {
    turn.innerHTML = "O's Turn";
    event.target.innerHTML = "X";
    board[row][column] = 1;
  } else {
    turn.innerHTML = "X's Turn";
    event.target.innerHTML = "O";
    board[row][column] = 2;
  }

  isX = !isX;
  checkWinner();
  checkDraw();

  gameHistory.push(JSON.parse(JSON.stringify(board)));
  
  const moveBtn = document.createElement("button");
    moveBtn.setAttribute("class", "move__btn");
    let player = isX ? "O" : "X";
    moveBtn.innerHTML = `${player} moved to row: ${board.indexOf(board[row])}, column: ${board.indexOf(board[column])}`;
    
    
    
    for (let i = 0; i < gameHistory.length; i++) {
      gameHistoryEl.appendChild(moveBtn);
      moveBtn.addEventListener("click", () => {
      navigateToMove(i);
    });

    
  }
  
  
}


function resetGame() {
  cells.forEach(cell => (cell.innerHTML = ""));
  board.forEach(row => row.fill(0));
  player1Points = 0;
  player2Points = 0;
  player1Score.innerHTML = player1Points;
  player2Score.innerHTML = player2Points;
  isX = true;
  gamesPlayed = 0;
  turn.innerHTML = "X's Turn";
  winnerMessage.innerHTML = "";

   const gameHistoryPanel = document.querySelector(".game-history");
   gameHistoryPanel.innerHTML = "";
   gameHistory = [];
}

function continueGame() {
  setTimeout(() => {
    cells.forEach(cell => (cell.innerHTML = ""));
    board.forEach(row => row.fill(0));
    isX = true;
    winnerMessage.innerHTML = "";
    const gameHistoryPanel = document.querySelector(".game-history");
    gameHistoryPanel.innerHTML = "";
    gameHistory = [];
  }, 500);
  
}

function checkWinner() {
  let isWinner = false;

  for (let i = 0; i < 3; i++) {
    if (
      board[i][0] !== 0 && board[i][0] === board[i][1] && board[i][1] === board[i][2]
    ) {
      isWinner = true;
      break;
    }

    if (
      board[0][i] !== 0 &&
      board[0][i] === board[1][i] &&
      board[1][i] === board[2][i]
    ) {
      isWinner = true;
      break;
    }
  }

  if (
    (board[0][0] !== 0 &&
      board[0][0] === board[1][1] &&
      board[1][1] === board[2][2]) ||
    (board[0][2] !== 0 &&
      board[0][2] === board[1][1] &&
      board[1][1] === board[2][0])
  ) {
    isWinner = true;
  }

  if (isWinner) {
    updateScore();
    gamesPlayed++;
    gameHistory = [];

    if (gamesPlayed === gameLimit) {
      setTimeout(() => {
        winMessage.style = "display: inline;";
        overlay.style.display = "flex";
        playAgainBtn.style = "display: block;";
        resetGame();
      }, 500);
    } else {
      setTimeout(() => {
        continueGame();
      }, 500);
    }
  }
}

function checkDraw() {
  let isDraw = true;
  for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
      if (board[i][j] === 0) {
        isDraw = false;
        break;
      }
    }
  }

  if (isDraw) {
    winnerMessage.innerHTML = "DRAW";
    gamesPlayed++;
    gameHistory = [];
    setTimeout(() => {
      if (gamesPlayed === gameLimit) {
        winMessage.style = "display: inline;";
        overlay.style.display = "flex";
        playAgainBtn.style = "display: block;";
        resetGame();
      } else {
        continueGame();}
    }, 2000);
  }
}
function updateScore() {
  if (isX) {
    player1Points++;
    player1Score.innerHTML = player1Points;
    winnerMessage.innerHTML = "O IS A WINNER";
  } else {
    player2Points++;
    player2Score.innerHTML = player2Points;
    winnerMessage.innerHTML = "X IS A WINNER";
  }
}