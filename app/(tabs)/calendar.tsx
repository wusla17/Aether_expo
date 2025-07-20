import { AntDesign } from '@expo/vector-icons';
import moment from 'moment';
import { useEffect, useState } from 'react';
import {
  FlatList,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Calendar } from 'react-native-calendars';

import { Colors } from '../../constants/Colors';

interface CalendarEvent {
  id: string;
  category: string;
  color: string;
  title: string;
  place: string;
  start: string;
  end: string;
  date: string; // Added date property
}

const generateDummyEvents = (): CalendarEvent[] => {
  const today = moment();
  const events: CalendarEvent[] = [];

  for (let i = -5; i <= 5; i++) {
    const date = today.clone().add(i, 'days').format('YYYY-MM-DD');
    const numEvents = Math.floor(Math.random() * 3); // 0-2 events per day

    for (let j = 0; j < numEvents; j++) {
      const startHour = Math.floor(Math.random() * 24);
      const endHour = Math.min(startHour + Math.floor(Math.random() * (24 - startHour)), 24);

      events.push({
        id: `${date}-${j}`,
        category: ['Meeting', 'Work', 'Personal'][Math.floor(Math.random() * 3)],
        color: ['#FFC107', '#03DAC6', '#2196F3'][Math.floor(Math.random() * 3)],
        title: `Event ${j + 1}`,
        place: ['Office', 'Home', 'Coffee Shop'][Math.floor(Math.random() * 3)],
        start: moment({ hour: startHour }).format('HH:mm'),
        end: moment({ hour: endHour }).format('HH:mm'),
        date: date,
      });
    }
  }

  return events;
};

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState(moment().format('YYYY-MM-DD'));
  const [activeView, setActiveView] = useState<'calendar' | 'events'>('calendar');
  const [currentMonthDisplayed, setCurrentMonthDisplayed] = useState(moment().format('YYYY-MM-DD'));
  const [events, setEvents] = useState<CalendarEvent[]>(generateDummyEvents());

  useEffect(() => {
    // You might want to filter events based on the currently displayed month
    // For simplicity, we're displaying all events
  }, [currentMonthDisplayed]);

  const getEventsForDate = (date: string): CalendarEvent[] => {
    return events.filter(event => event.date === date);
  };

  const renderEventItem = ({ item }: { item: CalendarEvent }) => (
    <View style={styles.eventCard}>
      <View style={styles.eventLeft}>
        <Text style={[styles.eventCategory, { backgroundColor: item.color }]}>{item.category}</Text>
      </View>
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <View style={styles.eventMeta}>
          <Text style={styles.eventTime}>
            {item.start} - {item.end}
          </Text>
          <Text style={styles.eventPlace}> · {item.place}</Text>
        </View>
      </View>
    </View>
  );

  const renderEventListWithDates = () => {
    const groupedEvents = events.reduce((acc: { [date: string]: CalendarEvent[] }, event) => {
      if (!acc[event.date]) {
        acc[event.date] = [];
      }
      acc[event.date].push(event);
      return acc;
    }, {});

    const sortedDates = Object.keys(groupedEvents).sort();

    return (
      <FlatList
        data={sortedDates}
        keyExtractor={(item) => item}
        renderItem={({ item: date }) => (
          <View style={styles.dateGroup}>
            <View style={styles.dateHeader}>
              <Text style={styles.dateText}>{moment(date).format('DD Mon')}</Text>
              <View style={styles.verticalLine} />
            </View>
            <FlatList
              data={groupedEvents[date]}
              keyExtractor={(event) => event.id}
              renderItem={renderEventItem}
            />
          </View>
        )}
      />
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.dark.background} />
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setCurrentMonthDisplayed(moment(currentMonthDisplayed).subtract(1, 'month').format('YYYY-MM-DD'))}>
            <AntDesign name="left" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{moment(currentMonthDisplayed).format('MMMM YYYY')}</Text>
          <TouchableOpacity onPress={() => setCurrentMonthDisplayed(moment(currentMonthDisplayed).add(1, 'month').format('YYYY-MM-DD'))}>
            <AntDesign name="right" size={24} color={Colors.dark.text} />
          </TouchableOpacity>
        </View>

        {/* View Toggle */}
        <View style={styles.viewToggle}>
          <TouchableOpacity onPress={() => setActiveView('events')}>
            <Text style={[styles.viewToggleText, activeView === 'events' && styles.viewToggleTextActive]}>EVENTS</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveView('calendar')}>
            <Text style={[styles.viewToggleText, activeView === 'calendar' && styles.viewToggleTextActive]}>CALENDAR</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {activeView === 'calendar' ? (
          <View style={styles.calendarContainer}>
            <Calendar
              current={currentMonthDisplayed}
              onMonthChange={(month) => setCurrentMonthDisplayed(month.dateString)}
              onDayPress={(day) => setSelectedDate(day.dateString)}
              markedDates={{
                [selectedDate]: { selected: true, selectedColor: '#FFC107' },
              }}
              theme={{
                backgroundColor: Colors.dark.background,
                calendarBackground: Colors.dark.background,
                textSectionTitleColor: Colors.dark.icon,
                selectedDayBackgroundColor: '#FFC107',
                selectedDayTextColor: Colors.dark.background,
                todayTextColor: Colors.dark.tint,
                dayTextColor: Colors.dark.text,
                textDisabledColor: Colors.dark.icon,
                arrowColor: Colors.dark.text,
                monthTextColor: Colors.dark.text,
                dotColor: '#FFC107',
              }}
            />
            <Text style={styles.tasksHeader}>Tasks for {moment(selectedDate).format('DD MMMM YYYY')}</Text>
            <FlatList
              data={getEventsForDate(selectedDate)}
              renderItem={renderEventItem}
              keyExtractor={(item) => item.id}
            />
          </View>
        ) : (
          <View style={styles.eventsContainer}>
            {renderEventListWithDates()}
          </View>
        )}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.dark.background,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.dark.background,
    padding: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  viewToggle: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  viewToggleText: {
    fontSize: 16,
    color: Colors.dark.icon,
    fontWeight: 'bold',
  },
  viewToggleTextActive: {
    color: Colors.dark.text,
  },
  calendarContainer: {
    flex: 1,
  },
  eventsContainer: {
    flex: 1,
  },
  tasksHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.dark.text,
    marginTop: 10,
    marginBottom: 5,
  },
  eventCard: {
    flexDirection: 'row',
    backgroundColor: Colors.dark.background,
    borderRadius: 11,
    marginHorizontal: 18,
    marginBottom: 14,
    paddingVertical: 13,
    paddingHorizontal: 13,
    alignItems: 'center',
    elevation: 2,
  },
  eventLeft: { marginRight: 10 },
  eventCategory: {
    fontWeight: 'bold',
    paddingVertical: 3,
    paddingHorizontal: 13,
    fontSize: 13,
    borderRadius: 12,
    color: Colors.dark.text,
    overflow: 'hidden',
  },
  eventInfo: { flex: 1 },
  eventTitle: { color: Colors.dark.text, fontWeight: 'bold', fontSize: 16, marginBottom: 2 },
  eventMeta: { flexDirection: 'row', alignItems: 'center' },
  eventTime: { color: Colors.dark.tint, fontSize: 13, fontWeight: 'bold' },
  eventPlace: { color: Colors.dark.icon, fontSize: 13, marginLeft: 3 },
  dateGroup: {
    flexDirection: 'row',
    marginTop: 10,
    marginBottom: 5,
  },
  dateHeader: {
    width: 80,
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.dark.text,
  },
  verticalLine: {
    width: 1,
    backgroundColor: Colors.dark.icon,
    height: '100%',
    marginLeft: 10,
  },
});

export default CalendarScreen;