/**
 * UIKit — Spinner / LoadingOverlay Component
 *
 * Индикатор "программа работает" для долгих async-операций (обработка
 * документа, генерация большого отчёта) — CSS-анимация вращения, никакого
 * реального процента не считает (это не progress bar). Опционально —
 * текстовый статус под спиннером, который можно менять снаружи (например,
 * "Processed: 120 rows") — то, что реально движется/меняется, а не статичный
 * "Processing..." без обратной связи.
 *
 * Two modes:
 *  - inline: небольшой спиннер внутри кнопки/строки (Spinner.inline())
 *  - overlay: полноэкранная (или на весь родитель) полупрозрачная накладка
 *    с крутящимся кругом по центру — блокирует клики под собой, пока идёт
 *    операция (LoadingOverlay.show()/hide()).
 */

import { Base } from '../core/Base.js';

export class Spinner extends Base {
  constructor(size = 20) {
    super();
    this.createElement('span', 'ui-spinner');
    this.element.style.width = size + 'px';
    this.element.style.height = size + 'px';
  }

  static inline(size = 16) {
    return new Spinner(size).element;
  }
}

/**
 * LoadingOverlay — накладка на весь экран (или на конкретный контейнер) с
 * крутящимся спиннером и опциональным текстом статуса. Один статический
 * инстанс на приложение — show()/hide() переиспользуют один и тот же DOM-узел,
 * не плодя оверлеи при повторных вызовах.
 */
let _overlayEl = null;
let _statusEl  = null;

function ensureOverlay() {
  if (_overlayEl) return _overlayEl;
  _overlayEl = document.createElement('div');
  _overlayEl.className = 'ui-loading-overlay';
  _overlayEl.style.display = 'none';

  const spinner = Spinner.inline(40);
  spinner.classList.add('ui-loading-overlay-spinner');

  _statusEl = document.createElement('div');
  _statusEl.className = 'ui-loading-overlay-status';

  const box = document.createElement('div');
  box.className = 'ui-loading-overlay-box';
  box.append(spinner, _statusEl);
  _overlayEl.appendChild(box);

  document.body.appendChild(_overlayEl);
  return _overlayEl;
}

export const LoadingOverlay = {
  /**
   * @param {string} [status] — начальный текст под спиннером (напр. "Processing…")
   */
  show(status = '') {
    ensureOverlay();
    _statusEl.textContent = status;
    _overlayEl.style.display = 'flex';
  },

  /** Обновить текст статуса, не трогая видимость (напр. растущий счётчик строк). */
  setStatus(status) {
    if (_statusEl) _statusEl.textContent = status;
  },

  hide() {
    if (_overlayEl) _overlayEl.style.display = 'none';
  },
};
