import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { RefreshCw, RotateCcw } from 'lucide-react-native';
import { useGame } from '@/contexts/GameContext';

const GameControls: React.FC = () => {
  const { handleResetGame, handleResetAll } = useGame();
  
  return (
    <View style={styles.container}>
      <TouchableOpacity 
        style={styles.button} 
        onPress={handleResetGame}
        activeOpacity={0.8}
      >
        <RefreshCw size={20} color={COLORS.white} />
        <Text style={styles.buttonText}>New Game</Text>
      </TouchableOpacity>
      
      <TouchableOpacity 
        style={[styles.button, styles.secondaryButton]} 
        onPress={handleResetAll}
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
});

export default GameControls;