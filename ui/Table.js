/**
 * UIKit — Table Component
 *
 * Простая таблица без сортировки, фильтрации и пагинации.
 * Для таблиц с этим функционалом — Grid.
 *
 * Table используется там, где данные статичны или обновляются редко:
 * отчёты, сводные данные, печатные формы.
 *
 * Поддержка двух форматов строк — массив и объект:
 * Object.values(rowData) — чтобы таблица работала как с [{a:1,b:2}],
 * так и с [[1,2]] без приведения данных на стороне вызывающего кода.
 *
 * Выделение строки scoped querySelector ('tr.selected' внутри this.element):
 * Если на странице несколько таблиц, document.querySelectorAll снял бы
 * выделение в соседних таблицах. Поиск от this.element изолирует состояние.
 */

import { Base } from '../core/Base.js';

export class Table extends Base {
  constructor() {
    super();
    this.createElement('table', 'ui-table');
    this.setProperty('headers', []);
    this.setProperty('rows', []);
    this.selectedRow = null;
  }

  setHeaders(headers) {
    this.setProperty('headers', headers);
    this.render();
    return this;
  }

  getHeaders() {
    return this.getProperty('headers', []);
  }

  setRows(rows) {
    this.setProperty('rows', rows);
    this.render();
    return this;
  }

  getRows() {
    return this.getProperty('rows', []);
  }

  addRow(rowData) {
    const rows = this.getRows();
    rows.push(rowData);
    this.setRows(rows);
    return this;
  }

  removeRow(index) {
    const rows = this.getRows();
    rows.splice(index, 1);
    this.setRows(rows);
    return this;
  }

  updateRow(index, rowData) {
    const rows = this.getRows();
    rows[index] = rowData;
    this.setRows(rows);
    return this;
  }

  getSelectedRow() {
    return this.selectedRow;
  }

  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    const headers = this.getHeaders();
    const rows    = this.getRows();

    if (headers.length > 0) {
      const thead     = document.createElement('thead');
      const headerRow = document.createElement('tr');
      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      this.element.appendChild(thead);
    }

    const tbody = document.createElement('tbody');
    rows.forEach((rowData, rowIndex) => {
      const tr = document.createElement('tr');
      tr.className = 'ui-table-row';

      // Поддержка и массива, и объекта — без изменений в данных на стороне caller
      const values = Array.isArray(rowData) ? rowData : Object.values(rowData);
      values.forEach(cell => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });

      tr.addEventListener('click', () => {
        // Снимаем выделение только внутри этой таблицы — не трогаем другие таблицы на странице
        this.element.querySelectorAll('tr.selected').forEach(r => r.classList.remove('selected'));
        tr.classList.add('selected');
        this.selectedRow = { index: rowIndex, data: rowData };
        this.emit('rowselect', { index: rowIndex, data: rowData });
      });

      tr.addEventListener('mouseenter', () => tr.classList.add('hover'));
      tr.addEventListener('mouseleave', () => tr.classList.remove('hover'));

      tbody.appendChild(tr);
    });

    this.element.appendChild(tbody);
    return this;
  }

  clearRows() {
    return this.setRows([]);
  }
}

export default Table;
