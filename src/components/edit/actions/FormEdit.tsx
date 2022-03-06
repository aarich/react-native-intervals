import { Accelerometer } from 'expo-sensors';
import { useCallback, useEffect, useState } from 'react';
import { Action, ActionType } from '../../../types';
import FormEditAct from './FormEditAct';
import FormEditGoTo from './FormEditGoTo';
import FormEditPause from './FormEditPause';
import FormEditSound from './FormEditSound';
import FormEditWait from './FormEditWait';

type Props = {
  type: ActionType;
} & CommonProps;

type CommonProps = {
  params: Record<string, string | number>;
  setParams: (
    newParams:
      | Record<string, string | number>
      | ((
          old: Record<string, string | number>
        ) => Record<string, string | number>)
  ) => void;
  existingActions: Action[];
  insertIndex: number;
};

export type BaseFormEditProps = {
  timeUnitIsSeconds: boolean;
} & CommonProps;

const comps = {
  [ActionType.act]: FormEditAct,
  [ActionType.goTo]: FormEditGoTo,
  [ActionType.wait]: FormEditWait,
  [ActionType.sound]: FormEditSound,
  [ActionType.pause]: FormEditPause,
};

const THREHSOlD = 80;

const addListener = (handler: () => void) => {
  let lastX: number, lastY: number, lastZ: number;
  let lastUpdate = 0;
  Accelerometer.addListener((data) => {
    const { x, y, z } = data;
    const now = Date.now();
    if (now - lastUpdate > 100) {
      const diffTime = now - lastUpdate;
      lastUpdate = now;

      const speedX = (Math.abs(x - lastX) / diffTime) * 10000;
      const speedY = (Math.abs(y - lastY) / diffTime) * 10000;
      const speedZ = (Math.abs(z - lastZ) / diffTime) * 10000;
      const speed = speedX + speedY + speedZ;

      if (speed > THREHSOlD) {
        handler();
      }
      lastX = x;
      lastY = y;
      lastZ = z;
    }
  });
};

const FormEdit = ({
  type,
  params,
  setParams,
  existingActions,
  insertIndex,
}: Props) => {
  const EditComponent = comps[type];
  const [timeUnitIsSeconds, setTimeUnitIsSeconds] = useState(true);
  const [timeToStopShaking, setTimeToStopShaking] = useState(0);

  const deviceOnTheMoveCallback = useCallback(() => {
    if (timeToStopShaking < Date.now()) {
      setTimeUnitIsSeconds((tuis) => !tuis);
    }

    setTimeToStopShaking(Date.now() + 1500);
  }, [timeToStopShaking]);

  useEffect(() => {
    addListener(deviceOnTheMoveCallback);
    return () => Accelerometer.removeAllListeners();
  }, [deviceOnTheMoveCallback]);

  const props = {
    params,
    setParams,
    existingActions,
    insertIndex,
    timeUnitIsSeconds,
  };

  return <EditComponent {...props} />;
};

export default FormEdit;
