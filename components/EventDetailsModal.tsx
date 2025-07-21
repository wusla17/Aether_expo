import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
import { BottomSheetModal, BottomSheetView, BottomSheetModalProvider } from '@gorhom/bottom-sheet';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import moment from 'moment';

/**
 * Defines the structure for event data.
 */
export interface EventData {
  id?: string; // Optional ID for existing events
  title: string;
  startTime: Date;
  endTime: Date;
  participants: string;
  conferencing: string;
  location: string;
  calendar: string;
  reminders: string;
  description: string; // Added description field
}

/**
 * Props for the EventDetailsModal component.
 */
interface EventDetailsModalProps {
  /**
   * Controls the visibility of the bottom sheet modal.
   */
  isVisible: boolean;
  /**
   * Callback function invoked when the modal is dismissed (e.g., by closing or saving).
   */
  onClose: () => void;
  /**
   * The event data to be displayed and edited in the modal. If null, it indicates a new event creation.
   */
  event: EventData | null;
  /**
   * Callback function invoked when an event is saved (either new or updated).
   */
  onSave: (event: EventData) => void;
}

/**
 * A React Native component that serves as a combined interface for viewing and editing event details
 * in a stylish, dark-mode bottom sheet modal. It supports creating new events or modifying existing ones.
 */
