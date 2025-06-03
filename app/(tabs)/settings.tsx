import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Switch, TouchableOpacity } from 'react-native';
import { COLORS, FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { Volume2, Volume1, VolumeX, Moon, Sun, CircleHelp as HelpCircle } from 'lucide-react-native';
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
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Settings</Text>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Sound</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Sound Effects</Text>
            <Switch
              value={soundEnabled}
              onValueChange={toggleSound}
              trackColor={{ false: COLORS.backgroundDark, true: COLORS.primaryLight }}
              thumbColor={soundEnabled ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          
          <Text style={styles.settingLabel}>Volume</Text>
          <View style={styles.volumeControls}>
            <TouchableOpacity
              style={[
                styles.volumeButton,
                soundVolume === 'off' && styles.volumeButtonActive
              ]}
              onPress={() => handleVolumeChange('off')}
            >
              <VolumeX
                size={24}
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
                size={24}
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
                size={24}
                color={soundVolume === 'medium' ? COLORS.white : COLORS.textPrimary}
              />
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Display</Text>
          
          <View style={styles.settingRow}>
            <Text style={styles.settingLabel}>Dark Mode</Text>
            <Switch
              value={darkMode}
              onValueChange={toggleDarkMode}
              trackColor={{ false: COLORS.backgroundDark, true: COLORS.primaryLight }}
              thumbColor={darkMode ? COLORS.primary : COLORS.textSecondary}
            />
          </View>
          
          <View style={styles.themeRow}>
            <TouchableOpacity
              style={[
                styles.themeButton,
                !darkMode && styles.themeButtonActive
              ]}
              onPress={() => setDarkMode(false)}
            >
              <Sun
                size={24}
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
                size={24}
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
        
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>Game</Text>
          
          <TouchableOpacity 
            style={styles.resetButton}
            onPress={handleResetAll}
          >
            <Text style={styles.resetButtonText}>Reset Game Statistics</Text>
          </TouchableOpacity>
          
          <View style={styles.noteContainer}>
            <HelpCircle size={20} color={COLORS.textSecondary} />
            <Text style={styles.noteText}>
              This will reset all scores and game history
            </Text>
          </View>
        </View>
        
        <View style={styles.footer}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
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
    paddingTop: SIZES.xxLarge,
    paddingBottom: SIZES.large,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.textPrimary,
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
    marginBottom: SIZES.large,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.large,
  },
  settingLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  volumeControls: {
    flexDirection: 'row',
    marginTop: SIZES.small,
    gap: SIZES.medium,
  },
  volumeButton: {
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.small,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
  },
  volumeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  themeRow: {
    flexDirection: 'row',
    marginTop: SIZES.medium,
    gap: SIZES.medium,
  },
  themeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.backgroundDark,
    padding: SIZES.medium,
    borderRadius: 8,
    flex: 1,
    gap: SIZES.small,
  },
  themeButtonActive: {
    backgroundColor: COLORS.primary,
  },
  themeButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.textPrimary,
  },
  themeButtonActiveText: {
    color: COLORS.white,
  },
  resetButton: {
    backgroundColor: COLORS.error,
    padding: SIZES.medium,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: SIZES.medium,
  },
  resetButtonText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.medium,
    color: COLORS.white,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES.small,
    gap: SIZES.small,
  },
  noteText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
    flex: 1,
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.large,
  },
  versionText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.small,
    color: COLORS.textSecondary,
  },
});