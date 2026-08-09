/**
 * UIKit — Link Component
 *
 * Обёртка над <a> с поддержкой disabled-состояния.
 *
 * Нативный <a> не имеет атрибута disabled (в отличие от button/input).
 * Disabled эмулируем через pointer-events:none + opacity:0.5.
 * Это визуально и функционально отключает ссылку без удаления href
 * (который может понадобиться для восстановления через setDisabled(false)).
 */

import { Base } from '../core/Base.js';

export class Link extends Base {
  constructor(text = '', href = '#') {
    super();
    this.createElement('a', 'ui-link');

    this.element.href        = href;
    this.element.textContent = text;

    this.setProperty('text',     text);
    this.setProperty('href',     href);
    this.setProperty('target',   null);
    this.setProperty('disabled', false);
  }

  setText(text) {
    this.setProperty('text', text);
    this.element.textContent = text;
    return this;
  }

  setHref(href) {
    this.setProperty('href', href);
    this.element.href = href;
    return this;
  }

  setTarget(target) {
    this.setProperty('target', target);
    if (target) {
      this.element.target = target;
    } else {
      // Убираем target полностью — target='' не эквивалентно отсутствию атрибута
      this.element.removeAttribute('target');
    }
    return this;
  }

  openInNewWindow() {
    return this.setTarget('_blank');
  }

  /**
   * Disabled через pointer-events + opacity — нативный <a> не поддерживает disabled.
   * href не удаляем — чтобы setDisabled(false) вернул исходное состояние без
   * необходимости повторно передавать URL.
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (disabled) {
      this.addClass('ui-link-disabled');
      this.element.style.pointerEvents = 'none';
      this.element.style.opacity       = '0.5';
    } else {
      this.removeClass('ui-link-disabled');
      this.element.style.pointerEvents = 'auto';
      this.element.style.opacity       = '1';
    }
    return this;
  }

  // Читаем из DOM — element.href возвращает полный URL (с origin),
  // тогда как getProperty('href') хранит то, что было передано в setHref()
  getHref() { return this.element.href; }
  getText() { return this.element.textContent; }
}

export default Link;
