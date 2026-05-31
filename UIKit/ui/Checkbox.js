/**
 * UIKit - Checkbox Component
 * Boolean toggle input
 */

import { Base } from '../core/Base.js';

export class Checkbox extends Base {
  constructor(label = '') {
    super();
    this.createElement('div', 'ui-checkbox-wrapper');
    this.enableMouseEvents(); // Enable all mouse events

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'ui-checkbox-input';

    const labelEl = document.createElement('label');
    labelEl.className = 'ui-checkbox-label';
    labelEl.appendChild(input);

    if (label) {
      const text = document.createElement('span');
      text.textContent = label;
      labelEl.appendChild(text);
    }

    this.element.appendChild(labelEl);
    this.input = input;

    this.setProperty('checked', false);
    this.setProperty('disabled', false);
    this.setProperty('label', label);

    // Bind events
    this.input.addEventListener('change', (e) => {
      this.setProperty('checked', e.target.checked);
      this.emit('change', { checked: e.target.checked });
    });
  }

  /**
   * Set checked state
   */
  setChecked(checked) {
    this.setProperty('checked', checked);
    this.input.checked = checked;
    return this;
  }

  /**
   * Get checked state
   */
  isChecked() {
    return this.input.checked;
  }

  /**
   * Set label text
   */
  setLabel(text) {
    this.setProperty('label', text);
    const span = this.element.querySelector('.ui-checkbox-label span');
    if (span) {
      span.textContent = text;
    }
    return this;
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    this.input.disabled = disabled;
    return this;
  }

  /**
   * Toggle checked state
   */
  toggle() {
    this.setChecked(!this.isChecked());
    return this;
  }

  /**
   * Get value (same as isChecked)
   */
  getValue() {
    return this.isChecked();
  }

  /**
   * Set value (same as setChecked)
   */
  setValue(value) {
    return this.setChecked(value);
  }
}

export default Checkbox;
