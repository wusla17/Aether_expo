// app/calendar.tsx
import moment from 'moment';
import React, { useEffect, useMemo, useRef, useState } from 'react';

import { Dimensions, GestureResponderEvent, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EventDetailsModal, { EventData } from '../../components/EventDetailsModal';

const HOUR_HEIGHT = 80;

interface Event extends EventData {
    id: string;
    type: 'default' | 'birthday' | 'hospital' | 'meeting' | 'interview' | 'workshop';
    color?: string;
}

const initialEvents: Event[] = [
    { id: '2', title: 'iOS Developer Interview', startTime: moment().hour(10).minute(0).toDate(), endTime: moment().hour(11).minute(30).toDate(), type: 'interview', color: '#4ECDC4', participants: '', conferencing: 'Google Meet', location: 'Remote', calendar: 'Personal', reminders: '15 min before', description: '' },
    { id: '5', title: 'Lunch with Amanda', startTime: moment().hour(12).minute(30).toDate(), endTime: moment().hour(13).minute(30).toDate(), type: 'meeting', color: '#FFB3BA', participants: '', conferencing: 'Google Meet', location: 'Remote', calendar: 'Personal', reminders: '15 min before', description: '' },
    { id: '7', title: 'Product Strategy Meeting', startTime: moment().hour(14).minute(0).toDate(), endTime: moment().hour(15).minute(0).toDate(), type: 'meeting', color: '#FFDFBA', participants: '', conferencing: 'Google Meet', location: 'Remote', calendar: 'Personal', reminders: '15 min before', description: '' },
    { id: '8', title: 'Meeting with Sam', startTime: moment().add(1, 'day').hour(18).minute(0).toDate(), endTime: moment().add(1, 'day').hour(19).minute(0).toDate(), type: 'meeting', color: '#BAFFC9', participants: '', conferencing: 'Google Meet', location: 'Remote', calendar: 'Personal', reminders: '15 min before', description: '' },
];

const CalendarView: React.FC<{
    onEventPress: (event: Event) => void;
    events: Event[];
    onTimeSlotPress: (time: moment.Moment) => void;
    onOpenMonthPicker: () => void;
    onOpenYearPicker: () => void;
}> = ({ onEventPress, events, onTimeSlotPress, onOpenMonthPicker, onOpenYearPicker }) => {
    const insets = useSafeAreaInsets();
    const [selectedDate, setSelectedDate] = useState(moment());
    const dateScrollerRef = useRef<ScrollView>(null);

    const daysInMonth = useMemo(() => {
        const monthStart = selectedDate.clone().startOf('month');
        const days = selectedDate.daysInMonth();
        return Array.from({ length: days }, (_, i) => monthStart.clone().add(i, 'days'));
    }, [selectedDate]);

    const eventsForDay = useMemo(() => {
        return events.filter(event => moment(event.startTime).isSame(selectedDate, 'day'));
    }, [selectedDate, events]);

    useEffect(() => {
        const dayIndex = selectedDate.date() - 1;
        const itemWidth = 60;
        const scrollPosition = dayIndex * itemWidth - (Dimensions.get('window').width / 2) + (itemWidth / 2);
        dateScrollerRef.current?.scrollTo({ x: scrollPosition, animated: true });
    }, [selectedDate]);

    const handleTimeSlotPress = (event: GestureResponderEvent) => {
        const { locationY } = event.nativeEvent;
        const hour = Math.floor(locationY / HOUR_HEIGHT);
        const minute = Math.round(((locationY % HOUR_HEIGHT) / HOUR_HEIGHT) * 60);
        const newEventTime = selectedDate.clone().hour(hour).minute(minute).second(0).millisecond(0);
        onTimeSlotPress(newEventTime);
    };

    const renderEvent = (event: Event) => {
        const startMinutes = event.startTime.getHours() * 60 + event.startTime.getMinutes();
        const endMinutes = event.endTime.getHours() * 60 + event.endTime.getMinutes();
        const duration = endMinutes - startMinutes;
        const top = (startMinutes / 60) * HOUR_HEIGHT;
        const height = (duration / 60) * HOUR_HEIGHT;

        return (
            <TouchableOpacity
                key={event.id}
                style={[styles.eventCard, { top, height: Math.max(height - 2, 40), backgroundColor: (event.color || '#007AFF') + '30', borderLeftColor: event.color }]}
                onPress={() => onEventPress(event)}
            >
                <Text style={styles.eventTitle}>{event.title}</Text>
                <Text style={styles.eventTime}>{moment(event.startTime).format('HH:mm')} - {moment(event.endTime).format('HH:mm')}</Text>
            </TouchableOpacity>
        );
    };

    return (
        <View style={[styles.container, { paddingTop: insets.top }]}>
            <View style={styles.header}>
                <TouchableOpacity onPress={onOpenMonthPicker}><Text style={styles.headerMonth}>{selectedDate.format('MMMM')}</Text></TouchableOpacity>
                <TouchableOpacity onPress={onOpenYearPicker}><Text style={styles.headerYear}>{selectedDate.format('YYYY')}</Text></TouchableOpacity>
            </View>

            <View style={styles.dateScrollerContainer}>
                <ScrollView ref={dateScrollerRef} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.dateScrollerContent}>
                    {daysInMonth.map((day) => {
                        const isToday = day.isSame(moment(), 'day');
                        const isSelected = day.isSame(selectedDate, 'day');
                        return (
                            <TouchableOpacity key={day.format('YYYY-MM-DD')} style={styles.dayHeader} onPress={() => setSelectedDate(day)}>
                                <Text style={[styles.dayHeaderText, isSelected && styles.selectedDayText]}>{day.format('ddd')}</Text>
                                <View style={[styles.dayNumberContainer, isSelected && styles.selectedDayCircle]}>
                                    <Text style={[styles.dayNumberText, isToday && !isSelected && styles.todayText, isSelected && styles.selectedDayText]}>{day.format('D')}</Text>
                                </View>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            </View>

            <ScrollView style={styles.scrollView}>
                <TouchableOpacity style={styles.gridContainer} onPress={handleTimeSlotPress}>
                    <View style={styles.timeAxisContainer}>
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                            <View key={hour} style={[styles.timeAxisHour, { height: HOUR_HEIGHT }]}>
                                <Text style={styles.timeText}>{moment().hour(hour).format('HH:mm')}</Text>
                            </View>
                        ))}</View>
                    <View style={styles.contentArea}>
                        {Array.from({ length: 24 }, (_, i) => i).map((hour) => (
                            <View key={`line-${hour}`} style={[styles.hourLine, { top: hour * HOUR_HEIGHT }]} />
                        ))}
                        {eventsForDay.map(renderEvent)}
                    </View>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

const CalendarScreen = () => {
    const [events, setEvents] = useState<Event[]>(initialEvents);
    const [isEventModalVisible, setIsEventModalVisible] = useState(false);
    const [eventToEdit, setEventToEdit] = useState<EventData | null>(null);

    const handleEventPress = (event: Event) => {
        setEventToEdit(event);
        setIsEventModalVisible(true);
    };

    const handleTimeSlotPress = (time: moment.Moment) => {
        setEventToEdit({
            title: '',
            startTime: time.toDate(),
            endTime: time.clone().add(30, 'minutes').toDate(),
            participants: '',
            conferencing: 'Google Meet',
            location: 'Remote',
            calendar: 'Personal',
            reminders: '15 min before',
            description: '',
        });
        setIsEventModalVisible(true);
    };

    const handleSaveEvent = (savedEvent: EventData) => {
        if (savedEvent.id) {
            setEvents(prevEvents => prevEvents.map(e => e.id === savedEvent.id ? { ...e, ...savedEvent, type: e.type, color: e.color } : e));
        } else {
            setEvents(prevEvents => [...prevEvents, { ...savedEvent, id: Date.now().toString(), type: 'default', color: '#007AFF' }]);
        }
        setIsEventModalVisible(false);
        setEventToEdit(null);
    };

    const handleCloseModal = () => {
        setIsEventModalVisible(false);
        setEventToEdit(null);
    };

    const handleOpenMonthPicker = () => {
        // Logic to open month picker, possibly a separate modal or component
        // For now, we'll just open the EventDetailsModal with a default event
        setEventToEdit({
            title: 'Select Month',
            startTime: moment().toDate(),
            endTime: moment().add(1, 'hour').toDate(),
            participants: '',
            conferencing: '',
            location: '',
            calendar: '',
            reminders: '',
            description: '',
        });
        setIsEventModalVisible(true);
    };

    const handleOpenYearPicker = () => {
        // Logic to open year picker, possibly a separate modal or component
        // For now, we'll just open the EventDetailsModal with a default event
        setEventToEdit({
            title: 'Select Year',
            startTime: moment().toDate(),
            endTime: moment().add(1, 'hour').toDate(),
            participants: '',
            conferencing: '',
            location: '',
            calendar: '',
            reminders: '',
            description: '',
        });
        setIsEventModalVisible(true);
    };

    return (
        <View style={styles.container}>
            <CalendarView 
                onEventPress={handleEventPress} 
                events={events} 
                onTimeSlotPress={handleTimeSlotPress}
                onOpenMonthPicker={handleOpenMonthPicker}
                onOpenYearPicker={handleOpenYearPicker}
            />
            <EventDetailsModal
                isVisible={isEventModalVisible}
                event={eventToEdit}
                onClose={handleCloseModal}
                onSave={handleSaveEvent}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#1C1C1E' },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12 },
    headerMonth: { fontSize: 24, fontWeight: 'bold', color: '#FFFFFF' },
    headerYear: { fontSize: 24, fontWeight: '300', color: '#8E8E93', marginLeft: 8 },
    dateScrollerContainer: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#2C2C2E' },
    dateScrollerContent: { paddingHorizontal: 16 },
    dayHeader: { alignItems: 'center', justifyContent: 'center', width: 60 },
    dayHeaderText: { fontSize: 13, color: '#8E8E93', marginBottom: 8, fontWeight: '500', textTransform: 'uppercase' },
    dayNumberContainer: { width: 36, height: 36, borderRadius: 10, alignItems: 'center', justifyContent: 'center' },
    dayNumberText: { fontSize: 16, fontWeight: '600', color: '#FFFFFF' },
    selectedDayCircle: { backgroundColor: '#FF3B30', borderRadius: 10 },
    selectedDayText: { color: '#FFFFFF', fontWeight: 'bold' },
    todayText: { color: '#FF3B30', fontWeight: 'bold' },
    scrollView: { flex: 1 },
    gridContainer: { flexDirection: 'row', minHeight: 24 * HOUR_HEIGHT },
    timeAxisContainer: { width: 70, paddingLeft: 8 },
    timeAxisHour: { justifyContent: 'flex-start', paddingTop: 4 },
    timeText: { fontSize: 12, color: '#8E8E93' },
    contentArea: { flex: 1, position: 'relative', borderLeftWidth: 1, borderLeftColor: '#2C2C2E' },
    hourLine: { position: 'absolute', left: 0, right: 0, height: 1, backgroundColor: '#2C2C2E' },
    eventCard: { position: 'absolute', left: 8, right: 8, borderRadius: 12, padding: 12, justifyContent: 'flex-start', borderLeftWidth: 5 },
    eventTitle: { fontSize: 15, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 4 },
    eventTime: { fontSize: 13, color: '#EAEAEA' },
    modalBackdrop: { flex: 1, justifyContent: 'flex-start', alignItems: 'center' },
    modalContainer: { width: '90%', maxHeight: '50%', marginTop: 120, borderRadius: 20, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(255, 255, 255, 0.2)' },
    modalItem: { paddingVertical: 18, paddingHorizontal: 24, alignItems: 'center' },
    modalItemText: { color: '#FFFFFF', fontSize: 18, fontWeight: '500' },
    eventDetailsContainer: { flex: 1, backgroundColor: '#1C1C1E' },
    eventDetailsHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#2C2C2E' },
    eventDetailsTitle: { fontSize: 20, fontWeight: '600', color: '#FFFFFF', flex: 1, textAlign: 'center', marginHorizontal: 10 },
    backButton: { padding: 8 },
    editButton: { padding: 8 },
});

export default CalendarScreen;