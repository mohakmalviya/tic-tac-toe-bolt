import React, { useEffect } from 'react';
import { StyleSheet } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  Easing
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@/constants/theme';
import { PlayerType } from '@/types/game';
import { X, Circle } from 'lucide-react-native';

interface GamePieceProps {
  type: PlayerType;
  isShadowed: boolean;
  isMultiplayer?: boolean;
}

const GamePiece: React.FC<GamePieceProps> = ({ type, isShadowed, isMultiplayer = false }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  // Animation for piece appearance - faster in multiplayer for better timer sync
  useEffect(() => {
    if (isMultiplayer) {
      // Faster animation for multiplayer to improve timer synchronization feel
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.15, { duration: 150, easing: Easing.out(Easing.back()) }),
        withTiming(1, { duration: 100 })
      );
    } else {
      // Standard animation for single player
      scale.value = withSequence(
        withTiming(0, { duration: 0 }),
        withTiming(1.2, { duration: 250, easing: Easing.out(Easing.back()) }),
        withTiming(1, { duration: 200 })
      );
    }
  }, [scale, isMultiplayer]);
  
  // Animation for shadowed state - faster in multiplayer for responsiveness
  useEffect(() => {
    const duration = isMultiplayer ? 300 : 400;
    if (isShadowed) {
      opacity.value = withTiming(0.4, { duration });
    } else {
      opacity.value = withTiming(1, { duration });
    }
  }, [isShadowed, opacity, isMultiplayer]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });

  const getColors = () => {
    if (type === 'X') {
      return {
        normal: isMultiplayer ? '#2563EB' : COLORS.xColor,
        shadowed: isMultiplayer ? '#64748B' : COLORS.xShadow,
      };
    } else {
      return {
        normal: isMultiplayer ? '#EA580C' : COLORS.oColor,
        shadowed: isMultiplayer ? '#64748B' : COLORS.oShadow,
      };
    }
  };

  const colors = getColors();

  // Get proper size for the icon - slightly smaller for Circle to prevent cutting
  const getIconSize = () => {
    const baseSize = SIZES.cellSize * 0.6;
    return type === 'O' ? baseSize - 4 : baseSize;
  };

  // Get container style based on multiplayer mode
  const getContainerStyle = () => {
    if (isMultiplayer) {
      return type === 'X' ? styles.multiplayerXGlow : styles.multiplayerOGlow;
    }
    return styles.normalContainer;
  };
  
  return (
    <Animated.View style={[styles.pieceContainer, animatedStyle]}>
      <Animated.View style={getContainerStyle()}>
        {type === 'X' ? (
          <X
            size={getIconSize()}
            color={isShadowed ? colors.shadowed : colors.normal}
            strokeWidth={isMultiplayer ? SIZES.pieceStrokeWidth + 0.5 : SIZES.pieceStrokeWidth}
          />
        ) : (
          <Circle
            size={getIconSize()}
            color={isShadowed ? colors.shadowed : colors.normal}
            strokeWidth={isMultiplayer ? SIZES.pieceStrokeWidth : SIZES.pieceStrokeWidth - 0.5}
          />
        )}
      </Animated.View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  pieceContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: SIZES.cellSize,
    height: SIZES.cellSize,
  },
  normalContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  multiplayerXGlow: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#2563EB',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
  multiplayerOGlow: {
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#EA580C',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 4,
  },
});

export default GamePiece;