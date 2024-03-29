import each from 'jest-each';
import { Action, ActionType, Timer } from '../../types';
import {
  calculateRuntime,
  createNewID,
  deserialize,
  msToViewable,
  serialize,
  validateFlow,
} from '../api';
import { FlowTemplateLibrary } from '../templates';

let index: number;
const WAIT_TIME = 5;
const GOTO_TIMES = 2;

const goto = (targetNode: number): Action => ({
  index: index++,
  type: ActionType.goTo,
  params: { times: GOTO_TIMES, targetNode },
});
const wait = (): Action => ({
  index: index++,
  type: ActionType.wait,
  params: { time: WAIT_TIME },
});
const pause = (): Action => ({
  index: index++,
  type: ActionType.pause,
  params: { name: '' },
});

beforeEach(() => {
  index = 0;
});

describe('calculateRuntime', () => {
  it('Calculates for empty flow', () => {
    expect(calculateRuntime([])).toBe(0);
  });

  const oneloop = (30 + 5 + 15 + 30 + 5 + 15) * 3;
  each([
    [0, 2 * 140 * 5 + 20], // two loops of 140 each 5 times plus 20 at the end
    [1, 60 + 300 + 20],
    [2, (1800 + 10 + 300 + 10) * 2], // Repeats twice
    [3, 1200 + 20 + 600 + 20],
    [4, 2 * (1 + oneloop + 1 + oneloop + 1)],
  ]).test(
    'Template %s should have %s runtime',
    (templateIndex, expectedRuntime) => {
      expect(
        calculateRuntime(FlowTemplateLibrary[templateIndex].nodes) / 1000
      ).toBe(expectedRuntime);
    }
  );

  it('calculates correctly for inner loops', () => {
    const flow = [wait(), wait(), goto(0), wait(), pause(), wait(), goto(0)];
    const firstLoop = WAIT_TIME * 2 * GOTO_TIMES;
    const fullLoop = firstLoop + WAIT_TIME * 2;
    const expectedTotal = fullLoop * GOTO_TIMES * 1000;

    expect(calculateRuntime(flow)).toBe(expectedTotal);
  });

  it('calculates correctly for partial loops', () => {
    // This differs from the previous because the last go to goes to node 1
    const flow = [wait(), wait(), goto(0), wait(), pause(), wait(), goto(1)];

    const firstIteration = WAIT_TIME * 2 * GOTO_TIMES + WAIT_TIME * 2;
    const secondIteration =
      WAIT_TIME + WAIT_TIME * 2 * (GOTO_TIMES - 1) + WAIT_TIME * 2;
    const expectedTotal = (firstIteration + secondIteration) * 1000;

    expect(calculateRuntime(flow)).toBe(expectedTotal);
  });
});

describe('createNewID', () => {
  const name = 'does not matter';
  const flow: Action[] = [];
  const makeTimerSingleState = (id: string) => ({ [id]: { id, name, flow } });

  it('works with no nodes', () => {
    expect(createNewID({})).toBe('1');
  });

  it('works with several nodes', () => {
    const timer0 = makeTimerSingleState('0');
    const timer1 = makeTimerSingleState('1');
    const timer2 = makeTimerSingleState('2');
    expect(createNewID({ ...timer0, ...timer1, ...timer2 })).toBe('3');
  });

  it('works with missing nodes', () => {
    const timer3 = makeTimerSingleState('3');
    const timer7 = makeTimerSingleState('7');
    const timer9 = makeTimerSingleState('9');
    expect(createNewID({ ...timer3, ...timer7, ...timer9 })).toBe('10');
  });
});

describe('serialization', () => {
  each([0, 1, 2, 3, 4]).test(
    'template %s should serialize and deserialize',
    (templateIndex) => {
      const flow = FlowTemplateLibrary[templateIndex];

      // test the first half with descriptions
      const description = templateIndex < 2 ? flow.description : undefined;
      const name = flow.title;

      const timer: Timer = { name, description, id: '5', flow: flow.nodes };

      const reconstructed = deserialize(serialize(timer));
      const reconstructedTimer: Timer = { ...reconstructed, id: '5' };

      expect(reconstructedTimer).toEqual(timer);
    }
  );
});

describe('msToViewable', () => {
  each([
    [0, '00:00'],
    [0.5, '00:00'],
    [1, '00:01'],
    [60, '01:00'],
    [61, '01:01'],
    [3600, '1:00:00'],
    [3661, '1:01:01'],
    [900, '15:00'],
    [915, '15:15'],
  ]).test('input %s ms should output %s', (inputSec, expected) => {
    expect(msToViewable(inputSec * 1000)).toBe(expected);
  });
});

describe('validateFlow', () => {
  each([0, 1, 2, 3, 4]).test(
    'template %s should pass validation',
    (templateIndex) => {
      validateFlow(FlowTemplateLibrary[templateIndex].nodes);
    }
  );

  const validation = (nodes: Action[]) => () => validateFlow(nodes);

  it('fails with no nodes', () => {
    expect(validation([])).toThrow('Missing steps');
  });

  describe('goto validation', () => {
    it('fails on go to going to a later node', () => {
      expect(validation([goto(1), wait()])).toThrow(
        "Can't go to a later node! (Step 1 is going to step 2)"
      );
    });

    it(`fails when target doesn't exist`, () => {
      expect(validation([goto(-1)])).toThrow(
        "Step 1 is trying to go to a step that doesn't exist (0)"
      );
    });

    it(`fails when go to goes to itself`, () => {
      expect(validation([wait(), goto(1)])).toThrow(
        "Can't go to another Go To. (Step 2 is returning to step 2"
      );
    });

    it(`fails when going to a different goto`, () => {
      expect(validation([wait(), goto(0), wait(), goto(1)])).toThrow(
        `Can't go to another Go To. (Step 4 is returning to step 2)`
      );
    });

    it.skip(`fails when go tos overlap`, () => {
      expect(
        validation([wait(), wait(), wait(), goto(1), wait(), goto(2)])
      ).toThrow("Can't return past another Go To. (Step 6 passes step 4)");
    });

    it.skip(`fails when go tos are inside of each other`, () => {
      expect(
        validation([wait(), wait(), wait(), goto(2), wait(), goto(0)])
      ).toThrow("Can't return past another Go To. (Step 6 passes step 4)");
    });
  });
});
