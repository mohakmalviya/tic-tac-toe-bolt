import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { FONTS, SIZES } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ArrowLeft, Gamepad2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';

export default function LocalGameScreen() {
  const { theme, isDark } = useTheme();

  const goBack = () => {
    router.back();
  };

  // Dynamic gradient colors for local game
  const backgroundGradient = isDark 
    ? [theme.background, theme.backgroundSecondary, theme.backgroundTertiary]
    : ['#E0F2FE', '#FEF3C7', '#F3E8FF', '#ECFDF5']; // Cyan -> Yellow -> Purple -> Green

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <TouchableOpacity style={[styles.backButton, { 
              backgroundColor: theme.cardBackground,
              shadowColor: isDark ? theme.black : theme.shadowPiece,
            }]} onPress={goBack}>
              <ArrowLeft size={24} color={theme.textPrimary} />
            </TouchableOpacity>
            
            <View style={[styles.headerIcon, { backgroundColor: theme.primary + '20' }]}>
              <Gamepad2 size={28} color={theme.primary} />
            </View>
            
            <Text style={[styles.title, { color: theme.textPrimary }]}>Local Game</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Pass & Play</Text>
          </View>
          
          <View style={styles.gameArea}>
            <GameStatus />
            <GameBoard />
          </View>
          
          <View style={styles.controlsArea}>
            <GameControls gameMode="local" />
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
    padding: SIZES.small,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.xSmall,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 24,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginTop: SIZES.xSmall,
  },
  gameArea: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlsArea: {
    paddingBottom: SIZES.large,
    paddingTop: SIZES.small,
  },
}); 