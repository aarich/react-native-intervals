import { Card, useTheme } from '@ui-kitten/components';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import { View } from 'react-native';
import useColorScheme from '../../hooks/useColorScheme';
import { useTimer } from '../../hooks/useTimer';
import { useSetting } from '../../redux/selectors';
import { Action } from '../../types';
import {
  cancelIntervalNotifications,
  scheduleIntervalNotifications,
} from '../../utils/background/notifications';
import {
  stopLiveActivity,
  syncLiveActivity,
} from '../../utils/background/liveActivity';
import Executor from '../../utils/execution/Executor';
import ControlButtons from './ControlButtons';
import DoubleTimer from './DoubleTimer';

type Props = {
  timerName: string;
  actions: Action[];
  onActiveNodeChange: (index: number | undefined) => void;
  onLabelOverridesChange: (overrides: (string | undefined)[]) => void;
  onProgressChange: (progress: (number | undefined)[]) => void;
};

const RunControls = ({
  timerName,
  actions,
  onActiveNodeChange,
  onLabelOverridesChange,
  onProgressChange,
}: Props) => {
  const executor = useMemo(
    () => new Executor(actions, onLabelOverridesChange, onProgressChange),
    [actions, onLabelOverridesChange, onProgressChange],
  );

  const showLiveActivity = !useSetting('hideLiveActivity');
  const countUp = useSetting('countUp');
  const theme = useTheme();
  const scheme = useColorScheme();
  const basicColor = `color-basic-${scheme === 'dark' ? '700' : '300'}`;

  const { timer, ...timerActions } = useTimer();
  const doneHandledRef = useRef(false);

  useEffect(() => {
    onActiveNodeChange(executor.currentNodeIndex);
  }, [executor.currentNodeIndex, onActiveNodeChange]);

  useEffect(() => {
    const interval = Date.now() - executor.lastTickTimeMs;
    executor.tick(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  const syncBackgroundState = useCallback(async () => {
    if (executor.status !== 'running') {
      await cancelIntervalNotifications();
      await syncLiveActivity(executor.getLiveStatus(), showLiveActivity);
      return;
    }

    const alerts = executor.getUpcomingAlerts();
    await scheduleIntervalNotifications(timerName, alerts);
    await syncLiveActivity(executor.getLiveStatus(), showLiveActivity);
  }, [executor, timerName, showLiveActivity]);

  useEffect(() => {
    void syncLiveActivity(executor.getLiveStatus(), showLiveActivity);
    if (executor.status === 'done' && !doneHandledRef.current) {
      doneHandledRef.current = true;
      void (async () => {
        await cancelIntervalNotifications();
        await stopLiveActivity();
        timerActions.handleReset();
      })();
      return;
    }
    if (executor.status !== 'done') {
      doneHandledRef.current = false;
    }
  }, [executor, timer, timerActions, showLiveActivity]);

  useEffect(() => {
    onActiveNodeChange(0);
    return () => {
      timerActions.handlePause(Date.now() - executor.lastTickTimeMs);
      cancelIntervalNotifications();
      stopLiveActivity();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handlePauseWrapper = useCallback(async () => {
    timerActions.handlePause(Date.now() - executor.lastTickTimeMs);
    executor.pause();
    await cancelIntervalNotifications();
    await syncLiveActivity(executor.getLiveStatus(), showLiveActivity);
  }, [executor, timerActions, showLiveActivity]);

  const handleStart = useCallback(async () => {
    timerActions.handleStart();
    executor.start();
    await syncBackgroundState();
  }, [executor, syncBackgroundState, timerActions]);

  const handleResume = useCallback(async () => {
    const resumeMs = timerActions.handleResume();
    executor.resume();
    executor.tick(resumeMs);
    await syncBackgroundState();
  }, [executor, syncBackgroundState, timerActions]);

  const handleReset = useCallback(async () => {
    timerActions.handleReset();
    executor.reset();
    await cancelIntervalNotifications();
    await stopLiveActivity();
  }, [executor, timerActions]);

  const handleSkip = useCallback(async () => {
    executor.skipNode();
    await syncBackgroundState();
  }, [executor, syncBackgroundState]);

  return (
    <>
      <View>
        <Card
          style={{
            backgroundColor: theme[basicColor],
            borderColor: theme['color-basic-500'],
          }}>
          <DoubleTimer
            style={{ paddingBottom: 10 }}
            topText={executor.currentElapsed(countUp)}
            bottomText={executor.totalElapsed(countUp)}
          />
          <ControlButtons
            showStart={executor.showStart}
            showPause={executor.showPause}
            showResume={executor.showResume}
            showReset={executor.showReset}
            showSkip={executor.showSkip}
            onStart={handleStart}
            onPause={handlePauseWrapper}
            onResume={handleResume}
            onReset={handleReset}
            onSkip={handleSkip}
          />
        </Card>
      </View>
    </>
  );
};

export default RunControls;
