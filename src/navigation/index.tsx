import * as React from 'react';
import * as eva from '@eva-design/eva';

import { ApplicationProvider, IconRegistry } from '@ui-kitten/components';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
} from '@react-navigation/native';

import BottomTabNavigator from './BottomTabNavigator';
import { ColorSchemeName } from 'react-native';
import { EvaIconsPack } from '@ui-kitten/eva-icons';
import LinkingConfiguration from './LinkingConfiguration';
import { Provider } from 'react-redux';
import store from '../redux/store';
import { default as theme } from '../../assets/theme.json';

export default function Navigation({
  colorScheme,
}: {
  colorScheme: ColorSchemeName;
}) {
  return (
    <NavigationContainer
      linking={LinkingConfiguration}
      theme={colorScheme === 'dark' ? DarkTheme : DefaultTheme}
    >
      <Provider store={store}>
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
      </Provider>
    </NavigationContainer>
  );
}
