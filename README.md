
# Custom Multiplayer Chess Game

<p align="center"><img src="https://i.postimg.cc/jSMQQFn0/custom-multiplayer-chess-game-production-up-railway-app.png" alt="project-image"></p>

This is a custom-built multiplayer chess game that allows two players to play against each other in real-time. The game uses **Socket.IO** for real-time communication, **Chess.js** for game logic, and **Tailwind CSS** for frontend styling. It provides a fully functional chessboard, including standard chess rules, moves, and player interactions.

## Features

- **Multiplayer Support**: Two players can play against each other in real-time.
- **Chess Logic**: Game logic powered by Chess.js, enforcing chess rules (e.g., check, checkmate, castling).
- **Real-Time Communication**: Socket.IO enables instant moves between players.
- **Interactive Chessboard**: Users can drag and drop pieces on the board.
- **User Authentication**: Simple player identification for each game session.
- **Responsive Design**: Mobile-friendly chessboard with Tailwind CSS.
- **Game History**: Track and view moves made during the game.

## Tech Stack

- **Backend**: Node.js, Express
- **Real-Time Communication**: Socket.IO
- **Chess Logic**: Chess.js
- **Frontend**: EJS, Tailwind CSS
- **Deployment**: Railway

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/Suvanshhh/Custom-Multiplayer-Chess-Game.git
   ```

2. Navigate to the project folder:

   ```bash
   cd Custom-Multiplayer-Chess-Game
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Create a `.env` file in the root directory for environment variables (if needed):

   ```bash
   EXPRESS_SESSION_SECRET=your_session_secret
   ```

5. Start the development server:

   ```bash
   npm start
   ```

   The game will be accessible at `http://localhost:3000`.

## Usage

- Navigate to the homepage to start a new game or join an existing game.
- The chessboard allows for drag-and-drop movement of chess pieces.
- Players can chat and send messages during the game.
- Real-time updates will be received as the opponent makes a move.

## Game Flow

- A player can create a new game or join an existing game.
- Players take turns making moves, and the board updates in real-time.
- The game ends when there is a checkmate or stalemate, and the winner is displayed.

## Routes

- `/`: The landing page where players can start or join a game.
- `/game/:id`: The active game page where the game is played.
- `/game/board`: Displays the chessboard for the current game.
- `/chat`: A simple real-time chat room for players.

## Contributing

1. Fork the repository.
2. Create your feature branch (`git checkout -b feature-name`).
3. Commit your changes (`git commit -am 'Add new feature'`).
4. Push to the branch (`git push origin feature-name`).
5. Open a pull request.


<h2>Project Screenshots:</h2>

<img src="https://i.postimg.cc/jSMQQFn0/custom-multiplayer-chess-game-production-up-railway-app.png" alt="project-screenshot" width="400" height="400/">

<img src="https://i.postimg.cc/595zSRD7/custom-multiplayer-chess-game-production-up-railway-app-2.png" alt="project-screenshot" width="400" height="400/">
