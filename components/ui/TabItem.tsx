
import React from 'react';
import { Pressable, StyleSheet } from 'react-native';
import Animated, {
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { SvgProps } from 'react-native-svg';

type TabItemProps = {
  isFocused: boolean;
  onPress: () => void;
  icon: React.FC<SvgProps>;
  isDark: boolean;
};

export default function TabItem({
  isFocused,
  onPress,
  icon: Icon,
  isDark,
}: TabItemProps) {
  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateY: withTiming(isFocused ? -5 : 0, {
            duration: 200,
          }),
        },
      ],
      opacity: withTiming(isFocused ? 1 : 0.7, { duration: 200 }),
    };
  });

  return (
    <Pressable onPress={onPress} style={styles.tabItem}>
      <Animated.View style={animatedStyle}>
        <Icon
          width={24}
          height={24}
          color={isDark ? '#fff' : '#000'}
        />
      </Animated.View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
