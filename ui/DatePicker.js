/**
 * UIKit — DatePicker Component
 *
 * input type="text" (не "date") + кастомный календарь. type="date" был
 * заменён: нативный Chrome/Edge date-picker открывался по клику в любом
 * месте поля и не закрывался вместе с кастомным .ui-calendar при выборе
 * дня — два конфликтующих календаря сразу, нужно было два клика, чтобы
 * закрыть оба. Формат хранения — ISO YYYY-MM-DD, как и раньше.
 *
 * _outsideClickBound: флаг одноразовой привязки слушателя на document.
 * render() может вызываться повторно, но слушатель на document нужен один —
 * иначе каждый render() добавлял бы ещё один, и hideCalendar() вызывался
 * бы N раз на каждый клик снаружи.
 *
 * currentDate — состояние "открытого месяца" в календаре, независимое
 * от выбранного значения. Пользователь может листать месяцы и не выбирать.
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
    this.setProperty('customWidth', null);

    this.input    = null;
    this.calendar = null;
    // currentDate — позиция в календаре (какой месяц показывается), не само значение
    this.currentDate = new Date();

    // render() в конструкторе — иначе element остаётся пустым <div>, а setValue/
    // setWidth/showCalendar молча no-op'ят (this.input === null). Тот же паттерн,
    // что в Select/Panel/VerticalLayout: компонент, сам строящий свой DOM,
    // обязан отрисоваться при создании, а не ждать внешнего вызова render().
    this.render();
  }

  // Формат хранения: YYYY-MM-DD — стандарт ISO, совместим с input type="date"
  setValue(value) {
    this.setProperty('value', value);
    if (this.input) this.input.value = value;
    return this;
  }

  // Читаем из DOM input — синхронизирован с нативным вводом с клавиатуры
  getValue() {
    return this.input ? this.input.value : this.getProperty('value', '');
  }

  setMinDate(date) {
    this.setProperty('minDate', date);
    return this;
  }

  setMaxDate(date) {
    this.setProperty('maxDate', date);
    return this;
  }

  setWidth(width) {
    this.setProperty('customWidth', width);
    if (this.calendar) {
      this.calendar.style.setProperty('width', width, 'important');
      this.calendar.style.setProperty('min-width', width, 'important');
    }
    return this;
  }

  formatDate(date) {
    const year  = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day   = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  parseDate(str) {
    if (!str) return new Date();
    const [year, month, day] = str.split('-');
    // month-1: JS Date считает месяцы с 0
    return new Date(year, parseInt(month) - 1, day);
  }

  showCalendar() {
    if (this.calendar) {
      // Открываем календарь на месяце выбранного значения, а не на "текущем
      // месяце календаря" (после setValue('2020-01-15') раньше открывался
      // сегодняшний месяц и выбранного дня не было видно)
      const val = this.getValue();
      if (val) {
        const d = this.parseDate(val);
        if (!isNaN(d.getTime())) this.currentDate = d;
      }
      this.calendar.style.display = 'block';
      const customWidth = this.getProperty('customWidth');
      if (customWidth) {
        this.calendar.style.setProperty('width', customWidth, 'important');
        this.calendar.style.setProperty('min-width', customWidth, 'important');
      }
      this.renderCalendar();
    }
  }

  hideCalendar() {
    if (this.calendar) this.calendar.style.display = 'none';
  }

  renderCalendar() {
    if (!this.calendar) return;

    this.calendar.innerHTML = '';

    const year  = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();

    // Навигация по месяцам: мутируем currentDate и перерисовываем
    const header = document.createElement('div');
    header.className = 'ui-calendar-header';

    const prevBtn = document.createElement('button');
    prevBtn.className = 'ui-calendar-nav';
    prevBtn.textContent = '‹';
    prevBtn.type = 'button'; // type=button: не сабмитит форму если DatePicker внутри <form>
    prevBtn.addEventListener('click', (e) => {
      // stopPropagation — renderCalendar() ниже пересоздаёт DOM календаря
      // (innerHTML=''), к моменту всплытия до document-обработчика "клик
      // снаружи закрывает календарь" e.target уже отсоединён от дерева,
      // calendar.contains(e.target) вернёт false и закроет календарь сам на себя.
      e.stopPropagation();
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
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation(); // см. комментарий в prevBtn выше
      this.currentDate.setMonth(this.currentDate.getMonth() + 1);
      this.renderCalendar();
    });

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    this.calendar.appendChild(header);

    // Заголовки дней недели
    const weekdays = document.createElement('div');
    weekdays.className = 'ui-calendar-weekdays';
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach(day => {
      const dayEl = document.createElement('div');
      dayEl.textContent = day;
      weekdays.appendChild(dayEl);
    });
    this.calendar.appendChild(weekdays);

    const days = document.createElement('div');
    days.className = 'ui-calendar-days';

    // Пустые ячейки до первого дня месяца выравнивают сетку
    const firstDay   = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate(); // 0-й день следующего месяца = последний текущего

    for (let i = 0; i < firstDay; i++) {
      days.appendChild(document.createElement('div'));
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dayEl  = document.createElement('button');
      dayEl.type   = 'button';
      dayEl.className = 'ui-calendar-day';
      dayEl.textContent = day;

      const dateStr    = this.formatDate(new Date(year, month, day));
      const currentVal = this.getValue();

      if (dateStr === currentVal) dayEl.classList.add('ui-calendar-day-selected');

      // Блокируем даты вне диапазона min/max
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

  getMonthName(month) {
    return ['January','February','March','April','May','June',
            'July','August','September','October','November','December'][month];
  }

  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    // type="text", не "date" — нативный date-picker Chrome/Edge открывается по
    // клику в любом месте поля (не только по иконке, ту можно скрыть CSS'ом,
    // но клик всё равно триггерит системный попап) и не закрывается вместе с
    // кастомным .ui-calendar при выборе дня — два конфликтующих календаря
    // сразу, требовалось два клика, чтобы закрыть оба. Формат хранения
    // остаётся ISO YYYY-MM-DD (setValue/getValue не менялись).
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.placeholder = 'YYYY-MM-DD';
    this.input.className = 'ui-datepicker-input';
    this.input.value = this.getValue();

    this.input.addEventListener('click', () => this.showCalendar());
    this.input.addEventListener('change', (e) => {
      this.setProperty('value', e.target.value);
      this.emit('change', { value: e.target.value });
    });

    this.element.appendChild(this.input);

    this.calendar = document.createElement('div');
    this.calendar.className = 'ui-calendar';
    this.calendar.style.display = 'none';
    this.element.appendChild(this.calendar);

    // _outsideClickBound: слушатель на document нужен ровно один на весь жизненный цикл.
    // render() может вызываться повторно — без флага накапливались бы дубли.
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
