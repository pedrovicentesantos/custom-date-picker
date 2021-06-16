const Day = require('../index').Day;

describe('Day Class', () => {
  let day;
  const birthday = new Date(2021, 4, 26);
  beforeAll(() => {
    day = new Day(birthday, 'en');
  });

  it('should return the correct day of month', () => {
    expect(day.dayNumber).toBe(26);
  });

  it('should return the correct day of week number', () => {
    expect(day.weekDayNumber).toBe(4);
  });

  it('should return the correct day of week', () => {
    expect(day.weekDay).toBe('Wednesday');
  });

  it('should return the correct short day of week', () => {
    expect(day.weekDayShort).toBe('Wed');
  });

  it('should return the correct month number', () => {
    expect(day.monthNumber).toBe(5);
  });

  it('should return the correct month', () => {
    expect(day.month).toBe('May');
  });

  it('should return the correct short month', () => {
    expect(day.monthShort).toBe('May');
  });

  it('should return the correct year', () => {
    expect(day.year).toBe(2021);
  });

  it('should return the correct short year', () => {
    expect(day.yearShort).toBe(21);
  });

  it('should return the correct timestamp', () => {
    expect(day.timestamp).toBe(1621998000000);
  });

  it('should return the correct week of year number', () => {
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
