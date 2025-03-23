import * as Clipboard from 'expo-clipboard';
import Constants from 'expo-constants';
import { openURL } from 'expo-linking';
import { Alert, AlertButton, Platform, Share } from 'react-native';
import { Timer } from '../types';
import { getShortenedURL, serialize } from './api';

export const osAlert = (title: string, message?: string) =>
  Platform.OS === 'web'
    ? alert(title + (message ? `\n\n${message}` : ''))
    : Alert.alert(title, message);

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

  if (Platform.OS === 'web') {
    if (confirm('Copy URL to clipboard?')) {
      getShortenedURL(serialized).then(Clipboard.setString);
    }
  } else {
    getShortenedURL(serialized).then((url) => {
      let content;
      if (Platform.OS === 'ios') {
        content = { url };
      } else {
        content = { message: url, title: 'Flow' };
      }
      Share.share(content);
    });
  }
};

export const openInApp = (timer: Timer) => {
  const serialized = serialize(timer);
  const url = `${Constants.expoConfig?.scheme}://?f=${serialized}`;
  openURL(url);
};

export const osConfirm = (
  message: string,
  onConfirm: VoidFunction,
  nativeConfirm: string,
  nativeConfirmStyle: AlertButton['style'] = 'destructive',
  nativeTitle = 'Are you sure?'
) => {
  if (Platform.OS === 'web') {
    if (confirm(message)) {
      onConfirm();
    }
    return;
  }
  Alert.alert(nativeTitle, message, [
    { text: nativeConfirm, style: nativeConfirmStyle, onPress: onConfirm },
    { text: 'Cancel' },
  ]);
};
