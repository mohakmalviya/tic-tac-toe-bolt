import React, { useState } from 'react';
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
import { Copy, Users, Wifi } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

export default function SupabaseMultiplayerLobby() {
  const { theme } = useTheme();
  const [playerName, setPlayerName] = useState('');
  const [joinPlayerName, setJoinPlayerName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [isJoiningRoom, setIsJoiningRoom] = useState(false);
  
  const { 
    isConnected, 
    roomId, 
    createRoom, 
    joinRoom, 
    leaveRoom, 
    opponent,
    connectionStatus 
  } = useSupabaseMultiplayer();

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

  const handleLeaveRoom = async () => {
    try {
      await leaveRoom();
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

  // If in a room, show room info
  if (roomId) {
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
              <Text style={[styles.roomTitle, { color: theme.textPrimary }]}>Room Created Successfully!</Text>
            </View>
            
            <View style={styles.roomIdContainer}>
              <Text style={[styles.roomIdLabel, { color: theme.textSecondary }]}>Share this Room Code:</Text>
              <TouchableOpacity style={[styles.roomCodeBox, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]} onPress={copyRoomId}>
                <Text style={[styles.roomIdText, { color: theme.primary }]}>{roomId}</Text>
                <Copy size={20} color={theme.primary} />
              </TouchableOpacity>
              <Text style={[styles.roomIdSubtext, { color: theme.textSecondary }]}>Tap the code to copy • Share with friends to play</Text>
            </View>
            
            {opponent ? (
              <View style={[styles.playerStatus, { backgroundColor: theme.success + '15' }]}>
                <View style={[styles.statusIndicator, { backgroundColor: theme.success }]} />
                <Text style={[styles.opponentText, { color: theme.textPrimary }]}>🎮 Playing against: {opponent.name}</Text>
              </View>
            ) : (
              <View style={[styles.waitingContainer, { backgroundColor: theme.warning + '15' }]}>
                <ActivityIndicator size="small" color={theme.warning} />
                <Text style={[styles.waitingText, { color: theme.textPrimary }]}>Waiting for opponent to join...</Text>
                <Text style={[styles.waitingSubtext, { color: theme.textSecondary }]}>Game will start automatically when someone joins</Text>
              </View>
            )}
            
            <TouchableOpacity style={[styles.leaveButton, { backgroundColor: theme.error }]} onPress={handleLeaveRoom}>
              <Text style={[styles.leaveButtonText, { color: theme.textInverse }]}>Leave Room</Text>
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View>
    );
  }

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

        {connectionStatus !== 'connected' && (
          <View style={[styles.connectionWarning, { backgroundColor: theme.error + '15', borderColor: theme.error + '30' }]}>
            <Text style={[styles.warningText, { color: theme.error }]}>
              {connectionStatus === 'connecting' ? 'Connecting to Supabase...' : 
               connectionStatus === 'error' ? 'Connection failed. Please check your network.' : 
               'Not connected to Supabase'}
            </Text>
            {connectionStatus === 'connecting' && <ActivityIndicator color={theme.primary} />}
          </View>
        )}

        {connectionStatus === 'connected' && (
          <View style={styles.multiplayerSetup}>
            {/* Create Room Section */}
            <View style={styles.optionSection}>
              <View style={styles.optionHeader}>
                <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>🚀 Create New Room</Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>Start a new game and invite friends</Text>
              </View>
              
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surfaceElevated, 
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
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
              <Text style={[styles.dividerText, { color: theme.textSecondary }]}>OR</Text>
              <View style={[styles.dividerLine, { backgroundColor: theme.border }]} />
            </View>

            {/* Join Room Section */}
            <View style={styles.optionSection}>
              <View style={styles.optionHeader}>
                <Text style={[styles.optionTitle, { color: theme.textPrimary }]}>🎯 Join Existing Room</Text>
                <Text style={[styles.optionSubtitle, { color: theme.textSecondary }]}>Enter a friend's room code to join their game</Text>
              </View>
              
              <TextInput
                style={[styles.input, { 
                  backgroundColor: theme.surfaceElevated, 
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
                  backgroundColor: theme.surfaceElevated, 
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
            </View>
          </View>
        )}
      </View>
    </View>
  );
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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.large,
    gap: SIZES.small,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
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
  multiplayerSetup: {
    gap: SIZES.medium,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
  },
  roomActions: {
    gap: SIZES.medium,
  },
  actionButton: {
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
    justifyContent: 'center',
  },
  createButton: {
    // backgroundColor will be set dynamically
  },
  createButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  joinSection: {
    gap: SIZES.small,
  },
  joinButton: {
    // backgroundColor will be set dynamically
  },
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
  optionSection: {
    gap: SIZES.medium,
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SIZES.medium,
    marginVertical: SIZES.medium,
  },
  dividerLine: {
    flex: 1,
    height: 1,
  },
  dividerText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.xSmall,
    paddingHorizontal: SIZES.medium,
  },
  roomCardGradient: {
    borderRadius: 20,
    padding: SIZES.large,
  },
}); 