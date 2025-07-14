
import React from 'react';
import { View, Text, StyleSheet, TextInput, ScrollView, StatusBar } from 'react-native';
import { Feather, FileText, List, Clock } from 'lucide-react-native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const recentItems = {
    "Today": [
      { type: 'note', title: 'Meeting Notes', subtitle: 'Project Alpha kickoff' },
      { type: 'task', title: 'Design mockups', subtitle: 'For the new feature' },
    ],
    "Last week": [
        { type: 'note', title: 'Brainstorming session', subtitle: 'Ideas for Q3' },
        { type: 'task', title: 'Update documentation', subtitle: 'API changes' },
        { type: 'note', title: 'User feedback summary', subtitle: 'From the survey' },
    ]
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'note':
        return <FileText color="#9ca3af" size={20} />;
      case 'task':
        return <List color="#9ca3af" size={20} />;
      default:
        return <Clock color="#9ca3af" size={20} />;
    }
  };

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.header}>
        <Feather name="search" size={20} color="#9ca3af" style={styles.searchIcon} />
        <TextInput
          style={styles.searchBar}
          placeholder="Ask AI anything in Aether"
          placeholderTextColor="#9ca3af"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {Object.entries(recentItems).map(([sectionTitle, items]) => (
          <View key={sectionTitle} style={styles.section}>
            <ThemedText style={styles.sectionHeader}>{sectionTitle}</ThemedText>
            {items.map((item, index) => (
              <View key={index} style={styles.itemContainer}>
                <View style={styles.itemIcon}>{getIcon(item.type)}</View>
                <View>
                  <ThemedText style={styles.itemTitle}>{item.title}</ThemedText>
                  <ThemedText style={styles.itemSubtitle}>{item.subtitle}</ThemedText>
                </View>
              </View>
            ))}
          </View>
        ))}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 8,
  },
  searchIcon: {
    marginRight: 12,
  },
  searchBar: {
    flex: 1,
    height: 40,
    backgroundColor: '#2c2c2e',
    borderRadius: 10,
    paddingHorizontal: 16,
    color: 'white',
    fontSize: 16,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  section: {
    marginTop: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 12,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#2c2c2e',
  },
  itemIcon: {
    marginRight: 16,
  },
  itemTitle: {
    fontSize: 16,
    color: '#f9fafb',
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    marginTop: 2,
  },
});

export default SearchScreen;
