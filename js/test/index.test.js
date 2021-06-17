const Day = require('../index').Day;
const Month = require('../index').Month;
const Year = require('../index').Year;
const Calendar = require('../index').Calendar;

describe('Day Class', () => {
  let day;
  const birthday = new Date(2021, 4, 26);
  beforeAll(() => {
    day = new Day(birthday, 'en');
  });

  it('should have the correct day of month', () => {
    expect(day.dayNumber).toBe(26);
  });

  it('should have the correct day of week number', () => {
    expect(day.weekDayNumber).toBe(4);
  });

  it('should have the correct day of week', () => {
    expect(day.weekDay).toBe('Wednesday');
  });

  it('should have the correct short day of week', () => {
    expect(day.weekDayShort).toBe('Wed');
  });

  it('should have the correct month number', () => {
    expect(day.monthNumber).toBe(5);
  });

  it('should have the correct month', () => {
    expect(day.month).toBe('May');
  });

  it('should have the correct short month', () => {
    expect(day.monthShort).toBe('May');
  });

  it('should have the correct year', () => {
    expect(day.year).toBe(2021);
  });

  it('should have the correct short year', () => {
    expect(day.yearShort).toBe(21);
  });

  it('should have the correct timestamp', () => {
    expect(day.timestamp).toBe(1621998000000);
  });

  it('should have the correct week of year number', () => {
    expect(day.weekNumber).toBe(22);
  });

  it('should return false for the is today check', () => {
    expect(day.isToday).toBe(false);
  });

  it('should return true when compared with same day', () => {
    expect(day.isEqual(birthday)).toBe(true);
  });

  it('should return false when compared with another day', () => {
    const dayBefore = new Date(2021, 4, 25);
    expect(day.isEqual(dayBefore)).toBe(false);
  });

  it('should format the day correctly', () => {
    let string = '26/05/2021';
    expect(day.format('DD/MM/YYYY')).toBe(string);
    string = '26/05/21';
    expect(day.format('DD/MM/YY')).toBe(string);
    string = 'Wednesday, 26 May 2021';
    expect(day.format('DDW, DD MMN YYYY')).toBe(string);
  });

  it('should adjust results accordingly to language', () => {
    const day = new Day(birthday, 'pt-br');
    expect(day.monthShort).toBe('mai.');
    expect(day.month).toBe('maio');
    expect(day.weekDay).toBe('quarta-feira');
    expect(day.weekDayShort).toBe('qua.');
    const string = 'quarta-feira, 26 de maio de 2021';
    expect(day.format('DDW, DD de MMN de YYYY')).toBe(string);
  });

  it('should return today if no date passed', () => {
    const today = new Date();
    const day = new Day();

    expect(day.dayNumber).toBe(today.getDate());
    expect(day.weekDayNumber).toBe(today.getDay() + 1);
    expect(day.monthNumber).toBe(today.getMonth() + 1);
    expect(day.year).toBe(today.getFullYear());
  });
});

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

describe('Calendar Class', () => {
  let calendar;
  beforeAll(() => {
    calendar = new Calendar(2021, 5, 'en');
  });

  it('should have the correct year', () => {
    expect(calendar.year).toBe(2021);
  });
});
