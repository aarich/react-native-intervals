import { StackNavigationProp } from '@react-navigation/stack';
import { useFocusEffect } from '@react-navigation/native';
import { Divider, Icon, Layout, List, ListItem } from '@ui-kitten/components';
import { useCallback, useMemo, ReactElement, useState } from 'react';
import { Alert, Platform, StyleSheet, View } from 'react-native';
import { useDispatch } from 'react-redux';

import ListItemAds from '../../components/more/ListItemAds';
import ListItemTheme from '../../components/more/ListItemTheme';
import ListItemToggle from '../../components/more/ListItemToggle';
import PotentialAd from '../../components/shared/ads/PotentialAd';
import { resetApp } from '../../redux/actions';
import {
  BooleanSettings,
  SelectSettings,
} from '../../redux/reducers/settingsReducer';
import { MoreParamList } from '../../types';
import { AdUnit, useSupportMeSuggestion } from '../../utils/ads';
import {
  NotificationPermissionState,
  getNotificationPermissionState,
} from '../../utils/background/notifications';
import { openSettings } from 'expo-linking';

type Props = {
  navigation: StackNavigationProp<MoreParamList, 'MoreScreen'>;
};

type ListItemNav = { label: string; destination: keyof MoreParamList };
type ListItemAction = { label: string; subtitle?: string; action: () => void };
type ListItemBooleanSetting = {
  setting: keyof BooleanSettings;
  isBoolean: true;
};
type ListItemSelectSetting = {
  setting: keyof SelectSettings;
  isBoolean: false;
};

const MoreScreen = ({ navigation }: Props) => {
  const dispatch = useDispatch();
  const supportMe = useSupportMeSuggestion();
  const [notificationStatus, setNotificationStatus] =
    useState<NotificationPermissionState>('undetermined');

  const loadNotificationStatus = useCallback(async () => {
    const status = await getNotificationPermissionState();
    setNotificationStatus(status);
  }, []);

  useFocusEffect(
    useCallback(() => {
      void loadNotificationStatus();
    }, [loadNotificationStatus]),
  );

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

  const listItems = useMemo(() => {
    const items: (
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

    const booleans: (keyof BooleanSettings)[] = [
      'countUp',
      'showTotalTime',
      'hideDescription',
      'hideLiveActivity',
    ];
    const selectables: (keyof SelectSettings)[] = [
      ...Platform.select({ web: [], default: ['ads' as const] }),
      'theme',
    ];

    if (supportMe.isLoaded) {
      items.push({ label: '❤️', action: supportMe.show });
    }

    booleans.forEach((setting) => items.push({ setting, isBoolean: true }));
    selectables.forEach((setting) => items.push({ setting, isBoolean: false }));

    if (Platform.OS !== 'web') {
      items.push({
        label: 'Notifications',
        subtitle:
          {
            enabled: 'Enabled',
            disabled: 'Disabled',
            undetermined: 'Not yet decided',
            unavailable: 'Unavailable on web',
          }[notificationStatus] ?? 'Unknown',
        action: openSettings,
      });
    }

    return items;
  }, [notificationStatus, resetAppAlert, supportMe.isLoaded, supportMe.show]);

  const lastNavListItem = listItems.length - 1;

  const renderListItem = (listItem: (typeof listItems)[0], index: number) => {
    if ('setting' in listItem) {
      if (listItem.isBoolean) {
        return <ListItemToggle setting={listItem.setting} />;
      }

      const Comp: () => ReactElement = {
        ads: ListItemAds,
        theme: ListItemTheme,
      }[listItem.setting];

      return <Comp />;
    } else {
      return (
        <>
          <ListItem
            title={listItem.label}
            description={'subtitle' in listItem ? listItem.subtitle : undefined}
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
        renderItem={({ item, index }) => renderListItem(item, index)}
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
