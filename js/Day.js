import { getWeekNumber } from './utils.js';

class Day {
  // weekDayNumber: 1 - Sunday -> 7 - Saturday
  // monthNumber: 1 - January -> 12 - December
  constructor(date = null, lang = 'default') {
    date = date ?? new Date();

    this.date = date;
    this.dayNumber = date.getDate();
    this.weekDayNumber = date.getDay() + 1;
    this.weekDay = date.toLocaleString(lang, { weekday: 'long' });
    this.weekDayShort = date.toLocaleString(lang, { weekday: 'short' });
    this.monthNumber = date.getMonth() + 1;
    this.month = date.toLocaleString(lang, { month: 'long' });
    this.monthShort = date.toLocaleString(lang, { month: 'short' });
    this.year = date.getFullYear();
    this.yearShort = Number(date.toLocaleString(lang, { year: '2-digit' }));
    this.timestamp = date.getTime();
    this.weekNumber = getWeekNumber(date);
  }

  get isToday() {
    return this.isEqual(new Date());
  }

  isEqual(date) {
    // Can receive Date or Day
    date = date instanceof Day ? date.date : date;
    return (
      date.getDate() === this.dayNumber &&
      date.getMonth() === this.monthNumber - 1 &&
      date.getFullYear() === this.year
    );
  }

  format(formatString) {
    return formatString
      .replace(/\bD\b/, this.dayNumber)
      .replace(/\bDD\b/, this.dayNumber.toString().padStart(2, '0'))
      .replace(/\bDW\b/, this.weekDayShort)
      .replace(/\bDDW\b/, this.weekDay)
      .replace(/\bM\b/, this.monthNumber)
      .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
      .replace(/\bMN\b/, this.monthShort)
      .replace(/\bMMN\b/, this.month)
      .replace(/\bYY\b/, this.yearShort)
      .replace(/\bYYYY\b/, this.year);
  }
}

export default Day;
