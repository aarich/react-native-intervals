import {
  ActParams,
  Action,
  ActionType,
  GoToParams,
  SoundParams,
  WaitParams,
  pAction,
} from '../types';

import { BaseFormEditProps } from '../components/edit/FormEdit';
import FormEditAct from '../components/edit/FormEditAct';
import FormEditGoTo from '../components/edit/FormEditGoTo';
import FormEditSound from '../components/edit/FormEditSound';
import FormEditWait from '../components/edit/FormEditWait';

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
  editComponent: React.FunctionComponent<BaseFormEditProps>;
  getAction: (draftParams: Record<string, string>, index: number) => Action;
  getDetails: (action: pAction<T>) => string;
};

const actActionInfo: ActionInfo<ActionType.act> = {
  type: ActionType.act,
  label: 'Action',
  themeStatus: 'success',
  icon: 'flash-outline',
  editComponent: FormEditAct,
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      time: paramType.int,
      name: paramType.str,
    }) as ActParams;
    return { params, index, type: ActionType.act };
  },
  getDetails: (action) => `${action.params.time} s | ${action.params.name}`,
};

const waitActionInfo: ActionInfo<ActionType.wait> = {
  type: ActionType.wait,
  label: 'Wait',
  themeStatus: 'info',
  icon: 'clock-outline',
  editComponent: FormEditWait,
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      time: paramType.int,
    }) as WaitParams;

    return { params, index, type: ActionType.wait };
  },
  getDetails: (action) => `${action.params.time} s`,
};

const soundActionInfo: ActionInfo<ActionType.sound> = {
  type: ActionType.sound,
  label: 'Sound',
  themeStatus: 'danger',
  icon: 'bell-outline',
  editComponent: FormEditSound,
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      time: paramType.int,
      soundType: paramType.str,
    }) as SoundParams;

    return { params, index, type: ActionType.sound };
  },
  getDetails: (action) =>
    `${action.params.time} s | ${action.params.soundType}`,
};

const gotoActionInfo: ActionInfo<ActionType.goTo> = {
  type: ActionType.goTo,
  label: 'Go To',
  themeStatus: 'warning',
  icon: 'corner-right-up-outline',
  editComponent: FormEditGoTo,
  getAction: (draftParams, index) => {
    const params = getCheckedTypes(draftParams, {
      times: paramType.int,
      targetNode: paramType.int,
    }) as GoToParams;

    return { params, index, type: ActionType.goTo };
  },
  getDetails: (action) =>
    `${action.params.targetNode} | ${action.params.times} times`,
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
