/**
 * UIKit - RadioButton Component
 * Radio button group for single selection
 */

import { Base } from '../core/Base.js';

export class RadioButton extends Base {
  constructor(name = '', options = []) {
    super();
    this.createElement('div', 'ui-radio-group');

    this.setProperty('name', name);
    this.setProperty('options', []);
    this.setProperty('value', null);
    this.setProperty('disabled', false);

    this.inputMap = {}; // Map value -> input element

    if (options.length > 0) {
      this.setOptions(options);
    }
  }

  /**
   * Set radio options
   * @param {Array} options - [{ value: 'id', label: 'Label' }, ...]
   */
  setOptions(options) {
    this.setProperty('options', options);
    this.element.innerHTML = '';
    this.inputMap = {};

    const name = this.getProperty('name') || 'radio-' + Math.random().toString(36).substr(2, 9);

    options.forEach((option) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'ui-radio-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;
      input.value = option.value || '';
      input.className = 'ui-radio-input';

      const label = document.createElement('label');
      label.className = 'ui-radio-label';
      label.appendChild(input);

      const text = document.createElement('span');
      text.textContent = option.label || option.value;
      label.appendChild(text);

      wrapper.appendChild(label);
      this.element.appendChild(wrapper);

      this.inputMap[option.value] = input;

      input.addEventListener('change', (e) => {
        if (e.target.checked) {
          this.setProperty('value', option.value);
          this.emit('change', { value: option.value, label: option.label });
        }
      });
    });

    return this;
  }

  /**
   * Add option
   */
  addOption(value, label) {
    const options = this.getProperty('options', []);
    options.push({ value, label });
    this.setOptions(options);
    return this;
  }

  /**
   * Remove option
   */
  removeOption(value) {
    let options = this.getProperty('options', []);
    options = options.filter(opt => opt.value !== value);
    this.setOptions(options);
    return this;
  }

  /**
   * Set selected value
   */
  setValue(value) {
    this.setProperty('value', value);
    if (this.inputMap[value]) {
      this.inputMap[value].checked = true;
    }
    return this;
  }

  /**
   * Get selected value
   */
  getValue() {
    return this.getProperty('value');
  }

  /**
   * Set disabled state
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    Object.values(this.inputMap).forEach(input => {
      input.disabled = disabled;
    });
    return this;
  }

  /**
   * Get all values
   */
  getValues() {
    return this.getProperty('options', []).map(opt => opt.value);
  }
}

export default RadioButton;
