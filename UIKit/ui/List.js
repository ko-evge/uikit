/**
 * UIKit - List Component
 * Scrollable list of items with selection
 */

import { Base } from '../core/Base.js';

export class List extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-list');
    this.enableMouseEvents(); // Enable all mouse events

    this.setProperty('items', []);
    this.setProperty('selectedIndex', -1);
    this.setProperty('selectedItem', null);
    this.setProperty('multiSelect', false);

    this.itemsContainer = document.createElement('div');
    this.itemsContainer.className = 'ui-list-items';
    this.element.appendChild(this.itemsContainer);

    this.selectedItems = [];
    this.itemElements = [];
  }

  /**
   * Set list items
   * @param {Array} items - [{ value: 'id', label: 'Label', disabled: false }, ...]
   */
  setItems(items) {
    this.setProperty('items', items || []);
    this.selectedItems = [];
    this.itemElements = [];
    this.render();
    return this;
  }

  /**
   * Add item
   */
  addItem(value, label) {
    const items = this.getProperty('items', []);
    items.push({ value, label });
    this.setItems(items);
    return this;
  }

  /**
   * Remove item
   */
  removeItem(value) {
    let items = this.getProperty('items', []);
    items = items.filter(item => item.value !== value);
    this.setItems(items);
    return this;
  }

  /**
   * Render list
   */
  render() {
    this.itemsContainer.innerHTML = '';
    this.itemElements = [];

    const items = this.getProperty('items', []);
    const multiSelect = this.getProperty('multiSelect', false);

    items.forEach((item, idx) => {
      const li = document.createElement('div');
      li.className = 'ui-list-item';
      li.setAttribute('data-index', idx);
      li.setAttribute('data-value', item.value);

      // Checkbox for multi-select
      if (multiSelect) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'ui-list-checkbox';
        checkbox.addEventListener('change', (e) => {
          this.handleItemSelect(item, e.target.checked, idx);
        });
        li.appendChild(checkbox);
      }

      // Item content
      const content = document.createElement('span');
      content.className = 'ui-list-content';
      content.textContent = item.label || item.value;
      li.appendChild(content);

      // Click handler
      li.addEventListener('click', (e) => {
        if (multiSelect && e.target.type === 'checkbox') {
          return; // Let checkbox handle it
        }
        this.handleItemSelect(item, !li.classList.contains('selected'), idx);
      });

      // Disabled state
      if (item.disabled) {
        li.classList.add('disabled');
        li.style.opacity = '0.5';
        li.style.pointerEvents = 'none';
      }

      this.itemsContainer.appendChild(li);
      this.itemElements.push(li);
    });
  }

  /**
   * Handle item selection
   */
  handleItemSelect(item, selected, index) {
    const multiSelect = this.getProperty('multiSelect', false);

    if (multiSelect) {
      if (selected) {
        if (!this.selectedItems.includes(item)) {
          this.selectedItems.push(item);
        }
        this.itemElements[index].classList.add('selected');
      } else {
        this.selectedItems = this.selectedItems.filter(i => i !== item);
        this.itemElements[index].classList.remove('selected');
      }
      this.emit('selectionchange', { selected: this.selectedItems });
    } else {
      // Single select
      this.itemElements.forEach(el => el.classList.remove('selected'));
      if (selected) {
        this.itemElements[index].classList.add('selected');
        this.setProperty('selectedIndex', index);
        this.setProperty('selectedItem', item);
        this.selectedItems = [item];
      } else {
        this.setProperty('selectedIndex', -1);
        this.setProperty('selectedItem', null);
        this.selectedItems = [];
      }
      this.emit('select', { item, index });
    }
  }

  /**
   * Set multi-select mode
   */
  setMultiSelect(multiSelect) {
    this.setProperty('multiSelect', multiSelect);
    this.render();
    return this;
  }

  /**
   * Get selected item (single select)
   */
  getSelectedItem() {
    return this.getProperty('selectedItem');
  }

  /**
   * Get selected items (multi select)
   */
  getSelectedItems() {
    return this.selectedItems;
  }

  /**
   * Set selected item by value
   */
  setSelectedItem(value) {
    const items = this.getProperty('items', []);
    const index = items.findIndex(item => item.value === value);
    if (index >= 0) {
      this.handleItemSelect(items[index], true, index);
    }
    return this;
  }

  /**
   * Clear selection
   */
  clearSelection() {
    this.itemElements.forEach(el => el.classList.remove('selected'));
    this.selectedItems = [];
    this.setProperty('selectedIndex', -1);
    this.setProperty('selectedItem', null);
    return this;
  }

  /**
   * Get all items
   */
  getItems() {
    return this.getProperty('items', []);
  }

  /**
   * Get item count
   */
  getItemCount() {
    return this.getProperty('items', []).length;
  }

  /**
   * Scroll to item
   */
  scrollToItem(index) {
    if (this.itemElements[index]) {
      this.itemElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return this;
  }
}

export default List;
