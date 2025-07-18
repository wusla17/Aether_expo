import { ThemedText } from '@/components/ThemedText';
import { initDb } from '@/utils/database';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';
import { ThemeProvider, useAppColorScheme } from '@/contexts/ThemeContext';

enableScreens();

function RootLayoutContent() {
  const { isDarkMode, toggleDarkMode } = useAppColorScheme();
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const initializeDb = async () => {
      try {
        await initDb();
        setIsDbReady(true);
      } catch (err: unknown) {
        console.error("Database initialization failed!", err);
        setDbError("Failed to initialize the database. Please restart the app.");
      }
    };
    initializeDb();
  }, []);

  const theme = isDarkMode ? MD3DarkTheme : MD3LightTheme;

  if (!isDbReady) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" />
        </View>
      </GestureHandlerRootView>
    );
  }

  if (dbError) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ThemedText type="title">{dbError}</ThemedText>
        </View>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Stack
          screenOptions={{
            headerStyle: {
              backgroundColor: isDarkMode ? '#000000' : '#ffffff',
            },
            headerTintColor: isDarkMode ? '#ffffff' : '#000000',
            headerTitleStyle: {
              color: isDarkMode ? '#ffffff' : '#000000',
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
        </Stack>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

export default function RootLayout() {
  return (
    <ThemeProvider>
      <RootLayoutContent />
    </ThemeProvider>
  );
}
