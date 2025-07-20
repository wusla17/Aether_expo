import { MaterialCommunityIcons } from '@expo/vector-icons'; // Keep this one import
import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Data for Help & Support Screen ---
interface HelpSupportItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

interface HelpSupportSection {
  id: string;
  items: HelpSupportItem[];
}

const helpSupportSections: HelpSupportSection[] = [
  {
    id: 'section1',
    items: [
      { id: '1', title: 'Help centre', icon: 'book-open-variant' },
      { id: '2', title: 'Tweet @NotionHQ', icon: 'pound' },
      { id: '3', title: 'Send us a message', icon: 'message-text-outline' },
      { id: '4', title: 'Status', icon: 'clipboard-list-outline' },
    ],
  },
  {
    id: 'section2',
    items: [
      { id: '5', title: "What's new?", icon: 'star-shooting-outline' },
      { id: '6', title: 'Join us', icon: 'briefcase-outline' },
    ],
  },
  {
    id: 'section3',
    items: [
      { id: '7', title: 'Terms & privacy', icon: 'file-document-outline' },
    ],
  },
];

const HelpSupportScreen = () => {
  const insets = useSafeAreaInsets();

  const handleCardPress = (item: HelpSupportItem) => {
    // Simplified action: just log the tapped item, as navigation routes are not defined
    console.log('Tapped on: ' + item.title);
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Custom header */}
      <View style={styles.customHeader}>
        {/*
          Removed the back button as it's not visible in the provided screenshot
          and to make the header cleaner for this specific design replication.
          If you need a back button, you can uncomment this block.
        */}
        {/* <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <MaterialCommunityIcons name="chevron-left" size={30} color="#FFFFFF" />
        </TouchableOpacity> */}
        <Text style={styles.customHeaderTitle}>Help and support</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollViewContent}>
        {helpSupportSections.map((section) => ( // Removed sectionIndex
          <View key={section.id} style={styles.sectionContainer}>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={item.id}
                style={[
                  styles.listItem,
                  // Apply top border radius to the first item in the section
                  itemIndex === 0 && styles.firstItemInGroup,
                  // Apply bottom border radius to the last item in the section
                  itemIndex === section.items.length - 1 && styles.lastItemInGroup,
                  // Add a separator line between items within the same section, but not after the last one
                  itemIndex < section.items.length - 1 && styles.itemSeparator,
                ]}
                onPress={() => handleCardPress(item)}
              >
                <View style={styles.listItemContent}>
                  <MaterialCommunityIcons
                    name={item.icon}
                    size={22} // Adjusted icon size to match the screenshot
                    color="#D3D3D3" // Lighter grey color for icons
                    style={styles.listItemIcon}
                  />
                  <Text style={styles.listItemText}>{item.title}</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={22} // Adjusted arrow size
                    color="#888888" // Grey color for the arrow
                    style={styles.listItemArrow}
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background for the screen
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center', // Center the title
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 0, // Removed header bottom border as per screenshot
    backgroundColor: '#000000', // Ensure header background is also black
  },
  customHeaderTitle: {
    fontSize: 18, // Slightly smaller font size for header
    fontWeight: '600', // A bit bolder than before
    color: '#FFFFFF',
    // Removed marginLeft as title is centered
  },
  scrollViewContent: {
    paddingHorizontal: 16, // Add horizontal padding for the groups
    paddingTop: 20, // Padding from the header
    paddingBottom: 30,
  },
  sectionContainer: {
    backgroundColor: '#1C1C1C', // Dark grey background for each group
    borderRadius: 12, // Rounded corners for the entire group
    overflow: 'hidden', // Ensures inner items respect border radius
    marginBottom: 16, // Space between groups
  },
  listItem: {
    backgroundColor: '#1C1C1C', // Same as section container background
    paddingHorizontal: 16,
    paddingVertical: 14, // Adjusted vertical padding
  },
  firstItemInGroup: {
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
  },
  lastItemInGroup: {
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  itemSeparator: {
    borderBottomWidth: StyleSheet.hairlineWidth, // Thin separator line
    borderBottomColor: '#2A2A2A', // Slightly lighter grey for separator
  },
  listItemContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemIcon: {
    marginRight: 14, // Adjusted spacing
  },
  listItemText: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 15, // Slightly smaller font size
    fontWeight: '400', // Normal weight
  },
  listItemArrow: {
    marginLeft: 10, // Add some left margin to the arrow for spacing
  },
});

export default HelpSupportScreen;
