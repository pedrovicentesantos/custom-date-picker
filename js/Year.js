import Month from './Month.js';
import Day from './Day.js';
import { isLeapYear } from './utils.js';

class Year {
  constructor(year = null, monthNumber = null, lang = 'default') {
    const today = new Day(null, lang);
    this.year = year ?? today.year;
    this.month = new Month(
      new Date(this.year, (monthNumber || today.monthNumber) - 1),
      lang
    );
    this.lang = lang;

    this[Symbol.iterator] = function* () {
      let month = 1;
      while (month <= 12) {
        yield this.getMonth(month);
        month++;
      }
    };
  }

  getMonth(month) {
    return new Month(new Date(this.year, month - 1), this.lang);
  }

  get isLeapYear() {
    return isLeapYear(this.year);
  }
}

export default Year;
