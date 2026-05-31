/**
 * UIKit - Combo Component
 * Input field with autocomplete dropdown
 */

import { Base } from '../core/Base.js';

export class Combo extends Base {
  constructor(placeholder = '') {
    super();
    this.createElement('div', 'ui-combo-wrapper');
    this.enableMouseEvents(); // Enable all mouse events

    // Input field
    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'ui-combo-input';
    this.input.placeholder = placeholder;

    // Dropdown menu
    this.menu = document.createElement('div');
    this.menu.className = 'ui-combo-menu';
    this.menu.style.display = 'none';

    this.element.appendChild(this.input);
    this.element.appendChild(this.menu);

    this.setProperty('placeholder', placeholder);
    this.setProperty('options', []);
    this.setProperty('value', '');
    this.setProperty('disabled', false);
    this.setProperty('filterMinChars', 1);
    this.setProperty('maxResults', 50);

    this.allOptions = [];
    this.filteredOptions = [];
    this.selectedOption = null;

    // Event handlers
    this.input.addEventListener('input', (e) => this.handleInput(e));
    this.input.addEventListener('focus', () => this.showMenu());
    this.input.addEventListener('blur', (e) => setTimeout(() => this.hideMenu(), 200));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    document.addEventListener('click', (e) => {
      if (!this.element.contains(e.target)) {
        this.hideMenu();
      }
    });
  }

  /**
   * Set combo options
   * @param {Array} options - [{ value: 'id', label: 'Label' }, ...]
   */
  setOptions(options) {
    this.allOptions = options || [];
    this.setProperty('options', options);
    return this;
  }

  /**
   * Add option
   */
  addOption(value, label) {
    this.allOptions.push({ value, label });
    return this;
  }

  /**
   * Remove option
   */
  removeOption(value) {
    this.allOptions = this.allOptions.filter(opt => opt.value !== value);
    return this;
  }

  /**
   * Handle input change
   */
  handleInput(e) {
    const text = e.target.value;
    this.setProperty('value', text);

    // Filter options
    const minChars = this.getProperty('filterMinChars', 1);
    if (text.length < minChars) {
      this.menu.innerHTML = '';
      this.showMenu();
      return;
    }

    const searchText = text.toLowerCase();
    this.filteredOptions = this.allOptions.filter(opt => {
      const label = (opt.label || opt.value).toLowerCase();
      return label.includes(searchText);
    });

    const maxResults = this.getProperty('maxResults', 50);
    this.filteredOptions = this.filteredOptions.slice(0, maxResults);

    this.renderMenu();
    this.showMenu();
  }

  /**
   * Render dropdown menu
   */
  renderMenu() {
    this.menu.innerHTML = '';

    if (this.filteredOptions.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'ui-combo-no-results';
      noResults.textContent = 'No results';
      this.menu.appendChild(noResults);
      return;
    }

    this.filteredOptions.forEach((option, idx) => {
      const item = document.createElement('div');
      item.className = 'ui-combo-item';
      item.innerHTML = this.highlightMatch(option.label || option.value, this.input.value);

      item.addEventListener('click', () => {
        this.selectOption(option);
      });

      item.addEventListener('mouseenter', () => {
        this.menu.querySelectorAll('.ui-combo-item').forEach(el => el.classList.remove('hover'));
        item.classList.add('hover');
      });

      this.menu.appendChild(item);
    });
  }

  /**
   * Highlight matching text in option
   */
  highlightMatch(text, search) {
    if (!search) return text;
    const regex = new RegExp(`(${search})`, 'gi');
    return text.replace(regex, '<strong>$1</strong>');
  }

  /**
   * Select option
   */
  selectOption(option) {
    this.selectedOption = option;
    this.input.value = option.label || option.value;
    this.setProperty('value', option.value);
    this.hideMenu();
    this.emit('change', { value: option.value, label: option.label, option });
  }

  /**
   * Handle keyboard navigation
   */
  handleKeydown(e) {
    const items = this.menu.querySelectorAll('.ui-combo-item');
    const hovered = this.menu.querySelector('.ui-combo-item.hover');
    const hoveredIndex = hovered ? Array.from(items).indexOf(hovered) : -1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (items.length === 0) return;
        const nextIdx = (hoveredIndex + 1) % items.length;
        items.forEach(el => el.classList.remove('hover'));
        items[nextIdx].classList.add('hover');
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (items.length === 0) return;
        const prevIdx = hoveredIndex <= 0 ? items.length - 1 : hoveredIndex - 1;
        items.forEach(el => el.classList.remove('hover'));
        items[prevIdx].classList.add('hover');
        break;

      case 'Enter':
        e.preventDefault();
        if (hovered) {
          const idx = Array.from(items).indexOf(hovered);
          this.selectOption(this.filteredOptions[idx]);
        } else if (this.filteredOptions.length > 0) {
          this.selectOption(this.filteredOptions[0]);
        } else {
          // Allow freeform text
          this.setProperty('value', this.input.value);
          this.emit('change', { value: this.input.value, label: this.input.value });
          this.hideMenu();
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.hideMenu();
        break;
    }
  }

  /**
   * Show menu
   */
  showMenu() {
    if (this.menu.innerHTML) {
      this.menu.style.display = 'block';
    }
  }

  /**
   * Hide menu
   */
  hideMenu() {
    this.menu.style.display = 'none';
  }

  /**
   * Set value
   */
  setValue(value) {
    this.setProperty('value', value);
    // Find matching option
    const option = this.allOptions.find(opt => opt.value === value);
    if (option) {
      this.input.value = option.label || option.value;
      this.selectedOption = option;
    } else {
      this.input.value = value;
    }
    return this;
  }

  /**
   * Get value
   */
  getValue() {
    return this.getProperty('value');
  }

  /**
   * Get selected option
   */
  getSelectedOption() {
    return this.selectedOption;
  }

  /**
   * Set disabled
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    this.input.disabled = disabled;
    return this;
  }

  /**
   * Set placeholder
   */
  setPlaceholder(text) {
    this.setProperty('placeholder', text);
    this.input.placeholder = text;
    return this;
  }

  /**
   * Clear input
   */
  clear() {
    this.input.value = '';
    this.setProperty('value', '');
    this.selectedOption = null;
    return this;
  }

  /**
   * Focus input
   */
  focus() {
    this.input.focus();
    return this;
  }
}

export default Combo;
