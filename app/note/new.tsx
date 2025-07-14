import { saveNote } from '@/utils/database';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StyleSheet, View } from 'react-native';
import { Appbar, TextInput, useTheme } from 'react-native-paper';

export default function NewNote() {
  const router = useRouter();
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [noteId, setNoteId] = useState<string>('');

  useEffect(() => {
    const id = `note-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
    setNoteId(id);
  }, []);

  useEffect(() => {
    if (noteId) {
      saveNote({ id: noteId, title, content, createdAt: Date.now(), lastAccessedAt: Date.now() });
    }
  }, [title, content, noteId]);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="New Note" />
      </Appbar.Header>
      <View style={styles.content}>
        <TextInput
          mode="outlined"
          label="Title"
          value={title}
          onChangeText={setTitle}
          style={styles.input}
        />
        <TextInput
          mode="outlined"
          label="Content"
          value={content}
          onChangeText={setContent}
          style={styles.input}
          multiline
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
});