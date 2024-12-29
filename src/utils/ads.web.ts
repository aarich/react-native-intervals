import { useMemo } from 'react';
import { SupportMeSuggestion } from '../types';

export const AdUnit = {
  library: { ios: '', android: '', test: '' },
  settings: { ios: '', android: '', test: '' },
  settings_rewarded: { ios: '', android: '', test: '' },
};

export const getAdId = (): string => {
  throw new Error('getAdId not supported on web');
};

export const useSupportMeSuggestion = (): SupportMeSuggestion =>
  useMemo(
    () => ({
      isLoaded: true,
      show: () => {
        if (
          confirm(
            'Support the Developer\n\nThis is a hobby project. There is, however, a cost to publish apps. If you like, you can buy me a coffee! Thanks.'
          )
        ) {
          window.open('https://ko-fi.com/alexrich', '_blank');
        }
      },
    }),
    []
  );
