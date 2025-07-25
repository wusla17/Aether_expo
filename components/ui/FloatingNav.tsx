import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Calendar, CheckSquare, Home, Search } from 'lucide-react-native';
import {
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';
import {
  Blur,
  Canvas,
  LinearGradient,
  Path,
  Skia,
  vec,
} from '@shopify/react-native-skia';
import { useEffect } from 'react';
import TabItem from './TabItem'; // Import the new TabItem component

const tabs = [
  { name: 'index', title: 'Home', icon: Home },
  { name: 'calendar', title: 'Calendar', icon: Calendar },
  { name: 'todo', title: 'Todo', icon: CheckSquare },
];

const { width: screenWidth } = Dimensions.get('window');
const fabSize = 48;
const navWidth = screenWidth * 0.9;
const navHeight = 60; // Adjusted height
const fabInitialY = -25; // Adjusted initial Y

export default function FloatingNav({ state, navigation }: BottomTabBarProps) {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const filteredRoutes = state.routes.filter((route) =>
    tabs.some((tab) => tab.name === route.name)
  );

  const fabX = useSharedValue(screenWidth / 2 - fabSize / 2);
  const fabY = useSharedValue(fabInitialY);
  const fabRotation = useSharedValue(0);

  const animatedFabStyle = useAnimatedStyle(() => {
    return {
      transform: [
        { translateX: fabX.value },
        { translateY: fabY.value },
        { rotate: `${fabRotation.value}deg` },
      ],
    };
  });

  const handleSearchPress = () => {
    fabRotation.value = withSpring(fabRotation.value + 360);
    router.push('/search');
  };

  useEffect(() => {
    fabY.value = withSpring(0, { damping: 15, stiffness: 100 });
  }, [fabY]); // Added fabY to dependency array

  const path = Skia.Path.Make();
  path.moveTo(0, navHeight);
  path.lineTo(navWidth, navHeight);
  path.lineTo(navWidth, 0);
  path.lineTo(0, 0);
  path.close();

  return (
    <View style={styles.container}>
      <Animated.View style={[styles.fabContainer, animatedFabStyle]}>
        <TouchableOpacity onPress={handleSearchPress}>
          <View style={styles.fab}>
            <Search size={24} color={isDark ? '#fff' : '#000'} />
          </View>
        </TouchableOpacity>
      </Animated.View>
      <Canvas style={{ width: navWidth, height: navHeight }}>
        <Path path={path}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(navWidth, navHeight)}
            colors={
              isDark
                ? ['rgba(40, 40, 40, 0.7)', 'rgba(20, 20, 20, 0.7)']
                : ['rgba(255, 255, 255, 0.7)', 'rgba(230, 230, 230, 0.7)']
            }
          />
          <Blur blur={15} />
        </Path>
      </Canvas>
      <View style={styles.tabsContainer}>
        {filteredRoutes.map((route, index) => {
          const isFocused = state.index === index;

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

          const tabInfo = tabs.find((tab) => tab.name === route.name);
          const TabIcon = tabInfo?.icon || Home;

          return (
            <TabItem
              key={route.key}
              isFocused={isFocused}
              onPress={onPress}
              icon={TabIcon}
              isDark={isDark}
            />
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    left: '5%',
    right: '5%',
    alignItems: 'center',
    width: navWidth,
    height: navHeight,
  },
  fabContainer: {
    position: 'absolute',
    alignSelf: 'center',
    zIndex: 1,
    top: -20, // Adjusted to move the FAB up
  },
  fab: {
    width: 100, // Adjusted width
    height: 40,
    borderRadius: 20,
    backgroundColor: 'transparent', // Made transparent
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 10, // Adjusted padding
    width: '100%',
    height: '100%',
  },
});