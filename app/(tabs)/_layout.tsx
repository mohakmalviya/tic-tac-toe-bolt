import { Tabs } from 'expo-router';
import { StyleSheet } from 'react-native';
import { Gamepad2, CircleHelp as HelpCircle, Settings } from 'lucide-react-native';
import { FONTS } from '@/constants/theme';
import { useTheme } from '@/contexts/ThemeContext';
import { GameProvider } from '@/contexts/GameContext';
import { useSupabaseMultiplayer } from '@/contexts/SupabaseMultiplayerContext';

function TabLayoutContent() {
  const { theme } = useTheme();
  const { roomId, opponent, gameState } = useSupabaseMultiplayer();
  
  // Hide tabs when in an active multiplayer match
  // Show tabs when: not in a room, or in a room but no opponent and no active game
  const shouldHideTabs = roomId && (opponent || (gameState && !gameState.gameOver));
  
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSecondary,
        tabBarStyle: shouldHideTabs ? { display: 'none' } : [styles.tabBar, { 
          backgroundColor: theme.tabBackground,
          borderTopColor: theme.border,
        }],
        tabBarLabelStyle: styles.tabBarLabel,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Game',
          tabBarIcon: ({ color, size }) => (
            <Gamepad2 color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="local-game"
        options={{
          href: null, // This hides it from the tab bar
        }}
      />
      <Tabs.Screen
        name="multiplayer"
        options={{
          href: null, // This hides it from the tab bar
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
  );
}

export default function TabLayout() {
  return (
    <GameProvider>
      <TabLayoutContent />
    </GameProvider>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    height: 60,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontFamily: FONTS.medium,
    fontSize: 12,
  },
});