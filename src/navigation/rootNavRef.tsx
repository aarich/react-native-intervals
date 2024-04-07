import { NavigationContainerRef } from '@react-navigation/native';
import { createRef } from 'react';
import { BottomTabParamList } from '../types';

export const rootNavRef = createRef<NavigationContainerRef<BottomTabParamList>>();

export const navigateToEdit = (serializedFlow: string) => {
  rootNavRef.current?.navigate('Flows', {
    screen: 'EditScreen',
    params: { serializedFlow },
  });
};
