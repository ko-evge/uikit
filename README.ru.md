# UIKit

Библиотека UI-компонентов на чистом JavaScript. Без зависимостей, без фреймворков.

```javascript
import { Button, Grid, Dialog } from './UIKit/index.js';
```

```html
<link rel="stylesheet" href="UIKit/styles/modern.css">
```

### Живая демонстрация

Откройте **examples.html** в браузере — все компоненты с живыми примерами.

```
http://localhost:8000/examples.html
```

---

## Button — Кнопка

Кнопка для запуска действий.

### Когда использовать
- Основное действие на форме (Сохранить, Отправить)
- Команды панели инструментов с подсказками клавиш (F2, F3)
- Опасные действия (Удалить)

### Использование

```javascript
const btn = new Button('Сохранить', () => {
  console.log('Сохранено!');
});
document.body.appendChild(btn.element);
```

### Варианты

```javascript
// Типы — визуальный стиль
btn.setType('primary');   // синяя, основное действие
btn.setType('danger');    // красная, разрушительное действие
btn.setType('success');   // зелёная, подтверждение
btn.setType('warning');   // оранжевая, предупреждение
btn.setType('default');   // серая, второстепенная

// Размеры
btn.setSize('small');
btn.setSize('large');

// Подсказка клавиши — показывает "[F2]" после текста
btn.setFKey('F2');

// Отключённое состояние
btn.setDisabled(true);
```

### API

| Свойство | Тип | По умолчанию | Описание |
|---|---|---|---|
| `text` | string | `''` | Текст кнопки |
| `type` | string | `'default'` | `'default'` `'primary'` `'danger'` `'success'` `'warning'` |
| `size` | string | `'medium'` | `'small'` `'medium'` `'large'` |
| `fKey` | string | — | Подсказка функциональной клавиши |
| `disabled` | bool | `false` | Отключена |

| Метод | Описание |
|---|---|
| `setText(text)` | Установить текст |
| `getText()` | Получить текст (включая fKey) |
| `setType(type)` | Установить визуальный стиль |
| `setFKey(key)` | Показать подсказку клавиши |
| `setDisabled(bool)` | Включить/отключить |
| `click()` | Программный клик |

---

## Input — Поле ввода

Текстовое поле ввода.

### Когда использовать
- Однострочный ввод текста (имя, email, поиск)
- Числовой ввод (количество, цена)

### Использование

```javascript
const name = new Input('text', 'Введите имя');
name.setValue('Иван');
name.on('change', ({ value }) => {
  console.log('Введено:', value);  // срабатывает при каждом нажатии
});
```

### Варианты

```javascript
const qty = new Input('number', 'Количество');
name.setReadonly(true);    // только чтение
name.setDisabled(true);   // отключено
name.focus();              // фокус
name.selectAll();          // выделить всё
name.clear();              // очистить
```

### API

| Свойство | Тип | По умолчанию | Описание |
|---|---|---|---|
| `type` | string | `'text'` | Тип HTML-поля |
| `placeholder` | string | `''` | Текст-подсказка |
| `readonly` | bool | `false` | Только чтение |
| `disabled` | bool | `false` | Отключено |

| Метод | Описание |
|---|---|
| `setValue(v)` / `getValue()` | Установить/получить значение |
| `setPlaceholder(text)` | Установить подсказку |
| `setReadonly(bool)` | Режим только чтение |
| `setDisabled(bool)` | Отключить |
| `focus()` `clear()` `selectAll()` | Фокус, очистка, выделение |

| Событие | Данные | Описание |
|---|---|---|
| `change` | `{ value }` | Срабатывает при каждом нажатии клавиши |

---

## Label — Текстовая метка

```javascript
const lbl = new Label('Имя пользователя');
lbl.setFor('my-input');  // привязка к полю ввода через htmlFor
```

| Метод | Описание |
|---|---|
| `setText(text)` / `getText()` | Текст метки |
| `setFor(id)` | Привязка к полю ввода |

---

## Checkbox — Флажок

