import * as AdMob from 'expo-ads-admob';

import { AdType, initialState } from '../../redux/reducers/settingsReducer';
import { AdUnit, getAdId } from '../../utils/ads';
import React, { useEffect, useState } from 'react';

import { updateSetting } from '../../redux/actions';
import { useAppDispatch } from '../../redux/store';
import { useSetting } from '../../redux/selectors';

//                   ms     s <- m <- h <- d <- 14 days
const AD_RESET_DELAY_MS = 1000 * 60 * 60 * 24 * 14;

const PotentialAd = ({ unit }: { unit: AdUnit }) => {
  const dispatch = useAppDispatch();
  const adSetting = useSetting('ads');
  const adLastReset = useSetting('adLastReset');
  const [showAd, setShowAd] = useState(AdType.Off !== adSetting);
  const [showPersonalized, setShowPersonalized] = useState(false);

  useEffect(() => {
    const now = Date.now();
    if (adSetting === AdType.Off && now - adLastReset > AD_RESET_DELAY_MS) {
      dispatch(updateSetting({ ads: initialState.ads }));
    }
  }, [adLastReset, adSetting, dispatch]);

  useEffect(() => {
    setShowAd(AdType.Off !== adSetting);
  }, [adSetting]);

  useEffect(() => {
    if (showAd) {
      AdMob.getPermissionsAsync().then(async (resp) => {
        if (resp.status === AdMob.PermissionStatus.GRANTED) {
          setShowPersonalized(true);
        } else if (resp.status === AdMob.PermissionStatus.UNDETERMINED) {
          resp = await AdMob.requestPermissionsAsync();
          setShowPersonalized(resp.status === AdMob.PermissionStatus.GRANTED);
        }
      });
    }
  }, [dispatch, showAd]);

  return showAd ? (
    <AdMob.AdMobBanner
      bannerSize={'smartBannerPortrait'}
      adUnitID={getAdId(unit)}
      servePersonalizedAds={showPersonalized}
      onDidFailToReceiveAdWithError={() => setShowAd(false)}
    />
  ) : null;
};

export default PotentialAd;
