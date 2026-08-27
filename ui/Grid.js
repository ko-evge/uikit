/**
 * UIKit — Grid Component
 *
 * Самый сложный компонент UIKit. Ключевые архитектурные решения:
 *
 * filteredRows — отдельный массив, а не вычисляемый:
 * Сортировка и фильтрация мутируют filteredRows без изменения оригинального
 * rows. Это позволяет снять фильтр и вернуть полные данные без повторного
 * запроса к серверу.
 *
 * addMouseEventHandlers() в конструкторе (делегирование событий):
 * Один слушатель на element вместо слушателя на каждой ячейке.
 * При 1000 строк × 10 колонок — 10000 addEventListener vs 6 (по событию).
 * Делегирование работает через e.target.closest('td'/'tr'/'[data-column-header]').
 *
 * virtual scroll vs pagination:
 * Пагинация — простота, но требует клика для перехода.
 * Virtual scroll — непрерывная прокрутка, но сложнее (spacer-строки, recalc).
 * По умолчанию пагинация (pageSize=50). Virtual включается явно для 10K+ строк.
 *
 * _scrollBound флаг:
 * render() вызывается при каждом setRows/sort/filter. Без флага каждый
 * render добавлял бы новый scroll-слушатель на parentElement.
 *
 * showFilterPopup() — popup в document.body, а не внутри ячейки:
 * Внутри таблицы popup обрезается overflow:hidden родителей.
 * Позиционируем через getBoundingClientRect() от кнопки-триггера.
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
    this.setProperty('customFilterPopupWidth', null);
    this.setProperty('multiSelect', false); // Show checkboxes for multi-select
    this.setProperty('highlightRow', true); // Highlight current row

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
    this.setProperty('rowHeight', 16);
    this.virtualScroller = null;
    this.currentRow = -1;
    this.currentColumn = -1;
    this.scrollLeft = 0;
    this.scrollTop = 0;

    this.table = null;
    this.thead = null;
    this.tbody = null;

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

  setRowStyle(fn) {
    this._rowStyleFn = fn;
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
   * Set custom width for filter popup
   */
  setFilterPopupWidth(width) {
    this.setProperty('customFilterPopupWidth', width);
    return this;
  }

  /**
   * Возвращает ВСЕ строки с добавленным _originalIndex.
   * Отслеживания «изменённых» строк нет — inline-редактирование мутирует
   * rowData напрямую, поэтому caller получает уже актуальные значения.
   * Название сохранено для обратной совместимости.
   */
  getEditedRows() {
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
   * Единый конвейер данных: rows → колоночные фильтры → текстовый поиск → сортировка.
   *
   * Раньше applyFilters/applyFilter/applySort были независимыми и каждый
   * перезаписывал filteredRows целиком — текстовый поиск молча сбрасывал
   * колоночные фильтры и наоборот, а у сортировки было два разных компаратора.
   * Теперь любое изменение (фильтр, поиск, сортировка, setRows) проходит
   * весь конвейер заново, и состояния не теряют друг друга.
   */
  _rebuild() {
    const rows = this.getProperty('rows', []);
    const filters = this.getProperty('filters', {});
    const filterText = String(this.getProperty('filterText', '') ?? '').toLowerCase();

    let result = rows;

    // Колоночные фильтры, AND: первый несовпавший отбрасывает строку.
    // OR не реализован — для справочников ИМС достаточно AND.
    if (Object.keys(filters).length > 0) {
      result = result.filter(row => {
        for (const [columnKey, { operator, value, valueTo }] of Object.entries(filters)) {
          if (!this.matchesFilter(row[columnKey], operator, value, valueTo)) return false;
        }
        return true;
      });
    }

    // Текстовый поиск поверх колоночных фильтров — только по полям видимых
    // колонок (headers[].key), не по всему объекту строки. Раньше искало по
    // Object.values(row) целиком, включая скрытые служебные поля (PK, сырые
    // коды типа st_prj='0'/'1'), которых нет ни в одной колонке — строка
    // могла совпасть с запросом по причине, невидимой для пользователя.
    if (filterText) {
      const headers = this.getProperty('headers', []);
      const keys = headers.map(h => h.key);
      result = result.filter(row =>
        keys.some(k => String(row[k] ?? '').toLowerCase().includes(filterText))
      );
    }

    // Копия обязательна: sort() мутирует, а rows должен остаться нетронутым
    this.filteredRows = result === rows ? [...rows] : result;

    const sortBy = this.getProperty('sortBy');
    if (sortBy) {
      const sortOrder = this.getProperty('sortOrder', 'asc');
      this.filteredRows.sort((a, b) => this._compare(a[sortBy], b[sortBy], sortOrder));
    }

    // После фильтрации текущая страница может оказаться за пределами данных
    const pageSize = this.getProperty('pageSize', 50);
    const totalPages = Math.max(1, Math.ceil(this.filteredRows.length / pageSize));
    if (this.getProperty('currentPage', 1) > totalPages) {
      this.setProperty('currentPage', totalPages);
    }

    this.render();
    return this;
  }

  /**
   * Единственный компаратор сортировки (раньше их было два с разным
   * поведением: applySort корректный, sortBy() — нестабильный без возврата 0).
   */
  _compare(aVal, bVal, order) {
    if (aVal == null && bVal == null) return 0;
    if (aVal == null) return order === 'asc' ? 1 : -1;
    if (bVal == null) return order === 'asc' ? -1 : 1;

    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return order === 'asc' ? aVal - bVal : bVal - aVal;
    }

    const aStr = String(aVal).toLowerCase();
    const bStr = String(bVal).toLowerCase();
    return order === 'asc' ? aStr.localeCompare(bStr) : bStr.localeCompare(aStr);
  }

  /** @deprecated прямой вызов не нужен — конвейер запускается из addFilter/removeFilter */
  applyFilters() {
    return this._rebuild();
  }

  /**
   * Check if value matches filter condition
   */
  matchesFilter(value, operator, filterValue, valueTo = null) {
    // null/undefined → пустая строка, иначе String(null)='null' ловился бы contains-фильтром
    const val = value == null ? '' : String(value).toLowerCase();
    const filterVal = filterValue == null ? '' : String(filterValue).toLowerCase();

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

  /** @deprecated прямой вызов не нужен — конвейер запускается из setSortColumn/clearSort */
  applySort() {
    return this._rebuild();
  }

  /**
   * Set grid rows (data).
   * Активные фильтры и сортировка СОХРАНЯЮТСЯ и применяются к новым данным —
   * перезагрузка с сервера не сбрасывает то, что настроил пользователь.
   */
  setRows(rows) {
    this.setProperty('rows', rows);
    return this._rebuild();
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
   * Set filter text (текстовый поиск по всем полям).
   * Не затирает колоночные фильтры — работает поверх них через общий конвейер.
   */
  setFilter(text) {
    this.setProperty('filterText', text);
    this.setProperty('currentPage', 1);
    return this._rebuild();
  }

  /** @deprecated прямой вызов не нужен — конвейер запускается из setFilter */
  applyFilter() {
    return this._rebuild();
  }

  /**
   * Sort by column (toggle: повторный вызов по той же колонке меняет направление).
   * Тонкая обёртка над setSortColumn — раньше здесь был второй,
   * нестабильный компаратор, дублировавший applySort.
   */
  sortBy(key) {
    const order = (this.getProperty('sortBy') === key && this.getProperty('sortOrder') === 'asc')
      ? 'desc' : 'asc';
    return this.setSortColumn(key, order);
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
   * Get table element
   */
  getTable() {
    return this.table;
  }

  /**
   * Get table header (thead)
   */
  getHeaderElement() {
    return this.thead;
  }

  /**
   * Get table body (tbody)
   */
  getBodyElement() {
    return this.tbody;
  }

  /**
   * Делегирование мышиных событий: один слушатель на всю таблицу.
   * При клике определяем цель (header / cell / row) через closest() и
   * генерируем семантические события (headerClick, cellClick, rowClick).
   * Это дешевле чем addEventListener на каждой ячейке при 1000+ строк.
   */
  addMouseEventHandlers() {
    const handler = (eventType) => {
      return (e) => {
        const cell = e.target.closest('td');
        const row = e.target.closest('tr');
        const header = e.target.closest('[data-column-header]');

        // Индекс строки берём из data-row-index (индекс в filteredRows),
        // а не из позиции <tr> в DOM — при пагинации и virtual scroll
        // позиция в tbody не совпадает с индексом данных
        const rowIdxOf = (tr) => {
          const ds = tr?.dataset?.rowIndex;
          return ds !== undefined ? parseInt(ds, 10) : -1;
        };

        if (header) {
          const colIdx = header.getAttribute('data-column-header');
          this.emit(`header${eventType}`, { event: e, column: colIdx });
        } else if (row && rowIdxOf(row) >= 0) {
          // row-событие всегда для валидной строки; cell-событие — дополнительно,
          // если клик попал именно в ячейку. Раньше cell-ветка была elseif перед
          // row-веткой, поэтому rowClick/rowDoubleClick никогда не срабатывали —
          // почти любой клик внутри строки попадает в <td> (closest('td') истинно).
          if (cell) {
            const colIdx = Array.from(row.children).indexOf(cell);
            this.emit(`cell${eventType}`, { event: e, column: colIdx, row: rowIdxOf(row) });
          }
          this.emit(`row${eventType}`, { event: e, row: rowIdxOf(row) });
        }
        // Строки без data-row-index (thead, spacer виртуального скролла) не эмитят
        // row/cell-события — раньше клик по заголовку давал rowClick с row=-1
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

  // setProperty('hideToolbar', true) — самое частое место, где порядок вызовов
  // ловил всех: если это шло ДО setHeaders()/setRows() (которые и вызывают
  // render()), первый рендер уже успевал нарисовать панель поиска с default
  // hideToolbar=false, а сама setProperty() рендер не вызывает — панель
  // оставалась навсегда, пока не придёт следующий setRows(). Теперь
  // hideToolbar перерисовывает сам себя, порядок вызовов больше не важен.
  onPropertyChanged(name) {
    if (name === 'hideToolbar' && this.element) this.render();
  }

  /**
   * Render grid
   */
  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    // Styles handled by CSS class .ui-grid
    this.element.innerHTML = '';

    let headers = this.getProperty('headers', []);
    const pageSize = this.getProperty('pageSize', 50);
    const currentPage = this.getProperty('currentPage', 1);
    const sortBy = this.getProperty('sortBy');
    const sortOrder = this.getProperty('sortOrder', 'asc');

    // Toolbar (optional - can be hidden if parent handles search)
    const hideToolbar = this.getProperty('hideToolbar', false);
    if (!hideToolbar) {
      const toolbar = document.createElement('div');
      toolbar.className = 'ui-grid-toolbar';

      const searchWrap = document.createElement('div');
      searchWrap.className = 'ui-grid-search-wrap';

      const searchInput = document.createElement('input');
      searchInput.className = 'ui-grid-search';
      searchInput.type = 'text';
      searchInput.placeholder = 'Search… (Enter)';
      searchInput.value = this.getProperty('filterText', '');
      // Явно называем, по каким колонкам ищет (см. _rebuild()) — поиск идёт
      // только по headers[].key, не по всем полям строки, и без подсказки
      // непонятно, почему конкретный запрос что-то находит или не находит.
      const searchableCols = headers.map(h => h.label || h.key).join(', ');
      searchInput.title = searchableCols ? `Search in: ${searchableCols}` : 'Search';

      // По Enter, не по каждой букве: setFilter() → _rebuild() → полный render(),
      // который пересоздаёт этот же <input> — на 'input' фокус слетал после
      // первого символа, и дальнейший ввод никуда не попадал.
      searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') this.setFilter(e.target.value);
      });

      const clearBtn = document.createElement('button');
      clearBtn.type = 'button';
      // ui-button — переиспользуем настоящий стиль кнопок приложения (цвет/hover/active),
      // ui-grid-search-clear — только под подгонку размера в строке поиска.
      clearBtn.className = 'ui-button ui-grid-search-clear';
      clearBtn.textContent = 'Clear';
      clearBtn.addEventListener('click', () => this.setFilter(''));

      searchWrap.append(searchInput, clearBtn);
      toolbar.appendChild(searchWrap);
      this.element.appendChild(toolbar);
    }

    // Table wrapper for scrolling
    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'ui-grid-table-wrapper';

    // Table
    const table = document.createElement('table');
    table.className = 'ui-grid-table';
    table.setAttribute('tabindex', '0'); // Enable keyboard focus
    this.table = table;

    // Create thead
    if (headers.length > 0) {
      const thead = document.createElement('thead');
      this.thead = thead;
      const headerRow = document.createElement('tr');

      // Checkbox column (if multiSelect enabled)
      if (this.getProperty('multiSelect')) {
        const thCheck = document.createElement('th');
        thCheck.style.width = '40px';
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', (e) => {
          // Синхронизируем и DOM, и selectedRows — раньше менялся только CSS-класс,
          // и getSelectedRows() после "выбрать всё" возвращал пустой массив
          const trs = this.element.querySelectorAll('tbody tr.ui-grid-row');
          this.selectedRows = [];
          trs.forEach(tr => {
            tr.classList.toggle('selected', e.target.checked);
            const cb = tr.querySelector('input[type="checkbox"]');
            if (cb) cb.checked = e.target.checked;
            if (e.target.checked) {
              const row = this.filteredRows[parseInt(tr.dataset.rowIndex, 10)];
              if (row) this.selectedRows.push(row);
            }
          });
          this.emit('selectionchange', { selected: this.selectedRows });
        });
        thCheck.appendChild(checkbox);
        headerRow.appendChild(thCheck);
      }

      // Data columns
      headers.forEach((header, colIdx) => {
        const th = document.createElement('th');
        // data-column-header — маркер для делегирования: по нему addMouseEventHandlers
        // отличает клик по заголовку (headerClick) от клика по строке. Без атрибута
        // события header* не срабатывали вовсе, а клики по thead шли как rowClick(-1).
        th.setAttribute('data-column-header', header.key);
        const width = this.columnWidths[header.key] || header.width;
        if (width) {
          th.style.width = width;
        }
        // Заголовок выравниваем как данные под ним — иначе "Qty"/"Price" визуально
        // левее чисел в столбце, хотя align:'right' у этих колонок задан.
        if (header.align) th.style.textAlign = header.align;

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
    this.tbody = tbody;
    let paginatedRows, startIndex;

    if (this.getProperty('virtual')) {
      // Virtual scroll: рендерим только видимые строки + spacer-отступы.
      // Spacer сверху — tr с высотой = firstVisibleIdx * rowHeight —
      // создаёт иллюзию что строки выше реально существуют.
      // При скролле пересчитываем firstVisibleIdx и перерисовываем tbody.
      paginatedRows = this.filteredRows;
      startIndex = 0;

      const tbodyWrapper = document.createElement('div');
      tbodyWrapper.className = 'ui-grid-virtual-wrapper';
      // height:100% — не hardcode 400px, чтобы заполнять контейнер целиком
      tbodyWrapper.style.height = '100%';
      tbodyWrapper.style.overflowY = 'auto';
      // border — из .ui-grid-virtual-wrapper (components.css), не хардкод здесь

      const virtualTable = document.createElement('table');
      virtualTable.className = 'ui-grid-table';
      const virtualTbody = document.createElement('tbody');

      const rowHeight = this.getProperty('rowHeight', 16);

      const renderVisibleRows = () => {
        // Высоту окна считаем на момент вызова, не при построении: wrapper ещё
        // не в DOM во время render() и offsetHeight там был бы 0 (рендерились
        // только 2 строки). Fallback 400 — на случай вызова до вставки в DOM.
        const viewportH = tbodyWrapper.clientHeight || 400;
        const visibleRows = Math.ceil(viewportH / rowHeight) + 2;
        const scrollTop = tbodyWrapper.scrollTop || 0;
        const firstVisibleIdx = Math.floor(scrollTop / rowHeight);
        const lastVisibleIdx = Math.min(firstVisibleIdx + visibleRows, paginatedRows.length);

        virtualTbody.innerHTML = '';

        // Spacer сверху — место прокрученных строк
        if (firstVisibleIdx > 0) {
          const spacer = document.createElement('tr');
          spacer.style.height = (firstVisibleIdx * rowHeight) + 'px';
          virtualTbody.appendChild(spacer);
        }

        for (let i = firstVisibleIdx; i < lastVisibleIdx; i++) {
          this.renderGridRow(virtualTbody, paginatedRows[i], headers, startIndex + i, i);
        }

        // Spacer снизу — без него scrollHeight равнялся высоте видимых строк,
        // полоса прокрутки врала и до конца данных было не доскроллить
        if (lastVisibleIdx < paginatedRows.length) {
          const spacer = document.createElement('tr');
          spacer.style.height = ((paginatedRows.length - lastVisibleIdx) * rowHeight) + 'px';
          virtualTbody.appendChild(spacer);
        }
      };

      tbodyWrapper.addEventListener('scroll', renderVisibleRows);

      virtualTable.appendChild(virtualTbody);
      tbodyWrapper.appendChild(virtualTable);
      // `table` already contains its <thead> from the header block above.
      this.element.appendChild(table);
      this.element.appendChild(tbodyWrapper);

      // Первый рендер — после вставки в DOM, когда clientHeight уже реальный
      renderVisibleRows();

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
    tableWrapper.appendChild(table);
    this.element.appendChild(tableWrapper);

    // _scrollBound: scroll-слушатель нужен один на весь жизненный цикл.
    // render() вызывается при каждом sort/filter/setRows — без флага
    // каждый render добавлял бы новый дубль слушателя на parentElement.
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
      table.addEventListener('keydown', (e) => this.handleKeydown(e, tbody));
    }

    // Pagination
    if (this.filteredRows.length > pageSize) {
      const pagination = document.createElement('div');
      pagination.className = 'ui-grid-pagination';

      const totalPages = Math.ceil(this.filteredRows.length / pageSize);

      const prevBtn = document.createElement('button');
      prevBtn.className = 'ui-grid-page-btn';
      prevBtn.textContent = '← Prev';
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
   * Inline-редактирование ячейки по двойному клику.
   *
   * Сохраняем originalContent до замены на input — чтобы cancelEdit()
   * мог точно восстановить ячейку, включая formatter-HTML.
   * saveEdit по blur: пользователь переходит на другую ячейку —
   * текущая сохраняется автоматически без лишнего Enter.
   */
  startEditCell(td, rowData, columnKey, rowIndex) {
    // Только одна ячейка редактируется одновременно — завершаем предыдущую
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
      // Перерисовываем ячейку тем же кодом, что и renderGridRow (_fillCell):
      // форматтер колонки применяется заново, а сырой ввод не попадает в innerHTML
      // (раньше td.innerHTML = newValue — HTML из ввода исполнялся, форматтер терялся)
      const header = this.getProperty('headers', []).find(h => h.key === columnKey) || { key: columnKey };
      td.innerHTML = '';
      this._fillCell(td, header, rowData);
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
        // Toggle selection: кликаем по чекбоксу строки — его change-обработчик
        // сам синхронизирует selectedRows и CSS. Раньше стояла проверка класса
        // ui-grid-checkbox, который чекбоксам не присваивается, — Space не работал.
        if (this.focusedRow >= 0 && this.focusedRow < rows.length) {
          const checkbox = rows[this.focusedRow].querySelector('input[type="checkbox"]');
          if (checkbox) checkbox.click();
        }
        handled = true;
        break;

      case 'Enter':
        e.preventDefault();
        if (this.focusedRow >= 0) {
          const row = rows[this.focusedRow];
          const headersEnter = this.getProperty('headers', []);
          const cells = row.querySelectorAll('td');
          const hasEditableCol = cells[this.focusedCol] &&
            this.editableColumns[headersEnter[this.focusedCol - 1]?.key];

          if (hasEditableCol) {
            // Есть редактируемая колонка — запускаем inline-редактирование
            cells[this.focusedCol].click();
          } else {
            // Нет редактируемых колонок (справочник) — Enter = подтверждение выбора строки.
            // Индекс данных — из data-row-index: при фильтре/сортировке/пагинации
            // позиция в DOM не совпадает с индексом в rows
            const dataIdx = parseInt(row?.dataset?.rowIndex ?? '-1', 10);
            const record = this.filteredRows[dataIdx];
            if (record !== undefined) {
              this.emit('rowClick', { row: dataIdx, record });
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
      // Set focus to table so keyboard events keep working
      this.table?.focus();
    }
  }

  /**
   * Focus a row
   */
  focusRow(rows) {
    // currentRow — всегда индекс в filteredRows (data-row-index), как и при клике мышью.
    // Раньше сюда писался focusedRow (позиция на видимой странице): на странице 2
    // стрелки давали currentRow=0..49 вместо 50..99, и вызывающий код
    // (this._lines[grid.currentRow]) получал чужую строку.
    const focusedTr = rows[this.focusedRow];
    this.currentRow = focusedTr ? parseInt(focusedTr.dataset?.rowIndex ?? '-1', 10) : -1;

    const highlight = this.getProperty('highlightRow', true);
    rows.forEach((row, idx) => {
      if (idx === this.focusedRow) {
        if (highlight) row.classList.add('current-row');
        row.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      } else {
        row.classList.remove('current-row');
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
  setVirtualScroll(enabled, rowHeight = 16) {
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
   * Заполняет содержимое ячейки: formatter → HTML/element, иначе текст.
   * Общий код для renderGridRow и saveEdit (inline-редактирование) —
   * после редактирования ячейка выглядит так же, как при обычном рендере.
   * Возвращает использованный formatter (или undefined) — renderGridRow
   * по нему решает, вешать ли dblclick-редактирование.
   */
  _fillCell(td, header, rowData) {
    // header.align — задавался повсеместно в конфигах гридов по всему приложению,
    // но нигде не применялся: свойство существовало только "на бумаге".
    if (header.align) td.style.textAlign = header.align;
    // header.nowrap — колонка не переносится посимвольно, даже если реальная
    // ширина текста больше заданной width (браузер иначе рвёт слово посреди,
    // чтобы уложиться в узкую колонку таблицы) — нужно для названий отчётов
    // и т.п. коротких подписей, которые должны остаться целыми.
    if (header.nowrap) td.style.whiteSpace = 'nowrap';

    const value = rowData[header.key];
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
    return formatter;
  }

  /**
   * Render a grid row (shared by pagination and virtual scroll)
   */
  renderGridRow(tbody, rowData, headers, absoluteIdx, visibleIdx) {
    const tr = document.createElement('tr');
    tr.className = 'ui-grid-row';
    tr.dataset.rowIndex = absoluteIdx;

    // Checkbox (if multiSelect enabled)
    if (this.getProperty('multiSelect')) {
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
    }

    // Data cells
    headers.forEach((header, colIdx) => {
      const td = document.createElement('td');
      const isEditable = this.getProperty('editable') && this.editableColumns[header.key];

      const formatter = this._fillCell(td, header, rowData);

      if (isEditable && !formatter) {
        td.style.cursor = 'pointer';
        td.addEventListener('dblclick', (e) => {
          e.stopPropagation();
          this.startEditCell(td, rowData, header.key, absoluteIdx);
        });
      }

      tr.appendChild(td);
    });

    // Row style callback — применяем и к <tr>, и к каждому <td>. background
    // наследуется от tr нормально (у td нет своего правила background), но
    // color — нет: .ui-grid td { color: var(--text-primary) } — прямое
    // правило на td побеждает унаследованное значение от tr независимо от
    // !important. Без дублирования на td row-level color тихо не работал
    // (тот же класс бага, что был с text-align, см. header.align).
    if (this._rowStyleFn) {
      const style = this._rowStyleFn(rowData);
      if (style) {
        Object.assign(tr.style, style);
        tr.querySelectorAll('td').forEach(td => Object.assign(td.style, style));
      }
    }

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

        // Update row indicators (arrow)
        const allRows = this.tbody.querySelectorAll('tr');
        allRows.forEach((row, idx) => {
          const indicator = row.querySelector('.ui-grid-indicator');
          if (indicator) {
            indicator.textContent = idx === visibleIdx ? '►' : '';
          }
        });

        // Sync keyboard focus with mouse click so current-row highlight matches.
        // focusRow сам выставит currentRow = absoluteIdx (читает data-row-index)
        this.focusedRow = visibleIdx;
        this.focusRow(Array.from(this.tbody.querySelectorAll('tr')));

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
  /**
   * Ресайз колонки через drag на resize-handle.
   * mousemove/mouseup вешаем на document — иначе мышь выходит за пределы th
   * и событие теряется (стандартная проблема drag в браузере).
   * Снимаем слушатели в mouseup — не копятся при множественных ресайзах.
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
  /**
   * Показывает фильтр-попап рядом с кнопкой-триггером.
   *
   * Попап добавляется в document.body (не в таблицу): внутри таблицы
   * overflow:hidden у родителей обрезал бы попап по краю ячейки.
   * Позиционируем абсолютно через getBoundingClientRect() от triggerBtn.
   *
   * setTimeout(0) для закрытия: клик по triggerBtn открывает попап И сразу
   * закрыл бы его если бы closePopup слушатель добавился синхронно.
   * Задержка 0мс ставит closePopup в очередь после текущего события.
   */
  showFilterPopup(columnKey, triggerBtn) {
    // Закрываем предыдущий попап — только один фильтр активен одновременно
    const existing = document.querySelector('.ui-grid-filter-popup');
    if (existing) existing.remove();

    const filters = this.getProperty('filters', {});
    const currentFilter = filters[columnKey];

    // Create popup
    const popup = document.createElement('div');
    popup.className = 'ui-grid-filter-popup';

    // Apply custom width if set
    const customWidth = this.getProperty('customFilterPopupWidth');
    if (customWidth) {
      popup.style.setProperty('width', customWidth, 'important');
      popup.style.setProperty('min-width', customWidth, 'important');
    }

    // Operator select
    const operatorLabel = document.createElement('label');
    operatorLabel.textContent = 'Condition:';
    operatorLabel.className = 'ui-grid-filter-label';

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
    operatorContainer.className = 'ui-grid-filter-row';
    operatorContainer.appendChild(operatorLabel);
    operatorContainer.appendChild(operatorSelect);
    popup.appendChild(operatorContainer);

    // Value input
    const valueLabel = document.createElement('label');
    valueLabel.textContent = 'Value:';
    valueLabel.className = 'ui-grid-filter-label';

    const valueInput = document.createElement('input');
    valueInput.className = 'ui-grid-filter-value';
    valueInput.type = 'text';
    valueInput.placeholder = 'Enter value';
    valueInput.value = currentFilter?.value || '';

    const valueContainer = document.createElement('div');
    valueContainer.className = 'ui-grid-filter-row';
    valueContainer.appendChild(valueLabel);
    valueContainer.appendChild(valueInput);
    popup.appendChild(valueContainer);

    // Value "to" input (for between)
    const valueToInput = document.createElement('input');
    valueToInput.className = 'ui-grid-filter-value-to';
    valueToInput.type = 'text';
    valueToInput.placeholder = 'To value';
    valueToInput.value = currentFilter?.valueTo || '';
    valueToInput.style.display = operatorSelect.value === 'between' ? 'block' : 'none';

    const valueToContainer = document.createElement('div');
    valueToContainer.className = 'ui-grid-filter-row';
    valueToContainer.appendChild(valueToInput);
    popup.appendChild(valueToContainer);

    // Show/hide "to" input based on operator
    operatorSelect.addEventListener('change', () => {
      valueToInput.style.display = operatorSelect.value === 'between' ? 'block' : 'none';
    });

    // Button container
    const btnContainer = document.createElement('div');
    btnContainer.className = 'ui-grid-filter-buttons';

    const applyBtn = document.createElement('button');
    applyBtn.textContent = 'Apply';
    applyBtn.className = 'ui-grid-filter-apply';

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

    clearBtn.addEventListener('click', () => {
      this.removeFilter(columnKey);
      popup.remove();
    });

    const closeBtn = document.createElement('button');
    closeBtn.textContent = '✕';
    closeBtn.className = 'ui-grid-filter-close';

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
