/**
 * UIKit — RadioButton Component
 *
 * Группа radio-кнопок с единственным выбором.
 *
 * name-атрибут — ключевой: браузер сам обеспечивает взаимоисключение
 * radio внутри одной name-группы. Без общего name каждый input независим
 * и можно было бы выбрать несколько вариантов.
 *
 * inputMap (value -> input element):
 * setValue(v) должен найти и отметить нужный input без querySelector.
 * С inputMap это O(1). Без него — O(N) через querySelectorAll + filter.
 *
 * setOptions() сбрасывает inputMap и перестраивает DOM полностью —
 * потому что изменение набора опций меняет и name-группу, и порядок,
 * и старые input-ссылки в inputMap стали бы невалидными.
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

    // Быстрый доступ к input-элементу по значению опции
    this.inputMap = {};

    if (options.length > 0) this.setOptions(options);
  }

  /**
   * @param {Array} options - [{ value: 'id', label: 'Label' }, ...]
   */
  setOptions(options) {
    this.setProperty('options', options);
    this.element.innerHTML = '';
    this.inputMap = {};

    // Если name не задан — генерируем уникальный, иначе разные RadioButton
    // на странице окажутся в одной браузерной группе и сломают друг друга
    const name = this.getProperty('name') || 'radio-' + Math.random().toString(36).slice(2, 11);

    options.forEach((option) => {
      const wrapper = document.createElement('div');
      wrapper.className = 'ui-radio-option';

      const input = document.createElement('input');
      input.type = 'radio';
      input.name = name;     // Один name — одна браузерная группа взаимоисключения
      input.value = option.value || '';
      input.className = 'ui-radio-input';

      // label-обёртка расширяет кликабельную зону на текст (как в Checkbox)
      const label = document.createElement('label');
      label.className = 'ui-radio-label';
      label.appendChild(input);

      const text = document.createElement('span');
      text.textContent = option.label || option.value;
      label.appendChild(text);

      wrapper.appendChild(label);
      this.element.appendChild(wrapper);

      // Запоминаем ссылку для setValue() — O(1) доступ вместо querySelector
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

  addOption(value, label) {
    const options = this.getProperty('options', []);
    options.push({ value, label });
    // setOptions() пересобирает весь DOM (innerHTML=''), теряя отметку текущего
    // значения — восстанавливаем её, иначе addOption() в цикле стирает
    // setValue(), выставленный на предыдущей итерации.
    const current = this.getProperty('value');
    this.setOptions(options);
    if (current != null && this.inputMap[current]) this.setValue(current);
    return this;
  }

  removeOption(value) {
    const options = this.getProperty('options', []).filter(opt => opt.value !== value);
    const current = this.getProperty('value');
    this.setOptions(options);
    if (current != null && current !== value && this.inputMap[current]) this.setValue(current);
    return this;
  }

  setValue(value) {
    this.setProperty('value', value);
    // inputMap даёт прямой доступ к нужному input без перебора
    if (this.inputMap[value]) this.inputMap[value].checked = true;
    return this;
  }

  getValue() {
    return this.getProperty('value');
  }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    // Блокируем все inputs в группе разом
    Object.values(this.inputMap).forEach(input => { input.disabled = disabled; });
    return this;
  }

  getValues() {
    return this.getProperty('options', []).map(opt => opt.value);
  }
}

export default RadioButton;
