
import { ThemedView } from '@/components/ThemedView';
import { clearDb, getTodos } from '@/utils/database';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useEffect, useState } from 'react';
import {
  Platform,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import GlassmorphicModal from '@/components/ui/GlassmorphicModal';

interface SettingItemProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  isDarkMode: boolean;
}

const SettingItem = ({ icon, label, value, onValueChange, isDarkMode }: SettingItemProps) => (
  <View
    style={[
      styles.settingItem,
      { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFF' },
    ]}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <Feather
        name={icon}
        size={20}
        color={isDarkMode ? '#A2A2A2' : '#888'}
        style={{ marginRight: 15 }}
      />
      <Text style={[styles.settingLabel, { color: isDarkMode ? '#EAEAEA' : '#333' }]}>
        {label}
      </Text>
    </View>
    <Switch
      onValueChange={onValueChange}
      value={value}
      trackColor={{ false: isDarkMode ? '#39393D' : '#E9E9EA', true: '#34C759' }}
      thumbColor={'#FFF'}
      ios_backgroundColor={isDarkMode ? '#39393D' : '#E9E9EA'}
    />
  </View>
);

interface StatCardProps {
  icon: keyof typeof Feather.glyphMap;
  label: string;
  value: string;
  isDarkMode: boolean;
}

const StatCard = ({ icon, label, value, isDarkMode }: StatCardProps) => (
  <View
    style={[
      styles.statCard,
      { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFF' },
    ]}
  >
    <Feather name={icon} size={22} color={isDarkMode ? '#A2A2A2' : '#888'} />
    <Text style={[styles.statLabel, { color: isDarkMode ? '#A2A2A2' : '#888' }]}>
      {label}
    </Text>
    <Text style={[styles.statValue, { color: isDarkMode ? '#EAEAEA' : '#333' }]}>
      {value}
    </Text>
  </View>
);

export default function SettingsScreen() {
  const [isDarkMode, setIsDarkMode] = useState(true); // Default to dark mode
  const [hapticsEnabled, setHapticsEnabled] = useState(true);
  const [appUsage, setAppUsage] = useState(0);
  const [completedTodos, setCompletedTodos] = useState(0);
  const [totalTodos, setTotalTodos] = useState(0);
  const [isModalVisible, setIsModalVisible] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      const darkMode = await AsyncStorage.getItem('isDarkMode');
      setIsDarkMode(darkMode !== 'false'); // Default to true if not set
      const haptics = await AsyncStorage.getItem('hapticsEnabled');
      setHapticsEnabled(haptics !== 'false');
    };

    const fetchAppUsage = async () => {
      const usage = await AsyncStorage.getItem('appUsage');
      setAppUsage(usage ? parseInt(usage, 10) : 0);
    };

    const fetchTodoStats = async () => {
      const todos = await getTodos();
      setTotalTodos(todos.length);
      setCompletedTodos(todos.filter(todo => todo.completed).length);
    };

    fetchSettings();
    fetchAppUsage();
    fetchTodoStats();

    const usageInterval = setInterval(async () => {
      const currentUsage = await AsyncStorage.getItem('appUsage');
      const newUsage = currentUsage ? parseInt(currentUsage, 10) + 1 : 1;
      await AsyncStorage.setItem('appUsage', newUsage.toString());
      setAppUsage(newUsage);
    }, 60000); // Increment usage every minute

    return () => clearInterval(usageInterval);
  }, []);

  const toggleDarkMode = async () => {
    const newValue = !isDarkMode;
    setIsDarkMode(newValue);
    await AsyncStorage.setItem('isDarkMode', newValue.toString());
  };

  const toggleHaptics = async () => {
    const newValue = !hapticsEnabled;
    setHapticsEnabled(newValue);
    await AsyncStorage.setItem('hapticsEnabled', newValue.toString());
    if (newValue) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleClearData = () => {
    setIsModalVisible(true);
  };

  const handleConfirmClear = async () => {
    setIsModalVisible(false);
    await clearDb();
    await AsyncStorage.clear();
    setAppUsage(0);
    setCompletedTodos(0);
    setTotalTodos(0);
    Alert.alert('Data Cleared', 'All local data has been cleared.');
  };

  const handleCancelClear = () => {
    setIsModalVisible(false);
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#F2F2F7' },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>
        Settings
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#8E8E93' : '#6D6D72' }]}>
          Appearance
        </Text>
        <SettingItem
          icon="moon"
          label="Dark Mode"
          value={isDarkMode}
          onValueChange={toggleDarkMode}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#8E8E93' : '#6D6D72' }]}>
          General
        </Text>
        <SettingItem
          icon="zap"
          label="Haptic Feedback"
          value={hapticsEnabled}
          onValueChange={toggleHaptics}
          isDarkMode={isDarkMode}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#8E8E93' : '#6D6D72' }]}>
          Statistics
        </Text>
        <View style={styles.statsContainer}>
          <StatCard
            icon="clock"
            label="App Usage"
            value={`${Math.floor(appUsage / 60)}h ${appUsage % 60}m`}
            isDarkMode={isDarkMode}
          />
          <StatCard
            icon="check-square"
            label="Habit Tracker"
            value={`${completedTodos}/${totalTodos} done`}
            isDarkMode={isDarkMode}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: isDarkMode ? '#8E8E93' : '#6D6D72' }]}>
          Data Management
        </Text>
        <TouchableOpacity
          onPress={handleClearData}
          style={[
            styles.clearDataButton,
            { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFF' },
          ]}
        >
          <Feather
            name="trash-2"
            size={20}
            color="#FF453A"
            style={{ marginRight: 10 }}
          />
          <Text style={[styles.clearDataButtonText, { color: '#FF453A' }]}>
            Clear All Local Data
          </Text>
        </TouchableOpacity>
      </View>

      <GlassmorphicModal
        visible={isModalVisible}
        title="Clear All Local Data"
        message="Are you sure you want to clear all local data? This action cannot be undone."
        onClear={handleConfirmClear}
        onCancel={handleCancelClear}
        isDarkMode={isDarkMode}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60, // Adjust for status bar
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    paddingHorizontal: 5,
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '400',
    textTransform: 'uppercase',
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderRadius: 10,
    paddingHorizontal: 15,
  },
  settingLabel: {
    fontSize: 17,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statCard: {
    borderRadius: 10,
    padding: 18,
    alignItems: 'flex-start',
    width: '48.5%',
  },
  statLabel: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: '500',
  },
  statValue: {
    marginTop: 4,
    fontSize: 22,
    fontWeight: '600',
  },
  clearDataButton: {
    padding: 15,
    borderRadius: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  clearDataButtonText: {
    fontWeight: '600',
    fontSize: 17,
  },
});