```javascript
const cb = new Checkbox('Я согласен с условиями');
cb.on('change', ({ checked }) => console.log(checked));
cb.setChecked(true);
cb.toggle();
```

| Метод | Описание |
|---|---|
| `setChecked(bool)` / `isChecked()` | Состояние |
| `setValue(v)` / `getValue()` | Алиас для форм |
| `setLabel(text)` | Текст метки |
| `setDisabled(bool)` | Отключить |
| `toggle()` | Переключить |
| `focus()` | Фокус на чекбокс |

| Событие | Данные |
|---|---|
| `change` | `{ checked: boolean }` |

---

## RadioButton — Группа переключателей

Выбор одного из нескольких вариантов.

```javascript
const color = new RadioButton('color', [
  { value: 'r', label: 'Красный' },
  { value: 'g', label: 'Зелёный' },
  { value: 'b', label: 'Синий' },
]);
color.setValue('g');
color.on('change', ({ value, label }) => console.log(value));
```

| Метод | Описание |
|---|---|
| `setOptions(arr)` | Задать варианты `[{value, label}]` |
| `addOption(value, label)` | Добавить вариант |
| `removeOption(value)` | Удалить вариант |
| `setValue(v)` / `getValue()` | Выбранное значение |
| `setDisabled(bool)` | Отключить все |

| Событие | Данные |
|---|---|
| `change` | `{ value, label }` |

---

## Textarea — Многострочное поле

```javascript
const note = new Textarea('Введите описание');
note.setRows(5);
note.setMaxLength(500);
note.on('change', ({ value }) => console.log(value));
```

| Метод | Описание |
|---|---|
| `setValue(v)` / `getValue()` | Значение |
| `setPlaceholder(text)` | Текст-подсказка |
| `setRows(n)` | Видимые строки |
| `setMaxLength(n)` | Максимум символов (null = без ограничений) |
| `setReadonly(bool)` | Только чтение |
| `setDisabled(bool)` | Отключить |
| `focus()` `clear()` `selectAll()` | Фокус, очистка, выделить всё |
| `getCharCount()` | Текущая длина текста |

| Событие | Данные |
|---|---|
| `change` | `{ value }` |

---

## Combo — Автодополнение

Поле ввода с автодополнением. Подходит когда нужно искать по набору данных.

### Когда использовать
- Поиск по списку (товары, клиенты)
- Серверный поиск с задержкой
- Когда список слишком большой для обычного выпадающего меню

### Использование

```javascript
const combo = new Combo('Поиск товара...');
combo.setOptions([
  { value: 1, label: 'Ноутбук' },
  { value: 2, label: 'Монитор' },
  { value: 3, label: 'Клавиатура' },
]);
combo.on('change', ({ value, label }) => console.log(value));
```

### Асинхронный поиск — серверная фильтрация

```javascript
combo.setAsyncSearch(async (query) => {
  const res = await fetch(`/api/search?q=${query}`);
  return await res.json();  // должен вернуть [{value, label}]
});
combo.setMinChars(2);     // начинать поиск после 2 символов
combo.setDebounce(300);   // ждать 300мс после окончания ввода
```

### API

| Свойство | Тип | По умолчанию | Описание |
|---|---|---|---|
| `placeholder` | string | `''` | Текст-подсказка |
| `minChars` | int | `2` | Мин. символов для поиска |
| `debounceMs` | int | `300` | Задержка |
| `maxResults` | int | `50` | Макс. элементов в списке |
| `isLoading` | bool | `false` | Состояние загрузки |
| `disabled` | bool | `false` | Отключено |

| Метод | Описание |
|---|---|
| `setOptions(arr)` | Статические варианты `[{value, label}]` |
| `addOption(value, label)` | Добавить вариант |
| `removeOption(value)` | Удалить вариант |
| `setAsyncSearch(fn)` | Функция серверного поиска |
| `setValue(v)` / `getValue()` | Значение |
| `setPlaceholder(text)` | Установить подсказку |
| `setMinChars(n)` / `setDebounce(n)` | Порог поиска / задержка |
| `setDisabled(bool)` | Отключить |
| `getSelectedOption()` | Полный объект выбранного варианта |
| `showMenu()` / `hideMenu()` | Открыть/закрыть выпадающий список |
| `clear()` / `focus()` | Очистить, фокус |

