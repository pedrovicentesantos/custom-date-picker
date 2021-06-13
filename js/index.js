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

// dayOfWeek: 1 - Sunday -> 7 - Saturday
class Day {
  constructor(date = null, lang = 'default') {
    date = date ?? new Date();

    this.Date = date;
    this.day = date.getDate();
    this.dayOfWeekNumber = date.getDay() + 1;
    this.dayOfWeek = date.toLocaleString(lang, { weekday: 'long' });
    this.dayOfWeekShort = date.toLocaleString(lang, { weekday: 'short' });
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
    date = date instanceof Day ? date.Date : date;
    return (
      date.getDate() === this.day &&
      date.getMonth() === this.monthNumber - 1 &&
      date.getFullYear() === this.year
    );
  }

  format(formatString) {
    return formatString
      .replace(/\bD\b/, this.day)
      .replace(/\bDD\b/, this.day.toString().padStart(2, '0'))
      .replace(/\bDW\b/, this.dayOfWeekShort)
      .replace(/\bDDW\b/, this.dayOfWeek)
      .replace(/\bM\b/, this.monthNumber)
      .replace(/\bMM\b/, this.monthNumber.toString().padStart(2, '0'))
      .replace(/\bMN\b/, this.monthShort)
      .replace(/\bMMN\b/, this.month)
      .replace(/\bYY\b/, this.yearShort)
      .replace(/\bYYYY\b/, this.year);
  }
}

class Month {
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
      let number = 1;
      yield this.getDay(number);
      while (number < this.numberOfDays) {
        ++number;
        yield this.getDay(number);
      }
    };
  }

  getDay(day) {
    return new Day(new Date(this.year, this.monthNumber - 1, day), this.lang);
  }
}

const birthday = new Date(2021, 4, 26);
const day = new Day(birthday, 'en');

console.log(day);
console.log(day.isToday);
console.log(day.format('DDW, DD de MMN de YYYY'));

const month = new Month();
console.log(month);

for (const day of month) {
  console.log('day', day.dayOfWeek);
}
