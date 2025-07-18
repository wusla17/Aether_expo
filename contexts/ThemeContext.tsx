import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme as useSystemColorScheme } from 'react-native';

interface ThemeContextType {
  isDarkMode: boolean;
  toggleDarkMode: (newValue: boolean) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useSystemColorScheme();
  const [isDarkMode, setIsDarkMode] = useState(systemColorScheme === 'dark');

  useEffect(() => {
    const loadTheme = async () => {
      try {
        const storedDarkMode = await AsyncStorage.getItem('isDarkMode');
        if (storedDarkMode !== null) {
          setIsDarkMode(storedDarkMode === 'true');
        } else {
          // If no preference is stored, use system preference
          setIsDarkMode(systemColorScheme === 'dark');
        }
      } catch (error) {
        console.error("Failed to load theme from AsyncStorage", error);
        // Fallback to system preference on error
        setIsDarkMode(systemColorScheme === 'dark');
      }
    };
    loadTheme();
  }, [systemColorScheme]);

  const toggleDarkMode = async (newValue: boolean) => {
    setIsDarkMode(newValue);
    try {
      await AsyncStorage.setItem('isDarkMode', String(newValue));
    } catch (error) {
      console.error("Failed to save theme to AsyncStorage", error);
    }
  };

  return (
    <ThemeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useAppColorScheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useAppColorScheme must be used within a ThemeProvider');
  }
  return context;
};
