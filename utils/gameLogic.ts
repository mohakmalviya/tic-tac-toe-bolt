import { BoardState, CellState, GameState, PlayerType, Position } from '@/types/game';

// Initialize a new game board
export const initializeBoard = (): BoardState => {
  return Array(3).fill(null).map(() => 
    Array(3).fill(null).map(() => ({
      player: null,
      isShadowed: false,
      moveNumber: -1
    }))
  );
};

// Initialize a new game state
export const initializeGameState = (): GameState => {
  return {
    board: initializeBoard(),
    currentPlayer: 'X',
    moveCount: 0,
    gameOver: false,
    winner: null,
    winningLine: null,
    scores: {
      X: 0,
      O: 0
    },
    turnStartTime: undefined, // Timer starts on first move
    turnTimeLimit: 15 // 15 seconds per turn
  };
};

// Check if a player has won and return winner and winning positions
export const checkWinner = (board: BoardState): { winner: PlayerType | null; winningLine: Position[] | null } => {
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
};

// Check if the board is full (a draw)
export const isBoardFull = (board: BoardState): boolean => {
  for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
      if (board[row][col].player === null) {
        return false;
      }
    }
  }
  return true;
};

// Handle making a move
export const makeMove = (gameState: GameState, row: number, col: number): GameState => {
  // If cell is already occupied or game is over
  if (gameState.board[row][col].player !== null || gameState.gameOver) {
    return gameState;
  }

  // Create a deep copy of the game state
  const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  // Fix Date objects that got converted to strings during JSON serialization
  if (newGameState.turnStartTime && typeof newGameState.turnStartTime === 'string') {
    newGameState.turnStartTime = new Date(newGameState.turnStartTime);
  }
  
  const { board, currentPlayer, moveCount } = newGameState;
  
  // FIRST: Remove current player's own shadowed pieces before placing new piece
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      const cell = board[r][c];
      if (cell.player === currentPlayer && cell.isShadowed) {
        // Clear the shadowed piece
        board[r][c] = {
          player: null,
          isShadowed: false,
          moveNumber: -1
        };
      }
    }
  }
  
  // SECOND: Place the new piece
  board[row][col] = {
    player: currentPlayer,
    isShadowed: false,
    moveNumber: moveCount
  };
  
  // Increment move count
  newGameState.moveCount++;
  
  // Start timer on first move
  if (newGameState.moveCount === 1) {
    newGameState.turnStartTime = new Date();
  }
  
  // THIRD: Handle special rule - Shadow opponent's oldest piece when current player reaches 3 pieces AND opponent already has 3 pieces
  const allCells: CellState[] = [];
  for (let r = 0; r < 3; r++) {
    for (let c = 0; c < 3; c++) {
      allCells.push(board[r][c]);
    }
  }
  
  const currentPlayerPieceCount = allCells.filter(
    (cell: CellState) => cell.player === currentPlayer && !cell.isShadowed
  ).length;
  
  const opponentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  const opponentPieceCount = allCells.filter(
    (cell: CellState) => cell.player === opponentPlayer && !cell.isShadowed
  ).length;
  
  // Only shadow pieces when current player reaches 3 pieces AND opponent already has 3 pieces
  if (currentPlayerPieceCount === 3 && opponentPieceCount === 3) {
    // Find the oldest piece of the opponent (the one who reached 3 pieces first)
    let oldestMove: CellState | null = null;
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
    
    // Shadow the oldest opponent piece
    if (oldestMove !== null) {
      board[oldestRow][oldestCol].isShadowed = true;
    }
  }
  
  // Check for a winner
  const { winner, winningLine } = checkWinner(board);
  if (winner) {
    newGameState.gameOver = true;
    newGameState.winner = winner;
    newGameState.winningLine = winningLine;
    newGameState.scores[winner]++;
  } 
  // In this special variant, draws are impossible due to the shadowing mechanics
  // The game continues until someone wins
  else {
    newGameState.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
    // Reset turn timer for the next player
    newGameState.turnStartTime = new Date();
  }
  
  return newGameState;
};

// Handle timer timeout - opponent wins
export const handleTimeout = (gameState: GameState, timedOutPlayer: PlayerType): GameState => {
  const newGameState = JSON.parse(JSON.stringify(gameState)) as GameState;
  
  // Fix Date objects that got converted to strings during JSON serialization
  if (newGameState.turnStartTime && typeof newGameState.turnStartTime === 'string') {
    newGameState.turnStartTime = new Date(newGameState.turnStartTime);
  }
  
  const winner = timedOutPlayer === 'X' ? 'O' : 'X';
  
  newGameState.gameOver = true;
  newGameState.winner = winner;
  newGameState.scores[winner]++;
  newGameState.winningLine = null; // No winning line for timeout
  newGameState.turnStartTime = new Date(); // Set current time for database consistency
  
  return newGameState;
};

// Reset the game board but keep scores
export const resetGame = (gameState: GameState): GameState => {
  return {
    ...initializeGameState(),
    scores: gameState.scores
  };
};

// Reset everything including scores
export const resetAll = (): GameState => {
  return initializeGameState();
};