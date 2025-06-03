import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { X, Circle } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';

const GameStatus: React.FC = () => {
  const { gameState } = useGame();
  const { currentPlayer, gameOver, winner, scores } = gameState;
  
  const getStatusMessage = () => {
    if (gameOver) {
      if (winner === 'draw') {
        return "It's a draw!";
      } else {
        return `Player ${winner} wins!`;
      }
    } else {
      return `Player ${currentPlayer}'s turn`;
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
          <Text style={styles.scoreText}>{scores.X}</Text>
        </View>
        
        <View style={styles.scoreBox}>
          <Text style={styles.scoreText}>Draws</Text>
          <Text style={styles.scoreText}>{scores.draws}</Text>
        </View>
        
        <View style={styles.scoreBox}>
          <Circle color={COLORS.oColor} size={20} />
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
  scoreText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginTop: 4,
  },
});

export default GameStatus;