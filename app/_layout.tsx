import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '@/hooks/useFrameworkReady';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_700Bold
} from '@expo-google-fonts/poppins';
import { GameProvider } from '@/contexts/GameContext';
import { SupabaseMultiplayerProvider } from '@/contexts/SupabaseMultiplayerContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

// Prevent splash screen from auto-hiding
SplashScreen.preventAutoHideAsync().catch(() => {
  /* reloading the app might trigger some race conditions, ignore them */
});

export default function RootLayout() {
  useFrameworkReady();
  const [appReady, setAppReady] = useState(false);

  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-Bold': Poppins_700Bold,
  });

  // Hide splash screen once fonts are loaded or after timeout
  useEffect(() => {
    const prepareApp = async () => {
      try {
        // Wait for fonts to load or fail
        if (fontsLoaded || fontError) {
          setAppReady(true);
        }
      } catch (e) {
        console.warn('Font loading error:', e);
        // Continue anyway with system fonts
        setAppReady(true);
      } finally {
        await SplashScreen.hideAsync();
      }
    };

    // Set a timeout as fallback
    const timeout = setTimeout(() => {
      console.warn('Font loading timeout, continuing with system fonts');
      setAppReady(true);
      SplashScreen.hideAsync();
    }, 5000);

    if (fontsLoaded || fontError) {
      clearTimeout(timeout);
      prepareApp();
    }

    return () => clearTimeout(timeout);
  }, [fontsLoaded, fontError]);

  // Return null to keep splash screen visible while app prepares
  if (!appReady) {
    return null;
  }

  return (
    <ThemeProvider>
      <SupabaseMultiplayerProvider>
        <GameProvider>
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
          <StatusBar style="auto" />
        </GameProvider>
      </SupabaseMultiplayerProvider>
    </ThemeProvider>
  );
}