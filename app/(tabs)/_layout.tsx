  import CustomTabBar from '@/components/CustomTabBar';
  import { ScreenOptions } from '@/types/navigation';
  import { MaterialCommunityIcons } from '@expo/vector-icons';
  import { Tabs } from 'expo-router';

  export default function TabLayout() {
    return (
      // Adding a comment to force a re-evaluation
      <Tabs
        screenOptions={{
          headerShown: false,
        }}
        tabBar={(props) => <CustomTabBar {...props} descriptors={props.descriptors} />}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: 'Home',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="home" color={color} size={size} />
            ),
            tabBarIconName: 'home',
          } as ScreenOptions}
        />
        <Tabs.Screen
          name="todo"
          options={{
            title: 'Todo',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="check-circle-outline" color={color} size={size} />
            ),
            tabBarIconName: 'check-circle-outline',
          } as ScreenOptions}
        />
        <Tabs.Screen
          name="calendar"
          options={{
            title: 'Calendar',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="calendar-outline" color={color} size={size} />
            ),
            tabBarIconName: 'calendar-outline',
          } as ScreenOptions}
        />
        <Tabs.Screen
          name="search"
          options={{
            title: 'Search',
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="magnify" color={color} size={size} />
            ),
            tabBarIconName: 'magnify',
          } as ScreenOptions}
        />
      </Tabs>
    );
  }
