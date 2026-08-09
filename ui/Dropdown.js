/**
 * UIKit — Dropdown Component
 *
 * Кастомный выпадающий список с кнопкой-триггером.
 * Для больших списков (50+ элементов) лучше использовать Select (нативный).
 * Dropdown даёт полный контроль над стилем кнопки и пунктов меню.
 *
 * _outsideClickBound: та же проблема что в DatePicker — render() может
 * вызываться при setOptions(), но слушатель на document нужен один.
 * Без флага каждый setOptions() добавлял бы новый closeMenu-слушатель.
 *
 * Кнопка-триггер (button, не div):
 * button получает фокус по Tab и обрабатывает Enter/Space из коробки.
 * div потребовал бы tabindex + ручной keydown-обработчик.
 *
 * Пункты меню тоже button (не div):
 * Клавиатурная навигация (↑↓ Enter Escape) работает через focus() на button.
 * С div-пунктами focus() требует tabindex на каждом, а Escape — ручной обработчик.
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
    this.setProperty('customWidth', null);

    this.button = null;
    this.menu   = null;
    this.isOpen = false;

    // render() в конструкторе — без него element пустой до первого setOptions(),
    // а setValue/setDisabled/setWidth молча no-op'ят (this.button === null).
    // render() с пустыми options показывает placeholder-кнопку — корректное
    // начальное состояние, лучше пустого <div>.
    this.render();
  }

  /**
   * @param {Array} options - [{value: 'id', label: 'Name'}, ...]
   */
  setOptions(options) {
    this.setProperty('options', options);
    this.render();
    return this;
  }

  getOptions() {
    return this.getProperty('options', []);
  }

  addOption(value, label) {
    const options = this.getOptions();
    options.push({ value, label });
    this.setOptions(options);
    return this;
  }

  removeOption(value) {
    const options = this.getOptions().filter(opt => opt.value !== value);
    this.setOptions(options);
    return this;
  }

  setValue(value) {
    this.setProperty('value', value);
    if (this.button) {
      const option = this.getOptions().find(opt => opt.value === value);
      // Если значение не найдено в options — показываем placeholder
      this.button.textContent = option ? option.label : this.getProperty('placeholder', '');
    }
    return this;
  }

  getValue() {
    return this.getProperty('value', '');
  }

  getButton() { return this.button; }
  getMenu()   { return this.menu; }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.button) this.button.disabled = disabled;
    return this;
  }

  setWidth(width) {
    this.setProperty('customWidth', width);
    if (this.menu) {
      this.menu.style.setProperty('width', width, 'important');
      this.menu.style.setProperty('min-width', width, 'important');
    }
    return this;
  }

  toggleMenu() {
    this.isOpen ? this.closeMenu() : this.openMenu();
  }

  openMenu() {
    if (this.menu) {
      this.menu.style.display = 'block';
      const customWidth = this.getProperty('customWidth');
      if (customWidth) {
        this.menu.style.setProperty('width', customWidth, 'important');
        this.menu.style.setProperty('min-width', customWidth, 'important');
      }
      this.isOpen = true;
      // setTimeout(0): меню должно быть видимым до вызова focus()
      setTimeout(() => {
        const firstItem = this.menu.querySelector('.ui-dropdown-item');
        if (firstItem) firstItem.focus();
      }, 0);
    }
  }

  closeMenu() {
    if (this.menu) {
      this.menu.style.display = 'none';
      this.isOpen = false;
    }
  }

  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    this.button = document.createElement('button');
    this.button.className = 'ui-dropdown-button';
    this.button.type = 'button'; // type=button: не сабмитит форму внутри <form>

    const currentValue = this.getValue();
    const option = this.getOptions().find(opt => opt.value === currentValue);
    this.button.textContent = option ? option.label : this.getProperty('placeholder', '');

    if (this.getProperty('disabled')) this.button.disabled = true;

    this.button.addEventListener('click', () => this.toggleMenu());
    this.button.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        this.openMenu();
      }
    });

    this.element.appendChild(this.button);

    this.menu = document.createElement('div');
    this.menu.className = 'ui-dropdown-menu';
    this.menu.style.display = 'none';

    const options = this.getOptions();
    options.forEach(option => {
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'ui-dropdown-item';
      item.textContent = option.label;

      if (option.value === currentValue) item.classList.add('ui-dropdown-item-selected');

      item.addEventListener('click', () => {
        this.setValue(option.value);
        this.closeMenu();
        this.emit('change', { value: option.value, label: option.label });
      });

      // Клавиатурная навигация внутри меню
      item.addEventListener('keydown', (e) => {
        const items = Array.from(this.menu.querySelectorAll('.ui-dropdown-item'));
        const currentIndex = items.indexOf(item);

        switch (e.key) {
          case 'ArrowDown':
            e.preventDefault();
            if (items[currentIndex + 1]) items[currentIndex + 1].focus();
            break;
          case 'ArrowUp':
            e.preventDefault();
            if (items[currentIndex - 1]) items[currentIndex - 1].focus();
            break;
          case 'Enter':
            e.preventDefault();
            item.click();
            break;
          case 'Escape':
            e.preventDefault();
            this.closeMenu();
            this.button.focus(); // Возвращаем фокус на кнопку-триггер
            break;
        }
      });

      this.menu.appendChild(item);
    });

    this.element.appendChild(this.menu);

    // Слушатель "клик снаружи" — только один на весь жизненный цикл компонента.
    // render() вызывается при каждом setOptions() — флаг предотвращает дублирование.
    if (!this._outsideClickBound) {
      this._outsideClickBound = true;
      this._listen(document, 'click', (e) => {
        if (this.menu && e.target !== this.button && !this.menu.contains(e.target)) {
          this.closeMenu();
        }
      });
    }

    return this;
  }
}

export default Dropdown;
