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
    this.setProperty('filterable', true);
    this.setProperty('filterText', '');
    this.setProperty('filters', {}); // {columnKey: {operator: 'contains', value: 'search'}}
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
   * Enable/disable filtering
   */
  setFilterable(filterable) {
    this.setProperty('filterable', filterable);
    this.render();
    return this;
  }

  /**
   * Add filter to column
   * @param {string} columnKey - Column to filter
   * @param {string} operator - 'equals', 'contains', 'startsWith', '>', '<', '>=', '<=', 'between'
   * @param {*} value - Filter value
   * @param {*} valueTo - For 'between' operator
   */
  addFilter(columnKey, operator, value, valueTo = null) {
    const filters = this.getProperty('filters', {});
    filters[columnKey] = { operator, value, valueTo };
    this.setProperty('filters', filters);
    this.applyFilters();
    this.emit('filterchange', { column: columnKey, operator, value });
    return this;
  }

  /**
   * Remove filter from column
   */
  removeFilter(columnKey) {
    const filters = this.getProperty('filters', {});
    delete filters[columnKey];
    this.setProperty('filters', filters);
    this.applyFilters();
    this.emit('filterchange', { column: columnKey, removed: true });
    return this;
  }

  /**
   * Get all filters
   */
  getFilters() {
    return this.getProperty('filters', {});
  }

  /**
   * Clear all filters
   */
  clearFilters() {
    this.setProperty('filters', {});
    this.applyFilters();
    this.emit('filterchange', { cleared: true });
    return this;
  }

  /**
   * Apply all filters to rows
   */
  applyFilters() {
    const rows = this.getProperty('rows', []);
    const filters = this.getProperty('filters', {});

    this.filteredRows = rows.filter(row => {
      // AND logic: all filters must pass
      for (const [columnKey, filterConfig] of Object.entries(filters)) {
        const value = row[columnKey];
        const { operator, value: filterValue, valueTo } = filterConfig;

        if (!this.matchesFilter(value, operator, filterValue, valueTo)) {
          return false;
        }
      }
      return true;
    });

    this.applySort();
    this.render();
  }

  /**
   * Check if value matches filter condition
   */
  matchesFilter(value, operator, filterValue, valueTo = null) {
    const val = String(value).toLowerCase();
    const filterVal = String(filterValue).toLowerCase();

    switch (operator) {
      case 'equals':
        return val === filterVal;
      case 'contains':
        return val.includes(filterVal);
      case 'startsWith':
        return val.startsWith(filterVal);
      case 'endsWith':
        return val.endsWith(filterVal);
      case '>':
        return parseFloat(value) > parseFloat(filterValue);
      case '<':
        return parseFloat(value) < parseFloat(filterValue);
      case '>=':
        return parseFloat(value) >= parseFloat(filterValue);
      case '<=':
        return parseFloat(value) <= parseFloat(filterValue);
      case 'between':
        return parseFloat(value) >= parseFloat(filterValue) && parseFloat(value) <= parseFloat(valueTo);
      default:
        return true;
    }
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

    // Map semantic suffix -> real native DOM event name
    const events = {
      Click: 'click',
      DoubleClick: 'dblclick',
      MouseOver: 'mouseover',
      MouseOut: 'mouseout',
      MouseDown: 'mousedown',
      MouseUp: 'mouseup'
    };
    Object.entries(events).forEach(([suffix, nativeName]) => {
      this.element.addEventListener(nativeName, handler(suffix));
    });

    return this;
  }

  /**
   * Render grid
   */
  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    let headers = this.getProperty('headers', []);
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

        // Add filter button
        if (this.getProperty('filterable')) {
          const filterBtn = document.createElement('button');
          filterBtn.className = 'ui-grid-filter-btn';
          filterBtn.innerHTML = '⚙️';
          filterBtn.setAttribute('aria-label', `Filter ${header.label}`);
          filterBtn.setAttribute('title', `Filter ${header.label}`);

          filterBtn.addEventListener('click', (e) => {
            e.stopPropagation(); // Don't trigger sort
            this.showFilterPopup(header.key, e.target);
          });

          th.appendChild(filterBtn);
        }

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
      // `table` already contains its <thead> from the header block above.
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

    // Scroll handler - track scroll position (bind once to avoid leaking
    // a new listener on every render)
    const gridContainer = this.element.parentElement;
    if (gridContainer && !this._scrollBound) {
      this._scrollBound = true;
      this._listen(gridContainer, 'scroll', (e) => {
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
        {
          let headers = this.getProperty('headers', []);
          this.focusedCol = Math.min(this.focusedCol + 1, headers.length);
          this.focusRow(rows);
        }
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
          let headersEnter = this.getProperty('headers', []);
          if (this.focusedCol < headersEnter.length + 1) {
            const cells = row.querySelectorAll('td');
            if (cells[this.focusedCol] && this.editableColumns[headersEnter[this.focusedCol - 1]?.key]) {
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
        {
          let headers = this.getProperty('headers', []);
          this.focusedCol = headers.length;
        }
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

  /**
   * Show filter popup for column
   */
  showFilterPopup(columnKey, triggerBtn) {
    // Close existing popup
    const existing = document.querySelector('.ui-grid-filter-popup');
    if (existing) existing.remove();

    const filters = this.getProperty('filters', {});
    const currentFilter = filters[columnKey];

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'ui-grid-filter-popup';

    // Operator select
    const operatorLabel = document.createElement('label');
    operatorLabel.textContent = 'Operator:';
    operatorLabel.style.display = 'block';
    operatorLabel.style.marginBottom = '8px';
    operatorLabel.style.fontSize = '12px';
    operatorLabel.style.fontWeight = 'bold';

    const operatorSelect = document.createElement('select');
    operatorSelect.className = 'ui-grid-filter-operator';
    operatorSelect.innerHTML = `
      <option value="equals">Equals</option>
      <option value="contains">Contains</option>
      <option value="startsWith">Starts with</option>
      <option value="endsWith">Ends with</option>
      <option value=">">Greater than</option>
      <option value="<">Less than</option>
      <option value=">=">Greater or equal</option>
      <option value="<=">Less or equal</option>
      <option value="between">Between</option>
    `;
    operatorSelect.value = currentFilter?.operator || 'contains';

    const operatorContainer = document.createElement('div');
    operatorContainer.style.marginBottom = '12px';
    operatorContainer.appendChild(operatorLabel);
    operatorContainer.appendChild(operatorSelect);
    popup.appendChild(operatorContainer);

    // Value input
    const valueLabel = document.createElement('label');
    valueLabel.textContent = 'Value:';
    valueLabel.style.display = 'block';
    valueLabel.style.marginBottom = '4px';
    valueLabel.style.fontSize = '12px';
    valueLabel.style.fontWeight = 'bold';

    const valueInput = document.createElement('input');
    valueInput.className = 'ui-grid-filter-value';
    valueInput.type = 'text';
    valueInput.placeholder = 'Enter value';
    valueInput.value = currentFilter?.value || '';
    valueInput.style.width = '100%';
    valueInput.style.padding = '6px';
    valueInput.style.marginBottom = '8px';
    valueInput.style.boxSizing = 'border-box';

    const valueContainer = document.createElement('div');
    valueContainer.style.marginBottom = '12px';
    valueContainer.appendChild(valueLabel);
    valueContainer.appendChild(valueInput);
    popup.appendChild(valueContainer);

    // Value "to" input (for between)
    const valueToInput = document.createElement('input');
    valueToInput.className = 'ui-grid-filter-value-to';
    valueToInput.type = 'text';
    valueToInput.placeholder = 'To value';
    valueToInput.value = currentFilter?.valueTo || '';
    valueToInput.style.width = '100%';
    valueToInput.style.padding = '6px';
    valueToInput.style.marginBottom = '8px';
    valueToInput.style.boxSizing = 'border-box';
    valueToInput.style.display = operatorSelect.value === 'between' ? 'block' : 'none';

    const valueToContainer = document.createElement('div');
    valueToContainer.style.marginBottom = '12px';
    valueToContainer.appendChild(valueToInput);
    popup.appendChild(valueToContainer);

    // Show/hide "to" input based on operator
    operatorSelect.addEventListener('change', () => {
      valueToInput.style.display = operatorSelect.value === 'between' ? 'block' : 'none';
    });

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.style.display = 'flex';
    btnContainer.style.gap = '6px';

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.className = 'ui-grid-filter-apply';
    applyBtn.style.flex = '1';
    applyBtn.style.padding = '6px 12px';
    applyBtn.style.backgroundColor = '#1677ff';
    applyBtn.style.color = 'white';
    applyBtn.style.border = 'none';
    applyBtn.style.borderRadius = '4px';
    applyBtn.style.cursor = 'pointer';
    applyBtn.style.fontSize = '12px';

    applyBtn.addEventListener('click', () => {
      const operator = operatorSelect.value;
      const value = valueInput.value;
      const valueTo = operatorSelect.value === 'between' ? valueToInput.value : null;

      if (value) {
        this.addFilter(columnKey, operator, value, valueTo);
      }
      popup.remove();
    });

    const clearBtn = document.createElement('button');
    clearBtn.textContent = 'Clear';
    clearBtn.className = 'ui-grid-filter-clear';
    clearBtn.style.flex = '1';
    clearBtn.style.padding = '6px 12px';
    clearBtn.style.backgroundColor = '#f0f0f0';
    clearBtn.style.color = '#333';
    clearBtn.style.border = '1px solid #d9d9d9';
    clearBtn.style.borderRadius = '4px';
    clearBtn.style.cursor = 'pointer';
    clearBtn.style.fontSize = '12px';

    clearBtn.addEventListener('click', () => {
      this.removeFilter(columnKey);
      popup.remove();
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.className = 'ui-grid-filter-close';
    closeBtn.style.width = '30px';
    closeBtn.style.padding = '6px';
    closeBtn.style.backgroundColor = '#f5f5f5';
    closeBtn.style.border = '1px solid #d9d9d9';
    closeBtn.style.borderRadius = '4px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.fontSize = '12px';

    closeBtn.addEventListener('click', () => {
      popup.remove();
    });

    btnContainer.appendChild(applyBtn);
    btnContainer.appendChild(clearBtn);
    btnContainer.appendChild(closeBtn);
    popup.appendChild(btnContainer);

    // Position popup near trigger button
    document.body.appendChild(popup);
    const rect = triggerBtn.getBoundingClientRect();
    popup.style.top = (rect.bottom + 5) + 'px';
    popup.style.left = rect.left + 'px';

    // Close on outside click
    setTimeout(() => {
      document.addEventListener('click', function closePopup(e) {
        if (!popup.contains(e.target) && e.target !== triggerBtn) {
          popup.remove();
          document.removeEventListener('click', closePopup);
        }
      });
    }, 0);
  }
}

export default Grid;
