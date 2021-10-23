import Month from '../Month';

describe('Month Class', () => {
  let month;
  const birthday = new Date(2021, 4, 26);
  beforeAll(() => {
    month = new Month(birthday, 'en');
  });

  it('should have the correct language', () => {
    expect(month.lang).toBe('en');
  });

  it('should have the correct month name', () => {
    expect(month.name).toBe('May');
  });

  it('should have the correct month number', () => {
    expect(month.monthNumber).toBe(5);
  });

  it('should have the correct year', () => {
    expect(month.year).toBe(2021);
  });

  it('should have the correct number of days in month', () => {
    expect(month.numberOfDays).toBe(31);
  });

  it('month object should be an iterable', () => {
    expect(month[Symbol.iterator]).toBeDefined();
  });

  it('should have 29 days in February in leap year', () => {
    const date = new Date(2020, 1, 24);
    const month = new Month(date);
    expect(month.numberOfDays).toBe(29);
    expect(month.numberOfDays).not.toBe(28);
  });

  it(`should have 28 days in February in a year that's not a leap year`, () => {
    const date = new Date(2021, 1, 24);
    const month = new Month(date);
    expect(month.numberOfDays).toBe(28);
    expect(month.numberOfDays).not.toBe(29);
  });

  it('should have date as today if no date passed', () => {
    const today = new Date();
    const month = new Month(null, 'en');
    expect(month.monthNumber).toBe(today.getMonth() + 1);
    expect(month.year).toBe(today.getFullYear());
    expect(month.name).toBe(today.toLocaleString('en', { month: 'long' }));
  });
});
