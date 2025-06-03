import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { X, Circle } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useMultiplayer } from '@/contexts/MultiplayerContext';

const GameStatus: React.FC = () => {
  const { gameState: localGameState } = useGame();
  const { 
    gameState: multiplayerGameState, 
    roomId, 
    playerRole, 
    opponent 
  } = useMultiplayer();

  // Use multiplayer game state if we're in a room, otherwise use local
  const gameState = roomId && multiplayerGameState ? multiplayerGameState : localGameState;
  const { currentPlayer, gameOver, winner, scores } = gameState;
  
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner === 'draw') {
        return "It's a draw!";
      } else {
        if (roomId && playerRole) {
          // Multiplayer mode
          return winner === playerRole ? "You win!" : "You lose!";
        } else {
          // Local mode
          return `Player ${winner} wins!`;
        }
      }
    } else {
      if (roomId && playerRole) {
        // Multiplayer mode
        return currentPlayer === playerRole ? "Your turn" : 
               opponent ? `${opponent.name}'s turn` : "Waiting for opponent...";
      } else {
        // Local mode
        return `Player ${currentPlayer}'s turn`;
      }
    }
  };

  const getPlayerLabel = (player: 'X' | 'O') => {
    if (roomId && playerRole) {
      // Multiplayer mode
      if (player === playerRole) {
        return "You";
      } else {
        return opponent ? opponent.name : "Opponent";
      }
    } else {
      // Local mode
      return `Player ${player}`;
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.statusContainer}>
        <Text style={styles.statusText}>{getStatusMessage()}</Text>
        {!gameOver && (
          <View style={styles.currentPlayerIcon}>
            {currentPlayer === 'X' ? (
              <X color={COLORS.xColor} size={24} />
            ) : (
              <Circle color={COLORS.oColor} size={24} />
            )}
          </View>
        )}
      </View>
      
      <View style={styles.scoreContainer}>
        <View style={styles.scoreBox}>
          <X color={COLORS.xColor} size={20} />
          <Text style={styles.playerLabel}>{getPlayerLabel('X')}</Text>
          <Text style={styles.scoreText}>{scores.X}</Text>
        </View>
        
        <View style={styles.scoreBox}>
          <Text style={styles.playerLabel}>Draws</Text>
          <Text style={styles.scoreText}>{scores.draws}</Text>
        </View>
        
        <View style={styles.scoreBox}>
          <Circle color={COLORS.oColor} size={20} />
          <Text style={styles.playerLabel}>{getPlayerLabel('O')}</Text>
          <Text style={styles.scoreText}>{scores.O}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: SIZES.large,
    alignItems: 'center',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  statusText: {
    fontSize: SIZES.large,
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    marginRight: SIZES.small,
  },
  currentPlayerIcon: {
    marginLeft: SIZES.small,
  },
  scoreContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: SIZES.xLarge,
    marginTop: SIZES.medium,
  },
  scoreBox: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.small,
    borderRadius: 8,
    minWidth: 70,
    ...SHADOWS.small,
  },
  playerLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  scoreText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
});

export default GameStatus;