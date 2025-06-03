import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSequence,
  withDelay,
  Easing
} from 'react-native-reanimated';
import { COLORS, SIZES } from '@/constants/theme';
import { PlayerType } from '@/types/game';
import { X, Circle } from 'lucide-react-native';

interface GamePieceProps {
  type: PlayerType;
  isShadowed: boolean;
}

const GamePiece: React.FC<GamePieceProps> = ({ type, isShadowed }) => {
  const scale = useSharedValue(0);
  const opacity = useSharedValue(1);
  
  // Animation for piece appearance
  useEffect(() => {
    scale.value = withSequence(
      withTiming(0, { duration: 0 }),
      withTiming(1.1, { duration: 200, easing: Easing.out(Easing.back()) }),
      withTiming(1, { duration: 150 })
    );
  }, []);
  
  // Animation for shadowed state
  useEffect(() => {
    if (isShadowed) {
      opacity.value = withTiming(0.5, { duration: 300 });
    } else {
      opacity.value = withTiming(1, { duration: 300 });
    }
  }, [isShadowed]);
  
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: scale.value }],
      opacity: opacity.value,
    };
  });
  
  return (
    <Animated.View style={[styles.pieceContainer, animatedStyle]}>
      {type === 'X' ? (
        <X
          size={SIZES.cellSize * 0.6}
          color={isShadowed ? COLORS.xShadow : COLORS.xColor}
          strokeWidth={SIZES.pieceStrokeWidth}
        />
      ) : (
        <Circle
          size={SIZES.cellSize * 0.6}
          color={isShadowed ? COLORS.oShadow : COLORS.oColor}
          strokeWidth={SIZES.pieceStrokeWidth}
        />
      )}
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
});

export default GamePiece;