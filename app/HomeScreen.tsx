import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Image } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Good morning, John</Text>
        <TouchableOpacity>
          <MaterialCommunityIcons name="dots-horizontal" size={24} color="#AAAAAA" />
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchBar}>
        <MaterialCommunityIcons name="magnify" size={20} color="#AAAAAA" />
        <Text style={styles.searchText}>Search</Text>
        <MaterialCommunityIcons name="lightning-bolt" size={20} color="#AAAAAA" />
        <MaterialCommunityIcons name="menu" size={20} color="#AAAAAA" />
      </View>

      {/* Jump back in */}
      <Text style={styles.sectionTitle}>Jump back in</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.jumpBackInScroll}>
        <View style={styles.jumpBackInCard}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.jumpBackInImage} />
          <Text style={styles.jumpBackInText}>Untitled</Text>
          <Text style={styles.jumpBackInSubText}>No pages inside</Text>
        </View>
        <View style={styles.jumpBackInCard}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.jumpBackInImage} />
          <Text style={styles.jumpBackInText}>Untitled</Text>
          <Text style={styles.jumpBackInSubText}>No pages inside</Text>
        </View>
        <View style={styles.jumpBackInCard}>
          <Image source={{ uri: 'https://via.placeholder.com/100' }} style={styles.jumpBackInImage} />
          <Text style={styles.jumpBackInText}>Untitled</Text>
          <Text style={styles.jumpBackInSubText}>No pages inside</Text>
        </View>
      </ScrollView>

      {/* Main List */}
      <ScrollView style={styles.mainListScroll}>
        {/* Untitled */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="file-document-outline" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <View style={styles.listItemTextContainer}>
            <Text style={styles.listItemText}>Untitled</Text>
            <Text style={styles.listItemSubText}>No pages inside</Text>
          </View>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>

        {/* Meal Planner */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="chevron-down" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="food-fork-drink" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Meal Planner</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>
        {/* Meal Planner Sub-items */}
        <View style={styles.subListItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="file-document-outline" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Weekly Plan</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>
        <View style={styles.subListItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="file-document-outline" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Meals</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>
        <View style={styles.subListItem}>
          <MaterialCommunityIcons name="circle-small" size={20} color="#AAAAAA" />
          <Text style={[styles.listItemText, styles.bulletItemText]}>Gallery</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>

        {/* Weekly To-do List */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="format-list-bulleted" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Weekly To-do List</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>

        {/* Personal Website */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="account" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Personal Website</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>

        {/* Monthly Budget */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="chart-line" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Monthly Budget</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>

        {/* Journal */}
        <View style={styles.listItem}>
          <MaterialCommunityIcons name="chevron-right" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="arrow-right-thick" size={20} color="#AAAAAA" style={styles.listItemIcon} />
          <Text style={styles.listItemText}>Journal</Text>
          <MaterialCommunityIcons name="dots-horizontal" size={20} color="#AAAAAA" />
          <MaterialCommunityIcons name="plus" size={20} color="#AAAAAA" style={styles.listItemPlusIcon} />
        </View>
      </ScrollView>

      {/* Bottom FAB */}
      <View style={styles.fabContainer}>
        <MaterialCommunityIcons name="alpha-z-box-outline" size={24} color="#FFFFFF" />
        <Text style={styles.fabText}>Ask, chat, find with AI...</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    marginTop: 40, // Adjust for status bar
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 10,
    marginBottom: 20,
  },
  searchText: {
    flex: 1,
    color: '#AAAAAA',
    marginLeft: 10,
  },
  sectionTitle: {
    color: '#AAAAAA',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  jumpBackInScroll: {
    marginBottom: 20,
  },
  jumpBackInCard: {
    backgroundColor: '#333333',
    borderRadius: 10,
    padding: 10,
    marginRight: 10,
    width: 150,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  jumpBackInImage: {
    width: 80,
    height: 80,
    marginBottom: 5,
  },
  jumpBackInText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: 'bold',
  },
  jumpBackInSubText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  mainListScroll: {
    flex: 1,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  listItemIcon: {
    marginRight: 10,
    marginLeft: 5,
  },
  listItemTextContainer: {
    flex: 1,
  },
  listItemText: {
    color: '#FFFFFF',
    fontSize: 16,
    flex: 1,
  },
  listItemSubText: {
    color: '#AAAAAA',
    fontSize: 12,
  },
  listItemPlusIcon: {
    marginLeft: 10,
  },
  subListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingLeft: 30, // Indentation for sub-items
  },
  bulletItemText: {
    marginLeft: 5,
  },
  fabContainer: {
    flexDirection: 'row',
    backgroundColor: '#333333',
    borderRadius: 30,
    paddingVertical: 12,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    bottom: 30,
    left: 16,
    right: 16,
  },
  fabText: {
    color: '#FFFFFF',
    marginLeft: 10,
    fontSize: 16,
  },
});

export default HomeScreen;
