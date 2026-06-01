/**
 * UIKit - Table Component
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

  /**
   * Set table headers
   */
  setHeaders(headers) {
    this.setProperty('headers', headers);
    this.render();
    return this;
  }

  /**
   * Get table headers
   */
  getHeaders() {
    return this.getProperty('headers', []);
  }

  /**
   * Set table rows (data)
   */
  setRows(rows) {
    this.setProperty('rows', rows);
    this.render();
    return this;
  }

  /**
   * Get table rows
   */
  getRows() {
    return this.getProperty('rows', []);
  }

  /**
   * Add row
   */
  addRow(rowData) {
    const rows = this.getRows();
    rows.push(rowData);
    this.setRows(rows);
    return this;
  }

  /**
   * Remove row by index
   */
  removeRow(index) {
    const rows = this.getRows();
    rows.splice(index, 1);
    this.setRows(rows);
    return this;
  }

  /**
   * Update row by index
   */
  updateRow(index, rowData) {
    const rows = this.getRows();
    rows[index] = rowData;
    this.setRows(rows);
    return this;
  }

  /**
   * Get selected row
   */
  getSelectedRow() {
    return this.selectedRow;
  }

  /**
   * Render table
   */
  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    const headers = this.getHeaders();
    const rows = this.getRows();

    // Create thead
    if (headers.length > 0) {
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      headers.forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      this.element.appendChild(thead);
    }

    // Create tbody
    const tbody = document.createElement('tbody');

    rows.forEach((rowData, rowIndex) => {
      const tr = document.createElement('tr');
      tr.className = 'ui-table-row';

      // Handle both array and object rows
      const values = Array.isArray(rowData) ? rowData : Object.values(rowData);

      values.forEach((cell, cellIndex) => {
        const td = document.createElement('td');
        td.textContent = cell;
        tr.appendChild(td);
      });

      // Add click handler
      tr.addEventListener('click', () => {
        // Remove previous selection (scoped to this table only)
        this.element.querySelectorAll('tr.selected').forEach(r => {
          r.classList.remove('selected');
        });

        // Add new selection
        tr.classList.add('selected');
        this.selectedRow = { index: rowIndex, data: rowData };
        this.emit('rowselect', { index: rowIndex, data: rowData });
      });

      // Add hover effect
      tr.addEventListener('mouseenter', () => {
        tr.classList.add('hover');
      });

      tr.addEventListener('mouseleave', () => {
        tr.classList.remove('hover');
      });

      tbody.appendChild(tr);
    });

    this.element.appendChild(tbody);
    return this;
  }

  /**
   * Clear table
   */
  clearRows() {
    this.setRows([]);
    return this;
  }
}

export default Table;
