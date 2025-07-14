import React, { useEffect } from 'react';
import { TouchableOpacity } from 'react-native';
import Animated, {
  useSharedValue,
  withSpring,
  useAnimatedStyle,
  interpolate,
  Extrapolate,
} from 'react-native-reanimated';

interface TabItemProps {
  isFocused: boolean;
  onPress: () => void;
  icon: any; // This should be a LucideIcon component
  isDark: boolean;
}

export default function TabItem({ isFocused, onPress, icon: TabIcon, isDark }: TabItemProps) {
  const tabAnimation = useSharedValue(0);

  useEffect(() => {
    tabAnimation.value = withSpring(isFocused ? 1 : 0, { damping: 10, stiffness: 100 });
  }, [isFocused, tabAnimation]);

  const animatedTabStyle = useAnimatedStyle(() => {
    const translateY = interpolate(tabAnimation.value, [0, 1], [0, -10], Extrapolate.CLAMP);
    return {
      transform: [{ translateY }],
    };
  });

  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View style={animatedTabStyle}>
        <TabIcon size={24} color={isFocused ? (isDark ? '#fff' : '#888') : '#888'} />
      </Animated.View>
    </TouchableOpacity>
  );
}
