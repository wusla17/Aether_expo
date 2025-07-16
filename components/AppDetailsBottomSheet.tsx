import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import React from 'react';
import { Animated, Dimensions, Linking, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const { height: screenHeight } = Dimensions.get('window');

interface AppDetailsBottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  isDark: boolean;
  animationValue: Animated.Value;
}

const AppDetailsBottomSheet: React.FC<AppDetailsBottomSheetProps> = ({ isVisible, onClose, isDark, animationValue }) => {
  const bottomSheetHeight = 400; // Approximate height of the bottom sheet

  const translateY = animationValue.interpolate({
    inputRange: [0, 1],
    outputRange: [screenHeight, screenHeight - bottomSheetHeight],
  });

  return (
    <Modal transparent visible={isVisible} onRequestClose={onClose}>
      <TouchableOpacity style={styles.overlay} onPress={onClose} activeOpacity={1}>
        <Animated.View
          style={[
            styles.bottomSheet,
            {
              height: bottomSheetHeight,
              transform: [{ translateY }],
              backgroundColor: isDark ? 'rgba(20,20,20,0.85)' : 'rgba(255,255,255,0.85)',
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)',
            },
          ]}
        >
          <BlurView intensity={50} tint={isDark ? 'dark' : 'light'} style={StyleSheet.absoluteFill}>
        <TouchableOpacity style={styles.closeButton} onPress={onClose}>
          <MaterialCommunityIcons name="close-circle" size={24} color={isDark ? '#999999' : '#666666'} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDark ? '#ffffff' : '#000000' }]}>Aether Expo</Text>
        <Text style={[styles.version, { color: isDark ? '#cccccc' : '#333333' }]}>Version 1.0.0</Text>
        
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>Developers:</Text>
          <Text style={[styles.developerName, { color: isDark ? '#cccccc' : '#333333' }]}>Your Name 1</Text>
          <Text style={[styles.developerName, { color: isDark ? '#cccccc' : '#333333' }]}>Your Name 2</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: isDark ? '#ffffff' : '#000000' }]}>About This App:</Text>
          <Text style={[styles.description, { color: isDark ? '#cccccc' : '#333333' }]}>
            Aether Expo is a versatile mobile application designed to help you manage your daily tasks,
            appointments, and information efficiently. It features a clean, modern interface with intuitive
            navigation and powerful tools to keep you organized.
          </Text>
        </View>

        <View style={styles.linksContainer}>
          <TouchableOpacity onPress={() => Linking.openURL('https://github.com/your-repo')}>
            <MaterialCommunityIcons name="github" size={30} color={isDark ? '#ffffff' : '#000000'} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://your-website.com')}>
            <MaterialCommunityIcons name="web" size={30} color={isDark ? '#ffffff' : '#000000'} />
          </TouchableOpacity>
        </View>

          </BlurView>
        </Animated.View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)', // Dim background
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  bottomSheet: {
    width: '90%',
    maxHeight: '70%',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 80, // Space for the bottom navbar
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  version: {
    fontSize: 14,
    marginBottom: 20,
  },
  section: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
  },
  developerName: {
    fontSize: 16,
    marginBottom: 2,
  },
  description: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  linksContainer: {
    flexDirection: 'row',
    marginTop: 20,
    width: '100%',
    justifyContent: 'space-around',
  },
});

export default AppDetailsBottomSheet;
