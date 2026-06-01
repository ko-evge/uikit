/**
 * UIKit - DatePicker Component
 * Date input with calendar picker
 */

import { Base } from '../core/Base.js';

export class DatePicker extends Base {
  constructor(placeholder = 'Select date') {
    super();
    this.createElement('div', 'ui-datepicker-wrapper');

    this.setProperty('value', '');
    this.setProperty('format', 'YYYY-MM-DD');
    this.setProperty('minDate', null);
    this.setProperty('maxDate', null);

    this.input = null;
    this.calendar = null;
    this.currentDate = new Date();
  }

  /**
   * Set date value (YYYY-MM-DD format)
   */
  setValue(value) {
    this.setProperty('value', value);
    if (this.input) {
      this.input.value = value;
    }
    return this;
  }

  /**
   * Get date value
   */
  getValue() {
    return this.input ? this.input.value : this.getProperty('value', '');
  }

  /**
   * Set minimum date
   */
  setMinDate(date) {
    this.setProperty('minDate', date);
    return this;
  }

  /**
   * Set maximum date
   */
  setMaxDate(date) {
    this.setProperty('maxDate', date);
    return this;
  }

  /**
   * Format date to YYYY-MM-DD
   */
  formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Parse date from YYYY-MM-DD
   */
  parseDate(str) {
    if (!str) return new Date();
    const [year, month, day] = str.split('-');
    return new Date(year, parseInt(month) - 1, day);
  }

  /**
   * Show calendar
   */
  showCalendar() {
    if (this.calendar) {
      this.calendar.style.display = 'block';
      this.renderCalendar();
    }
  }

  /**
   * Hide calendar
   */
  hideCalendar() {
    if (this.calendar) {
      this.calendar.style.display = 'none';
    }
  }

  /**
   * Render calendar
   */
  renderCalendar() {
    if (!this.calendar) return;

    this.calendar.innerHTML = '';

    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Header
    const header = document.createElement('div');
    header.className = 'ui-calendar-header';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'ui-calendar-nav';
    prevBtn.textContent = '‹';
    prevBtn.type = 'button';
    prevBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() - 1);
      this.renderCalendar();
    });

    const title = document.createElement('span');
    title.className = 'ui-calendar-title';
    title.textContent = `${this.getMonthName(month)} ${year}`;

    const nextBtn = document.createElement('button');
    nextBtn.className = 'ui-calendar-nav';
    nextBtn.textContent = '›';
    nextBtn.type = 'button';
    nextBtn.addEventListener('click', () => {
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    this.calendar.appendChild(header);

    // Weekdays
    const weekdays = document.createElement('div');
    weekdays.className = 'ui-calendar-weekdays';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.textContent = day;
      weekdays.appendChild(dayEl);
    });
    this.calendar.appendChild(weekdays);

    // Days
    const days = document.createElement('div');
    days.className = 'ui-calendar-days';

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Empty cells before month starts
    for (let i = 0; i < firstDay; i++) {
      const empty = document.createElement('div');
      days.appendChild(empty);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl = document.createElement('button');
      dayEl.type = 'button';
      dayEl.className = 'ui-calendar-day';
      dayEl.textContent = day;

      const dateStr = this.formatDate(new Date(year, month, day));
      const currentValue = this.getValue();

      if (dateStr === currentValue) {
        dayEl.classList.add('ui-calendar-day-selected');
      }

      // Check min/max dates
      const minDate = this.getProperty('minDate');
      const maxDate = this.getProperty('maxDate');
      const dateObj = new Date(year, month, day);

      if ((minDate && dateObj < new Date(minDate)) ||
          (maxDate && dateObj > new Date(maxDate))) {
        dayEl.disabled = true;
        dayEl.className += ' ui-calendar-day-disabled';
      }

      dayEl.addEventListener('click', () => {
        this.setValue(dateStr);
        this.hideCalendar();
        this.emit('change', { value: dateStr });
      });

      days.appendChild(dayEl);
    }

    this.calendar.appendChild(days);
  }

  /**
   * Get month name
   */
  getMonthName(month) {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
                   'July', 'August', 'September', 'October', 'November', 'December'];
    return months[month];
  }

  /**
   * Render component
   */
  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    // Input
    this.input = document.createElement('input');
    this.input.type = 'date';
    this.input.className = 'ui-datepicker-input';
    this.input.value = this.getValue();

    this.input.addEventListener('click', () => this.showCalendar());
    this.input.addEventListener('change', (e) => {
      this.setProperty('value', e.target.value);
      this.emit('change', { value: e.target.value });
    });

    this.element.appendChild(this.input);

    // Calendar
    this.calendar = document.createElement('div');
    this.calendar.className = 'ui-calendar';
    this.calendar.style.display = 'none';

    this.element.appendChild(this.calendar);

    // Close on outside click. Bind to document only once; the handler reads
    // the current this.input / this.calendar, refreshed on each render.
    if (!this._outsideClickBound) {
      this._outsideClickBound = true;
      this._listen(document, 'click', (e) => {
        if (this.calendar && e.target !== this.input && !this.calendar.contains(e.target)) {
          this.hideCalendar();
        }
      });
    }

    return this;
  }
}

export default DatePicker;
