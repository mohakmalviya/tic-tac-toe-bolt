import React, { useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { Users, Smartphone, Sparkles, Play, Zap, Star, Heart } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withRepeat,
  withSequence,
  Easing,
  interpolate,
  withDelay
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, isDark } = useTheme();

  // Animation values
  const logoScale = useSharedValue(1);
  const logoRotation = useSharedValue(0);
  const sparkleRotation = useSharedValue(0);
  const floatingElements = useSharedValue(0);
  const gameButtonsPulse = useSharedValue(1);
  const featureGlow = useSharedValue(0);
  const dotsAnimation = useSharedValue(0);

  useEffect(() => {
    // Logo breathing animation
    logoScale.value = withRepeat(
      withSequence(
        withTiming(1.05, { duration: 2500, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 2500, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    // Sparkle rotation
    sparkleRotation.value = withRepeat(
      withTiming(360, { duration: 4000, easing: Easing.linear }),
      -1
    );

    // Floating elements animation
    floatingElements.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 6000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0, { duration: 6000, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    // Game buttons pulse
    gameButtonsPulse.value = withRepeat(
      withSequence(
        withTiming(1.02, { duration: 3000, easing: Easing.inOut(Easing.sin) }),
        withTiming(1, { duration: 3000, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    // Feature section glow
    featureGlow.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 4000, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.3, { duration: 4000, easing: Easing.inOut(Easing.sin) })
      ),
      -1
    );

    // Footer dots sequential animation
    dotsAnimation.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.sin) }),
      -1
    );
  }, []);

  const navigateToLocalGame = () => {
    router.push('/local-game');
  };

  const navigateToMultiplayer = () => {
    router.push('/multiplayer');
  };

  // Dynamic gradient colors based on theme
  const backgroundGradient = isDark 
    ? ['#0F172A', '#1E293B', '#334155']
    : [theme.background, theme.backgroundSecondary, theme.backgroundTertiary, theme.backgroundDark];

  const localGameGradient = isDark
    ? ['#4338CA', '#6366F1']
    : ['#667eea', '#764ba2'];

  const multiplayerGradient = isDark
    ? ['#DC2626', '#EF4444']
    : ['#f093fb', '#f5576c'];

  const featureGradient = isDark
    ? [theme.cardBackground, theme.backgroundSecondary]
    : [theme.white, '#F8FAFC'];

  // Animated styles
  const logoAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const sparkleAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${sparkleRotation.value}deg` }],
  }));

  const floatingStyle1 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -15]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 8]) },
      { rotate: `${floatingElements.value * 20}deg` }
    ],
    opacity: 0.4 + (floatingElements.value * 0.6),
  }));

  const floatingStyle2 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, 12]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, -6]) },
      { rotate: `${-floatingElements.value * 15}deg` }
    ],
    opacity: 0.3 + (floatingElements.value * 0.7),
  }));

  const floatingStyle3 = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(floatingElements.value, [0, 1], [0, -10]) },
      { translateX: interpolate(floatingElements.value, [0, 1], [0, 4]) },
      { rotate: `${floatingElements.value * 12}deg` }
    ],
    opacity: 0.5 + (floatingElements.value * 0.5),
  }));

  const gameButtonsAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: gameButtonsPulse.value }],
  }));

  const featureGlowStyle = useAnimatedStyle(() => ({
    shadowOpacity: 0.1 + (featureGlow.value * 0.15),
    elevation: 4 + (featureGlow.value * 6),
  }));

  const dot1Style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (Math.sin(dotsAnimation.value * 2 * Math.PI) * 0.3) }],
    opacity: 0.7 + (Math.sin(dotsAnimation.value * 2 * Math.PI) * 0.3),
  }));

  const dot2Style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (Math.sin((dotsAnimation.value + 0.33) * 2 * Math.PI) * 0.3) }],
    opacity: 0.7 + (Math.sin((dotsAnimation.value + 0.33) * 2 * Math.PI) * 0.3),
  }));

  const dot3Style = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + (Math.sin((dotsAnimation.value + 0.66) * 2 * Math.PI) * 0.3) }],
    opacity: 0.7 + (Math.sin((dotsAnimation.value + 0.66) * 2 * Math.PI) * 0.3),
  }));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        {/* Floating decorative elements */}
        <Animated.View style={[styles.floatingElement1, floatingStyle1]}>
          <Star size={16} color={theme.primary + '60'} />
        </Animated.View>
        <Animated.View style={[styles.floatingElement2, floatingStyle2]}>
          <Heart size={14} color={theme.secondary + '70'} />
        </Animated.View>
        <Animated.View style={[styles.floatingElement3, floatingStyle3]}>
          <Sparkles size={12} color={theme.warning + '80'} />
        </Animated.View>

        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <Animated.View style={[styles.logoBackground, logoAnimatedStyle, { 
                backgroundColor: theme.cardBackground,
                borderColor: isDark ? theme.border : '#FEF3C7',
                shadowColor: theme.warning,
              }]}>
                <Animated.View style={sparkleAnimatedStyle}>
                  <Sparkles size={40} color={theme.warning} />
                </Animated.View>
              </Animated.View>
            </View>
            
            <View style={styles.titleContainer}>
              <Text style={[styles.title, { color: theme.textPrimary }]}>Tic-Tac-Toe</Text>
              <View style={styles.subtitleContainer}>
                <LinearGradient
                  colors={[theme.primary, theme.secondary]}
                  style={styles.subtitleGradient}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={[styles.subtitle, { color: theme.white }]}>Bolt Edition</Text>
                </LinearGradient>
              </View>
            </View>
            
            <Text style={[styles.description, { color: theme.textSecondary }]}>
              Experience the classic game with strategic depth and modern gameplay
            </Text>
          </View>
          
          {/* Game Modes Section */}
          <View style={styles.gameModesSection}>
            <Animated.View style={gameButtonsAnimatedStyle}>
              <TouchableOpacity 
                style={[styles.gameModeButton, styles.localGameButton]} 
                onPress={navigateToLocalGame}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={localGameGradient}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.buttonContent}>
                    <View style={styles.iconWrapper}>
                      <View style={styles.iconBackground}>
                        <Smartphone size={32} color={theme.white} />
                      </View>
                    </View>
                    <View style={styles.textWrapper}>
                      <Text style={[styles.gameModeTitle, { color: theme.white }]}>Local Game</Text>
                      <Text style={[styles.gameModeDescription, { color: theme.white, opacity: 0.9 }]}>
                        Pass & play with friends on same device
                      </Text>
                    </View>
                    <View style={styles.playIcon}>
                      <Play size={20} color={theme.white} fill={theme.white} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>

            <Animated.View style={gameButtonsAnimatedStyle}>
              <TouchableOpacity 
                style={[styles.gameModeButton, styles.multiplayerButton]} 
                onPress={navigateToMultiplayer}
                activeOpacity={0.85}
              >
                <LinearGradient
                  colors={multiplayerGradient}
                  style={styles.gradientBackground}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                >
                  <View style={styles.buttonContent}>
                    <View style={styles.iconWrapper}>
                      <View style={styles.iconBackground}>
                        <Users size={32} color={theme.white} />
                      </View>
                    </View>
                    <View style={styles.textWrapper}>
                      <Text style={[styles.gameModeTitle, { color: theme.white }]}>Multiplayer</Text>
                      <Text style={[styles.gameModeDescription, { color: theme.white, opacity: 0.9 }]}>
                        Play online with friends using room codes
                      </Text>
                    </View>
                    <View style={styles.playIcon}>
                      <Zap size={20} color={theme.white} fill={theme.white} />
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Feature Section */}
          <Animated.View style={[styles.featureSection, featureGlowStyle]}>
            <LinearGradient
              colors={featureGradient}
              style={styles.featureGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 0, y: 1 }}
            >
              <View style={styles.featureContent}>
                <View style={styles.featureIconContainer}>
                  <LinearGradient
                    colors={[theme.warning, '#F59E0B']}
                    style={styles.featureIconGradient}
                  >
                    <Sparkles size={16} color={theme.white} />
                  </LinearGradient>
                </View>
                <Text style={[styles.featureText, { color: theme.textSecondary }]}>
                  Special piece lifecycle: <Text style={[styles.featureHighlight, { color: theme.primary }]}>Active → Shadowed → Removed</Text>
                </Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Ready to challenge your strategic thinking?
            </Text>
            <View style={styles.footerDots}>
              <Animated.View style={[styles.dot, { backgroundColor: theme.primary }, dot1Style]} />
              <Animated.View style={[styles.dot, { backgroundColor: theme.secondary }, dot2Style]} />
              <Animated.View style={[styles.dot, { backgroundColor: theme.warning }, dot3Style]} />
            </View>
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
    paddingHorizontal: SIZES.large,
    paddingTop: SIZES.large,
    paddingBottom: SIZES.large,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  logoContainer: {
    marginBottom: SIZES.medium,
  },
  logoBackground: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
    borderWidth: 2,
  },
  titleContainer: {
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: width * 0.095,
    textAlign: 'center',
    letterSpacing: -2,
    textShadowColor: 'rgba(0,0,0,0.1)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitleContainer: {
    marginTop: SIZES.small,
    borderRadius: 20,
    overflow: 'hidden',
  },
  subtitleGradient: {
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.xSmall,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: SIZES.small,
  },
  gameModesSection: {
    marginBottom: SIZES.large,
    gap: SIZES.large,
  },
  gameModeButton: {
    borderRadius: 24,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  localGameButton: {
    shadowColor: '#667eea',
  },
  multiplayerButton: {
    shadowColor: '#f093fb',
  },
  gradientBackground: {
    minHeight: 90,
  },
  buttonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: SIZES.large,
  },
  iconWrapper: {
    marginRight: SIZES.medium,
  },
  iconBackground: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  textWrapper: {
    flex: 1,
  },
  gameModeTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginBottom: SIZES.xSmall,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  gameModeDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    opacity: 0.95,
    lineHeight: 18,
  },
  playIcon: {
    marginLeft: SIZES.small,
    opacity: 0.8,
  },
  featureSection: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: SIZES.large,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  featureGradient: {
    padding: SIZES.medium,
  },
  featureContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  featureIconContainer: {
    marginRight: SIZES.medium,
  },
  featureIconGradient: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  featureText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    flex: 1,
    lineHeight: 18,
  },
  featureHighlight: {
    fontFamily: FONTS.bold,
  },
  footer: {
    alignItems: 'center',
  },
  footerText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: 'center',
    fontStyle: 'italic',
    marginBottom: SIZES.small,
  },
  footerDots: {
    flexDirection: 'row',
    gap: SIZES.xSmall,
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  floatingElement1: {
    position: 'absolute',
    top: '15%',
    right: '10%',
    zIndex: 1,
  },
  floatingElement2: {
    position: 'absolute',
    top: '40%',
    left: '8%',
    zIndex: 1,
  },
  floatingElement3: {
    position: 'absolute',
    bottom: '25%',
    right: '15%',
    zIndex: 1,
  },
});