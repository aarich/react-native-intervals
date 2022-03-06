import { Button, ButtonGroup, Icon } from '@ui-kitten/components';
import { View } from 'react-native';
import { TimerActions } from '../../hooks/useTimer';
import Executor from '../../utils/execution/Executor';

type Props = {
  executor: Executor;
  timerActions: Omit<TimerActions, 'handlePause'> & {
    handlePause: VoidFunction;
  };
};

const makeButton = (title: string, icon: string, onPress: () => void) => (
  <Button
    key={title}
    onPress={onPress}
    accessoryLeft={(props) => <Icon {...props} name={icon} />}
  >
    {title}
  </Button>
);

const ControlButtons = ({ executor, timerActions }: Props) => {
  const { showStart, showPause, showResume, showReset, showSkip } = executor;
  const buttons = [];
  if (showStart) {
    buttons.push(
      makeButton('Start', 'play-circle-outline', () => {
        timerActions.handleStart();
        executor.start();
      })
    );
  }
  if (showPause) {
    buttons.push(
      makeButton('Pause', 'pause-circle-outline', () => {
        timerActions.handlePause();
        executor.pause();
      })
    );
  }
  if (showResume) {
    buttons.push(
      makeButton('Resume', 'play-circle-outline', () => {
        const resumeMs = timerActions.handleResume();
        executor.resume();
        executor.tick(resumeMs);
      })
    );
  }
  if (showReset) {
    buttons.push(
      makeButton('Reset', 'refresh-outline', () => {
        timerActions.handleReset();
        executor.reset();
      })
    );
  }
  if (showSkip) {
    buttons.push(
      makeButton('Skip', 'skip-forward-outline', () => {
        executor.skipNode();
      })
    );
  }
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <ButtonGroup appearance="outline">{buttons}</ButtonGroup>
    </View>
  );
};

export default ControlButtons;
