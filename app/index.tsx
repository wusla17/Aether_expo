import { getNotes, Note } from '@/utils/database';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import { Appbar, Card, FAB, useTheme } from 'react-native-paper';

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();
  const theme = useTheme();

  useFocusEffect(
    useCallback(() => {
      const loadNotes = async () => {
        const data = await getNotes();
        if (data) setNotes(data);
      };
      loadNotes();
    }, [])
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="Notes" />
      </Appbar.Header>
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Card style={styles.card} onPress={() => router.push(`/note/${item.id}`)}>
            <Card.Title title={item.title} />
          </Card>
        )}
        contentContainerStyle={styles.listContent}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => router.push('/note/new')}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContent: {
    padding: 16,
  },
  card: {
    marginBottom: 16,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
  },
});