| Событие | Данные |
|---|---|
| `change` | `{ value, label, option }` |

---

## Dropdown — Выпадающий список

Выбор одного варианта из списка.

```javascript
const dd = new Dropdown('Выберите страну');
dd.setOptions([
  { value: 'us', label: 'США' },
  { value: 'de', label: 'Германия' },
  { value: 'jp', label: 'Япония' },
]);
dd.setValue('us');
dd.on('change', ({ value, label }) => console.log(value));
```

| Метод | Описание |
|---|---|
| `setOptions(arr)` | Задать варианты `[{value, label}]` |
| `getOptions()` | Получить все варианты |
| `addOption(value, label)` | Добавить вариант |
| `removeOption(value)` | Удалить вариант |
| `setValue(v)` / `getValue()` | Выбранное значение |
| `setDisabled(bool)` | Отключить |
| `setWidth(w)` | Ширина |
| `getButton()` / `getMenu()` | Получить DOM-элементы |
| `toggleMenu()` / `openMenu()` / `closeMenu()` | Управление меню |

| Событие | Данные |
|---|---|
| `change` | `{ value, label }` |

---

## Select — Нативный выпадающий список

Обёртка над нативным `<select>` для больших списков (50+ элементов). Использует встроенное меню браузера.

### Когда использовать
- Списки с 50+ элементами (справочники, каталоги)
- Когда важен нативный поиск по клавиатуре
- Автооткрытие при создании через `showPicker()`

```javascript
const sel = new Select('Выберите справочник');
sel.setOptions(refs.map(r => ({ value: r.code, label: r.name })));
sel.showPicker();  // автоматически открывает нативное меню
sel.on('change', ({ value, label }) => openRef(value));
```

| Метод | Описание |
|---|---|
| `setOptions(arr)` | Задать варианты `[{value, label}]` |
| `getOptions()` | Получить все варианты |
| `setValue(v)` / `getValue()` | Выбранное значение |
| `showPicker()` | Открыть нативное меню (Chrome 101+) |
| `setDisabled(bool)` | Отключить |
| `focus()` / `click()` | Фокус / клик |

| Событие | Данные |
|---|---|
| `change` | `{ value, label, option }` |

---

## DatePicker — Выбор даты

Выбор даты с всплывающим календарём.

```javascript
const dp = new DatePicker('Выберите дату');
dp.setValue('2026-06-25');
dp.setMinDate('2026-01-01');
dp.setMaxDate('2026-12-31');
dp.on('change', ({ value }) => console.log(value));  // "2026-06-25"
```

| Метод | Описание |
|---|---|
| `setValue(v)` / `getValue()` | Дата строкой `'YYYY-MM-DD'` |
| `setMinDate(d)` / `setMaxDate(d)` | Допустимый диапазон |
| `setWidth(w)` | Ширина |
| `showCalendar()` / `hideCalendar()` | Открыть/закрыть календарь |

| Событие | Данные |
|---|---|
| `change` | `{ value: 'YYYY-MM-DD' }` |

---

## Dialog — Модальное окно

### Когда использовать
- Формы редактирования поверх основного экрана
- Подтверждение действий (удаление, обработка)
- Сообщения об ошибках

### Использование

```javascript
const dlg = new Dialog('Редактирование');
dlg.setWidth('500px');
dlg.setHeight('400px');
dlg.setContent(formElement);

const footer = dlg.getFooter();
footer.appendChild(new Button('Сохранить', () => save()).element);
footer.appendChild(new Button('Отмена', () => dlg.hide()).element);

dlg.show();
```

### Горячие клавиши внутри диалога

```javascript
dlg.setFKeys({
  'F2':     () => save(),
  'F3':     () => addNew(),
  'Escape': () => dlg.hide(),
});
```

### Быстрые диалоги — в одну строку

