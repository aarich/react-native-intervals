import * as AdMob from 'expo-ads-admob';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '../../../redux/store';
import { AdUnit, getAdId } from '../../../utils/ads';

const Ad = ({ unit, onFail }: { unit: AdUnit; onFail: VoidFunction }) => {
  const dispatch = useAppDispatch();
  const [showPersonalized, setShowPersonalized] = useState(false);

  useEffect(() => {
    AdMob.getPermissionsAsync().then(async (resp) => {
      if (resp.status === AdMob.PermissionStatus.GRANTED) {
        setShowPersonalized(true);
      } else if (resp.status === AdMob.PermissionStatus.UNDETERMINED) {
        resp = await AdMob.requestPermissionsAsync();
        setShowPersonalized(resp.status === AdMob.PermissionStatus.GRANTED);
      }
    });
  }, [dispatch]);

  return (
    <AdMob.AdMobBanner
      bannerSize="smartBannerPortrait"
      adUnitID={getAdId(unit)}
      servePersonalizedAds={showPersonalized}
      onDidFailToReceiveAdWithError={onFail}
    />
  );
};

export default Ad;
