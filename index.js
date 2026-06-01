/**
 * UIKit - Main Entry Point
 * Modern JavaScript UI Library (ES6+)
 * No dependencies, full control
 */

// Local imports — needed so the UIKit factory/namespace below can reference
// these classes. (A bare `export { X } from '...'` re-export does NOT create a
// local binding, so `new X()` in this module would throw "X is not defined".)
import { Base } from './core/Base.js';
import { Validators } from './core/Validators.js';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Label } from './ui/Label.js';
import { Table } from './ui/Table.js';
import { Grid } from './ui/Grid.js';
import { Panel } from './ui/Panel.js';
import { Dialog } from './ui/Dialog.js';
import { Form } from './ui/Form.js';
import { DatePicker } from './ui/DatePicker.js';
import { Dropdown } from './ui/Dropdown.js';
import { Textarea } from './ui/Textarea.js';
import { Checkbox } from './ui/Checkbox.js';
import { RadioButton } from './ui/RadioButton.js';
import { Tabs } from './ui/Tabs.js';
import { Link } from './ui/Link.js';
import { Combo } from './ui/Combo.js';
import { List } from './ui/List.js';
import {
  NumberFormatter, DateFormatter, HTMLFormatter, StringFormatter
} from './formatters/Formatters.js';

// Core
export { Base } from './core/Base.js';
export { Validators } from './core/Validators.js';

// UI Components
export { Button } from './ui/Button.js';
export { Input } from './ui/Input.js';
export { Label } from './ui/Label.js';
export { Table } from './ui/Table.js';
export { Grid } from './ui/Grid.js';
export { Panel } from './ui/Panel.js';
export { Dialog } from './ui/Dialog.js';
export { Form } from './ui/Form.js';
export { DatePicker } from './ui/DatePicker.js';
export { Dropdown } from './ui/Dropdown.js';
export { Textarea } from './ui/Textarea.js';
export { Checkbox } from './ui/Checkbox.js';
export { RadioButton } from './ui/RadioButton.js';
export { Tabs } from './ui/Tabs.js';
export { Link } from './ui/Link.js';
export { Combo } from './ui/Combo.js';
export { List } from './ui/List.js';

// Formatters
export { NumberFormatter, DateFormatter, HTMLFormatter, StringFormatter } from './formatters/Formatters.js';

// Convenience namespace.
//
// `import ui from '@evge/uikit'` gives you BOTH styles from one object:
//   ui.grid()            // factory — no `new`
//   new ui.Grid()        // class reference
//
// Factory methods (lowercase) cover every component; class references
// (PascalCase) are attached too for the `new ui.X()` style.
export const UIKit = {
  // ---- class references (use with `new ui.X()`) ----
  Base, Validators,
  Button, Input, Label, Textarea, Checkbox, RadioButton,
  Dropdown, Combo, DatePicker, Grid, Form, Dialog, Panel,
  Tabs, List, Link, Table,
  NumberFormatter, DateFormatter, HTMLFormatter, StringFormatter,

  // ---- factory helpers (no `new`) ----

  /**
   * Create button
   * @example UIKit.button('Click me', () => { console.log('clicked'); })
   */
  button: (text, onClick) => new Button(text, onClick),

  /**
   * Create input
   * @example UIKit.input('text', 'Enter name')
   */
  input: (type = 'text', placeholder = '') => new Input(type, placeholder),

  /**
   * Create label
   * @example UIKit.label('Name:')
   */
  label: (text) => new Label(text),

  /** Create multi-line text input @example UIKit.textarea('Notes') */
  textarea: (placeholder = '') => new Textarea(placeholder),

  /** Create checkbox @example UIKit.checkbox('Agree') */
  checkbox: (label = '') => new Checkbox(label),

  /** Create radio group @example UIKit.radio('size', [{value,label}]) */
  radio: (name = '', options = []) => new RadioButton(name, options),

  /** Create dropdown @example UIKit.dropdown('Select') */
  dropdown: (placeholder = 'Select option') => new Dropdown(placeholder),

  /** Create autocomplete combo @example UIKit.combo('Search') */
  combo: (placeholder = '') => new Combo(placeholder),

  /** Create date picker @example UIKit.datePicker() */
  datePicker: (placeholder = 'Select date') => new DatePicker(placeholder),

  /** Create data grid @example UIKit.grid() */
  grid: () => new Grid(),

  /** Create form @example UIKit.form() */
  form: () => new Form(),

  /** Create modal dialog @example UIKit.dialog('Title', 'Body') */
  dialog: (title = '', content = '') => new Dialog(title, content),

  /** Create panel @example UIKit.panel('Title') */
  panel: (title = '') => new Panel(title),

  /** Create tabs @example UIKit.tabs() */
  tabs: () => new Tabs(),

  /** Create list @example UIKit.list() */
  list: () => new List(),

  /** Create link @example UIKit.link('Home', '/') */
  link: (text = '', href = '#') => new Link(text, href),

  /**
   * Create table
   * @example UIKit.table()
   */
  table: () => new Table(),

  /**
   * Create container (div)
   * @example UIKit.div('my-class')
   */
  div: (className = '') => {
    const div = new Base();
    div.createElement('div', className);
    return div;
  },

  /**
   * Create heading (h1, h2, h3, ...)
   * @example UIKit.h1('Title')
   */
  h1: (text) => {
    const h = new Base();
    h.createElement('h1');
    h.element.textContent = text;
    return h;
  },

  h2: (text) => {
    const h = new Base();
    h.createElement('h2');
    h.element.textContent = text;
    return h;
  },

  h3: (text) => {
    const h = new Base();
    h.createElement('h3');
    h.element.textContent = text;
    return h;
  },

  /**
   * Create paragraph
   * @example UIKit.p('Some text')
   */
  p: (text) => {
    const p = new Base();
    p.createElement('p');
    p.element.textContent = text;
    return p;
  },

  /**
   * Show alert message
   * @example UIKit.alert('Success!', 'success')
   */
  alert: (message, type = 'info') => {
    const alert = document.createElement('div');
    alert.className = `ui-alert ui-alert-${type}`;
    alert.textContent = message;
    document.body.insertBefore(alert, document.body.firstChild);
    setTimeout(() => alert.remove(), 3000);
  }
};

export default UIKit;
