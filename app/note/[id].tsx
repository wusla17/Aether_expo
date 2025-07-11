import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Appbar, Card, Text, useTheme } from 'react-native-paper';
import { getNoteById, Note } from '@/utils/database';

export default function NoteView() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);
  const theme = useTheme();

  useEffect(() => {
    if (typeof id === 'string') {
      getNoteById(id).then(note => setNote(note ?? null));
    }
  }, [id]);

  if (!note) return <Text style={styles.loadingText}>Loading...</Text>;

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title={note.title} />
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
