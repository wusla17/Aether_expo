import { BlurView } from '@react-native-community/blur';
import React from 'react';
import { Modal, Platform, StyleSheet, Text, View } from 'react-native';

interface GlassmorphicModalProps {
  visible: boolean;
  title: string;
  onCancel: () => void;
  isDarkMode: boolean;
  children?: React.ReactNode;
}

const GlassmorphicModal: React.FC<GlassmorphicModalProps> = ({
  visible,
  title,
  onCancel,
  children,
  isDarkMode,
}) => {
  return (
    <Modal
      transparent={true}
      visible={visible}
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={styles.absolute}
            blurType={isDarkMode ? 'dark' : 'light'}
            blurAmount={20}
            reducedTransparencyFallbackColor={isDarkMode ? 'black' : 'white'}
          />
        ) : (
          <View style={[styles.absolute, { backgroundColor: isDarkMode ? 'rgba(0,0,0,0.7)' : 'rgba(255,255,255,0.7)' }]} />
        )}
        <View style={styles.centeredView}>
          <View style={[styles.modalView, { backgroundColor: isDarkMode ? 'rgba(28,28,30,0.8)' : 'rgba(255,255,255,0.8)' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#FFF' : '#000' }]}>{title}</Text>
            <View style={styles.contentContainer}>
              {children}
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  absolute: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end', // Align to the bottom
    alignItems: 'center',
  },
  modalView: {
    marginHorizontal: 16, // Add horizontal margin
    marginBottom: 80, // Lift above bottom navbar area
    width: '90%', // Take up 90% of the width
    maxHeight: '70%', // Max height to ensure it's not too tall
    borderRadius: 20, // Rounded corners for the entire modal
    padding: 0, // Remove padding from modalView, content will handle its own padding
    alignItems: 'center', // Center content horizontally
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    overflow: 'hidden',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 0, // Remove margin
    textAlign: 'left', // Left align title
    width: '100%', // Take full width
    paddingHorizontal: 20, // Add padding to title
    paddingTop: 20, // Add padding to title
  },
  contentContainer: {
    width: '100%',
    marginTop: 0, // Remove margin
  },
});

export default GlassmorphicModal;
