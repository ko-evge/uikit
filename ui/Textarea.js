/**
 * UIKit — Textarea Component
 *
 * Многострочный текстовый ввод.
 *
 * Та же проблема что в Input: нативное 'change' срабатывает на blur,
 * а не на каждый символ. Поэтому 'input' -> emit('change') — тот же паттерн.
 *
 * createElement('textarea') — НЕ div с textarea внутри:
 * this.element сам является textarea, поэтому Base.on('input') вешает
 * слушатель напрямую на нужный элемент без querySelector.
 */

import { Base } from '../core/Base.js';

export class Textarea extends Base {
  constructor(placeholder = '') {
    super();
    this.createElement('textarea', 'ui-textarea');

    if (placeholder) {
      this.element.placeholder = placeholder;
      this.setProperty('placeholder', placeholder);
    }

    this.setProperty('value', '');
    this.setProperty('rows', 4);
    this.setProperty('maxLength', null);

    // 'input' -> 'change': нативный 'change' = blur, нам нужна реакция на каждый символ
    this.on('input', (e) => {
      this.setProperty('value', e.target.value);
      this.emit('change', { value: e.target.value });
    });
  }

  setValue(value) {
    this.setProperty('value', value);
    if (this.element) this.element.value = value || '';
    return this;
  }

  // DOM — источник истины для живого ввода
  getValue() {
    return this.element ? this.element.value : '';
  }

  setPlaceholder(text) {
    this.setProperty('placeholder', text);
    if (this.element) this.element.placeholder = text;
    return this;
  }

  setRows(rows) {
    this.setProperty('rows', rows);
    if (this.element) this.element.rows = rows;
    return this;
  }

  setMaxLength(length) {
    this.setProperty('maxLength', length);
    if (this.element) {
      if (length) {
        this.element.maxLength = length;
      } else {
        // Убираем атрибут полностью — maxLength=0 блокировал бы ввод
        this.element.removeAttribute('maxLength');
      }
    }
    return this;
  }

  setReadonly(readonly) {
    this.setProperty('readonly', readonly);
    if (this.element) this.element.readOnly = readonly;
    return this;
  }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.element) this.element.disabled = disabled;
    return this;
  }

  focus() {
    if (this.element) this.element.focus();
    return this;
  }

  clear() {
    return this.setValue('');
  }

  selectAll() {
    if (this.element) this.element.select();
    return this;
  }

  getCharCount() {
    return this.getValue().length;
  }
}

export default Textarea;
