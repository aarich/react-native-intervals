import { Alert, Platform } from 'react-native';
import {
  TestIds,
  AdEventType,
  InterstitialAd,
} from 'react-native-google-mobile-ads';
import { AdUnitIds, SupportMeSuggestion } from '../types';
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
  settings_interstitial: {
    ios: 'ca-app-pub-6949812709353975/2807050832',
    android: 'ca-app-pub-6949812709353975/1009488089',
    test: TestIds.INTERSTITIAL,
  },
};

export const getAdId = (unit: AdUnitIds): string => {
  if (__DEV__) {
    return unit.test;
  }
  return Platform.select(unit) as string;
};

const settingsInterstitial = InterstitialAd.createForAdRequest(
  getAdId(AdUnit.settings_interstitial)
);

export const useSupportMeSuggestion = (): SupportMeSuggestion => {
  const [hasShownInfo, setHasShownInfo] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const unsubscribeLoaded = settingsInterstitial.addAdEventListener(
      AdEventType.LOADED,
      () => setIsLoaded(true)
    );
    const unsubscribeEarned = settingsInterstitial.addAdEventListener(
      AdEventType.CLOSED,
      () => {
        Alert.alert('Thank you for your support!');
        settingsInterstitial.load();
        setIsLoaded(false);
      }
    );

    settingsInterstitial.load();

    return () => {
      unsubscribeEarned();
      unsubscribeLoaded();
    };
  }, []);

  const show = useCallback(() => {
    if (hasShownInfo) {
      settingsInterstitial.show();
    } else {
      Alert.alert(
        'Support the Developer',
        'This is a hobby project. There is, however, a cost to publish apps. If you like this tool, please open this brief ad to support me! Thanks!',
        [
          {
            text: 'Check it out',
            onPress: () => {
              settingsInterstitial.show();
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
