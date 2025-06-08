export type PlayerType = 'X' | 'O';

export type Position = {
  row: number;
  col: number;
};

export type CellState = {
  player: PlayerType | null;
  isShadowed: boolean;
  moveNumber: number;
};

export type BoardState = CellState[][];

export type GameState = {
  board: BoardState;
  currentPlayer: PlayerType;
  moveCount: number;
  gameOver: boolean;
  winner: PlayerType | null;
  winningLine: Position[] | null;
  scores: {
    X: number;
    O: number;
  };
  turnStartTime?: Date; // Optional - only starts on first move
  turnTimeLimit: number; // Time limit per turn in seconds (default 15)
};