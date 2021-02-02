import { Action, ActionType } from '../../types';

import React from 'react';
import { getActionInfo } from '../../utils/actions';

type Props = {
  type: ActionType;
} & BaseFormEditProps;

export type BaseFormEditProps = {
  params: Record<string, string>;
  setParams: (newParams: Record<string, string>) => void;
  existingActions: Action[];
  insertIndex: number;
};

const FormEdit = ({
  type,
  params,
  setParams,
  existingActions,
  insertIndex,
}: Props) => {
  const EditComponent = getActionInfo(type).editComponent;
  return (
    <EditComponent {...{ params, setParams, existingActions, insertIndex }} />
  );
};

export default FormEdit;
