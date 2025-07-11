import { MaterialCommunityIcons } from '@expo/vector-icons';
import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import { ComponentProps } from 'react';

export type TabBarIconProps = {
  name: ComponentProps<typeof MaterialCommunityIcons>['name'];
  color: string;
};

export type ScreenOptions = BottomTabNavigationOptions & {
  tabBarIconName?: ComponentProps<typeof MaterialCommunityIcons>['name'];
  tabBarTestID?: string;
};
