import { ThemedText } from '@/components/ThemedText';
import { initDb } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native'; // Keep useColorScheme for fallback
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';

enableScreens();

export default function RootLayout() {
  // State for theme preference, initialized from AsyncStorage
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  // State for database initialization
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettingsAndDb = async () => {
      // Load theme preference from AsyncStorage
      try {
        const storedDarkMode = await AsyncStorage.getItem('isDarkMode');
        // If 'isDarkMode' is not set or is 'true', use dark mode. Otherwise, use light mode.
        setIsDarkMode(storedDarkMode !== 'false');
      } catch (error) {
        console.error("Error loading theme preference:", error);
        // Fallback to system preference if AsyncStorage fails
        const systemColorScheme = useColorScheme();
        setIsDarkMode(systemColorScheme === 'dark');
      } finally {
        setIsLoadingTheme(false); // Theme loading is complete
      }

      // Initialize database
      try {
        await initDb();
        setIsDbReady(true);
      } catch (err: unknown) {
        console.error("Database initialization failed!", err);
        setDbError("Failed to initialize the database. Please restart the app.");
      }
    };

    loadSettingsAndDb();
  }, []);

  // Determine the theme based on the loaded preference
  const isDarkTheme = isDarkMode; // Directly use the state
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  // Show loading indicator while theme and DB are being initialized
  if (isLoadingTheme || !isDbReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </GestureHandlerRootView>
    );
  }

  // Show error message if database initialization failed
  if (dbError) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText type="title">{dbError}</ThemedText>
        </View>
      </GestureHandlerRootView>
    );
  }

  // Render the app once everything is ready
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            },
            headerTintColor: isDarkTheme ? '#ffffff' : '#000000',
            headerTitleStyle: {
              color: isDarkTheme ? '#ffffff' : '#000000',
            },
            headerShadowVisible: false,
          }}
        >
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="note/[id]"
            options={{
              title: 'Note',
            }}
          />
          <Stack.Screen
            name="note/new"
            options={{
              title: 'New Note',
            }}
          />
          <Stack.Screen
            name="todo/new-task"
            options={{
              title: 'New Task',
            }}
          />
          <Stack.Screen
            name="settings"
            options={{
              headerShown: false,
            }}
          />
          <Stack.Screen
            name="HelpSupportScreen"
            options={{
              headerShown: false,
            }}
          />
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}