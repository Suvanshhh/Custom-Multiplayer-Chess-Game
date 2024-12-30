**Custom Multiplayer Chess Game**  
Developed a full-stack, real-time chess application featuring interactive gameplay and efficient WebSocket communication.  

- **Backend Development**:  
  - Designed and implemented the server using **Node.js** with **Express** and **Socket.io** for WebSocket communication.  
  - Utilized the **Chess.js** library to manage game state, enforce rules, and validate player moves.  
  - Configured the application to dynamically assign roles (white/black/spectator) based on game state and connection events.  
  - Implemented robust event handling for moves, ensuring game state synchronization and smooth gameplay.  
  - Deployed **EJS** templating for dynamic HTML rendering and served static assets efficiently.  

- **Frontend Development**:  
  - Built a responsive chessboard UI with **HTML5 Drag-and-Drop API** for intuitive piece movements.  
  - Leveraged **Socket.io** to handle real-time updates for player roles, board state, and opponent moves.  
  - Used the **Chess.js** library for client-side validation and board rendering.  
  - Implemented distinct views for players and spectators, dynamically flipping the board for black players.  
  - Rendered chess pieces with Unicode symbols to ensure cross-platform compatibility.  

- **Key Achievements**:  
  - Designed seamless player interactions with real-time move validation and game state broadcasting.  
  - Delivered a scalable and interactive experience accommodating players and spectators simultaneously.  
  - Enhanced code modularity by encapsulating game logic and UI rendering.  
