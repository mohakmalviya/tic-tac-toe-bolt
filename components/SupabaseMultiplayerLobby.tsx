import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
  Clipboard,
} from 'react-native';
import { FONTS, SIZES, SHADOWS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { Copy, Users, Wifi, Shuffle, UserPlus } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';
import { supabase } from '@/utils/supabase';

// Simple global state for back navigation
let shouldHandleBackNavigation = false;
let resetLobbyMode: (() => void) | null = null;
// Track if current game is a random matchmaking game
let isRandomMatchmaking = false;

export const handleLobbyBackNavigation = (currentRoomId?: string | null) => {
  console.log('handleLobbyBackNavigation called:', {
    currentRoomId: !!currentRoomId,
    shouldHandleBackNavigation,
    hasResetFunction: !!resetLobbyMode
  });
  
  // Don't handle back navigation if we're currently in a room
  if (currentRoomId) {
    console.log('In a room, lobby should not handle back navigation');
    return false;
  }
  
  if (shouldHandleBackNavigation && resetLobbyMode) {
    console.log('Lobby handling back navigation - resetting lobby mode');
    resetLobbyMode();
    return true;
  }
  console.log('Lobby not handling back navigation');
  return false;
};

// Create a utility function to clean random match tags from names
const cleanPlayerName = (name: string): string => {
  if (!name) return '';
  // Remove any version of the [RANDOM] tag with case insensitivity and global flag
  return name.replace(/\[RANDOM\][\s]*/gi, '');
};

export default function SupabaseMultiplayerLobby() {
  const { theme } = useTheme();
  const [playerName, setPlayerName] = useState('');
  const [joinPlayerName, setJoinPlayerName] = useState('');
  const [randomPlayerName, setRandomPlayerName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  const [isJoiningRandomGame, setIsJoiningRandomGame] = useState(false);
  const [isCancellingMatchmaking, setIsCancellingMatchmaking] = useState(false);
  const [selectedMode, setSelectedMode] = useState<'none' | 'random' | 'friends'>('none');
  
  const { 
    isConnected, 
    roomId, 
    createRoom, 
    joinRoom, 
    leaveRoom, 
    opponent,
    connectionStatus,
    currentPlayerName
  } = useSupabaseMultiplayer();

  // Debug logging to see which UI state is being rendered
  console.log('🎮 SupabaseMultiplayerLobby render state:', {
    roomId: !!roomId,
    selectedMode,
    isJoiningRandomGame,
    connectionStatus,
    opponent: !!opponent
  });

  // Setup global back navigation
  useEffect(() => {
    const oldValue = shouldHandleBackNavigation;
    shouldHandleBackNavigation = selectedMode === 'friends' || selectedMode === 'random';
    console.log('Setting shouldHandleBackNavigation:', {
      selectedMode,
      oldValue,
      newValue: shouldHandleBackNavigation
    });
    
    resetLobbyMode = () => {
      console.log('resetLobbyMode called - resetting to none');
      setSelectedMode('none');
      setPlayerName('');
      setJoinPlayerName('');
      setRandomPlayerName('');
      setRoomIdInput('');
      isRandomMatchmaking = false;
    };
  }, [selectedMode]);

  // Reset selectedMode when we enter a room so lobby navigation doesn't interfere
  useEffect(() => {
    if (roomId) {
      console.log('Room entered, resetting selectedMode to none');
      // Don't reset selectedMode if we're in the process of cancelling matchmaking
      if (!isCancellingMatchmaking) {
        setSelectedMode('none');
      }
    }
  }, [roomId, isCancellingMatchmaking]);

  // Also reset global variables when component unmounts or when we shouldn't handle navigation
  useEffect(() => {
    if (selectedMode === 'none') {
      console.log('selectedMode is none, clearing global navigation state');
      shouldHandleBackNavigation = false;
      resetLobbyMode = null;
    }
  }, [selectedMode]);

  // Check if this is a random match based on player name or room state
  useEffect(() => {
    if (roomId) {
      // If we came from random matchmaking mode, set the flag
      if (selectedMode === 'random') {
        isRandomMatchmaking = true;
      }
      // Or if we have an opponent with [RANDOM] tag
      else if (opponent && opponent.name.includes('[RANDOM]')) {
        isRandomMatchmaking = true;
      }
      // Or if our own name has [RANDOM] tag (we joined a random match)
      else if (currentPlayerName && currentPlayerName.includes('[RANDOM]')) {
        isRandomMatchmaking = true;
      }
    } else {
      isRandomMatchmaking = false;
    }
  }, [currentPlayerName, roomId, opponent, selectedMode]);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to Supabase');
      return;
    }

    setIsCreatingRoom(true);
    try {
      await createRoom(playerName.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to create room: ' + (error as Error).message);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!joinPlayerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!roomIdInput.trim()) {
      Alert.alert('Error', 'Please enter room ID');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to Supabase');
      return;
    }

    setIsJoiningRoom(true);
    try {
      await joinRoom(roomIdInput.trim().toUpperCase(), joinPlayerName.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to join room: ' + (error as Error).message);
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const handleJoinRandomGame = () => {
    setSelectedMode('random');
  };

  const handleStartRandomMatchmaking = async () => {
    if (!randomPlayerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to Supabase');
      return;
    }

    setIsJoiningRandomGame(true);
    isRandomMatchmaking = true;
    try {
      // Create a room with the player's name
      // The random matchmaking will be handled by adding a special tag to the player name
      await createRoom(`[RANDOM] ${randomPlayerName.trim()}`);
      // The matching will happen automatically in the backend/context
    } catch (error) {
      Alert.alert('Error', 'Failed to join random match: ' + (error as Error).message);
      setIsJoiningRandomGame(false);
      isRandomMatchmaking = false;
    }
  };

  const handleCancelRandomMatchmaking = async () => {
    // Set cancellation flag immediately at the beginning
    // to prevent any UI flashes during the entire cancellation process
    setIsCancellingMatchmaking(true);
    
    try {
      console.log('CANCEL MATCHMAKING: Starting cancellation process');
      
      // Get the current roomId before any state changes
      const currentRoomId = roomId;
      
      // IMPORTANT: Call leaveRoom() first to properly clean up context state
      // But prevent it from changing our UI by using the cancellation flag
      if (currentRoomId) {
        try {
          console.log('Explicitly calling leaveRoom() to clean up context state');
          await leaveRoom();
          console.log('leaveRoom() completed successfully');
        } catch (leaveError) {
          console.error('Error in leaveRoom():', leaveError);
          // Even if leaveRoom fails, continue with manual cleanup
        }
      }
      
      // As a backup, manually delete the room from the database
      if (currentRoomId) {
        try {
          console.log('Manually deleting room as backup:', currentRoomId);
          
          // First delete game state (due to foreign key constraint)
          const { error: gameStateError } = await supabase
            .from('game_states')
            .delete()
            .eq('room_id', currentRoomId);
            
          if (gameStateError) {
            console.error('Error deleting game state:', gameStateError);
          }
          
          // Then delete room
          const { error: roomError } = await supabase
            .from('rooms')
            .delete()
            .eq('id', currentRoomId);
            
          if (roomError) {
            console.error('Error deleting room:', roomError);
          } else {
            console.log('Room deleted successfully:', currentRoomId);
          }
        } catch (deleteError) {
          console.error('Exception during manual room deletion:', deleteError);
        }
      }
      
      // Finally update UI state
      isRandomMatchmaking = false;
      setIsJoiningRandomGame(false);
      setRandomPlayerName('');
      
      // Redirect to the main multiplayer cards instead of staying in random mode
      setSelectedMode('none');
      
      // Short delay before clearing cancellation flag to prevent room screen from showing
      setTimeout(() => {
        setIsCancellingMatchmaking(false);
        console.log('Cancellation completed, flag cleared');
      }, 500); // Set a reasonable timeout that allows all state changes to complete
      
    } catch (error) {
      console.error('❌ Error in cancel matchmaking:', error);
      Alert.alert('Error', 'Failed to cancel matchmaking');
      
      // Reset UI state on error
      isRandomMatchmaking = false;
      setIsJoiningRandomGame(false);
      setRandomPlayerName('');
      setSelectedMode('none');
      
      // Clear cancellation flag with delay to ensure all state changes complete
      setTimeout(() => {
        setIsCancellingMatchmaking(false);
      }, 500);
    }
  };

  const handlePlayWithFriends = () => {
    setSelectedMode('friends');
  };

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
      isRandomMatchmaking = false;
      // Don't reset the mode if we're cancelling matchmaking
      if (!isCancellingMatchmaking) {
        // Return to the initial multiplayer view
        setSelectedMode('none');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to leave room: ' + (error as Error).message);
    }
  };

  const copyRoomId = async () => {
    if (roomId) {
      await Clipboard.setString(roomId);
      Alert.alert('Copied!', 'Room code copied to clipboard');
    }
  };

  // If in a room and not cancelling matchmaking, show room info
  if (roomId && !isCancellingMatchmaking && (selectedMode !== 'random' || isJoiningRandomGame)) {
    return (
      <View style={styles.container}>
        <View style={[styles.roomCard, { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.shadowPiece
        }, SHADOWS.medium]}>
          <LinearGradient
            colors={[theme.primary + '20', theme.primary + '10', theme.cardBackground]}
            style={styles.roomCardGradient}
          >
            <View style={styles.roomHeader}>
              <Wifi size={24} color={theme.success} />
              <Text style={[styles.roomTitle, { color: theme.textPrimary }]}>
                {isRandomMatchmaking ? 'Random Matchmaking' : 'Room Created Successfully!'}
              </Text>
            </View>
            
            {!isRandomMatchmaking && (
            <View style={styles.roomIdContainer}>
              <Text style={[styles.roomIdLabel, { color: theme.textSecondary }]}>Share this Room Code:</Text>
              <TouchableOpacity style={[styles.roomCodeBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]} onPress={copyRoomId}>
                <Text style={[styles.roomIdText, { color: theme.primary }]}>{roomId}</Text>
                <Copy size={20} color={theme.primary} />
              </TouchableOpacity>
              <Text style={[styles.roomIdSubtext, { color: theme.textSecondary }]}>Tap the code to copy • Share with friends to play</Text>
            </View>
            )}
            
            {opponent ? (
              <View style={[styles.playerStatus, { backgroundColor: theme.success + '15' }]}>
                <View style={[styles.statusIndicator, { backgroundColor: theme.success }]} />
                <Text style={[styles.opponentText, { color: theme.textPrimary }]}>
                  🎮 Playing against: {cleanPlayerName(opponent.name)}
                </Text>
              </View>
            ) : (
              <View style={[styles.waitingContainer, { backgroundColor: theme.warning + '15' }]}>
                <ActivityIndicator size="small" color={theme.warning} />
                <Text style={[styles.waitingText, { color: theme.textPrimary }]}>Waiting for opponent to join...</Text>
                <Text style={[styles.waitingSubtext, { color: theme.textSecondary }]}>
                  {isRandomMatchmaking 
                    ? 'You will be matched with another player soon'
                    : 'Game will start automatically when someone joins'}
                </Text>
              </View>
            )}
            
            <TouchableOpacity 
              style={[styles.leaveButton, { backgroundColor: theme.error }]} 
              onPress={isRandomMatchmaking ? handleCancelRandomMatchmaking : handleLeaveRoom}
            >
              <Text style={[styles.leaveButtonText, { color: theme.textInverse }]}>
                {isRandomMatchmaking ? 'Cancel Matchmaking' : 'Leave Room'}
              </Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  }

  // Connection status check
  if (connectionStatus !== 'connected') {
  return (
    <View style={styles.container}>
      <View style={[styles.setupCard, { 
        backgroundColor: theme.cardBackground,
        shadowColor: theme.shadowPiece
      }, SHADOWS.medium]}>
        <View style={styles.setupHeader}>
          <Users size={24} color={theme.primary} />
          <Text style={[styles.title, { color: theme.textPrimary }]}>Multiplayer Setup</Text>
        </View>

          <View style={[styles.connectionWarning, { backgroundColor: theme.error + '15', borderColor: theme.error + '30' }]}>
            <Text style={[styles.warningText, { color: theme.error }]}>
              {connectionStatus === 'connecting' ? 'Connecting to Supabase...' : 
               connectionStatus === 'error' ? 'Connection failed. Please check your network.' : 
               'Not connected to Supabase'}
            </Text>
            {connectionStatus === 'connecting' && <ActivityIndicator color={theme.primary} />}
          </View>
        </View>
      </View>
    );
  }

  // Random matchmaking screen
  if (selectedMode === 'random') {
    // Only log this once per render to reduce console noise
    // console.log('RENDER: Showing random matchmaking screen');
    return (
      <View style={styles.container}>
        <View style={[styles.setupCard, { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.shadowPiece
        }, SHADOWS.medium]}>
          <View style={styles.setupHeader}>
            <Shuffle size={24} color={theme.primary} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Join Random Game</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Get matched with another player instantly</Text>
          </View>

          <View style={styles.randomMatchSetup}>
            <View style={[styles.optionCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <LinearGradient
                colors={[theme.primary + '15', theme.primary + '08', 'transparent']}
                style={styles.optionCardGradient}
              >
                {!isJoiningRandomGame || !roomId ? (
                  <>
                    <Text style={[styles.randomMatchText, { color: theme.textPrimary }]}>
                      Enter your name to start matchmaking
                    </Text>
                    
                    <TextInput
                      style={[styles.input, { 
                        backgroundColor: theme.cardBackground, 
                        borderColor: theme.border,
                        color: theme.textPrimary 
                      }]}
                      placeholder="Enter your name"
                      placeholderTextColor={theme.textSecondary}
                      value={randomPlayerName}
                      onChangeText={setRandomPlayerName}
                      maxLength={20}
                    />

                    <TouchableOpacity
                      style={[styles.actionButton, { backgroundColor: theme.primary }]}
                      onPress={handleStartRandomMatchmaking}
                    >
                      <Text style={[styles.createButtonText, { color: theme.textInverse }]}>Start Matchmaking</Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <>
                    <View style={styles.loadingMatchContainer}>
                      <ActivityIndicator size="large" color={theme.primary} style={styles.matchmakingSpinner} />
                      <Text style={[styles.waitingForMatchText, { color: theme.textPrimary }]}>
                        Finding an opponent...
                      </Text>
                      <Text style={[styles.waitingSubtext, { color: theme.textSecondary }]}>
                        We'll match you with another player as soon as possible
                      </Text>
                      
                      <TouchableOpacity
                        style={[styles.cancelButton, { backgroundColor: theme.error + '15', borderColor: theme.error + '30' }]}
                        onPress={handleCancelRandomMatchmaking}
                      >
                        <Text style={[styles.cancelButtonText, { color: theme.error }]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                  </>
                )}
              </LinearGradient>
            </View>
          </View>
        </View>
      </View>
    );
  }

  // Mode selection screen
  if (selectedMode === 'none') {
    return (
      <View style={styles.container}>
        <View style={[styles.setupCard, { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.shadowPiece
        }, SHADOWS.medium]}>
          <View style={styles.setupHeader}>
            <Users size={24} color={theme.primary} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Choose Game Mode</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>How would you like to play?</Text>
          </View>

          <View style={styles.modeSelection}>
            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
              onPress={handleJoinRandomGame}
            >
              <LinearGradient
                colors={[theme.primary + '20', theme.primary + '10', 'transparent']}
                style={styles.modeCardGradient}
              >
                <View style={[styles.modeIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Shuffle size={28} color={theme.primary} />
                </View>
                <Text style={[styles.modeTitle, { color: theme.textPrimary }]}>Join Random Game</Text>
                <Text style={[styles.modeDescription, { color: theme.textSecondary }]}>Get matched with another player instantly</Text>
              </LinearGradient>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.modeCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}
              onPress={handlePlayWithFriends}
            >
              <LinearGradient
                colors={[theme.secondary + '20', theme.secondary + '10', 'transparent']}
                style={styles.modeCardGradient}
              >
                <View style={[styles.modeIcon, { backgroundColor: theme.secondary + '20' }]}>
                  <UserPlus size={28} color={theme.secondary} />
                </View>
                <Text style={[styles.modeTitle, { color: theme.textPrimary }]}>Play with Friends</Text>
                <Text style={[styles.modeDescription, { color: theme.textSecondary }]}>Create or join a private room with friends</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  // Play with Friends screen
  if (selectedMode === 'friends') {
    return (
      <View style={styles.container}>
        <View style={[styles.setupCard, { 
          backgroundColor: theme.cardBackground,
          shadowColor: theme.shadowPiece
        }, SHADOWS.medium]}>
          <View style={styles.setupHeader}>
            <UserPlus size={24} color={theme.secondary} />
            <Text style={[styles.title, { color: theme.textPrimary }]}>Play with Friends</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Create a new room or join an existing one</Text>
          </View>

          <View style={styles.multiplayerSetup}>
            {/* Create Room Section */}
            <View style={[styles.optionCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <LinearGradient
                colors={[theme.primary + '15', theme.primary + '08', 'transparent']}
                style={styles.optionCardGradient}
              >
              <View style={styles.optionHeader}>
                <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>🚀 Create New Room</Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>Start a new game and invite friends</Text>
              </View>
              
              <TextInput
                style={[styles.input, { 
                    backgroundColor: theme.cardBackground, 
                  borderColor: theme.border,
                  color: theme.textPrimary 
                }]}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
                value={playerName}
                onChangeText={setPlayerName}
                maxLength={20}
              />

              <TouchableOpacity
                style={[styles.actionButton, styles.createButton, { backgroundColor: theme.primary }]}
                onPress={handleCreateRoom}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <ActivityIndicator color={theme.textInverse} size="small" />
                ) : (
                  <Text style={[styles.createButtonText, { color: theme.textInverse }]}>Create Room</Text>
                )}
              </TouchableOpacity>
              </LinearGradient>
            </View>

            {/* Join Room Section */}
            <View style={[styles.optionCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
              <LinearGradient
                colors={[theme.secondary + '15', theme.secondary + '08', 'transparent']}
                style={styles.optionCardGradient}
              >
              <View style={styles.optionHeader}>
                <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>🎯 Join Existing Room</Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>Enter a friend's room code to join their game</Text>
              </View>
              
              <TextInput
                style={[styles.input, { 
                    backgroundColor: theme.cardBackground, 
                  borderColor: theme.border,
                  color: theme.textPrimary 
                }]}
                placeholder="Enter your name"
                placeholderTextColor={theme.textSecondary}
                value={joinPlayerName}
                onChangeText={setJoinPlayerName}
                maxLength={20}
              />

              <TextInput
                style={[styles.input, { 
                    backgroundColor: theme.cardBackground, 
                  borderColor: theme.border,
                  color: theme.textPrimary 
                }]}
                placeholder="Enter room code"
                placeholderTextColor={theme.textSecondary}
                value={roomIdInput}
                onChangeText={setRoomIdInput}
                maxLength={8}
                autoCapitalize="characters"
              />

              <TouchableOpacity
                style={[styles.actionButton, styles.joinButton, { backgroundColor: theme.secondary }]}
                onPress={handleJoinRoom}
                disabled={isJoiningRoom}
              >
                {isJoiningRoom ? (
                  <ActivityIndicator color={theme.textInverse} size="small" />
                ) : (
                  <Text style={[styles.joinButtonText, { color: theme.textInverse }]}>Join Room</Text>
                )}
              </TouchableOpacity>
              </LinearGradient>
            </View>
          </View>
        </View>
    </View>
  );
  }

  return null;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  roomCard: {
    borderRadius: 20,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },
  roomHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
    gap: SIZES.small,
  },
  roomTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  setupCard: {
    borderRadius: 20,
    padding: SIZES.large,
    marginBottom: SIZES.large,
  },
  setupHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
    gap: SIZES.small,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: 'center',
    marginTop: SIZES.xSmall,
  },
  connectionWarning: {
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginBottom: SIZES.medium,
    borderWidth: 1,
  },
  warningText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  modeSelection: {
    gap: SIZES.large,
  },
  modeCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  modeCardGradient: {
    padding: SIZES.large,
    alignItems: 'center',
  },
  modeIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  modeTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginBottom: SIZES.small,
    textAlign: 'center',
  },
  modeDescription: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  multiplayerSetup: {
    gap: SIZES.large,
  },
  randomMatchSetup: {
    gap: SIZES.large,
  },
  optionCard: {
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
  },
  optionCardGradient: {
    padding: SIZES.large,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  actionButton: {
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  createButton: {},
  createButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  joinButton: {},
  joinButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  roomIdContainer: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  roomIdLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  roomCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 2,
    borderRadius: 16,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    gap: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  roomIdText: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    letterSpacing: 6,
  },
  roomIdSubtext: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: 'center',
    lineHeight: 20,
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 12,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: SIZES.small,
  },
  opponentText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
  },
  waitingContainer: {
    alignItems: 'center',
    borderRadius: 12,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    gap: SIZES.small,
  },
  waitingText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  waitingSubtext: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.xSmall,
    textAlign: 'center',
  },
  leaveButton: {
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
  },
  leaveButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  optionHeader: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  optionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
  },
  optionSubtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    textAlign: 'center',
  },
  roomCardGradient: {
    borderRadius: 20,
    padding: SIZES.large,
  },
  randomMatchText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  loadingMatchContainer: {
    alignItems: 'center',
    padding: SIZES.medium,
  },
  matchmakingSpinner: {
    marginBottom: SIZES.medium,
  },
  waitingForMatchText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  cancelButton: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: SIZES.large,
    borderWidth: 1,
  },
  cancelButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
}); 