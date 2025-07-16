import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
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
  useWindowDimensions
} from 'react-native';
import { GestureHandlerRootView, PanGestureHandler, State } from 'react-native-gesture-handler';
import { useSharedValue, withSpring } from 'react-native-reanimated';
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
  const tabBarBottomAnim = useRef(new Animated.Value(20)).current;

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

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

  const handleTabPress = (name: string) => {
    if (isBottomSheetVisible) {
      setIsBottomSheetVisible(false);
    }
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
      }
    }
  };

  const tabBarPadding = 8;
  const wrapperPadding = 40;
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
          toValue: e.endCoordinates.height + 40,
          duration: e.duration,
          useNativeDriver: false,
        }).start();
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      (e) => {
        Animated.timing(tabBarBottomAnim, {
          toValue: 20,
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
    <GestureHandlerRootView style={{ position: 'absolute', bottom: 0, left: 0, right: 0 }}>
      <PanGestureHandler onHandlerStateChange={onHandlerStateChange}>
        <Animated.View
          style={[
            styles.wrapper,
            isSearchBarVisible && styles.wrapperNoShadow,
            {
              marginHorizontal: searchBarAnim.interpolate({
                inputRange: [0, 1],
                outputRange: ['4%', '8%'],
              }),
              bottom: tabBarBottomAnim,
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
                        size={16}
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
                        left: state.index * tabItemWidth + (tabItemWidth - 68) / 2,
                        backgroundColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
                        borderColor: isDark ? 'rgba(255,255,255,0.2)' : 'rgba(0,0,0,0.1)',
                      },
                    ]}
                  />

                  {tabData.map(({ name, icon, label, isFocused }, index) => (
                    <TouchableOpacity
                      key={name}
                      onPress={() => handleTabPress(name)}
                      style={[styles.tabItem, { width: tabItemWidth }]}
                      activeOpacity={0.7}
                    >
                      <View style={styles.tabContent}>
                        <MaterialCommunityIcons
                          name={icon}
                          size={18}
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
      </PanGestureHandler>
      <AppDetailsBottomSheet
        isVisible={isBottomSheetVisible}
        onClose={() => setIsBottomSheetVisible(false)}
      />
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    height: 74,
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
  tabContent: {
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    gap: 2,
  },
  label: {
    fontSize: 10,
    textAlign: 'center',
    fontWeight: '600',
    letterSpacing: 0.1,
    marginTop: 2,
  },
  selectionBackground: {
    position: 'absolute',
    top: '50%',
    width: 68,
    height: 55,
    marginTop: -27.5,
    borderRadius: 27.5,
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
    alignItems: 'center',
    paddingHorizontal: 25,
  },
  searchInputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 30,
    paddingHorizontal: 10,
    height: '80%',
    width: '100%',
    marginHorizontal: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  searchIconInside: {
    marginRight: 6,
  },
  searchIconWrapper: {
    padding: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontWeight: '500',
  },
});
