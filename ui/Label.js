/**
 * UIKit — Label Component
 *
 * Тег <label> а не <span>: нативная семантика.
 * setFor(id) связывает label с input через htmlFor — клик по тексту
 * ставит фокус на связанный input. Это бесплатная доступность (a11y).
 */

import { Base } from '../core/Base.js';

export class Label extends Base {
  constructor(text = '') {
    super();
    this.createElement('label', 'ui-label');
    this.setText(text);
  }

  setText(text) {
    this.setProperty('text', text);
    if (this.element) this.element.textContent = text;
    return this;
  }

  getText() {
    return this.getProperty('text', '');
  }

  // htmlFor (а не setAttribute('for')): браузер правильно связывает label с input
  // только через свойство htmlFor или атрибут for — оба варианта эквивалентны,
  // но htmlFor — DOM-свойство, тогда как setAttribute('for') — строковый атрибут
  setFor(id) {
    this.setProperty('for', id);
    if (this.element) this.element.htmlFor = id;
    return this;
  }

  getFor() {
    return this.getProperty('for', '');
  }
}

export default Label;
