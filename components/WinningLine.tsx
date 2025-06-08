import React, { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@/constants/theme';
import { Position } from '@/types/game';

interface WinningLineProps {
  winningPositions: Position[];
  winner: 'X' | 'O';
}

const WinningLine: React.FC<WinningLineProps> = ({ winningPositions, winner }) => {
  const opacity = useSharedValue(0);
  const scale = useSharedValue(0);
  const lineLength = useSharedValue(0);

  useEffect(() => {
    // Animate the winning line appearance with a drawing effect
    opacity.value = withDelay(200, withTiming(1, { duration: 300 }));
    scale.value = withDelay(200, withTiming(1, { 
      duration: 400, 
      easing: Easing.out(Easing.back(1.1)) 
    }));
    lineLength.value = withDelay(300, withTiming(1, { 
      duration: 600, 
      easing: Easing.out(Easing.quad) 
    }));
  }, [opacity, scale, lineLength]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ scale: scale.value }],
    };
  });

  const lineAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scaleX: lineLength.value }],
    };
  });

  // Get winner color
  const getWinnerColor = () => {
    return winner === 'X' ? COLORS.xColor : COLORS.oColor;
  };

  // Calculate line position and rotation based on winning positions
  const getLineStyle = () => {
    const [first, , third] = winningPositions;
    const cellSize = SIZES.cellSize;
    const lineWidth = 8; // Increased thickness for better visibility
    
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
    
    const winnerColor = getWinnerColor();
    
    return {
      position: 'absolute' as const,
      width: length,
      height: lineWidth,
      backgroundColor: winnerColor,
      borderRadius: lineWidth / 2,
      left: centerX - length / 2,
      top: centerY - lineWidth / 2,
      transform: [{ rotate: `${angle}deg` }],
      shadowColor: winnerColor,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.6,
      shadowRadius: 8,
      elevation: 8,
      transformOrigin: 'left center',
    };
  };

  // Glow effect container
  const getGlowStyle = () => {
    const [first, , third] = winningPositions;
    const cellSize = SIZES.cellSize;
    const glowWidth = 16; // Glow effect width
    
    const startX = first.col * cellSize + cellSize / 2;
    const startY = first.row * cellSize + cellSize / 2;
    const endX = third.col * cellSize + cellSize / 2;
    const endY = third.row * cellSize + cellSize / 2;
    
    const length = Math.sqrt(Math.pow(endX - startX, 2) + Math.pow(endY - startY, 2));
    const angle = Math.atan2(endY - startY, endX - startX) * (180 / Math.PI);
    const centerX = (startX + endX) / 2;
    const centerY = (startY + endY) / 2;
    
    const winnerColor = getWinnerColor();
    
    return {
      position: 'absolute' as const,
      width: length + 20,
      height: glowWidth,
      backgroundColor: winnerColor,
      borderRadius: glowWidth / 2,
      left: centerX - (length + 20) / 2,
      top: centerY - glowWidth / 2,
      transform: [{ rotate: `${angle}deg` }],
      opacity: 0.3,
    };
  };

  return (
    <Animated.View style={animatedStyle}>
      {/* Glow effect */}
      <Animated.View style={[getGlowStyle(), { opacity: 0.2 }]} />
      
      {/* Main line with drawing animation */}
      <Animated.View style={[getLineStyle(), lineAnimatedStyle]} />
    </Animated.View>
  );
};

export default WinningLine; 