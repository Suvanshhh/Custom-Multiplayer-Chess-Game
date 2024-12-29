const socket = io();
const chess = new Chess();
const boardElement = document.querySelector(".chessboard");

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

  if (playerRole === 'b') {
    boardElement.classList.add("flipped");
  } else {
    boardElement.classList.remove("flipped");
  }
};

const handleMove = (source, target) => {
  const move = {
    from: `${String.fromCharCode(97 + source.col)}${8 - source.row}`,
    to: `${String.fromCharCode(97 + target.col)}${8 - target.row}`,
    promotion: "q", // Assume promotion to queen for simplicity
  };

  if (chess.move(move)) {
    renderBoard();
    socket.emit("move", move); // Send the move to the server
  } else {
    console.log("Invalid move");
  }
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

// Listen for moves from the server
socket.on("move", (move) => {
  chess.move(move); // Update the local chess state
  renderBoard(); // Re-render the board
});

// Listen for player role assignment
socket.on("playerRole", function(role) {
  playerRole = role;
  renderBoard(); // Ensure board updates based on player role
});

// Listen for spectator role assignment
socket.on("spectatorRole", function() {
  playerRole = null;
  renderBoard(); // Ensure board updates for spectators
});

// Listen for board state from the server
socket.on("boardState", function(fen) {
  chess.load(fen); // Load the board state from FEN
  renderBoard(); // Re-render the board
});

// Initialize the board
renderBoard();


// Code for understanding how Socket.io handles connection event

// const socket = io();
// socket.emit("churan")
// socket.on("churan papdi", function(){
//     console.log("churan papdi recieved");
// })

//  Code explanation:
// As soon as this line runs an automatic request is sent to the backend and the user is connected to the server or
// // io.on("connection", function(uniquesocket){
//     console.log("connected");
// })

// And connected is printed.
// The socket.emit("churan ") line runs and it sends churan to the frontend which is catched by function: uniquesocket.on("churan", function () {
//     io.emit("churan papdi");
// });
// This is the function that is called when the server receives the churan request from the frontend
// And churan papdi is printed at backend.
// The server then sends churan papdi to the frontend which is catched by the function:
// socket.on("churan papdi", function(){
//     console.log("churan papdi recieved");
// });
// And churan papdi recieved is printed at frontend.
