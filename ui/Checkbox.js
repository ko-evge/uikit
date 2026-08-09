/**
 * UIKit — Checkbox Component
 *
 * Структура: wrapper > label > [input + span].
 * input внутри label — нативный браузерный паттерн: клик по тексту
 * рядом с чекбоксом тоже переключает состояние без дополнительного JS.
 *
 * getValue/setValue — синонимы isChecked/setChecked:
 * Единый интерфейс с остальными компонентами формы (Input, Select...).
 * Form.getData() вызывает getValue() на всех полях — Checkbox работает
 * в форме без специальной обработки.
 */

import { Base } from '../core/Base.js';

export class Checkbox extends Base {
  constructor(label = '') {
    super();
    this.createElement('div', 'ui-checkbox-wrapper');

    const input = document.createElement('input');
    input.type = 'checkbox';
    input.className = 'ui-checkbox-input';

    // label-обёртка расширяет кликабельную зону на весь текст
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

    this.input.addEventListener('change', (e) => {
      this.setProperty('checked', e.target.checked);
      this.emit('change', { checked: e.target.checked });
    });
  }

  setChecked(checked) {
    this.setProperty('checked', checked);
    this.input.checked = checked;
    return this;
  }

  // Читаем из DOM — источник истины при живом взаимодействии
  isChecked() {
    return this.input.checked;
  }

  setLabel(text) {
    this.setProperty('label', text);
    const span = this.element.querySelector('.ui-checkbox-label span');
    if (span) span.textContent = text;
    return this;
  }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    this.input.disabled = disabled;
    return this;
  }

  toggle() {
    return this.setChecked(!this.isChecked());
  }

  focus() { this.input.focus(); return this; }

  // getValue/setValue — для совместимости с Form.getData() и EditDialog
  getValue() { return this.isChecked(); }
  setValue(value) { return this.setChecked(value); }
}

export default Checkbox;
