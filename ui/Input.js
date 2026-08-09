/**
 * UIKit — Input Component
 *
 * Нативное событие 'input' переводится в кастомное 'change':
 * - 'input' срабатывает на каждый символ — это нам и нужно
 * - 'change' в браузере срабатывает только при потере фокуса (blur)
 * Коллеги привыкли слушать on('change') для реакции на ввод в реальном
 * времени, поэтому bridging скрывает браузерную особенность.
 *
 * 'blur' и 'focus' — нативные DOM-события из DOM_EVENTS в Base, поэтому
 * on('blur', fn) работает напрямую без дополнительного emit.
 *
 * getValue() читает из element.value, а не из properties:
 * DOM-инпут — источник истины. Если пользователь набрал текст и мы
 * читаем через getProperty('value'), можем получить устаревшее значение
 * (если 'input' не успел сработать). element.value всегда актуален.
 */

import { Base } from '../core/Base.js';

export class Input extends Base {
  constructor(type = 'text', placeholder = '') {
    super();
    this.createElement('input', 'ui-input');
    this.element.type = type;
    this.setProperty('type', type);

    if (placeholder) this.setPlaceholder(placeholder);

    // 'input' -> 'change': скрываем браузерное поведение, где 'change' = blur
    this.on('input', (e) => {
      this.setProperty('value', e.target.value);
      this.emit('change', { value: e.target.value });
    });
  }

  setValue(value) {
    this.setProperty('value', value);
    // Синхронизируем DOM — иначе getValue() вернёт старое значение
    if (this.element) this.element.value = value || '';
    return this;
  }

  // Читаем из DOM, не из properties — DOM всегда актуальнее при живом вводе
  getValue() {
    return this.element ? this.element.value : '';
  }

  setPlaceholder(text) {
    this.setProperty('placeholder', text);
    if (this.element) this.element.placeholder = text;
    return this;
  }

  setType(type) {
    this.setProperty('type', type);
    if (this.element) this.element.type = type;
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
}

export default Input;
