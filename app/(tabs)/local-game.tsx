import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ArrowLeft, Gamepad2, Sparkles, Zap, Star } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing,
  interpolate
} from 'react-native-reanimated';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';

export default function LocalGameScreen() {
  const { theme, isDark } = useTheme();

  // Balanced animation values
  const sparkleRotation = useSharedValue(0);
  const pulseScale = useSharedValue(1);
  const headerGlow = useSharedValue(0);
  const floatingElements = useSharedValue(0);

  useEffect(() => {
    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1
    );

    // Header icon pulse animation
    pulseScale.value = withRepeat(
      withSequence(
        withTiming(1.1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    // Header glow effect
    headerGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    // Floating elements
    floatingElements.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 5000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 5000, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );
  }, []);

  const goBack = () => {
    router.back();
  };

  // Enhanced gradient colors
  const backgroundGradient = isDark 
    ? [theme.background, theme.backgroundSecondary, theme.backgroundTertiary, theme.background]
    : ['#E0F2FE', '#FEF3C7', '#F3E8FF', '#ECFDF5', '#E0F2FE'];

  // Animated styles
  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const pulseAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: pulseScale.value }],
  }));

  const headerGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.2 + (headerGlow.value * 0.3),
    elevation: 8 + (headerGlow.value * 8),
  }));

  const floatingStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -12]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 6]) },
      { rotate: `${floatingElements.value * 15}deg` }
    ],
    opacity: 0.6 + (floatingElements.value * 0.4),
  }));

  const floatingStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, 10]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, -4]) },
      { rotate: `${-floatingElements.value * 12}deg` }
    ],
    opacity: 0.5 + (floatingElements.value * 0.5),
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating decorative elements */}
        <Animated.View style={[styles.floatingElement1, floatingStyle1]}>
          <Sparkles size={20} color={theme.primary + '70'} />
        </Animated.View>
        <Animated.View style={[styles.floatingElement2, floatingStyle2]}>
          <Zap size={16} color={theme.secondary + '80'} />
        </Animated.View>
        <Animated.View style={[styles.floatingElement3, floatingStyle1]}>
          <Star size={14} color={theme.primary + '60'} />
        </Animated.View>

        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={[styles.backButton, { 
              backgroundColor: theme.cardBackground,
              shadowColor: isDark ? theme.black : theme.shadowPiece,
            }]} onPress={goBack}>
              <ArrowLeft size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            
            <Animated.View style={[styles.headerIconContainer, headerGlowStyle, pulseAnimatedStyle]}>
              <LinearGradient
                colors={[theme.primary + '30', theme.primary + '15', theme.primary + '25']}
                style={styles.headerIconGradient}
              >
                <View style={[styles.headerIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Gamepad2 size={28} color={theme.primary} />
                  <Animated.View style={[styles.sparkleIcon, sparkleAnimatedStyle]}>
                    <Sparkles size={12} color={theme.primary} />
                  </Animated.View>
                </View>
              </LinearGradient>
            </Animated.View>
            
            <Text style={[styles.title, { color: theme.textPrimary }]}>Local Game</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Pass & Play</Text>
            
            <View style={styles.statusWrapper}>
              <GameStatus />
            </View>
          </View>
          
          <View style={styles.gameArea}>
            <View style={[styles.boardContainer, { 
              shadowColor: theme.primary,
              shadowOpacity: 0.15,
              shadowRadius: 15,
              elevation: 12 
            }]}>
              <GameBoard />
            </View>
          </View>
          
          <View style={[styles.controlsArea, { backgroundColor: theme.cardBackground + '40' }]}>
            <LinearGradient
              colors={['rgba(255,255,255,0.06)', 'transparent', 'rgba(255,255,255,0.02)']}
              style={styles.controlsGradient}
            >
              <GameControls gameMode="local" />
            </LinearGradient>
          </View>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundGradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.medium,
    paddingBottom: SIZES.small,
    paddingHorizontal: SIZES.medium,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: SIZES.medium,
    top: SIZES.medium + SIZES.small,
    padding: SIZES.small + 1,
    borderRadius: 13,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.18,
    shadowRadius: 10,
    elevation: 5,
  },
  headerIconContainer: {
    borderRadius: 30,
    padding: 4,
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 15,
  },
  headerIconGradient: {
    borderRadius: 26,
    padding: 2,
  },
  headerIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xSmall,
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 7,
    position: 'relative',
  },
  sparkleIcon: {
    position: 'absolute',
    top: -6,
    right: -6,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginTop: SIZES.xSmall,
    opacity: 0.8,
  },
  statusWrapper: {
    marginTop: SIZES.medium + SIZES.small,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: SIZES.small,
  },
  boardContainer: {
    borderRadius: 24,
    padding: SIZES.xSmall + 1,
  },
  controlsArea: {
    paddingBottom: SIZES.large + SIZES.small,
    paddingTop: SIZES.small + 1,
    borderRadius: 20,
    marginHorizontal: SIZES.xSmall,
    marginBottom: SIZES.small,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  controlsGradient: {
    borderRadius: 18,
    padding: SIZES.small + 1,
  },
  floatingElement1: {
    position: 'absolute',
    top: '20%',
    right: '15%',
    zIndex: 1,
  },
  floatingElement2: {
    position: 'absolute',
    top: '35%',
    left: '10%',
    zIndex: 1,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '30%',
    right: '20%',
    zIndex: 1,
  },
}); 