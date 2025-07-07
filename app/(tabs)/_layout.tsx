/// <reference types="nativewind/types" />
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useTheme } from 'react-native-paper';
import Animated, {
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
} from 'react-native-reanimated';

export const ScrollContext = React.createContext({
  scrollOffset: { value: 0 },
});

export default function TabLayout() {
  const theme = useTheme();
  const scrollOffset = useSharedValue(0);
  const isTabBarHidden = useSharedValue(false);

  useAnimatedReaction(
    () => scrollOffset.value,
    (currentOffset, previousOffset) => {
      if (previousOffset !== null && currentOffset > previousOffset) {
        isTabBarHidden.value = true;
      } else {
        isTabBarHidden.value = false;
      }
    }
  );

  const tabBarAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withSpring(isTabBarHidden.value ? 100 : 0, {
            damping: 20,
            stiffness: 200,
          }),
        },
        {
          scale: withSpring(isTabBarHidden.value ? 0.9 : 1, {
            damping: 20,
            stiffness: 200,
          }),
        },
      ],
      opacity: withTiming(isTabBarHidden.value ? 0 : 1, {
        duration: 300,
      }),
    };
  });

  return (
    <ScrollContext.Provider value={{ scrollOffset }}>
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: '#FFFFFF',
          tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.6)',
          tabBarStyle: {
            position: 'absolute',
            backgroundColor: 'transparent',
            borderTopWidth: 0,
            elevation: 0,
            shadowOpacity: 0,
            height: 0, // Hide default tab bar
          },
        }}
        tabBar={(props) => (
          <Animated.View className="absolute bottom-5 left-5 right-5 h-20 overflow-hidden rounded-[40px] shadow-lg" style={[tabBarAnimatedStyle]}>
            <BlurView intensity={80} tint="systemUltraThinMaterialDark" className="flex-1 overflow-hidden rounded-[40px]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.1)' }}>
              <View className="absolute inset-0 rounded-[40px] border border-[rgba(255,255,255,0.2)]" style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)' }} />
              <View className="flex-1 flex-row items-center justify-around px-5 py-2.5">
                {props.state.routes.map((route, index) => {
                  const isFocused = props.state.index === index;

                  const onPress = () => {
                    const event = props.navigation.emit({
                      type: 'tabPress',
                      target: route.key,
                      canPreventDefault: true,
                    });

                    if (!isFocused && !event.defaultPrevented) {
                      props.navigation.navigate(route.name);
                    }
                  };

                  let iconName: any = 'home';
                  if (route.name === 'search') iconName = 'magnify';
                  if (route.name === 'todo') iconName = 'check-all';

                  let label = 'Home';
                  if (route.name === 'search') label = 'Search';
                  if (route.name === 'todo') label = 'To-Do';

                  return (
                    <Animated.View
                        key={route.key}
                        className={`flex-1 items-center justify-center ${isFocused ? 'scale-110' : ''}`}
                      >
                      <Animated.View
                          className={`items-center justify-center rounded-[25px] bg-transparent px-4 py-2 ${isFocused ? 'bg-white/25 border border-white/40 shadow-lg' : ''}`}
                        >
                        <MaterialCommunityIcons
                          name={iconName}
                          size={24}
                          color={isFocused ? '#FFFFFF' : 'rgba(255, 255, 255, 0.6)'}
                          onPress={onPress}
                        />
                        <Animated.Text
                          className={`mt-1 text-xs font-semibold ${isFocused ? 'text-white font-bold' : 'text-white/60'}`}
                          onPress={onPress}
                        >
                          {label}
                        </Animated.Text>
                      </Animated.View>
                    </Animated.View>
                  );
                })}
              </View>
            </BlurView>
          </Animated.View>
        )}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="home" color={color} size={26} />,
          }}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="magnify" color={color} size={26} />,
          }}
        />
        <Tabs.Screen
          name="todo"
          options={{
            title: 'To-Do',
            tabBarIcon: ({ color }) => <MaterialCommunityIcons name="check-all" color={color} size={26} />,
          }}
        />
      </Tabs>
    </ScrollContext.Provider>
  );
}

 