const EventDetailsModal: React.FC<EventDetailsModalProps> = ({ isVisible, onClose, event, onSave }) => {
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%', '75%', '95%'], []);

  // State for event details, initialized from props or default values for new events
  const [currentEvent, setCurrentEvent] = useState<EventData>(() => {
    if (event) {
      return { ...event, startTime: new Date(event.startTime), endTime: new Date(event.endTime) };
    } else {
      const now = new Date();
      const defaultStartTime = new Date(now.setMinutes(now.getMinutes() - (now.getMinutes() % 15) + 15));
      const defaultEndTime = new Date(defaultStartTime.getTime() + 30 * 60 * 1000);
      return {
        title: '',
        startTime: defaultStartTime,
        endTime: defaultEndTime,
        participants: '',
        conferencing: 'Google Meet',
        location: 'Remote',
        calendar: 'Personal',
        reminders: '15 min before',
        description: '',
      };
    }
  });

  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState<null | 'start' | 'end'>(null);

  // Effect to manage modal visibility
  useEffect(() => {
    if (isVisible) {
      bottomSheetModalRef.current?.present();
      // Reset currentEvent state when modal becomes visible, to reflect latest prop.event
      setCurrentEvent(() => {
        if (event) {
          return { ...event, startTime: new Date(event.startTime), endTime: new Date(event.endTime) };
        } else {
          const now = new Date();
          const defaultStartTime = new Date(now.setMinutes(now.getMinutes() - (now.getMinutes() % 15) + 15));
          const defaultEndTime = new Date(defaultStartTime.getTime() + 30 * 60 * 1000);
          return {
            title: '',
            startTime: defaultStartTime,
            endTime: defaultEndTime,
            participants: '',
            conferencing: 'Google Meet',
            location: 'Remote',
            calendar: 'Personal',
            reminders: '15 min before',
            description: '',
          };
        }
      });
    } else {
      bottomSheetModalRef.current?.dismiss();
    }
  }, [isVisible, event]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  const handleSave = useCallback(() => {
    if (!currentEvent.title.trim()) {
      Alert.alert('Error', 'Event title cannot be empty.');
      return;
    }
    onSave(currentEvent);
    onClose();
  }, [currentEvent, onSave, onClose]);

  const handleCancel = useCallback(() => {
    onClose();
  }, [onClose]);

  const handleTimeChange = useCallback((event: DateTimePickerEvent, selectedDate?: Date) => {
    setShowTimePicker(null);
    if (selectedDate) {
      setCurrentEvent(prev => {
        if (showTimePicker === 'start') {
          return { ...prev, startTime: selectedDate };
        } else if (showTimePicker === 'end') {
          return { ...prev, endTime: selectedDate };
        }
        return prev;
      });
    }
  }, [showTimePicker]);

  const renderDetailRow = (iconName: keyof typeof MaterialCommunityIcons.glyphMap, label: string, value: string | React.ReactElement, onPress?: () => void) => (
    <TouchableOpacity style={styles.detailRow} onPress={onPress} disabled={!onPress}>
      <MaterialCommunityIcons name={iconName} size={24} color={Colors.labelIcon} style={styles.detailIcon} />
      <View style={styles.detailTextContainer}>
        <Text style={styles.detailLabel}>{label}</Text>
        {typeof value === 'string' ? (
          <Text style={styles.detailValue}>{value}</Text>
        ) : (
          value
        )}
      </View>
      {onPress && <MaterialCommunityIcons name="chevron-right" size={20} color={Colors.labelIcon} />}
    </TouchableOpacity>
  );

  return (
    <BottomSheetModalProvider>
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={styles.bottomSheetBackground}
        handleIndicatorStyle={styles.handleIndicator}
      >
        <BottomSheetView style={styles.contentContainer}>
          <View style={styles.header}>
            {isEditingTitle ? (
              <TextInput
                style={styles.headerTitleInput}
                value={currentEvent.title}
                onChangeText={(text) => setCurrentEvent(prev => ({ ...prev, title: text }))}
                onBlur={() => setIsEditingTitle(false)}
                autoFocus
                placeholder="Add title"
                placeholderTextColor={Colors.labelIcon}
              />
            ) : (
              <TouchableOpacity onPress={() => setIsEditingTitle(true)} style={{ flex: 1 }}>
                <Text style={styles.headerTitle} numberOfLines={1}>{currentEvent.title || "New Event"}</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <MaterialCommunityIcons name="check" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
            <TouchableOpacity onPress={handleCancel} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={Colors.primaryText} />
            </TouchableOpacity>
          </View>

          {renderDetailRow(
            'clock-outline',
            'Time',
            `${moment(currentEvent.startTime).format('h:mm A')} → ${moment(currentEvent.endTime).format('h:mm A')}`,
            () => setShowTimePicker('start')
          )}
          <View style={styles.separator} />

          {renderDetailRow(
            'account-group-outline',
            'Participants',
            currentEvent.participants || 'Add',
            () => Alert.alert('Coming Soon', 'Participant selection will be available soon')
          )}
          <View style={styles.separator} />

          {renderDetailRow(
            'video-outline',
            'Conferencing',
            currentEvent.conferencing,
            () => Alert.alert('Coming Soon', 'Conferencing options will be available soon')
          )}
          <View style={styles.separator} />

          {renderDetailRow(
            'map-marker-outline',
            'Location',
            currentEvent.location,
            () => Alert.alert('Coming Soon', 'Location picker will be available soon')
          )}
          <View style={styles.separator} />

          {renderDetailRow(
            'calendar-blank-outline',
            'Calendar',
            currentEvent.calendar,
            () => Alert.alert('Coming Soon', 'Calendar selection will be available soon')
          )}
          <View style={styles.separator} />

          {renderDetailRow(
            'bell-outline',
            'Reminders',
            currentEvent.reminders,
            () => Alert.alert('Coming Soon', 'Reminder options will be available soon')
          )}
          <View style={styles.separator} />

          {/* Description Field */}
          <View style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Add description"
              placeholderTextColor={Colors.labelIcon}
              multiline
              value={currentEvent.description}
              onChangeText={(text) => setCurrentEvent(prev => ({ ...prev, description: text }))}
            />
          </View>

          {showTimePicker && (
            <DateTimePicker
              testID="dateTimePicker"
              value={showTimePicker === 'start' ? currentEvent.startTime : currentEvent.endTime}
              mode="time"
              is24Hour={false}
              display="default"
              onChange={handleTimeChange}
            />
          )}

        </BottomSheetView>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
};

const Colors = {
  background: '#1C1C1E',
  primaryText: '#FFFFFF',
  labelIcon: '#8E8E93',
  accent: '#007AFF',
  separator: '#3A3A3C',
};

const styles = StyleSheet.create({
  bottomSheetBackground: {
    backgroundColor: Colors.background,
  },
  handleIndicator: {
    backgroundColor: Colors.labelIcon,
  },
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.separator,
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flex: 1,
  },
  headerTitleInput: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.primaryText,
    flex: 1,
    paddingVertical: 0,
  },
  saveButton: {
    padding: 5,
    marginLeft: 10,
  },
  closeButton: {
    padding: 5,
    marginLeft: 10,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
  },
  detailIcon: {
    marginRight: 15,
  },
  detailTextContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: Colors.labelIcon,
    flex: 1,
  },
  detailValue: {
    fontSize: 16,
    color: Colors.primaryText,
    textAlign: 'right',
    flex: 2,
  },
  separator: {
    height: 1,
    backgroundColor: Colors.separator,
    marginVertical: 5,
  },
  descriptionContainer: {
    marginTop: 10,
    marginBottom: 20,
  },
  descriptionInput: {
    color: Colors.primaryText,
    fontSize: 16,
    minHeight: 80,
    textAlignVertical: 'top',
    padding: 10,
    backgroundColor: Colors.separator,
    borderRadius: 8,
  },
});

export default EventDetailsModal;