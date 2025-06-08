import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '@/constants/theme';
import BoardCell from './BoardCell';
import WinningLine from './WinningLine';
import { useGame } from '@/contexts/GameContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  Easing
} from 'react-native-reanimated';

const GameBoard: React.FC = () => {
  const { gameState: localGameState, handleCellPress: localHandleCellPress } = useGame();
  const { gameState: multiplayerGameState, makeMove: multiplayerMakeMove, roomId, opponent, playerRole } = useSupabaseMultiplayer();

  const gameState = roomId && multiplayerGameState ? multiplayerGameState : localGameState;
  const handleCellPress = roomId ? multiplayerMakeMove : localHandleCellPress;
  const isCurrentPlayerTurn = roomId && multiplayerGameState ? multiplayerGameState.currentPlayer === playerRole : true;
  
  const { board, winner, winningLine } = gameState;

  const boardScale = useSharedValue(0.9);
  const boardOpacity = useSharedValue(0);
  const glowIntensity = useSharedValue(0);
  const isMultiplayer = !!(roomId && opponent);
  // Always show enhanced styling for both local and multiplayer
  const showMultiplayerStyling = true;

  useEffect(() => {
    boardScale.value = withSequence(
      withTiming(0.9, { duration: 0 }),
      withTiming(1.05, { duration: 400, easing: Easing.out(Easing.back()) }),
      withTiming(1, { duration: 200 })
    );
    boardOpacity.value = withTiming(1, { duration: 500 });
  }, []);

  useEffect(() => {
    // Always show glow effect for both local and multiplayer
    glowIntensity.value = withSequence(
      withTiming(1, { duration: 1000 }),
      withTiming(0.7, { duration: 1000 }),
      withTiming(1, { duration: 1000 })
    );
  }, []);

  const animatedBoardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: boardScale.value }],
    opacity: boardOpacity.value,
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.3 + (glowIntensity.value * 0.2),
    elevation: 8 + (glowIntensity.value * 4),
  }));

  const gradientStyle = [
    styles.boardGradient,
    showMultiplayerStyling && styles.multiplayerGradient,
  ].filter(Boolean);

  return (
    <View style={styles.boardContainer}>
      <Animated.View style={[styles.boardWrapper, animatedBoardStyle]}>
        {showMultiplayerStyling && (
          <Animated.View style={[styles.outerGlow, animatedGlowStyle]} />
        )}
        <LinearGradient
          colors={
            showMultiplayerStyling 
              ? ['#F0F9FF', '#E0F2FE', '#FEFEFE']
              : [COLORS.white, '#F8FAFC', '#F1F5F9']
          }
          style={gradientStyle}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.boardInner}>
            <LinearGradient
              colors={['rgba(0,0,0,0.02)', 'transparent', 'rgba(0,0,0,0.01)']}
              style={styles.innerShadow}
            />
            <View style={styles.board}>
              {board.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.row}>
                  {row.map((cell, colIndex) => (
                    <BoardCell
                      key={`cell-${rowIndex}-${colIndex}`}
                      cell={cell}
                      row={rowIndex}
                      col={colIndex}
                      onPress={handleCellPress}
                      isMultiplayer={isMultiplayer}
                      isCurrentPlayerTurn={isCurrentPlayerTurn}
                    />
                  ))}
                </View>
              ))}
              {winner && winningLine && (
                <WinningLine winningPositions={winningLine} winner={winner} />
              )}
            </View>
          </View>
        </LinearGradient>
        {showMultiplayerStyling && (
          <>
            <View style={styles.cornerAccent1} />
            <View style={styles.cornerAccent2} />
            <View style={styles.cornerAccent3} />
            <View style={styles.cornerAccent4} />
          </>
        )}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.small, // This was SIZES.boardMargin then reduced to SIZES.small
    position: 'relative',
  },
  boardWrapper: {
    position: 'relative',
  },
  outerGlow: {
    position: 'absolute',
    top: -8,
    left: -8,
    right: -8,
    bottom: -8,
    borderRadius: 24,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 20,
  },
  boardGradient: {
    borderRadius: 20,
    padding: 12, // This was a direct number, SIZES.small is 12
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  multiplayerGradient: {
    shadowColor: '#3B82F6',
    borderColor: 'rgba(59, 130, 246, 0.2)',
  },
  boardInner: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: 'rgba(255,255,255,0.7)',
  },
  innerShadow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
  },
  board: {
    backgroundColor: 'transparent',
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  row: {
    flexDirection: 'row',
  },
  cornerAccent1: {
    position: 'absolute',
    top: 8,
    left: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  cornerAccent2: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  cornerAccent3: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
  cornerAccent4: {
    position: 'absolute',
    bottom: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: 'rgba(59, 130, 246, 0.3)',
  },
});

export default GameBoard;