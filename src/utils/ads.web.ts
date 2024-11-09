import { useMemo } from 'react';
import { RewardedInterOp } from '../types';

export const AdUnit = {
  library: { ios: '', android: '', test: '' },
  settings: { ios: '', android: '', test: '' },
  settings_rewarded: { ios: '', android: '', test: '' },
};

export const getAdId = (): string => {
  throw new Error('getAdId not supported on web');
};

export const useSettingsRewardedAd = (): RewardedInterOp =>
  useMemo(() => ({ isLoaded: false, show: () => null }), []);
