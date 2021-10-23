import Year from './Year.js';
import Day from './Day.js';
import Month from './Month.js';

class Calendar extends Year {
  weekDays = Array.from({ length: 7 });

  constructor(year = null, monthNumber = null, lang = 'default') {
    super(year, monthNumber, lang);

    this.today = new Day(null, lang);
    this.weekDays.forEach((_, i) => {
      const day = this.month.getDay(i);
      if (!this.weekDays.includes(day.weekDay)) {
        this.weekDays[day.weekDayNumber - 1] = day.weekDay;
      }
    });
  }

  getPreviousMonth() {
    if (this.month.monthNumber === 1) {
      return new Month(new Date(this.year - 1, 11), this.lang);
    }

    return new Month(
      new Date(this.year, this.month.monthNumber - 2),
      this.lang
    );
  }

  getNextMonth() {
    if (this.month.monthNumber === 11) {
      return new Month(new Date(this.year + 1, 0), this.lang);
    }

    return new Month(new Date(this.year, this.month.monthNumber), this.lang);
  }

  goToSpecificDate(monthNumber, year) {
    this.month = new Month(new Date(year, monthNumber - 1), this.lang);
    this.year = year;
  }

  goToPreviousYear() {
    this.year -= 1;
    this.month = new Month(new Date(this.year, 11), this.lang);
  }

  goToNextYear() {
    this.year += 1;
    this.month = new Month(new Date(this.year, 0), this.lang);
  }

  goToPreviousMonth() {
    if (this.month.monthNumber === 1) {
      return this.goToPreviousYear();
    }

    this.month = new Month(
      new Date(this.year, this.month.monthNumber - 2),
      this.lang
    );
  }

  goToNextMonth() {
    if (this.month.monthNumber === 12) {
      return this.goToNextYear();
    }

    this.month = new Month(
      new Date(this.year, this.month.monthNumber),
      this.lang
    );
  }
}

export default Calendar;
