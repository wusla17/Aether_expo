import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Switch,
} from 'react-native';
import { BlurView } from 'expo-blur';
import { Ionicons } from '@expo/vector-icons';
import CustomTimePicker from './CustomTimePicker';
import SelectionModal from './SelectionModal';
import { useEventModal, EventData } from '@/context/EventModalContext';

const EventDetailsModal = () => {
  const { isVisible, closeModal, eventData } = useEventModal();

  const [title, setTitle] = useState(eventData?.title || '');
  const [location, setLocation] = useState(eventData?.location || '');
  const [isAllDay, setIsAllDay] = useState(false);
  const [startTime, setStartTime] = useState(eventData?.startTime ? eventData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '10:00 AM');
  const [endTime, setEndTime] = useState(eventData?.endTime ? eventData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '11:00 AM');
  const [selectedCalendar, setSelectedCalendar] = useState(eventData?.calendar || 'Home');
  const [reminder, setReminder] = useState(eventData?.reminders || 'None');

  const [isTimePickerVisible, setTimePickerVisible] = useState(false);
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
  const [isReminderModalVisible, setReminderModalVisible] = useState(false);
  const [timePickerTarget, setTimePickerTarget] = useState<'start' | 'end'>('start');

  // Update state when eventData changes (e.g., when a new event is opened)
  React.useEffect(() => {
    if (eventData) {
      setTitle(eventData.title);
      setLocation(eventData.location);
      setStartTime(eventData.startTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setEndTime(eventData.endTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
      setSelectedCalendar(eventData.calendar);
      setReminder(eventData.reminders);
    } else {
      // Reset state when modal is closed or no eventData
      setTitle('');
      setLocation('');
      setStartTime('10:00 AM');
      setEndTime('11:00 AM');
      setSelectedCalendar('Home');
      setReminder('None');
    }
  }, [eventData]);

  const calendarOptions = ['Home', 'Work', 'Personal'];
  const reminderOptions = ['None', 'At time of event', '5 minutes before', '15 minutes before', '30 minutes before', '1 hour before', '1 day before'];

  const handleTimePress = (target: 'start' | 'end') => {
    setTimePickerTarget(target);
    setTimePickerVisible(true);
  };

  const handleTimeChange = (newTime: string) => {
    if (timePickerTarget === 'start') {
      setStartTime(newTime);
    } else {
      setEndTime(newTime);
    }
  };

  const handleSelectCalendar = (option: string) => {
    setSelectedCalendar(option);
    setCalendarModalVisible(false);
  };

  const handleSelectReminder = (option: string) => {
    setReminder(option);
    setReminderModalVisible(false);
  };

  const handleClose = () => {
    closeModal();
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={handleClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <Pressable style={styles.modalOverlay} onPress={handleClose}>
          <Pressable>
            <BlurView intensity={50} tint="dark" style={styles.modalContainer}>
              <View style={styles.header}>
                <Text style={styles.headerText}>New Event</Text>
                <TouchableOpacity onPress={handleClose} style={styles.addButton}>
                  <Text style={styles.addButtonText}>Add</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.titleInput}
                  placeholder="Title"
                  placeholderTextColor="#8E8E93"
                  value={title}
                  onChangeText={setTitle}
                />
                <View style={styles.separator} />
                <TextInput
                  style={styles.locationInput}
                  placeholder="Location or Video Call"
                  placeholderTextColor="#8E8E93"
                  value={location}
                  onChangeText={setLocation}
                />
              </View>

              <View style={styles.switchContainer}>
                <View style={styles.row}>
                  <Ionicons name="time-outline" size={24} color="white" style={styles.icon} />
                  <Text style={styles.label}>All-day</Text>
                  <Switch
                    value={isAllDay}
                    onValueChange={setIsAllDay}
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isAllDay ? '#f4f3f4' : '#f4f3f4'}
                  />
                </View>
                {!isAllDay && (
                  <>
                    <TouchableOpacity onPress={() => handleTimePress('start')}>
                      <View style={[styles.row, styles.timeRow]}>
                        <Text style={styles.label}>Starts</Text>
                        <Text style={styles.timeText}>{startTime}</Text>
                      </View>
                    </TouchableOpacity>
                    <View style={styles.separator} />
                    <TouchableOpacity onPress={() => handleTimePress('end')}>
                      <View style={[styles.row, styles.timeRow]}>
                        <Text style={styles.label}>Ends</Text>
                        <Text style={styles.timeText}>{endTime}</Text>
                      </View>
                    </TouchableOpacity>
                  </>
                )}
              </View>

              <View style={styles.selectionContainer}>
                <TouchableOpacity onPress={() => setCalendarModalVisible(true)}>
                  <View style={styles.row}>
                    <Ionicons name="calendar-outline" size={24} color="white" style={styles.icon} />
                    <Text style={styles.label}>Calendar</Text>
                    <Text style={styles.selectedValue}>{selectedCalendar}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                  </View>
                </TouchableOpacity>
                <View style={styles.separator} />
                <TouchableOpacity onPress={() => setReminderModalVisible(true)}>
                  <View style={styles.row}>
                    <Ionicons name="notifications-outline" size={24} color="white" style={styles.icon} />
                    <Text style={styles.label}>Reminder</Text>
                    <Text style={styles.selectedValue}>{reminder}</Text>
                    <Ionicons name="chevron-forward" size={20} color="#8E8E93" />
                  </View>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Pressable>
        </Pressable>
      </KeyboardAvoidingView>

      {isTimePickerVisible && (
        <CustomTimePicker
          onClose={() => setTimePickerVisible(false)}
          onTimeChange={handleTimeChange}
          initialTime={timePickerTarget === 'start' ? startTime : endTime}
        />
      )}

      <SelectionModal
        isVisible={isCalendarModalVisible}
        onClose={() => setCalendarModalVisible(false)}
        onSelect={handleSelectCalendar}
        options={calendarOptions}
        title="Choose Calendar"
      />

      <SelectionModal
        isVisible={isReminderModalVisible}
        onClose={() => setReminderModalVisible(false)}
        onSelect={handleSelectReminder}
        options={reminderOptions}
        title="Set Reminder"
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  keyboardAvoidingView: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  modalContainer: {
    marginHorizontal: 8,
    marginBottom: 40,
    borderRadius: 20,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: 'rgba(30, 30, 30, 0.8)',
  },
  headerText: {
    fontSize: 17,
    fontWeight: '600',
    color: 'white',
  },
  addButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  addButtonText: {
    color: '#FFA500',
    fontSize: 17,
    fontWeight: '600',
  },
  inputContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 16,
  },
  titleInput: {
    fontSize: 17,
    color: 'white',
    padding: 16,
  },
  locationInput: {
    fontSize: 17,
    color: 'white',
    padding: 16,
  },
  switchContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  selectionContainer: {
    backgroundColor: 'rgba(40, 40, 40, 0.8)',
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 24,
    paddingHorizontal: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
  },
  timeRow: {
    justifyContent: 'space-between',
  },
  icon: {
    marginRight: 16,
  },
  label: {
    fontSize: 17,
    color: 'white',
    flex: 1,
  },
  timeText: {
    fontSize: 17,
    color: '#FFA500',
  },
  selectedValue: {
    fontSize: 17,
    color: '#8E8E93',
    marginRight: 8,
  },
  separator: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#545458',
    marginLeft: 56,
  },
});

export default EventDetailsModal;
