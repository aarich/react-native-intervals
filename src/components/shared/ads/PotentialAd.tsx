import { useEffect, useState } from 'react';
import { updateSetting } from '../../../redux/actions';
import { AdType, initialState } from '../../../redux/reducers/settingsReducer';
import { useSetting } from '../../../redux/selectors';
import { useAppDispatch } from '../../../redux/store';
import { AdUnit } from '../../../utils/ads';
import Ad from './Ad';

//                   ms     s <- m <- h <- d <- 14 days
const AD_RESET_DELAY_MS = 1000 * 60 * 60 * 24 * 14;

const PotentialAd = ({ unit }: { unit: AdUnit }) => {
  const dispatch = useAppDispatch();
  const adSetting = useSetting('ads');
  const adLastReset = useSetting('adLastReset');
  const [showAd, setShowAd] = useState(AdType.Off !== adSetting);

  useEffect(() => {
    const now = Date.now();
    if (adSetting === AdType.Off && now - adLastReset > AD_RESET_DELAY_MS) {
      dispatch(updateSetting({ ads: initialState.ads }));
    }
  }, [adLastReset, adSetting, dispatch]);

  useEffect(() => {
    setShowAd(AdType.Off !== adSetting);
  }, [adSetting]);

  return showAd ? <Ad unit={unit} onFail={() => setShowAd(false)} /> : null;
};

export default PotentialAd;
