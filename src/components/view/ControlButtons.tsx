import { Button, ButtonGroup, Icon } from '@ui-kitten/components';

import Executor from '../../utils/execution/Executor';
import React from 'react';
import { View } from 'react-native';

type Props = {
  executor: Executor;
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
const ControlButtons = ({ executor }: Props) => {
  const { showStart, showPause, showResume, showReset } = executor;
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <ButtonGroup appearance="outline">
        {makeButtonIf(showStart, 'Start', 'play-circle-outline', () =>
          executor.start()
        )}
        {makeButtonIf(showPause, 'Pause', 'pause-circle-outline', () =>
          executor.pause()
        )}
        {makeButtonIf(showResume, 'Resume', 'play-circle-outline', () =>
          executor.resume()
        )}
        {makeButtonIf(showReset, 'Reset', 'refresh-outline', () =>
          executor.reset()
        )}
      </ButtonGroup>
    </View>
  );
};

export default ControlButtons;
