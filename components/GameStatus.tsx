import React, { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { FONTS, SIZES } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useGame } from '@/contexts/GameContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing
} from 'react-native-reanimated';

interface GameStatusProps {
  // No props needed if it just reads from context
}

const cleanPlayerName = (name: string): string => {
  if (!name) return '';
  // Remove any version of the [RANDOM] tag with case insensitivity and global flag
  return name.replace(/\[RANDOM\][\s]*/gi, '');
};

const GameStatus: React.FC<GameStatusProps> = () => {
  const { theme, isDark } = useTheme();
  const { gameState: localGameState } = useGame();
  const { 
    gameState: multiplayerGameState, 
    roomId, 
    playerRole, 
    opponent,
    isAutoRestarting,
    currentPlayerName
  } = useSupabaseMultiplayer();

  const gameState = roomId && multiplayerGameState ? multiplayerGameState : localGameState;
  const { currentPlayer, gameOver, winner } = gameState;
  const isMultiplayer = !!(roomId && multiplayerGameState);
  
  // Enhanced animations
  const opacity = useSharedValue(0);
  const dotScale = useSharedValue(0.8);
  const dotGlow = useSharedValue(0);

  useEffect(() => {
    // Entrance animation
    opacity.value = withTiming(1, { duration: 400, easing: Easing.out(Easing.quad) });
    dotScale.value = withSequence(
      withTiming(1.3, { duration: 200, easing: Easing.out(Easing.quad) }),
      withTiming(1, { duration: 200, easing: Easing.inOut(Easing.quad) })
    );

    // Dot pulse for active states
    const isActiveState = !gameOver && ((roomId && currentPlayer === playerRole) || !roomId);
    if (isActiveState) {
      dotGlow.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.quad) }),
          withTiming(0.3, { duration: 1200, easing: Easing.inOut(Easing.quad) })
        ),
        -1
      );
    } else {
      dotGlow.value = withTiming(0, { duration: 300 });
    }
  }, [currentPlayer, gameOver, roomId, playerRole]);

  // Check if this is a random match
  const isRandomMatch = currentPlayerName?.includes('[RANDOM]') || 
                        opponent?.name?.includes('[RANDOM]');
  
  const getStatusMessage = (): string => {
    if (gameOver) {
      if (roomId && playerRole) {
        if (isAutoRestarting) {
          return winner === playerRole ? "You win! New game starting..." : 
                 (gameState.winningLine ? "You lose! New game starting..." : "You lose! (Time's up) New game starting...");
        }
        return winner === playerRole ? "You win! New game in 5s..." : 
               (gameState.winningLine ? "You lose! New game in 5s..." : "You lose! (Time's up) New game in 5s...");
      } else {
        return `Player ${winner} wins!`;
      }
    } else {
      if (roomId) {
        if (!opponent) {
          if (isRandomMatch) {
            return "Random matchmaking - Waiting for new opponent...";
          }
          return "Waiting for opponent...";
        }
        if (gameState.moveCount === 0) {
          if (isAutoRestarting) {
            return "New game started!";
          }
          return currentPlayer === playerRole ? "Your turn - Make the first move!" : 
                 `Waiting for ${opponent ? cleanPlayerName(opponent.name) : 'opponent'} to start...`;
        }
        return currentPlayer === playerRole ? "Your turn" : 
               `${opponent ? cleanPlayerName(opponent.name) : 'Opponent'}'s turn`;
      } else {
        return `Player ${currentPlayer}'s turn`;
      }
    }
  };

  const getStatusColor = () => {
    if (gameOver) {
      if (roomId && playerRole) {
        return winner === playerRole ? theme.success : theme.error;
      }
      return winner === 'X' ? theme.xColor : theme.oColor;
    }
    return currentPlayer === 'X' ? theme.xColor : theme.oColor;
  };

  // Animated styles
  const containerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const dotStyle = useAnimatedStyle(() => ({
    transform: [{ scale: dotScale.value }],
    shadowOpacity: 0.3 + (dotGlow.value * 0.4),
    elevation: 2 + (dotGlow.value * 6),
  }));

  const statusColor = getStatusColor();

  // Use different styling for local vs multiplayer
  if (isMultiplayer) {
    // Original multiplayer design
    return (
      <Animated.View style={[styles.container, containerStyle]}>
        <View style={[styles.multiplayerCard, { 
          backgroundColor: theme.cardBackground,
          borderColor: statusColor + '30',
          shadowColor: statusColor
        }]}>
          <View style={styles.multiplayerContent}>
            <Text 
              style={[styles.multiplayerText, { color: theme.textPrimary }]}
            >
              {getStatusMessage()}
            </Text>
          </View>
        </View>
      </Animated.View>
    );
  }

  // New minimal design for local games
  return (
    <Animated.View style={[styles.container, containerStyle]}>
      <View style={[styles.statusCard, { 
        backgroundColor: statusColor + (isDark ? '08' : '05'),
        borderColor: 'transparent'
      }]}>
        <View style={styles.content}>
          <Animated.View style={[
            styles.indicatorContainer,
            dotStyle,
            { shadowColor: statusColor }
          ]}>
            <View style={[styles.indicator, { backgroundColor: statusColor }]} />
            <View style={[styles.indicatorGlow, { backgroundColor: statusColor + '30' }]} />
          </Animated.View>
          
          <Text 
            style={[styles.statusText, { color: theme.textPrimary }]}
          >
            {getStatusMessage()}
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: SIZES.small,
    paddingHorizontal: SIZES.medium,
    height: 60,
  },
  statusCard: {
    borderRadius: 16,
    paddingHorizontal: SIZES.medium + 4,
    paddingVertical: SIZES.small + 2,
    height: 44,
    width: 350,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small + 2,
    width: '100%',
    justifyContent: 'center',
  },
  indicatorContainer: {
    position: 'relative',
    width: 12,
    height: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowRadius: 8,
    flexShrink: 0,
  },
  indicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    zIndex: 2,
  },
  indicatorGlow: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    zIndex: 1,
  },
  statusText: {
    fontSize: SIZES.small + 2,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    lineHeight: SIZES.medium * 1.5,
    letterSpacing: 0,
    flex: 1,
  },
  multiplayerCard: {
    borderRadius: 16,
    paddingHorizontal: SIZES.medium + 4,
    paddingVertical: SIZES.small + 2,
    shadowRadius: 8,
    height: 50,
    width: 350,
    alignItems: 'center',
  },
  multiplayerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SIZES.small + 2,
    width: '100%',
    justifyContent: 'center',
  },
  multiplayerText: {
    fontSize: SIZES.small + 2,
    fontFamily: FONTS.medium,
    textAlign: 'center',
    lineHeight: SIZES.medium * 1.5,
    letterSpacing: 0,
    flex: 1,
  },
});

export default GameStatus;