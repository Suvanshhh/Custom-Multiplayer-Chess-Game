const express = require("express");
const socket = require("socket.io");
const http = require("http");
const { Chess } = require("chess.js");
const path = require("path");

const app = express();
const server = http.createServer(app);
const io = socket(server);

let chess = new Chess();
let players = {};
let currentPlayer = "w"; // 'w' for white, 'b' for black

app.set("view engine", "ejs");
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index", { title: "Chess Game" });
});

io.on("connection", function (uniquesocket) {
  console.log("A user connected: " + uniquesocket.id);

  if (!players.white) {
    players.white = uniquesocket.id;
    uniquesocket.emit("playerRole", "w");
    console.log(`Assigned white to ${uniquesocket.id}`);
  } else if (!players.black) {
    players.black = uniquesocket.id;
    uniquesocket.emit("playerRole", "b");
    console.log(`Assigned black to ${uniquesocket.id}`);
  } else {
    uniquesocket.emit("spectatorRole");
    console.log(`Assigned spectator to ${uniquesocket.id}`);
  }

  // Send the current board state to the newly connected client
  uniquesocket.emit("boardState", chess.fen());

  // Send player names (optional: can be enhanced with actual usernames)
  // You can implement a way to set and track player names if desired

  uniquesocket.on("disconnect", function () {
    console.log("A user disconnected: " + uniquesocket.id);
    if (uniquesocket.id === players.white) {
      delete players.white;
      io.emit("gameOver", "White has disconnected. Game Over.");
    } else if (uniquesocket.id === players.black) {
      delete players.black;
      io.emit("gameOver", "Black has disconnected. Game Over.");
    }
  });

  uniquesocket.on("move", (move) => {
    try {
      if (
        (chess.turn() === "w" && uniquesocket.id !== players.white) ||
        (chess.turn() === "b" && uniquesocket.id !== players.black)
      )
        return;

      const result = chess.move(move);
      if (result) {
        currentPlayer = chess.turn();
        io.emit("move", move); // Emit the move to all players
        io.emit("boardState", chess.fen()); // Emit the updated board state

        // Check for game over and notify clients
        if (chess.game_over()) {
          let message = "";
          if (chess.in_checkmate()) {
            message = chess.turn() === "w" ? "Black wins by checkmate!" : "White wins by checkmate!";
          } else if (chess.in_stalemate()) {
            message = "Game ended in a stalemate!";
          } else if (chess.in_threefold_repetition()) {
            message = "Game ended in a threefold repetition!";
          } else if (chess.insufficient_material()) {
            message = "Game ended due to insufficient material!";
          } else {
            message = "Game Over!";
          }
          io.emit("gameOver", message);
        }
      } else {
        console.log("Invalid move", move);
        uniquesocket.emit("Invalid move", move);
      }
    } catch (err) {
      console.log(err);
      uniquesocket.emit("Invalid move:", move);
    }
  });

  uniquesocket.on("restartGame", () => {
    if (uniquesocket.id === players.white || uniquesocket.id === players.black) {
      chess.reset();
      io.emit("boardState", chess.fen());
      io.emit("restart");
      io.emit("moveHistoryClear"); // Optional: clear move history on clients
      console.log("Game restarted by " + uniquesocket.id);
    }
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, function () {
  console.log(`Listening on port ${PORT}`);
});
