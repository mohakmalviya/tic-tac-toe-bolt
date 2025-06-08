import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Sun, Moon, Monitor } from 'lucide-react-native';
import { useTheme } from '@/contexts/ThemeContext';
import { FONTS, SIZES } from '@/constants/theme';

interface ThemeToggleProps {
  showLabels?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ 
  showLabels = false, 
  size = 'medium' 
}) => {
  const { theme, themeMode, setThemeMode, isDark } = useTheme();

  const iconSize = size === 'small' ? 16 : size === 'medium' ? 20 : 24;
  const buttonSize = size === 'small' ? 32 : size === 'medium' ? 40 : 48;

  const ThemeButton = ({ 
    mode, 
    icon, 
    label 
  }: { 
    mode: 'light' | 'dark' | 'system'; 
    icon: React.ReactNode; 
    label: string;
  }) => {
    const isActive = themeMode === mode;
    
    return (
      <TouchableOpacity
        style={[
          styles.themeButton,
          {
            backgroundColor: isActive ? theme.primary : theme.cardBackground,
            borderColor: isActive ? theme.primary : theme.border,
            width: buttonSize,
            height: buttonSize,
          }
        ]}
        onPress={() => setThemeMode(mode)}
      >
        <View style={styles.iconContainer}>
          {React.cloneElement(icon as React.ReactElement, {
            color: isActive ? theme.white : theme.textSecondary,
            size: iconSize,
          })}
        </View>
        {showLabels && (
          <Text style={[
            styles.label,
            {
              color: isActive ? theme.primary : theme.textSecondary,
              fontSize: size === 'small' ? SIZES.xSmall : SIZES.small,
            }
          ]}>
            {label}
          </Text>
        )}
      </TouchableOpacity>
    );
  };

  if (showLabels) {
    return (
      <View style={styles.labeledContainer}>
        <Text style={[styles.title, { color: theme.textPrimary }]}>
          Theme
        </Text>
        <View style={styles.buttonGroup}>
          <ThemeButton mode="light" icon={<Sun />} label="Light" />
          <ThemeButton mode="dark" icon={<Moon />} label="Dark" />
          <ThemeButton mode="system" icon={<Monitor />} label="Auto" />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.compactContainer}>
      <ThemeButton mode="light" icon={<Sun />} label="Light" />
      <ThemeButton mode="dark" icon={<Moon />} label="Dark" />
      <ThemeButton mode="system" icon={<Monitor />} label="Auto" />
    </View>
  );
};

const styles = StyleSheet.create({
  labeledContainer: {
    gap: SIZES.medium,
  },
  compactContainer: {
    flexDirection: 'row',
    gap: SIZES.small,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: SIZES.medium,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: SIZES.small,
  },
  themeButton: {
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    fontFamily: FONTS.medium,
    marginTop: 2,
    textAlign: 'center',
    position: 'absolute',
    bottom: -18,
    left: 0,
    right: 0,
  },
});

export default ThemeToggle; 