import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  useColorScheme,
  TouchableOpacity,
  TouchableWithoutFeedback,
} from 'react-native';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import { PanGestureHandler, State } from 'react-native-gesture-handler';

interface AppDetailsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
}

const AppDetailsBottomSheet: React.FC<AppDetailsBottomSheetProps> = ({ isVisible, onClose }) => {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(350);

  const containerStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
    };
  });

  const sheetStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: translateY.value }],
    };
  });

  useEffect(() => {
    if (isVisible) {
      opacity.value = withTiming(1, { duration: 200 });
      translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
    } else {
      // Dismissal animation is handled in closeSheet
    }
  }, [isVisible]);

  const closeSheet = () => {
    translateY.value = withSpring(350, { damping: 20, stiffness: 150 });
    opacity.value = withTiming(0, { duration: 300 }, () => {
      runOnJS(onClose)();
    });
  };

  const onGestureEvent = (event: any) => {
    if (event.nativeEvent.translationY > 0) {
      translateY.value = event.nativeEvent.translationY;
    }
  };

  const onHandlerStateChange = (event: any) => {
    if (event.nativeEvent.oldState === State.ACTIVE) {
      if (event.nativeEvent.translationY > 100) {
        closeSheet();
      } else {
        translateY.value = withSpring(0, { damping: 20, stiffness: 150 });
      }
    }
  };

  if (!isVisible) {
    return null;
  }

  return (
    <PanGestureHandler onGestureEvent={onGestureEvent} onHandlerStateChange={onHandlerStateChange}>
      <Animated.View style={[styles.overlay, containerStyle]}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={closeSheet}
        >
          <TouchableWithoutFeedback>
            <Animated.View
              style={[
                styles.bottomSheet,
                isDark ? styles.darkBottomSheet : styles.lightBottomSheet,
                sheetStyle,
              ]}
            >
              <View style={styles.handle} />
              <Text style={[styles.title, isDark ? styles.darkText : styles.lightText]}>App Details</Text>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, isDark ? styles.darkText : styles.lightText]}>Version:</Text>
                <Text style={[styles.detailValue, isDark ? styles.darkText : styles.lightText]}>1.0.0</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, isDark ? styles.darkText : styles.lightText]}>Developer:</Text>
                <Text style={[styles.detailValue, isDark ? styles.darkText : styles.lightText]}>Aether</Text>
              </View>
              <View style={styles.detailItem}>
                <Text style={[styles.detailLabel, isDark ? styles.darkText : styles.lightText]}>Built with:</Text>
                <Text style={[styles.detailValue, isDark ? styles.darkText : styles.lightText]}>React Native & Expo</Text>
              </View>
            </Animated.View>
          </TouchableWithoutFeedback>
        </TouchableOpacity>
      </Animated.View>
    </PanGestureHandler>
  );
};

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'flex-end',
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 105, // Raised the position
    left: '4%',
    right: '4%',
    padding: 20,
    borderRadius: 25,
  },
  lightBottomSheet: {
    backgroundColor: '#F5F5F5',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 15,
  },
  darkBottomSheet: {
    backgroundColor: '#242424',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 15,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#999999',
    alignSelf: 'center',
    marginBottom: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
  },
  lightText: {
    color: '#000000',
  },
  darkText: {
    color: '#EAEAEA',
  },
});

export default AppDetailsBottomSheet;
