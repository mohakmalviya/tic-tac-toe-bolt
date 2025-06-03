import { BoardState, CellState, GameState, PlayerType } from '@/types/game';

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
    scores: {
      X: 0,
      O: 0,
      draws: 0
    }
  };
};

// Check if a player has won
export const checkWinner = (board: BoardState): PlayerType | null => {
  const lines = [
    // Rows
    [board[0][0], board[0][1], board[0][2]],
    [board[1][0], board[1][1], board[1][2]],
    [board[2][0], board[2][1], board[2][2]],
    // Columns
    [board[0][0], board[1][0], board[2][0]],
    [board[0][1], board[1][1], board[2][1]],
    [board[0][2], board[1][2], board[2][2]],
    // Diagonals
    [board[0][0], board[1][1], board[2][2]],
    [board[0][2], board[1][1], board[2][0]]
  ];

  for (const line of lines) {
    const [a, b, c] = line;
    if (
      a.player && 
      a.player === b.player && 
      a.player === c.player && 
      !a.isShadowed && 
      !b.isShadowed && 
      !c.isShadowed
    ) {
      return a.player;
    }
  }

  return null;
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
  const { board, currentPlayer, moveCount } = newGameState;
  
  // Update the board with the new move
  board[row][col] = {
    player: currentPlayer,
    isShadowed: false,
    moveNumber: moveCount
  };
  
  // Increment move count
  newGameState.moveCount++;
  
  // Handle special rule: Shadow the oldest piece of the opponent when a player makes their 3rd move
  const playerMoveCount = board.flat().filter(
    cell => cell.player === currentPlayer && !cell.isShadowed
  ).length;
  
  if (playerMoveCount === 3) {
    // Find the oldest piece of the opponent
    const opponentPlayer = currentPlayer === 'X' ? 'O' : 'X';
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
    
    // Shadow the oldest piece
    if (oldestMove !== null) {
      board[oldestRow][oldestCol].isShadowed = true;
    }
  }
  
  // Remove shadowed pieces when the player makes their next move
  const opponentPieces = board.flat().filter(
    cell => cell.player !== currentPlayer && cell.player !== null && cell.isShadowed
  );
  
  if (opponentPieces.length > 0) {
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 3; c++) {
        const cell = board[r][c];
        if (cell.player !== currentPlayer && cell.player !== null && cell.isShadowed) {
          // Clear the cell
          board[r][c] = {
            player: null,
            isShadowed: false,
            moveNumber: -1
          };
        }
      }
    }
  }
  
  // Check for a winner
  const winner = checkWinner(board);
  if (winner) {
    newGameState.gameOver = true;
    newGameState.winner = winner;
    newGameState.scores[winner]++;
  } 
  // Check for a draw
  else if (isBoardFull(board)) {
    newGameState.gameOver = true;
    newGameState.winner = 'draw';
    newGameState.scores.draws++;
  } 
  // Switch to the next player
  else {
    newGameState.currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
  }
  
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