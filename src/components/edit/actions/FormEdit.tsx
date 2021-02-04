import { Action, ActionType } from '../../../types';

import FormEditAct from './FormEditAct';
import FormEditGoTo from './FormEditGoTo';
import FormEditSound from './FormEditSound';
import FormEditWait from './FormEditWait';
import React from 'react';

type Props = {
  type: ActionType;
} & BaseFormEditProps;

export type BaseFormEditProps = {
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

const comps = {
  [ActionType.act]: FormEditAct,
  [ActionType.goTo]: FormEditGoTo,
  [ActionType.wait]: FormEditWait,
  [ActionType.sound]: FormEditSound,
};

const FormEdit = ({
  type,
  params,
  setParams,
  existingActions,
  insertIndex,
}: Props) => {
  const EditComponent = comps[type];
  return (
    <EditComponent {...{ params, setParams, existingActions, insertIndex }} />
  );
};

export default FormEdit;
