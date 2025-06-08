import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { LinearGradient } from 'expo-linear-gradient';
import { Trophy, Target, Users, Lightbulb, Clock, Eye, ArrowDown } from 'lucide-react-native';
import PieceLifecycle from '@/components/PieceLifecycle';

export default function HowToPlayScreen() {
  const { theme, isDark } = useTheme();

  // Dynamic gradient colors for how-to-play
  const backgroundGradient = isDark 
    ? [theme.background, theme.backgroundSecondary, theme.backgroundTertiary]
    : ['#FEF3C7', '#F3E8FF', '#E0F2FE', '#ECFDF5']; // Yellow -> Purple -> Cyan -> Green

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Header */}
          <View style={styles.header}>
            <View style={[styles.headerIcon, { backgroundColor: theme.warning + '20' }]}>
              <Trophy size={32} color={theme.warning} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>How To Play</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Master the Special Rules Edition</Text>
          </View>
          
          {/* Basic Rules Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Target size={24} color={theme.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Basic Rules</Text>
              </View>
              
              <View style={styles.rulesList}>
                <View style={styles.ruleItem}>
                  <View style={[styles.ruleNumber, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.ruleNumberText, { color: theme.textInverse }]}>1</Text>
                  </View>
                  <Text style={[styles.ruleText, { color: theme.textSecondary }]}>
                    Players take turns placing X's and O's on the board
                  </Text>
                </View>
                
                <View style={styles.ruleItem}>
                  <View style={[styles.ruleNumber, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.ruleNumberText, { color: theme.textInverse }]}>2</Text>
                  </View>
                  <Text style={[styles.ruleText, { color: theme.textSecondary }]}>
                    First player is <Text style={[styles.playerSymbol, { color: theme.xColor }]}>X</Text>, second player is <Text style={[styles.playerSymbol, { color: theme.oColor }]}>O</Text>
                  </Text>
                </View>
                
                <View style={styles.ruleItem}>
                  <View style={[styles.ruleNumber, { backgroundColor: theme.primary }]}>
                    <Text style={[styles.ruleNumberText, { color: theme.textInverse }]}>3</Text>
                  </View>
                  <Text style={[styles.ruleText, { color: theme.textSecondary }]}>
                    Get three pieces in a row (horizontally, vertically, or diagonally) to win
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Special Rules Card */}
          <View style={[styles.card, { backgroundColor: theme.cardBackground }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.secondary + '20' }]}>
                  <Users size={24} color={theme.secondary} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Special Rules</Text>
              </View>
              
              <View style={styles.specialRulesContainer}>
                <View style={[styles.highlightBox, { backgroundColor: theme.primary + '15', borderColor: theme.primary + '30' }]}>
                  <Text style={[styles.highlightText, { color: theme.textPrimary }]}>
                    Maximum 3 pieces per player on board at any time
                  </Text>
                </View>
                
                {/* Step 1 */}
                <View style={[styles.stepCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepIcon, { backgroundColor: theme.primary + '20' }]}>
                      <Clock size={20} color={theme.primary} />
                    </View>
                    <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Step 1: Shadowing Begins</Text>
                  </View>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    Shadowing starts when BOTH players have 3 pieces on the board. Until then, players can place pieces freely.
                  </Text>
                </View>

                {/* Arrow Down */}
                <View style={styles.stepConnector}>
                  <ArrowDown size={20} color={theme.textSecondary} />
                </View>

                {/* Step 2 */}
                <View style={[styles.stepCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepIcon, { backgroundColor: theme.secondary + '20' }]}>
                      <Eye size={20} color={theme.secondary} />
                    </View>
                    <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Step 2: Piece Gets Shadowed</Text>
                  </View>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    The oldest piece becomes "shadowed" (appears faded and translucent). Shadowed pieces cannot be used to win.
                  </Text>
                </View>

                {/* Arrow Down */}
                <View style={styles.stepConnector}>
                  <ArrowDown size={20} color={theme.textSecondary} />
                </View>

                {/* Step 3 */}
                <View style={[styles.stepCard, { backgroundColor: theme.surfaceElevated, borderColor: theme.border }]}>
                  <View style={styles.stepHeader}>
                    <View style={[styles.stepIcon, { backgroundColor: theme.warning + '20' }]}>
                      <Target size={20} color={theme.warning} />
                    </View>
                    <Text style={[styles.stepTitle, { color: theme.textPrimary }]}>Step 3: Removal & Cycle</Text>
                  </View>
                  <Text style={[styles.stepDescription, { color: theme.textSecondary }]}>
                    When you place your next piece, your shadowed piece disappears completely. This cycle continues throughout the game.
                  </Text>
                </View>
                
                <View style={[styles.winCondition, { backgroundColor: theme.success + '15', borderColor: theme.success + '30' }]}>
                  <Text style={[styles.winConditionText, { color: theme.textPrimary }]}>
                    🏆 Win only with 3 <Text style={[styles.emphasis, { color: theme.success }]}>non-shadowed</Text> pieces in a row
                  </Text>
                </View>
              </View>
            </View>
          </View>
          
          {/* Piece Lifecycle */}
          <View style={styles.lifecycleSection}>
            <Text style={[styles.lifecycleTitle, { color: theme.textPrimary }]}>Piece Lifecycle</Text>
            <PieceLifecycle type="X" />
            <PieceLifecycle type="O" />
          </View>
          
          {/* Strategy Tips Card */}
          <View style={[styles.cardNoShadow, { backgroundColor: theme.warning + '10' }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.warning + '20' }]}>
                  <Lightbulb size={24} color={theme.warning} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Pro Tips</Text>
              </View>
              
              <View style={styles.tipsList}>
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🎯</Text>
                  <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                    Time your moves considering which pieces become shadowed next
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>🔄</Text>
                  <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                    Create multiple potential winning lines for flexibility
                  </Text>
                </View>
                
                <View style={styles.tipItem}>
                  <Text style={styles.tipEmoji}>👁️</Text>
                  <Text style={[styles.tipText, { color: theme.textSecondary }]}>
                    Watch which pieces will disappear and plan accordingly
                  </Text>
                </View>
              </View>
            </View>
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
    paddingBottom: SIZES.xxLarge * 2,
  },
  header: {
    alignItems: 'center',
    paddingVertical: SIZES.xxLarge,
    paddingHorizontal: SIZES.large,
  },
  headerIcon: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 32,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    textAlign: 'center',
    marginTop: SIZES.xSmall,
  },
  card: {
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.large,
    borderRadius: 16,
    ...SHADOWS.medium,
  },
  cardContent: {
    padding: SIZES.large,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  cardIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: SIZES.medium,
    marginTop: 2,
  },
  ruleNumberText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  ruleText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    lineHeight: 24,
    flex: 1,
  },
  playerSymbol: {
    fontFamily: FONTS.bold,
  },
  specialRulesContainer: {
    gap: SIZES.medium,
  },
  highlightBox: {
    padding: SIZES.medium,
    borderRadius: 12,
    borderWidth: 1,
  },
  highlightText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  stepCard: {
    padding: SIZES.medium,
    borderRadius: 12,
    borderWidth: 1,
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
    marginRight: SIZES.small,
  },
  stepTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    flex: 1,
  },
  stepDescription: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    lineHeight: 20,
  },
  stepConnector: {
    alignItems: 'center',
    paddingVertical: SIZES.xSmall,
  },
  winCondition: {
    padding: SIZES.medium,
    borderRadius: 12,
    borderWidth: 1,
    marginTop: SIZES.small,
  },
  winConditionText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
    textAlign: 'center',
  },
  emphasis: {
    fontFamily: FONTS.bold,
  },
  lifecycleSection: {
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.large,
  },
  lifecycleTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: SIZES.large,
  },
  tipsList: {
    gap: SIZES.medium,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  tipEmoji: {
    fontSize: 20,
    marginRight: SIZES.medium,
    marginTop: 2,
  },
  tipText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    lineHeight: 24,
    flex: 1,
  },
  cardNoShadow: {
    marginHorizontal: SIZES.large,
    marginBottom: SIZES.large,
    borderRadius: 16,
  },
});