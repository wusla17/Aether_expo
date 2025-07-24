import { ThemedText } from '@/components/ThemedText';
import { initDb } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';
import { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { enableScreens } from 'react-native-screens';

import { EventModalProvider } from '../context/EventModalContext';
import EventDetailsModal from '../components/EventDetailsModal';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

enableScreens();

export default function RootLayout() {
  const [isDarkMode, setIsDarkMode] = useState<boolean>(true);
  const [isLoadingTheme, setIsLoadingTheme] = useState(true);

  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    const loadSettingsAndDb = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem('isDarkMode');
        setIsDarkMode(storedDarkMode !== 'false');
      } catch (error) {
        console.error("Error loading theme preference:", error);
        const systemColorScheme = useColorScheme();
        setIsDarkMode(systemColorScheme === 'dark');
      } finally {
        setIsLoadingTheme(false);
      }

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

  const isDarkTheme = isDarkMode;
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;

  if (isLoadingTheme || !isDbReady) {
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
      <EventModalProvider>
        <BottomSheetModalProvider>
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
            <EventDetailsModal />
          </PaperProvider>
        </BottomSheetModalProvider>
      </EventModalProvider>
    </GestureHandlerRootView>
  );
}
