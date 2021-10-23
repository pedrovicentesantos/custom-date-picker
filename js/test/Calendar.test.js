import Calendar from '../Calendar';

describe('Calendar Class', () => {
  let calendar;
  beforeEach(() => {
    calendar = new Calendar(2021, 5, 'en');
  });

  it('should have the correct language', () => {
    expect(calendar.lang).toBe('en');
  });

  it('should have the correct year', () => {
    expect(calendar.year).toBe(2021);
  });

  it('should have the correct month number', () => {
    expect(calendar.month.monthNumber).toBe(5);
  });

  it('should have the correct day as today', () => {
    const today = new Date();
    expect(calendar.today.dayNumber).toBe(today.getDate());
  });

  it('should have the correct week days', () => {
    expect(calendar.weekDays.length).toBe(7);
    expect(calendar.weekDays).toStrictEqual([
      'Sunday',
      'Monday',
      'Tuesday',
      'Wednesday',
      'Thursday',
      'Friday',
      'Saturday'
    ]);
  });

  it('should return the correct previous month', () => {
    const previousMonth = calendar.getPreviousMonth();
    expect(previousMonth.monthNumber).toBe(4);
  });

  it('should return december of the year before if get previous month on january', () => {
    const calendar = new Calendar(2021, 1);
    const previousMonth = calendar.getPreviousMonth();
    expect(previousMonth.monthNumber).toBe(12);
    expect(previousMonth.year).toBe(2020);
  });

  it('should return the correct next month', () => {
    const nextMonth = calendar.getNextMonth();
    expect(nextMonth.monthNumber).toBe(6);
  });

  it('should return january of the next year if get next month on december', () => {
    const calendar = new Calendar(2021, 12);
    const nextMonth = calendar.getNextMonth();
    expect(nextMonth.monthNumber).toBe(1);
    expect(nextMonth.year).toBe(2022);
  });

  it('should alter the date when goToSpecificDate is called', () => {
    calendar.goToSpecificDate(6, 2020);
    expect(calendar.year).toBe(2020);
    expect(calendar.month.monthNumber).toBe(6);
  });

  it('should alter the date to december of the year before when goToPreviousYear is called', () => {
    calendar.goToPreviousYear();
    expect(calendar.year).toBe(2020);
    expect(calendar.month.monthNumber).toBe(12);
  });

  it('should alter the date to january of the next when goToNextYear is called', () => {
    calendar.goToNextYear();
    expect(calendar.year).toBe(2022);
    expect(calendar.month.monthNumber).toBe(1);
  });

  it('should alter the date to previous month when goToPreviousMonth is called', () => {
    calendar.goToPreviousMonth();
    expect(calendar.year).toBe(2021);
    expect(calendar.month.monthNumber).toBe(4);
    const january = new Calendar(2021, 1);
    january.goToPreviousMonth();
    expect(january.year).toBe(2020);
    expect(january.month.monthNumber).toBe(12);
  });

  it('should alter the date to next month when goToNextMonth is called', () => {
    calendar.goToNextMonth();
    expect(calendar.year).toBe(2021);
    expect(calendar.month.monthNumber).toBe(6);
    const december = new Calendar(2021, 12);
    december.goToNextMonth();
    expect(december.year).toBe(2022);
    expect(december.month.monthNumber).toBe(1);
  });
});
