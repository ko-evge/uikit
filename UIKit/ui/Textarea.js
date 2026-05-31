/**
 * UIKit - Textarea Component
 * Multi-line text input
 */

import { Base } from '../core/Base.js';

export class Textarea extends Base {
  constructor(placeholder = '') {
    super();
    this.createElement('textarea', 'ui-textarea');

    if (placeholder) {
      this.element.placeholder = placeholder;
      this.setProperty('placeholder', placeholder);
    }

    this.setProperty('value', '');
    this.setProperty('rows', 4);
    this.setProperty('maxLength', null);

    // Bind input events
    this.on('input', (e) => {
      this.setProperty('value', e.target.value);
      this.emit('change', { value: e.target.value });
    });

    this.on('blur', () => {
      this.emit('blur', { value: this.getValue() });
    });

    this.on('focus', () => {
      this.emit('focus');
    });
  }

  /**
   * Set textarea value
   */
  setValue(value) {
    this.setProperty('value', value);
    if (this.element) {
      this.element.value = value || '';
    }
    return this;
  }

  /**
   * Get textarea value
   */
  getValue() {
    return this.element ? this.element.value : '';
  }

  /**
   * Set placeholder
   */
  setPlaceholder(text) {
    this.setProperty('placeholder', text);
    if (this.element) {
      this.element.placeholder = text;
    }
    return this;
  }

  /**
   * Set number of rows
   */
  setRows(rows) {
    this.setProperty('rows', rows);
    if (this.element) {
      this.element.rows = rows;
    }
    return this;
  }

  /**
   * Set max length
   */
  setMaxLength(length) {
    this.setProperty('maxLength', length);
    if (this.element) {
      if (length) {
        this.element.maxLength = length;
      } else {
        this.element.removeAttribute('maxLength');
      }
    }
    return this;
  }

  /**
   * Set readonly
   */
  setReadonly(readonly) {
    this.setProperty('readonly', readonly);
    if (this.element) {
      this.element.readOnly = readonly;
    }
    return this;
  }

  /**
   * Set disabled
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.element) {
      this.element.disabled = disabled;
    }
    return this;
  }

  /**
   * Focus textarea
   */
  focus() {
    if (this.element) {
      this.element.focus();
    }
    return this;
  }

  /**
   * Clear textarea
   */
  clear() {
    this.setValue('');
    return this;
  }

  /**
   * Select all text
   */
  selectAll() {
    if (this.element) {
      this.element.select();
    }
    return this;
  }

  /**
   * Get character count
   */
  getCharCount() {
    return this.getValue().length;
  }
}

export default Textarea;
