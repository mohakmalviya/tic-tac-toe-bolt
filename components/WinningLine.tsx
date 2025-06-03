import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@/constants/theme';
import { Position } from '@/types/game';

interface WinningLineProps {
  winningPositions: Position[];
}

const WinningLine: React.FC<WinningLineProps> = ({ winningPositions }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);

  useEffect(() => {
    // Animate the winning line appearance
    opacity.value = withDelay(300, withTiming(1, { duration: 400 }));
    scale.value = withDelay(300, withTiming(1, { 
      duration: 500, 
      easing: Easing.out(Easing.back(1.2)) 
    }));
  }, [opacity, scale]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  // Calculate line position and rotation based on winning positions
  const getLineStyle = () => {
    const [first, , third] = winningPositions;
    const cellSize = SIZES.cellSize;
    const lineWidth = 6;
    
    // Calculate center points of first and last cells
    const startX = first.col * cellSize + cellSize / 2;
    const startY = first.row * cellSize + cellSize / 2;
    const endX = third.col * cellSize + cellSize / 2;
    const endY = third.row * cellSize + cellSize / 2;
    
    // Calculate line length
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    
    // Calculate angle
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    
    // Calculate center position
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    
    return {
      position: 'absolute' as const,
      width: length,
      height: lineWidth,
      backgroundColor: COLORS.primary,
      borderRadius: lineWidth / 2,
      left: centerX - length / 2,
      top: centerY - lineWidth / 2,
      transform: [{ rotate: `${angle}deg` }],
      shadowColor: COLORS.primary,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.5,
      shadowRadius: 4,
      elevation: 5,
    };
  };

  return (
    <Animated.View style={[getLineStyle(), animatedStyle]} />
  );
};

export default WinningLine; 