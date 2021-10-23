import { getWeekNumber } from '../utils';

describe('getWeekNumber function', () => {
  it('should return 1 for first week of the year', () => {
    const date = new Date(2021, 0, 1);
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(1);
  });

  it('should return 53 for the last week of year 2021', () => {
    const date = new Date(2021, 11, 31);
    const weekNumber = getWeekNumber(date);
    expect(weekNumber).toBe(53);
  });
});
