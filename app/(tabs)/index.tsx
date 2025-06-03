import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { GameProvider } from '@/contexts/GameContext';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';

export default function GameScreen() {
  return (
    <GameProvider>
      <SafeAreaView style={styles.container}>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.header}>
            <Text style={styles.title}>Tic-Tac-Toe</Text>
            <Text style={styles.subtitle}>Special Edition</Text>
          </View>
          
          <GameStatus />
          <GameBoard />
          <GameControls />
          
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Pieces cycle through: Active → Shadowed → Removed
            </Text>
          </View>
        </ScrollView>
      </SafeAreaView>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: SIZES.xxLarge,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xxLarge,
    paddingBottom: SIZES.large,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.xSmall,
  },
  footer: {
    marginTop: SIZES.xxLarge,
    alignItems: 'center',
    paddingHorizontal: SIZES.large,
  },
  footerText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
});