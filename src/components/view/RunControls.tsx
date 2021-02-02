import { Card, useTheme } from '@ui-kitten/components';
import React, { useEffect, useMemo } from 'react';

import { Action } from '../../types';
import ControlButtons from './ControlButtons';
import DoubleTimer from './DoubleTimer';
import Executor from '../../utils/execution/Executor';
import useColorScheme from '../../hooks/useColorScheme';
import { useMsClock } from '../../hooks/useClock';

type Props = {
  actions: Action[];
  setActiveNode: (index: number | undefined) => void;
  setLabelOverrides: (overrides: (string | undefined)[]) => void;
  setProgress: (progress: (number | undefined)[]) => void;
};

const RunControls = ({
  actions,
  setActiveNode,
  setLabelOverrides,
  setProgress,
}: Props) => {
  const executor = useMemo(
    () => new Executor(actions, setLabelOverrides, setProgress),
    [actions, setLabelOverrides, setProgress]
  );
  const theme = useTheme();
  const scheme = useColorScheme();
  const basicColor = 'color-basic-' + (scheme === 'dark' ? '700' : '300');

  const { timer, startTimer, clearTimer, interval } = useMsClock();

  useEffect(() => {
    console.log('useEFFECT A');
    setActiveNode(executor.currentNodeIndex);
  }, [executor.currentNodeIndex, setActiveNode]);

  useEffect(() => {
    executor.tick(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timer]);

  // start clock
  useEffect(() => {
    startTimer();
    setActiveNode(0);
    return () => clearTimer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Card
      style={{
        flex: 1,
        backgroundColor: theme[basicColor],
        borderColor: theme['color-basic-500'],
      }}
    >
      <DoubleTimer
        style={{ paddingBottom: 10 }}
        topText={executor.currentElapsed()}
        bottomText={executor.totalElapsed()}
      />
      <ControlButtons executor={executor} />
    </Card>
  );
};

export default RunControls;
