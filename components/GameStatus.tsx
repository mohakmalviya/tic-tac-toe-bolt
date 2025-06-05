import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS, SIZES } from '@/constants/theme';
import { useGame } from '@/contexts/GameContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

interface GameStatusProps {
  // No props needed if it just reads from context
}

const GameStatus: React.FC<GameStatusProps> = () => {
  const { gameState: localGameState } = useGame();
  const { 
    gameState: multiplayerGameState, 
    roomId, 
    playerRole, 
    opponent,
    isAutoRestarting
  } = useSupabaseMultiplayer();

  const gameState = roomId && multiplayerGameState ? multiplayerGameState : localGameState;
  const { currentPlayer, gameOver, winner } = gameState;
  
  const getStatusMessage = (): string => {
    if (gameOver) {
      if (roomId && playerRole) {
        if (isAutoRestarting) {
          return winner === playerRole ? "You win! New game starting..." : 
                 (gameState.winningLine ? "You lose! New game starting..." : "You lose! (Time's up) New game starting...");
        }
        return winner === playerRole ? "You win! New game in 5s..." : 
               (gameState.winningLine ? "You lose! New game in 5s..." : "You lose! (Time's up) New game in 5s...");
      } else {
        return `Player ${winner} wins!`;
      }
    } else {
      if (roomId) {
        if (!opponent) {
          return "Waiting for opponent...";
        }
        if (gameState.moveCount === 0) {
          if (isAutoRestarting) {
            return "New game started!";
          }
          return currentPlayer === playerRole ? "Your turn - Make the first move!" : 
                 `Waiting for ${opponent.name} to start...`;
        }
        return currentPlayer === playerRole ? "Your turn" : 
               `${opponent?.name || 'Opponent'}'s turn`;
      } else {
        return `Player ${currentPlayer}'s turn`;
      }
    }
  };
  
  return (
    <Text style={styles.statusText}>{getStatusMessage()}</Text>
  );
};

const styles = StyleSheet.create({
  statusText: {
    fontSize: SIZES.medium,
    fontFamily: FONTS.bold,
    textAlign: 'center',
  },
});

export default GameStatus;