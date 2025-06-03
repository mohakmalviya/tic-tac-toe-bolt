import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { TowerControl as GameController, CircleHelp as HelpCircle, Settings } from 'lucide-react-native';
import { COLORS, FONTS } from '@/constants/theme';
import { GameProvider } from '@/contexts/GameContext';

export default function TabLayout() {
  return (
    <GameProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: COLORS.textSecondary,
          tabBarStyle: styles.tabBar,
          tabBarLabelStyle: styles.tabBarLabel,
          headerShown: false,
        }}>
        <Tabs.Screen
          name="index"
          options={{
            title: 'Game',
            tabBarIcon: ({ color, size }) => (
              <GameController color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="how-to-play"
          options={{
            title: 'How To Play',
            tabBarIcon: ({ color, size }) => (
              <HelpCircle color={color} size={size} />
            ),
          }}
        />
        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarIcon: ({ color, size }) => (
              <Settings color={color} size={size} />
            ),
          }}
        />
      </Tabs>
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: COLORS.white,
    borderTopColor: COLORS.border,
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});