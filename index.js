/**
 * UIKit - Main Entry Point
 * Modern JavaScript UI Library (ES6+)
 * No dependencies, full control
 */

// Local imports — needed so the UIKit factory helpers below can instantiate
// these classes. (A bare `export { X } from '...'` re-export does NOT create a
// local binding, so `new X()` in this module would throw "X is not defined".)
import { Base } from './core/Base.js';
import { Button } from './ui/Button.js';
import { Input } from './ui/Input.js';
import { Label } from './ui/Label.js';
import { Table } from './ui/Table.js';

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

// Convenience factory functions
export const UIKit = {
  /**
   * Create button
   * @example UIKit.button('Click me', () => { console.log('clicked'); })
   */
  button: (text, onClick) => {
    return new Button(text, onClick);
  },

  /**
   * Create input
   * @example UIKit.input('text', 'Enter name')
   */
  input: (type = 'text', placeholder = '') => {
    return new Input(type, placeholder);
  },

  /**
   * Create label
   * @example UIKit.label('Name:')
   */
  label: (text) => {
    return new Label(text);
  },

  /**
   * Create table
   * @example UIKit.table()
   */
  table: () => {
    return new Table();
  },

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
