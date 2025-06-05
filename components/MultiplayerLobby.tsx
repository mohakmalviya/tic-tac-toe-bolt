import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { COLORS, FONTS, SIZES } from '@/constants/theme';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

type GameMode = 'local' | 'multiplayer';

interface MultiplayerLobbyProps {
  gameMode: GameMode;
  onGameModeChange: (mode: GameMode) => void;
}

export default function MultiplayerLobby({ gameMode, onGameModeChange }: MultiplayerLobbyProps) {
  const [playerName, setPlayerName] = useState('');
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

  // Connect to server when switching to multiplayer mode
  useEffect(() => {
    // Supabase connection is handled automatically in the context
    // No manual connect/disconnect needed
  }, [gameMode]);

  const handleCreateRoom = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to server');
      return;
    }

    setIsCreatingRoom(true);
    try {
      await createRoom(playerName.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to create room');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const handleJoinRoom = async () => {
    if (!playerName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    
    if (!roomIdInput.trim()) {
      Alert.alert('Error', 'Please enter room ID');
      return;
    }
    
    if (!isConnected) {
      Alert.alert('Error', 'Not connected to server');
      return;
    }

    setIsJoiningRoom(true);
    try {
      await joinRoom(roomIdInput.trim().toUpperCase(), playerName.trim());
    } catch (error) {
      Alert.alert('Error', 'Failed to join room');
    } finally {
      setIsJoiningRoom(false);
    }
  };

  const handleLeaveRoom = () => {
    leaveRoom();
  };

  const handleSwitchToLocal = () => {
    onGameModeChange('local');
  };

  if (gameMode === 'local') {
    return (
      <View style={styles.container}>
        <Text style={styles.modeTitle}>Game Mode</Text>
        
        <View style={styles.modeButtons}>
          <TouchableOpacity
            style={[styles.modeButton, styles.modeButtonActive]}
            onPress={() => onGameModeChange('local')}
          >
            <Text style={[styles.modeButtonText, styles.modeButtonTextActive]}>
              Local Game
            </Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.modeButton}
            onPress={() => onGameModeChange('multiplayer')}
          >
            <Text style={styles.modeButtonText}>Multiplayer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  // Multiplayer mode
  if (roomId) {
    return (
      <View style={styles.container}>
        <Text style={styles.modeTitle}>Multiplayer Lobby</Text>
        
        <View style={styles.roomInfo}>
          <Text style={styles.roomIdText}>Room ID: {roomId}</Text>
          {opponent ? (
            <Text style={styles.opponentText}>Playing against: {opponent.name}</Text>
          ) : (
            <Text style={styles.waitingText}>Waiting for opponent...</Text>
          )}
        </View>
        
        <TouchableOpacity style={styles.leaveButton} onPress={handleLeaveRoom}>
          <Text style={styles.leaveButtonText}>Leave Room</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.modeButton}
          onPress={handleSwitchToLocal}
        >
          <Text style={styles.modeButtonText}>Back to Local</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.modeTitle}>Multiplayer Setup</Text>
      
      <View style={styles.modeButtons}>
        <TouchableOpacity
          style={styles.modeButton}
          onPress={handleSwitchToLocal}
        >
          <Text style={styles.modeButtonText}>Local Game</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.modeButton, styles.modeButtonActive]}
          onPress={() => onGameModeChange('multiplayer')}
        >
          <Text style={[styles.modeButtonText, styles.modeButtonTextActive]}>
            Multiplayer
          </Text>
        </TouchableOpacity>
      </View>

      {connectionStatus !== 'connected' && (
        <View style={styles.connectionWarning}>
          <Text style={styles.warningText}>
            {connectionStatus === 'connecting' ? 'Connecting to server...' : 
             connectionStatus === 'error' ? 'Connection failed. Please check your network.' : 
             'Not connected to server'}
          </Text>
          {connectionStatus === 'connecting' && <ActivityIndicator color={COLORS.primary} />}
        </View>
      )}

      {connectionStatus === 'connected' && (
        <View style={styles.multiplayerSetup}>
          <TextInput
            style={styles.input}
            placeholder="Enter your name"
            placeholderTextColor={COLORS.textSecondary}
            value={playerName}
            onChangeText={setPlayerName}
            maxLength={20}
          />

          <View style={styles.roomActions}>
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

            <View style={styles.joinSection}>
              <TextInput
                style={styles.input}
                placeholder="Room ID"
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
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  modeTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: SIZES.medium,
  },
  modeButtons: {
    flexDirection: 'row',
    gap: SIZES.small,
    marginBottom: SIZES.large,
  },
  modeButton: {
    flex: 1,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.small,
    borderRadius: SIZES.small,
    borderWidth: 2,
    borderColor: COLORS.primary,
    backgroundColor: 'transparent',
    alignItems: 'center',
  },
  modeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  modeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.primary,
  },
  modeButtonTextActive: {
    color: COLORS.background,
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
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: SIZES.small,
    alignItems: 'center',
    minHeight: 48,
    justifyContent: 'center',
  },
  createButton: {
    backgroundColor: COLORS.primary,
  },
  createButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
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
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
  roomInfo: {
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.medium,
    borderRadius: SIZES.small,
    marginBottom: SIZES.medium,
    alignItems: 'center',
  },
  roomIdText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.small,
  },
  opponentText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  waitingText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    fontStyle: 'italic',
  },
  leaveButton: {
    backgroundColor: COLORS.error,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: SIZES.small,
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  leaveButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.background,
  },
}); 