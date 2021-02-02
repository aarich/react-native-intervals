import { BottomTabParamList, MoreParamList, TimersParamList } from '../types';
import { Icon, useTheme } from '@ui-kitten/components';
import React, { useEffect } from 'react';

import EditScreen from '../screens/EditScreen';
import LibraryScreen from '../screens/LibraryScreen';
import MoreScreen from '../screens/More/MoreScreen';
import ViewScreen from '../screens/ViewScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { loadTimers } from '../redux/actions/thunks';
import { useAppDispatch } from '../redux/store';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

export default function BottomTabNavigator() {
  const dispatch = useAppDispatch();
  const theme = useTheme();

  // on app load, load existing timers
  useEffect(() => {
    dispatch(loadTimers());

    () => {
      /*TODO SAVE TIMERS*/
    };
  }, [dispatch]);

  return (
    <BottomTab.Navigator
      initialRouteName="Timers"
      tabBarOptions={{ activeTintColor: theme['color-primary-500'] }}
    >
      <BottomTab.Screen
        name="Timers"
        component={TimerNavigator}
        options={{
          tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
            <Icon
              name={`clock${focused ? '' : '-outline'}`}
              fill={color}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
      <BottomTab.Screen
        name="More"
        component={MoreNavigator}
        options={{
          tabBarIcon: ({ color, focused, size }: TabBarIconProps) => (
            <Icon
              name={`more-horizontal${focused ? '' : '-outline'}`}
              fill={color}
              style={{ width: size, height: size }}
            />
          ),
        }}
      />
    </BottomTab.Navigator>
  );
}

const TimersStack = createStackNavigator<TimersParamList>();

function TimerNavigator() {
  return (
    <TimersStack.Navigator>
      <TimersStack.Screen
        name="LibraryScreen"
        component={LibraryScreen}
        options={{ headerTitle: 'Saved Timers' }}
      />
      <TimersStack.Screen name="ViewScreen" component={ViewScreen} />
      <TimersStack.Screen
        name="EditScreen"
        component={EditScreen}
        options={{ headerTitle: 'Edit' }}
      />
    </TimersStack.Navigator>
  );
}

const MoreStack = createStackNavigator<MoreParamList>();

function MoreNavigator() {
  return (
    <MoreStack.Navigator>
      <MoreStack.Screen
        name="MoreScreen"
        component={MoreScreen}
        options={{ headerTitle: 'Tab Two Title' }}
      />
    </MoreStack.Navigator>
  );
}
