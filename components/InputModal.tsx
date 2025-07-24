import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
  Platform,
  KeyboardAvoidingView,
} from 'react-native';
import { BlurView } from 'expo-blur';

interface InputModalProps {
  isVisible: boolean;
  title: string;
  onSubmit: (value: string) => void;
  onClose: () => void;
  initialValue?: string;
}

const Colors = {
  primaryText: '#FFFFFF',
  secondaryText: '#8E8E93',
  accent: '#0D84FF',
  separator: 'rgba(255, 255, 255, 0.1)',
  overlayBackground: 'rgba(0, 0, 0, 0.6)',
  cardBackground: 'rgba(40, 40, 40, 0.8)', // Frosted glass base
  cardBorder: 'rgba(255, 255, 255, 0.2)',
  inputBackground: 'rgba(255, 255, 255, 0.1)',
};

const InputModal: React.FC<InputModalProps> = ({
  isVisible,
  title,
  onSubmit,
  onClose,
  initialValue = '',
}) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    setInputValue(initialValue);
  }, [initialValue]);

  const handleSubmit = () => {
    onSubmit(inputValue);
    onClose();
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <Pressable style={styles.overlay} onPress={onClose}>
          <View style={styles.alertBox}> 
            <BlurView style={StyleSheet.absoluteFill} tint="dark" intensity={20} />
            <View style={styles.contentContainer}>
              <Text style={styles.title}>{title}</Text>
              <TextInput
                style={styles.textInput}
                value={inputValue}
                onChangeText={setInputValue}
                placeholder="Enter text..."
                placeholderTextColor={Colors.secondaryText}
                autoFocus
              />
              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button} onPress={onClose}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.doneButton]} onPress={handleSubmit}>
                  <Text style={styles.buttonText}>Done</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Pressable>
      </KeyboardAvoidingView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.overlayBackground,
  },
  alertBox: {
    width: '80%',
    maxHeight: '70%',
    borderRadius: 20,
    backgroundColor: Colors.cardBackground,
    borderWidth: 1,
    borderColor: Colors.cardBorder,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 20,
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.primaryText,
    marginBottom: 20,
    textAlign: 'center',
  },
  textInput: {
    backgroundColor: Colors.inputBackground,
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    color: Colors.primaryText,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 10,
    backgroundColor: Colors.separator,
    alignItems: 'center',
    minWidth: 100,
  },
  doneButton: {
    backgroundColor: Colors.accent,
  },
  buttonText: {
    fontSize: 16,
    color: Colors.primaryText,
    fontWeight: 'bold',
  },
});

export default InputModal;