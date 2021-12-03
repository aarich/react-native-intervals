import { StackNavigationProp } from '@react-navigation/stack';
import { Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components';
import React, { useCallback } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import ListItemAds from '../../components/more/ListItemAds';
import ListItemTheme from '../../components/more/ListItemTheme';
import ListItemToggle from '../../components/more/ListItemToggle';
import PotentialAd from '../../components/shared/ads/PotentialAd';
import { resetApp } from '../../redux/actions';
import {
  BooleanSettings,
  SelectSettings,
} from '../../redux/reducers/settingsReducer';
import { useAppDispatch } from '../../redux/store';
import { MoreParamList } from '../../types';
import { AdUnit } from '../../utils/ads';

type Props = {
  navigation: StackNavigationProp<MoreParamList, 'MoreScreen'>;
};

type ListItemNav = { label: string; destination: keyof MoreParamList };
type ListItemAction = { label: string; action: () => void };
type ListItemBooleanSetting = {
  setting: keyof BooleanSettings;
  isBoolean: true;
};
type ListItemSelectSetting = {
  setting: keyof SelectSettings;
  isBoolean: false;
};

const MoreScreen = ({ navigation }: Props) => {
  const dispatch = useAppDispatch();

  const resetAppAlert = useCallback(() => {
    const message =
      'This will clear all saved flows. You cannot undo this action';
    const doIt = () => dispatch(resetApp());

    if (Platform.OS === 'web') {
      if (confirm(message)) {
        doIt();
      }
    } else {
      Alert.alert('Are you sure?', message, [
        { text: 'Reset', style: 'destructive', onPress: doIt },
        { text: 'Cancel' },
      ]);
    }
  }, [dispatch]);

  const listItems: (
    | ListItemNav
    | ListItemSelectSetting
    | ListItemAction
    | ListItemBooleanSetting
  )[] = [
    { label: 'Help', destination: 'HelpScreen' },
    { label: 'About', destination: 'AboutScreen' },
    { label: 'Feedback', destination: 'FeedbackScreen' },
    { label: 'Reset', action: resetAppAlert },
  ];
  const lastNavListItem = listItems.length - 1;

  const booleans: (keyof BooleanSettings)[] = [
    'countUp',
    'showTotalTime',
    'hideDescription',
  ];
  const selectables: (keyof SelectSettings)[] =
    Platform.select({
      web: ['ads'],
      default: ['theme', 'ads'],
    }) || [];

  booleans.forEach((setting) => listItems.push({ setting, isBoolean: true }));
  selectables.forEach((setting) =>
    listItems.push({ setting, isBoolean: false })
  );

  const getListItem = (listItem: typeof listItems[0], index: number) => {
    if ('setting' in listItem) {
      if (listItem.isBoolean) {
        return <ListItemToggle setting={listItem.setting} />;
      } else {
        const Comp: () => JSX.Element = {
          ads: ListItemAds,
          theme: ListItemTheme,
        }[listItem.setting];

        return <Comp />;
      }
    } else {
      return (
        <>
          <ListItem
            title={listItem.label}
            onPress={
              'destination' in listItem
                ? () => navigation.push(listItem.destination)
                : listItem.action
            }
            accessoryRight={(props) => (
              <Icon {...props} name="chevron-right-outline" />
            )}
          />
          {index === lastNavListItem ? (
            <View style={{ height: 20 }}></View>
          ) : null}
        </>
      );
    }
  };

  return (
    <Layout style={styles.container}>
      <List
        style={{ flex: 1, width: '100%' }}
        ItemSeparatorComponent={Divider}
        data={listItems}
        keyExtractor={(_, i) => '' + i}
        renderItem={({ item, index }) => getListItem(item, index)}
      />
      <PotentialAd unit={AdUnit.settings} />
    </Layout>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
});

export default MoreScreen;
