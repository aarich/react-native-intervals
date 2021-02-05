import { getTimeAsChosenUnitStr, getTimeAsSeconds } from '../experience';

import each from 'jest-each';

describe('getTimeAsChosenUnitStr', () => {
  each([
    ['0', '0'],
    ['', ''],
    [1, '1'],
    ['0.0', '0'],
    [30, '30'],
    [600, '600'],
    [undefined, ''],
    [null, ''],
    ['0.', '0'],
  ]).it('input %s seconds to get %s seconds', (test, expected) => {
    expect(getTimeAsChosenUnitStr(test, true, '')).toBe(expected);
  });

  each([
    ['0', '0'],
    ['', ''],
    [1, '0.02'],
    [undefined, ''],
    [null, ''],
    [60, '1'],
    [120, '2'],
    [30, '0.5'],
    [90, '1.5'],
    [20, '0.33'],
    [40, '0.67'],
  ]).it('input %s seconds to get %s minutes', (test, expected) => {
    expect(getTimeAsChosenUnitStr(test, false, '')).toBe(expected);
  });

  it('ignores suffix when outputting seconds', () => {
    expect(getTimeAsChosenUnitStr(30, true, 'suffix')).toBe('30');
  });

  it('adds suffix when outputting minutes', () => {
    expect(getTimeAsChosenUnitStr(60, false, 'suffix')).toBe('1suffix');
    expect(getTimeAsChosenUnitStr(0, false, '.')).toBe('0.');
    expect(getTimeAsChosenUnitStr(0, false, '.0')).toBe('0.0');
  });
});

describe('getTimeAsSeconds', () => {
  each([
    ['', ''],
    ['0', 0],
    ['1', 1],
    ['1.', 1],
    ['0.', 0],
    ['.', ''],
    ['a', ''],
    ['55', 55],
    ['60', 60],
  ]).it('%s seconds should calculate %s seconds', (input, expectedSeconds) => {
    let suffix;
    expect(getTimeAsSeconds(input, true, (s) => (suffix = s))).toBe(
      expectedSeconds
    );
    // Suffix should never be set with seconds, they can only be whole numbers
    expect(suffix).toBe('');
  });

  each([
    ['', '', ''],
    ['0', 0, ''],
    ['1', 60, ''],
    ['1.', 60, '.'],
    ['0.0', 0, '.0'],
    ['.', '', '.'],
    ['a', '', ''],
    ['55', 55 * 60, ''],
    ['60', 60 * 60, ''],
    ['5.0', 5 * 60, '.0'],
    ['.0', 0, '.0'],
  ]).it(
    '%s minutes calculates %s seconds',
    (input, expectedSeconds, expectedSuffix) => {
      let suffix;
      expect(getTimeAsSeconds(input, false, (s) => (suffix = s))).toBe(
        expectedSeconds
      );
      expect(suffix).toBe(expectedSuffix);
    }
  );
});