```javascript
Dialog.alert('Ошибка', 'Что-то пошло не так');
Dialog.confirm('Удалить этот элемент?', () => deleteItem());
```

### Стакинг

Диалоги автоматически стакаются: каждый новый получает z-index выше и сдвигается на 36px вниз-вправо.

### API

| Свойство | Тип | По умолчанию | Описание |
|---|---|---|---|
| `title` | string | `''` | Заголовок |
| `size` | string | `'medium'` | `'small'` `'medium'` `'large'` |
| `closable` | bool | `true` | Кнопка закрытия |
| `fillSpace` | bool | `false` | Убрать отступы содержимого |
| `closeOnBackdrop` | bool | `false` | Закрывать по клику вне окна |
| `customWidth` | string | — | Своя ширина |
| `customHeight` | string | — | Своя высота |
| `debugId` | string | — | Отладочная метка |

| Метод | Описание |
|---|---|
| `setTitle(text)` | Заголовок |
| `setContent(el)` / `appendContent(el)` | Содержимое |
| `getHeader()` | Верхняя панель |
| `setHeaderContent(el)` | Свой контент в заголовок |
| `getFooter()` | Нижняя панель (для кнопок) |
| `setWidth(w)` / `setHeight(h)` | Размеры |
| `setSize(size)` | `'small'` `'medium'` `'large'` |
| `setClosable(bool)` | Кнопка закрытия |
| `setFillSpace(bool)` | Убрать отступы |
| `setDebugId(id)` | Отладочная метка |
| `setFKeys(map)` | Горячие клавиши `{key: fn}` |
| `show()` / `hide()` / `close()` | Показать/скрыть/закрыть |

| Статический метод | Описание |
|---|---|
| `Dialog.alert(title, message)` | Быстрый диалог-предупреждение |
| `Dialog.confirm(title, onConfirm, onCancel)` | Быстрый диалог подтверждения |

| Событие | Данные |
|---|---|
| `close` | `{}` |

---

## Panel — Панель

Панель с заголовком, телом и подвалом. Может сворачиваться.

```javascript
const panel = new Panel('Настройки');
panel.setContent(someElement);
panel.getFooter().appendChild(saveBtn.element);
panel.setCollapsible(true);
```

| Метод | Описание |
|---|---|
| `setTitle(text)` / `getTitle()` | Заголовок |
| `setCollapsible(bool)` | Разрешить сворачивание |
| `setCollapsed(bool)` / `toggleCollapsed()` | Свернуть/развернуть |
| `setContent(el)` / `appendContent(el)` / `clearContent()` | Содержимое |
| `setHeaderContent(el)` | Свой контент в заголовок (вместо заголовка) |
| `setFooter(el)` | Контент подвала |
| `getHeader()` / `getContent()` / `getFooter()` | Секции панели |
| `setFillSpace(bool)` | Убрать отступы |
| `appendToBody(el)` | Добавить элемент над контентом (тулбар) |
| `insertBeforeContent(el)` | Вставить элемент перед контентом |
| `alignTop()` / `alignCenter()` / `alignBottom()` | Режимы позиционирования |

---

## Tabs — Вкладки

Переключение между панелями содержимого.

```javascript
const tabs = new Tabs();
tabs.addTab('general',  'Основные',    generalContent, true);
tabs.addTab('advanced', 'Дополнительно', advancedContent);
tabs.on('change', ({ activeTab }) => console.log(activeTab));
tabs.activateTab('advanced');
tabs.setTabDisabled('about', true);
```

| Метод | Описание |
|---|---|
| `addTab(key, label, content, active)` | Добавить вкладку |
| `removeTab(key)` | Удалить вкладку |
| `activateTab(key)` | Переключить вкладку |
| `getActiveTab()` | Ключ активной вкладки |
| `setTabContent(key, el)` / `getTabContent(key)` | Обновить/получить содержимое |
| `getTabs()` | Получить массив ключей вкладок |
| `setTabDisabled(key, bool)` | Отключить вкладку |

| Событие | Данные |
|---|---|
| `change` | `{ activeTab: key }` |

