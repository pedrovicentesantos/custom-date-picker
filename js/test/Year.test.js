import Year from '../Year';

describe('Year Class', () => {
  let year;
  beforeAll(() => {
    year = new Year(2021, 5, 'en');
  });

  it('should have the correct year', () => {
    expect(year.year).toBe(2021);
  });

  it('should have the correct month', () => {
    expect(year.month.monthNumber).toBe(5);
  });

  it('year object should be an iterable', () => {
    expect(year[Symbol.iterator]).toBeDefined();
  });

  it('should have 12 months', () => {
    expect([...year].length).toBe(12);
  });

  it('should return false if year is not a leap year', () => {
    expect(year.isLeapYear).toBe(false);
  });

  it('should return true if year is a leap year', () => {
    const year = new Year(2020);
    expect(year.isLeapYear).toBe(true);
  });

  it('should have the current year if no year passed', () => {
    const year = new Year();
    const today = new Date();
    expect(year.year).toBe(today.getFullYear());
  });

  it('should have the current month if no month passed', () => {
    const year = new Year(2020);
    const today = new Date();
    expect(year.month.monthNumber).toBe(today.getMonth() + 1);
  });
});
