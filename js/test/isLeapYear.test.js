import { isLeapYear } from '../utils';

describe('isLeapYear function', () => {
  it('should return true for leap years', () => {
    expect(isLeapYear(2000)).toBe(true);
    expect(isLeapYear(2020)).toBe(true);
    expect(isLeapYear(2104)).toBe(true);
  });

  it(`should return false for years that aren't leap year`, () => {
    expect(isLeapYear(2021)).toBe(false);
    expect(isLeapYear(2100)).toBe(false);
    expect(isLeapYear(2200)).toBe(false);
  });
});
