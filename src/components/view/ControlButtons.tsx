import { Button, ButtonGroup, Icon } from '@ui-kitten/components';

import Executor from '../../utils/execution/Executor';
import React from 'react';
import { View } from 'react-native';

type Props = {
  executor: Executor;
  timerActions: {
    handleStart: () => void;
    handlePause: () => void;
    handleResume: () => void;
    handleReset: () => void;
  };
};

const makeButtonIf = (
  cond: boolean,
  title: string,
  icon: string,
  onPress: () => void
) =>
  cond ? (
    <Button
      onPress={onPress}
      accessoryLeft={(props) => <Icon {...props} name={icon} />}
    >
      {title}
    </Button>
  ) : (
    <></>
  );
const ControlButtons = ({ executor, timerActions }: Props) => {
  const { showStart, showPause, showResume, showReset } = executor;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <ButtonGroup appearance="outline">
        {makeButtonIf(showStart, 'Start', 'play-circle-outline', () => {
          timerActions.handleStart();
          executor.start();
        })}
        {makeButtonIf(showPause, 'Pause', 'pause-circle-outline', () => {
          timerActions.handlePause();
          executor.pause();
        })}
        {makeButtonIf(showResume, 'Resume', 'play-circle-outline', () => {
          timerActions.handleResume();
          executor.resume();
        })}
        {makeButtonIf(showReset, 'Reset', 'refresh-outline', () => {
          timerActions.handleReset();
          executor.reset();
        })}
      </ButtonGroup>
    </View>
  );
};

export default ControlButtons;
