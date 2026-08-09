/**
 * UIKit — HorizontalLayout Component
 *
 * Три зоны: left (фиксированная ширина), middle (растягивается), right (фиксированная ширина).
 * Симметрично VerticalLayout, но по горизонтали.
 *
 * Почему position:absolute вместо flexbox — см. VerticalLayout.js.
 */

import { Base } from '../core/Base.js';

export class HorizontalLayout extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-hlayout');

    this.leftPanel  = null;
    this.middlePanel = null;
    this.rightPanel = null;

    this.leftWidth  = 0;
    this.rightWidth = 0;

    this.render();
  }

  getLeft()   { return this.leftPanel; }
  getMiddle() { return this.middlePanel; }
  getRight()  { return this.rightPanel; }

  setLeftWidth(width) {
    this.leftWidth = width;
    this.updateLayout();
    return this;
  }

  setRightWidth(width) {
    this.rightWidth = width;
    this.updateLayout();
    return this;
  }

  setLeftContent(content) {
    return this._setContent(this.leftPanel, content);
  }

  setMiddleContent(content) {
    return this._setContent(this.middlePanel, content);
  }

  setRightContent(content) {
    return this._setContent(this.rightPanel, content);
  }

  appendToLeft(element) {
    return this._append(this.leftPanel, element);
  }

  appendToMiddle(element) {
    return this._append(this.middlePanel, element);
  }

  appendToRight(element) {
    return this._append(this.rightPanel, element);
  }

  _setContent(panel, content) {
    if (!panel) return this;
    panel.innerHTML = '';
    if (content instanceof Base)             panel.appendChild(content.getDOMElement());
    else if (content instanceof HTMLElement) panel.appendChild(content);
    else if (typeof content === 'string')    panel.innerHTML = content;
    return this;
  }

  _append(panel, element) {
    if (!panel) return this;
    if (element instanceof Base)             panel.appendChild(element.getDOMElement());
    else if (element instanceof HTMLElement) panel.appendChild(element);
    return this;
  }

  updateLayout() {
    if (!this.leftPanel || !this.middlePanel || !this.rightPanel) return this;

    const leftW  = this.leftWidth  + 'px';
    const rightW = this.rightWidth + 'px';

    this.leftPanel.style.width   = leftW;
    this.leftPanel.style.display = this.leftWidth ? 'block' : 'none';

    this.rightPanel.style.width   = rightW;
    this.rightPanel.style.display = this.rightWidth ? 'block' : 'none';

    this.middlePanel.style.left  = leftW;
    this.middlePanel.style.right = rightW;

    return this;
  }

  render() {
    if (!this.element) return;
    this.element.innerHTML = '';

    this.leftPanel   = document.createElement('div');
    this.leftPanel.className   = 'ui-hlayout-left';

    this.middlePanel = document.createElement('div');
    this.middlePanel.className = 'ui-hlayout-middle';

    this.rightPanel  = document.createElement('div');
    this.rightPanel.className  = 'ui-hlayout-right';

    this.element.appendChild(this.leftPanel);
    this.element.appendChild(this.middlePanel);
    this.element.appendChild(this.rightPanel);

    this.updateLayout();
    return this;
  }
}

export default HorizontalLayout;
