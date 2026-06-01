# UIKit Grid - Event Reference

## Полный список событий Grid компонента

UIKit Grid поддерживает **24+ событий** для полного контроля над взаимодействием пользователя.

---

## 📋 События Row (Строка)

| Событие | Статус | Описание |
|---------|--------|---------|
| rowClick | ✅ | Клик по строке |
| rowDoubleClick | ✅ | Двойной клик по строке |
| rowMouseOver | ✅ | Мышь над строкой |
| rowMouseOut | ✅ | Мышь покидает строку |
| rowMouseDown | ✅ | Нажата кнопка мыши над строкой |
| rowMouseUp | ✅ | Отпущена кнопка мыши над строкой |

**Payload:**
```javascript
grid.on('rowClick', (data) => {
  console.log(data); // { event, row: rowIndex }
});
```

---

## 📦 События Cell (Ячейка)

| Событие | Статус | Описание |
|---------|--------|---------|
| cellClick | ✅ | Клик по ячейке |
| cellDoubleClick | ✅ | Двойной клик по ячейке |
| cellMouseOver | ✅ | Мышь над ячейкой |
| cellMouseOut | ✅ | Мышь покидает ячейку |
| cellMouseDown | ✅ | Нажата кнопка мыши над ячейкой |
| cellMouseUp | ✅ | Отпущена кнопка мыши над ячейкой |
| cellEdit | ✅ | Редактирование ячейки (inline) |

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

## 🎯 События Header (Заголовок)

| Событие | Статус | Описание |
|---------|--------|---------|
| headerClick | ✅ | Клик по заголовку (сортировка) |
| headerDoubleClick | ✅ | Двойной клик |
| headerMouseOver | ✅ | Мышь над заголовком |
| headerMouseOut | ✅ | Мышь покидает заголовок |
| headerMouseDown | ✅ | Нажата кнопка мыши |
| headerMouseUp | ✅ | Отпущена кнопка мыши |
| columnResize | ✅ | Изменение ширины столбца |

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

## 🔘 События Selection (Выбор)

| Событие | Статус | Описание |
|---------|--------|---------|
| rowSelected | ✅ | Выбрана строка |
| selectionChanged | ✅ | Изменение выбора |
| currentRowChanged | ✅ | Текущая строка изменилась |
| currentColumnChanged | ✅ | Текущий столбец изменился |

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

## 📜 События Scroll (Прокрутка)

| Событие | Статус | Описание |
|---------|--------|---------|
| scrollTopChanged | ✅ | Вертикальная прокрутка |
| scrollLeftChanged | ✅ | Горизонтальная прокрутка |

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

## 📊 Покрытие событий

| Категория | Реализовано |
|-----------|-------------|
| Row events | 6/6 ✅ |
| Cell events | 7/7 ✅ |
| Header events | 7/7 ✅ |
| Selection events | 4/4 ✅ |
| Scroll events | 2/2 ✅ |
| **TOTAL** | **26+ событий** |

---

## 🔮 Future Events

Могут быть добавлены позже:
- `datachanged` - Данные в grid изменились
- `columnVisibilityChanged` - Видимость столбца изменилась
- `filterChanged` - Фильтр изменился
- `sortChanged` - Сортировка изменилась
- `paginationChanged` - Страница изменилась
- `virtualScrollRendered` - Virtual scroll отрендерил новые строки

---

**Статус:** Production-Ready ✨
