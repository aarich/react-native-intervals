import { useCallback, useRef, useState } from 'react';
export const MS_INTERVAL = 200;

export type TimerActions = {
  handleStart: () => void;
  handlePause: (msSinceLastTick: number) => void;
  handleResume: () => number;
  handleReset: () => void;
};

export const useTimer = (): { timer: number } & TimerActions => {
  const [timer, setTimer] = useState(0);
  const [danglingPausedMs, setDanglingPausedMs] = useState(0);
  const countRef = useRef<NodeJS.Timeout>();

  const handleStart = useCallback(() => {
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, MS_INTERVAL);
    setDanglingPausedMs(0);
  }, []);

  const handlePause = useCallback((msSinceLastTick: number) => {
    countRef.current && clearInterval(countRef.current);
    setDanglingPausedMs(msSinceLastTick);
  }, []);

  const handleResume = useCallback(() => {
    countRef.current = setInterval(() => {
      setTimer((timer) => timer + 1);
    }, MS_INTERVAL);
    return danglingPausedMs;
  }, [danglingPausedMs]);

  const handleReset = useCallback(() => {
    countRef.current && clearInterval(countRef.current);
    setTimer(0);
  }, []);

  return {
    timer,
    handleStart,
    handlePause,
    handleResume,
    handleReset,
  };
};
