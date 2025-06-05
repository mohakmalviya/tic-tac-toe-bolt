import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { Users, Smartphone, Sparkles, Play, Zap } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';

const { width, height } = Dimensions.get('window');

export default function HomeScreen() {
  const { theme, isDark } = useTheme();

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

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Background Gradient */}
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.heroSection}>
            <View style={styles.logoContainer}>
              <View style={[styles.logoBackground, { 
                backgroundColor: theme.cardBackground,
                borderColor: isDark ? theme.border : '#FEF3C7',
                shadowColor: theme.warning,
              }]}>
                <Sparkles size={40} color={theme.warning} />
              </View>
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
          </View>

          {/* Feature Section */}
          <View style={styles.featureSection}>
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
          </View>

          {/* Footer */}
          <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Ready to challenge your strategic thinking?
            </Text>
            <View style={styles.footerDots}>
              <View style={[styles.dot, { backgroundColor: theme.primary }]} />
              <View style={[styles.dot, { backgroundColor: theme.secondary }]} />
              <View style={[styles.dot, { backgroundColor: theme.warning }]} />
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
});