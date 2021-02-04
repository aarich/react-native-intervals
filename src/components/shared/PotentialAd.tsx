import { AdUnit, getAdId } from '../../utils/ads';

import { AdMobBanner } from 'expo-ads-admob';
import { AdType } from '../../redux/reducers/settingsReducer';
import React from 'react';
import { useSetting } from '../../redux/selectors';

const PotentialAd = ({ unit }: { unit: AdUnit }) => {
  const adSetting = useSetting('ads');

  return adSetting === AdType.Off ? null : (
    <AdMobBanner
      bannerSize="smartBannerPortrait"
      adUnitID={getAdId(unit)}
      servePersonalizedAds={adSetting === AdType.Personal}
      onDidFailToReceiveAdWithError={console.log}
    />
  );
};

export default PotentialAd;
