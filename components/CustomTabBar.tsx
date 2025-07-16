import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import { useRouter } from 'expo-router';
import { MotiView } from 'moti';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Keyboard,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  useColorScheme,
  useWindowDimensions,
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import AppDetailsBottomSheet from './AppDetailsBottomSheet';

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
  const lastTap = useRef(0);
  const searchBarAnim = useRef(new Animated.Value(0)).current;
  const searchInputRef = useRef<TextInput>(null);
  const keyboardHeightAnim = useRef(new Animated.Value(0)).current;
  const bottomOffset = useRef(new Animated.Value(20)).current; // For Animated.add

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);
  const bottomSheetAnim = useRef(new Animated.Value(0)).current;
  const tabBarAnim = useRef(new Animated.Value(1)).current;

  const tabData = React.useMemo(() => tabs.map(t => ({
    ...t,
    isFocused: state.routes[state.index].name === t.name,
  })), [state.index, state.routes]);

  useEffect(() => {
    Animated.timing(searchBarAnim, {
      toValue: isSearchBarVisible ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start(() => {
      if (isSearchBarVisible) {
        searchInputRef.current?.focus();
      }
    });
  }, [isSearchBarVisible]);

  useEffect(() => {
    Animated.spring(bottomSheetAnim, {
      toValue: isBottomSheetVisible ? 1 : 0,
      useNativeDriver: false,
    }).start();

    Animated.spring(tabBarAnim, {
      toValue: isBottomSheetVisible ? 0 : 1,
      useNativeDriver: false,
    }).start();
  }, [isBottomSheetVisible]);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      (e) => {
        Animated.timing(keyboardHeightAnim, {
          toValue: e.endCoordinates.height,
          duration: e.duration,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (e) => {
        Animated.timing(keyboardHeightAnim, {
          toValue: 0,
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

  const handleTabPress = (name: string) => {
    if (isBottomSheetVisible) {
      setIsBottomSheetVisible(false);
    }
    const now = Date.now();
    const DOUBLE_PRESS_DELAY = 300;
    if (name === 'search') {
      if (now - lastTap.current < DOUBLE_PRESS_DELAY) {
        setIsSearchBarVisible(true);
      } else {
        lastTap.current = now;
        if (isSearchBarVisible) {
          setIsSearchBarVisible(false);
          Keyboard.dismiss();
          setSearchText('');
        } else {
          navigation.navigate(name);
        }
      }
    } else {
      if (isSearchBarVisible) {
        setIsSearchBarVisible(false);
        setSearchText('');
      }
      navigation.navigate(name);
    }
  };

  const handleSearchSubmit = () => {
    if (searchText.trim()) {
      router.setParams({ q: searchText.trim() });
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      const { translationY } = event.nativeEvent;
      if (translationY < -50) {
        setIsBottomSheetVisible(true);
      } else {
        setIsBottomSheetVisible(false);
      }
    }
  };

  const tabBarPadding = 8;
  const wrapperPadding = 40;
  const tabItemWidth = React.useMemo(() =>
    (screenWidth - wrapperPadding - tabBarPadding) / tabs.length,
    [screenWidth]
  );

  return (
    <GestureHandlerRootView style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.wrapper,
            isSearchBarVisible && styles.wrapperNoShadow,
            {
              height: tabBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [50, 70],
              }),
              marginHorizontal: searchBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 40],
              }),
              bottom: Animated.add(keyboardHeightAnim, isSearchBarVisible ? bottomOffset : new Animated.Value(20)),
            },
          ]}
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
                      backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
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
                        size={20}
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
                  {/* Animated Selection Background */}
                  <Animated.View
                    style={[
                      styles.selectionBackground,
                      {
                        left: state.index * tabItemWidth + (tabItemWidth - 70) / 2,
                        opacity: tabBarAnim,
                      },
                    ]}
                  >
                    <BlurView
                      intensity={50}
                      tint={isDark ? 'dark' : 'light'}
                      style={[
                        styles.selectionBlurView,
                        {
                          backgroundColor: isDark ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.3)',
                          borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.5)',
                        }
                      ]}
                    />
                  </Animated.View>

                  {tabData.map(({ name, icon, label, isFocused }: { name: string; icon: IconName; label: string; isFocused: boolean }) => (
                    <TouchableOpacity
                      key={name}
                      onPress={() => handleTabPress(name)}
                      style={[styles.tabItem, { width: tabItemWidth }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.contentContainer}>
                        <MotiView
                          style={styles.iconContainer}
                          animate={{
                            scale: isFocused ? 1.1 : 1,
                            translateY: isFocused ? -2 : 0,
                          }}
                          transition={{ type: 'timing', duration: 200 }}
                        >
                          <MaterialCommunityIcons
                            name={icon}
                            size={20}
                            color={
                              isFocused
                                ? (isDark ? '#ffffff' : '#000000')
                                : (isDark ? '#999999' : '#666666')
                            }
                          />
                        </MotiView>
                        {isFocused && (
                          <MotiView
                            style={styles.labelContainer}
                            animate={{ opacity: tabBarAnim, translateY: 0 }}
                            transition={{ type: 'timing', duration: 200 }}
                          >
                            <Text style={[
                              styles.label,
                              { color: isDark ? '#ffffff' : '#000000', fontWeight: '600' }
                            ]}>
                              {label}
                            </Text>
                          </MotiView>
                        )}
                      </View>
                    </TouchableOpacity>
                  ))}
                </>
              )}
            </View>
          </BlurView>
        </Animated.View>
      </PanGestureHandler>
      <AppDetailsBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
        isDark={isDark}
        animationValue={bottomSheetAnim}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 70,
    borderRadius: 35,
    overflow: 'hidden',
    elevation: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  wrapperNoShadow: {
    elevation: 0,
    shadowOpacity: 0,
  },
  blurContainer: {
    flex: 1,
    borderRadius: 35,
    overflow: 'hidden',
  },
  tabBar: {
    flexDirection: 'row',
    height: '100%',
    alignItems: 'center',
    paddingHorizontal: 4,
    position: 'relative',
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    zIndex: 2,
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 40,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 0,
  },
  labelContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 9,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.1,
    maxWidth: 50,
  },
  selectionBackground: {
    position: 'absolute',
    top: '50%',
    left: 4,
    width: 70,
    height: 50,
    marginTop: -25,
    borderRadius: 25,
    borderWidth: 1,
    zIndex: 1,
    overflow: 'hidden',
  },
  selectionBlurView: {
    flex: 1,
    borderRadius: 25,
    borderWidth: 1,
    overflow: 'hidden',
  },
  searchBarContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 15,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 25,
    paddingHorizontal: 15,
    height: 40,
    flex: 1,
    marginHorizontal: 0,
  },
  searchIconInside: {
    marginRight: 10,
  },
  searchIconWrapper: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    fontWeight: '500',
  },
});
