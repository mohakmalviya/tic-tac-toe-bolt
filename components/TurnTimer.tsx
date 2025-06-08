import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { FONTS, SIZES } from '@/constants/theme';
import { Clock } from 'lucide-react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  interpolateColor 
} from 'react-native-reanimated';

const { height: screenHeight } = Dimensions.get('window');
const isSmallScreen = screenHeight < 700;
const isMediumScreen = screenHeight >= 700 && screenHeight < 850;
const isLargeScreen = screenHeight >= 850;

// Calculate responsive sizing
const getResponsiveSize = (small: number, medium: number, large: number) => {
  if (isSmallScreen) return small;
  if (isMediumScreen) return medium;
  return large;
};

interface TurnTimerProps {
  turnStartTime: Date;
  timeLimit: number; // in seconds
  isCurrentPlayerTurn: boolean;
  onTimeout: () => void;
  shouldShow: boolean; // Controls whether timer is visible
}

const TurnTimer: React.FC<TurnTimerProps> = ({ 
  turnStartTime, 
  timeLimit, 
  isCurrentPlayerTurn,
  onTimeout,
  shouldShow
}) => {
  const { theme } = useTheme();
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const progress = useSharedValue(1);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }

    if (shouldShow) {
      const now = new Date();
      const elapsedInitial = Math.floor((now.getTime() - turnStartTime.getTime()) / 1000);
      const initialRemaining = Math.max(0, timeLimit - elapsedInitial);
      setTimeLeft(initialRemaining);
      progress.value = withTiming(initialRemaining / timeLimit, { duration: 0 });

      intervalRef.current = setInterval(() => {
        const currentNow = new Date();
        const elapsed = Math.floor((currentNow.getTime() - turnStartTime.getTime()) / 1000);
      const remaining = Math.max(0, timeLimit - elapsed);
      
      setTimeLeft(remaining);
      progress.value = withTiming(remaining / timeLimit, { duration: 100 });
      
      if (remaining === 0 && isCurrentPlayerTurn) {
        onTimeout();
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
      }
      }, 100);
    } else {
      setTimeLeft(timeLimit);
      progress.value = withTiming(1, { duration: 100 });
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [turnStartTime, timeLimit, isCurrentPlayerTurn, onTimeout, shouldShow]);

  const timerBarStyle = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 0.3, 1],
      [theme.error, theme.warning, theme.success]
    );
    
    return {
      backgroundColor,
    };
  });

  const progressBarStyle = useAnimatedStyle(() => ({
    width: `${progress.value * 100}%`,
    backgroundColor: interpolateColor(
      progress.value,
      [0, 0.3, 1],
      [theme.error, theme.warning, theme.success]
    ),
  }));

  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  if (!shouldShow) {
    return null;
  }

  return (
    <View style={styles.container}>
          <Animated.View style={[styles.timerBar, timerBarStyle]}>
            <View style={styles.content}>
              <Clock size={16} color={theme.white} />
              <Text style={[styles.timerText, { color: theme.white }]}>
                {formatTime(timeLeft)}s
              </Text>
            </View>
          </Animated.View>
          
          <Text style={[styles.turnText, { color: theme.textSecondary }]}>
            {isCurrentPlayerTurn ? "Your turn" : "Opponent's turn"}
          </Text>
          
      {/* <View style={[styles.progressTrack, { backgroundColor: theme.border }]}> 
            <Animated.View style={[styles.progressBar, progressBarStyle]} />
      </View> */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    paddingHorizontal: SIZES.small,
  },
  timerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SIZES.small,
    paddingVertical: 4,
    borderRadius: 16,
    minWidth: 80,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.xSmall,
  },
  timerText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  turnText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: SIZES.xSmall,
  },
  // Removed progressTrack and progressBar styles
});

export default TurnTimer; 