---

## List — Список

Список с прокруткой и выделением элементов.

```javascript
const list = new List();
list.setItems([
  { value: 1, label: 'Первый' },
  { value: 2, label: 'Второй' },
  { value: 3, label: 'Третий', disabled: true },
]);
list.on('select', ({ item, index }) => console.log(item.label));

// Мультивыбор
list.setMultiSelect(true);
list.on('selectionchange', ({ selected }) => console.log(selected));
```

| Метод | Описание |
|---|---|
| `setItems(arr)` | Элементы `[{value, label, disabled}]` |
| `addItem(value, label)` / `removeItem(value)` | Добавить/удалить |
| `setMultiSelect(bool)` | Режим мультивыбора |
| `getSelectedItem()` / `getSelectedItems()` | Выбранные |
| `setSelectedItem(value)` | Установить выбор |
| `clearSelection()` | Сбросить выбор |
| `scrollToItem(index)` | Прокрутить к элементу |

| Событие | Данные |
|---|---|
| `select` | `{ item, index }` — одиночный режим |
| `selectionchange` | `{ selected: [] }` — мультивыбор |

---

## Grid — Таблица данных

Таблица с сортировкой, фильтрацией, редактированием ячеек, пагинацией и клавиатурной навигацией. Основной рабочий компонент.

### Когда использовать
- Отображение табличных данных (документы, товары, справочники)
- Редактирование ячеек (цены, количество)
- Мультивыбор чекбоксами
- Большие наборы данных с пагинацией или виртуальным скроллингом

### Использование

```javascript
const grid = new Grid();
grid.setHeaders([
  { key: 'name',  label: 'Название', width: '200px', sortable: true },
  { key: 'price', label: 'Цена',     width: '100px', align: 'right' },
  { key: 'qty',   label: 'Кол-во',   width: '80px' },
]);
grid.setRows([
  { name: 'Ноутбук',  price: 999, qty: 5 },
  { name: 'Мышь',     price: 29,  qty: 50 },
  { name: 'Монитор',  price: 499, qty: 12 },
]);
grid.on('rowClick', ({ row }) => console.log(row.name));
```

### Форматирование колонок

```javascript
grid.setHeaders([
  { key: 'price', label: 'Цена', width: '100px',
    formatter: (value) => `$${parseFloat(value).toFixed(2)}` },
  { key: 'status', label: 'Статус', width: '80px',
    formatter: (value) => value === '1'
      ? '<span style="color:green">Активен</span>'
      : '<span style="color:red">Закрыт</span>' },
]);
```

### Редактирование ячеек — двойной клик для редактирования

```javascript
grid.setProperty('editable', true);
grid.setEditableColumn('price', true);  // или отдельную колонку
grid.on('celledit', ({ row, column, value, rowIndex }) => {
  saveToServer(row, column, value);
});
```

### Сортировка

```javascript
grid.setProperty('sortable', true);
grid.on('sortchange', ({ column, order }) => console.log(column, order));
```

### Фильтрация

```javascript
grid.setProperty('filterable', true);
grid.addFilter('price', '>', 100);
grid.addFilter('name', 'contains', 'ноут');
// Операторы: equals, contains, startsWith, endsWith, >, <, >=, <=, between
grid.clearFilters();
```

### Мультивыбор чекбоксами

```javascript
grid.setProperty('multiSelect', true);
grid.on('selectionchange', ({ selected }) => console.log(selected));
```

### Условное оформление строк

```javascript
grid.setRowStyle((row) => {
  if (row.qty === 0) return { color: 'red' };
  if (row.qty < 5)   return { color: 'orange' };
  return {};
});
```

### Клавиатура

```javascript
grid.setProperty('keyboard', true);
// ↑↓ навигация по строкам, ←→ по колонкам, Enter редактирование,
// Escape отмена, Space переключить чекбокс, Home/End первая/последняя строка
```

### API

