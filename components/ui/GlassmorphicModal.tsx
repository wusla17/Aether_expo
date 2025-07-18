import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Platform } from 'react-native';
import { BlurView } from '@react-native-community/blur';

interface GlassmorphicModalProps {
  visible: boolean;
  title: string;
  message: string;
  onClear: () => void;
  onCancel: () => void;
  isDarkMode: boolean;
}

const GlassmorphicModal: React.FC<GlassmorphicModalProps> = ({
  visible,
  title,
  message,
  onClear,
  onCancel,
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
            <Text style={[styles.modalMessage, { color: isDarkMode ? '#EAEAEA' : '#333' }]}>{message}</Text>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onCancel}
              >
                <Text style={[styles.buttonText, styles.cancelButtonText]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.clearButton]}
                onPress={onClear}
              >
                <Text style={[styles.buttonText, styles.clearButtonText]}>Clear</Text>
              </TouchableOpacity>
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
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
    maxWidth: 400,
    overflow: 'hidden', // Ensures content respects border radius
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  modalMessage: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  button: {
    borderRadius: 10,
    padding: 12,
    elevation: 2,
    flex: 1,
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#E0E0E0',
  },
  clearButton: {
    backgroundColor: '#FF453A',
  },
  buttonText: {
    fontWeight: 'bold',
    textAlign: 'center',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
  },
  clearButtonText: {
    color: 'white',
  },
});

export default GlassmorphicModal;
