import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { type RouteProp } from '@react-navigation/native';
import { Tabs, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import 'react-native-gesture-handler';
import CustomTabBar from '../../components/CustomTabBar';

type CalendarRouteParams = {
  currentView?: 'calendar' | 'event';
};

type RootTabParamList = {
  index: undefined;
  todo: undefined;
  calendar: CalendarRouteParams;
  search: { q?: string };
};

export default function TabLayout() {
  const navigation = useNavigation();
  const [calendarTabLabel, setCalendarTabLabel] = useState('Calendar');

  useEffect(() => {
    const unsubscribe = navigation.addListener('state', () => {
      const navigationState = navigation.getState();
      if (!navigationState) {
        return; // Or handle this case appropriately, e.g., log an error
      }
      const currentRoute = navigationState.routes[navigationState.index] as RouteProp<RootTabParamList, 'calendar'>;
      if (currentRoute?.name === 'calendar' && currentRoute.params?.currentView) {
        setCalendarTabLabel(currentRoute.params.currentView === 'calendar' ? 'Calendar' : 'Event');
      } else if (currentRoute?.name !== 'calendar') {
        setCalendarTabLabel('Calendar'); // Reset when not on calendar tab
      }
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <Tabs
      tabBar={(props: BottomTabBarProps) => <CustomTabBar {...props} calendarTabLabel={calendarTabLabel} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="home" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="todo"
        options={{
          title: 'To-Do',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="check-all" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="calendar"
        options={{
          title: calendarTabLabel,
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="calendar" color={color} size={size} />
          ),
        }}
      />
      
      <Tabs.Screen
        name="search"
        options={{
          title: 'Search',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="magnify" color={color} size={size} />
          ),
        }}
      />
      
    </Tabs>
  );
}