| Свойство | Тип | По умолчанию | Описание |
|---|---|---|---|
| `sortable` | bool | `false` | Сортировка кликом по заголовку |
| `filterable` | bool | `false` | Фильтры по колонкам |
| `editable` | bool | `false` | Редактирование по двойному клику |
| `multiSelect` | bool | `false` | Мультивыбор чекбоксами |
| `highlightRow` | bool | `false` | Подсветка текущей строки |
| `resizable` | bool | `false` | Изменение ширины колонок |
| `keyboard` | bool | `false` | Клавиатурная навигация |
| `virtual` | bool | `false` | Виртуальный скроллинг (10K+ строк) |
| `pageSize` | int | `50` | Строк на странице |
| `hideToolbar` | bool | `false` | Скрыть пагинацию |

| Метод | Описание |
|---|---|
| `setHeaders(arr)` | Колонки `[{key, label, width, sortable, formatter, editable, align}]` |
| `setRows(arr)` | Установить все строки |
| `addRow(data)` / `removeRow(idx)` / `updateRow(idx, data)` | Операции со строками |
| `setRowStyle(fn)` | Условное оформление строк |
| `setFormatter(key, fn)` | Форматирование колонки |
| `setSortColumn(column, order)` / `getSortState()` | Управление сортировкой |
| `clearSort()` | Сбросить сортировку |
| `setKeyboardNav(enabled)` | Включить/отключить клавиатурную навигацию |
| `setVirtualScroll(enabled, rowHeight)` | Виртуальный скроллинг для 10K+ строк |
| `getVirtualScrollInfo()` | `{ enabled, rowHeight, totalRows }` |
| `addFilter(key, op, val, valueTo)` / `removeFilter(key)` / `clearFilters()` | Управление фильтрами |
| `setFilter(text)` | Текстовый поиск по всем колонкам |
| `getSelectedRows()` | Получить выбранные строки |
| `clearSelection()` | Сбросить выделение |
| `cancelEdit()` | Отменить текущее inline-редактирование |

| Событие | Данные | Описание |
|---|---|---|
| `rowClick` | `{ row, event }` | Клик по строке |
| `rowDoubleClick` | `{ row, event }` | Двойной клик |
| `rowMouseOver` | `{ row, event }` | Наведение мыши на строку |
| `rowMouseOut` | `{ row, event }` | Уход мыши со строки |
| `cellClick` | `{ column, row, event }` | Клик по ячейке |
| `cellDoubleClick` | `{ column, row, event }` | Двойной клик по ячейке |
| `headerClick` | `{ column }` | Клик по заголовку |
| `headerDoubleClick` | `{ column }` | Двойной клик по заголовку |
| `celledit` | `{ row, column, value, rowIndex }` | Ячейка отредактирована |
| `selectionchange` | `{ selected }` | Мультивыбор чекбоксами |
| `rowselect` | `{ row, index }` | Строка выбрана кликом |
| `currentRowChanged` | `{ row }` | Текущая строка изменилась |
| `currentColumnChanged` | `{ column }` | Текущая колонка изменилась |
| `sortchange` | `{ column, order }` | Сортировка изменилась |
| `filterchange` | `{ column, operator, value }` | Фильтр изменился |
| `columnresize` | `{ column, width }` | Ширина колонки изменена |
| `scrollLeftChanged` | `{ value }` | Горизонтальная прокрутка |
| `scrollTopChanged` | `{ value }` | Вертикальная прокрутка |

---

## Table — Простая таблица

Таблица без сортировки и пагинации. Для небольших наборов данных.

```javascript
const table = new Table();
table.setHeaders(['Имя', 'Email', 'Возраст']);
table.setRows([
  ['Иван', 'ivan@test.com', 30],
  ['Мария', 'maria@test.com', 25],
]);
table.on('rowselect', ({ index, data }) => console.log(data));
```

| Метод | Описание |
|---|---|
| `setHeaders(arr)` / `getHeaders()` | Названия колонок (строки) |
| `setRows(arr)` / `getRows()` | Данные строк (массивы или объекты) |
| `addRow(data)` / `removeRow(idx)` | Добавить/удалить строку |
| `updateRow(index, data)` | Обновить строку по индексу |
| `clearRows()` | Очистить все строки |
| `getSelectedRow()` | `{index, data}` или null |

