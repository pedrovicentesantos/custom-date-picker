const getWeekNumber = (date) => {
  const firstDayOfYear = new Date(date.getFullYear(), 0, 1);
  const daysPassed = (date - firstDayOfYear) / 86400000;
  const firstDayOfYearDayOfWeek = firstDayOfYear.getDay() + 1;

  return Math.ceil((daysPassed + firstDayOfYearDayOfWeek) / 7);
};

const isLeapYear = (year) => {
  if (year % 4 !== 0) return false;
  if (year % 100 === 0 && year % 400 !== 0) return false;
  if ((year % 100 === 0 && year % 400 === 0) || year % 100 !== 0) return true;
};

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

class DatePicker extends HTMLElement {
  format = 'DD/MM/YYYY';
  calendarPosition = 'bottom';
  calendarVisible = false;
  date = null;
  mounted = false;
  toggleBtn = null;
  calendarDropdown = null;

  constructor() {
    super();

    const lang = window.navigator.language;
    const date = new Date(
      this.date ?? (this.getAttribute('date') || Date.now())
    );

    this.date = new Day(date, lang);
    this.calendar = new Calendar(this.date.year, this.date.monthNumber, lang);

    this.format = this.getAttribute('format') || this.format;
    this.calendarPosition = DatePicker.validPositions.includes(
      this.getAttribute('calendarPosition')
    )
      ? this.getAttribute('calendarPosition')
      : this.calendarPosition;
    this.calendarVisible =
      this.getAttribute('calendarVisible') === '' ||
      this.getAttribute('calendarVisible') === 'true' ||
      this.calendarVisible;

    this.render();
  }

  render() {
    const monthYear = `${this.calendar.month.name}, ${this.calendar.year}`;
    const date = this.date.format(this.format);
    this.innerHTML = `
      <button class="date-toggle" type="button">${date}</button>
      <div class="calendar-dropdown ${this.calendarVisible ? 'visible' : ''} 
        ${this.calendarPosition}">
        <div class="header">
          <button type="button" class="prev-month" aria-label="previous month"></button>
          <h4>${monthYear}</h4>
          <button type="button" class="next-month" aria-label="next month"></button>
        </div>
      </div>
    `;
  }

  connectedCallback() {
    this.mounted = true;
    this.toggleBtn = document.querySelector('.date-toggle');
    this.calendarDropdown = document.querySelector('.calendar-dropdown');

    this.toggleBtn.addEventListener('click', () => this.toggleCalendar());
  }

  toggleCalendar(visible = null) {
    if (visible === null) {
      this.calendarDropdown.classList.toggle('visible');
    } else if (visible) {
      this.calendarDropdown.classList.add('visible');
    } else {
      this.calendarDropdown.classList.remove('visible');
    }

    this.calendarVisible = this.calendarDropdown.className.includes('visible');
  }

  static get validPositions() {
    return ['top', 'right', 'bottom', 'left'];
  }
}

customElements.define('date-picker', DatePicker);

module.exports = {
  Day,
  Month,
  Year,
  Calendar,
  getWeekNumber,
  isLeapYear
};
