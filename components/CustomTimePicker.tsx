import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, Modal } from 'react-native';

interface CustomTimePickerProps {
  onClose: () => void;
  onTimeChange: (time: string) => void;
  initialTime: string;
}

const CustomTimePicker: React.FC<CustomTimePickerProps> = ({ onClose, onTimeChange, initialTime }) => {
  const [time, setTime] = useState(new Date());

  // Initialize time with initialTime prop
  React.useEffect(() => {
    const [hours, minutes] = initialTime.split(':').map(Number);
    const date = new Date();
    date.setHours(hours);
    date.setMinutes(minutes);
    setTime(date);
  }, [initialTime]);

  const handleTimeChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (selectedDate) {
      setTime(selectedDate);
      onTimeChange(formatTime(selectedDate));
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={true} // Always visible when rendered by EventDetailsModal
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.container}>
          <TouchableOpacity onPress={onClose} style={styles.closeIcon}>
            <Ionicons name="close-circle" size={28} color="#999" />
          </TouchableOpacity>

          <Text style={styles.title}>Select Time</Text>

          <DateTimePicker
            value={time}
            mode="time"
            is24Hour={false}
            display="spinner"
            onChange={handleTimeChange}
            textColor="white"
          />

          <TouchableOpacity style={styles.doneButton} onPress={onClose}>
            <Text style={styles.doneButtonText}>Done</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
  },
  container: {
    backgroundColor: '#2c2c2e',
    borderRadius: 20,
    padding: 20,
    margin: 20,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 5,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  closeIcon: {
    position: 'absolute',
    top: 15,
    right: 15,
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
    marginBottom: 20,
  },
  doneButton: {
    backgroundColor: '#FFA500',
    borderRadius: 10,
    paddingVertical: 12,
    marginTop: 20,
  },
  doneButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default CustomTimePicker;
