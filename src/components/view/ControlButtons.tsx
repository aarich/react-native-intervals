import { Button, ButtonGroup, Icon } from '@ui-kitten/components';
import { View } from 'react-native';

type Props = {
  showStart: boolean;
  showPause: boolean;
  showResume: boolean;
  showReset: boolean;
  showSkip: boolean;
  onStart: VoidFunction;
  onPause: VoidFunction;
  onResume: VoidFunction;
  onReset: VoidFunction;
  onSkip: VoidFunction;
};

const makeButton = (title: string, icon: string, onPress: () => void) => (
  <Button
    key={title}
    onPress={onPress}
    accessoryLeft={(props) => <Icon {...props} name={icon} />}>
    {title}
  </Button>
);

const ControlButtons = ({
  showStart,
  showPause,
  showResume,
  showReset,
  showSkip,
  onStart,
  onPause,
  onResume,
  onReset,
  onSkip,
}: Props) => {
  const buttons = [];
  if (showStart) {
    buttons.push(makeButton('Start', 'play-circle-outline', onStart));
  }
  if (showPause) {
    buttons.push(makeButton('Pause', 'pause-circle-outline', onPause));
  }
  if (showResume) {
    buttons.push(makeButton('Resume', 'play-circle-outline', onResume));
  }
  if (showReset) {
    buttons.push(makeButton('Reset', 'refresh-outline', onReset));
  }
  if (showSkip) {
    buttons.push(makeButton('Skip', 'skip-forward-outline', onSkip));
  }
  return (
    <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
      <ButtonGroup appearance="outline">{buttons}</ButtonGroup>
    </View>
  );
};

export default ControlButtons;
