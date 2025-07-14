import { getAllNotes, Note, updateNoteLastAccessed } from '@/utils/database';
import { useFocusEffect, useRouter } from 'expo-router';
import { ChevronDown, FileText, Hand, MoreHorizontal, Plus } from 'lucide-react-native';
import { useCallback, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native'; // Removed ImageBackground
import { Appbar, Card, List, Text, useTheme } from 'react-native-paper';

const HomeScreen = () => {
  const theme = useTheme();
  const router = useRouter();
  const [recentNotes, setRecentNotes] = useState<Note[]>([]);
  const [privateNotes, setPrivateNotes] = useState<Note[]>([]);

  const fetchHomeData = useCallback(async () => {
    try {
      const notes = await getAllNotes();
      // Sort notes by lastAccessedAt in descending order for recent notes
      const sortedNotes = notes.sort((a, b) => b.lastAccessedAt - a.lastAccessedAt);
      setRecentNotes(sortedNotes.slice(0, 3)); // Display top 3 recent notes

      // For "Private" section, assuming all notes are private for now
      setPrivateNotes(notes);
    } catch (error) {
      console.error("Failed to fetch home data:", error);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchHomeData();
    }, [fetchHomeData])
  );

  const handleNotePress = async (noteId: string) => {
    await updateNoteLastAccessed(noteId); // Update last accessed time
    router.push(`/note/${noteId}`);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header style={styles.appbarHeader}>
        <Appbar.Action icon="account-circle" size={36} color="#9ca3af" /> {/* Placeholder for user icon */}
        <Appbar.Content title="Mohammed Arsh's Notion" titleStyle={styles.appbarTitle} />
        <Appbar.Action icon="chevron-down" size={20} color="#9ca3af" /> {/* Dropdown icon */}
        <Appbar.Action icon="dots-horizontal" size={24} color="#9ca3af" /> {/* More options */}
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <List.Section title="Jump back in" titleStyle={styles.sectionTitle}>
          {recentNotes.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalCardsContainer}>
              {recentNotes.map((note) => (
                <Card key={note.id} style={styles.recentCard} onPress={() => handleNotePress(note.id)}>
                  <View style={styles.cardContent}>
                    <List.Icon icon={() => <FileText size={20} color="white" />} style={styles.cardIcon} />
                    <Text style={styles.cardTitle}>{note.title}</Text>
                    {note.content ? (
                      <Text style={styles.cardSubtitle} numberOfLines={2}>{note.content}</Text>
                    ) : null}
                  </View>
                </Card>
              ))}
            </ScrollView>
          ) : (
            <Text style={styles.placeholderText}>No recent notes. Create one to jump back in!</Text>
          )}
        </List.Section>

        <List.Section title="Private" titleStyle={styles.sectionTitle}>
          <View style={styles.privateHeader}>
            <Text style={styles.privateHeaderText}>Private</Text>
            <View style={styles.privateHeaderActions}>
              <TouchableOpacity style={styles.privateHeaderIcon}>
                <MoreHorizontal size={20} color="#9ca3af" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.privateHeaderIcon} onPress={() => router.push('/note/new')}>
                <Plus size={20} color="#9ca3af" />
              </TouchableOpacity>
            </View>
          </View>
          {privateNotes.length > 0 ? (
            privateNotes.map((note) => (
              <TouchableOpacity key={note.id} onPress={() => handleNotePress(note.id)} style={styles.privateItemContainer}>
                <View style={styles.privateItemLeft}>
                  <ChevronDown size={16} color="#9ca3af" style={styles.privateItemChevron} />
                  <List.Icon icon={() => {
                    // Example: Use Hand icon for "Welcome to Notion!" or FileText for others
                    if (note.title === 'Welcome to Notion!') {
                      return <Hand size={20} color="#9ca3af" />;
                    }
                    return <FileText size={20} color="#9ca3af" />;
                  }} style={styles.privateItemIcon} />
                  <Text style={styles.privateItemTitle}>{note.title}</Text>
                </View>
                <View style={styles.privateItemRight}>
                  <TouchableOpacity style={styles.privateItemAction}>
                    <MoreHorizontal size={20} color="#9ca3af" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.privateItemAction} onPress={() => router.push('/note/new')}>
                    <Plus size={20} color="#9ca3af" />
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>
            ))
          ) : (
            <Text style={styles.placeholderText}>No private notes. Create one!</Text>
          )}
        </List.Section>

        <List.Section title="Teamspaces" titleStyle={styles.sectionTitle}>
          <List.Item
            title="Teamspaces"
            left={() => <List.Icon icon="account-group" />}
            right={() => <List.Icon icon="plus" />}
          />
          <Card style={styles.card} onPress={() => router.push('/(tabs)/todo')}>
            <Card.Title title="WUSLA HQ" left={() => <List.Icon icon="home" color="#FF6F00" />} />
          </Card>
        </List.Section>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  appbarHeader: {
    backgroundColor: '#1a1a1a', // Match background
    elevation: 0, // Remove shadow
    shadowOpacity: 0, // Remove shadow for iOS
  },
  appbarTitle: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
    marginLeft: -10, // Adjust spacing
  },
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
    marginTop: 24,
    marginBottom: 16,
  },
  horizontalCardsContainer: {
    paddingVertical: 10,
  },
  recentCard: {
    width: 160,
    height: 160,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#262626', // Darker background for cards
  },
  cardContent: {
    flex: 1,
    padding: 8,
    justifyContent: 'flex-end',
  },
  cardIcon: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 4,
    padding: 2,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  cardSubtitle: { // New style for note content preview
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  card: { // General card style, used for Teamspaces
    marginBottom: 8,
    backgroundColor: '#262626',
  },
  placeholderText: {
    marginLeft: 16, // Adjusted for general placeholder
    opacity: 0.6,
    color: '#9ca3af',
  },
  privateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  privateHeaderText: {
    fontSize: 18,
    fontWeight: '600',
    color: 'white',
  },
  privateHeaderActions: {
    flexDirection: 'row',
  },
  privateHeaderIcon: {
    marginLeft: 16,
    padding: 4,
  },
  privateItemContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 0,
  },
  privateItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privateItemChevron: {
    marginRight: 8,
  },
  privateItemIcon: {
    marginRight: 8,
  },
  privateItemTitle: {
    fontSize: 16,
    color: 'white',
    flex: 1,
  },
  privateItemRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  privateItemAction: {
    marginLeft: 16,
    padding: 4,
  },
});

export default HomeScreen;
