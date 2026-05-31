# UIKit Grid - Event Reference

## Полный список событий Grid компонента

Сравнение с ActiveWidgets 2.5.6

### 📋 События Row (Строка)

| Событие | AW 2.5.6 | UIKit | Описание |
|---------|----------|-------|---------|
| rowClick | ✅ onRowClicked | ✅ rowClick | Клик по строке |
| rowDoubleClick | ✅ onRowDoubleClicked | ✅ rowDoubleClick | Двойной клик по строке |
| rowMouseOver | ✅ onRowMouseOver | ✅ rowMouseOver | Мышь над строкой |
| rowMouseOut | ✅ onRowMouseOut | ✅ rowMouseOut | Мышь покидает строку |
| rowMouseDown | ✅ onRowMouseDown | ✅ rowMouseDown | Нажата кнопка мыши над строкой |
| rowMouseUp | ✅ onRowMouseUp | ✅ rowMouseUp | Отпущена кнопка мыши над строкой |

**Payload:**
```javascript
grid.on('rowClick', (data) => {
  console.log(data); // { event, row: rowIndex }
});
```

---

### 📦 События Cell (Ячейка)

| Событие | AW 2.5.6 | UIKit | Описание |
|---------|----------|-------|---------|
| cellClick | ✅ onCellClicked | ✅ cellClick | Клик по ячейке |
| cellDoubleClick | ✅ onCellDoubleClicked | ✅ cellDoubleClick | Двойной клик по ячейке |
| cellMouseOver | ✅ onCellMouseOver | ✅ cellMouseOver | Мышь над ячейкой |
| cellMouseOut | ✅ onCellMouseOut | ✅ cellMouseOut | Мышь покидает ячейку |
| cellMouseDown | ✅ onCellMouseDown | ✅ cellMouseDown | Нажата кнопка мыши над ячейкой |
| cellMouseUp | ✅ onCellMouseUp | ✅ cellMouseUp | Отпущена кнопка мыши над ячейкой |
| cellEdit | ❌ - | ✅ celledit | Редактирование ячейки (inline) |

**Payload:**
```javascript
grid.on('cellClick', (data) => {
  console.log(data); // { event, column: colIdx, row: rowIdx }
});

grid.on('celledit', (data) => {
  console.log(data); // { row, column, value, rowIndex }
});
```

---

### 🎯 События Header (Заголовок)

| Событие | AW 2.5.6 | UIKit | Описание |
|---------|----------|-------|---------|
| headerClick | ✅ onHeaderClicked | ✅ headerClick | Клик по заголовку (сортировка) |
| headerDoubleClick | ✅ onHeaderDoubleClicked | ✅ headerDoubleClick | Двойной клик |
| headerMouseOver | ✅ onHeaderMouseOver | ✅ headerMouseOver | Мышь над заголовком |
| headerMouseOut | ✅ onHeaderMouseOut | ✅ headerMouseOut | Мышь покидает заголовок |
| headerMouseDown | ✅ onHeaderMouseDown | ✅ headerMouseDown | Нажата кнопка мыши |
| headerMouseUp | ✅ onHeaderMouseUp | ✅ headerMouseUp | Отпущена кнопка мыши |
| columnResize | ❌ - | ✅ columnresize | Изменение ширины столбца |

**Payload:**
```javascript
grid.on('headerClick', (data) => {
  console.log(data); // { event, column: colIdx }
});

grid.on('columnresize', (data) => {
  console.log(data); // { column, width }
});
```

---

### 🔘 События Selection (Выбор)

| Событие | AW 2.5.6 | UIKit | Описание |
|---------|----------|-------|---------|
| rowSelected | ✅ onSelectedRowsChanged | ✅ rowselect | Выбрана строка |
| selectionChanged | ✅ onSelectedChanged | ✅ selectionchange | Изменение выбора |
| currentRowChanged | ✅ onCurrentRowChanged | ✅ currentRowChanged | Текущая строка изменилась |
| currentColumnChanged | ✅ onCurrentColumnChanged | ✅ currentColumnChanged | Текущий столбец изменился |

**Payload:**
```javascript
grid.on('rowselect', (data) => {
  console.log(data); // { row, index }
});

grid.on('selectionchange', (data) => {
  console.log(data); // { selected: [] }
});

grid.on('currentRowChanged', (data) => {
  console.log(data); // { row: rowIndex }
});
```

---

### 📜 События Scroll (Прокрутка)

| Событие | AW 2.5.6 | UIKit | Описание |
|---------|----------|-------|---------|
| scrollTopChanged | ✅ onScrollTopChanged | ✅ scrollTopChanged | Вертикальная прокрутка |
| scrollLeftChanged | ✅ onScrollLeftChanged | ✅ scrollLeftChanged | Горизонтальная прокрутка |

**Payload:**
```javascript
grid.on('scrollTopChanged', (data) => {
  console.log(data); // { value: scrollTop }
});

grid.on('scrollLeftChanged', (data) => {
  console.log(data); // { value: scrollLeft }
});
```

---

### 🎨 События Footer/Selector (опционально)

Не реализованы в текущей версии UIKit (редко используются):
- ❌ onFooterClicked, onFooterDoubleClicked, etc
- ❌ onSelectorClicked, onSelectorDoubleClicked, etc

---

## Использование

### Базовый пример
```javascript
const grid = new Grid();
grid.setHeaders([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name' }
]);
grid.setRows(data);

// Слушаем события
grid.on('rowClick', (data) => {
  console.log('Row clicked:', data.row);
});

grid.on('cellClick', (data) => {
  console.log(`Cell [${data.column}, ${data.row}] clicked`);
});

grid.on('celledit', (data) => {
  console.log('Edited:', data.value);
});

grid.on('selectionchange', (data) => {
  console.log('Selected rows:', data.selected);
});

grid.on('currentRowChanged', (data) => {
  console.log('Current row:', data.row);
});

grid.on('scrollTopChanged', (data) => {
  console.log('Scroll position:', data.value);
});

grid.render();
document.body.appendChild(grid.element);
```

### Множественные слушатели
```javascript
grid.on('cellClick', (data) => {
  if (data.column === 0) {
    // Реакция на клик в первый столбец
  }
});

grid.on('cellClick', (data) => {
  if (data.row === 5) {
    // Реакция на клик в 5-ю строку
  }
});
```

---

## 📊 Сравнение покрытия с ActiveWidgets

| Категория | AW Событий | UIKit Реализовано | % |
|-----------|-----------|-------------------|---|
| Row events | 6 | 6 | 100% ✅ |
| Cell events | 6 | 6 | 100% ✅ |
| Header events | 6 | 6 | 100% ✅ |
| Footer events | 6 | 0 | 0% |
| Selector events | 6 | 0 | 0% |
| Selection events | 4 | 4 | 100% ✅ |
| Scroll events | 2 | 2 | 100% ✅ |
| **Total** | **36+** | **24+** | **~67%** |

---

## 🔮 Future Events (Nice-to-have)

Могут быть добавлены позже:
- `datachanged` - Данные в grid изменились
- `columnVisibilityChanged` - Видимость столбца изменилась
- `filterChanged` - Фильтр изменился
- `sortChanged` - Сортировка изменилась
- `paginationChanged` - Страница изменилась
- `virtualScrollRendered` - Virtual scroll отрендерил новые строки

---

**Статус:** Production-Ready ✨
