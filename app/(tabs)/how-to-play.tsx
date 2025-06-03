import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import PieceLifecycle from '@/components/PieceLifecycle';

export default function HowToPlayScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>How To Play</Text>
          <Text style={styles.subtitle}>Special Rules Edition</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Basic Rules</Text>
          <Text style={styles.ruleText}>
            1. Players take turns placing X's and O's on the board
          </Text>
          <Text style={styles.ruleText}>
            2. First player is X, second player is O
          </Text>
          <Text style={styles.ruleText}>
            3. The goal is to get three of your pieces in a row (horizontally, vertically, or diagonally)
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Special Rules</Text>
          <Text style={styles.ruleText}>
            1. When a player places their 3rd piece, the opponent's oldest piece becomes "shadowed" (faded)
          </Text>
          <Text style={styles.ruleText}>
            2. When a player places their next piece after their opponent's piece becomes shadowed, the shadowed piece disappears from the board
          </Text>
          <Text style={styles.ruleText}>
            3. This cycle continues, with the oldest piece of each player becoming shadowed and then removed
          </Text>
          <Text style={styles.ruleText}>
            4. A player can only win with 3 non-shadowed pieces in a row
          </Text>
        </View>
        
        <PieceLifecycle type="X" />
        <PieceLifecycle type="O" />
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Example</Text>
          <Text style={styles.exampleText}>
            • Player X places first piece
          </Text>
          <Text style={styles.exampleText}>
            • Player O places first piece
          </Text>
          <Text style={styles.exampleText}>
            • Player X places second piece
          </Text>
          <Text style={styles.exampleText}>
            • Player O places second piece
          </Text>
          <Text style={styles.exampleText}>
            • Player X places third piece
          </Text>
          <Text style={styles.exampleText}>
            • Player O places third piece (X's first piece becomes shadowed)
          </Text>
          <Text style={styles.exampleText}>
            • Player X places fourth piece (O's first piece becomes shadowed and X's first piece disappears)
          </Text>
          <Text style={styles.exampleText}>
            • And so on...
          </Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Strategy Tips</Text>
          <Text style={styles.ruleText}>
            • Think about the timing of your moves - consider which of your pieces might become shadowed next
          </Text>
          <Text style={styles.ruleText}>
            • Try to create multiple potential winning lines
          </Text>
          <Text style={styles.ruleText}>
            • Pay attention to which pieces will disappear and how that affects potential winning lines
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
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
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textPrimary,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textSecondary,
    marginTop: SIZES.xSmall,
  },
  card: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: SIZES.large,
    marginBottom: SIZES.large,
    ...SHADOWS.small,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.large,
    color: COLORS.primary,
    marginBottom: SIZES.medium,
  },
  ruleText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.medium,
    lineHeight: 24,
  },
  exampleText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    marginBottom: SIZES.small,
    lineHeight: 24,
  },
});