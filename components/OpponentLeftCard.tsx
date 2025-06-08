import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FONTS, SIZES } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';
import { AlertTriangle, X } from 'lucide-react-native';

interface OpponentLeftCardProps {
  onLeave: () => void;
}

const OpponentLeftCard: React.FC<OpponentLeftCardProps> = ({ onLeave }) => {
  const { theme } = useTheme();
  const { isOpponentDisconnected, continueWaitingForOpponent, currentPlayerName, roomId } = useSupabaseMultiplayer();
  const [showCard, setShowCard] = useState(true);
  
  // Check if this is a random match
  const isRandomMatch = currentPlayerName?.includes('[RANDOM]');
  
  // Reset showCard state whenever disconnection state changes
  useEffect(() => {
    if (isOpponentDisconnected) {
      console.log('OpponentLeftCard: Opponent disconnected, showing card');
      setShowCard(true);
    }
  }, [isOpponentDisconnected]);
  
  // Handle continue waiting - just hide the card UI but keep waiting state
  const handleContinueWaiting = () => {
    console.log('User chose to continue waiting for a new opponent');
    setShowCard(false);
    continueWaitingForOpponent();
  };

  // Add comprehensive debug logging
  console.log('OpponentLeftCard render:', {
    isOpponentDisconnected,
    showCard,
    isRandomMatch,
    shouldShow: isOpponentDisconnected && showCard,
    timestamp: new Date().toLocaleTimeString()
  });

  // If not disconnected or card is dismissed, don't show anything
  if (!isOpponentDisconnected || !showCard) {
    return null;
  }

  console.log('OpponentLeftCard: Actually rendering the card!');

  return (
    <View style={styles.overlay}>
      <View style={[styles.card, { backgroundColor: theme.cardBackground, borderColor: theme.border }]}>
        <View style={styles.iconContainer}>
          <AlertTriangle size={36} color={theme.warning} />
        </View>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Opponent Left
        </Text>
        <Text style={[styles.message, { color: theme.textSecondary }]}>
          {isRandomMatch 
            ? "Your opponent has left the game. You can wait for a new player to join or leave the game."
            : "Your opponent has disconnected from the game. You can wait for them to return or leave the game."}
        </Text>
        <View style={styles.buttonsContainer}>
          <TouchableOpacity 
            style={[styles.button, { backgroundColor: theme.error + '20', borderColor: theme.error }]} 
            onPress={onLeave}
          >
            <X size={18} color={theme.error} />
            <Text style={[styles.buttonText, { color: theme.error }]}>Leave Game</Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.waitButton, { backgroundColor: theme.secondary + '20', borderColor: theme.secondary }]}
            onPress={handleContinueWaiting}
          >
            <Text style={[styles.buttonText, { color: theme.secondary }]}>
              {isRandomMatch ? "Continue Waiting" : "Wait for Return"}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999, // Make sure it's above everything
    elevation: 99, // Increase Android elevation
  },
  card: {
    width: '90%',
    maxWidth: 400,
    padding: SIZES.large,
    borderRadius: 20,
    alignItems: 'center',
    borderWidth: 1,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.25,
    shadowRadius: 16,
    elevation: 25, // Higher elevation for Android
    pointerEvents: 'auto', // Make sure card can receive touch events
  },
  iconContainer: {
    marginBottom: SIZES.small,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    marginVertical: SIZES.small,
    textAlign: 'center',
  },
  message: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  buttonsContainer: {
    width: '100%',
    flexDirection: 'column',
    justifyContent: 'center',
    gap: SIZES.small,
    marginTop: SIZES.small,
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.medium,
    borderRadius: 8,
    borderWidth: 1,
    gap: SIZES.xSmall,
  },
  waitButton: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: SIZES.medium,
    borderRadius: 8,
    borderWidth: 1,
  },
  buttonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
  },
});

export default OpponentLeftCard;
