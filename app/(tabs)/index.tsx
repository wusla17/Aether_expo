import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// --- Data ---
interface JumpBackInItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
}

const jumpBackInData: JumpBackInItem[] = [
  { id: '1', title: 'Untitled', icon: 'file-document-outline' },
  { id: '2', title: 'Meal Planner', icon: 'silverware-fork-knife' },
  { id: '3', title: 'Weekly To-do List', icon: 'format-list-bulleted' },
];

interface PrivateListItem {
  id: string;
  title: string;
  icon: React.ComponentProps<typeof MaterialCommunityIcons>['name'];
  children?: PrivateListItem[];
  level?: number;
}

const privateListData: PrivateListItem[] = [
  {
    id: '1',
    title: 'Welcome to Notion!',
    icon: 'hand-wave',
    children: [{ id: '1-1', title: 'Untitled', icon: 'file-document-outline' }],
  },
  {
    id: '2',
    title: 'Meal Planner',
    icon: 'silverware-fork-knife',
    children: [
      { id: '2-1', title: 'Weekly Plan', icon: 'file-document-outline' },
      {
        id: '2-2',
        title: 'Meals',
        icon: 'file-document-outline',
        children: [{ id: '2-2-1', title: 'Gallery', icon: 'image-multiple' }],
      },
    ],
  },
  { id: '3', title: 'Weekly To-do List', icon: 'format-list-bulleted' },
  { id: '4', title: 'Personal Website', icon: 'account' },
  { id: '5', title: 'Monthly Budget', icon: 'currency-usd' },
  { id: '6', title: 'Journal', icon: 'pencil' },
];

// --- Components ---

const Header = ({ onMorePress }: { onMorePress: () => void }) => (
  <View style={styles.headerContainer}>
    <View style={styles.headerLeft}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>M</Text>
      </View>
      <Text style={styles.headerTitle}>Mohammed Arsh&#39;s Notion</Text>
      <MaterialCommunityIcons name="chevron-down" size={20} color="#AAAAAA" />
    </View>
    <TouchableOpacity onPress={onMorePress}>
      <MaterialCommunityIcons name="dots-horizontal" size={24} color="#AAAAAA" />
    </TouchableOpacity>
  </View>
);

