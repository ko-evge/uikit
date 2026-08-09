/**
 * UIKit — VerticalLayout Component
 *
 * Три зоны: top (фиксированная), middle (растягивается), bottom (фиксированная).
 * Паттерн взят из ActiveWidgets Grid Panel.
 *
 * Почему position:absolute вместо flexbox:
 * Flex-подход требует знать высоты top/bottom в CSS, чтобы middle получил
 * flex:1. При динамическом изменении высот (панель toolbars разного размера)
 * flex пересчитывается неправильно — браузер кешируют размеры.
 * Absolute + top/bottom offsets работают точно: middle всегда занимает
 * ровно то пространство, которое не занято top и bottom.
 *
 * Применение в IMS: ReferenceDialogDynamic строит:
 *   top    = toolbar (поиск + кнопки) — фиксированная высота
 *   middle = Grid (данные) — растягивается
 *   bottom = счётчик записей — фиксированная высота
 */

import { Base } from '../core/Base.js';

export class VerticalLayout extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-vlayout');

    this.topPanel = null;
    this.middlePanel = null;
    this.bottomPanel = null;

    this.topHeight = 0;
    this.bottomHeight = 0;

    this.render();
  }

  getTop()    { return this.topPanel; }
  getMiddle() { return this.middlePanel; }
  getBottom() { return this.bottomPanel; }

  setTopHeight(height) {
    this.topHeight = height;
    this.updateLayout();
    return this;
  }

  setBottomHeight(height) {
    this.bottomHeight = height;
    this.updateLayout();
    return this;
  }

  setTopContent(content) {
    if (!this.topPanel) return this;
    this.topPanel.innerHTML = '';
    if (content instanceof Base) {
      this.topPanel.appendChild(content.getDOMElement());
    } else if (content instanceof HTMLElement) {
      this.topPanel.appendChild(content);
    } else if (typeof content === 'string') {
      this.topPanel.innerHTML = content;
    }
    return this;
  }

  setMiddleContent(content) {
    if (!this.middlePanel) return this;
    this.middlePanel.innerHTML = '';
    if (content instanceof Base) {
      this.middlePanel.appendChild(content.getDOMElement());
    } else if (content instanceof HTMLElement) {
      this.middlePanel.appendChild(content);
    } else if (typeof content === 'string') {
      this.middlePanel.innerHTML = content;
    }
    return this;
  }

  setBottomContent(content) {
    if (!this.bottomPanel) return this;
    this.bottomPanel.innerHTML = '';
    if (content instanceof Base) {
      this.bottomPanel.appendChild(content.getDOMElement());
    } else if (content instanceof HTMLElement) {
      this.bottomPanel.appendChild(content);
    } else if (typeof content === 'string') {
      this.bottomPanel.innerHTML = content;
    }
    return this;
  }

  appendToTop(element) {
    if (!this.topPanel) return this;
    if (element instanceof Base) {
      this.topPanel.appendChild(element.getDOMElement());
    } else if (element instanceof HTMLElement) {
      this.topPanel.appendChild(element);
    }
    return this;
  }

  appendToMiddle(element) {
    if (!this.middlePanel) return this;
    if (element instanceof Base) {
      this.middlePanel.appendChild(element.getDOMElement());
    } else if (element instanceof HTMLElement) {
      this.middlePanel.appendChild(element);
    }
    return this;
  }

  appendToBottom(element) {
    if (!this.bottomPanel) return this;
    if (element instanceof Base) {
      this.bottomPanel.appendChild(element.getDOMElement());
    } else if (element instanceof HTMLElement) {
      this.bottomPanel.appendChild(element);
    }
    return this;
  }

  /**
   * Пересчёт позиций после смены высот top/bottom.
   *
   * top и bottom — position:absolute с фиксированной высотой.
   * middle — position:absolute, растягивается через top/bottom offsets:
   *   middle.top = topHeight  (нижняя граница top-панели)
   *   middle.bottom = bottomHeight  (верхняя граница bottom-панели)
   * Браузер сам вычисляет реальную высоту middle = parent - top - bottom.
   */
  updateLayout() {
    if (!this.topPanel || !this.middlePanel || !this.bottomPanel) return this;

    const topH    = this.topHeight + 'px';
    const bottomH = this.bottomHeight + 'px';

    this.topPanel.style.height     = topH;
    // visibility:hidden а не display:none — чтобы не схлопывалось пространство
    this.topPanel.style.visibility = this.topHeight ? 'visible' : 'hidden';

    this.bottomPanel.style.height  = bottomH;
    this.bottomPanel.style.display = this.bottomHeight ? 'block' : 'none';

    // Ключевое: middle прижимается к нижнему краю top и верхнему краю bottom
    this.middlePanel.style.top    = topH;
    this.middlePanel.style.bottom = bottomH;

    return this;
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';

    // CSS-классы .ui-vlayout-top/middle/bottom задают position:absolute
    // и width:100% — не дублируем здесь inline
    this.topPanel    = document.createElement('div');
    this.topPanel.className    = 'ui-vlayout-top';

    this.middlePanel = document.createElement('div');
    this.middlePanel.className = 'ui-vlayout-middle';

    this.bottomPanel = document.createElement('div');
    this.bottomPanel.className = 'ui-vlayout-bottom';

    this.element.appendChild(this.topPanel);
    this.element.appendChild(this.middlePanel);
    this.element.appendChild(this.bottomPanel);

    // Применяем начальные отступы (topHeight/bottomHeight могут быть уже заданы
    // до render() если caller переиспользует layout-объект)
    this.updateLayout();

    return this;
  }
}

export default VerticalLayout;
