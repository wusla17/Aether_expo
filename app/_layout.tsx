import { ThemedText } from '@/components/ThemedText';
import { initDb } from '@/utils/database';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, useColorScheme, View } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;
  const [isDbReady, setIsDbReady] = useState(false);
  const [dbError, setDbError] = useState<string | null>(null);

  useEffect(() => {
    initDb()
      .then(() => setIsDbReady(true))
      .catch((err: any) => {
        console.error("Database initialization failed!", err);
        setDbError("Failed to initialize the database. Please restart the app.");
      });
  }, []);

  if (dbError) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ThemedText type="title">{dbError}</ThemedText>
      </View>
    );
  }

  if (!isDbReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
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
          name="search" 
          options={{ 
            title: 'Search',
          }} 
        />
        <Stack.Screen 
          name="todo" 
          options={{ 
            title: 'To-Do',
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}

