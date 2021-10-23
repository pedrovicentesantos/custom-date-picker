import Day from './Day.js';
import { isLeapYear } from './utils.js';

class Month {
  // monthNumber: 1 - January -> 12 - December
  constructor(date = null, lang = 'default') {
    const day = new Day(date, lang);
    const daysInMonths = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    this.lang = lang;

    this.name = day.month;
    this.monthNumber = day.monthNumber;
    this.year = day.year;
    this.numberOfDays = daysInMonths[this.monthNumber - 1];

    if (this.monthNumber === 2) {
      this.numberOfDays += isLeapYear(this.year) ? 1 : 0;
    }

    this[Symbol.iterator] = function* () {
      let day = 1;
      while (day <= this.numberOfDays) {
        yield this.getDay(day);
        day++;
      }
    };
  }

  getDay(day) {
    return new Day(new Date(this.year, this.monthNumber - 1, day), this.lang);
  }
}

export default Month;
