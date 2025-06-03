import React from 'react';
import { StyleSheet, View } from 'react-native';
import { COLORS, SHADOWS, SIZES } from '@/constants/theme';
import BoardCell from './BoardCell';
import { useGame } from '@/contexts/GameContext';

const GameBoard: React.FC = () => {
  const { gameState, handleCellPress } = useGame();
  const { board } = gameState;

  return (
    <View style={styles.boardContainer}>
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  boardContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.boardMargin,
  },
  board: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 5,
    ...SHADOWS.medium,
  },
  row: {
    flexDirection: 'row',
  },
});

export default GameBoard;