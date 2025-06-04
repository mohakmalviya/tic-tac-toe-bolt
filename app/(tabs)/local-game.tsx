import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';

export default function LocalGameScreen() {
  const goBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Local Game</Text>
          <Text style={styles.subtitle}>Pass & Play</Text>
        </View>
        
        <GameStatus />
        <GameBoard />
        <GameControls gameMode="local" />
      </ScrollView>
    </SafeAreaView>
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
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: SIZES.large,
    top: SIZES.xxLarge + SIZES.small,
    padding: SIZES.small,
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
}); 