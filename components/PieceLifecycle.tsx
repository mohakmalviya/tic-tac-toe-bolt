import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { X, Circle, ArrowRight } from 'lucide-react-native';

interface PieceLifecycleProps {
  type: 'X' | 'O';
}

const PieceLifecycle: React.FC<PieceLifecycleProps> = ({ type }) => {
  const color = type === 'X' ? COLORS.xColor : COLORS.oColor;
  const shadowColor = type === 'X' ? COLORS.xShadow : COLORS.oShadow;
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Piece Lifecycle: Player {type}</Text>
      
      <View style={styles.stagesContainer}>
        <View style={styles.stageItem}>
          <View style={styles.pieceContainer}>
            {type === 'X' ? (
              <X size={32} color={color} />
            ) : (
              <Circle size={32} color={color} />
            )}
          </View>
          <Text style={styles.stageText}>Active</Text>
        </View>
        
        <ArrowRight size={24} color={COLORS.textSecondary} style={styles.arrow} />
        
        <View style={styles.stageItem}>
          <View style={styles.pieceContainer}>
            {type === 'X' ? (
              <X size={32} color={shadowColor} />
            ) : (
              <Circle size={32} color={shadowColor} />
            )}
          </View>
          <Text style={styles.stageText}>Shadowed</Text>
        </View>
        
        <ArrowRight size={24} color={COLORS.textSecondary} style={styles.arrow} />
        
        <View style={styles.stageItem}>
          <View style={styles.pieceContainer}>
            <Text style={styles.disappearedText}>✕</Text>
          </View>
          <Text style={styles.stageText}>Removed</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.medium,
    marginVertical: SIZES.medium,
    ...SHADOWS.small,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  stagesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES.small,
  },
  stageItem: {
    alignItems: 'center',
    width: 80,
  },
  pieceContainer: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  stageText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    textAlign: 'center',
  },
  arrow: {
    marginHorizontal: -10,
  },
  disappearedText: {
    fontSize: 32,
    color: COLORS.textSecondary,
    opacity: 0.3,
  },
});

export default PieceLifecycle;