| Событие | Данные |
|---|---|
| `rowselect` | `{ index, data }` |

---

## Form — Форма

Форма с автоматической валидацией полей.

```javascript
const form = new Form();
form.addField('name',  { label: 'Имя',   type: 'text',   required: true });
form.addField('email', { label: 'Email',  type: 'text',
  validators: [Validators.email()] });
form.addField('age',   { label: 'Возраст', type: 'number' });

form.on('submit', ({ data, valid }) => {
  if (valid) saveUser(data);
});

form.setData({ name: 'Иван', email: 'ivan@test.com', age: 30 });
const data = form.getData();
form.validate();
form.reset();
```

| Метод | Описание |
|---|---|
| `addField(name, config)` | Добавить поле. config: `{label, type, placeholder, required, validators, value}` |
| `removeField(name)` | Удалить поле |
| `getData()` / `setData(obj)` | Все поля |
| `getFieldValue(name)` / `setFieldValue(name, v)` | Одно поле |
| `getField(name)` | Получить компонент Input |
| `validate()` | Валидировать все (возвращает bool) |
| `getErrors()` / `clearErrors()` | Ошибки |
| `reset()` | Сбросить данные и ошибки |

| Событие | Данные |
|---|---|
| `submit` | `{ data, valid }` |
| `fieldvalidate` | `{ field, error }` |

---

## DropdownMenu — Выпадающее меню

Кнопка с выпадающим меню действий. Для меню "Опции ▾" в формах.

```javascript
const menu = new DropdownMenu('Опции');
menu.addItem('Редактировать', () => edit());
menu.addItem('Удалить',      () => del(), { disabled: true });
menu.addItem('---');                               // разделитель
menu.addGroup('Экспорт', [                         // подменю
  { label: 'PDF', fn: () => exportPDF() },
  { label: 'CSV', fn: () => exportCSV() },
]);
```

| Метод | Описание |
|---|---|
| `addItem(label, fn, opts)` | Добавить пункт. `'---'` = разделитель. opts: `{key, disabled}` |
| `addGroup(label, items)` | Добавить подменю `[{label, fn, opts}]` |

---

## Link — Ссылка

```javascript
const link = new Link('Документация', 'https://example.com');
link.openInNewWindow();   // открыть в новой вкладке
link.setDisabled(true);
```

| Метод | Описание |
|---|---|
| `setText(t)` / `getText()` | Текст ссылки |
| `setHref(url)` / `getHref()` | Адрес |
| `openInNewWindow()` | Открыть в новой вкладке |
| `setDisabled(bool)` | Отключить |

---

## VerticalLayout — Вертикальная раскладка

Три зоны: верхняя (фиксированная высота) → средняя (растягивается) → нижняя (фиксированная).

```javascript
const layout = new VerticalLayout();
layout.setTopHeight(60);
layout.setBottomHeight(40);
layout.setTopContent(toolbar);
layout.setMiddleContent(grid.element);
layout.setBottomContent(statusBar);
```

| Метод | Описание |
|---|---|
| `setTopHeight(px)` / `setBottomHeight(px)` | Высота зон |
| `setTopContent(el)` / `setMiddleContent(el)` / `setBottomContent(el)` | Содержимое |
| `appendToTop(el)` / `appendToMiddle(el)` / `appendToBottom(el)` | Добавить |
| `getTop()` / `getMiddle()` / `getBottom()` | Получить div зоны |

---

## HorizontalLayout — Горизонтальная раскладка

Три зоны: левая (фиксированная ширина) → средняя (растягивается) → правая (фиксированная).

```javascript
const layout = new HorizontalLayout();
layout.setLeftWidth(250);
layout.setRightWidth(200);
layout.setLeftContent(navList);
layout.setMiddleContent(detailView);
layout.setRightContent(properties);
```

