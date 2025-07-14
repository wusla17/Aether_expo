import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { BlurView } from 'expo-blur';
import * as Haptics from 'expo-haptics';
import React from 'react';
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  interpolate,
  runOnJS,
  useAnimatedReaction,
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');
const TAB_WIDTH = (width - 40) / 4;
const BOTTOM_SHEET_HEIGHT = height * 0.35;
const TAB_BAR_HEIGHT = 60;
const TAB_BAR_BOTTOM = 30;

export default function CustomTabBar({ state, descriptors, navigation }: BottomTabBarProps): React.ReactElement {
  const tabTranslateX = useSharedValue(state.index * TAB_WIDTH);
  const sheetTranslateY = useSharedValue(BOTTOM_SHEET_HEIGHT);
  const tabBarScale = useSharedValue(1);
  const tabBarOpacity = useSharedValue(1);
  const tabBarTranslateY = useSharedValue(0);
  const gestureContext = useSharedValue(0);

  const resetTabBarAnimations = () => {
    'worklet';
    tabBarScale.value = withSpring(1, { damping: 20, stiffness: 150 });
    tabBarOpacity.value = withSpring(1, { damping: 20, stiffness: 150 });
    tabBarTranslateY.value = withSpring(0, { damping: 20, stiffness: 150 });
  };

  const triggerHaptic = (type: 'light' | 'medium' | 'heavy') => {
    switch (type) {
      case 'light':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
        break;
      case 'medium':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
        break;
      case 'heavy':
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
        break;
    }
  };

  useAnimatedReaction(
    () => state.index,
    (activeIndex, previousIndex) => {
      if (activeIndex !== previousIndex) {
        tabTranslateX.value = withSpring(activeIndex * TAB_WIDTH, {
          damping: 15,
          stiffness: 150,
          mass: 0.8,
        });
        sheetTranslateY.value = withSpring(BOTTOM_SHEET_HEIGHT);
        gestureContext.value = BOTTOM_SHEET_HEIGHT;
        resetTabBarAnimations();
      }
    },
    [state.index]
  );

  const handlePress = (routeName: string, isFocused: boolean) => {
    if (!isFocused) {
      runOnJS(triggerHaptic)('light');
      navigation.navigate(routeName);
    }
  };

  const panGesture = Gesture.Pan()
    .onStart(() => {
      gestureContext.value = sheetTranslateY.value;
      runOnJS(triggerHaptic)('light');
    })
    .onUpdate((event) => {
      const newTranslateY = gestureContext.value + event.translationY;
      sheetTranslateY.value = Math.max(0, Math.min(BOTTOM_SHEET_HEIGHT, newTranslateY));
    })
    .onEnd((event) => {
      const finalY = sheetTranslateY.value;
      let targetY = BOTTOM_SHEET_HEIGHT;

      if (event.velocityY > 300) {
        targetY = BOTTOM_SHEET_HEIGHT;
        runOnJS(triggerHaptic)('medium');
      } else if (event.velocityY < -300) {
        targetY = 0;
        runOnJS(triggerHaptic)('medium');
      } else {
        if (finalY > BOTTOM_SHEET_HEIGHT * 0.3) {
          targetY = BOTTOM_SHEET_HEIGHT;
        } else {
          targetY = 0;
        }
        runOnJS(triggerHaptic)('light');
      }

      sheetTranslateY.value = withSpring(targetY, {
        damping: 20,
        stiffness: 150,
        mass: 0.8,
      });

      const shouldClose = targetY === BOTTOM_SHEET_HEIGHT;
      if (shouldClose) {
        resetTabBarAnimations();
      } else {
        tabBarScale.value = withSpring(0.85, { damping: 20, stiffness: 150 });
        tabBarOpacity.value = withSpring(0.6, { damping: 20, stiffness: 150 });
        tabBarTranslateY.value = withSpring(15, { damping: 20, stiffness: 150 });
      }
    });

  const animatedSheetStyle = useAnimatedStyle(() => {
    const scale = interpolate(
      sheetTranslateY.value,
      [0, BOTTOM_SHEET_HEIGHT],
      [1, 0.9]
    );
    const opacity = interpolate(
      sheetTranslateY.value,
      [0, BOTTOM_SHEET_HEIGHT * 0.5],
      [1, 0]
    );
    return { transform: [{ translateY: sheetTranslateY.value }, { scale }], opacity };
  });

  const animatedIndicatorStyle = useAnimatedStyle(() => {
    return { transform: [{ translateX: tabTranslateX.value }] };
  });

  const animatedTabBarStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: tabBarScale.value }, { translateY: tabBarTranslateY.value }],
      opacity: tabBarOpacity.value,
    };
  });

  return (
    <>
      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.bottomSheet, animatedSheetStyle]}>
          <View style={styles.handle} />
          <Text style={styles.detailsTitle}>About the App</Text>
          <Text style={styles.detailsText}>App Name: Aether</Text>
          <Text style={styles.detailsText}>Version: 1.0.0</Text>
          <Text style={styles.detailsTitle}>Developer</Text>
          <Text style={styles.detailsText}>Developed by: wusla</Text>
        </Animated.View>
      </GestureDetector>

      <GestureDetector gesture={panGesture}>
        <Animated.View style={[styles.wrapper, animatedTabBarStyle]}>
          <BlurView intensity={80} tint="dark" style={styles.tabBar}>
            <Animated.View style={[styles.activeIndicator, animatedIndicatorStyle]} />
            {state.routes.map((route, index) => {
              const { options } = descriptors[route.key];
              const isFocused = state.index === index;
              if (!options.tabBarIcon) return null;
              return (
                <TouchableOpacity
                  key={route.key}
                  onPress={() => handlePress(route.name, isFocused)}
                  activeOpacity={0.7}
                  style={styles.tabButton}>
                  {options.tabBarIcon({ focused: isFocused, color: "white", size: 24 })}
                </TouchableOpacity>
              );
            })}
          </BlurView>
        </Animated.View>
      </GestureDetector>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM,
    left: 20,
    right: 20,
    alignItems: 'center',
    zIndex: 1,
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    width: '100%',
    maxWidth: 400,
    height: TAB_BAR_HEIGHT,
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
  bottomSheet: {
    position: 'absolute',
    bottom: TAB_BAR_BOTTOM + TAB_BAR_HEIGHT + 10,
    left: 20,
    right: 20,
    height: BOTTOM_SHEET_HEIGHT,
    backgroundColor: '#1c1c1e',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
    zIndex: 0,
  },
  handle: {
    width: 40,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    marginBottom: 15,
  },
  detailsTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    alignSelf: 'flex-start',
  },
  detailsText: {
    fontSize: 16,
    color: 'white',
    marginBottom: 5,
    alignSelf: 'flex-start',
  },
});
