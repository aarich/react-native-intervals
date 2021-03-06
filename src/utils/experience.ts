import { Alert, Platform, Share } from 'react-native';
import { getShortenedURL, makeURL, serialize } from './api';

import { Timer } from '../types';

export const getCurrentTimeUnit = (timeIsSeconds: boolean) =>
  timeIsSeconds ? 'seconds' : 'minutes';

export const getCouldBeTimeUnit = (timeIsSeconds: boolean) =>
  getCurrentTimeUnit(!timeIsSeconds);

export const getTimeAsChosenUnitStr = (
  timeInSeconds: number | string | undefined,
  returnUnitIsSeconds: boolean,
  suffix: string
) => {
  const actualSuffix = returnUnitIsSeconds ? '' : suffix;

  if (timeInSeconds === 0 || timeInSeconds === '0') {
    return timeInSeconds + actualSuffix;
  }

  const divider = returnUnitIsSeconds ? 1 : 60;
  const timeAsSecs = timeInSeconds
    ? typeof timeInSeconds === 'number'
      ? Number.parseFloat((timeInSeconds / divider).toFixed(2))
      : Number.parseFloat(
          (Number.parseFloat(timeInSeconds) / divider).toFixed(2)
        )
    : '';
  return timeAsSecs + actualSuffix;
};

export const getTimeAsSeconds = (
  time: string,
  timeIsSeconds: boolean,
  setSuffix: (s: string) => void
) => {
  if (!time) {
    setSuffix('');
    return time;
  }

  if (!timeIsSeconds && time.endsWith('.')) {
    setSuffix('.');
  } else if (!timeIsSeconds && time.endsWith('.0')) {
    setSuffix('.0');
  } else {
    setSuffix('');
  }

  const parsed = Number.parseFloat(time);
  if (isNaN(parsed)) {
    return '';
  }

  const multiplier = timeIsSeconds ? 1 : 60.0;
  return Math.floor(Number.parseFloat(time) * multiplier);
};

export const share = (timer: Timer) => {
  if (!timer) {
    // shouldn't happen
    return;
  }

  const serialized = serialize(timer);
  const actuallyShareUrl = (urlGetter: (str: string) => Promise<string>) => {
    urlGetter(serialized).then((url) => {
      let content;
      if (Platform.OS === 'ios') {
        content = { url };
      } else {
        content = { message: url, title: 'Flow' };
      }
      Share.share(content);
    });
  };

  Alert.alert(
    'Share Flow',
    "Would you like to generate a short link to this flow? To do that we'll store its contents in our url shortener, and anyone with access to the url will be able to view it.",
    [
      {
        text: 'Share Short Link',
        onPress: () => actuallyShareUrl(getShortenedURL),
      },
      { text: 'Try Full URL', onPress: () => actuallyShareUrl(makeURL) },
      { text: 'Cancel', style: 'cancel' },
    ]
  );
};
