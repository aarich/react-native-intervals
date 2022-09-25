import {
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { useEffect, useState } from 'react';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

import { useAppDispatch } from '../../../redux/store';
import { AdUnit, getAdId } from '../../../utils/ads';

const Ad = ({ unit, onFail }: { unit: AdUnit; onFail: VoidFunction }) => {
  const dispatch = useAppDispatch();
  const [showPersonalized, setShowPersonalized] = useState(false);

  useEffect(() => {
    requestTrackingPermissionsAsync().then(async (resp) => {
      if (resp.status === PermissionStatus.GRANTED) {
        setShowPersonalized(true);
      }
    });
  }, [dispatch]);

  return (
    <BannerAd
      size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
      unitId={getAdId(unit)}
      requestOptions={{ requestNonPersonalizedAdsOnly: !showPersonalized }}
      onAdFailedToLoad={onFail}
    />
  );
};

export default Ad;
