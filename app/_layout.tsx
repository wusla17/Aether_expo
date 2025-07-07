import { initDb } from '@/utils/database';
import { Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { useColorScheme } from 'react-native';
import { MD3DarkTheme, MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';

 

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const isDarkTheme = colorScheme === 'dark';
  const theme = isDarkTheme ? MD3DarkTheme : MD3LightTheme;
  const [isDbReady, setIsDbReady] = useState(false);

  useEffect(() => {
    initDb()
      .then(() => {
        setIsDbReady(true);
      })
      .catch((err: any) => {
        console.log("Database initialization failed!", err);
      });
  }, []);

  if (!isDbReady) {
    return null; // Or a loading screen
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
            headerStyle: {
              backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            },
            headerTintColor: isDarkTheme ? '#ffffff' : '#000000',
            headerTitleStyle: {
              color: isDarkTheme ? '#ffffff' : '#000000',
            },
          }} 
        />
        <Stack.Screen 
          name="note/new" 
          options={{ 
            title: 'New Note',
            headerShown: true  // Hide header completely for new note screen
          }} 
        />
        <Stack.Screen 
          name="search" 
          options={{ 
            title: 'Search',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            },
            headerTintColor: isDarkTheme ? '#ffffff' : '#000000',
            headerTitleStyle: {
              color: isDarkTheme ? '#ffffff' : '#000000',
            },
          }} 
        />
        <Stack.Screen 
          name="todo" 
          options={{ 
            title: 'To-Do',
            headerStyle: {
              backgroundColor: isDarkTheme ? '#000000' : '#ffffff',
            },
            headerTintColor: isDarkTheme ? '#ffffff' : '#000000',
            headerTitleStyle: {
              color: isDarkTheme ? '#ffffff' : '#000000',
            },
          }} 
        />
      </Stack>
    </PaperProvider>
  );
}
