import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '@/constants/theme';
import BoardCell from './BoardCell';
import WinningLine from './WinningLine';
import { useGame } from '@/contexts/GameContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';
import { LinearGradient } from 'expo-linear-gradient';

const GameBoard: React.FC = () => {
  const { gameState: localGameState, handleCellPress: localHandleCellPress } = useGame();
  const { gameState: multiplayerGameState, makeMove: multiplayerMakeMove, roomId } = useSupabaseMultiplayer();

  // Use multiplayer game state if we're in a room, otherwise use local
  const gameState = roomId && multiplayerGameState ? multiplayerGameState : localGameState;
  const handleCellPress = roomId ? multiplayerMakeMove : localHandleCellPress;
  
  const { board, winner, winningLine } = gameState;

  return (
    <View style={styles.boardContainer}>
      <LinearGradient
        colors={[COLORS.white, '#F8FAFC']}
        style={styles.boardGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
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
                />
              ))}
            </View>
          ))}
          
          {/* Show winning line when there's a winner */}
          {winner && winner !== 'draw' && winningLine && (
            <WinningLine winningPositions={winningLine} winner={winner} />
          )}
        </View>
      </LinearGradient>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.boardMargin,
  },
  boardGradient: {
    borderRadius: 16,
    padding: 8,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  board: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameBoard;