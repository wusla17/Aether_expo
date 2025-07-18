import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Text, useTheme } from 'react-native-paper';
import { getNoteById, updateNoteLastAccessed, Note } from '@/utils/database';

import { moveToTrash } from '@/utils/database';

export default function NoteView() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const theme = useTheme();
  const router = useRouter();

  useEffect(() => {
    if (typeof id === 'string') {
      getNoteById(id).then(note => {
        setNote(note ?? null);
        if (note) {
          updateNoteLastAccessed(note.id); // Update last accessed time
        }
      });
    }
  }, [id]);

  const handleDelete = () => {
    if (note) {
      moveToTrash(note.id, 'note');
      router.back();
    }
  };

  if (!note) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={note.title} />
        <Appbar.Action icon="delete" onPress={handleDelete} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Card>
          <Card.Content>
            <Text>{note.content}</Text>
          </Card.Content>
        </Card>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingText: {
    padding: 16,
  },
  scrollContent: {
    padding: 16,
  },
});
