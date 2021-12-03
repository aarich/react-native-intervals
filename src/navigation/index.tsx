import * as eva from '@eva-design/eva';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';
import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { default as theme } from '../../assets/theme.json';
import useColorScheme from '../hooks/useColorScheme';
import BottomTabNavigator from './BottomTabNavigator';
import linkingOptions from './LinkingConfiguration';
import { rootNavRef } from './rootNavRef';

export default function Navigation() {
  const colorScheme = useColorScheme();

  return (
    <NavigationContainer
      linking={linkingOptions}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
      ref={rootNavRef}
    >
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider
        {...eva}
        theme={{
          ...(colorScheme === 'dark' ? eva.dark : eva.light),
          ...theme,
        }}
      >
        <BottomTabNavigator />
      </ApplicationProvider>
    </NavigationContainer>
  );
}
