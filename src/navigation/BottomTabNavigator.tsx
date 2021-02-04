import * as Linking from 'expo-linking';

import { BottomTabParamList, MoreParamList, TimersParamList } from '../types';
import { Icon, useTheme } from '@ui-kitten/components';
import React, { useEffect } from 'react';

import AboutScreen from '../screens/More/AboutScreen';
import { Audio } from 'expo-av';
import EditScreen from '../screens/EditScreen';
import FeedbackScreen from '../screens/More/FeedbackScreen';
import HelpScreen from '../screens/More/HelpScreen';
import LibraryScreen from '../screens/LibraryScreen';
import MoreScreen from '../screens/More/MoreScreen';
import ViewScreen from '../screens/ViewScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { navigateToEdit } from './rootNavRef';

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

type TabBarIconProps = {
  color: string;
  focused: boolean;
  size: number;
};

export default function BottomTabNavigator() {
  const theme = useTheme();

  const handleURL = (url: string) => {
    const parsed = Linking.parse(url);
    if (parsed.queryParams?.f) {
      navigateToEdit(parsed.queryParams.f);
    }
  };

  useEffect(() => {
    Audio.setAudioModeAsync({ playsInSilentModeIOS: true });

    Linking.getInitialURL().then((initialUrl) => {
      initialUrl && handleURL(initialUrl);
    });

    const handleUrlEvent = (e: Linking.EventType) => handleURL(e.url);
    Linking.addEventListener('url', handleUrlEvent);
    return () => Linking.removeEventListener('url', handleUrlEvent);
  }, []);

  return (
    <BottomTab.Navigator
      initialRouteName="Flows"
      tabBarOptions={{
        activeTintColor: theme['color-primary-500'],
        labelPosition: 'below-icon',
      }}
    >
      <BottomTab.Screen
        name="Flows"
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
        options={{ headerTitle: 'Flows' }}
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
        options={{ headerTitle: 'Options' }}
      />
      <MoreStack.Screen
        name="AboutScreen"
        component={AboutScreen}
        options={{ headerTitle: 'About' }}
      />
      <MoreStack.Screen
        name="HelpScreen"
        component={HelpScreen}
        options={{ headerTitle: 'Help' }}
      />
      <MoreStack.Screen
        name="FeedbackScreen"
        component={FeedbackScreen}
        options={{ headerTitle: 'Feedback' }}
      />
    </MoreStack.Navigator>
  );
}
