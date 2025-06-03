const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);

// Configure CORS for socket.io with more permissive settings for development
const io = socketIo(server, {
  cors: {
    origin: "*", // Allow all origins for development
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true
  },
  allowEIO3: true, // Allow Engine.IO v3 clients
  transports: ['websocket', 'polling']
});

app.use(cors({
  origin: "*",
  methods: ["GET", "POST"],
  allowedHeaders: ["*"],
  credentials: true
}));
app.use(express.json());

// Game state management
const rooms = new Map();
const players = new Map();

// Game logic functions (simplified versions from the client)
function initializeGameState() {
  return {
    board: Array(3).fill(null).map(() => 
      Array(3).fill(null).map(() => ({
        player: null,
        isShadowed: false,
        moveNumber: -1
      }))
    ),
    currentPlayer: 'X',
    moveCount: 0,
    gameOver: false,
    winner: null,
    winningLine: null,
    scores: { X: 0, O: 0, draws: 0 }
  };
}

function checkWinner(board) {
  const lines = [
    // Rows
    { positions: [{ row: 0, col: 0 }, { row: 0, col: 1 }, { row: 0, col: 2 }], cells: [board[0][0], board[0][1], board[0][2]] },
    { positions: [{ row: 1, col: 0 }, { row: 1, col: 1 }, { row: 1, col: 2 }], cells: [board[1][0], board[1][1], board[1][2]] },
    { positions: [{ row: 2, col: 0 }, { row: 2, col: 1 }, { row: 2, col: 2 }], cells: [board[2][0], board[2][1], board[2][2]] },
    // Columns
    { positions: [{ row: 0, col: 0 }, { row: 1, col: 0 }, { row: 2, col: 0 }], cells: [board[0][0], board[1][0], board[2][0]] },
    { positions: [{ row: 0, col: 1 }, { row: 1, col: 1 }, { row: 2, col: 1 }], cells: [board[0][1], board[1][1], board[2][1]] },
    { positions: [{ row: 0, col: 2 }, { row: 1, col: 2 }, { row: 2, col: 2 }], cells: [board[0][2], board[1][2], board[2][2]] },
    // Diagonals
    { positions: [{ row: 0, col: 0 }, { row: 1, col: 1 }, { row: 2, col: 2 }], cells: [board[0][0], board[1][1], board[2][2]] },
    { positions: [{ row: 0, col: 2 }, { row: 1, col: 1 }, { row: 2, col: 0 }], cells: [board[0][2], board[1][1], board[2][0]] }
  ];

  for (const line of lines) {
    const [a, b, c] = line.cells;
    if (
      a.player && 
      a.player === b.player && 
      a.player === c.player && 
      !a.isShadowed && 
      !b.isShadowed && 
      !c.isShadowed
    ) {
      return { winner: a.player, winningLine: line.positions };
    }
  }

  return { winner: null, winningLine: null };
}

function isBoardFull(board) {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col].player === null) {
        return false;
      }
    }
  }
  return true;
}

function makeMove(gameState, row, col) {
  if (gameState.board[row][col].player !== null || gameState.gameOver) {
    return gameState;
  }

  const newGameState = JSON.parse(JSON.stringify(gameState));
  const { board, currentPlayer, moveCount } = newGameState;
  
  // Remove current player's shadowed pieces
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = board[r][c];
      if (cell.player === currentPlayer && cell.isShadowed) {
        board[r][c] = { player: null, isShadowed: false, moveNumber: -1 };
      }
    }
  }
  
  // Place the new piece
  board[row][col] = {
    player: currentPlayer,
    isShadowed: false,
    moveNumber: moveCount
  };
  
  newGameState.moveCount++;
  
  // Handle special shadowing rule
  const allCells = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      allCells.push(board[r][c]);
    }
  }
  
  const currentPlayerPieceCount = allCells.filter(
    cell => cell.player === currentPlayer && !cell.isShadowed
  ).length;
  
  const opponentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  const opponentPieceCount = allCells.filter(
    cell => cell.player === opponentPlayer && !cell.isShadowed
  ).length;
  
  if (currentPlayerPieceCount === 3 && opponentPieceCount === 3) {
    let oldestMove = null;
    let oldestRow = -1;
    let oldestCol = -1;
    
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = board[r][c];
        if (
          cell.player === opponentPlayer && 
          !cell.isShadowed && 
          (oldestMove === null || cell.moveNumber < oldestMove.moveNumber)
        ) {
          oldestMove = cell;
          oldestRow = r;
          oldestCol = c;
        }
      }
    }
    
    if (oldestMove !== null) {
      board[oldestRow][oldestCol].isShadowed = true;
    }
  }
  
  // Check for winner
  const { winner, winningLine } = checkWinner(board);
  if (winner) {
    newGameState.gameOver = true;
    newGameState.winner = winner;
    newGameState.winningLine = winningLine;
    newGameState.scores[winner]++;
  } else if (isBoardFull(board)) {
    newGameState.gameOver = true;
    newGameState.winner = 'draw';
    newGameState.scores.draws++;
  } else {
    newGameState.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
  
  return newGameState;
}

