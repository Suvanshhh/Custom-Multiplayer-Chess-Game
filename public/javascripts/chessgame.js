const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");
const playNowBtn = document.getElementById("playNowBtn");
const restartBtn = document.getElementById("restartBtn");
const gameOverOverlay = document.getElementById("gameOver");
const loadingSpinner = document.getElementById("loadingSpinner");
const player1Name = document.getElementById("player1Name");
const player2Name = document.getElementById("player2Name");
const moveHistory = document.getElementById("moveHistory");
const turnIndicator = document.getElementById("turnIndicator");
const whiteDeadPieces = document.getElementById("whiteDeadPieces");
const blackDeadPieces = document.getElementById("blackDeadPieces");


let capturedByWhite = [];
let capturedByBlack = [];
let draggedPiece = null;
let sourceSquare = null;
let playerRole = null; // 'w' for white, 'b' for black

// Render the chessboard
const renderBoard = () => {
  const board = chess.board();
  boardElement.innerHTML = "";
  board.forEach((row, rowIndex) => {
    row.forEach((square, squareIndex) => {
      const squareElement = document.createElement("div");
      squareElement.classList.add(
        "square",
        (rowIndex + squareIndex) % 2 === 0 ? "light" : "dark"
      );

      squareElement.dataset.row = rowIndex;
      squareElement.dataset.col = squareIndex;

      if (square) {
        const pieceElement = document.createElement("div");
        pieceElement.classList.add(
          "piece",
          square.color === "w" ? "white" : "black"
        );
        if (square.type === "p") pieceElement.classList.add("pawn");
        pieceElement.innerText = getPieceUnicode(square);
        pieceElement.draggable = playerRole === square.color;

        pieceElement.addEventListener("dragstart", (e) => {
          if (pieceElement.draggable) {
            draggedPiece = pieceElement;
            sourceSquare = { row: rowIndex, col: squareIndex };
            e.dataTransfer.setData("text/plain", "");
          }
        });

        pieceElement.addEventListener("dragend", () => {
          draggedPiece = null;
          sourceSquare = null;
        });

        squareElement.appendChild(pieceElement);
      }

      squareElement.addEventListener("dragover", (e) => {
        e.preventDefault();
      });

      squareElement.addEventListener("drop", (e) => {
        e.preventDefault();
        if (draggedPiece) {
          const targetSquare = {
            row: parseInt(squareElement.dataset.row),
            col: parseInt(squareElement.dataset.col),
          };

          handleMove(sourceSquare, targetSquare);
        }
      });

      boardElement.appendChild(squareElement);
    });
  });

  if (playerRole === "b") {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q",
  };

  // Validate move without applying it
  const tempChess = new Chess(chess.fen());
  const result = tempChess.move(move);

  if (result) {
    socket.emit("move", move); // Send to server
  } else {
    console.log("Invalid move");
  }
};

function updateTurnIndicator() {
  if (chess.turn() === "w") {
    turnIndicator.textContent = "White's Turn";
    turnIndicator.classList.add("white");
    turnIndicator.classList.remove("black");
  } else {
    turnIndicator.textContent = "Black's Turn";
    turnIndicator.classList.add("black");
    turnIndicator.classList.remove("white");
  }
}

// Update move history
const updateMoveHistory = (move) => {
  const moveText = `${move.from.toUpperCase()} to ${move.to.toUpperCase()}`;
  const listItem = document.createElement("li");
  listItem.textContent = moveText;
  moveHistory.appendChild(listItem);
};

// Get the Unicode character for a chess piece
const getPieceUnicode = (square) => {
  const unicodePieces = {
    K: "♔",
    Q: "♕",
    R: "♖",
    B: "♗",
    N: "♘",
    P: "♙",
    k: "♚",
    q: "♛",
    r: "♜",
    b: "♝",
    n: "♞",
    p: "♟",
  };

  return unicodePieces[square.type] || "";
};

// Check game status for game over
const checkGameStatus = () => {
  if (chess.game_over()) {
    gameOverOverlay.textContent = chess.in_checkmate()
      ? `${playerRole === "w" ? "Black" : "White"} Wins!`
      : chess.in_stalemate()
      ? "Draw by Stalemate!"
      : chess.in_threefold_repetition()
      ? "Draw by Threefold Repetition!"
      : chess.insufficient_material()
      ? "Draw by Insufficient Material!"
      : "Game Over";
    gameOverOverlay.classList.add("show");
    restartBtn.classList.remove("hidden");
  }
};

// Event Listeners for Buttons
playNowBtn.addEventListener("click", () => {
  // Refresh the page or reset the game state
  window.location.reload();
});

restartBtn.addEventListener("click", () => {
  socket.emit("restartGame");
  window.location.reload();
});
function updateDeadPieces() {
  whiteDeadPieces.innerHTML = capturedByWhite
    .map(
      (piece) =>
        `<span class="dead-piece">${getPieceUnicode({
          type: piece,
          color: "b",
        })}</span>`
    )
    .join("");

  blackDeadPieces.innerHTML = capturedByBlack
    .map(
      (piece) =>
        `<span class="dead-piece">${getPieceUnicode({
          type: piece,
          color: "w",
        })}</span>`
    )
    .join("");
}

// Listen for moves from the server
socket.on("move", (move) => {
  const result = chess.move(move);
  if (result) {
    if (result.captured) {
      if (result.color === "w") {
        capturedByBlack.push(result.captured);
      } else {
        capturedByWhite.push(result.captured);
      }
      updateDeadPieces();
    }
    renderBoard();
    updateMoveHistory(move);
    checkGameStatus();
    updateTurnIndicator();
  }
});

// Listen for player role assignment
socket.on("playerRole", function (role) {
  playerRole = role;
  updatePlayerNames();
  renderBoard();
});

// Listen for spectator role assignment
socket.on("spectatorRole", function () {
  playerRole = null;
  updatePlayerNames();
  renderBoard();
});

// Listen for board state from the server
socket.on("boardState", function (fen) {
  chess.load(fen);
  renderBoard();
});

// Listen for game over from server (if implemented)
socket.on("gameOver", function (message) {
  gameOverOverlay.textContent = message;
  gameOverOverlay.classList.add("show");
  restartBtn.classList.remove("hidden");
});

// Listen for restart event
socket.on("restart", function () {
  window.location.reload();
});

// Update player names based on roles
const updatePlayerNames = () => {
  if (playerRole === "w") {
    player1Name.textContent = "You";
    player2Name.textContent = "Opponent";
  } else if (playerRole === "b") {
    player1Name.textContent = "Opponent";
    player2Name.textContent = "You";
  } else {
    player1Name.textContent = "Player 1";
    player2Name.textContent = "Player 2";
  }
};

// Initialize the board
renderBoard();
