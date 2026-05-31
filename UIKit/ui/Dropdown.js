/**
 * UIKit - Dropdown Component
 * Select from list of options
 */

import { Base } from '../core/Base.js';

export class Dropdown extends Base {
  constructor(placeholder = 'Select option') {
    super();
    this.createElement('div', 'ui-dropdown-wrapper');

    this.setProperty('value', '');
    this.setProperty('options', []);
    this.setProperty('placeholder', placeholder);
    this.setProperty('disabled', false);

    this.button = null;
    this.menu = null;
    this.isOpen = false;
  }

  /**
   * Set options
   * @param {Array} options - [{value: 'id', label: 'Name'}, ...]
   */
  setOptions(options) {
    this.setProperty('options', options);
    this.render();
    return this;
  }

  /**
   * Get options
   */
  getOptions() {
    return this.getProperty('options', []);
  }

  /**
   * Add option
   */
  addOption(value, label) {
    const options = this.getOptions();
    options.push({ value, label });
    this.setOptions(options);
    return this;
  }

  /**
   * Remove option
   */
  removeOption(value) {
    const options = this.getOptions().filter(opt => opt.value !== value);
    this.setOptions(options);
    return this;
  }

  /**
   * Set selected value
   */
  setValue(value) {
    this.setProperty('value', value);
    if (this.button) {
      const option = this.getOptions().find(opt => opt.value === value);
      this.button.textContent = option ? option.label : this.getProperty('placeholder', '');
    }
    return this;
  }

  /**
   * Get selected value
   */
  getValue() {
    return this.getProperty('value', '');
  }

  /**
   * Set disabled
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.button) {
      this.button.disabled = disabled;
    }
    return this;
  }

  /**
   * Toggle menu
   */
  toggleMenu() {
    if (this.isOpen) {
      this.closeMenu();
    } else {
      this.openMenu();
    }
  }

  /**
   * Open menu
   */
  openMenu() {
    if (this.menu) {
      this.menu.style.display = 'block';
      this.isOpen = true;
    }
  }

  /**
   * Close menu
   */
  closeMenu() {
    if (this.menu) {
      this.menu.style.display = 'none';
      this.isOpen = false;
    }
  }

  /**
   * Render component
   */
  render() {
    if (!this.element) return;

    this.element.innerHTML = '';

    // Button
    this.button = document.createElement('button');
    this.button.className = 'ui-dropdown-button';
    this.button.type = 'button';

    const currentValue = this.getValue();
    const option = this.getOptions().find(opt => opt.value === currentValue);
    this.button.textContent = option ? option.label : this.getProperty('placeholder', '');

    if (this.getProperty('disabled')) {
      this.button.disabled = true;
    }

    this.button.addEventListener('click', () => this.toggleMenu());

    this.element.appendChild(this.button);

    // Menu
    this.menu = document.createElement('div');
    this.menu.className = 'ui-dropdown-menu';
    this.menu.style.display = 'none';

    const options = this.getOptions();
    options.forEach(option => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'ui-dropdown-item';
      item.textContent = option.label;

      if (option.value === currentValue) {
        item.classList.add('ui-dropdown-item-selected');
      }

      item.addEventListener('click', () => {
        this.setValue(option.value);
        this.closeMenu();
        this.emit('change', { value: option.value, label: option.label });
      });

      this.menu.appendChild(item);
    });

    this.element.appendChild(this.menu);

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (e.target !== this.button && !this.menu.contains(e.target)) {
        this.closeMenu();
      }
    });

    return this;
  }
}

export default Dropdown;