function generateRoomId() {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
}

io.on('connection', (socket) => {
  console.log(`Player connected: ${socket.id}`);

  socket.on('create-room', ({ playerName }) => {
    const roomId = generateRoomId();
    const gameState = initializeGameState();
    
    const room = {
      id: roomId,
      players: new Map(),
      gameState: gameState,
      maxPlayers: 2
    };
    
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      role: 'X',
      isHost: true
    });
    
    rooms.set(roomId, room);
    players.set(socket.id, { roomId, role: 'X' });
    
    socket.join(roomId);
    socket.emit('room-created', { roomId, role: 'X' });
    socket.emit('game-state-updated', gameState);
    
    console.log(`Room created: ${roomId} by ${playerName}`);
  });

  socket.on('join-room', ({ roomId, playerName }) => {
    const room = rooms.get(roomId);
    
    if (!room) {
      socket.emit('room-error', 'Room not found');
      return;
    }
    
    if (room.players.size >= room.maxPlayers) {
      socket.emit('room-error', 'Room is full');
      return;
    }
    
    const role = 'O'; // Second player is always O
    room.players.set(socket.id, {
      id: socket.id,
      name: playerName,
      role: role,
      isHost: false
    });
    
    players.set(socket.id, { roomId, role });
    
    socket.join(roomId);
    
    // Get host player info
    const hostPlayer = Array.from(room.players.values()).find(p => p.isHost);
    
    socket.emit('room-joined', { 
      roomId, 
      role,
      opponent: { id: hostPlayer.id, name: hostPlayer.name }
    });
    
    // Notify host that player joined
    socket.to(roomId).emit('player-joined', {
      opponent: { id: socket.id, name: playerName }
    });
    
    // Send current game state to both players
    io.to(roomId).emit('game-state-updated', room.gameState);
    
    console.log(`${playerName} joined room: ${roomId}`);
  });

  socket.on('make-move', ({ roomId, row, col }) => {
    const room = rooms.get(roomId);
    const player = players.get(socket.id);
    
    if (!room || !player) {
      socket.emit('room-error', 'Invalid room or player');
      return;
    }
    
    // Check if it's the player's turn
    if (room.gameState.currentPlayer !== player.role) {
      socket.emit('room-error', 'Not your turn');
      return;
    }
    
    // Make the move
    const newGameState = makeMove(room.gameState, row, col);
    room.gameState = newGameState;
    
    // Broadcast the updated game state to all players in the room
    io.to(roomId).emit('game-state-updated', newGameState);
    
    console.log(`Move made in room ${roomId}: ${player.role} at (${row}, ${col})`);
  });

  socket.on('reset-game', ({ roomId }) => {
    const room = rooms.get(roomId);
    const player = players.get(socket.id);
    
    if (!room || !player) {
      socket.emit('room-error', 'Invalid room or player');
      return;
    }
    
    // Only allow host to reset (you can modify this logic)
    const playerInfo = room.players.get(socket.id);
    if (!playerInfo || !playerInfo.isHost) {
      socket.emit('room-error', 'Only host can reset the game');
      return;
    }
    
    const newGameState = initializeGameState();
    // Preserve scores
    newGameState.scores = room.gameState.scores;
    room.gameState = newGameState;
    
    io.to(roomId).emit('game-state-updated', newGameState);
    
    console.log(`Game reset in room ${roomId}`);
  });

  socket.on('leave-room', ({ roomId }) => {
    handlePlayerLeave(socket, roomId);
  });

  socket.on('disconnect', () => {
    console.log(`Player disconnected: ${socket.id}`);
    const playerInfo = players.get(socket.id);
    if (playerInfo) {
      handlePlayerLeave(socket, playerInfo.roomId);
    }
  });

  function handlePlayerLeave(socket, roomId) {
    const room = rooms.get(roomId);
    if (room) {
      room.players.delete(socket.id);
      socket.to(roomId).emit('player-left');
      
      // If room is empty, delete it
      if (room.players.size === 0) {
        rooms.delete(roomId);
        console.log(`Room deleted: ${roomId}`);
      }
    }
    players.delete(socket.id);
    socket.leave(roomId);
  }
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', rooms: rooms.size, players: players.size });
});

const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`🚀 Tic-Tac-Toe multiplayer server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 