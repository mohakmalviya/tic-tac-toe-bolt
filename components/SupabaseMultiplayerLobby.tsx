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
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { Copy, Users, Wifi } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

export default function SupabaseMultiplayerLobby() {
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
        <LinearGradient
          colors={[COLORS.primary + '20', COLORS.primary + '10', COLORS.white]}
          style={styles.roomCard}
        >
          <View style={styles.roomHeader}>
            <Wifi size={24} color={COLORS.success} />
            <Text style={styles.roomTitle}>Room Created Successfully!</Text>
          </View>
          
          <View style={styles.roomIdContainer}>
            <Text style={styles.roomIdLabel}>Share this Room Code:</Text>
            <TouchableOpacity style={styles.roomCodeBox} onPress={copyRoomId}>
              <Text style={styles.roomIdText}>{roomId}</Text>
              <Copy size={20} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.roomIdSubtext}>Tap the code to copy • Share with friends to play</Text>
          </View>
          
          {opponent ? (
            <View style={styles.playerStatus}>
              <View style={styles.statusIndicator} />
              <Text style={styles.opponentText}>🎮 Playing against: {opponent.name}</Text>
            </View>
          ) : (
            <View style={styles.waitingContainer}>
              <ActivityIndicator size="small" color={COLORS.warning} />
              <Text style={styles.waitingText}>Waiting for opponent to join...</Text>
              <Text style={styles.waitingSubtext}>Game will start automatically when someone joins</Text>
            </View>
          )}
          
          <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
            <Text style={styles.leaveButtonText}>Leave Room</Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.setupCard}>
        <View style={styles.setupHeader}>
          <Users size={24} color={COLORS.primary} />
          <Text style={styles.title}>Multiplayer Setup</Text>
        </View>

        {connectionStatus !== 'connected' && (
          <View style={styles.connectionWarning}>
            <Text style={styles.warningText}>
              {connectionStatus === 'connecting' ? 'Connecting to Supabase...' : 
               connectionStatus === 'error' ? 'Connection failed. Please check your network.' : 
               'Not connected to Supabase'}
            </Text>
            {connectionStatus === 'connecting' && <ActivityIndicator color={COLORS.primary} />}
          </View>
        )}

        {connectionStatus === 'connected' && (
          <View style={styles.multiplayerSetup}>
            {/* Create Room Section */}
            <View style={styles.optionSection}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionTitle}>🚀 Create New Room</Text>
                <Text style={styles.optionSubtitle}>Start a new game and invite friends</Text>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textSecondary}
                value={playerName}
                onChangeText={setPlayerName}
                maxLength={20}
              />

              <TouchableOpacity
                style={[styles.actionButton, styles.createButton]}
                onPress={handleCreateRoom}
                disabled={isCreatingRoom}
              >
                {isCreatingRoom ? (
                  <ActivityIndicator color={COLORS.background} size="small" />
                ) : (
                  <Text style={styles.createButtonText}>Create Room</Text>
                )}
              </TouchableOpacity>
            </View>

            {/* Divider */}
            <View style={styles.divider}>
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR</Text>
              <View style={styles.dividerLine} />
            </View>

            {/* Join Room Section */}
            <View style={styles.optionSection}>
              <View style={styles.optionHeader}>
                <Text style={styles.optionTitle}>🎯 Join Existing Room</Text>
                <Text style={styles.optionSubtitle}>Enter a friend's room code to join their game</Text>
              </View>
              
              <TextInput
                style={styles.input}
                placeholder="Enter your name"
                placeholderTextColor={COLORS.textSecondary}
                value={joinPlayerName}
                onChangeText={setJoinPlayerName}
                maxLength={20}
              />

              <TextInput
                style={styles.input}
                placeholder="Room Code (6 characters)"
                placeholderTextColor={COLORS.textSecondary}
                value={roomIdInput}
                onChangeText={(text) => setRoomIdInput(text.toUpperCase())}
                maxLength={6}
                autoCapitalize="characters"
              />
              
              <TouchableOpacity
                style={[styles.actionButton, styles.joinButton]}
                onPress={handleJoinRoom}
                disabled={isJoiningRoom}
              >
                {isJoiningRoom ? (
                  <ActivityIndicator color={COLORS.background} size="small" />
                ) : (
                  <Text style={styles.joinButtonText}>Join Room</Text>
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
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    flex: 1,
  },
  roomCard: {
    borderRadius: 20,
    padding: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.primary + '30',
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
    color: COLORS.success,
  },
  setupCard: {
    backgroundColor: COLORS.white,
    borderRadius: 16,
    padding: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    color: COLORS.textPrimary,
  },
  connectionWarning: {
    backgroundColor: COLORS.warning,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  warningText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.background,
    textAlign: 'center',
    marginBottom: SIZES.small,
  },
  multiplayerSetup: {
    gap: SIZES.medium,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: SIZES.small,
    paddingHorizontal: SIZES.medium,
    paddingVertical: SIZES.small,
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.white,
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
    backgroundColor: COLORS.primary,
  },
  createButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.background,
  },
  joinSection: {
    gap: SIZES.small,
  },
  joinButton: {
    backgroundColor: COLORS.secondary,
  },
  joinButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.background,
  },
  roomIdContainer: {
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  roomIdLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.medium,
  },
  roomCodeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.white,
    borderWidth: 3,
    borderColor: COLORS.primary,
    borderRadius: 16,
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
    gap: SIZES.medium,
    marginBottom: SIZES.medium,
  },
  roomIdText: {
    fontFamily: FONTS.bold,
    fontSize: 36,
    color: COLORS.primary,
    letterSpacing: 6,
  },
  roomIdSubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  playerStatus: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.success + '20',
    borderRadius: 12,
    padding: SIZES.medium,
    marginBottom: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.success + '40',
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.success,
    marginRight: SIZES.small,
  },
  opponentText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.success,
  },
  waitingContainer: {
    alignItems: 'center',
    backgroundColor: COLORS.warning + '20',
    borderRadius: 12,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    borderWidth: 1,
    borderColor: COLORS.warning + '40',
    gap: SIZES.small,
  },
  waitingText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.warning,
  },
  waitingSubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  leaveButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SIZES.large,
    paddingHorizontal: SIZES.large,
    borderRadius: 12,
    alignItems: 'center',
    minHeight: 56,
  },
  leaveButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.background,
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
    color: COLORS.textPrimary,
  },
  optionSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.border,
  },
  dividerText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    marginHorizontal: SIZES.medium,
  },
}); 