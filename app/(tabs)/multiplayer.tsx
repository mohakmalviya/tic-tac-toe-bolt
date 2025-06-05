import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, AppState, ScrollView, Alert } from 'react-native';
import { FONTS, SIZES, COLORS, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { router } from 'expo-router';
import { ArrowLeft, Users, X, Circle } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import GameBoard from '@/components/GameBoard';
import GameStatus from '@/components/GameStatus';
import GameControls from '@/components/GameControls';
import SupabaseMultiplayerLobby from '@/components/SupabaseMultiplayerLobby';
import OpponentLeftCard from '@/components/OpponentLeftCard';
import { handleLobbyBackNavigation } from '@/components/SupabaseMultiplayerLobby';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';
import { useGame } from '@/contexts/GameContext';
import TurnTimer from '@/components/TurnTimer';

const cleanPlayerName = (name: string): string => {
  if (!name) return '';
  // Remove any version of the [RANDOM] tag with case insensitivity and global flag
  return name.replace(/\[RANDOM\][\s]*/gi, '');
};

export default function MultiplayerScreen() {
  const { theme, isDark } = useTheme();
  const { 
    roomId, 
    opponent, 
    connectionStatus, 
    leaveRoom, 
    playerRole, 
    currentPlayerName, 
    gameState: multiplayerGameState,
    onTurnTimeout,
    isAutoRestarting,
    isOpponentDisconnected,
    continueWaitingForOpponent
  } = useSupabaseMultiplayer();
  const { gameState: localGameState } = useGame();
  const hasCleanedUp = useRef(false);
  const [hasEverHadOpponent, setHasEverHadOpponent] = useState(false);

  // Track if we've ever had an opponent to prevent going back to lobby
  useEffect(() => {
    if (opponent && !hasEverHadOpponent) {
      setHasEverHadOpponent(true);
    }
  }, [opponent, hasEverHadOpponent]);

  // Reset hasEverHadOpponent when room changes
  useEffect(() => {
    if (roomId) {
      hasCleanedUp.current = false;
      // Don't reset hasEverHadOpponent here, let it persist within the room
    } else {
      setHasEverHadOpponent(false);
    }
  }, [roomId]);

  const goBack = () => {
    console.log('🔙 Back button pressed!');
    console.log('Current state:', {
      roomId: !!roomId,
      hasRoomId: roomId !== null,
      opponent: !!opponent,
      isOpponentDisconnected,
      hasEverHadOpponent
    });
    
    // Check if the lobby can handle back navigation (for multi-level navigation within multiplayer)
    if (handleLobbyBackNavigation && handleLobbyBackNavigation(roomId)) {
      console.log('📱 Lobby handled back navigation');
      return;
    }
    
    if (roomId) {
      console.log('🏠 In a room, asking user...');
      Alert.alert(
        "Leave Room?",
        "Are you sure you want to leave this room?",
        [
          { text: "Cancel", style: "cancel" },
          { 
            text: "Leave", 
            style: "destructive",
            onPress: () => {
              console.log('✅ User confirmed, leaving room and going back to home');
              leaveRoom();
              // Navigate back to home tab
              router.replace('/');
            }
          }
        ]
      );
    } else {
      console.log('📱 No room, going back to home tab');
      // Navigate back to home tab since we're in tab-based navigation
      router.replace('/');
    }
  };

  useEffect(() => {
    const handleAppStateChange = (nextAppState: string) => {
      if (nextAppState === 'background' && roomId && !hasCleanedUp.current) {
        const cleanupTimeout = setTimeout(() => {
          if (roomId && !hasCleanedUp.current) {
            console.log('App backgrounded for extended period, cleaning up room:', roomId);
            hasCleanedUp.current = true;
            leaveRoom();
          }
        }, 10000);
        const foregroundSubscription = AppState.addEventListener('change', (state: string) => {
          if (state === 'active') {
            clearTimeout(cleanupTimeout);
            foregroundSubscription?.remove();
          }
        });
      }
    };
    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => {
      subscription?.remove();
    };
  }, [roomId, leaveRoom]);

  const handleOpponentLeftCardLeave = () => {
    if (!hasCleanedUp.current) {
      hasCleanedUp.current = true;
      leaveRoom();
    }
    // Don't navigate away - just let the screen show the lobby when roomId becomes null
  };

  // Improved logic: show game if we have a room AND (currently have opponent OR disconnected OR ever had opponent)
  const showGame = roomId !== null && (opponent !== null || isOpponentDisconnected || hasEverHadOpponent);
  
  // Add debug logging
  console.log('MultiplayerScreen showGame logic:', {
    roomId: !!roomId,
    opponent: !!opponent,
    isOpponentDisconnected,
    hasEverHadOpponent,
    showGame
  });

  const gameContextState = roomId && multiplayerGameState ? multiplayerGameState : localGameState;
  const { scores, turnStartTime, turnTimeLimit, currentPlayer, gameOver } = gameContextState;
  const isCurrentPlayerTurn = roomId && multiplayerGameState ? multiplayerGameState.currentPlayer === playerRole : false;

  const getPlayerLabel = (playerSymbol: 'X' | 'O') => {
    if (roomId && playerRole && currentPlayerName) {
      if (playerSymbol === playerRole) {
        return `${currentPlayerName} (You)`;
      }
      // Show "N/A" when opponent is disconnected
      if (isOpponentDisconnected || !opponent) {
        return "N/A";
      }
      return cleanPlayerName(opponent.name);
    }
    return `Player ${playerSymbol}`;
  };

  const backgroundGradient = isDark 
    ? [theme.background, theme.backgroundSecondary, theme.backgroundTertiary]
    : ['#F3E8FF', '#FECACA', '#FEF3C7', '#DBEAFE'];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            style={[styles.backButton, { 
              backgroundColor: theme.cardBackground,
              shadowColor: isDark ? theme.black : theme.shadowPiece,
            }]} 
            onPress={goBack}
            activeOpacity={0.7}
          >
            <ArrowLeft size={24} color={theme.textPrimary} />
          </TouchableOpacity>
          <View style={[styles.headerIcon, { backgroundColor: theme.secondary + '20' }]}>
            <Users size={28} color={theme.secondary} />
          </View>
          <Text style={[styles.title, { color: theme.textPrimary }]}>Multiplayer</Text>
          <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Online Game</Text>
          <View style={styles.connectionStatus}>
            <Text style={[
              styles.statusText,
              { color: connectionStatus === 'connected' ? theme.success : theme.error }
            ]}>
              {connectionStatus === 'connected' ? '🟢 Connected' : 
               connectionStatus === 'connecting' ? '🟡 Connecting...' : '🔴 Disconnected'}
            </Text>
          </View>
          {showGame && (
            <View style={styles.headerStatusMessageContainer}>
              <GameStatus />
            </View>
          )}
        </View>
        
        {!showGame ? (
          <ScrollView 
            style={styles.lobbyScrollArea}
            contentContainerStyle={styles.lobbyContent}
            showsVerticalScrollIndicator={false}
          >
            <SupabaseMultiplayerLobby />
          </ScrollView>
        ) : (
          <View style={styles.gameContainer}>
            <View style={styles.timerSection}>
              <TurnTimer
                turnStartTime={turnStartTime || new Date()}
                timeLimit={turnTimeLimit}
                isCurrentPlayerTurn={isCurrentPlayerTurn}
                onTimeout={onTurnTimeout}
                shouldShow={!!roomId && !!opponent && !gameOver && !isAutoRestarting}
              />
            </View>
            
            <View style={styles.boardAndScoresWrapper}>
              <View style={styles.scoreSection}>
                <View style={[styles.scoreBox, {backgroundColor: theme.cardBackground}]}>
                  <X color={theme.xColor} size={18} strokeWidth={2.5} />
                  <Text style={[styles.playerLabel, {color: theme.textSecondary}]} numberOfLines={2}>
                    {getPlayerLabel('X')}
                  </Text>
                  <Text style={[styles.scoreText, {color: theme.textPrimary}]}>{scores.X}</Text>
                </View>
                <View style={[styles.scoreBox, {backgroundColor: theme.cardBackground}]}>
                  <Circle color={theme.oColor} size={18} strokeWidth={2.5} />
                  <Text style={[styles.playerLabel, {color: theme.textSecondary}]} numberOfLines={2}>
                    {getPlayerLabel('O')}
                  </Text>
                  <Text style={[styles.scoreText, {color: theme.textPrimary}]}>{scores.O}</Text>
                </View>
              </View>

              <View style={styles.boardSection}>
                <GameBoard />
              </View>
            </View>
            
            <View style={styles.controlsSection}>
              <GameControls gameMode="multiplayer" />
            </View>
          </View>
        )}
        
        {/* OpponentLeftCard overlay */}
        <OpponentLeftCard onLeave={handleOpponentLeftCardLeave} />
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
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xLarge + SIZES.medium,
    paddingBottom: SIZES.small,
    paddingHorizontal: SIZES.medium,
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: SIZES.medium,
    top: SIZES.xLarge + SIZES.medium,
    padding: SIZES.small,
    borderRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    zIndex: 10,
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
    fontSize: SIZES.xLarge,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    marginTop: SIZES.xSmall,
  },
  connectionStatus: {
    marginTop: SIZES.xSmall,
  },
  statusText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  headerStatusMessageContainer: {
    marginTop: SIZES.small,
    minHeight: SIZES.medium + SIZES.xSmall,
    alignItems: 'center',
    justifyContent: 'center',
  },
  lobbyScrollArea: {
    flex: 1,
    paddingHorizontal: SIZES.medium,
  },
  lobbyContent: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingBottom: SIZES.large,
  },
  gameContainer: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
  },
  timerSection: {
    position: 'absolute',
    top: -4,
    left: 0,
    right: 0,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  boardAndScoresWrapper: {
    flex: 1,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.small,
  },
  scoreSection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    gap: SIZES.medium,
    paddingHorizontal: SIZES.small,
    flexShrink: 0,
    zIndex: 1,
    minHeight: SIZES.cellSize - SIZES.small,
  },
  scoreBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.xSmall / 1.5,
    top: 20,
    left: 0,
    right: 0,
    borderRadius: 10,
    maxWidth: 100,
    ...SHADOWS.small,
  },
  playerLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginTop: 4,
    textAlign: 'center',
    paddingHorizontal: SIZES.xSmall,
  },
  scoreText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    marginTop: 4,
  },
  boardSection: {
    flex: 1,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: SIZES.small,
    top: 10,
    left: 0,
    right: 0
  },
  controlsSection: {
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
    marginTop: SIZES.small,
  },
}); 