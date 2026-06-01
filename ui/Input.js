/**
 * UIKit - Input Component
 */

import { Base } from '../core/Base.js';

export class Input extends Base {
  constructor(type = 'text', placeholder = '') {
    super();
    this.createElement('input', 'ui-input');
    this.element.type = type;
    this.setProperty('type', type);

    if (placeholder) {
      this.setPlaceholder(placeholder);
    }

    // Translate native 'input' into a semantic 'change' event.
    // Native 'blur'/'focus' are delivered directly via on(), no re-emit needed.
    this.on('input', (e) => {
      this.setProperty('value', e.target.value);
      this.emit('change', { value: e.target.value });
    });
  }

  /**
   * Set input value
   */
  setValue(value) {
    this.setProperty('value', value);
    if (this.element) {
      this.element.value = value || '';
    }
    return this;
  }

  /**
   * Get input value
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
   * Set input type
   */
  setType(type) {
    this.setProperty('type', type);
    if (this.element) {
      this.element.type = type;
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
   * Focus input
   */
  focus() {
    if (this.element) {
      this.element.focus();
    }
    return this;
  }

  /**
   * Clear input
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
}

export default Input;
