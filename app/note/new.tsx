import { saveNote } from '@/utils/database';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { SafeAreaView, StatusBar, TextInput, View } from 'react-native';
import { useTheme } from 'react-native-paper';

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
      saveNote({ id: noteId, title, content, createdAt: Date.now() });
    }
  }, [title, content, noteId]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <StatusBar barStyle={theme.dark ? "light-content" : "dark-content"} backgroundColor={theme.colors.background} />
      
      <View style={{ flex: 1, paddingHorizontal: 16, paddingTop: 8 }}>
        <View style={{ marginBottom: 16, backgroundColor: theme.colors.surface, padding: 16, borderRadius: 8, elevation: 2, shadowColor: theme.colors.shadow, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 2 }}>
          <TextInput
            placeholder="New page"
            value={title}
            onChangeText={setTitle}
            style={{
              fontSize: 28,
              fontWeight: '300',
              letterSpacing: 0.2,
              color: theme.colors.onSurface,
              padding: 10,
            }}
            placeholderTextColor={theme.colors.onSurfaceDisabled}
          />
        </View>
        
        {/* Content Input */}
        <TextInput
          placeholder="Tap here to continue..."
          value={content}
          onChangeText={setContent}
          style={{
            fontSize: 16,
            fontWeight: '400',
            lineHeight: 24,
            color: theme.colors.onSurface,
            flex: 1,
            textAlignVertical: 'top',
          }}
          placeholderTextColor={theme.colors.onSurfaceVariant}
          multiline
        />
      </View>
    </SafeAreaView>
  );
}
