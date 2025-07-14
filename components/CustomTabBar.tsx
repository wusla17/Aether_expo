import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { Dispatch, SetStateAction } from 'react'; // Import Dispatch and SetStateAction
import { StyleSheet, Text, TouchableOpacity, View, useColorScheme } from 'react-native';
// BlurView import is intentionally removed for debugging, replaced with View

interface CustomTabBarProps extends BottomTabBarProps {
  searchQuery: string;
  setSearchQuery: Dispatch<SetStateAction<string>>;
}

const tabs = [
  { name: 'index', icon: 'home', label: 'Home' },
  { name: 'search', icon: 'magnify', label: 'Search', isPopup: true },
  { name: 'todo', icon: 'check-all', label: 'To-Do' },
];

export default function CustomTabBar({ state, descriptors, navigation, searchQuery, setSearchQuery }: CustomTabBarProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <View style={styles.wrapper}>
      <View
        style={[styles.tabBar, { backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)' }]} // Added background for visibility
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const isFocused = state.index === index;
          const tabData = tabs.find((t) => t.name === route.name);

          if (!tabData) return null;

          const iconName = tabData.icon;
          const label = tabData.label;
          const isPopup = tabData.isPopup;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TouchableOpacity
              key={route.key}
              onPress={onPress}
              style={[
                styles.tabItem,
                isPopup && styles.popupItem,
                isFocused && styles.focusedItem,
              ]}
            >
              <View
                style={[
                  styles.iconContainer,
                  isFocused && styles.selectedIcon,
                ]}
              >
                <MaterialCommunityIcons
                  name={iconName as any}
                  size={24}
                  color={isFocused ? (isDark ? '#fff' : '#000') : isDark ? '#aaa' : '#555'}
                />
              </View>
              {!isPopup && isFocused && (
                <Text style={[styles.label, { color: isDark ? '#fff' : '#000' }]}>{label}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    height: 70,
    borderRadius: 35,
    overflow: 'visible',
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    borderRadius: 35,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    gap: 2,
  },
  popupItem: {
    marginBottom: 24,
    zIndex: 10,
  },
  focusedItem: {},
  iconContainer: {
    padding: 8,
    borderRadius: 20,
  },
  selectedIcon: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
  },
  label: {
    fontSize: 12,
    marginTop: 2,
  },
});
