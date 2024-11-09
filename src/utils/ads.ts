import { Alert, Platform } from 'react-native';
import {
  TestIds,
  RewardedAd,
  RewardedAdEventType,
  AdEventType,
} from 'react-native-google-mobile-ads';
import { AdUnitIds, RewardedInterOp } from '../types';
import { useCallback, useEffect, useState } from 'react';

export const AdUnit = {
  library: {
    ios: 'ca-app-pub-6949812709353975/3809314504',
    android: 'ca-app-pub-6949812709353975/7720639350',
    test: TestIds.BANNER,
  },
  settings: {
    ios: 'ca-app-pub-6949812709353975/2778663235',
    android: 'ca-app-pub-6949812709353975/5966269595',
    test: TestIds.BANNER,
  },
  settings_rewarded: {
    ios: 'ca-app-pub-6949812709353975/6055196556',
    android: 'ca-app-pub-6949812709353975/8845011424',
    test: TestIds.REWARDED,
  },
};

export const getAdId = (unit: AdUnitIds): string => {
  if (__DEV__) {
    return unit.test;
  }
  return Platform.select(unit) as string;
};

const rewarded = RewardedAd.createForAdRequest(
  getAdId(AdUnit.settings_rewarded)
);

export const useSettingsRewardedAd = (): RewardedInterOp => {
  const [hasShownInfo, setHasShownInfo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = rewarded.addAdEventListener(
      RewardedAdEventType.LOADED,
      () => {
        return setIsLoaded(true);
      }
    );
    const unsubscribeEarned = rewarded.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        Alert.alert('Thank you for your support!');
        rewarded.load();
        setIsLoaded(false);
      }
    );

    rewarded.load();

    return () => {
      unsubscribeEarned();
      unsubscribeLoaded();
    };
  }, []);

  const show = useCallback(() => {
    if (hasShownInfo) {
      rewarded.show();
    } else {
      Alert.alert(
        'Support the Developer',
        'This is a hobby project. There are, however costs associated with publishing apps. If you like this app, please open this brief ad to support me! Thanks!',
        [
          {
            text: 'Check it out',
            onPress: () => {
              rewarded.show();
              setHasShownInfo(true);
            },
          },
          { text: 'Cancel' },
        ]
      );
    }
  }, [hasShownInfo]);

  return { isLoaded, show };
};
