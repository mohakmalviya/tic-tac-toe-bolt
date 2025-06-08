import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '@/constants/theme';
import GamePiece from './GamePiece';
import { CellState } from '@/types/game';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming,
  withSpring
} from 'react-native-reanimated';

interface BoardCellProps {
  cell: CellState;
  row: number;
  col: number;
  onPress: (row: number, col: number) => void;
  isMultiplayer?: boolean;
  isCurrentPlayerTurn?: boolean;
}

const BoardCell: React.FC<BoardCellProps> = ({ cell, row, col, onPress, isMultiplayer = false, isCurrentPlayerTurn = true }) => {
  const pressScale = useSharedValue(1);
  const hoverOpacity = useSharedValue(1);

  const getBorderStyles = () => {
    const styles = [];
    
    // Top border for all cells except the first row
    if (row > 0) {
      styles.push({ 
        borderTopWidth: 3, 
        borderTopColor: isMultiplayer ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.2)' 
      });
    }
    
    // Bottom border for all cells except the last row
    if (row < 2) {
      styles.push({ 
        borderBottomWidth: 3, 
        borderBottomColor: isMultiplayer ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.2)' 
      });
    }
    
    // Left border for all cells except the first column
    if (col > 0) {
      styles.push({ 
        borderLeftWidth: 3, 
        borderLeftColor: isMultiplayer ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.2)' 
      });
    }
    
    // Right border for all cells except the last column
    if (col < 2) {
      styles.push({ 
        borderRightWidth: 3, 
        borderRightColor: isMultiplayer ? 'rgba(59, 130, 246, 0.3)' : 'rgba(15, 23, 42, 0.2)' 
      });
    }
    
    return styles;
  };

  const handlePressIn = () => {
    if (!cell.player && (!isMultiplayer || isCurrentPlayerTurn)) {
      pressScale.value = withSpring(0.95);
      hoverOpacity.value = withTiming(0.8);
    }
  };

  const handlePressOut = () => {
    pressScale.value = withSpring(1);
    hoverOpacity.value = withTiming(1);
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pressScale.value }],
    opacity: hoverOpacity.value,
  }));

  return (
    <Animated.View style={animatedStyle}>
      <TouchableOpacity
        style={[styles.cell, ...getBorderStyles()]}
        onPress={() => onPress(row, col)}
        onPressIn={handlePressIn}
        onPressOut={handlePressOut}
        activeOpacity={cell.player ? 1 : (!isMultiplayer || isCurrentPlayerTurn) ? 0.8 : 1}
        disabled={cell.player !== null}
      >
        <LinearGradient
          colors={
            isMultiplayer 
              ? ['rgba(240, 249, 255, 0.8)', 'rgba(255, 255, 255, 0.9)']
              : ['rgba(255, 255, 255, 0.9)', 'rgba(248, 250, 252, 0.8)']
          }
          style={styles.cellGradient}
        >
          {/* Hover effect for empty cells - only show when it's player's turn in multiplayer */}
          {!cell.player && (!isMultiplayer || isCurrentPlayerTurn) && (
            <LinearGradient
              colors={
                isMultiplayer
                  ? ['rgba(59, 130, 246, 0.05)', 'rgba(59, 130, 246, 0.1)']
                  : ['rgba(15, 23, 42, 0.03)', 'rgba(15, 23, 42, 0.06)']
              }
              style={styles.hoverEffect}
            />
          )}
          
          {cell.player && (
            <GamePiece 
              type={cell.player} 
              isShadowed={cell.isShadowed}
              isMultiplayer={isMultiplayer}
            />
          )}
        </LinearGradient>
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  cell: {
    width: SIZES.cellSize,
    height: SIZES.cellSize,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  cellGradient: {
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  hoverEffect: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
});

export default BoardCell;