const JumpBackIn = () => (
  <View style={styles.jumpBackContainer}>
    <Text style={styles.jumpBackTitle}>Jump back in</Text>
    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
      {jumpBackInData.map(item => (
        <TouchableOpacity key={item.id} style={styles.jumpBackCard}>
          <MaterialCommunityIcons
            name={item.icon}
            size={24}
            color="#AAAAAA"
            style={{ marginBottom: 8 }}
          />
          <Text style={styles.jumpBackCardTitle}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const PrivateListItemComponent: React.FC<{
  item: PrivateListItem;
  onToggle: (id: string) => void;
  expandedItems: string[];
}> = ({ item, onToggle, expandedItems }) => {
  const isExpanded = expandedItems.includes(item.id);
  const hasChildren = item.children && item.children.length > 0;

  return (
    <View>
      <View style={styles.privateListItem}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', flex: 1 }}
          onPress={() => onToggle(item.id)}
        >
          <MaterialCommunityIcons
            name={isExpanded ? 'chevron-down' : 'chevron-right'}
            size={24}
            color="#AAAAAA"
          />
          <MaterialCommunityIcons
            name={item.icon}
            size={20}
            color="#AAAAAA"
            style={{ marginHorizontal: 8 }}
          />
          <Text style={styles.privateListTitle}>{item.title}</Text>
        </TouchableOpacity>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity>
            <MaterialCommunityIcons name="dots-horizontal" size={24} color="#AAAAAA" />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginLeft: 16 }}>
            <MaterialCommunityIcons name="plus" size={24} color="#AAAAAA" />
          </TouchableOpacity>
        </View>
      </View>
      {isExpanded && hasChildren && (
        <View style={{ marginLeft: 20 }}>
          {item.children?.map(child => (
            <PrivateListItemComponent
              key={child.id}
              item={child}
              onToggle={onToggle}
              expandedItems={expandedItems}
            />
          ))}
        </View>
      )}
    </View>
  );
};


export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [expandedItems, setExpandedItems] = useState<string[]>(['1', '2']);
  const [isMenuVisible, setIsMenuVisible] = useState(false);
  const [isModalRendered, setIsModalRendered] = useState(false);
  const menuAnimation = useRef(new Animated.Value(0)).current;
  const router = useRouter();

  useEffect(() => {
    if (isMenuVisible) {
      setIsModalRendered(true);
      Animated.spring(menuAnimation, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.spring(menuAnimation, {
        toValue: 0,
        useNativeDriver: true,
      }).start(() => {
        setIsModalRendered(false);
      });
    }
  }, [isMenuVisible]);

  const toggleItem = (id: string) => {
    setExpandedItems(current =>
      current.includes(id) ? current.filter(itemId => itemId !== id) : [...current, id]
    );
  };

  const renderPrivateListItem = ({ item }: { item: PrivateListItem }) => (
    <PrivateListItemComponent
      item={item}
      onToggle={toggleItem}
      expandedItems={expandedItems}
    />
  );

  const menuItems = [
    { id: '1', title: 'Settings', icon: 'cog-outline' },
    { id: '2', title: 'Trash', icon: 'trash-can-outline' },
    { id: '3', title: 'Help & support', icon: 'help-circle-outline' },
    { id: '4', title: 'Log out', icon: 'logout' },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <Header onMorePress={() => setIsMenuVisible(true)} />
      <ScrollView showsVerticalScrollIndicator={false}>
        <JumpBackIn />
        <View style={styles.privateSection}>
          <Text style={styles.privateSectionTitle}>Private</Text>
          <FlatList
            data={privateListData}
            renderItem={renderPrivateListItem}
            keyExtractor={item => item.id}
            scrollEnabled={false}
          />
        </View>
      </ScrollView>
      {isModalRendered && (
        <Modal
          transparent
          visible={isMenuVisible}
          onRequestClose={() => setIsMenuVisible(false)}
        >
          <TouchableOpacity
            style={styles.modalOverlay}
            onPress={() => setIsMenuVisible(false)}
          >
            <Animated.View
              style={[
                styles.menuContainer,
                {
                  top: insets.top + 4,
                  transform: [
                    {
                      translateY: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [-20, 0],
                      }),
                    },
                    {
                      scale: menuAnimation.interpolate({
                        inputRange: [0, 1],
                        outputRange: [0.95, 1],
                      }),
                    },
                  ],
                  opacity: menuAnimation,
                },
              ]}
            >
              {menuItems.map(item => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.menuItem}
                  disabled={item.title === 'Log out'}
                  onPress={() => {
                    if (item.title === 'Settings') {
                      router.push('/settings');
                    } else if (item.title === 'Trash') {
                      router.push('/trash');
                    } else if (item.title === 'Help & support') {
                      router.push('/HelpSupportScreen');
                    }
                    setIsMenuVisible(false); // Close the modal after navigating
                  }}
                >
                  <MaterialCommunityIcons
                    name={item.icon as React.ComponentProps<typeof MaterialCommunityIcons>['name']}
                    size={20}
                    color={item.title === 'Log out' ? '#E57373' : '#AAAAAA'}
                    style={{ marginRight: 16 }}
                  />
                  <Text
                    style={[
                      styles.menuItemText,
                      { color: item.title === 'Log out' ? '#E57373' : '#FFFFFF' },
                    ]}
                  >
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </Animated.View>
          </TouchableOpacity>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1C1C1C',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  menuContainer: {
    position: 'absolute',
    right: 16,
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 8,
    width: 250,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuItemText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  // Header
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 28,
    height: 28,
    borderRadius: 4,
    backgroundColor: '#5A5A5A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  headerTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    marginRight: 4,
  },
  // Jump Back In
  jumpBackContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
  },
  jumpBackTitle: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 12,
  },
  jumpBackCard: {
    backgroundColor: '#2A2A2A',
    borderRadius: 8,
    padding: 16,
    marginRight: 12,
    width: 150,
    height: 120,
    justifyContent: 'flex-end',
  },
  jumpBackCardTitle: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  // Private Section
  privateSection: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  privateSectionTitle: {
    color: '#AAAAAA',
    fontSize: 14,
    marginBottom: 8,
  },
  privateListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'space-between',
  },
  privateListTitle: {
    color: '#FFFFFF',
    fontSize: 16,
  },
});