| Метод | Описание |
|---|---|
| `setLeftWidth(px)` / `setRightWidth(px)` | Ширина зон |
| `setLeftContent(el)` / `setMiddleContent(el)` / `setRightContent(el)` | Содержимое |
| `appendToLeft(el)` / `appendToMiddle(el)` / `appendToRight(el)` | Добавить |
| `getLeft()` / `getMiddle()` / `getRight()` | Получить div зоны |

---

## Formatters — Форматирование данных

```javascript
import { NumberFormatter, DateFormatter, HTMLFormatter, StringFormatter } from './UIKit/index.js';
```

### NumberFormatter
```javascript
NumberFormatter.format(1234.5, 'USD');      // "$1,234.50"
NumberFormatter.format(1234.5, 'EUR');      // "€1.234,50"
NumberFormatter.format(0.15, 'PCT');        // "15%"
NumberFormatter.format(1234, { decimals: 2, thousands: ' ' });  // "1 234.00"
NumberFormatter.parse("$1,234.50");         // 1234.5
```

### DateFormatter
```javascript
DateFormatter.format(new Date(), 'YYYY-MM-DD');   // "2026-06-25"
DateFormatter.format(new Date(), 'DD.MM.YYYY');   // "25.06.2026"
DateFormatter.format(new Date(), 'LONG');          // "June 25, 2026"
DateFormatter.parse('2026-06-25');                 // объект Date
```

### HTMLFormatter
```javascript
HTMLFormatter.escape('<script>alert(1)</script>');   // безопасная строка
HTMLFormatter.sanitize(userHtml);                    // удаляет скрипты
```

### StringFormatter
```javascript
StringFormatter.capitalize('привет');        // "Привет"
StringFormatter.truncate('длинный текст', 5); // "длинн..."
StringFormatter.pad('42', 5, '0', 'left');   // "00042"
```

---

## Validators — Валидаторы

Валидаторы для компонента Form.

```javascript
import { Validators } from './UIKit/index.js';

form.addField('email', {
  label: 'Email',
  validators: [Validators.required, Validators.email()],
});
```

| Валидатор | Описание |
|---|---|
| `required` | Обязательное поле |
| `email()` | Формат email |
| `url()` | Формат URL |
| `number()` | Числовое значение |
| `integer()` | Целое число |
| `minLength(n)` / `maxLength(n)` | Диапазон длины |
| `min(n)` / `max(n)` | Числовой диапазон |
| `pattern(regex)` | Регулярное выражение |
| `custom(fn)` | Свой валидатор |
| `matches(field)` | Должно совпадать с другим полем |

---

## CSS-темы

### Modern (по умолчанию) — стиль Ant Design
```html
<link rel="stylesheet" href="UIKit/styles/modern.css">
```

### Tabulator — терминальный стиль
```html
<link rel="stylesheet" href="UIKit/styles/tabulator.css">
```

### Classic — минимальный
```html
<link rel="stylesheet" href="UIKit/styles/components.css">
```

### CSS-переменные
```css
:root {
  --primary-color: #1677ff;
  --bg-white: #ffffff;
  --text-color: #333;
  --border-color: #d9d9d9;
}
```

---

## Base — Базовый класс

Все компоненты наследуются от Base. Эти методы доступны в каждом компоненте.

```javascript
component.element              // нативный HTMLElement
component.append(child)        // добавить потомка (Base или HTMLElement)
component.clear()              // удалить всех потомков
component.destroy()            // уничтожить компонент и потомков

component.addClass('my-class')
component.removeClass('my-class')
component.setStyle('color', 'red')

component.setProperty('key', value)
component.getProperty('key', defaultValue)

component.on('change', handler)
component.off('change', handler)
component.emit('change', { value: 42 })

component.show()
component.hide()
component.isVisible()

component.beginUpdate()
// ... несколько изменений ...
component.endUpdate()          // одна отрисовка
```

---

## Порядок z-index слоёв

```
Фон диалога:       1050
Контейнер диалога:  1050 + (глубина × 10)
Всплывающие меню:   1500
DropdownMenu:       2000
Подсказки:         10000
```

---

**Лицензия:** Свободное использование без ограничений.
