import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { Volume2, Volume1, VolumeX, Moon, Sun, CircleHelp as HelpCircle, Settings, Gamepad2, Palette, Trash2 } from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/contexts/GameContext';

export default function SettingsScreen() {
  const { handleResetAll } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState('medium'); // 'off', 'low', 'medium', 'high'
  const [darkMode, setDarkMode] = useState(false);
  
  const toggleSound = () => setSoundEnabled(prev => !prev);
  const toggleDarkMode = () => setDarkMode(prev => !prev);
  
  const handleVolumeChange = (volume: string) => {
    setSoundVolume(volume);
    if (volume === 'off') {
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
    }
  };
  
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
              <Settings size={32} color={COLORS.warning} />
            </View>
            <Text style={styles.title}>Settings</Text>
            <Text style={styles.subtitle}>Customize your game experience</Text>
          </View>
          
          {/* Sound Settings Card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[COLORS.white, '#F8FAFC']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={styles.cardIcon}>
                  <Volume2 size={24} color={COLORS.primary} />
                </View>
                <Text style={styles.sectionTitle}>Audio</Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Sound Effects</Text>
                <Switch
                  value={soundEnabled}
                  onValueChange={toggleSound}
                  trackColor={{ false: COLORS.backgroundDark, true: COLORS.primary + '40' }}
                  thumbColor={soundEnabled ? COLORS.primary : COLORS.textSecondary}
                  ios_backgroundColor={COLORS.backgroundDark}
                />
              </View>
              
              <View style={styles.volumeSection}>
                <Text style={styles.settingLabel}>Volume Level</Text>
                <View style={styles.volumeControls}>
                  <TouchableOpacity
                    style={[
                      styles.volumeButton,
                      soundVolume === 'off' && styles.volumeButtonActive
                    ]}
                    onPress={() => handleVolumeChange('off')}
                  >
                    <VolumeX
                      size={20}
                      color={soundVolume === 'off' ? COLORS.white : COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.volumeButton,
                      soundVolume === 'low' && styles.volumeButtonActive
                    ]}
                    onPress={() => handleVolumeChange('low')}
                  >
                    <Volume1
                      size={20}
                      color={soundVolume === 'low' ? COLORS.white : COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.volumeButton,
                      soundVolume === 'medium' && styles.volumeButtonActive
                    ]}
                    onPress={() => handleVolumeChange('medium')}
                  >
                    <Volume2
                      size={20}
                      color={soundVolume === 'medium' ? COLORS.white : COLORS.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
          
          {/* Display Settings Card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[COLORS.white, '#F8FAFC']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: COLORS.secondary + '20' }]}>
                  <Palette size={24} color={COLORS.secondary} />
                </View>
                <Text style={styles.sectionTitle}>Appearance</Text>
              </View>
              
              <View style={styles.settingRow}>
                <Text style={styles.settingLabel}>Dark Mode</Text>
                <Switch
                  value={darkMode}
                  onValueChange={toggleDarkMode}
                  trackColor={{ false: COLORS.backgroundDark, true: COLORS.secondary + '40' }}
                  thumbColor={darkMode ? COLORS.secondary : COLORS.textSecondary}
                  ios_backgroundColor={COLORS.backgroundDark}
                />
              </View>
              
              <View style={styles.themeSection}>
                <Text style={styles.settingLabel}>Theme Selection</Text>
                <View style={styles.themeRow}>
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      !darkMode && styles.themeButtonActive
                    ]}
                    onPress={() => setDarkMode(false)}
                  >
                    <Sun
                      size={20}
                      color={!darkMode ? COLORS.white : COLORS.textPrimary}
                    />
                    <Text
                      style={[
                        styles.themeButtonText,
                        !darkMode && styles.themeButtonActiveText
                      ]}
                    >
                      Light
                    </Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.themeButton,
                      darkMode && styles.themeButtonActive
                    ]}
                    onPress={() => setDarkMode(true)}
                  >
                    <Moon
                      size={20}
                      color={darkMode ? COLORS.white : COLORS.textPrimary}
                    />
                    <Text
                      style={[
                        styles.themeButtonText,
                        darkMode && styles.themeButtonActiveText
                      ]}
                    >
                      Dark
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </LinearGradient>
          </View>
          
          {/* Game Settings Card */}
          <View style={styles.card}>
            <LinearGradient
              colors={[COLORS.white, '#F8FAFC']}
              style={styles.cardGradient}
            >
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: COLORS.warning + '20' }]}>
                  <Gamepad2 size={24} color={COLORS.warning} />
                </View>
                <Text style={styles.sectionTitle}>Game Data</Text>
              </View>
              
              <TouchableOpacity 
                style={styles.resetButton}
                onPress={handleResetAll}
              >
                <Trash2 size={20} color={COLORS.white} />
                <Text style={styles.resetButtonText}>Reset Game Statistics</Text>
              </TouchableOpacity>
              
              <View style={styles.noteContainer}>
                <HelpCircle size={18} color={COLORS.textSecondary} />
                <Text style={styles.noteText}>
                  This will reset all scores and game history permanently
                </Text>
              </View>
            </LinearGradient>
          </View>
          
          {/* Footer */}
          <View style={styles.footer}>
            <Text style={styles.versionText}>Tic-Tac-Toe Special Edition</Text>
            <Text style={styles.versionNumber}>Version 1.0.0</Text>
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
    fontSize: 28,
    color: COLORS.textPrimary,
    marginBottom: SIZES.xSmall,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
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
    marginBottom: SIZES.large,
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
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  settingLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
  },
  volumeSection: {
    marginTop: SIZES.small,
  },
  volumeControls: {
    flexDirection: 'row',
    marginTop: SIZES.small,
    gap: SIZES.small,
    justifyContent: 'center',
  },
  volumeButton: {
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.small,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  volumeButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  themeSection: {
    marginTop: SIZES.small,
  },
  themeRow: {
    flexDirection: 'row',
    marginTop: SIZES.small,
    gap: SIZES.small,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.small,
    borderRadius: 12,
    flex: 1,
    gap: SIZES.xSmall,
    borderWidth: 1,
    borderColor: COLORS.border,
    minHeight: 48,
  },
  themeButtonActive: {
    backgroundColor: COLORS.secondary,
    borderColor: COLORS.secondary,
    shadowColor: COLORS.secondary,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  themeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
  },
  themeButtonActiveText: {
    color: COLORS.white,
  },
  resetButton: {
    backgroundColor: COLORS.error,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    borderRadius: 12,
    gap: SIZES.small,
    marginBottom: SIZES.medium,
    shadowColor: COLORS.error,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 4,
  },
  resetButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
    color: COLORS.white,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.warning + '10',
    borderRadius: 8,
    padding: SIZES.small,
    gap: SIZES.small,
    borderLeftWidth: 3,
    borderLeftColor: COLORS.warning,
  },
  noteText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  versionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    color: COLORS.textPrimary,
    marginBottom: SIZES.xSmall,
  },
  versionNumber: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
    color: COLORS.textSecondary,
  },
});