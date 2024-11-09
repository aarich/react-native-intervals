import {
  PermissionStatus,
  requestTrackingPermissionsAsync,
} from 'expo-tracking-transparency';
import { useEffect, useState } from 'react';
import mobileAds, {
  BannerAd,
  BannerAdSize,
  MaxAdContentRating,
} from 'react-native-google-mobile-ads';
import { useDispatch } from 'react-redux';
import { getAdId } from '../../../utils/ads';
import { AdUnitIds } from '../../../types';

mobileAds()
  .setRequestConfiguration({
    maxAdContentRating: MaxAdContentRating.PG,
  })
  .then(() => mobileAds().initialize());

const Ad = ({ unit, onFail }: { unit: AdUnitIds; onFail: VoidFunction }) => {
  const dispatch = useDispatch();
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
