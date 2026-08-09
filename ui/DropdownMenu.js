/**
 * UIKit — DropdownMenu Component
 *
 * Кнопка с всплывающим меню (паттерн Options▾).
 * Закрывается по клику снаружи и Escape.
 * Клавиатура: ↑↓ навигация, Enter выбор, Escape закрытие.
 *
 * z-index: 2000 — выше Dialog (1050+), ниже Tooltip (10000).
 */

import { Base } from '../core/Base.js';

export class DropdownMenu extends Base {
  constructor(label = 'Options') {
    super();
    this.createElement('div', 'ui-dropdown');
    this._items = [];
    this._open  = false;
    this._highlightIdx = -1;
    this._render(label);
  }

  _render(label) {
    this._btn = document.createElement('button');
    this._btn.className = 'ui-button ui-dropdown-button';
    this._btn.textContent = label + ' ▾';
    this._btn.addEventListener('click', (e) => {
      e.stopPropagation();
      this._toggle();
    });
    this._btn.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        e.preventDefault();
        if (!this._open) this._openPanel();
        this._navigate(e.key === 'ArrowDown' ? 1 : -1);
      }
      if (e.key === 'Enter' && this._open) {
        e.preventDefault();
        this._selectHighlighted();
      }
    });

    // Панель рендерится в body чтобы не обрезалась overflow:hidden на Dialog.
    // Раз она вне this.element — Base.destroy() её не удалит, поэтому есть
    // override destroy() ниже. Без него каждый пересозданный диалог с меню
    // оставлял бы панель в body навсегда.
    this._panel = document.createElement('div');
    this._panel.className = 'ui-dropdown-panel';
    this._panel.style.cssText = 'display:none;position:fixed;z-index:2000';
    document.body.appendChild(this._panel);

    this.element.appendChild(this._btn);

    // _listen (не addEventListener): слушатели на document снимаются в destroy(),
    // иначе закрытый диалог продолжал бы получать клики ("zombie")
    this._listen(document, 'click', () => this._close());
    this._listen(document, 'keydown', (e) => {
      if (e.key === 'Escape' && this._open) this._close();
    });
  }

  destroy() {
    if (this._destroyed) return this;
    // Панель живёт в document.body, вне this.element — удаляем явно
    if (this._panel) {
      this._panel.remove();
      this._panel = null;
    }
    return super.destroy();
  }

  addItem(label, fn, opts = {}) {
    if (label === '---') {
      const sep = document.createElement('div');
      sep.className = 'ui-dropdown-separator';
      this._panel.appendChild(sep);
      return this;
    }

    const item = document.createElement('div');
    item.className = 'ui-dropdown-item';
    if (opts.disabled) item.classList.add('disabled');

    const labelSpan = document.createElement('span');
    labelSpan.textContent = label;
    item.appendChild(labelSpan);

    if (opts.key) {
      const key = document.createElement('span');
      key.className = 'ui-dropdown-item-key';
      key.textContent = opts.key;
      item.appendChild(key);
    }

    if (!opts.disabled && fn) {
      item.addEventListener('click', (e) => {
        e.stopPropagation();
        this._close();
        fn();
      });
    }

    item.addEventListener('mouseenter', () => {
      const idx = this._items.findIndex(it => it.el === item);
      if (idx >= 0) {
        this._highlightIdx = idx;
        const selectable = this._getSelectableItems();
        this._selectableIdx = selectable.indexOf(this._items[idx]);
        this._updateHighlight();
      }
    });

    this._panel.appendChild(item);
    this._items.push({ label, fn, opts, el: item });
    return this;
  }

  addGroup(groupLabel, items = []) {
    const hdr = document.createElement('div');
    hdr.className = 'ui-dropdown-group-header';
    hdr.textContent = groupLabel;
    this._panel.appendChild(hdr);
    items.forEach(({ label, fn, opts }) => this.addItem(label, fn, opts));
    return this;
  }

  _toggle() {
    this._open ? this._close() : this._openPanel();
  }

  _openPanel() {
    this._panel.style.visibility = 'hidden';
    this._panel.style.display = 'block';

    const rect       = this._btn.getBoundingClientRect();
    const panelH     = this._panel.offsetHeight;
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;

    if (spaceBelow >= panelH || spaceBelow >= spaceAbove) {
      this._panel.style.top = (rect.bottom + 2) + 'px';
    } else {
      this._panel.style.top = (rect.top - panelH - 2) + 'px';
    }
    this._panel.style.left       = rect.left + 'px';
    this._panel.style.visibility = '';
    this._open = true;
    this._highlightIdx  = -1;
    this._selectableIdx = -1; // сброс: иначе навигация продолжалась бы со старой позиции
    this._updateHighlight();
    this.emit('open', {});
  }

  _close() {
    this._panel.style.display = 'none';
    this._open = false;
    this._highlightIdx = -1;
    this._updateHighlight();
  }

  _getSelectableItems() {
    return this._items.filter(it => !it.opts.disabled && it.label !== '---');
  }

  _navigate(dir) {
    const selectable = this._getSelectableItems();
    if (!selectable.length) return;

    let newIdx = (this._selectableIdx ?? -1) + dir;
    if (newIdx < 0) newIdx = selectable.length - 1;
    if (newIdx >= selectable.length) newIdx = 0;
    this._selectableIdx = newIdx;

    this._highlightIdx = this._items.indexOf(selectable[newIdx]);
    this._updateHighlight();

    // Scroll into view
    const el = selectable[newIdx].el;
    if (el) el.scrollIntoView({ block: 'nearest' });
  }

  _updateHighlight() {
    this._items.forEach((it, i) => {
      if (it.el) it.el.classList.toggle('highlighted', i === this._highlightIdx);
    });
  }

  _selectHighlighted() {
    if (this._highlightIdx < 0) return;
    const item = this._items[this._highlightIdx];
    if (item && item.fn && !item.opts.disabled) {
      this._close();
      item.fn();
    }
  }
}

export default DropdownMenu;
