/**
 * UIKit — Alert Component
 *
 * Инлайн-сообщение внутри формы/панели (не всплывает и не исчезает само,
 * в отличие от Toast) — для ошибок валидации формы и системных предупреждений,
 * которые должны оставаться на экране, пока пользователь их не устранит.
 *
 * Создать → append в контейнер, как остальные компоненты UIKit (не auto-render).
 */

import { Base } from '../core/Base.js';

export class Alert extends Base {
  /**
   * @param {string} message
   * @param {'info'|'success'|'warning'|'error'} [type]
   * @param {object} [opts]
   * @param {boolean} [opts.dismissible] — показать крестик для ручного закрытия
   */
  constructor(message = '', type = 'info', opts = {}) {
    super();
    this.createElement('div', `ui-inline-alert ui-inline-alert-${type}`);
    this._type = type;

    this._textEl = document.createElement('span');
    this._textEl.className = 'ui-inline-alert-text';
    this._textEl.textContent = message;
    this.element.appendChild(this._textEl);

    if (opts.dismissible) {
      const closeBtn = document.createElement('button');
      closeBtn.type = 'button';
      closeBtn.className = 'ui-inline-alert-close';
      closeBtn.textContent = '×';
      closeBtn.setAttribute('aria-label', 'Dismiss');
      closeBtn.addEventListener('click', () => this.element.remove());
      this.element.appendChild(closeBtn);
    }
  }

  setMessage(message) {
    this._textEl.textContent = message;
    return this;
  }

  setType(type) {
    this.element.classList.remove(`ui-inline-alert-${this._type}`);
    this._type = type;
    this.element.classList.add(`ui-inline-alert-${type}`);
    return this;
  }
}
