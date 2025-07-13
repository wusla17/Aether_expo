import { BlurView } from 'expo-blur';
import { Href, usePathname, useRouter } from 'expo-router';
import { Home, Inbox, Pen, Search } from 'lucide-react-native';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const TABS: { icon: JSX.Element; route: Href }[] = [
  { icon: <Home size={22} color="white" />, route: '/(tabs)' },
  { icon: <Search size={22} color="white" />, route: '/(tabs)/search' },
  { icon: <Pen size={22} color="white" />, route: '/note/new' },
  { icon: <Inbox size={22} color="white" />, route: '/(tabs)/todo' },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={30} tint="dark" style={styles.tabBar}>
        {TABS.map((tab, index) => {
          const isActive = pathname === tab.route;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => router.replace(tab.route)}
              activeOpacity={0.9}
              style={styles.tabButton}>
              <View style={[styles.iconWrapper, isActive && styles.activeIconWrapper]}>
                {tab.icon}
              </View>
            </TouchableOpacity>
          );
        })}
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    zIndex: 100,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width - 40,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    overflow: 'hidden',
    padding: 10,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
  },
  iconWrapper: {
    padding: 10,
    borderRadius: 25,
  },
  activeIconWrapper: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 25,
    backdropFilter: 'blur(10px)',
  },
});
