import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, Switch, TouchableOpacity, Alert, Linking } from 'react-native';
import { FONTS, SHADOWS, SIZES } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { 
  Volume2, 
  Volume1, 
  VolumeX, 
  Palette, 
  Trash2, 
  Settings, 
  Gamepad2, 
  CircleHelp as HelpCircle, 
  Info, 
  Share2, 
  Star,
  Trophy,
  Zap,
  Shield,
  Github,
  ExternalLink
} from 'lucide-react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useGame } from '@/contexts/GameContext';
import ThemeToggle from '@/components/ThemeToggle';

export default function SettingsScreen() {
  const { theme, isDark } = useTheme();
  const { handleResetAll } = useGame();
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [soundVolume, setSoundVolume] = useState('medium'); // 'off', 'low', 'medium', 'high'
  const [vibrationEnabled, setVibrationEnabled] = useState(true);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);
  
  const toggleSound = () => setSoundEnabled(prev => !prev);
  const toggleVibration = () => setVibrationEnabled(prev => !prev);
  const toggleAutoSave = () => setAutoSaveEnabled(prev => !prev);
  const toggleAnimations = () => setAnimationsEnabled(prev => !prev);
  
  const handleVolumeChange = (volume: string) => {
    setSoundVolume(volume);
    if (volume === 'off') {
      setSoundEnabled(false);
    } else {
      setSoundEnabled(true);
    }
  };

  const handleResetStats = () => {
    Alert.alert(
      "Reset Statistics",
      "Are you sure you want to reset all game statistics? This action cannot be undone.",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Reset", style: "destructive", onPress: handleResetAll }
      ]
    );
  };

  const handleShareApp = () => {
    Alert.alert(
      "Share App",
      "Share this amazing Tic Tac Toe Bolt game with your friends!",
      [{ text: "OK" }]
    );
  };

  const handleRateApp = () => {
    Alert.alert(
      "Rate App",
      "Enjoying the game? Please rate us in the app store!",
      [{ text: "Maybe Later" }, { text: "Rate Now", style: "default" }]
    );
  };

  const handleGitHub = async () => {
    const githubUrl = 'https://github.com/mohakmalviya/tic-tac-toe-bolt';
    try {
      const supported = await Linking.canOpenURL(githubUrl);
      if (supported) {
        await Linking.openURL(githubUrl);
      } else {
        Alert.alert(
          "GitHub Repository",
          "⭐ Star us on GitHub!\n\nhttps://github.com/mohakmalviya/tic-tac-toe-bolt",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      Alert.alert(
        "GitHub Repository",
        "⭐ Star us on GitHub!\n\nhttps://github.com/mohakmalviya/tic-tac-toe-bolt",
        [{ text: "OK" }]
      );
    }
  };

  // Dynamic gradient colors based on theme
  const backgroundGradient = isDark 
    ? [theme.background, theme.backgroundSecondary, theme.backgroundTertiary]
    : ['#ECFCCB', '#FDF2F8', '#E0F2FE', '#F3E8FF']; // Lime -> Pink -> Cyan -> Purple

  const cardGradient = isDark
    ? [theme.cardBackground, theme.backgroundSecondary]
    : [theme.cardBackground, theme.backgroundSecondary];
  
  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <LinearGradient
        colors={backgroundGradient}
        style={styles.backgroundGradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          {/* Enhanced Header */}
          <View style={styles.header}>
            <View style={[styles.headerIcon, { 
              backgroundColor: theme.primary + '20',
              borderColor: theme.primary + '30'
            }]}>
              <Settings size={32} color={theme.primary} />
            </View>
            <Text style={[styles.title, { color: theme.textPrimary }]}>Settings</Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>Customize your game experience</Text>
          </View>
          
          {/* Sound & Haptics Settings Card */}
          <View style={[styles.card, { 
            shadowColor: isDark ? theme.black : theme.shadowPiece,
            backgroundColor: theme.cardBackground 
          }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.primary + '20' }]}>
                  <Volume2 size={24} color={theme.primary} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Audio & Haptics</Text>
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Sound Effects</Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Play sounds for moves and wins</Text>
                </View>
                <Switch
                  value={soundEnabled}
                  onValueChange={toggleSound}
                  trackColor={{ false: theme.border, true: theme.primary + '40' }}
                  thumbColor={soundEnabled ? theme.primary : theme.textSecondary}
                  ios_backgroundColor={theme.border}
                />
              </View>
              
              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Vibration</Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Haptic feedback for interactions</Text>
                </View>
                <Switch
                  value={vibrationEnabled}
                  onValueChange={toggleVibration}
                  trackColor={{ false: theme.border, true: theme.primary + '40' }}
                  thumbColor={vibrationEnabled ? theme.primary : theme.textSecondary}
                  ios_backgroundColor={theme.border}
                />
              </View>
              
              <View style={styles.volumeSection}>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Volume Level</Text>
                <View style={styles.volumeControls}>
                  <TouchableOpacity
                    style={[
                      styles.volumeButton,
                      { 
                        backgroundColor: soundVolume === 'off' ? theme.primary : theme.surfaceElevated,
                        borderColor: soundVolume === 'off' ? theme.primary : theme.border,
                      }
                    ]}
                    onPress={() => handleVolumeChange('off')}
                  >
                    <VolumeX
                      size={20}
                      color={soundVolume === 'off' ? theme.textInverse : theme.textPrimary}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.volumeButton,
                      { 
                        backgroundColor: soundVolume === 'low' ? theme.primary : theme.surfaceElevated,
                        borderColor: soundVolume === 'low' ? theme.primary : theme.border,
                      }
                    ]}
                    onPress={() => handleVolumeChange('low')}
                  >
                    <Volume1
                      size={20}
                      color={soundVolume === 'low' ? theme.textInverse : theme.textPrimary}
                    />
                  </TouchableOpacity>
                  
                  <TouchableOpacity
                    style={[
                      styles.volumeButton,
                      { 
                        backgroundColor: soundVolume === 'medium' ? theme.primary : theme.surfaceElevated,
                        borderColor: soundVolume === 'medium' ? theme.primary : theme.border,
                      }
                    ]}
                    onPress={() => handleVolumeChange('medium')}
                  >
                    <Volume2
                      size={20}
                      color={soundVolume === 'medium' ? theme.textInverse : theme.textPrimary}
                    />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
          
          {/* Display & Performance Settings Card */}
          <View style={[styles.card, { 
            shadowColor: isDark ? theme.black : theme.shadowPiece,
            backgroundColor: theme.cardBackground 
          }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.secondary + '20' }]}>
                  <Palette size={24} color={theme.secondary} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Display & Performance</Text>
              </View>
              
              <View style={styles.themeSection}>
                <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Theme Selection</Text>
                <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Choose your preferred appearance</Text>
                <View style={styles.themeToggleContainer}>
                  <ThemeToggle showLabels={true} size="medium" />
                </View>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Animations</Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Enable smooth transitions and effects</Text>
                </View>
                <Switch
                  value={animationsEnabled}
                  onValueChange={toggleAnimations}
                  trackColor={{ false: theme.border, true: theme.secondary + '40' }}
                  thumbColor={animationsEnabled ? theme.secondary : theme.textSecondary}
                  ios_backgroundColor={theme.border}
                />
              </View>
            </View>
          </View>

          {/* Game Settings Card */}
          <View style={[styles.card, { 
            shadowColor: isDark ? theme.black : theme.shadowPiece,
            backgroundColor: theme.cardBackground 
          }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.warning + '20' }]}>
                  <Gamepad2 size={24} color={theme.warning} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>Game Settings</Text>
              </View>

              <View style={styles.settingRow}>
                <View style={styles.settingInfo}>
                  <Text style={[styles.settingLabel, { color: theme.textPrimary }]}>Auto Save</Text>
                  <Text style={[styles.settingDescription, { color: theme.textSecondary }]}>Automatically save game progress</Text>
                </View>
                <Switch
                  value={autoSaveEnabled}
                  onValueChange={toggleAutoSave}
                  trackColor={{ false: theme.border, true: theme.warning + '40' }}
                  thumbColor={autoSaveEnabled ? theme.warning : theme.textSecondary}
                  ios_backgroundColor={theme.border}
                />
              </View>
              
              <TouchableOpacity 
                style={[styles.resetButton, { 
                  backgroundColor: theme.error + '15',
                  borderColor: theme.error + '30',
                }]}
                onPress={handleResetStats}
              >
                <Trash2 size={20} color={theme.error} />
                <Text style={[styles.resetButtonText, { color: theme.error }]}>Reset Game Statistics</Text>
              </TouchableOpacity>
              
              <View style={[styles.noteContainer, {
                backgroundColor: theme.warning + '10',
                borderLeftColor: theme.warning,
              }]}>
                <HelpCircle size={18} color={theme.warning} />
                <Text style={[styles.noteText, { color: theme.textSecondary }]}>
                  This will permanently delete all scores and game history
                </Text>
              </View>
            </View>
          </View>

          {/* App & Support Card */}
          <View style={[styles.card, { 
            shadowColor: isDark ? theme.black : theme.shadowPiece,
            backgroundColor: theme.cardBackground 
          }]}>
            <View style={styles.cardContent}>
              <View style={styles.cardHeader}>
                <View style={[styles.cardIcon, { backgroundColor: theme.success + '20' }]}>
                  <Star size={24} color={theme.success} />
                </View>
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>App & Support</Text>
              </View>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.success + '15' }]}
                onPress={handleRateApp}
              >
                <Star size={20} color={theme.success} />
                <View style={styles.actionButtonText}>
                  <Text style={[styles.actionButtonTitle, { color: theme.success }]}>Rate App</Text>
                  <Text style={[styles.actionButtonSubtitle, { color: theme.textSecondary }]}>Help us improve with your feedback</Text>
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.textPrimary + '15' }]}
                onPress={handleGitHub}
              >
                <Github size={20} color={theme.textPrimary} />
                <View style={styles.actionButtonText}>
                  <Text style={[styles.actionButtonTitle, { color: theme.textPrimary }]}>⭐ Star on GitHub</Text>
                  <Text style={[styles.actionButtonSubtitle, { color: theme.textSecondary }]}>Support the project and contribute</Text>
                </View>
                <ExternalLink size={16} color={theme.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.actionButton, { backgroundColor: theme.primary + '15' }]}
                onPress={handleShareApp}
              >
                <Share2 size={20} color={theme.primary} />
                <View style={styles.actionButtonText}>
                  <Text style={[styles.actionButtonTitle, { color: theme.primary }]}>Share App</Text>
                  <Text style={[styles.actionButtonSubtitle, { color: theme.textSecondary }]}>Share with friends and family</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
          
          {/* Enhanced Footer */}
          <View style={styles.footer}>
            <View style={[styles.footerIcon, { backgroundColor: theme.primary + '20' }]}>
              <Trophy size={20} color={theme.primary} />
            </View>
            <Text style={[styles.versionText, { color: theme.textPrimary }]}>Tic Tac Toe Bolt</Text>
            <Text style={[styles.versionNumber, { color: theme.textSecondary }]}>Version 1.0.0</Text>
            <Text style={[styles.footerSubtext, { color: theme.textSecondary }]}>Made with ❤️ for strategic gaming</Text>
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
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
    borderWidth: 2,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    marginBottom: SIZES.xSmall,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  card: {
    marginBottom: SIZES.large,
    borderRadius: 20,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontSize: SIZES.medium,
    flex: 1,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: SIZES.medium,
  },
  settingInfo: {
    flex: 1,
  },
  settingLabel: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
  },
  settingDescription: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
    flex: 1,
    lineHeight: 18,
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
    padding: SIZES.small,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    width: 48,
    height: 48,
    borderWidth: 1,
  },
  themeSection: {
    marginTop: SIZES.small,
    marginBottom: SIZES.medium,
  },
  themeToggleContainer: {
    marginTop: SIZES.small,
  },
  resetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    borderRadius: 12,
    gap: SIZES.small,
    marginBottom: SIZES.medium,
    borderWidth: 1,
  },
  resetButtonText: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  noteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    padding: SIZES.small,
    gap: SIZES.small,
    borderLeftWidth: 3,
  },
  noteText: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
    flex: 1,
    lineHeight: 18,
  },
  footer: {
    alignItems: 'center',
    marginTop: SIZES.large,
    paddingVertical: SIZES.medium,
  },
  footerIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SIZES.medium,
  },
  versionText: {
    fontFamily: FONTS.medium,
    fontSize: SIZES.small,
    marginBottom: SIZES.xSmall,
  },
  versionNumber: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
  },
  footerSubtext: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: SIZES.medium,
    borderRadius: 12,
    gap: SIZES.small,
    marginBottom: SIZES.medium,
  },
  actionButtonText: {
    flex: 1,
  },
  actionButtonTitle: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.small,
  },
  actionButtonSubtitle: {
    fontFamily: FONTS.regular,
    fontSize: SIZES.xSmall,
  },
});