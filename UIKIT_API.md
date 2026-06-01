# UIKit API Documentation

Complete API reference for UIKit components with descriptions, methods, properties, and examples.

**Table of Contents:**
- [Base Component](#base-component)
- [Button](#button)
- [Input](#input)
- [Label](#label)
- [Textarea](#textarea)
- [Checkbox](#checkbox)
- [RadioButton](#radiobutton)
- [Dropdown](#dropdown)
- [Combo](#combo)
- [DatePicker](#datepicker)
- [Grid](#grid)
- [Form](#form)
- [Dialog](#dialog)
- [Panel](#panel)
- [Tabs](#tabs)
- [List](#list)
- [Link](#link)
- [Table](#table)
- [Validators](#validators)

---

## Base Component

**Description:** Base class for all UIKit components. Provides property management, event system, and DOM rendering.

**Import:**
```javascript
import { Base } from '@evge/uikit';
```

**Methods:**

### createElement(tagName, className)
Create and set up the DOM element.
```javascript
const div = new Base();
div.createElement('div', 'my-container');
```

### getDOMElement()
Get the raw DOM element.
```javascript
const element = component.getDOMElement();
document.body.appendChild(element);
```

### setProperty(key, value)
Set internal property value.
```javascript
component.setProperty('disabled', true);
```

### getProperty(key, defaultValue)
Get internal property value.
```javascript
const isDisabled = component.getProperty('disabled', false);
```

### addClass(className)
Add CSS class to element.
```javascript
component.addClass('highlight');
```

### removeClass(className)
Remove CSS class from element.
```javascript
component.removeClass('highlight');
```

### emit(eventName, data)
Emit custom event.
```javascript
component.emit('custom-event', { value: 'data' });
```

### on(eventName, callback)
Listen to events.
```javascript
component.on('change', (e) => console.log(e.value));
```

### append(component)
Add child component.
```javascript
container.append(button).append(input);
```

---

## Button

**Description:** Clickable button component with multiple types and sizes.

**Import:**
```javascript
import { Button } from '@evge/uikit';
```

**Constructor:**
```javascript
const button = new Button(text, onClick);
```

**Properties:**
- `type` - 'primary' | 'default' | 'danger' (default: 'default')
- `size` - 'small' | 'medium' | 'large' (default: 'medium')
- `disabled` - boolean (default: false)

**Methods:**

### setType(type)
Set button type.
```javascript
button.setType('primary');
button.setType('danger');
```

### getType()
Get current button type.
```javascript
const type = button.getType(); // 'primary'
```

### setSize(size)
Set button size.
```javascript
button.setSize('large');
```

### setDisabled(disabled)
Enable/disable button.
```javascript
button.setDisabled(true);
```

### setText(text)
Change button text.
```javascript
button.setText('Click me');
```

**Events:**
- `click` - Fired when button is clicked

**Example:**
```javascript
const btn = new Button('Delete', () => {
  if (confirm('Are you sure?')) {
    deleteItem();
  }
});
btn.setType('danger');
btn.setSize('small');
document.body.appendChild(btn.getDOMElement());
```

---

## Input

**Description:** Text input field with multiple types and variants.

**Import:**
```javascript
import { Input } from '@evge/uikit';
```

**Constructor:**
```javascript
const input = new Input(type, placeholder);
// type: 'text' | 'email' | 'password' | 'number' | 'date'
```

**Properties:**
- `type` - Input type (default: 'text')
- `placeholder` - Placeholder text
- `value` - Current value
- `disabled` - boolean
- `required` - boolean
- `variant` - 'default' | 'filled' | 'underlined'

**Methods:**

### setValue(value)
Set input value.
```javascript
input.setValue('hello@example.com');
```

### getValue()
Get input value.
```javascript
const value = input.getValue();
```

### setPlaceholder(text)
Set placeholder text.
```javascript
input.setPlaceholder('Enter email...');
```

### setDisabled(disabled)
Disable/enable input.
```javascript
input.setDisabled(true);
```

### setRequired(required)
Mark as required.
```javascript
input.setRequired(true);
```

### setVariant(variant)
Set input variant.
```javascript
input.setVariant('filled');
input.setVariant('underlined');
```

### clear()
Clear input value.
```javascript
input.clear();
```

### focus()
Set focus to input.
```javascript
input.focus();
```

**Events:**
- `change` - Fired on value change
- `input` - Fired on input (real-time)
- `focus` - Fired on focus
- `blur` - Fired on blur

**Example:**
```javascript
const email = new Input('email', 'Enter email');
email.setVariant('filled');

email.on('change', (e) => {
  console.log('Email changed:', email.getValue());
});

document.body.appendChild(email.getDOMElement());
```

---

## Label

**Description:** Text label for form fields.

**Import:**
```javascript
import { Label } from '@evge/uikit';
```

**Constructor:**
```javascript
const label = new Label(text);
```

**Methods:**

### setText(text)
Set label text.
```javascript
label.setText('Full Name');
```

### getText()
Get label text.
```javascript
const text = label.getText();
```

### setRequired(required)
Show/hide required indicator (*).
```javascript
label.setRequired(true);
```

**Example:**
```javascript
const nameLabel = new Label('Username');
nameLabel.setRequired(true);

const nameInput = new Input('text', 'Enter username');

const container = document.createElement('div');
container.appendChild(nameLabel.getDOMElement());
container.appendChild(nameInput.getDOMElement());
document.body.appendChild(container);
```

---

## Textarea

**Description:** Multi-line text input.

**Import:**
```javascript
import { Textarea } from '@evge/uikit';
```

**Constructor:**
```javascript
const textarea = new Textarea(placeholder);
```

**Properties:**
- `value` - Current value
- `rows` - Number of rows (default: 4)
- `cols` - Number of columns (default: auto)
- `maxLength` - Maximum characters
- `disabled` - boolean

**Methods:**

### setValue(value)
Set textarea value.
```javascript
textarea.setValue('Some long text...');
```

### getValue()
Get textarea value.
```javascript
const text = textarea.getValue();
```

### setRows(rows)
Set number of rows.
```javascript
textarea.setRows(6);
```

### setMaxLength(length)
Set maximum characters.
```javascript
textarea.setMaxLength(500);
```

### clear()
Clear textarea.
```javascript
textarea.clear();
```

**Events:**
- `change` - Fired on value change
- `input` - Fired on input (real-time)

**Example:**
```javascript
const comment = new Textarea('Enter comment...');
comment.setRows(4);
comment.setMaxLength(200);

comment.on('change', () => {
  const length = comment.getValue().length;
  console.log(`${length}/200 characters`);
});

document.body.appendChild(comment.getDOMElement());
```

---

## Checkbox

**Description:** Checkbox for boolean selection.

**Import:**
```javascript
import { Checkbox } from '@evge/uikit';
```

**Constructor:**
```javascript
const checkbox = new Checkbox(label);
```

**Methods:**

### setChecked(checked)
Set checkbox state.
```javascript
checkbox.setChecked(true);
```

### isChecked()
Get checkbox state.
```javascript
if (checkbox.isChecked()) {
  console.log('Checkbox is checked');
}
```

### setLabel(label)
Set label text.
```javascript
checkbox.setLabel('I agree to terms');
```

### setDisabled(disabled)
Disable/enable checkbox.
```javascript
checkbox.setDisabled(true);
```

**Events:**
- `change` - Fired when state changes

**Example:**
```javascript
const agree = new Checkbox('I agree to terms and conditions');

agree.on('change', () => {
  const btn = document.querySelector('button[type="submit"]');
  btn.disabled = !agree.isChecked();
});

document.body.appendChild(agree.getDOMElement());
```

---

## RadioButton

**Description:** Radio button group for exclusive selection.

**Import:**
```javascript
import { RadioButton } from '@evge/uikit';
```

**Constructor:**
```javascript
const radio = new RadioButton(name);
```

**Methods:**

### addOption(value, label)
Add radio option.
```javascript
radio.addOption('small', 'Small');
radio.addOption('medium', 'Medium');
radio.addOption('large', 'Large');
```

### setValue(value)
Set selected option.
```javascript
radio.setValue('medium');
```

### getValue()
Get selected value.
```javascript
const selected = radio.getValue(); // 'medium'
```

### setDisabled(disabled)
Disable/enable group.
```javascript
radio.setDisabled(true);
```

**Events:**
- `change` - Fired when selection changes

**Example:**
```javascript
const size = new RadioButton('size');
size.addOption('s', 'Small');
size.addOption('m', 'Medium');
size.addOption('l', 'Large');
size.setValue('m');

size.on('change', () => {
  console.log('Selected size:', size.getValue());
});

document.body.appendChild(size.getDOMElement());
```

---

## Dropdown

**Description:** Select dropdown for choosing single option.

**Import:**
```javascript
import { Dropdown } from '@evge/uikit';
```

**Constructor:**
```javascript
const dropdown = new Dropdown(placeholder);
```

**Methods:**

### addOption(value, label)
Add option to dropdown.
```javascript
dropdown.addOption('1', 'Apple');
dropdown.addOption('2', 'Banana');
dropdown.addOption('3', 'Orange');
```

### setValue(value)
Set selected option.
```javascript
dropdown.setValue('2');
```

### getValue()
Get selected value.
```javascript
const selected = dropdown.getValue();
```

### getLabel()
Get selected option label.
```javascript
const label = dropdown.getLabel();
```

### clear()
Clear selection.
```javascript
dropdown.clear();
```

**Events:**
- `change` - Fired when selection changes

**Example:**
```javascript
const category = new Dropdown('Select category');
category.addOption('tech', 'Technology');
category.addOption('health', 'Health');
category.addOption('finance', 'Finance');

category.on('change', (e) => {
  console.log('Category:', category.getValue());
});

document.body.appendChild(category.getDOMElement());
```

---

## Combo

**Description:** Searchable dropdown with optional async search.

**Import:**
```javascript
import { Combo } from '@evge/uikit';
```

**Constructor:**
```javascript
const combo = new Combo(placeholder);
```

**Methods:**

### addOption(value, label)
Add option.
```javascript
combo.addOption('john', 'John Smith');
combo.addOption('jane', 'Jane Doe');
```

### setValue(value)
Set selected option.
```javascript
combo.setValue('john');
```

### getValue()
Get selected value.
```javascript
const value = combo.getValue();
```

### setAsyncSearch(fn)
Set async search function.
```javascript
combo.setAsyncSearch(async (query) => {
  const response = await fetch(`/api/search?q=${query}`);
  return response.json();
});
```

### setDebounce(ms)
Set debounce delay for async search.
```javascript
combo.setDebounce(300); // Wait 300ms
```

### setMinChars(chars)
Set minimum characters to trigger search.
```javascript
combo.setMinChars(2); // Search after 2 chars
```

### getSelectedOption()
Get full selected option object.
```javascript
const option = combo.getSelectedOption();
console.log(option); // { value: 'john', label: 'John Smith' }
```

**Events:**
- `change` - Fired when selection changes

**Example:**
```javascript
const supplier = new Combo('Search supplier...');

// Add local options
supplier.addOption('1', 'Apple Inc.');
supplier.addOption('2', 'Amazon');

// Or use async search
supplier.setAsyncSearch(async (query) => {
  const res = await fetch(`/api/suppliers?search=${query}`);
  return res.json();
});

supplier.setDebounce(300);
supplier.setMinChars(2);

supplier.on('change', () => {
  console.log('Selected:', supplier.getSelectedOption());
});

document.body.appendChild(supplier.getDOMElement());
```

---

## DatePicker

**Description:** Date selection component.

**Import:**
```javascript
import { DatePicker } from '@evge/uikit';
```

**Constructor:**
```javascript
const datePicker = new DatePicker(placeholder);
```

**Methods:**

### setValue(date)
Set date (YYYY-MM-DD format).
```javascript
datePicker.setValue('2026-06-15');
```

### getValue()
Get selected date.
```javascript
const date = datePicker.getValue(); // '2026-06-15'
```

### setMinDate(date)
Set minimum allowed date.
```javascript
datePicker.setMinDate('2026-01-01');
```

### setMaxDate(date)
Set maximum allowed date.
```javascript
datePicker.setMaxDate('2026-12-31');
```

### setDisabled(disabled)
Disable/enable picker.
```javascript
datePicker.setDisabled(true);
```

**Events:**
- `change` - Fired when date changes

**Example:**
```javascript
const birthDate = new DatePicker('Select birth date');
birthDate.setMinDate('1950-01-01');
birthDate.setMaxDate('2010-12-31');

birthDate.on('change', () => {
  const age = calculateAge(birthDate.getValue());
  console.log('Age:', age);
});

document.body.appendChild(birthDate.getDOMElement());
```

---

## Grid

**Description:** Advanced table component with sorting, filtering, editing, and pagination.

**Import:**
```javascript
import { Grid } from '@evge/uikit';
```

**Constructor:**
```javascript
const grid = new Grid();
```

**Methods:**

### setHeaders(headers)
Set column headers.
```javascript
grid.setHeaders([
  { key: 'name', label: 'Name', sortable: true, width: '30%' },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'age', label: 'Age', sortable: true }
]);
```

### setRows(rows)
Set table data.
```javascript
grid.setRows([
  { name: 'John', email: 'john@example.com', age: 28 },
  { name: 'Jane', email: 'jane@example.com', age: 32 }
]);
```

### addRow(rowData)
Add single row.
```javascript
grid.addRow({ name: 'Bob', email: 'bob@example.com', age: 25 });
```

### setFormatter(columnKey, fn)
Set custom cell formatter.
```javascript
grid.setFormatter('age', (value, row) => {
  if (value < 18) return '<span style="color:red">Minor</span>';
  return value;
});
```

### setEditable(editable)
Enable/disable inline editing.
```javascript
grid.setEditable(true);
```

### setEditableColumn(columnKey, editable)
Mark specific column as editable.
```javascript
grid.setEditableColumn('email', true);
grid.setEditableColumn('name', false);
```

### setResizable(resizable)
Enable column resizing.
```javascript
grid.setResizable(true);
```

### setSortable(sortable)
Enable/disable sorting.
```javascript
grid.setSortable(true);
```

### setSortColumn(columnKey, order)
Set sort column and order.
```javascript
grid.setSortColumn('name', 'asc');
grid.setSortColumn('age', 'desc');
```

### getSortState()
Get current sort state.
```javascript
const state = grid.getSortState();
console.log(state); // { column: 'name', order: 'asc' }
```

### clearSort()
Clear sorting.
```javascript
grid.clearSort();
```

### setFilterable(filterable)
Enable/disable filtering.
```javascript
grid.setFilterable(true);
```

### addFilter(columnKey, operator, value, valueTo)
Add column filter.
```javascript
grid.addFilter('age', '>', 25);
grid.addFilter('name', 'contains', 'John');
grid.addFilter('salary', 'between', 50000, 100000);
```

### getFilters()
Get active filters.
```javascript
const filters = grid.getFilters();
```

### clearFilters()
Clear all filters.
```javascript
grid.clearFilters();
```

### removeFilter(columnKey)
Remove single filter.
```javascript
grid.removeFilter('age');
```

**Filter Operators:**
- `equals` - Exact match
- `contains` - Substring
- `startsWith` - Begins with
- `endsWith` - Ends with
- `>`, `<`, `>=`, `<=` - Numeric comparison
- `between` - Range

**Events:**
- `sortchange` - Fired when sort changes
- `filterchange` - Fired when filters change
- `rowselect` - Fired when row is selected
- `celledit` - Fired when cell is edited
- `columnresize` - Fired when column is resized

**Example:**
```javascript
const grid = new Grid();
grid.setHeaders([
  { key: 'name', label: 'Name', sortable: true },
  { key: 'department', label: 'Department' },
  { key: 'salary', label: 'Salary' }
]);

grid.setRows([
  { name: 'John Smith', department: 'Engineering', salary: 95000 },
  { name: 'Jane Doe', department: 'Marketing', salary: 85000 },
  { name: 'Bob Wilson', department: 'Engineering', salary: 105000 }
]);

// Enable features
grid.setEditable(true);
grid.setEditableColumn('salary', true);
grid.setResizable(true);
grid.setFilterable(true);

// Format salary column
grid.setFormatter('salary', (value) => {
  return '$' + value.toLocaleString();
});

// Listen to events
grid.on('sortchange', (e) => {
  console.log(`Sorted by ${e.column} ${e.order}`);
});

grid.on('filterchange', (e) => {
  console.log('Filters applied');
});

document.body.appendChild(grid.getDOMElement());
```

---

## Form

**Description:** Form component with built-in validation.

**Import:**
```javascript
import { Form } from '@evge/uikit';
```

**Constructor:**
```javascript
const form = new Form();
```

**Methods:**

### addField(name, config)
Add form field.
```javascript
form.addField('email', {
  label: 'Email Address',
  type: 'email',
  placeholder: 'user@example.com',
  required: true,
  validators: [
    { type: 'email', message: 'Invalid email' }
  ],
  validationTrigger: 'change'
});
```

### removeField(name)
Remove field from form.
```javascript
form.removeField('email');
```

### setFieldValue(name, value)
Set field value.
```javascript
form.setFieldValue('email', 'john@example.com');
```

### getFieldValue(name)
Get field value.
```javascript
const email = form.getFieldValue('email');
```

### getData()
Get all form data.
```javascript
const data = form.getData();
// { email: 'john@example.com', name: 'John', ... }
```

### setData(data)
Set all form data.
```javascript
form.setData({
  email: 'jane@example.com',
  name: 'Jane'
});
```

### validate()
Validate entire form.
```javascript
if (form.validate()) {
  console.log('Form is valid');
  submitForm(form.getData());
}
```

### validateField(name)
Validate single field.
```javascript
const error = form.validateField('email');
if (error) {
  console.log('Error:', error);
}
```

### getErrors()
Get all validation errors.
```javascript
const errors = form.getErrors();
// { email: 'Invalid email', name: 'Required' }
```

### clearErrors()
Clear all errors.
```javascript
form.clearErrors();
```

### reset()
Reset form to initial state.
```javascript
form.reset();
```

**Field Configuration:**
```javascript
{
  label: 'Field Label',           // Label text
  type: 'text',                   // Input type
  placeholder: 'Enter value',     // Placeholder
  required: false,                // Required field
  value: '',                      // Initial value
  validators: [],                 // Array of validators
  validationTrigger: 'submit'     // change | blur | submit
}
```

**Validators:**
- `required` - Non-empty value
- `email` - Valid email format
- `minLength` - Minimum characters
- `maxLength` - Maximum characters
- `min` - Minimum numeric value
- `max` - Maximum numeric value
- `pattern` - Regex pattern
- `url` - Valid URL
- `number` - Numeric value
- `integer` - Integer only
- `custom` - Custom function
- `matches` - Match another field

**Events:**
- `fieldvalidate` - Fired when field is validated
- `submit` - Fired on form submission

**Example:**
```javascript
const form = new Form();

form.addField('name', {
  label: 'Full Name',
  required: true,
  validators: [
    { type: 'minLength', min: 3, message: 'At least 3 characters' }
  ],
  validationTrigger: 'blur'
});

form.addField('email', {
  label: 'Email',
  type: 'email',
  validators: [
    { type: 'email', message: 'Invalid email' }
  ],
  validationTrigger: 'change'
});

form.addField('password', {
  label: 'Password',
  type: 'password',
  required: true,
  validators: [
    { type: 'minLength', min: 8, message: 'Min 8 chars' },
    { type: 'pattern', regex: /[A-Z]/, message: 'Need uppercase' },
    { type: 'pattern', regex: /[0-9]/, message: 'Need number' }
  ],
  validationTrigger: 'blur'
});

form.on('fieldvalidate', (e) => {
  if (e.error) {
    console.log(`Error in ${e.field}: ${e.error}`);
  }
});

form.on('submit', (e) => {
  if (e.valid) {
    console.log('Submitting:', e.data);
  }
});

document.body.appendChild(form.getDOMElement());
```

---

## Dialog

**Description:** Modal dialog for alerts, confirmations, and custom content.

**Import:**
```javascript
import { Dialog } from '@evge/uikit';
```

**Constructor:**
```javascript
const dialog = new Dialog(title, content);
```

**Methods:**

### setTitle(title)
Set dialog title.
```javascript
dialog.setTitle('Confirm Delete');
```

### setContent(content)
Set dialog content (string, HTML, or component).
```javascript
dialog.setContent('Are you sure?');
// or
dialog.setContent(htmlElement);
// or
dialog.setContent(uiComponent);
```

### setSize(size)
Set dialog size.
```javascript
dialog.setSize('small');  // Compact
dialog.setSize('medium'); // Default
dialog.setSize('large');  // Large
```

### getFooter()
Get footer element for buttons.
```javascript
const footer = dialog.getFooter();
const btn = new Button('OK', () => dialog.close());
footer.appendChild(btn.getDOMElement());
```

### show()
Show dialog (modal).
```javascript
dialog.show();
```

### close()
Close dialog.
```javascript
dialog.close();
```

**Static Methods:**

### Dialog.alert(title, message)
Show alert dialog.
```javascript
Dialog.alert('Success', 'Operation completed!');
```

### Dialog.confirm(title, onYes, onNo)
Show confirmation dialog.
```javascript
Dialog.confirm('Delete?',
  () => console.log('Deleted'),
  () => console.log('Cancelled')
);
```

**Example:**
```javascript
const dialog = new Dialog('Edit Profile');
dialog.setSize('medium');

const form = new Form();
form.addField('name', { label: 'Name', required: true });
form.addField('email', { label: 'Email', type: 'email' });

dialog.setContent(form.getDOMElement());

const saveBtn = new Button('Save', () => {
  if (form.validate()) {
    const data = form.getData();
    console.log('Saving:', data);
    dialog.close();
  }
});
saveBtn.setType('primary');

const cancelBtn = new Button('Cancel', () => dialog.close());

dialog.getFooter().appendChild(saveBtn.getDOMElement());
dialog.getFooter().appendChild(cancelBtn.getDOMElement());

document.body.appendChild(dialog.getDOMElement());
dialog.show();
```

---

## Panel

**Description:** Container component with header, body, and footer sections.

**Import:**
```javascript
import { Panel } from '@evge/uikit';
```

**Constructor:**
```javascript
const panel = new Panel(title);
```

**Methods:**

### setTitle(title)
Set panel title.
```javascript
panel.setTitle('Settings');
```

### setContent(content)
Set panel body content.
```javascript
panel.setContent(htmlElement);
// or
panel.setContent(uiComponent);
```

### getBody()
Get body element.
```javascript
const body = panel.getBody();
body.appendChild(element);
```

### getFooter()
Get footer element.
```javascript
const footer = panel.getFooter();
const btn = new Button('Save', () => {});
footer.appendChild(btn.getDOMElement());
```

**Example:**
```javascript
const panel = new Panel('User Information');

const form = new Form();
form.addField('name', { label: 'Name', required: true });
form.addField('email', { label: 'Email', type: 'email' });

panel.setContent(form.getDOMElement());

const saveBtn = new Button('Save', () => {
  const data = form.getData();
  console.log('Saving:', data);
});
saveBtn.setType('primary');

panel.getFooter().appendChild(saveBtn.getDOMElement());
document.body.appendChild(panel.getDOMElement());
```

---

## Tabs

**Description:** Tabbed interface for organizing content.

**Import:**
```javascript
import { Tabs } from '@evge/uikit';
```

**Constructor:**
```javascript
const tabs = new Tabs();
```

**Methods:**

### addTab(id, label, content, active)
Add tab.
```javascript
tabs.addTab('tab1', 'Documents', '<p>Documents content</p>', true);
tabs.addTab('tab2', 'Settings', settingsComponent.getDOMElement(), false);
```

### selectTab(id)
Switch to tab.
```javascript
tabs.selectTab('tab2');
```

### getActiveTab()
Get current active tab.
```javascript
const activeId = tabs.getActiveTab();
```

**Events:**
- `change` - Fired when tab changes

**Example:**
```javascript
const tabs = new Tabs();

tabs.addTab('documents', 'Documents', 
  '<p>List of documents</p>', true);

tabs.addTab('references', 'References',
  '<p>Reference data</p>', false);

tabs.addTab('settings', 'Settings',
  '<p>Application settings</p>', false);

tabs.on('change', (e) => {
  console.log('Active tab:', tabs.getActiveTab());
});

document.body.appendChild(tabs.getDOMElement());
```

---

## List

**Description:** Scrollable list component with selection.

**Import:**
```javascript
import { List } from '@evge/uikit';
```

**Constructor:**
```javascript
const list = new List();
```

**Methods:**

### addItem(id, label)
Add list item.
```javascript
list.addItem('item1', 'First Item');
list.addItem('item2', 'Second Item');
list.addItem('item3', 'Third Item');
```

### removeItem(id)
Remove item by ID.
```javascript
list.removeItem('item1');
```

### selectItem(id)
Select item.
```javascript
list.selectItem('item2');
```

### getSelectedItem()
Get selected item ID.
```javascript
const selected = list.getSelectedItem();
```

### setMultiSelect(enabled)
Enable/disable multi-select.
```javascript
list.setMultiSelect(true);
```

**Events:**
- `select` - Fired when item is selected

**Example:**
```javascript
const list = new List();
list.addItem('john', 'John Smith');
list.addItem('jane', 'Jane Doe');
list.addItem('bob', 'Bob Wilson');

list.on('select', (e) => {
  console.log('Selected:', list.getSelectedItem());
});

document.body.appendChild(list.getDOMElement());
```

---

## Link

**Description:** Hyperlink component.

**Import:**
```javascript
import { Link } from '@evge/uikit';
```

**Constructor:**
```javascript
const link = new Link(text, href);
```

**Methods:**

### setText(text)
Set link text.
```javascript
link.setText('Click here');
```

### setHref(href)
Set link URL.
```javascript
link.setHref('/about');
```

### setTarget(target)
Set link target.
```javascript
link.setTarget('_blank');
```

**Example:**
```javascript
const link = new Link('Visit GitHub', 'https://github.com');
link.setTarget('_blank');
document.body.appendChild(link.getDOMElement());
```

---

## Table

**Description:** Simple table component (read-only).

**Import:**
```javascript
import { Table } from '@evge/uikit';
```

**Constructor:**
```javascript
const table = new Table();
```

**Methods:**

### setHeaders(headers)
Set table headers.
```javascript
table.setHeaders(['Name', 'Email', 'Role']);
```

### addRow(cells)
Add table row.
```javascript
table.addRow(['John Smith', 'john@example.com', 'Admin']);
table.addRow(['Jane Doe', 'jane@example.com', 'User']);
```

### clear()
Clear all rows.
```javascript
table.clear();
```

**Example:**
```javascript
const table = new Table();
table.setHeaders(['Name', 'Email', 'Status']);

table.addRow(['John', 'john@example.com', 'Active']);
table.addRow(['Jane', 'jane@example.com', 'Inactive']);
table.addRow(['Bob', 'bob@example.com', 'Active']);

document.body.appendChild(table.getDOMElement());
```

---

## Validators

**Description:** Built-in validation functions for form fields.

**Import:**
```javascript
import { Validators } from '@evge/uikit';
```

**Available Validators:**

### Validators.required(value, message)
Check non-empty value.
```javascript
{ type: 'required', message: 'This field is required' }
```

### Validators.email(value, message)
Check valid email format.
```javascript
{ type: 'email', message: 'Invalid email address' }
```

### Validators.minLength(min, message)
Check minimum string length.
```javascript
{ type: 'minLength', min: 5, message: 'At least 5 characters' }
```

### Validators.maxLength(max, message)
Check maximum string length.
```javascript
{ type: 'maxLength', max: 20, message: 'Max 20 characters' }
```

### Validators.min(min, message)
Check minimum numeric value.
```javascript
{ type: 'min', min: 18, message: 'Must be 18 or older' }
```

### Validators.max(max, message)
Check maximum numeric value.
```javascript
{ type: 'max', max: 100, message: 'Max value 100' }
```

### Validators.pattern(regex, message)
Check regex pattern.
```javascript
{ type: 'pattern', regex: /^[A-Z]+$/, message: 'Uppercase only' }
```

### Validators.url(value, message)
Check valid URL.
```javascript
{ type: 'url', message: 'Invalid URL' }
```

### Validators.number(value, message)
Check numeric value.
```javascript
{ type: 'number', message: 'Must be a number' }
```

### Validators.integer(value, message)
Check integer value.
```javascript
{ type: 'integer', message: 'Must be an integer' }
```

### Validators.custom(fn, message)
Custom validation function.
```javascript
{
  type: 'custom',
  fn: (value) => value !== 'admin',
  message: 'Username not available'
}
```

### Validators.matches(fieldName, message)
Check field matches another field.
```javascript
{ type: 'matches', field: 'password', message: 'Passwords do not match' }
```

**Example:**
```javascript
const form = new Form();

form.addField('password', {
  label: 'Password',
  type: 'password',
  validators: [
    { type: 'required', message: 'Password required' },
    { type: 'minLength', min: 8, message: 'Min 8 characters' },
    { type: 'pattern', regex: /[A-Z]/, message: 'Need uppercase' },
    { type: 'pattern', regex: /[0-9]/, message: 'Need number' }
  ],
  validationTrigger: 'blur'
});

form.addField('confirmPassword', {
  label: 'Confirm Password',
  type: 'password',
  validators: [
    { type: 'matches', field: 'password', message: 'Passwords must match' }
  ],
  validationTrigger: 'blur'
});

document.body.appendChild(form.getDOMElement());
```

---

## Complete Example: User Registration Form

```javascript
import { Form, Button, Dialog } from '@evge/uikit';

// Create form
const form = new Form();

// Add fields
form.addField('username', {
  label: 'Username',
  placeholder: 'Choose username',
  required: true,
  validators: [
    { type: 'minLength', min: 4, message: 'Min 4 characters' },
    { type: 'pattern', regex: /^[a-zA-Z0-9_]+$/, message: 'Alphanumeric only' }
  ],
  validationTrigger: 'blur'
});

form.addField('email', {
  label: 'Email',
  type: 'email',
  placeholder: 'your@email.com',
  required: true,
  validators: [
    { type: 'email', message: 'Invalid email' }
  ],
  validationTrigger: 'change'
});

form.addField('password', {
  label: 'Password',
  type: 'password',
  required: true,
  validators: [
    { type: 'minLength', min: 8, message: 'Min 8 characters' },
    { type: 'pattern', regex: /[A-Z]/, message: 'Need uppercase' },
    { type: 'pattern', regex: /[0-9]/, message: 'Need number' }
  ],
  validationTrigger: 'blur'
});

form.addField('confirmPassword', {
  label: 'Confirm Password',
  type: 'password',
  required: true,
  validators: [
    { type: 'matches', field: 'password', message: 'Passwords must match' }
  ],
  validationTrigger: 'blur'
});

// Create button
const submitBtn = new Button('Register', () => {
  if (form.validate()) {
    const data = form.getData();
    console.log('Registering user:', data);
    
    // Send to server
    fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(result => {
      Dialog.alert('Success', 'Registration complete!');
      form.reset();
    })
    .catch(err => {
      Dialog.alert('Error', 'Registration failed');
    });
  }
});
submitBtn.setType('primary');

// Add button to form
form.getDOMElement().appendChild(submitBtn.getDOMElement());

// Mount to page
document.body.appendChild(form.getDOMElement());
```

---

## Styling & Customization

### CSS Themes

UIKit includes 3 complete CSS themes:

**1. Modern Design** (Ant Design 5.x style)
```html
<link rel="stylesheet" href="UIKit/styles/modern.css">
```

**2. Tabulator** (Terminal/hacker style)
```html
<link rel="stylesheet" href="UIKit/styles/tabulator.css">
```

### CSS Variables

Customize colors and sizes:

```css
:root {
  /* Colors */
  --primary-color: #1677ff;
  --primary-hover: #4096ff;
  --primary-active: #0958d9;
  --error-color: #ff4d4f;
  --success-color: #52c41a;
  
  /* Sizes */
  --font-size-base: 14px;
  --padding-lg: 16px;
  --radius-md: 6px;
}
```

---

## License

MIT - See LICENSE file

## Support

- GitHub Issues: https://github.com/yourusername/uikit/issues
- Documentation: Check examples.html for live demos
- API Docs: This file (UIKIT_API.md)
