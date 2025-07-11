import { useRouter } from 'expo-router';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Card, Text, useTheme, Appbar, List } from 'react-native-paper';

const HomeScreen = () => {
  const theme = useTheme();
  const router = useRouter();

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Appbar.Header>
        <Appbar.Content title="WUSLA" />
      </Appbar.Header>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <List.Section title="Jump back in">
          <Card style={styles.card} onPress={() => router.push('/search')}>
            <Card.Title title="New Blog Post Series" />
          </Card>
        </List.Section>

        <List.Section title="Private">
          <List.Item
            title="Private"
            left={() => <List.Icon icon="lock" />}
            right={() => <List.Icon icon="plus" />}
            onPress={() => router.push('/note/new')}
          />
          <Text style={styles.placeholderText}>No pages inside</Text>
        </List.Section>

        <List.Section title="Teamspaces">
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
  scrollViewContent: {
    paddingHorizontal: 16,
    paddingBottom: 40,
  },
  card: {
    marginBottom: 8,
  },
  placeholderText: {
    marginLeft: 64,
    opacity: 0.6,
  },
});

export default HomeScreen;