import React, { createContext, useContext, useState } from 'react';
import { GameState } from '@/types/game';
import { initializeGameState, makeMove, resetGame, resetAll } from '@/utils/gameLogic';

// Define the shape of the context
type GameContextType = {
  gameState: GameState;
  handleCellPress: (row: number, col: number) => void;
  handleResetGame: () => void;
  handleResetAll: () => void;
};

// Create the context with a default value
const GameContext = createContext<GameContextType | undefined>(undefined);

// Provider component
export const GameProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [gameState, setGameState] = useState<GameState>(initializeGameState());

  const handleCellPress = (row: number, col: number) => {
    setGameState(prevState => makeMove(prevState, row, col));
  };

  const handleResetGame = () => {
    setGameState(prevState => resetGame(prevState));
  };

  const handleResetAll = () => {
    setGameState(resetAll());
  };

  return (
    <GameContext.Provider value={{ 
      gameState, 
      handleCellPress, 
      handleResetGame, 
      handleResetAll 
    }}>
      {children}
    </GameContext.Provider>
  );
};

// Custom hook to use the game context
export const useGame = (): GameContextType => {
  const context = useContext(GameContext);
  if (context === undefined) {
    throw new Error('useGame must be used within a GameProvider');
  }
  return context;
};