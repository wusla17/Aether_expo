import { BlurView } from 'expo-blur';
import { Href, usePathname, useRouter } from 'expo-router';
import { Calendar, CheckCircle, Home, Search } from 'lucide-react-native';
import React from 'react';
import { Dimensions, StyleSheet, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const TAB_WIDTH = (width - 40) / 4;

const TABS: { icon: (props: { color: string, size: number, strokeWidth?: number }) => React.ReactNode; route: Href }[] = [
  { icon: (props) => <Home {...props} />, route: '/(tabs)' },
  { icon: (props) => <CheckCircle {...props} />, route: '/(tabs)/todo' },
  { icon: (props) => <Calendar {...props} />, route: '/(tabs)/calendar' },
  { icon: (props) => <Search {...props} />, route: '/(tabs)/search' },
];

export default function CustomTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const activeIndex = TABS.findIndex(tab => tab.route === pathname);
  const translateX = useSharedValue(activeIndex * TAB_WIDTH);

  const handlePress = (route: Href, index: number) => {
    router.replace(route);
    translateX.value = withSpring(index * TAB_WIDTH, {
      damping: 15,
      stiffness: 120,
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
    };
  });

  return (
    <View style={styles.wrapper}>
      <BlurView intensity={80} tint="dark" style={styles.tabBar}>
        <Animated.View style={[styles.activeIndicator, animatedStyle]} />
        {TABS.map((tab, index) => {
          const isActive = activeIndex === index;
          return (
            <TouchableOpacity
              key={index}
              onPress={() => handlePress(tab.route, index)}
              activeOpacity={0.8}
              style={styles.tabButton}>
              {tab.icon({
                color: 'white',
                size: 24,
                strokeWidth: isActive ? 2.5 : 2,
              })}
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
    bottom: 30,
    left: 20,
    right: 20,
    alignItems: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    height: 60,
    borderRadius: 30,
    paddingHorizontal: 10,
    overflow: 'hidden',
  },
  tabButton: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    zIndex: 1,
  },
  activeIndicator: {
    position: 'absolute',
    width: TAB_WIDTH - 10,
    height: '70%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    left: 5,
    top: '15%',
    zIndex: 0,
  },
});
