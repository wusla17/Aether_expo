import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  GestureResponderEvent,
  Keyboard,
  PanResponder,
  PanResponderGestureState,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions
} from 'react-native';

import AppDetailsSheet from './ui/AppDetailsSheet';

// Define a type for the icon names to ensure type safety
type IconName = React.ComponentProps<typeof MaterialCommunityIcons>['name'];

const tabs: { name: string; icon: IconName; label: string }[] = [
  { name: 'index', icon: 'home-variant', label: 'Home' },
  { name: 'todo', icon: 'format-list-checks', label: 'To-Do' },
  { name: 'calendar', icon: 'calendar-month', label: 'Calendar' },
  { name: 'search', icon: 'magnify', label: 'Search' },
];



export default function CustomTabBar({ state, navigation }: BottomTabBarProps) {
  const { width: screenWidth } = useWindowDimensions();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();

  const [isSearchBarVisible, setIsSearchBarVisible] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const lastTap = useRef(0);
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const tabBarBottomAnim = useRef(new Animated.Value(25)).current;
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  const bottomSheetPanResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gestureState) => {
        // Set responder only if the user is dragging vertically
        return Math.abs(gestureState.dy) > 5;
      },
      onPanResponderMove: (_, gestureState) => {
        // Move the bottom sheet with the gesture
        // We'll use a direct manipulation of the value for performance
        // This requires the animated value to be set up for it.
        // For now, we'll just log the movement.
        console.log('dy:', gestureState.dy);
      },
      onPanResponderRelease: (_, gestureState) => {
        // On release, decide whether to snap open or closed
        if (gestureState.dy > 50) {
          hideBottomSheet();
        } else {
          showBottomSheet();
        }
      },
    })
  ).current;

  const tabData = React.useMemo(() => tabs.map(t => ({
    ...t,
    isFocused: state.routes[state.index].name === t.name,
  })), [state.index, state.routes]);

  // Pan responder for swipe gestures
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        return Math.abs(gestureState.dy) > 10;
      },
      onPanResponderGrant: () => {
        // Gesture started
      },
      onPanResponderMove: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        // Handle move if needed
      },
      onPanResponderRelease: (evt: GestureResponderEvent, gestureState: PanResponderGestureState) => {
        const { dy, vy } = gestureState;
        
        if (dy < -50 && vy < -0.5) {
          // Swipe up - show bottom sheet
          showBottomSheet();
        } else if (dy > 50 && vy > 0.5) {
          // Swipe down - hide bottom sheet
          hideBottomSheet();
        }
      },
    })
  ).current;

  const showBottomSheet = React.useCallback(() => {
    if (isBottomSheetVisible) return;
    setIsBottomSheetVisible(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);

    Animated.parallel([
      Animated.spring(bottomSheetAnim, {
        toValue: 1,
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }),
    ]).start();
  }, [isBottomSheetVisible, bottomSheetAnim, overlayAnim]);

  const hideBottomSheet = React.useCallback(() => {
    if (!isBottomSheetVisible) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    Animated.parallel([
      Animated.spring(bottomSheetAnim, {
        toValue: 0,
        useNativeDriver: false,
        tension: 120,
        friction: 8,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: false,
      }),
    ]).start(() => {
      setIsBottomSheetVisible(false);
    });
  }, [isBottomSheetVisible, bottomSheetAnim, overlayAnim]);

  const handleTabPress = React.useCallback((name: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    
    if (name === 'search') {
      if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
        setIsSearchBarVisible(true);
      } else {
        lastTap.current = now;
        navigation.navigate(name);
      }
    } else {
      if (isSearchBarVisible) {
        setIsSearchBarVisible(false);
        setSearchText('');
      }
      navigation.navigate(name);
    }
  }, [isSearchBarVisible, lastTap, navigation]);

  const handleSearchSubmit = React.useCallback(() => {
    if (searchText.trim()) {
      router.setParams({ q: searchText.trim() });
    }
  }, [searchText, router]);

  // Animate search bar
  useEffect(() => {
    Animated.spring(searchBarAnim, {
      toValue: isSearchBarVisible ? 1 : 0,
      useNativeDriver: false,
      tension: 100,
      friction: 10,
    }).start(() => {
      if (isSearchBarVisible) {
        searchInputRef.current?.focus();
      }
    });
  }, [isSearchBarVisible, searchBarAnim]);

  // Updated sizes for larger tab bar
  const tabBarPadding = 6;
  const wrapperPadding = 50;
  const tabItemWidth = React.useMemo(() =>
    (screenWidth - wrapperPadding - tabBarPadding) / tabs.length,
    [screenWidth]
  );

  // Keyboard handling
  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        Animated.timing(tabBarBottomAnim, {
          toValue: e.endCoordinates.height + 30,
          duration: e.duration,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (e) => {
        Animated.timing(tabBarBottomAnim, {
          toValue: 15,
          duration: e.duration,
          useNativeDriver: false,
        }).start();
      }
    );

    return () => {
      keyboardDidHideListener.remove();
      keyboardDidShowListener.remove();
    };
  }, []);

  return (
    <>
      {/* Overlay for bottom sheet */}
      <Animated.View
        style={[
          styles.overlay,
          {
            opacity: overlayAnim,
            backgroundColor: isDark ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.3)',
          },
        ]}
        pointerEvents={isBottomSheetVisible ? 'auto' : 'none'}
      >
        <TouchableOpacity
          style={styles.overlayTouchable}
          onPress={hideBottomSheet}
          activeOpacity={1}
        />
      </Animated.View>

      <Animated.View
        style={[
          styles.wrapper,
          isSearchBarVisible && styles.wrapperNoShadow,
          {
            marginHorizontal: searchBarAnim.interpolate({
              inputRange: [0, 1],
              outputRange: ['6%', '10%'],
            }),
            bottom: tabBarBottomAnim,
          },
        ]}
        {...panResponder.panHandlers}
      >
        <BlurView
          intensity={25}
          tint={isDark ? 'dark' : 'light'}
          style={[
            styles.blurContainer,
            {
              backgroundColor: isSearchBarVisible ? 'transparent' :
                (isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)'),
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
              borderWidth: isSearchBarVisible ? 0 : 1,
            }
          ]}
        >
          <View style={styles.tabBar}>
            {isSearchBarVisible ? (
              <Animated.View
                style={[
                  styles.searchBarContainer,
                  {
                    opacity: searchBarAnim,
                    transform: [
                      {
                        translateY: searchBarAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: [20, 0],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <View style={[
                  styles.searchInputWrapper,
                  {
                    backgroundColor: isDark ? 'rgba(40,40,40,0.95)' : 'rgba(255,255,255,0.95)',
                    borderWidth: 1,
                    borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                  }
                ]}>
                  <TouchableOpacity
                    onPress={() => {
                      setIsSearchBarVisible(false);
                      Keyboard.dismiss();
                    }}
                    style={styles.searchIconWrapper}
                  >
                    <MaterialCommunityIcons
                      name="magnify"
                      size={18}
                      color={isDark ? '#999999' : '#666666'}
                      style={styles.searchIconInside}
                    />
                  </TouchableOpacity>
                  <TextInput
                    ref={searchInputRef}
                    style={[
                      styles.searchInput,
                      { color: isDark ? '#ffffff' : '#000000' }
                    ]}
                    placeholder="Search..."
                    placeholderTextColor={isDark ? '#999999' : '#666666'}
                    value={searchText}
                    onChangeText={setSearchText}
                    onSubmitEditing={handleSearchSubmit}
                    returnKeyType="search"
                  />
                </View>
              </Animated.View>
            ) : (
              <>
                {/* Selection Background */}
                <Animated.View
                  style={[
                    styles.selectionBackground,
                    {
                      left: state.index * tabItemWidth + (tabItemWidth - 64) / 2,
                      backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                      borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                    },
                  ]}
                />

                {tabData.map(({ name, icon, label, isFocused }) => (
                  <TouchableOpacity
                    key={name}
                    onPress={() => handleTabPress(name)}
                    style={[styles.tabItem, { width: tabItemWidth }]}
                    activeOpacity={0.7}
                  >
                    <View style={styles.tabContent}>
                      <MaterialCommunityIcons
                        name={icon}
                        size={22}
                        color={
                          isFocused
                            ? (isDark ? '#ffffff' : '#000000')
                            : (isDark ? '#888888' : '#666666')
                        }
                      />
                      {isFocused && (
                        <Text
                          style={[
                            styles.label,
                            {
                              color: isDark ? '#ffffff' : '#000000',
                            },
                          ]}
                        >
                          {label}
                        </Text>
                      )}
                    </View>
                  </TouchableOpacity>
                ))}
              </>
            )}
          </View>
        </BlurView>
      </Animated.View>

      <AppDetailsSheet
        bottomSheetAnim={bottomSheetAnim}
        bottomSheetPanResponder={bottomSheetPanResponder}
        hideBottomSheet={hideBottomSheet}
        isBottomSheetVisible={isBottomSheetVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top:0,
    left: 0,
    right: 0,
    bottom : 0,
    zIndex: 998,
  },
  overlayTouchable: {
    flex: 1,
  },
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 78, // Increased from 58
    borderRadius: 39, // Increased from 29
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    zIndex: 1000,
  },
  wrapperNoShadow: {
    elevation: 0,
    shadowOpacity: 0,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 39, // Increased from 29
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 3,
    position: 'relative',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 3, // Increased from 1
  },
  label: {
    fontSize: 11, // Increased from 8
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: 2, // Increased from 1
  },
  selectionBackground: {
    position: 'absolute',
    top: '50%',
    width: 68, // Increased from 52
    height: 58, // Increased from 42
    marginTop: -27, // Adjusted from -21
    borderRadius: 27, // Adjusted from 21
    borderWidth: 1,
    zIndex: 1,
  },
  searchBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: 10,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 35, // Increased from 25
    paddingHorizontal: 12, // Increased from 8
    height: '80%', // Increased from 75%
    width: '100%',
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIconInside: {
    marginRight: 6, // Increased from 4
  },
  searchIconWrapper: {
    padding: 5, // Increased from 3
  },
  searchInput: {
    flex: 1,
    fontSize: 16, // Increased from 14
    fontWeight: '500',
  },
  
});
