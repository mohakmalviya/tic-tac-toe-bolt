import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { router } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';
import SupabaseMultiplayerLobby from '@/components/SupabaseMultiplayerLobby';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

export default function MultiplayerScreen() {
  const { roomId, opponent, connectionStatus } = useSupabaseMultiplayer();

  const goBack = () => {
    router.back();
  };

  // Show game only when both players are present
  const showGame = roomId !== null && opponent !== null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <TouchableOpacity style={styles.backButton} onPress={goBack}>
            <ArrowLeft size={24} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.title}>Multiplayer</Text>
          <Text style={styles.subtitle}>Online Game</Text>
          
          <View style={styles.connectionStatus}>
            <Text style={[
              styles.statusText,
              { color: connectionStatus === 'connected' ? COLORS.success : COLORS.error }
            ]}>
              {connectionStatus === 'connected' ? '🟢 Connected' : 
               connectionStatus === 'connecting' ? '🟡 Connecting...' : '🔴 Disconnected'}
            </Text>
          </View>
        </View>
        
        {!showGame && <SupabaseMultiplayerLobby />}
        
        {showGame && (
          <View style={styles.gameContainer}>
            <GameStatus />
            <GameBoard />
            <GameControls gameMode="multiplayer" />
          </View>
        )}
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
  connectionStatus: {
    marginTop: SIZES.small,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  gameContainer: {
    flex: 1,
  },
}); 