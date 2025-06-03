export type PlayerType = 'X' | 'O';

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
  winner: PlayerType | 'draw' | null;
  scores: {
    X: number;
    O: number;
    draws: number;
  };
};