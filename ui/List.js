/**
 * UIKit — List Component
 *
 * Прокручиваемый список с выбором элементов.
 *
 * Почему itemsContainer — отдельный div внутри .ui-list:
 * .ui-list — flex-контейнер (flex:1, min-height:0) для заполнения родителя.
 * .ui-list-items получает flex:1 и overflow-y:auto — только эта зона скролится.
 * Если бы scroll был на самом .ui-list, заголовки/тулбары тоже уезжали бы.
 *
 * Почему tabindex='0' на каждом item:
 * Клавиатурная навигация (↑↓ Enter) требует, чтобы элементы могли получать фокус.
 * Без tabindex focus() игнорируется браузером на div-элементах.
 */

import { Base } from '../core/Base.js';

export class List extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-list');

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
   * @param {Array} items - [{ value: 'id', label: 'Label', disabled: false }, ...]
   */
  get selectedIndex() { return this.getProperty('selectedIndex', -1); }

  setItems(items) {
    this.setProperty('items', items || []);
    // Сбрасываем выделение — старые индексы невалидны после смены данных
    this.selectedItems = [];
    this.itemElements = [];
    this.render();
    return this;
  }

  addItem(value, label) {
    const items = this.getProperty('items', []);
    items.push({ value, label });
    this.setItems(items);
    return this;
  }

  removeItem(value) {
    let items = this.getProperty('items', []);
    items = items.filter(item => item.value !== value);
    this.setItems(items);
    return this;
  }

  render() {
    if (this._renderSuspended()) return;

    this.itemsContainer.innerHTML = '';
    this.itemElements = [];

    const items = this.getProperty('items', []);
    const multiSelect = this.getProperty('multiSelect', false);

    items.forEach((item, idx) => {
      const li = document.createElement('div');
      li.className = 'ui-list-item';
      li.setAttribute('data-index', idx);
      li.setAttribute('data-value', item.value);
      li.setAttribute('tabindex', '0');

      if (multiSelect) {
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'ui-list-checkbox';
        checkbox.addEventListener('change', (e) => {
          this.handleItemSelect(item, e.target.checked, idx);
        });
        li.appendChild(checkbox);
      }

      const content = document.createElement('span');
      content.className = 'ui-list-content';
      content.textContent = item.label || item.value;
      li.appendChild(content);

      li.addEventListener('click', (e) => {
        // В multiSelect чекбокс обрабатывает себя сам — не дублируем
        if (multiSelect && e.target.type === 'checkbox') return;
        this.handleItemSelect(item, !li.classList.contains('selected'), idx);
      });

      // Клавиатурная навигация внутри списка — ArrowDown/Up перемещает фокус,
      // Enter/Space — выбирает. Home/End — к краям списка.
      li.addEventListener('keydown', (e) => {
        const items = this.itemElements;
        const currentIndex = items.indexOf(li);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (currentIndex < items.length - 1) items[currentIndex + 1].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (currentIndex > 0) items[currentIndex - 1].focus();
            break;
          case 'Enter':
          case ' ':
            e.preventDefault();
            this.handleItemSelect(item, !li.classList.contains('selected'), idx);
            break;
          case 'Home':
            e.preventDefault();
            if (items.length > 0) items[0].focus();
            break;
          case 'End':
            e.preventDefault();
            if (items.length > 0) items[items.length - 1].focus();
            break;
        }
      });

      if (item.disabled) {
        li.classList.add('disabled');
        // pointer-events:none + opacity вместо disabled-атрибута (div не имеет disabled)
        li.style.opacity = '0.5';
        li.style.pointerEvents = 'none';
      }

      this.itemsContainer.appendChild(li);
      this.itemElements.push(li);
    });

    // setTimeout(0): список должен быть в DOM, иначе focus() игнорируется.
    // Авто-фокус пропускаем, если пользователь сейчас печатает в input/textarea:
    // setItems() часто вызывается на каждый символ поиска, и безусловный focus()
    // крал фокус у поля ввода после каждого нажатия (NewDocumentDialog: Input + List)
    if (this.itemElements.length > 0) {
      const ae = document.activeElement;
      const typing = ae && (ae.tagName === 'INPUT' || ae.tagName === 'TEXTAREA' || ae.isContentEditable);
      if (!typing) {
        setTimeout(() => { this.itemElements[0]?.focus(); }, 0);
      }
    }
  }

  handleItemSelect(item, selected, index) {
    const multiSelect = this.getProperty('multiSelect', false);

    if (multiSelect) {
      if (selected) {
        if (!this.selectedItems.includes(item)) this.selectedItems.push(item);
        this.itemElements[index].classList.add('selected');
      } else {
        this.selectedItems = this.selectedItems.filter(i => i !== item);
        this.itemElements[index].classList.remove('selected');
      }
      this.emit('selectionchange', { selected: this.selectedItems });
    } else {
      // Одиночный выбор: снимаем выделение со всех перед установкой нового
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
   * Переключение режима выбора.
   * Сбрасываем выделение при смене режима — иначе selectedItems (массив)
   * и selectedItem (единичное) были бы в несогласованном состоянии.
   */
  setMultiSelect(multiSelect) {
    this.setProperty('multiSelect', multiSelect);
    this.selectedItems = [];
    this.setProperty('selectedIndex', -1);
    this.setProperty('selectedItem', null);
    this.render();
    return this;
  }

  getSelectedItem() {
    return this.getProperty('selectedItem');
  }

  getSelectedItems() {
    return this.selectedItems;
  }

  setSelectedItem(value) {
    const items = this.getProperty('items', []);
    const index = items.findIndex(item => item.value === value);
    if (index >= 0) this.handleItemSelect(items[index], true, index);
    return this;
  }

  clearSelection() {
    this.itemElements.forEach(el => el.classList.remove('selected'));
    this.selectedItems = [];
    this.setProperty('selectedIndex', -1);
    this.setProperty('selectedItem', null);
    return this;
  }

  getItems() {
    return this.getProperty('items', []);
  }

  getItemCount() {
    return this.getProperty('items', []).length;
  }

  scrollToItem(index) {
    if (this.itemElements[index]) {
      this.itemElements[index].scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
    return this;
  }
}

export default List;
