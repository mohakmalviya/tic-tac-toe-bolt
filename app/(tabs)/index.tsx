import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';
import MultiplayerLobby from '@/components/MultiplayerLobby';
import { useMultiplayer } from '@/contexts/MultiplayerContext';

type GameMode = 'local' | 'multiplayer';

export default function GameScreen() {
  const [gameMode, setGameMode] = useState<GameMode>('local');
  const { isConnected, roomId, connectionStatus } = useMultiplayer();

  const showMultiplayerGame = gameMode === 'multiplayer' && roomId;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Tic-Tac-Toe</Text>
          <Text style={styles.subtitle}>Special Edition</Text>
          
          {gameMode === 'multiplayer' && (
            <View style={styles.connectionStatus}>
              <Text style={[
                styles.statusText,
                { color: connectionStatus === 'connected' ? COLORS.success : COLORS.error }
              ]}>
                {connectionStatus === 'connected' ? '🟢 Connected' : 
                 connectionStatus === 'connecting' ? '🟡 Connecting...' : '🔴 Disconnected'}
              </Text>
            </View>
          )}
        </View>
        
        {!showMultiplayerGame && (
          <MultiplayerLobby 
            gameMode={gameMode} 
            onGameModeChange={setGameMode}
          />
        )}
        
        {(gameMode === 'local' || showMultiplayerGame) && (
          <>
            <GameStatus />
            <GameBoard />
            <GameControls gameMode={gameMode} />
          </>
        )}
        
        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Pieces cycle through: Active → Shadowed → Removed
          </Text>
        </View>
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