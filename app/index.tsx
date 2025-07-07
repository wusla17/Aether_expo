// app/index.tsx
import { getNotes, Note } from '@/utils/database';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import { FlatList, Text, TouchableOpacity, View } from 'react-native'; // ✅ Use react-native's Text
import { FAB } from 'react-native-paper'; // ✅ Keep using FAB from paper if you like

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const router = useRouter();

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
    <View className="flex-1 bg-black"> {/* Optional background if you're using dark mode */}
      <FlatList
        data={notes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            onPress={() => router.push(`/note/${item.id}`)}
            className="border-b border-gray-700 px-4 py-3"
          >
            <Text className="text-white text-xl font-semibold">
              {item.title}
            </Text>
          </TouchableOpacity>
        )}
      />

      <FAB
        icon="plus"
        style={{
          position: 'absolute',
          right: 16,
          bottom: 16,
        }}
        onPress={() => router.push('/note/new')}
      />
    </View>
  );
}
