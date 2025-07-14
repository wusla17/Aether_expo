import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { SearchResult, searchNotesAndTodos } from '@/utils/database';
import { useFocusEffect } from 'expo-router';
import { Clock, FileText, List } from 'lucide-react-native'; // Removed XCircle as it's not in the image for recent searches
import { useCallback, useEffect, useState } from 'react';
import { Platform, ScrollView, StatusBar, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Define a global state manager for search query
let globalSearchQuery = '';
const searchListeners: ((query: string) => void)[] = [];

export const updateGlobalSearchQuery = (query: string) => {
  globalSearchQuery = query;
  searchListeners.forEach(listener => listener(query));
};

export const subscribeToSearchQuery = (listener: (query: string) => void) => {
  searchListeners.push(listener);
  return () => {
    const index = searchListeners.indexOf(listener);
    if (index > -1) {
      searchListeners.splice(index, 1);
    }
  };
};

const SearchScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [recentItems, setRecentItems] = useState<SearchResult[]>([
    { id: 'note1', name: 'Weekly To-do List', description: 'in Private', type: 'todo', createdAt: Date.now() - (1 * 24 * 60 * 60 * 1000) }, // Yesterday
    { id: 'note2', name: 'Untitled', description: 'in Welcome to Notion!', type: 'note', createdAt: Date.now() - (10 * 24 * 60 * 60 * 1000) }, // 10 days ago
    { id: 'note3', name: 'Untitled', description: 'in Private', type: 'note', createdAt: Date.now() - (15 * 24 * 60 * 60 * 1000) }, // 15 days ago
    { id: 'note4', name: 'Welcome to Notion!', description: 'in Private', type: 'note', createdAt: Date.now() - (20 * 24 * 60 * 60 * 1000) }, // 20 days ago
  ]);

  const insets = useSafeAreaInsets();
  const tabBarHeight = Platform.OS === 'ios' ? 50 : 60;
  const bottomPaddingForTabBar = insets.bottom + tabBarHeight + 20; // Padding to avoid tab bar

  // Subscribe to global search query changes
  useFocusEffect(
    useCallback(() => {
      const unsubscribe = subscribeToSearchQuery((query) => {
        setSearchQuery(query);
      });
      
      // Set initial query
      setSearchQuery(globalSearchQuery);
      
      return unsubscribe;
    }, [])
  );

  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() === '') {
        setSearchResults([]);
        return;
      }
      
      try {
        const results = await searchNotesAndTodos(searchQuery);
        // Sort results by createdAt in descending order
        results.sort((a, b) => b.createdAt - a.createdAt);
        setSearchResults(results);

        // Add to recent items if not already present (and it's a new search)
        const isNewSearch = !recentItems.some(item => item.name === searchQuery);
        if (searchQuery && isNewSearch) {
          setRecentItems(prev => [{ 
            id: searchQuery, 
            name: searchQuery, 
            description: 'in Private', 
            type: 'note' as 'note' | 'todo', // Explicitly cast type
            createdAt: Date.now() 
          }, ...prev].slice(0, 5)); // Keep last 5
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      }
    };

    const handler = setTimeout(() => {
      performSearch();
    }, 300);

    return () => clearTimeout(handler);
  }, [searchQuery, recentItems]);

  const getIcon = (type: 'note' | 'todo') => {
    switch (type) {
      case 'note':
        return <FileText color="#9ca3af" size={20} />;
      case 'todo':
        return <List color="#9ca3af" size={20} />;
      default:
        return <Clock color="#9ca3af" size={20} />;
    }
  };

  const groupResultsByTime = (results: SearchResult[]) => {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000; // Fixed syntax error
    const oneWeek = 7 * oneDay;
    const oneMonth = 30 * oneDay;

    const grouped: { [key: string]: SearchResult[] } = {
      'Today': [],
      'This week': [],
      'This month': [],
      'Older': [],
    };

    results.forEach(item => {
      const age = now - item.createdAt;
      if (age < oneDay) {
        grouped['Today'].push(item);
      } else if (age < oneWeek) {
        grouped['This week'].push(item);
      } else if (age < oneMonth) {
        grouped['This month'].push(item);
      } else {
        grouped['Older'].push(item);
      }
    });

    // Filter out empty groups and return in specific order
    const orderedGroups: { title: string; items: SearchResult[] }[] = [];
    if (grouped['Today'].length > 0) orderedGroups.push({ title: 'Today', items: grouped['Today'] });
    if (grouped['This week'].length > 0) orderedGroups.push({ title: 'This week', items: grouped['This week'] });
    if (grouped['This month'].length > 0) orderedGroups.push({ title: 'This month', items: grouped['This month'] });
    if (grouped['Older'].length > 0) orderedGroups.push({ title: 'Older', items: grouped['Older'] });

    return orderedGroups;
  };

  const groupedDisplayItems = searchQuery.trim() === '' 
    ? groupResultsByTime(recentItems) 
    : groupResultsByTime(searchResults);

  return (
    <ThemedView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ScrollView 
        contentContainerStyle={[
          styles.scrollViewContent,
          { paddingBottom: bottomPaddingForTabBar }
        ]}
        showsVerticalScrollIndicator={false}
      >
        {groupedDisplayItems.length === 0 && searchQuery.trim() !== '' ? (
          <View style={styles.noResultsContainer}>
            <ThemedText style={styles.noResultsText}>
              {`No results found for "${searchQuery}"`}
            </ThemedText>
          </View>
        ) : groupedDisplayItems.length === 0 && searchQuery.trim() === '' ? (
          <View style={styles.noResultsContainer}>
            <ThemedText style={styles.noResultsText}>
              Start typing to search your notes and todos.
            </ThemedText>
          </View>
        ) : (
          <>
            {groupedDisplayItems.map((group) => {
              if (group.items.length === 0) return null;
              return (
                <View key={group.title} style={styles.section}>
                  <ThemedText style={styles.sectionHeader}>{group.title}</ThemedText>
                  {group.items.map((item) => (
                    <TouchableOpacity key={item.id} style={styles.itemContainer}>
                      <View style={styles.itemIcon}>{getIcon(item.type)}</View>
                      <View style={styles.itemContent}>
                        <ThemedText style={styles.itemTitle} numberOfLines={1}>
                          {item.name}
                        </ThemedText>
                        {item.description ? (
                          <ThemedText style={styles.itemSubtitle} numberOfLines={2}>
                            {item.description}
                          </ThemedText>
                        ) : null}
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              );
            })}
          </>
        )}
      </ScrollView>
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingTop: StatusBar.currentHeight || 0,
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e5e7eb',
    marginBottom: 16,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: '#262626', // Darker background for items
    borderRadius: 8,
    marginBottom: 8,
  },
  itemIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  itemContent: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#f9fafb',
    marginBottom: 4,
  },
  itemSubtitle: {
    fontSize: 14,
    color: '#9ca3af',
    lineHeight: 20,
  },
  noResultsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  noResultsText: {
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
  },
});

export default SearchScreen;
