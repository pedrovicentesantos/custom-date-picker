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
  calendarMonthDaysContainer = null;
  selectedDayElement = null;

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
          <h4 tabindex="0" aria-label="current month ${date}">${monthYear}</h4>
          <button type="button" class="next-month" aria-label="next month"></button>
        </div>
        <div class="week-days">${this.getWeekDays()}</div>
        <div class="month-days"></div>
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
    this.calendarMonthDaysContainer =
      this.calendarDropdown.querySelector('.month-days');

    this.toggleBtn.addEventListener('click', () => this.toggleCalendar());
    prevBtn.addEventListener('click', () => this.prevMonth());
    nextBtn.addEventListener('click', () => this.nextMonth());
    document.addEventListener('click', (e) => this.hideCalendar(e));
    this.updateMonthDays();
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
      this.renderCalendarDays();
    }

    this.calendarVisible = this.calendarDropdown.className.includes('visible');

    if (this.calendarVisible) {
      this.calendarDropdownHeader.focus();
    } else {
      this.toggleBtn.focus();
    }
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
    this.calendarDropdownHeader.setAttribute(
      'aria-label',
      `current month ${this.date.format(this.format)}`
    );
  }

  prevMonth() {
    this.calendar.goToPreviousMonth();
    this.renderCalendarDays();
    this.calendarDropdownHeader.focus();
  }

  nextMonth() {
    this.calendar.goToNextMonth();
    this.renderCalendarDays();
    this.calendarDropdownHeader.focus();
  }

  getWeekDays() {
    return this.calendar.weekDays
      .map((weekDay) => `<span>${weekDay.substring(0, 3)}</span>`)
      .join('');
  }

  getMonthDays() {
    const firstDayOfMonth = this.calendar.month.getDay(1);
    const numberOfDaysPreviousMonth = firstDayOfMonth.weekDayNumber - 1;
    const previousMonth = this.calendar.getPreviousMonth();
    const totalDays =
      this.calendar.month.numberOfDays + numberOfDaysPreviousMonth;

    const monthDays = Array.from({ length: totalDays });

    for (let i = numberOfDaysPreviousMonth; i < totalDays; i++) {
      monthDays[i] = this.calendar.month.getDay(
        i - numberOfDaysPreviousMonth + 1
      );
    }

    for (let i = 0; i < numberOfDaysPreviousMonth; i++) {
      monthDays[i] = previousMonth.getDay(
        previousMonth.numberOfDays - numberOfDaysPreviousMonth + i + 1
      );
    }
    return monthDays;
  }

  updateMonthDays() {
    this.calendarMonthDaysContainer.innerHTML = '';

    this.getMonthDays().forEach((day) => {
      const dayElement = document.createElement('button');
      dayElement.className = 'month-day';

      dayElement.textContent = day.dayNumber;

      dayElement.addEventListener('click', (e) => {
        this.selectDay(e, day);
      });

      dayElement.setAttribute('aria-label', day.format(this.format));

      if (day.monthNumber === this.calendar.month.monthNumber) {
        dayElement.classList.add('current');
      }

      if (this.isSelectedDay(day)) {
        dayElement.classList.add('selected');
        this.selectedDayElement = dayElement;
      }

      this.calendarMonthDaysContainer.appendChild(dayElement);
    });
  }

  selectDay(e, day) {
    if (day.isEqual(this.date)) {
      return;
    }

    e.target.classList.add('selected');
    this.selectedDayElement.classList.remove('selected');
    this.date = day;
    this.selectedDayElement = e.target;

    if (day.monthNumber !== this.calendar.month.monthNumber) {
      this.prevMonth();
    }

    this.toggleCalendar();
    this.updateTogglerText();
  }

  updateTogglerText() {
    const date = this.date.format(this.format);
    this.toggleBtn.textContent = date;
  }

  isSelectedDay(day) {
    return (
      day.dayNumber === this.date.dayNumber &&
      day.monthNumber === this.date.monthNumber &&
      day.year === this.date.year
    );
  }

  renderCalendarDays() {
    this.updateHeaderText();
    this.updateMonthDays();
  }

  static get validPositions() {
    return ['top', 'right', 'bottom', 'left'];
  }

  get generateMonthYear() {
    return `${this.calendar.month.name}, ${this.calendar.year}`;
  }
}

export default DatePicker;
