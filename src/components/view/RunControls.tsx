import { Card, useTheme } from '@ui-kitten/components';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { AppState, AppStateStatus, Platform, View } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import { MS_INTERVAL, useTimer } from '../../hooks/useTimer';
import { useSetting } from '../../redux/selectors';
import { Action } from '../../types';
import Executor from '../../utils/execution/Executor';
import ControlButtons from './ControlButtons';
import DoubleTimer from './DoubleTimer';

type Props = {
  actions: Action[];
  onActiveNodeChange: (index: number | undefined) => void;
  onLabelOverridesChange: (overrides: (string | undefined)[]) => void;
  onProgressChange: (progress: (number | undefined)[]) => void;
  onRunningStateChange: (isRunning: boolean) => void;
};

const RunControls = ({
  actions,
  onActiveNodeChange,
  onLabelOverridesChange,
  onProgressChange,
  onRunningStateChange,
}: Props) => {
  const executor = useMemo(
    () => new Executor(actions, onLabelOverridesChange, onProgressChange),
    [actions, onLabelOverridesChange, onProgressChange]
  );

  const countUp = useSetting('countUp');
  const theme = useTheme();
  const scheme = useColorScheme();
  const basicColor = `color-basic-${scheme === 'dark' ? '700' : '300'}`;

  const { timer, ...timerActions } = useTimer();
  const appState = useRef(AppState.currentState);
  const [lastActiveTimeMs, setLastActiveTimeMs] = useState<number>();

  useEffect(() => {
    onActiveNodeChange(executor.currentNodeIndex);
  }, [executor.currentNodeIndex, onActiveNodeChange]);

  useEffect(() => {
    if (executor.status === 'running') {
      onRunningStateChange(true);
    } else {
      onRunningStateChange(false);
    }
  }, [executor.status, onRunningStateChange]);

  useEffect(() => {
    const interval = Date.now() - executor.lastTickTimeMs;
    executor.tick(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const handleAppStateChange = useCallback(
    (nextAppState: AppStateStatus) => {
      if (
        executor.status === 'running' &&
        appState.current === 'active' &&
        nextAppState.match(/inactive|background/)
      ) {
        // Only set this if we are going into the background AND the timer is running
        setLastActiveTimeMs(new Date().getTime());
        executor.pause();
        timerActions.handlePause(Date.now() - executor.lastTickTimeMs);
      } else if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active' &&
        lastActiveTimeMs
      ) {
        executor.replaySince(lastActiveTimeMs, MS_INTERVAL);
        setLastActiveTimeMs(undefined);
        if (executor.status !== 'done') {
          executor.resume();
          executor.tick(timerActions.handleResume());
        }
      }

      appState.current = nextAppState;
    },
    [executor, lastActiveTimeMs, timerActions]
  );

  useEffect(() => {
    if (Platform.OS === 'web') {
      return;
    }

    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange
    );
    return () => subscription.remove();
  }, [handleAppStateChange]);

  useEffect(() => {
    onActiveNodeChange(0);
    return () => timerActions.handlePause(Date.now() - executor.lastTickTimeMs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePauseWrapper = useCallback(() => {
    timerActions.handlePause(Date.now() - executor.lastTickTimeMs);
  }, [executor.lastTickTimeMs, timerActions]);

  return (
    <>
      <View>
        <Card
          style={{
            backgroundColor: theme[basicColor],
            borderColor: theme['color-basic-500'],
          }}
        >
          <DoubleTimer
            style={{ paddingBottom: 10 }}
            topText={executor.currentElapsed(countUp)}
            bottomText={executor.totalElapsed(countUp)}
          />
          <ControlButtons
            executor={executor}
            timerActions={{ ...timerActions, handlePause: handlePauseWrapper }}
          />
        </Card>
      </View>
    </>
  );
};

export default RunControls;
