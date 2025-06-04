import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, Users, Lightbulb, Clock, Eye, ArrowDown } from 'lucide-react-native';
import PieceLifecycle from '@/components/PieceLifecycle';

export default function HowToPlayScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['#FEFEFE', '#F8FAFC', '#F1F5F9']}
        style={styles.backgroundGradient}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Trophy size={32} color={COLORS.warning} />
            </View>
            <Text style={styles.title}>How To Play</Text>
            <Text style={styles.subtitle}>Master the Special Rules Edition</Text>
          </View>
          
          {/* Basic Rules Card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[COLORS.white, '#F8FAFC']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Target size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>Basic Rules</Text>
              </View>
              
              <View style={styles.rulesList}>
                <View style={styles.ruleItem}>
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>1</Text>
                  </View>
                  <Text style={styles.ruleText}>
                    Players take turns placing X's and O's on the board
                  </Text>
                </View>
                
                <View style={styles.ruleItem}>
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>2</Text>
                  </View>
                  <Text style={styles.ruleText}>
                    First player is <Text style={[styles.playerSymbol, { color: COLORS.xColor }]}>X</Text>, second player is <Text style={[styles.playerSymbol, { color: COLORS.oColor }]}>O</Text>
                  </Text>
                </View>
                
                <View style={styles.ruleItem}>
                  <View style={styles.ruleNumber}>
                    <Text style={styles.ruleNumberText}>3</Text>
                  </View>
                  <Text style={styles.ruleText}>
                    Get three pieces in a row (horizontally, vertically, or diagonally) to win
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
          
          {/* Special Rules Card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[COLORS.white, '#F8FAFC']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                  <Users size={24} color={COLORS.secondary} />
                </View>
                <Text style={styles.sectionTitle}>Special Rules</Text>
              </View>
              
              <View style={styles.specialRulesContainer}>
                <View style={styles.highlightBox}>
                  <Text style={styles.highlightText}>
                    Maximum 3 pieces per player on board at any time
                  </Text>
                </View>
                
                {/* Step 1 */}
                <View style={styles.stepCard}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepIcon, { backgroundColor: COLORS.primary + '20' }]}>
                      <Clock size={20} color={COLORS.primary} />
                    </View>
                    <Text style={styles.stepTitle}>Step 1: Shadowing Begins</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    Shadowing starts when BOTH players have 3 pieces on the board. Until then, players can place pieces freely.
                  </Text>
                </View>

                {/* Arrow Down */}
                <View style={styles.stepConnector}>
                  <ArrowDown size={20} color={COLORS.textSecondary} />
                </View>

                {/* Step 2 */}
                <View style={styles.stepCard}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                      <Eye size={20} color={COLORS.secondary} />
                    </View>
                    <Text style={styles.stepTitle}>Step 2: Piece Gets Shadowed</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    The oldest piece becomes "shadowed" (appears faded and translucent). Shadowed pieces cannot be used to win.
                  </Text>
                </View>

                {/* Arrow Down */}
                <View style={styles.stepConnector}>
                  <ArrowDown size={20} color={COLORS.textSecondary} />
                </View>

                {/* Step 3 */}
                <View style={styles.stepCard}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepIcon, { backgroundColor: COLORS.warning + '20' }]}>
                      <Target size={20} color={COLORS.warning} />
                    </View>
                    <Text style={styles.stepTitle}>Step 3: Removal & Cycle</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    When you place your next piece, your shadowed piece disappears completely. This cycle continues throughout the game.
                  </Text>
                </View>
                
                <View style={styles.winCondition}>
                  <Text style={styles.winConditionText}>
                    🏆 Win only with 3 <Text style={styles.emphasis}>non-shadowed</Text> pieces in a row
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
          
          {/* Piece Lifecycle */}
          <View style={styles.lifecycleSection}>
            <Text style={styles.lifecycleTitle}>Piece Lifecycle</Text>
            <PieceLifecycle type="X" />
            <PieceLifecycle type="O" />
          </View>
          
          {/* Strategy Tips Card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[COLORS.warning + '10', COLORS.white]}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: COLORS.warning + '20' }]}>
                  <Lightbulb size={24} color={COLORS.warning} />
                </View>
                <Text style={styles.sectionTitle}>Pro Tips</Text>
              </View>
              
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🎯</Text>
                  <Text style={styles.tipText}>
                    Time your moves considering which pieces become shadowed next
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🔄</Text>
                  <Text style={styles.tipText}>
                    Create multiple potential winning lines for flexibility
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>👁️</Text>
                  <Text style={styles.tipText}>
                    Watch which pieces will disappear and plan accordingly
                  </Text>
                </View>
              </View>
            </LinearGradient>
          </View>
        </ScrollView>
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
  scrollContent: {
    paddingHorizontal: SIZES.large,
    paddingBottom: SIZES.xxLarge,
  },
  header: {
    alignItems: 'center',
    paddingTop: SIZES.xxLarge,
    paddingBottom: SIZES.large,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: COLORS.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    shadowColor: COLORS.warning,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
    borderColor: '#FEF3C7',
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    color: COLORS.textPrimary,
    marginBottom: SIZES.xSmall,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
  },
  card: {
    marginBottom: SIZES.large,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    padding: SIZES.large,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.primary + '20',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    flex: 1,
  },
  rulesList: {
    gap: SIZES.medium,
  },
  ruleItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  ruleNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
    marginTop: 2,
  },
  ruleNumberText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  ruleText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    lineHeight: 24,
    flex: 1,
  },
  playerSymbol: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
  },
  specialRulesContainer: {
    gap: SIZES.medium,
  },
  highlightBox: {
    backgroundColor: COLORS.primary + '10',
    borderLeftWidth: 4,
    borderLeftColor: COLORS.primary,
    borderRadius: 8,
    padding: SIZES.medium,
  },
  highlightText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.primary,
    textAlign: 'center',
  },
  stepCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  stepHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.small,
  },
  stepIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },
  stepTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  stepDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    lineHeight: 22,
    marginLeft: 52, // Align with title text (36px icon + 16px margin)
  },
  stepConnector: {
    alignItems: 'center',
    paddingVertical: SIZES.xSmall,
  },
  winCondition: {
    backgroundColor: COLORS.success + '10',
    borderRadius: 12,
    padding: SIZES.medium,
    borderWidth: 1,
    borderColor: COLORS.success + '30',
    marginTop: SIZES.small,
  },
  winConditionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.success,
    textAlign: 'center',
  },
  emphasis: {
    fontFamily: FONTS.bold,
  },
  lifecycleSection: {
    marginBottom: SIZES.large,
    alignItems: 'center',
  },
  lifecycleTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.textPrimary,
    marginBottom: SIZES.medium,
    textAlign: 'center',
  },
  tipsList: {
    gap: SIZES.medium,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tipEmoji: {
    fontSize: 24,
    marginRight: SIZES.medium,
    width: 32,
    textAlign: 'center',
  },
  tipText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    lineHeight: 22,
    flex: 1,
  },
});