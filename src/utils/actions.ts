import {
  ActParams,
  ActionType,
  GoToParams,
  ParameterizedAction,
  SoundParams,
  WaitParams,
} from '../types';

import { AUDIO_FILES } from './audio';

const getFancyTimeName = (s: number) => {
  const portions: string[] = [];
  const sInHour = 60 * 60;
  const h = Math.trunc(s / sInHour);
  if (h > 0) {
    portions.push(h + ' hour' + (h > 1 ? 's' : ''));
    s = s - h * sInHour;
  }

  const sInMinute = 60;
  const m = Math.trunc(s / sInMinute);
  if (m > 0) {
    portions.push(m + ' minute' + (m > 1 ? 's' : ''));
    s = s - m * sInMinute;
  }

  if (s > 0) {
    portions.push(s + ' second' + (s > 1 ? 's' : ''));
  }

  return portions.join(', ');
};

const verifyNonEmptyString = (val: string, varName: string, step: number) => {
  if (val.length === 0) {
    throw new Error(`Step ${step} is missing ${varName}.`);
  }
};

const verifyPositiveNumber = (val: number, varName: string, step: number) => {
  if (val < 1) {
    throw new Error(
      `Step ${step} has invalid ${varName} (${val}). It has to be a positive number.`
    );
  }
};

export const getActionTypes = () => {
  const ret: ActionType[] = [];
  for (const action in ActionType) {
    ret.push(ActionType[action as keyof typeof ActionType]);
  }
  return ret;
};

type ActionInfo<T extends ActionType> = {
  type: T;
  label: string;
  themeStatus: string;
  icon: string;
  getAction: (
    draftParams: Record<string, string>,
    index: number
  ) => ParameterizedAction<T>;
  getDetails: (action: ParameterizedAction<T>) => string;
  validate: (action: ParameterizedAction<T>, step: number) => void;
};

const validateDefault = (
  action: { params: { name?: string; time: number } },
  step: number
) => {
  const params = action.params;
  if (params.name) {
    verifyNonEmptyString(params.name, 'Name', step);
  }
  verifyPositiveNumber(params.time, 'Time', step);
};

const actActionInfo: ActionInfo<ActionType.act> = {
  type: ActionType.act,
  label: 'Action',
  themeStatus: 'success',
  icon: 'flash-outline',
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      time: paramType.int,
      name: paramType.str,
    }) as ActParams;
    return { params, index, type: ActionType.act };
  },
  getDetails: (action) =>
    `${getFancyTimeName(action.params.time)} | ${action.params.name}`,
  validate: validateDefault,
};

const waitActionInfo: ActionInfo<ActionType.wait> = {
  type: ActionType.wait,
  label: 'Wait',
  themeStatus: 'info',
  icon: 'clock-outline',
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      time: paramType.int,
    }) as WaitParams;

    return { params, index, type: ActionType.wait };
  },
  getDetails: (action) => `Wait ${getFancyTimeName(action.params.time)}`,
  validate: validateDefault,
};

const soundActionInfo: ActionInfo<ActionType.sound> = {
  type: ActionType.sound,
  label: 'Sound',
  themeStatus: 'danger',
  icon: 'bell-outline',
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      time: paramType.int,
      sound: paramType.int,
    }) as SoundParams;

    return { params, index, type: ActionType.sound };
  },
  getDetails: (action) =>
    `Play ${AUDIO_FILES[action.params.sound].name} for ${getFancyTimeName(
      action.params.time
    )}`,
  validate: validateDefault,
};

const gotoActionInfo: ActionInfo<ActionType.goTo> = {
  type: ActionType.goTo,
  label: 'Go To',
  themeStatus: 'warning',
  icon: 'corner-right-up-outline',
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      times: paramType.int,
      targetNode: paramType.int,
    }) as GoToParams;

    return { params, index, type: ActionType.goTo };
  },
  getDetails: (action) =>
    `Return to step ${action.params.targetNode + 1}${
      action.params.times === 1
        ? ' once'
        : `. These steps repeat ${action.params.times} times`
    }`,
  validate: (action, step) => {
    const params = action.params;
    verifyPositiveNumber(params.times, 'Repetitions', step);
  },
};

enum paramType {
  str,
  int,
}
const getCheckedTypes = (
  actual: Record<string, string>,
  expected: Record<string, paramType>
) => {
  const expectedVars = Object.keys(expected);
  const returnVal: Record<string, string | number> = {};
  expectedVars.forEach((varName) => {
    if (!Object.keys(actual).includes(varName)) {
      throw new Error('Please specify ' + varName);
    }
    const val = actual[varName];
    if (expected[varName] === paramType.str) {
      if (!val || val.length === 0) {
        throw new Error('Please specify ' + varName);
      }
      returnVal[varName] = val;
    } else if (expected[varName] === paramType.int) {
      if (typeof val === 'undefined') {
        throw new Error('Please Specify ' + varName);
      }

      try {
        const n = Number.parseInt(val);
        if (isNaN(n)) {
          throw new Error('Must be a number: ' + varName);
        }
        returnVal[varName] = n;
      } catch (e) {
        throw new Error('Must be a number: ' + varName);
      }
    }
  });

  return returnVal;
};

export const getActionInfo = <T extends ActionType>(
  actionType: T
): ActionInfo<T> => {
  const ret = [
    actActionInfo,
    waitActionInfo,
    soundActionInfo,
    gotoActionInfo,
  ].find((info) => info.type === actionType);
  if (!ret) {
    throw new Error('No type found');
  }
  //@ts-ignore
  return ret;
};
