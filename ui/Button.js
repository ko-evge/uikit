/**
 * UIKit — Button Component
 *
 * Тип кнопки (primary/danger/success/warning) реализован через CSS-классы,
 * а не inline-стили — чтобы тема (modern.css / tabulator.css) могла
 * переопределить цвет одной строкой в CSS без изменения JS.
 *
 * F-key суффикс встроен в getText() а не в setText():
 * setFKey('F2') после setText('Save') должен показывать 'Save [F2]'.
 * Если бы getText() возвращал только сырой текст, каждый вызов setText()
 * после setFKey() затирал бы суффикс.
 */

import { Base } from '../core/Base.js';

export class Button extends Base {
  constructor(text = '', onClick = null) {
    super();
    this.createElement('button', 'ui-button');
    this.setText(text);
    this.setProperty('fKey', null);

    // Shortcut: передать onClick в конструктор вместо btn.on('click', fn)
    if (onClick) this.on('click', onClick);
  }

  setText(text) {
    this.setProperty('text', text);
    // Обновляем через getText() — чтобы уже установленный fKey-суффикс остался
    if (this.element) this.element.textContent = this.getText();
    return this;
  }

  getText() {
    const text = this.getProperty('text', '');
    const fKey = this.getProperty('fKey');
    // fKey показывается пользователю как подсказка горячей клавиши
    return fKey ? `${text} [${fKey}]` : text;
  }

  setFKey(fKey) {
    this.setProperty('fKey', fKey);
    if (this.element) this.element.textContent = this.getText();
    return this;
  }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.element) this.element.disabled = disabled;
    return this;
  }

  isDisabled() {
    return this.getProperty('disabled', false);
  }

  /**
   * Устанавливает визуальный тип кнопки через CSS-классы.
   * При смене типа снимаем все модификаторы перед добавлением нового —
   * иначе накапливались бы лишние классы (primary + danger одновременно).
   */
  setType(type) {
    this.setProperty('type', type);
    this.removeClass('ui-button-primary');
    this.removeClass('ui-button-danger');
    this.removeClass('ui-button-success');
    this.removeClass('ui-button-warning');
    if (type && type !== 'default') this.addClass(`ui-button-${type}`);
    return this;
  }

  getType() {
    return this.getProperty('type', 'default');
  }

  setSize(size) {
    this.setProperty('size', size);
    this.removeClass('ui-button-small');
    this.removeClass('ui-button-large');
    if (size && size !== 'medium') this.addClass(`ui-button-${size}`);
    return this;
  }

  // Программный клик — делегируем в DOM, чтобы сработали все нативные обработчики
  click() {
    if (this.element) this.element.click();
    return this;
  }
}

export default Button;
