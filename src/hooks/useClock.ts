import { useRef, useState } from 'react';
const MS_INTERVAL = 1000;

export const useMsClock = () => {
  const [timer, setTimer] = useState(0);
  const countRef = useRef<NodeJS.Timeout>();

  const startTimer = () => {
    countRef.current = setInterval(() => {
      setTimer((ms) => ms + MS_INTERVAL);
    }, MS_INTERVAL);
  };

  const clearTimer = () => {
    countRef.current && clearInterval(countRef.current);
  };

  return { timer, startTimer, clearTimer, interval: MS_INTERVAL };
};
