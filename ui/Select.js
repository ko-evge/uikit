/**
 * UIKit — Select Component
 *
 * Обёртка над нативным <select> для больших списков (50+ элементов).
 *
 * Почему нативный <select>, а не кастомный Dropdown/Combo:
 * При 51 справочнике кастомный dropdown ломался — позиционирование,
 * прокрутка, клавиатура требовали отдельного решения для каждого браузера.
 * Нативный <select> даёт всё это бесплатно: системный попап, ↑↓ клавиши,
 * поиск по первой букве, правильная прокрутка на мобильных.
 *
 * showPicker():
 * Позволяет открыть попап программно (без клика пользователя).
 * Используется для Directory Menu (F9) — диалог открывается сразу
 * с раскрытым списком справочников, пользователь сразу выбирает.
 *
 * Пустая первая опция (placeholder):
 * Без неё нативный <select> по умолчанию выбирает первый элемент
 * и не генерирует событие change при первом выборе этого элемента.
 * Пустая опция решает оба случая и показывает placeholder-текст.
 */

import { Base } from '../core/Base.js';

export class Select extends Base {
  constructor(placeholder = 'Select option') {
    super();
    this.createElement('div', 'ui-select-wrapper');

    this.selectElement = null;
    this.setProperty('value', '');
    this.setProperty('options', []);
    this.setProperty('placeholder', placeholder);
    this.setProperty('disabled', false);

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

  setValue(value) {
    this.setProperty('value', value);
    if (this.selectElement) this.selectElement.value = value;
    return this;
  }

  getValue() {
    return this.getProperty('value', '');
  }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.selectElement) this.selectElement.disabled = disabled;
    return this;
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';

    this.selectElement = document.createElement('select');
    this.selectElement.className = 'ui-select';

    // Пустая опция выбрана по умолчанию — без неё браузер выберет первый пункт
    // и пользователь не сможет "выбрать первый пункт" (change не сработает)
    const emptyOption = document.createElement('option');
    emptyOption.value = '';
    emptyOption.textContent = '';
    emptyOption.selected = true;
    this.selectElement.appendChild(emptyOption);

    const options = this.getOptions();
    options.forEach(option => {
      const optionElement = document.createElement('option');
      optionElement.value = option.value;
      optionElement.textContent = option.label || option.value;
      this.selectElement.appendChild(optionElement);
    });

    const currentValue = this.getValue();
    if (currentValue) this.selectElement.value = currentValue;

    if (this.getProperty('disabled')) this.selectElement.disabled = true;

    this.selectElement.addEventListener('change', (e) => {
      const value = e.target.value;
      // DOM всегда даёт value строкой; option.value может быть числом (напр.
      // pr_ch из БД) — строгое === никогда не совпадало бы, option оставался
      // undefined, и любой обработчик 'change', завязанный на option, молча
      // не срабатывал (сравниваем строковую форму с обеих сторон).
      const option = options.find(opt => String(opt.value) === value);
      this.setProperty('value', value);
      this.emit('change', {
        value,
        label: option ? option.label : '',
        option
      });
    });

    this.element.appendChild(this.selectElement);
  }

  focus() {
    if (this.selectElement) this.selectElement.focus();
  }

  click() {
    if (this.selectElement) this.selectElement.click();
  }

  /**
   * Открывает попап программно без клика пользователя.
   * showPicker() — Chrome 101+, Firefox 98+. Для старых браузеров
   * fallback: focus() + click() — работает в большинстве случаев,
   * но без гарантии раскрытия попапа.
   */
  showPicker() {
    if (this.selectElement && this.selectElement.showPicker) {
      this.selectElement.showPicker();
    } else if (this.selectElement) {
      this.selectElement.focus();
      this.selectElement.click();
    }
  }
}
