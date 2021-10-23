import Day from './Day.js';
import Calendar from './Calendar.js';

class DatePicker extends HTMLElement {
  format = 'DD/MM/YYYY';
  calendarPosition = 'top';
  calendarVisible = false;
  date = null;
  mounted = false;
  toggleBtn = null;
  calendarDropdown = null;
  calendarDropdownHeader = null;

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
    const monthYear = this.generateMonthYear;
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
        <div class="week-days">${this.getWeekDays()}</div>
      </div>
    `;
  }

  connectedCallback() {
    this.mounted = true;
    this.toggleBtn = document.querySelector('.date-toggle');
    this.calendarDropdown = document.querySelector('.calendar-dropdown');
    const [prevBtn, calendarDropdownHeader, nextBtn] =
      this.calendarDropdown.querySelector('.header').children;
    this.calendarDropdownHeader = calendarDropdownHeader;

    this.toggleBtn.addEventListener('click', () => this.toggleCalendar());
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextBtn.addEventListener('click', () => this.nextMonth());
    document.addEventListener('click', (e) => this.hideCalendar(e));
  }

  toggleCalendar(visible = null) {
    if (visible === null) {
      this.calendarDropdown.classList.toggle('visible');
    } else if (visible) {
      this.calendarDropdown.classList.add('visible');
    } else {
      this.calendarDropdown.classList.remove('visible');
    }

    if (!this.isSameDateOfToggleBtn()) {
      this.calendar.goToSpecificDate(this.date.monthNumber, this.date.year);
      this.updateHeaderText();
    }

    this.calendarVisible = this.calendarDropdown.className.includes('visible');
  }

  hideCalendar(e) {
    if (this.calendarVisible && !this.contains(e.target)) {
      this.toggleCalendar(false);
    }
  }

  isSameDateOfToggleBtn() {
    return (
      this.calendar.month.monthNumber === this.date.monthNumber &&
      this.calendar.year === this.date.year
    );
  }

  updateHeaderText() {
    this.calendarDropdownHeader.textContent = this.generateMonthYear;
  }

  prevMonth() {
    this.calendar.goToPreviousMonth();
    this.updateHeaderText();
  }

  nextMonth() {
    this.calendar.goToNextMonth();
    this.updateHeaderText();
  }

  getWeekDays() {
    return this.calendar.weekDays
      .map((weekDay) => `<span>${weekDay.substring(0, 3)}</span>`)
      .join('');
  }

  static get validPositions() {
    return ['top', 'right', 'bottom', 'left'];
  }

  get generateMonthYear() {
    return `${this.calendar.month.name}, ${this.calendar.year}`;
  }
}

export default DatePicker;
