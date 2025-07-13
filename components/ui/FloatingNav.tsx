
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useRouter } from 'expo-router';
import { Calendar, CheckSquare, Home, Search } from 'lucide-react-native';
import { Dimensions, StyleSheet, TouchableOpacity, useColorScheme, View } from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';
import { Canvas, Path, Skia, Blur, LinearGradient, vec } from '@shopify/react-native-skia';
import { useEffect } from 'react';

const tabs = [
  { name: 'index', title: 'Home', icon: Home },
  { name: 'calendar', title: 'Calendar', icon: Calendar },
  { name: 'todo', title: 'Todo', icon: CheckSquare },
];

const { width: screenWidth } = Dimensions.get('window');
const fabSize = 64;
const navWidth = screenWidth * 0.9;
const navHeight = 70;
const fabInitialY = -30;

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
  }, []);

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
            <Search size={32} color={isDark ? '#fff' : '#000'} />
          </View>
        </TouchableOpacity>
      </Animated.View>
      <Canvas style={{ width: navWidth, height: navHeight }}>
        <Path path={path} >
            <LinearGradient
                start={vec(0, 0)}
                end={vec(navWidth, navHeight)}
                colors={isDark ? ['rgba(40, 40, 40, 0.7)', 'rgba(20, 20, 20, 0.7)'] : ['rgba(255, 255, 255, 0.7)', 'rgba(230, 230, 230, 0.7)']}
            />
            <Blur blur={15} />
        </Path>
      </Canvas>
        <View style={styles.tabsContainer}>
          {filteredRoutes.map((route, index) => {
            const isFocused = state.index === index;
            const tabAnimation = useSharedValue(0);

            useEffect(() => {
                tabAnimation.value = withSpring(isFocused ? 1 : 0, { damping: 10, stiffness: 100 });
            }, [isFocused]);

            const animatedTabStyle = useAnimatedStyle(() => {
                const translateY = interpolate(tabAnimation.value, [0, 1], [0, -10], Extrapolate.CLAMP);
                return {
                    transform: [{ translateY }]
                }
            });

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
              <TouchableOpacity
                key={route.key}
                onPress={onPress}
                style={styles.tabItem}
              >
                <Animated.View style={animatedTabStyle}>
                    <TabIcon
                    size={24}
                    color={isFocused ? (isDark ? '#fff' : '#000') : '#888'}
                    />
                </Animated.View>
              </TouchableOpacity>
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
  },
  fab: {
    width: fabSize,
    height: fabSize,
    borderRadius: fabSize / 2,
    backgroundColor: 'rgba(128, 128, 128, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 8,
  },
  tabsContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
    width: '100%',
    height: '100%',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
