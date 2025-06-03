import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import GamePiece from './GamePiece';
import { CellState } from '@/types/game';

interface BoardCellProps {
  cell: CellState;
  row: number;
  col: number;
  onPress: (row: number, col: number) => void;
}

const BoardCell: React.FC<BoardCellProps> = ({ cell, row, col, onPress }) => {
  const getBorderStyles = () => {
    const styles = [];
    
    // Top border for all cells except the first row
    if (row > 0) {
      styles.push({ borderTopWidth: 2, borderTopColor: COLORS.textPrimary });
    }
    
    // Bottom border for all cells except the last row
    if (row < 2) {
      styles.push({ borderBottomWidth: 2, borderBottomColor: COLORS.textPrimary });
    }
    
    // Left border for all cells except the first column
    if (col > 0) {
      styles.push({ borderLeftWidth: 2, borderLeftColor: COLORS.textPrimary });
    }
    
    // Right border for all cells except the last column
    if (col < 2) {
      styles.push({ borderRightWidth: 2, borderRightColor: COLORS.textPrimary });
    }
    
    return styles;
  };

  return (
    <TouchableOpacity
      style={[styles.cell, ...getBorderStyles()]}
      onPress={() => onPress(row, col)}
      activeOpacity={cell.player ? 1 : 0.7}
      disabled={cell.player !== null}
    >
      {cell.player && (
        <GamePiece 
          type={cell.player} 
          isShadowed={cell.isShadowed} 
        />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: SIZES.cellSize,
    height: SIZES.cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.white,
  },
});

export default BoardCell;