# UIKit

Pure JavaScript UI component library. No dependencies, no frameworks.

Part of the [Olevsoft](https://olevsoft.com) toolset — used in production by
[IMS2](https://github.com/ko-evge/ims2), a warehouse management system
([live demo](https://demo.olevsoft.com), login `admin` / `USR`).
See also [PForm2](https://github.com/ko-evge/PForm2) (report engine) and
[IMSD](https://github.com/ko-evge/IMSD) (desktop distribution).

```javascript
import { Button, Grid, Dialog } from './UIKit/index.js';
```

```html
<link rel="stylesheet" href="UIKit/styles/modern.css">
```

### Live Demo

Open **examples.html** in browser to see all components in action with live examples.

```
http://localhost:8000/examples.html
```

---

## Button

A button to trigger actions.

### When to use
- Primary action on a form (Save, Submit)
- Toolbar commands with function key hints (F2, F3)
- Danger actions (Delete)

### Basic usage

```javascript
const btn = new Button('Save', () => {
  console.log('Saved!');
});
document.body.appendChild(btn.element);
```

### Variants

```javascript
// Types — visual style
btn.setType('primary');   // blue, main action
btn.setType('danger');    // red, destructive
btn.setType('success');   // green, confirmation
btn.setType('warning');   // orange, caution
btn.setType('default');   // gray, secondary

// Sizes
btn.setSize('small');
btn.setSize('large');

// Function key hint — shows "[F2]" after label
btn.setFKey('F2');

// Disabled state
btn.setDisabled(true);
```

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `text` | string | `''` | Button label |
| `type` | string | `'default'` | `'default'` `'primary'` `'danger'` `'success'` `'warning'` |
| `size` | string | `'medium'` | `'small'` `'medium'` `'large'` |
| `fKey` | string | — | Function key hint |
| `disabled` | bool | `false` | Disabled state |

| Method | Description |
|---|---|
| `setText(text)` | Set label |
| `getText()` | Get label (includes fKey) |
| `setType(type)` / `getType()` | Set/get visual style |
| `setSize(size)` | Set size (`'small'` `'medium'` `'large'`) |
| `setFKey(key)` | Show function key hint |
| `setDisabled(bool)` | Enable/disable |
| `isDisabled()` | Check if disabled |
| `click()` | Programmatic click |

---

## Input

Text input field.

### When to use
- Single-line text entry (name, email, search)
- Numeric input (quantity, price)

### Basic usage

```javascript
const name = new Input('text', 'Enter name');
name.setValue('John');
name.on('change', ({ value }) => {
  console.log('Typed:', value);  // fires on every keystroke
});
```

### Variants

```javascript
const qty = new Input('number', 'Quantity');
name.setReadonly(true);
name.setDisabled(true);
name.focus();
name.selectAll();
name.clear();
```

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `type` | string | `'text'` | HTML input type |
| `placeholder` | string | `''` | Placeholder text |
| `readonly` | bool | `false` | Read-only |
| `disabled` | bool | `false` | Disabled |

| Method | Description |
|---|---|
| `setValue(v)` / `getValue()` | Set/get value |
| `setPlaceholder(text)` | Set placeholder |
| `setType(type)` | Change input type (`'text'` `'number'` `'date'` `'email'` `'password'`) |
| `setReadonly(bool)` | Read-only mode |
| `setDisabled(bool)` | Disable |
| `focus()` `clear()` `selectAll()` | Focus, clear, select all |

| Event | Payload | Description |
|---|---|---|
| `change` | `{ value }` | Fires on every keystroke (`'input'` → `'change'` bridge) |

---

## Label

Text label.

```javascript
const lbl = new Label('Username');
lbl.setFor('my-input');  // links to input via htmlFor
```

| Method | Description |
|---|---|
| `setText(text)` / `getText()` | Label text |
| `setFor(id)` / `getFor()` | Link to input element via `htmlFor` |

---

## Checkbox

Checkbox (yes/no).

```javascript
const cb = new Checkbox('I agree to terms');
cb.on('change', ({ checked }) => console.log(checked));
cb.setChecked(true);
cb.toggle();
```

| Method | Description |
|---|---|
| `setChecked(bool)` / `isChecked()` | Checked state |
| `setValue(v)` / `getValue()` | Alias for Forms |
| `setLabel(text)` | Label text |
| `setDisabled(bool)` | Disable |
| `toggle()` | Toggle state |
| `focus()` | Focus the checkbox |

| Event | Payload |
|---|---|
| `change` | `{ checked: boolean }` |

---

## RadioButton

Radio group — pick one of several.

```javascript
const color = new RadioButton('color', [
  { value: 'r', label: 'Red' },
  { value: 'g', label: 'Green' },
  { value: 'b', label: 'Blue' },
]);
color.setValue('g');
color.on('change', ({ value, label }) => console.log(value));
```

| Method | Description |
|---|---|
| `setOptions(arr)` | Set options `[{value, label}]` |
| `addOption(value, label)` | Add option |
| `removeOption(value)` | Remove option |
| `setValue(v)` / `getValue()` | Selected value |
| `setDisabled(bool)` | Disable all |

| Event | Payload |
|---|---|
| `change` | `{ value, label }` |

---

## Textarea

Multi-line text input.

```javascript
const note = new Textarea('Enter description');
note.setRows(5);
note.setMaxLength(500);
note.on('change', ({ value }) => console.log(value));
```

| Method | Description |
|---|---|
| `setValue(v)` / `getValue()` | Value |
| `setPlaceholder(text)` | Placeholder text |
| `setRows(n)` | Visible rows |
| `setMaxLength(n)` | Max characters (null = no limit) |
| `setReadonly(bool)` | Read-only |
| `setDisabled(bool)` | Disable |
| `focus()` `clear()` `selectAll()` | Focus, clear, select all |
| `getCharCount()` | Current length |

| Event | Payload |
|---|---|
| `change` | `{ value }` |

---

## Combo

Autocomplete input. Use when the user needs to search a dataset.

### When to use
- Search through a list of items (products, customers)
- Server-side search with debounce
- When the list is too large for a dropdown

### Basic usage

```javascript
const combo = new Combo('Search product...');
combo.setOptions([
  { value: 1, label: 'Laptop' },
  { value: 2, label: 'Monitor' },
  { value: 3, label: 'Keyboard' },
]);
combo.on('change', ({ value, label }) => console.log(value));
```

### Async search — server-side filtering

```javascript
combo.setAsyncSearch(async (query) => {
  const res = await fetch(`/api/search?q=${query}`);
  return await res.json();  // must return [{value, label}]
});
combo.setMinChars(2);     // start searching after 2 chars
combo.setDebounce(300);   // wait 300ms after typing stops
```

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `placeholder` | string | `''` | Placeholder text |
| `minChars` | int | `2` | Min chars to trigger search |
| `debounceMs` | int | `300` | Debounce delay |
| `maxResults` | int | `50` | Max dropdown items |
| `isLoading` | bool | `false` | Loading state |
| `disabled` | bool | `false` | Disabled state |

| Method | Description |
|---|---|
| `setOptions(arr)` | Static options `[{value, label}]` |
| `addOption(value, label)` | Add single option |
| `removeOption(value)` | Remove single option |
| `setAsyncSearch(fn)` | Server-side search function |
| `setValue(v)` / `getValue()` | Value |
| `setPlaceholder(text)` | Set placeholder text |
| `setMinChars(n)` / `setDebounce(n)` | Search threshold / delay |
| `setDisabled(bool)` | Disable |
| `getSelectedOption()` | Full selected option object |
| `showMenu()` / `hideMenu()` | Open/close dropdown |
| `clear()` / `focus()` | Clear, focus |

| Event | Payload |
|---|---|
| `change` | `{ value, label, option }` |

---

## Dropdown

Dropdown — pick one option from a list.

```javascript
const dd = new Dropdown('Select country');
dd.setOptions([
  { value: 'us', label: 'United States' },
  { value: 'de', label: 'Germany' },
  { value: 'jp', label: 'Japan' },
]);
dd.setValue('us');
dd.on('change', ({ value, label }) => console.log(value));
```

| Method | Description |
|---|---|
| `setOptions(arr)` | Set options `[{value, label}]` |
| `getOptions()` | Get all options |
| `addOption(value, label)` | Add single option |
| `removeOption(value)` | Remove single option |
| `setValue(v)` / `getValue()` | Selected value |
| `setDisabled(bool)` | Disable |
| `setWidth(w)` | Custom width |
| `getButton()` / `getMenu()` | Get DOM elements |
| `toggleMenu()` / `openMenu()` / `closeMenu()` | Menu control |

| Event | Payload |
|---|---|
| `change` | `{ value, label }` |

---

## Select

Native `<select>` for large lists (50+ items). Uses browser's built-in menu.

### When to use
- Lists with 50+ items (references, catalogs)
- When native keyboard search is important
- Auto-open on creation with `showPicker()`

```javascript
const sel = new Select('Choose reference');
sel.setOptions(refs.map(r => ({ value: r.code, label: r.name })));
sel.showPicker();  // auto-opens native menu
sel.on('change', ({ value, label }) => openRef(value));
```

| Method | Description |
|---|---|
| `setOptions(arr)` | Set options `[{value, label}]` |
| `getOptions()` | Get all options |
| `setValue(v)` / `getValue()` | Selected value |
| `showPicker()` | Open native menu (Chrome 101+) |
| `setDisabled(bool)` | Disable |
| `focus()` / `click()` | Focus / click |

| Event | Payload |
|---|---|
| `change` | `{ value, label, option }` |

---

## DatePicker

Date picker with calendar popup.

```javascript
const dp = new DatePicker('Select date');
dp.setValue('2026-06-25');
dp.setMinDate('2026-01-01');
dp.setMaxDate('2026-12-31');
dp.on('change', ({ value }) => console.log(value));  // "2026-06-25"
```

| Method | Description |
|---|---|
| `setValue(v)` / `getValue()` | Date as `'YYYY-MM-DD'` |
| `setMinDate(d)` / `setMaxDate(d)` | Allowed range |
| `setWidth(w)` | Custom width |
| `showCalendar()` / `hideCalendar()` | Open/close |

| Event | Payload |
|---|---|
| `change` | `{ value: 'YYYY-MM-DD' }` |

---

## Dialog

Modal dialog.

### When to use
- Edit forms over the main screen
- Confirmation prompts (delete, process)
- Alert messages

### Basic usage

```javascript
const dlg = new Dialog('Edit User');
dlg.setWidth('500px');
dlg.setHeight('400px');
dlg.setContent(formElement);

const footer = dlg.getFooter();
footer.appendChild(new Button('Save', () => save()).element);
footer.appendChild(new Button('Cancel', () => dlg.hide()).element);

dlg.show();
```

### Function keys — keyboard shortcuts inside dialog

```javascript
dlg.setFKeys({
  'F2':     () => save(),
  'F3':     () => addNew(),
  'Escape': () => dlg.hide(),
});
```

### Quick dialogs — one-liners

```javascript
Dialog.alert('Error', 'Something went wrong');
Dialog.confirm('Delete this item?', () => deleteItem());
```

### Stacking

Dialogs auto-stack: each new dialog gets a higher z-index and cascades 36px down-right.

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `title` | string | `''` | Dialog title |
| `size` | string | `'medium'` | `'small'` `'medium'` `'large'` |
| `closable` | bool | `true` | Show close button |
| `fillSpace` | bool | `false` | Remove content padding |
| `closeOnBackdrop` | bool | `false` | Close by clicking backdrop |
| `customWidth` | string | — | Custom width |
| `customHeight` | string | — | Custom height |
| `debugId` | string | — | Debug label |

| Method | Description |
|---|---|
| `setTitle(text)` | Title |
| `setContent(el)` / `appendContent(el)` | Body content |
| `getHeader()` | Header element |
| `setHeaderContent(el)` | Custom header content |
| `getFooter()` | Footer element (add buttons here) |
| `setWidth(w)` / `setHeight(h)` | Dimensions |
| `setSize(size)` | `'small'` `'medium'` `'large'` |
| `setClosable(bool)` | Show/hide close button |
| `setFillSpace(bool)` | Remove content padding |
| `setDebugId(id)` | Debug label |
| `setFKeys(map)` | Keyboard shortcuts `{key: fn}` |
| `show()` / `hide()` / `close()` | Show/hide |

| Static Method | Description |
|---|---|
| `Dialog.alert(title, message)` | Quick alert dialog |
| `Dialog.confirm(title, onConfirm, onCancel)` | Quick confirm dialog |

| Event | Payload |
|---|---|
| `close` | `{}` |

---

## Panel

Panel with header, body, and footer. Can collapse.

```javascript
const panel = new Panel('Settings');
panel.setContent(someElement);
panel.getFooter().appendChild(saveBtn.element);
panel.setCollapsible(true);
panel.setCollapsed(true);    // initially collapsed
panel.toggleCollapsed();     // toggle state
```

| Method | Description |
|---|---|
| `setTitle(text)` / `getTitle()` | Title |
| `setCollapsible(bool)` | Allow collapse |
| `setCollapsed(bool)` / `toggleCollapsed()` | Collapse/expand |
| `setContent(el)` / `appendContent(el)` / `clearContent()` | Content |
| `setHeaderContent(el)` | Custom header (replaces title) |
| `setFooter(el)` | Footer content |
| `getHeader()` / `getContent()` / `getFooter()` | Panel sections |
| `setFillSpace(bool)` | Remove content padding |
| `appendToBody(el)` | Append element above content zone (toolbar) |
| `insertBeforeContent(el)` | Insert element before content |
| `alignTop()` / `alignCenter()` / `alignBottom()` | Position modes (AbsoluteWidgets style) |

---

## Tabs

Tabs — switch between content panels.

```javascript
const tabs = new Tabs();
tabs.addTab('general',  'General',  generalContent, true);
tabs.addTab('advanced', 'Advanced', advancedContent);
tabs.on('change', ({ activeTab }) => console.log(activeTab));
tabs.activateTab('advanced');
tabs.setTabDisabled('about', true);
```

| Method | Description |
|---|---|
| `addTab(key, label, content, active)` | Add tab |
| `removeTab(key)` | Remove tab |
| `activateTab(key)` | Switch to tab |
| `getActiveTab()` | Active tab key |
| `setTabContent(key, el)` / `getTabContent(key)` | Update/get tab panel |
| `getTabs()` | Get array of tab keys |
| `setTabDisabled(key, bool)` | Disable |

| Event | Payload |
|---|---|
| `change` | `{ activeTab: key }` |

---

## List

Scrollable list with selection.

```javascript
const list = new List();
list.setItems([
  { value: 1, label: 'First item' },
  { value: 2, label: 'Second item' },
  { value: 3, label: 'Third item', disabled: true },
]);
list.on('select', ({ item, index }) => console.log(item.label));

// Multi-select mode
list.setMultiSelect(true);
list.on('selectionchange', ({ selected }) => console.log(selected));
```

| Method | Description |
|---|---|
| `setItems(arr)` | Items `[{value, label, disabled}]` |
| `addItem(value, label)` / `removeItem(value)` | Add/remove |
| `setMultiSelect(bool)` | Multi-select mode |
| `getSelectedItem()` / `getSelectedItems()` | Selected |
| `setSelectedItem(value)` | Set selection |
| `clearSelection()` | Clear |
| `scrollToItem(index)` | Scroll to |

| Event | Payload |
|---|---|
| `select` | `{ item, index }` — single mode |
| `selectionchange` | `{ selected: [] }` — multi mode |

---

## Grid

Data grid with sorting, filtering, inline editing, pagination, and keyboard navigation. The main workhorse component.

### When to use
- Display tabular data (documents, products, references)
- Inline cell editing (prices, quantities)
- Multi-select with checkboxes
- Large datasets with pagination or virtual scrolling

### Basic usage

```javascript
const grid = new Grid();
grid.setHeaders([
  { key: 'name',  label: 'Name',  width: '200px', sortable: true },
  { key: 'price', label: 'Price', width: '100px', align: 'right' },
  { key: 'qty',   label: 'Qty',   width: '80px' },
]);
grid.setRows([
  { name: 'Laptop',  price: 999, qty: 5 },
  { name: 'Mouse',   price: 29,  qty: 50 },
  { name: 'Monitor', price: 499, qty: 12 },
]);
grid.on('rowClick', ({ row }) => console.log(row.name));
```

### Column formatters

```javascript
grid.setHeaders([
  { key: 'price', label: 'Price', width: '100px',
    formatter: (value) => `$${parseFloat(value).toFixed(2)}` },
  { key: 'status', label: 'Status', width: '80px',
    formatter: (value) => value === '1'
      ? '<span style="color:green">Active</span>'
      : '<span style="color:red">Closed</span>' },
]);
```

### Inline editing

```javascript
grid.setProperty('editable', true);
grid.setEditableColumn('price', true);
grid.on('celledit', ({ row, column, value, rowIndex }) => {
  saveToServer(row, column, value);
});
```

### Sorting

```javascript
grid.setProperty('sortable', true);
grid.on('sortchange', ({ column, order }) => console.log(column, order));
```

### Filtering

```javascript
grid.setProperty('filterable', true);
grid.addFilter('price', '>', 100);
grid.addFilter('name', 'contains', 'lap');
// Operators: equals, contains, startsWith, endsWith, >, <, >=, <=, between
grid.clearFilters();
```

### Multi-select

```javascript
grid.setProperty('multiSelect', true);
grid.on('selectionchange', ({ selected }) => console.log(selected));
```

### Row styling

```javascript
grid.setRowStyle((row) => {
  if (row.qty === 0) return { color: 'red' };
  if (row.qty < 5)   return { color: 'orange' };
  return {};
});
```

### Keyboard

```javascript
grid.setProperty('keyboard', true);
// ↑↓ navigate rows, ←→ columns, Enter edit, Escape cancel,
// Space toggle checkbox, Home/End first/last row
```

### API

| Prop | Type | Default | Description |
|---|---|---|---|
| `sortable` | bool | `false` | Click-to-sort headers |
| `filterable` | bool | `false` | Column filter popups |
| `editable` | bool | `false` | Double-click to edit |
| `multiSelect` | bool | `false` | Checkbox multi-select |
| `highlightRow` | bool | `false` | Highlight current row |
| `resizable` | bool | `false` | Drag to resize columns |
| `keyboard` | bool | `false` | Keyboard navigation |
| `virtual` | bool | `false` | Virtual scrolling (10K+ rows) |
| `pageSize` | int | `50` | Rows per page |
| `hideToolbar` | bool | `false` | Hide pagination |

| Method | Description |
|---|---|
| `setHeaders(arr)` | Columns `[{key, label, width, sortable, formatter, editable, align}]` |
| `setRows(arr)` | Set all rows |
| `addRow(data)` / `removeRow(idx)` / `updateRow(idx, data)` | Row operations |
| `setRowStyle(fn)` | Conditional row styling |
| `setFormatter(key, fn)` | Column formatter |
| `setSortColumn(column, order)` / `getSortState()` | Sort control |
| `clearSort()` | Remove current sort |
| `setKeyboardNav(enabled)` | Enable/disable keyboard navigation |
| `setVirtualScroll(enabled, rowHeight)` | Virtual scrolling for 10K+ rows |
| `getVirtualScrollInfo()` | `{ enabled, rowHeight, totalRows }` |
| `addFilter(key, op, val)` / `removeFilter(key)` / `clearFilters()` | Filter control |
| `setFilter(text)` | Text search all columns |
| `getSelectedRows()` | Get selected rows array |
| `clearSelection()` | Clear all selection |
| `cancelEdit()` | Cancel current inline edit |

| Event | Payload | Description |
|---|---|---|
| `rowClick` | `{ row, event }` | Row clicked |
| `rowDoubleClick` | `{ row, event }` | Row double-clicked |
| `rowMouseOver` | `{ row, event }` | Mouse over row |
| `rowMouseOut` | `{ row, event }` | Mouse out row |
| `cellClick` | `{ column, row, event }` | Cell clicked |
| `cellDoubleClick` | `{ column, row, event }` | Cell double-clicked |
| `headerClick` | `{ column }` | Header clicked |
| `headerDoubleClick` | `{ column }` | Header double-clicked |
| `celledit` | `{ row, column, value, rowIndex }` | Cell edited |
| `selectionchange` | `{ selected }` | Checkbox multi-select changed |
| `rowselect` | `{ row, index }` | Row selected by click |
| `currentRowChanged` | `{ row }` | Current row changed |
| `currentColumnChanged` | `{ column }` | Current column changed |
| `sortchange` | `{ column, order }` | Sort changed |
| `filterchange` | `{ column, operator, value }` | Filter changed |
| `columnresize` | `{ column, width }` | Column resized |
| `scrollLeftChanged` | `{ value }` | Horizontal scroll |
| `scrollTopChanged` | `{ value }` | Vertical scroll |

---

## Table

Simple table without sorting or pagination. For small datasets.

```javascript
const table = new Table();
table.setHeaders(['Name', 'Email', 'Age']);
table.setRows([
  ['John', 'john@test.com', 30],
  ['Jane', 'jane@test.com', 25],
]);
table.on('rowselect', ({ index, data }) => console.log(data));
```

| Method | Description |
|---|---|
| `setHeaders(arr)` / `getHeaders()` | Column names (strings) |
| `setRows(arr)` / `getRows()` | Row data (arrays or objects) |
| `addRow(data)` / `removeRow(idx)` | Add/remove rows |
| `updateRow(index, data)` | Update row at index |
| `clearRows()` | Clear all rows |
| `getSelectedRow()` | `{index, data}` or null |

| Event | Payload |
|---|---|
| `rowselect` | `{ index, data }` |

---

## Form

Form with automatic field validation.

```javascript
const form = new Form();
form.addField('name',  { label: 'Name',  type: 'text',   required: true });
form.addField('email', { label: 'Email', type: 'text',
  validators: [Validators.email()] });
form.addField('age',   { label: 'Age',   type: 'number' });

form.on('submit', ({ data, valid }) => {
  if (valid) saveUser(data);
});

form.setData({ name: 'John', email: 'john@test.com', age: 30 });
const data = form.getData();
form.validate();
form.reset();
```

| Method | Description |
|---|---|
| `addField(name, config)` | Add field. config: `{label, type, placeholder, required, validators, value}` |
| `removeField(name)` | Remove field |
| `getData()` / `setData(obj)` | All fields |
| `getFieldValue(name)` / `setFieldValue(name, v)` | Single field |
| `getField(name)` | Get UIKit Input component |
| `validate()` | Validate all (returns bool) |
| `getErrors()` / `clearErrors()` | Errors |
| `reset()` | Clear data + errors |

| Event | Payload |
|---|---|
| `submit` | `{ data, valid }` |
| `fieldvalidate` | `{ field, error }` |

---

## DropdownMenu

Button with a dropdown action menu. For "Options ▾" menus.

```javascript
const menu = new DropdownMenu('Options');
menu.addItem('Edit',     () => edit());
menu.addItem('Delete',   () => del(), { disabled: true });
menu.addItem('---');                          // separator
menu.addGroup('Export', [                     // submenu
  { label: 'PDF', fn: () => exportPDF() },
  { label: 'CSV', fn: () => exportCSV() },
]);
```

| Method | Description |
|---|---|
| `addItem(label, fn, opts)` | Add item. `'---'` = separator. opts: `{key, disabled}` |
| `addGroup(label, items)` | Add submenu `[{label, fn, opts}]` |

---

## Link

Hyperlink.

```javascript
const link = new Link('Documentation', 'https://example.com');
link.openInNewWindow();
link.setDisabled(true);
```

| Method | Description |
|---|---|
| `setText(t)` / `getText()` | Link text |
| `setHref(url)` / `getHref()` | URL |
| `openInNewWindow()` | Open in new tab |
| `setDisabled(bool)` | Disable |

---

## VerticalLayout

Vertical layout: top (fixed) → middle (stretches) → bottom (fixed).

```javascript
const layout = new VerticalLayout();
layout.setTopHeight(60);
layout.setBottomHeight(40);
layout.setTopContent(toolbar);
layout.setMiddleContent(grid.element);
layout.setBottomContent(statusBar);
```

| Method | Description |
|---|---|
| `setTopHeight(px)` / `setBottomHeight(px)` | Zone heights |
| `setTopContent(el)` / `setMiddleContent(el)` / `setBottomContent(el)` | Content |
| `appendToTop(el)` / `appendToMiddle(el)` / `appendToBottom(el)` | Append |
| `getTop()` / `getMiddle()` / `getBottom()` | Get zone divs |

---

## HorizontalLayout

Horizontal layout: left (fixed) → middle (stretches) → right (fixed).

```javascript
const layout = new HorizontalLayout();
layout.setLeftWidth(250);
layout.setRightWidth(200);
layout.setLeftContent(navList);
layout.setMiddleContent(detailView);
layout.setRightContent(properties);
```

| Method | Description |
|---|---|
| `setLeftWidth(px)` / `setRightWidth(px)` | Zone widths |
| `setLeftContent(el)` / `setMiddleContent(el)` / `setRightContent(el)` | Content |
| `appendToLeft(el)` / `appendToMiddle(el)` / `appendToRight(el)` | Append |
| `getLeft()` / `getMiddle()` / `getRight()` | Get zone divs |

---

## Formatters

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
DateFormatter.parse('2026-06-25');                 // Date object
```

### HTMLFormatter
```javascript
HTMLFormatter.escape('<script>alert(1)</script>');   // safe string
HTMLFormatter.sanitize(userHtml);                    // remove scripts
```

### StringFormatter
```javascript
StringFormatter.capitalize('hello');         // "Hello"
StringFormatter.truncate('long text', 5);    // "long ..."
StringFormatter.pad('42', 5, '0', 'left');   // "00042"
```

---

## Validators

Validators for Form component.

```javascript
import { Validators } from './UIKit/index.js';

form.addField('email', {
  label: 'Email',
  validators: [Validators.required, Validators.email()],
});
```

| Validator | Description |
|---|---|
| `required` | Field must not be empty |
| `email()` | Valid email format |
| `url()` | Valid URL |
| `number()` | Numeric value |
| `integer()` | Integer value |
| `minLength(n)` / `maxLength(n)` | Length range |
| `min(n)` / `max(n)` | Numeric range |
| `pattern(regex)` | Regex match |
| `custom(fn)` | Custom validator function |
| `matches(field)` | Must match another field |

---

## CSS Themes

### Modern (default) — Ant Design style
```html
<link rel="stylesheet" href="UIKit/styles/modern.css">
```

### Tabulator — Terminal style
```html
<link rel="stylesheet" href="UIKit/styles/tabulator.css">
```

### Classic — Minimal
```html
<link rel="stylesheet" href="UIKit/styles/components.css">
```

### CSS Variables
```css
:root {
  --primary-color: #1677ff;
  --bg-white: #ffffff;
  --text-color: #333;
  --border-color: #d9d9d9;
}
```

---

## Density / Sizing

Component height and text size are driven by a separate set of tokens from
color/theme — every theme (`modern.css`, `beige.css`, `gruvbox.css`,
`linear.css`) declares the same values, so overriding them centrally in your
app stylesheet (loaded after the theme `<link>`) rescales `Input`, `Select`,
`Combo`, `Dropdown`, `DatePicker` and **Grid row/header height** together,
without touching any theme file:

```css
:root {
  --size-sm: clamp(1.5rem, 3vw, 1.75rem);   /* small controls */
  --size-md: clamp(2rem,   3vw, 2.1rem);    /* default control height, incl. Grid rows */
  --size-lg: clamp(2.5rem, 4vw, 2.6rem);    /* large controls */

  --font-size-small: clamp(0.75rem, 0.8vw + 0.15rem, 0.85rem);
  --font-size-base:  clamp(0.875rem, 1vw + 0.2rem,   0.95rem);
  --font-size-large: clamp(1rem,     1.2vw + 0.2rem,  1.1rem);

  --padding-xs: clamp(0.2rem, 0.5vw, 0.3rem);
  --padding-sm: clamp(0.4rem, 1vw,   0.5rem);
  --padding-lg: clamp(1rem,   2vw,   1.15rem);
}
```

`Dialog` header padding, footer button height and the close-button size are a
separate small set of tokens (`--dlg-header-pad-v/-h`, `--btn-height`,
`--dlg-close-size`, `--btn-padding`, `--btn-font`) for the same reason —
`Dialog` markup is shared by every theme but its chrome isn't part of the
`--size-*` scale.

A consuming app can expose 2–3 named presets (e.g. Compact / Normal /
Comfortable) by scoping these overrides under a class on `<html>` and
toggling it at runtime — this is exactly how IMS2's own density switcher
(login screen, top-right) works; see `app.css` (`html.density-normal`,
`html.density-comfortable`) and `density.js` in the IMS2 repo for a full
worked example, including the `localStorage` + FOUC-safe pre-apply pattern
also used for theme selection.

---

## Base Class

All components extend Base. These methods are available on every component.

```javascript
component.element              // native HTMLElement
component.append(child)        // add child (Base or HTMLElement)
component.clear()              // remove all children
component.destroy()            // destroy component + children

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
// ... multiple changes ...
component.endUpdate()          // single render
```

---

## z-index Layers

```
Dialog backdrop:  1050
Dialog container: 1050 + (depth × 10)
Popup menus:      1500
DropdownMenu:     2000
Tooltips:        10000
```

---

**License:** Free for any use.
