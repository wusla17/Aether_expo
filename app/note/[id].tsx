import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { getNoteById, Note } from '@/utils/database';

export default function NoteView() {
  const { id } = useLocalSearchParams();
  const [note, setNote] = useState<Note | null>(null);

  useEffect(() => {
    if (typeof id === 'string') {
      getNoteById(id).then(note => setNote(note ?? null));
    }
  }, [id]);

  if (!note) return <Text className="text-white p-4">Loading...</Text>;

  return (
    <ScrollView className="flex-1 bg-black p-4">
      <Text className="text-white text-2xl font-bold mb-2">{note.title}</Text>
      <Text className="text-white text-base whitespace-pre-wrap">{note.content}</Text>
    </ScrollView>
  );
}