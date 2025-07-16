import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams } from 'expo-router';
import React, { useMemo } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ListItemProps {
  iconName: string;
  title: string;
  workspace: string;
  onPress?: () => void;
}

const ListItem: React.FC<ListItemProps> = ({ iconName, title, workspace, onPress }) => (
  <TouchableOpacity style={styles.listItem} onPress={onPress} activeOpacity={0.7}>
    <MaterialCommunityIcons
      name={iconName as any}
      size={20}
      color="#AAAAAA"
      style={styles.listItemIcon}
    />
    <View style={styles.listItemTextContainer}>
      <Text style={styles.listItemTitle}>{title}</Text>
      <Text style={styles.listItemWorkspace}>in {workspace}</Text>
    </View>
  </TouchableOpacity>
);

interface SectionProps {
  title: string;
  children: React.ReactNode;
}

const Section: React.FC<SectionProps> = ({ title, children }) => (
  <View style={styles.section}>
    <Text style={styles.sectionTitle}>{title}</Text>
    {children}
  </View>
);

const ALL_DATA = [
    { id: '1', iconName: 'file-document-outline', title: 'Untitled', workspace: 'Welcome to Notion!', section: 'Today' },
    { id: '2', iconName: 'silverware-fork-knife', title: 'Meal Planner', workspace: 'Private', section: 'Yesterday' },
    { id: '3', iconName: 'format-list-bulleted', title: 'Weekly To-do List', workspace: 'Private', section: 'Yesterday' },
    { id: '4', iconName: 'file-document-outline', title: 'Untitled', workspace: 'Private', section: 'This month' },
    { id: '5', iconName: 'hand-wave', title: 'Welcome to Notion!', workspace: 'Private', section: 'This month' },
];

export default function SearchScreen() {
  const insets = useSafeAreaInsets();
  const { q: searchQuery = '' } = useLocalSearchParams<{ q: string }>();

  const filteredData = useMemo(() => {
    const lowercasedQuery = (searchQuery || '').toLowerCase();
    if (!lowercasedQuery) {
      const grouped = ALL_DATA.reduce((acc, item) => {
        (acc[item.section] = acc[item.section] || []).push(item);
        return acc;
      }, {} as Record<string, typeof ALL_DATA>);
      return grouped;
    }

    const filtered = ALL_DATA.filter(item =>
      item.title.toLowerCase().includes(lowercasedQuery) ||
      item.workspace.toLowerCase().includes(lowercasedQuery)
    );

    const grouped = filtered.reduce((acc, item) => {
        (acc[item.section] = acc[item.section] || []).push(item);
        return acc;
      }, {} as Record<string, typeof ALL_DATA>);
    return grouped;

  }, [searchQuery]);

  const handleItemPress = (title: string) => {
    console.log(`Pressed: ${title}`);
    // Add navigation or action logic here
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          <View style={styles.greetingContainer}>
            <Text style={styles.handWave}>👋</Text>
            <Text style={styles.greetingText}>Ask anything Aether...</Text>
          </View>
          {Object.entries(filteredData).map(([sectionTitle, items]) => (
            <Section key={sectionTitle} title={sectionTitle}>
              {items.map(item => (
                <ListItem
                  key={item.id}
                  iconName={item.iconName}
                  title={item.title}
                  workspace={item.workspace}
                  onPress={() => handleItemPress(item.title)}
                />
              ))}
            </Section>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  scrollContent: {
    paddingHorizontal: 20,
  },
  greetingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 4,
  },
  handWave: {
    fontSize: 24,
    marginRight: 12,
  },
  greetingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  headerIcon: {
    marginRight: 12,
  },
  searchInput: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    height: 40,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 16,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 6,
  },
  listItemIcon: {
    marginRight: 16,
    marginTop: 2,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  listItemWorkspace: {
    color: '#AAAAAA',
    fontSize: 14,
    fontWeight: '400',
  },
});
