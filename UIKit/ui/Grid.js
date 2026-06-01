/**
 * UIKit - Grid Component
 * Advanced table with sorting, filtering, pagination
 */

import { Base } from '../core/Base.js';

export class Grid extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-grid');

    this.setProperty('headers', []);
    this.setProperty('rows', []);
    this.setProperty('selectedRow', null);
    this.setProperty('sortBy', null);
    this.setProperty('sortOrder', 'asc');
    this.setProperty('sortable', true);
    this.setProperty('filterText', '');
    this.setProperty('pageSize', 50);
    this.setProperty('currentPage', 1);
    this.setProperty('editable', false);

    this.selectedRows = [];
    this.filteredRows = [];
    this.formatters = {}; // Custom cell formatters
    this.editableColumns = {}; // Columns that can be edited
    this.editingCell = null; // Currently editing cell
    this.columnWidths = {}; // Store column widths
    this.setProperty('resizable', false);
    this.setProperty('keyboard', true);
    this.focusedRow = -1;
    this.focusedCol = 0;
    this.setProperty('virtual', false);
    this.setProperty('rowHeight', 40);
    this.virtualScroller = null;
    this.currentRow = -1;
    this.currentColumn = -1;
    this.selectedRows = [];
    this.scrollLeft = 0;
    this.scrollTop = 0;

    // Add mouse event delegation
    this.addMouseEventHandlers();
  }

  /**
   * Set grid headers with column config
   * @param {Array} headers - [{ key: 'name', label: 'Name', width: '30%', sortable: true, formatter: fn }]
   */
  setHeaders(headers) {
    this.setProperty('headers', headers);
    this.render();
    return this;
  }

  /**
   * Set custom formatter for column
   * @param {string} columnKey - Column key
   * @param {Function} formatter - (value, row) => HTML string or element
   */
  setFormatter(columnKey, formatter) {
    this.formatters[columnKey] = formatter;
    return this;
  }

  /**
   * Enable inline editing
   */
  setEditable(editable) {
    this.setProperty('editable', editable);
    return this;
  }

  /**
   * Set column as editable
   */
  setEditableColumn(columnKey, editable = true) {
    this.editableColumns[columnKey] = editable;
    return this;
  }

  /**
   * Get edited values (modified rows)
   */
  getEditedRows() {
    // Return rows that have been modified
    return this.getProperty('rows', []).map((row, idx) => ({
      ...row,
      _originalIndex: idx
    }));
  }

  /**
   * Enable column resizing
   */
  setResizable(resizable) {
    this.setProperty('resizable', resizable);
    return this;
  }

  /**
   * Set column width
   */
  setColumnWidth(columnKey, width) {
    this.columnWidths[columnKey] = width;
    this.render();
    return this;
  }

  /**
   * Get column widths
   */
  getColumnWidths() {
    return this.columnWidths;
  }

  /**
   * Enable/disable sorting
   */
  setSortable(sortable) {
    this.setProperty('sortable', sortable);
    return this;
  }

  /**
   * Set sort column and order
   * @param {string} columnKey - Column to sort by
   * @param {string} order - 'asc', 'desc', or null
   */
  setSortColumn(columnKey, order = 'asc') {
    this.setProperty('sortBy', columnKey);
    this.setProperty('sortOrder', order);
    this.applySort();
    this.emit('sortchange', { column: columnKey, order });
    return this;
  }

  /**
   * Get current sort state
   */
  getSortState() {
    return {
      column: this.getProperty('sortBy'),
      order: this.getProperty('sortOrder')
    };
  }

  /**
   * Clear sort
   */
  clearSort() {
    this.setProperty('sortBy', null);
    this.setProperty('sortOrder', 'asc');
    this.applySort();
    this.emit('sortchange', { column: null, order: null });
    return this;
  }

  /**
   * Apply sorting to filtered rows
   */
  applySort() {
    const sortBy = this.getProperty('sortBy');
    const sortOrder = this.getProperty('sortOrder');

    if (!sortBy) {
      return; // No sort
    }

    this.filteredRows.sort((a, b) => {
      let aVal = a[sortBy];
      let bVal = b[sortBy];

      // Handle null/undefined
      if (aVal == null && bVal == null) return 0;
      if (aVal == null) return sortOrder === 'asc' ? 1 : -1;
      if (bVal == null) return sortOrder === 'asc' ? -1 : 1;

      // String comparison
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
        return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
      }

      // Number comparison
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'asc' ? aVal - bVal : bVal - aVal;
      }

      // Default: convert to string
      aVal = String(aVal).toLowerCase();
      bVal = String(bVal).toLowerCase();
      return sortOrder === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
    });

    this.render();
  }

  /**
   * Set grid rows (data)
   */
  setRows(rows) {
    this.setProperty('rows', rows);
    this.filteredRows = [...rows];
    this.render();
    return this;
  }

  /**
   * Add row
   */
  addRow(rowData) {
    const rows = this.getProperty('rows', []);
    rows.push(rowData);
    this.setRows(rows);
    return this;
  }

  /**
   * Remove row by index
   */
  removeRow(index) {
    const rows = this.getProperty('rows', []);
    rows.splice(index, 1);
    this.setRows(rows);
    return this;
  }

  /**
   * Update row by index
   */
  updateRow(index, rowData) {
    const rows = this.getProperty('rows', []);
    rows[index] = { ...rows[index], ...rowData };
    this.setRows(rows);
    return this;
  }

  /**
   * Set filter text
   */
  setFilter(text) {
    this.setProperty('filterText', text);
    this.applyFilter();
    this.render();
    return this;
  }

  /**
   * Apply filter to rows
   */
  applyFilter() {
    const filterText = this.getProperty('filterText', '').toLowerCase();
    const rows = this.getProperty('rows', []);

    if (!filterText) {
      this.filteredRows = [...rows];
    } else {
      this.filteredRows = rows.filter(row => {
        return Object.values(row).some(val =>
          String(val).toLowerCase().includes(filterText)
        );
      });
    }

    this.setProperty('currentPage', 1);
    return this;
  }

  /**
   * Sort by column
   */
  sortBy(key) {
    const current = this.getProperty('sortBy');
    let order = 'asc';

    if (current === key) {
      order = this.getProperty('sortOrder') === 'asc' ? 'desc' : 'asc';
    }

    this.setProperty('sortBy', key);
    this.setProperty('sortOrder', order);

    this.filteredRows.sort((a, b) => {
      let aVal = a[key];
      let bVal = b[key];

      // Handle numbers
      if (!isNaN(aVal) && !isNaN(bVal)) {
        aVal = Number(aVal);
        bVal = Number(bVal);
      }

      if (order === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    this.render();
    return this;
  }

  /**
   * Get selected rows
   */
  getSelectedRows() {
    return this.selectedRows;
  }

  /**
   * Clear selection
   */
  clearSelection() {
    this.selectedRows = [];
    this.setProperty('selectedRow', null);
    if (this.element) {
      this.element.querySelectorAll('tr.selected').forEach(tr => {
        tr.classList.remove('selected');
      });
    }
    return this;
  }

  /**
   * Add mouse event handlers to element (click, double-click, etc)
   */
  addMouseEventHandlers() {
    const handler = (eventType) => {
      return (e) => {
        const cell = e.target.closest('td');
        const row = e.target.closest('tr');
        const header = e.target.closest('[data-column-header]');

        if (header) {
          const colIdx = header.getAttribute('data-column-header');
          this.emit(`header${eventType}`, { event: e, column: colIdx });
        } else if (cell && row) {
          const colIdx = Array.from(row.children).indexOf(cell);
          const rowIdx = this.element.querySelector('tbody').children.length > 0
            ? Array.from(this.element.querySelector('tbody').children).indexOf(row)
            : -1;
          this.emit(`cell${eventType}`, { event: e, column: colIdx, row: rowIdx });
        } else if (row) {
          const rowIdx = this.element.querySelector('tbody').children.length > 0
            ? Array.from(this.element.querySelector('tbody').children).indexOf(row)
            : -1;
          this.emit(`row${eventType}`, { event: e, row: rowIdx });
        }
      };
    };

    // Mouse events: Click, DoubleClick, MouseOver, MouseOut, MouseDown, MouseUp
    const events = ['Click', 'DoubleClick', 'MouseOver', 'MouseOut', 'MouseDown', 'MouseUp'];
    events.forEach(evt => {
      const eventName = evt.charAt(0).toLowerCase() + evt.slice(1);
      this.element.addEventListener(eventName, handler(evt));
    });

    return this;
  }

  /**
   * Render grid
   */
  render() {
    if (!this.element) return;

    this.element.innerHTML = '';

    const headers = this.getProperty('headers', []);
    const pageSize = this.getProperty('pageSize', 50);
    const currentPage = this.getProperty('currentPage', 1);
    const sortBy = this.getProperty('sortBy');
    const sortOrder = this.getProperty('sortOrder', 'asc');

    // Toolbar
    const toolbar = document.createElement('div');
    toolbar.className = 'ui-grid-toolbar';

    const searchInput = document.createElement('input');
    searchInput.className = 'ui-grid-search';
    searchInput.type = 'text';
    searchInput.placeholder = 'Search...';
    searchInput.value = this.getProperty('filterText', '');

    searchInput.addEventListener('input', (e) => {
      this.setFilter(e.target.value);
    });

    toolbar.appendChild(searchInput);
    this.element.appendChild(toolbar);

    // Table
    const table = document.createElement('table');
    table.className = 'ui-grid-table';

    // Create thead
    if (headers.length > 0) {
      const thead = document.createElement('thead');
      const headerRow = document.createElement('tr');

      // Checkbox column
      const thCheck = document.createElement('th');
      thCheck.style.width = '40px';
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.addEventListener('change', (e) => {
        const rows = this.element.querySelectorAll('tbody tr');
        if (e.target.checked) {
          rows.forEach(tr => tr.classList.add('selected'));
        } else {
          rows.forEach(tr => tr.classList.remove('selected'));
        }
      });
      thCheck.appendChild(checkbox);
      headerRow.appendChild(thCheck);

      // Data columns
      headers.forEach((header, colIdx) => {
        const th = document.createElement('th');
        const width = this.columnWidths[header.key] || header.width;
        if (width) {
          th.style.width = width;
        }

        const label = document.createElement('span');
        label.textContent = header.label || header.key;

        if (header.sortable !== false && this.getProperty('sortable')) {
          th.style.cursor = 'pointer';
          th.classList.add('sortable-header');

          // Click handler for sorting cycle: asc → desc → none
          th.addEventListener('click', () => {
            const currentSort = this.getSortState();
            let newOrder = 'asc';

            if (currentSort.column === header.key) {
              // Cycle: asc → desc → none
              if (currentSort.order === 'asc') {
                newOrder = 'desc';
              } else if (currentSort.order === 'desc') {
                this.clearSort();
                return;
              }
            }

            this.setSortColumn(header.key, newOrder);
          });

          // Sort indicator
          if (sortBy === header.key) {
            const indicator = document.createElement('span');
            indicator.className = 'sort-indicator';
            indicator.style.marginLeft = '6px';
            indicator.textContent = sortOrder === 'asc' ? '↑' : '↓';
            indicator.setAttribute('aria-label', `Sorted ${sortOrder}ending`);
            label.appendChild(indicator);
          }
        }

        th.appendChild(label);

        // Add resize handle
        if (this.getProperty('resizable') && colIdx < headers.length - 1) {
          const resizer = document.createElement('div');
          resizer.className = 'ui-grid-resizer';
          resizer.addEventListener('mousedown', (e) => this.startResize(e, header.key, th));
          th.appendChild(resizer);
        }

        headerRow.appendChild(th);
      });

      thead.appendChild(headerRow);
      table.appendChild(thead);
    }

    // Create tbody with pagination or virtual scrolling
    const tbody = document.createElement('tbody');
    let paginatedRows, startIndex;

    if (this.getProperty('virtual')) {
      // Virtual scrolling - render all but show only visible
      paginatedRows = this.filteredRows;
      startIndex = 0;

      // Create virtual scroller container
      const tbodyWrapper = document.createElement('div');
      tbodyWrapper.className = 'ui-grid-virtual-wrapper';
      tbodyWrapper.style.height = '400px';
      tbodyWrapper.style.overflowY = 'auto';
      tbodyWrapper.style.border = '1px solid #d9d9d9';

      const virtualTable = document.createElement('table');
      virtualTable.className = 'ui-grid-table';
      const virtualTbody = document.createElement('tbody');

      const rowHeight = this.getProperty('rowHeight', 40);
      const visibleRows = Math.ceil(tbodyWrapper.offsetHeight / rowHeight) + 2;
      let scrollTop = tbodyWrapper.scrollTop || 0;

      tbodyWrapper.addEventListener('scroll', () => {
        scrollTop = tbodyWrapper.scrollTop;
      });

      const renderVisibleRows = () => {
        const firstVisibleIdx = Math.floor(scrollTop / rowHeight);
        const lastVisibleIdx = Math.min(firstVisibleIdx + visibleRows, paginatedRows.length);

        virtualTbody.innerHTML = '';

        // Add spacer for scrolled items
        if (firstVisibleIdx > 0) {
          const spacer = document.createElement('tr');
          spacer.style.height = (firstVisibleIdx * rowHeight) + 'px';
          virtualTbody.appendChild(spacer);
        }

        // Render visible rows
        for (let i = firstVisibleIdx; i < lastVisibleIdx; i++) {
          this.renderGridRow(virtualTbody, paginatedRows[i], headers, startIndex + i, i);
        }
      };

      renderVisibleRows();
      tbodyWrapper.addEventListener('scroll', renderVisibleRows);

      virtualTable.appendChild(virtualTbody);
      tbodyWrapper.appendChild(virtualTable);
      table.appendChild(thead);
      this.element.appendChild(table);
      this.element.appendChild(tbodyWrapper);

      return; // Skip regular pagination for virtual scroll
    } else {
      // Regular pagination
      startIndex = (currentPage - 1) * pageSize;
      const endIndex = startIndex + pageSize;
      paginatedRows = this.filteredRows.slice(startIndex, endIndex);
    }

    paginatedRows.forEach((rowData, idx) => {
      this.renderGridRow(tbody, rowData, headers, startIndex + idx, idx);
    });

    table.appendChild(tbody);
    this.element.appendChild(table);

    // Scroll handler - track scroll position
    const gridContainer = this.element.parentElement;
    if (gridContainer) {
      gridContainer.addEventListener('scroll', (e) => {
        const prevScrollLeft = this.scrollLeft;
        const prevScrollTop = this.scrollTop;
        this.scrollLeft = gridContainer.scrollLeft;
        this.scrollTop = gridContainer.scrollTop;

        if (prevScrollLeft !== this.scrollLeft) {
          this.emit('scrollLeftChanged', { value: this.scrollLeft });
        }
        if (prevScrollTop !== this.scrollTop) {
          this.emit('scrollTopChanged', { value: this.scrollTop });
        }
      });
    }

    // Add keyboard navigation
    if (this.getProperty('keyboard')) {
      this.element.addEventListener('keydown', (e) => this.handleKeydown(e, tbody));
    }

    // Pagination
    if (this.filteredRows.length > pageSize) {
      const pagination = document.createElement('div');
      pagination.className = 'ui-grid-pagination';

      const totalPages = Math.ceil(this.filteredRows.length / pageSize);

      const prevBtn = document.createElement('button');
      prevBtn.className = 'ui-grid-page-btn';
      prevBtn.textContent = '← Previous';
      prevBtn.disabled = currentPage === 1;
      prevBtn.addEventListener('click', () => {
        if (currentPage > 1) {
          this.setProperty('currentPage', currentPage - 1);
          this.render();
        }
      });

      const info = document.createElement('span');
      info.className = 'ui-grid-page-info';
      info.textContent = `Page ${currentPage} of ${totalPages}`;

      const nextBtn = document.createElement('button');
      nextBtn.className = 'ui-grid-page-btn';
      nextBtn.textContent = 'Next →';
      nextBtn.disabled = currentPage === totalPages;
      nextBtn.addEventListener('click', () => {
        if (currentPage < totalPages) {
          this.setProperty('currentPage', currentPage + 1);
          this.render();
        }
      });

      pagination.appendChild(prevBtn);
      pagination.appendChild(info);
      pagination.appendChild(nextBtn);
      this.element.appendChild(pagination);
    }
  }

  /**
   * Start editing cell
   */
  startEditCell(td, rowData, columnKey, rowIndex) {
    // Cancel previous edit
    if (this.editingCell) {
      this.cancelEdit();
    }

    const value = rowData[columnKey];
    const input = document.createElement('input');
    input.type = 'text';
    input.className = 'ui-grid-edit-input';
    input.value = value || '';

    const originalContent = td.innerHTML;
    td.innerHTML = '';
    td.appendChild(input);
    td.classList.add('editing');

    input.focus();
    input.select();

    this.editingCell = { td, input, rowData, columnKey, rowIndex, originalContent };

    const saveEdit = () => {
      const newValue = input.value;
      rowData[columnKey] = newValue;
      td.innerHTML = originalContent.includes('<') ? newValue : newValue;
      td.classList.remove('editing');
      this.editingCell = null;
      this.emit('celledit', { row: rowData, column: columnKey, value: newValue, rowIndex });
    };

    const cancelEdit = () => {
      td.innerHTML = originalContent;
      td.classList.remove('editing');
      this.editingCell = null;
    };

    input.addEventListener('blur', saveEdit);
    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        saveEdit();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        cancelEdit();
      }
    });
  }

  /**
   * Cancel current edit
   */
  cancelEdit() {
    if (this.editingCell) {
      const { td, originalContent } = this.editingCell;
      td.innerHTML = originalContent;
      td.classList.remove('editing');
      this.editingCell = null;
    }
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(e, tbody) {
    if (!tbody) return;

    const rows = tbody.querySelectorAll('tr');
    if (rows.length === 0) return;

    let handled = false;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        this.focusedRow = Math.min(this.focusedRow + 1, rows.length - 1);
        this.focusRow(rows);
        handled = true;
        break;

      case 'ArrowUp':
        e.preventDefault();
        this.focusedRow = Math.max(this.focusedRow - 1, 0);
        this.focusRow(rows);
        handled = true;
        break;

      case 'ArrowRight':
        e.preventDefault();
        const headers = this.getProperty('headers', []);
        this.focusedCol = Math.min(this.focusedCol + 1, headers.length);
        this.focusRow(rows);
        handled = true;
        break;

      case 'ArrowLeft':
        e.preventDefault();
        this.focusedCol = Math.max(this.focusedCol - 1, 0);
        this.focusRow(rows);
        handled = true;
        break;

      case ' ':
        e.preventDefault();
        // Toggle selection
        if (this.focusedRow >= 0 && this.focusedRow < rows.length) {
          const checkbox = rows[this.focusedRow].querySelector('input[type="checkbox"]');
          if (checkbox && !checkbox.classList.contains('ui-grid-checkbox')) return;
          if (checkbox) checkbox.click();
        }
        handled = true;
        break;

      case 'Enter':
        e.preventDefault();
        // Start editing if in edit mode
        if (this.focusedRow >= 0) {
          const row = rows[this.focusedRow];
          const headers = this.getProperty('headers', []);
          if (this.focusedCol < headers.length + 1) {
            const cells = row.querySelectorAll('td');
            if (cells[this.focusedCol] && this.editableColumns[headers[this.focusedCol - 1]?.key]) {
              cells[this.focusedCol].click();
            }
          }
        }
        handled = true;
        break;

      case 'Home':
        e.preventDefault();
        this.focusedCol = 0;
        handled = true;
        break;

      case 'End':
        e.preventDefault();
        const headers = this.getProperty('headers', []);
        this.focusedCol = headers.length;
        handled = true;
        break;
    }

    if (handled) {
      // Set focus to grid so keyboard events keep working
      this.element.focus();
    }
  }

  /**
   * Focus a row
   */
  focusRow(rows) {
    rows.forEach((row, idx) => {
      if (idx === this.focusedRow) {
        row.classList.add('keyboard-focus');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        row.classList.remove('keyboard-focus');
      }
    });
  }

  /**
   * Enable/disable keyboard navigation
   */
  setKeyboardNav(enabled) {
    this.setProperty('keyboard', enabled);
    return this;
  }

  /**
   * Enable virtual scrolling for large datasets
   */
  setVirtualScroll(enabled, rowHeight = 40) {
    this.setProperty('virtual', enabled);
    this.setProperty('rowHeight', rowHeight);
    this.render();
    return this;
  }

  /**
   * Get virtual scroll info
   */
  getVirtualScrollInfo() {
    return {
      enabled: this.getProperty('virtual'),
      rowHeight: this.getProperty('rowHeight'),
      totalRows: this.filteredRows.length
    };
  }

  /**
   * Render a grid row (shared by pagination and virtual scroll)
   */
  renderGridRow(tbody, rowData, headers, absoluteIdx, visibleIdx) {
    const tr = document.createElement('tr');
    tr.className = 'ui-grid-row';

    // Checkbox
    const tdCheck = document.createElement('td');
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.addEventListener('change', (e) => {
      if (e.target.checked) {
        tr.classList.add('selected');
        if (!this.selectedRows.includes(rowData)) {
          this.selectedRows.push(rowData);
        }
      } else {
        tr.classList.remove('selected');
        this.selectedRows = this.selectedRows.filter(r => r !== rowData);
      }
      this.emit('selectionchange', { selected: this.selectedRows });
    });
    tdCheck.appendChild(checkbox);
    tr.appendChild(tdCheck);

    // Data cells
    headers.forEach((header, colIdx) => {
      const td = document.createElement('td');
      const value = rowData[header.key];
      const isEditable = this.getProperty('editable') && this.editableColumns[header.key];

      // Use formatter
      const formatter = this.formatters[header.key] || header.formatter;
      if (formatter && typeof formatter === 'function') {
        const formatted = formatter(value, rowData);
        if (formatted instanceof HTMLElement) {
          td.appendChild(formatted);
        } else if (typeof formatted === 'string') {
          td.innerHTML = formatted;
        } else {
          td.textContent = formatted || '';
        }
      } else {
        if (value && typeof value === 'string' && (value.includes('<') || value.includes('\n'))) {
          td.innerHTML = value.replace(/\n/g, '<br>');
        } else {
          td.textContent = value || '';
        }
      }

      if (isEditable && !formatter) {
        td.style.cursor = 'pointer';
        td.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          this.startEditCell(td, rowData, header.key, absoluteIdx);
        });
      }

      tr.appendChild(td);
    });

    // Click handler
    tr.addEventListener('click', (e) => {
      if (e.target.tagName !== 'INPUT') {
        // Determine which cell was clicked
        const td = e.target.closest('td');
        let colIdx = -1;
        if (td) {
          colIdx = Array.from(tr.querySelectorAll('td')).indexOf(td);
        }

        // Update current cell
        const prevRow = this.currentRow;
        const prevCol = this.currentColumn;
        this.currentRow = absoluteIdx;
        this.currentColumn = colIdx;

        // Emit state change events
        if (prevRow !== this.currentRow) {
          this.emit('currentRowChanged', { row: this.currentRow });
        }
        if (prevCol !== this.currentColumn && colIdx >= 0) {
          this.emit('currentColumnChanged', { column: this.currentColumn });
        }

        // Selection
        this.clearSelection();
        tr.classList.add('selected');
        this.selectedRows = [rowData];
        this.setProperty('selectedRow', rowData);
        this.emit('rowselect', { row: rowData, index: absoluteIdx });
        this.emit('selectionchanged', { selected: this.selectedRows, indices: [absoluteIdx] });
      }
    });

    // Hover
    tr.addEventListener('mouseenter', () => {
      tr.classList.add('hover');
    });

    tr.addEventListener('mouseleave', () => {
      tr.classList.remove('hover');
    });

    tbody.appendChild(tr);
  }

  /**
   * Start column resize
   */
  startResize(e, columnKey, th) {
    e.preventDefault();
    const startX = e.clientX;
    const startWidth = th.offsetWidth;

    const handleMouseMove = (moveEvent) => {
      const newWidth = startWidth + (moveEvent.clientX - startX);
      if (newWidth > 50) { // Minimum width
        th.style.width = newWidth + 'px';
        this.columnWidths[columnKey] = newWidth + 'px';
      }
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      this.emit('columnresize', { column: columnKey, width: this.columnWidths[columnKey] });
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }
}

export default Grid;
