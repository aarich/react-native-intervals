import { Action, ActionType } from '../../../types';

import Executor from '../Executor';
import { msToViewable } from '../../api';

describe('Executor', () => {
  let index: number;
  beforeEach(() => {
    index = 0;
  });

  const wait = (time: number): Action => ({
    index: index++,
    type: ActionType.wait,
    params: { time },
  });

  test('execution', () => {
    const totalTime = (1 + 2) * 1000;
    const nodes = [wait(1), wait(2)];
    const executor = new Executor(nodes, jest.fn(), jest.fn());

    const interval = 500;

    // Haven't started yet, so tick shouldn't matter.
    executor.tick(interval);
    expect(executor.currentNodeIndex).toBe(0);
    expect(executor.currentElapsed(true)).toBe(msToViewable(0));
    expect(executor.currentElapsed(false)).toBe(msToViewable(1000));
    expect(executor.totalElapsed(true)).toBe(msToViewable(0));
    expect(executor.totalElapsed(false)).toBe(msToViewable(totalTime));
    expect(executor.totalElapsedMs).toBe(0);
    expect(executor.showPause).toBeFalsy();
    expect(executor.showReset).toBeFalsy();
    expect(executor.showResume).toBeFalsy();
    expect(executor.showStart).toBeTruthy();
    expect(executor.status).toBe('notstarted');

    // Tick 1
    executor.start();
    executor.tick(interval);
    expect(executor.currentNodeIndex).toBe(0);
    expect(executor.currentElapsed(true)).toBe(msToViewable(interval));
    expect(executor.currentElapsed(false)).toBe(msToViewable(1000 - interval));
    expect(executor.totalElapsed(true)).toBe(msToViewable(interval));
    expect(executor.totalElapsed(false)).toBe(
      msToViewable(totalTime - interval)
    );
    expect(executor.totalElapsedMs).toBe(interval);
    expect(executor.showPause).toBeTruthy();
    expect(executor.showReset).toBeFalsy();
    expect(executor.showResume).toBeFalsy();
    expect(executor.showStart).toBeFalsy();
    expect(executor.status).toBe('running');

    // Tick 2
    executor.tick(interval);
    expect(executor.currentNodeIndex).toBe(1);
    expect(executor.currentElapsed(true)).toBe(msToViewable(0));
    expect(executor.currentElapsed(false)).toBe(msToViewable(2000));
    expect(executor.totalElapsed(true)).toBe(msToViewable(2 * interval));
    expect(executor.totalElapsed(false)).toBe(
      msToViewable(totalTime - 2 * interval)
    );
    expect(executor.totalElapsedMs).toBe(2 * interval);

    // Tick 3/4
    executor.tick(interval);
    executor.tick(interval);
    expect(executor.currentNodeIndex).toBe(1);
    expect(executor.currentElapsed(true)).toBe(msToViewable(2 * interval));
    expect(executor.currentElapsed(false)).toBe(
      msToViewable(2000 - 2 * interval)
    );
    expect(executor.totalElapsedMs).toBe(4 * interval);

    // Tick 5
    executor.tick(interval);
    expect(executor.currentNodeIndex).toBe(1);
    expect(executor.currentElapsed(true)).toBe(msToViewable(3 * interval));
    expect(executor.currentElapsed(false)).toBe(
      msToViewable(2000 - 3 * interval)
    );
    expect(executor.totalElapsedMs).toBe(5 * interval);

    // Tick 6
    executor.tick(interval);
    expect(executor.currentNodeIndex).toBeUndefined();
    expect(executor.currentElapsed(true)).toBe(msToViewable(0));
    expect(executor.currentElapsed(false)).toBe(msToViewable(0));
    expect(executor.totalElapsedMs).toBe(6 * interval);
    expect(executor.status).toBe('done');
    expect(executor.showPause).toBeFalsy();
    expect(executor.showReset).toBeTruthy();
    expect(executor.showResume).toBeFalsy();
    expect(executor.showStart).toBeFalsy();
  });
});
