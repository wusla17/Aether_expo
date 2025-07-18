import { ThemedView } from '@/components/ThemedView';
import { getTrashedItems, permanentlyDelete, restoreFromTrash } from '@/utils/database';
import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

interface TrashedItem {
  id: number; // Corrected type to number
  item_id: string | number;
  type: 'todo' | 'note';
  title: string;
}

interface TrashItemProps {
  item: TrashedItem;
  isDarkMode: boolean;
  onRestore: (id: number) => void; // Corrected type to number
  onDelete: (id: number) => void; // Corrected type to number
}

const TrashItem = ({ item, isDarkMode, onRestore, onDelete }: TrashItemProps) => (
  <View
    style={[
      styles.itemContainer,
      { backgroundColor: isDarkMode ? '#1C1C1E' : '#FFF' },
    ]}
  >
    <Feather
      name={item.type === 'note' ? 'file-text' : 'check-square'}
      size={22}
      color={isDarkMode ? '#A2A2A2' : '#888'}
      style={{ marginRight: 15 }}
    />
    <Text style={[styles.itemTitle, { color: isDarkMode ? '#EAEAEA' : '#333' }]}>
      {item.title}
    </Text>
    <View style={styles.actionsContainer}>
      <TouchableOpacity style={styles.actionButton} onPress={() => onRestore(item.id)}>
        <Feather name="rotate-ccw" size={20} color="#34C759" />
      </TouchableOpacity>
      <TouchableOpacity style={styles.actionButton} onPress={() => onDelete(item.id)}>
        <Feather name="trash-2" size={20} color="#FF453A" />
      </TouchableOpacity>
    </View>
  </View>
);

export default function TrashScreen() {
  const isDarkMode = true; // Assuming dark mode is the default
  const [trashedItems, setTrashedItems] = useState<TrashedItem[]>([]);

  useEffect(() => {
    const fetchTrashedItems = async () => {
      const items = await getTrashedItems();
      setTrashedItems(items);
    };

    fetchTrashedItems();
  }, []);

  const handleRestore = async (id: number) => {
    await restoreFromTrash(id);
    const items = await getTrashedItems();
    setTrashedItems(items);
  };

  const handleDelete = async (id: number) => {
    Alert.alert(
      'Permanently Delete',
      'Are you sure you want to permanently delete this item?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          onPress: async () => {
            await permanentlyDelete(id);
            const items = await getTrashedItems();
            setTrashedItems(items);
          },
          style: 'destructive',
        },
      ]
    );
  };

  return (
    <ThemedView
      style={[
        styles.container,
        { backgroundColor: isDarkMode ? '#000' : '#F2F2F7' },
      ]}
    >
      <Text style={[styles.title, { color: isDarkMode ? '#FFF' : '#000' }]}>
        Trash
      </Text>
      <FlatList
        data={trashedItems}
        renderItem={({ item }) => (
          <TrashItem
            item={item}
            isDarkMode={isDarkMode}
            onRestore={handleRestore}
            onDelete={handleDelete}
          />
        )}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <Feather name="trash" size={48} color={isDarkMode ? '#48484A' : '#C7C7CC'} />
            <Text style={[styles.emptyText, { color: isDarkMode ? '#8E8E93' : '#6D6D72' }]}>
              No items in trash
            </Text>
          </View>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 40 : 60,
    paddingHorizontal: 15,
  },
  title: {
    fontSize: 34,
    fontWeight: 'bold',
    marginBottom: 35,
    paddingHorizontal: 5,
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  itemTitle: {
    fontSize: 17,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
  },
  actionButton: {
    marginLeft: 15,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  emptyText: {
    marginTop: 20,
    fontSize: 17,
  },
});