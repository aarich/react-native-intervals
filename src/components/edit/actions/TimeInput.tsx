import React, { useState } from 'react';
import {
  getCouldBeTimeUnit,
  getCurrentTimeUnit,
  getTimeAsChosenUnitStr,
  getTimeAsSeconds,
} from '../../../utils/experience';

import Input from '../../shared/Input';

type Props = {
  label: string;
  valueInSecs: string | number;
  onChangeValue: (timeInSecs: string | number) => void;
  timeUnitIsSeconds: boolean;
};

const TimeInput = ({
  valueInSecs,
  onChangeValue,
  timeUnitIsSeconds,
  label,
}: Props) => {
  const [suffix, setSuffix] = useState('');
  return (
    <Input
      value={getTimeAsChosenUnitStr(valueInSecs, timeUnitIsSeconds, suffix)}
      label={`${label} (In ${getCurrentTimeUnit(
        timeUnitIsSeconds
      )}. Shake for ${getCouldBeTimeUnit(timeUnitIsSeconds)})`}
      placeholder={`Enter ${getCurrentTimeUnit(timeUnitIsSeconds)}`}
      onChangeText={(str) =>
        onChangeValue(getTimeAsSeconds(str, timeUnitIsSeconds, setSuffix))
      }
      iconRight="hash-outline"
      numeric
    />
  );
};

export default TimeInput;
