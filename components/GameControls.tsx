import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { RefreshCw, RotateCcw } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

type GameMode = 'local' | 'multiplayer';

interface GameControlsProps {
  gameMode: GameMode;
}

const GameControls: React.FC<GameControlsProps> = ({ gameMode }) => {
  const { handleResetGame, handleResetAll } = useGame();
  const { resetGame: resetMultiplayerGame, isHost } = useSupabaseMultiplayer();
  
  const handleNewGame = async () => {
    if (gameMode === 'multiplayer') {
      try {
        await resetMultiplayerGame();
      } catch (error) {
        console.error('Error resetting multiplayer game:', error);
      }
    } else {
      handleResetGame();
    }
  };

  const handleResetAllScores = () => {
    if (gameMode === 'local') {
      handleResetAll();
    }
    // In multiplayer, we don't allow resetting all scores through the client
  };

  // In multiplayer mode, only show new game button and only for the host
  if (gameMode === 'multiplayer') {
    return (
      <View style={styles.container}>
        {isHost && (
          <TouchableOpacity 
            style={styles.button} 
            onPress={handleNewGame}
            activeOpacity={0.8}
          >
            <RefreshCw size={20} color={COLORS.white} />
            <Text style={styles.buttonText}>New Game</Text>
          </TouchableOpacity>
        )}
        {!isHost && (
          <View style={styles.waitingContainer}>
            <Text style={styles.waitingText}>
              Waiting for host to start new game...
            </Text>
          </View>
        )}
      </View>
    );
  }

  // Local mode - show both buttons
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleNewGame}
        activeOpacity={0.8}
      >
        <RefreshCw size={20} color={COLORS.white} />
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={handleResetAllScores}
        activeOpacity={0.8}
      >
        <RotateCcw size={20} color={COLORS.primary} />
        <Text style={[styles.buttonText, styles.secondaryButtonText]}>
          Reset All
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: SIZES.medium,
    marginTop: SIZES.large,
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
    borderRadius: 8,
    gap: SIZES.small,
    ...SHADOWS.small,
  },
  buttonText: {
    color: COLORS.white,
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
  },
  secondaryButton: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  secondaryButtonText: {
    color: COLORS.primary,
  },
  waitingContainer: {
    paddingVertical: SIZES.medium,
    paddingHorizontal: SIZES.large,
  },
  waitingText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
    fontStyle: 'italic',
  },
});

export default GameControls;