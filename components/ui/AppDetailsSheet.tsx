
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import {
  Animated,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';

const appDetails = {
  name: 'My App',
  version: '1.0.0',
  description: 'A beautiful and functional app with modern design',
  features: [
    'Home dashboard with quick access',
    'Smart to-do management',
    'Calendar integration',
    'Powerful search functionality',
    'Dark/Light mode support',
    'Haptic feedback',
  ],
  developer: 'Your Name',
  lastUpdated: 'July 2025',
};

interface AppDetailsSheetProps {
  bottomSheetAnim: Animated.Value;
  bottomSheetPanResponder: any; // You might want to refine this type if you have a specific PanResponder type
  hideBottomSheet: () => void;
  isBottomSheetVisible: boolean;
}

export default function AppDetailsSheet({
  bottomSheetAnim,
  bottomSheetPanResponder,
  hideBottomSheet,
  isBottomSheetVisible,
}: AppDetailsSheetProps) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Animated.View
      style={[
        styles.bottomSheet,
        {
          backgroundColor: isDark
            ? 'rgba(20,20,20,0.95)'
            : 'rgba(255,255,255,0.95)',
          borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
          transform: [
            {
              translateY: bottomSheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [450, 0],
              }),
            },
            {
              scale: bottomSheetAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [0.95, 1],
              }),
            },
          ],
          opacity: bottomSheetAnim.interpolate({
            inputRange: [0, 0.5, 1],
            outputRange: [0, 0.8, 1],
          }),
        },
      ]}
      pointerEvents={isBottomSheetVisible ? 'auto' : 'none'}
    >
      <BlurView
        intensity={30}
        tint={isDark ? 'dark' : 'light'}
        style={styles.bottomSheetBlur}
      >
        {/* Handle */}
        <View
          style={[
            styles.bottomSheetHandle,
            { backgroundColor: isDark ? 'rgba(255,255,255,0.3)' : 'rgba(0,0,0,0.3)' },
          ]}
        />

        <ScrollView
          style={styles.bottomSheetContent}
          showsVerticalScrollIndicator={false}
          onScroll={({ nativeEvent }) => {
            if (nativeEvent.contentOffset.y === 0 && nativeEvent.velocity && nativeEvent.velocity.y < -0.5) {
              hideBottomSheet();
            }
          }}
          scrollEventThrottle={16}
        >
          {/* App Icon and Name */}
          <View style={styles.appHeader}>
            <View
              style={[
                styles.appIcon,
                {
                  backgroundColor: isDark
                    ? 'rgba(255,255,255,0.1)'
                    : 'rgba(0,0,0,0.1)',
                },
              ]}
            >
              <MaterialCommunityIcons
                name="application"
                size={30}
                color={isDark ? '#ffffff' : '#000000'}
              />
            </View>
            <View style={styles.appInfo}>
              <Text
                style={[
                  styles.appName,
                  { color: isDark ? '#ffffff' : '#000000' },
                ]}
              >
                {appDetails.name}
              </Text>
              <Text
                style={[
                  styles.appVersion,
                  { color: isDark ? '#999999' : '#666666' },
                ]}
              >
                Version {appDetails.version}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            style={[
              styles.appDescription,
              { color: isDark ? '#cccccc' : '#444444' },
            ]}
          >
            {appDetails.description}
          </Text>

          {/* Features */}
          <View style={styles.featuresSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#ffffff' : '#000000' },
              ]}
            >
              Features
            </Text>
            {appDetails.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={16}
                  color={isDark ? '#4CAF50' : '#2196F3'}
                />
                <Text
                  style={[
                    styles.featureText,
                    { color: isDark ? '#cccccc' : '#444444' },
                  ]}
                >
                  {feature}
                </Text>
              </View>
            ))}
          </View>

          {/* Developer Info */}
          <View style={styles.developerSection}>
            <Text
              style={[
                styles.sectionTitle,
                { color: isDark ? '#ffffff' : '#000000' },
              ]}
            >
              Developer
            </Text>
            <Text
              style={[
                styles.developerName,
                { color: isDark ? '#cccccc' : '#444444' },
              ]}
            >
              {appDetails.developer}
            </Text>
            <Text
              style={[
                styles.lastUpdated,
                { color: isDark ? '#999999' : '#666666' },
              ]}
            >
              Last updated: {appDetails.lastUpdated}
            </Text>
          </View>

          {/* Close Button */}
          <TouchableOpacity
            style={[
              styles.closeButton,
              {
                backgroundColor: isDark
                  ? 'rgba(255,255,255,0.1)'
                  : 'rgba(0,0,0,0.1)',
              },
            ]}
            onPress={hideBottomSheet}
          >
            <Text
              style={[
                styles.closeButtonText,
                { color: isDark ? '#ffffff' : '#000000' },
              ]}
            >
              Close
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </BlurView>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bottomSheet: {
    position: 'absolute',
    left: 20,
    right: 20,
    bottom: 120,
    height: 450,
    borderRadius: 25,
    borderWidth: 1,
    elevation: 25,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    zIndex: 999,
  },
  bottomSheetBlur: {
    flex: 1,
    borderRadius: 25,
    overflow: 'hidden',
  },
  bottomSheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  bottomSheetContent: {
    flex: 1,
    paddingHorizontal: 20,
  },
  appHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  appIcon: {
    width: 60,
    height: 60,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  appInfo: {
    flex: 1,
  },
  appName: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 4,
  },
  appVersion: {
    fontSize: 14,
    fontWeight: '500',
  },
  appDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 24,
  },
  featuresSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  featureText: {
    fontSize: 14,
    marginLeft: 8,
    flex: 1,
  },
  developerSection: {
    marginBottom: 24,
  },
  developerName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  lastUpdated: {
    fontSize: 12,
  },
  closeButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: 'center',
    marginBottom: 20,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});
