/**
 * UIKit — Panel Component
 *
 * Универсальный контейнер с header/content/footer-зонами.
 *
 * render() пересоздаёт весь DOM панели при вызове — это намеренно:
 * Panel — статичный контейнер, он не перерисовывается часто.
 * Grid и List имеют inplace-обновление, потому что рендерятся постоянно.
 *
 * alignTop/alignBottom/alignCenter — position:absolute паттерн из ActiveWidgets:
 * Три панели (top, middle, bottom) с absolute-позиционированием дают точное
 * разделение пространства без flex-хаков. Middle растягивается через
 * top/bottom offsets, а не через flex:1. Используется в VerticalLayout.
 *
 * setFillSpace(true) убирает padding из content-зоны:
 * Нужно когда содержимое — Grid или другой компонент с собственными отступами.
 * Двойной padding (Panel + компонент внутри) создавал бы лишние отступы.
 */

import { Base } from '../core/Base.js';

export class Panel extends Base {
  constructor(title = '') {
    super();
    this.createElement('div', 'ui-panel');

    this.setProperty('title', title);
    this.setProperty('collapsible', false);
    this.setProperty('collapsed', false);
    this.setProperty('fillSpace', false);

    this.header = null;
    this.content = null;
    this.footer = null;

    this.render();
  }

  setTitle(title) {
    this.setProperty('title', title);
    // Обновляем заголовок in-place, НЕ через render(): полный render() пересоздаёт
    // header/content/footer пустыми и стирает контент, добавленный setContent/
    // appendContent/setFooter до setTitle. Раньше порядок вызовов был критичен.
    const titleSpan = this.header && this.header.querySelector('.ui-panel-title');
    if (titleSpan) {
      titleSpan.textContent = title;
    } else {
      // Заголовка ещё нет в DOM (панель создана без title) — нужен один render(),
      // пока content/footer заведомо пусты (вызов сразу после конструктора)
      this.render();
    }
    return this;
  }

  getTitle() {
    return this.getProperty('title', '');
  }

  setCollapsible(collapsible) {
    this.setProperty('collapsible', collapsible);
    // collapsible меняется только до наполнения контентом — но если контент уже
    // есть, сохраним его: render() ниже допустим лишь когда content пуст.
    if (this.content && this.content.childNodes.length > 0) {
      console.warn('Panel.setCollapsible after content added — call before setContent');
    }
    this.render();
    return this;
  }

  setCollapsed(collapsed) {
    this.setProperty('collapsed', collapsed);
    // Скрываем только content — header остаётся виден для возможности раскрытия
    if (this.content) this.content.style.display = collapsed ? 'none' : 'block';
    return this;
  }

  toggleCollapsed() {
    return this.setCollapsed(!this.getProperty('collapsed', false));
  }

  // fillSpace: убираем padding когда внутри компонент с собственными отступами (Grid, List)
  setFillSpace(fill = true) {
    this.setProperty('fillSpace', fill);
    if (this.content) {
      this.content.style.padding = fill ? '0' : '';
      this.content.style.margin = fill ? '0' : '';
    }
    return this;
  }

  getHeader() { return this.header; }
  getContent() { return this.content; }

  setContent(content) {
    if (!this.content) return this;
    this.content.innerHTML = '';
    if (content instanceof Base) {
      this.content.appendChild(content.getDOMElement());
    } else if (content instanceof HTMLElement) {
      this.content.appendChild(content);
    } else if (typeof content === 'string') {
      this.content.innerHTML = content;
    }
    return this;
  }

  appendContent(child) {
    if (!this.content) return this;
    if (child instanceof Base) {
      this.content.appendChild(child.getDOMElement());
    } else if (child instanceof HTMLElement) {
      this.content.appendChild(child);
    } else if (typeof child === 'string') {
      const div = document.createElement('div');
      div.innerHTML = child;
      this.content.appendChild(div);
    }
    return this;
  }

  clearContent() {
    if (this.content) this.content.innerHTML = '';
    return this;
  }

  setHeaderContent(content) {
    // Сохраняем в свойство (как в Dialog): у панели без title header ещё не создан
    // (null), и раньше контент молча терялся. render() перечитает headerContent
    // и создаст header даже без title.
    this.setProperty('headerContent', content);
    if (this.header) {
      this._applyHeaderContent(content);
    } else {
      this.render();
    }
    return this;
  }

  _applyHeaderContent(content) {
    if (!this.header) return;
    this.header.innerHTML = '';
    if (content instanceof Base) {
      this.header.appendChild(content.getDOMElement());
    } else if (content instanceof HTMLElement) {
      this.header.appendChild(content);
    } else if (typeof content === 'string') {
      this.header.innerHTML = content;
    }
  }

  // appendToBody: добавляет элемент напрямую в панель без перерисовки.
  // Используется когда нужно вставить UI-элемент "над" content-зоной
  // (например, toolbar), не переписывая структуру панели.
  appendToBody(element) {
    if (!this.element) return this;
    if (element instanceof Base) {
      this.element.appendChild(element.getDOMElement());
    } else if (element instanceof HTMLElement) {
      this.element.appendChild(element);
    }
    return this;
  }

  insertBeforeContent(element) {
    if (!this.element || !this.content) return this;
    if (element instanceof Base) {
      this.content.parentNode.insertBefore(element.getDOMElement(), this.content);
    } else if (element instanceof HTMLElement) {
      this.content.parentNode.insertBefore(element, this.content);
    }
    return this;
  }

  /**
   * Позиционирование в ActiveWidgets-стиле: top/bottom/center как absolute.
   * Три зоны (top, middle, bottom) собираются через VerticalLayout.
   * alignTop/alignBottom — фиксированные зоны с auto-высотой.
   * alignCenter — растягивается через left/right/top/bottom:0.
   */
  alignTop() {
    if (!this.element) return this;
    this.element.style.cssText += ';position:absolute;top:0;left:0;right:0;height:auto;width:100%;margin:0;padding:0;';
    return this;
  }

  alignBottom() {
    if (!this.element) return this;
    this.element.style.cssText += ';position:absolute;bottom:0;left:0;right:0;height:auto;width:100%;margin:0;padding:0;';
    return this;
  }

  alignCenter() {
    if (!this.element) return this;
    this.element.style.cssText += ';position:absolute;top:auto;bottom:auto;left:0;right:0;height:100%;width:100%;margin:0;padding:0;';
    return this;
  }

  getFooter() { return this.footer; }

  setFooter(footer) {
    if (!this.footer) return this;
    this.footer.innerHTML = '';
    if (footer instanceof Base) {
      this.footer.appendChild(footer.getDOMElement());
    } else if (footer instanceof HTMLElement) {
      this.footer.appendChild(footer);
    } else if (typeof footer === 'string') {
      this.footer.innerHTML = footer;
    }
    return this;
  }

  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    // width/height/flex — задаём inline, чтобы Panel работал в любом родителе
    // (flex-контейнер, absolute-позиционированный блок, диалог)
    this.element.style.cssText = 'width:100%;height:100%;display:flex;flex-direction:column;overflow:hidden;';
    this.element.innerHTML = '';

    const title = this.getProperty('title', '');
    const collapsible = this.getProperty('collapsible', false);
    const collapsed = this.getProperty('collapsed', false);
    const headerContent = this.getProperty('headerContent', null);

    if (title || collapsible || headerContent) {
      const headerDiv = document.createElement('div');
      headerDiv.className = 'ui-panel-header';

      if (collapsible) {
        const toggle = document.createElement('span');
        toggle.className = 'ui-panel-toggle';
        toggle.textContent = collapsed ? '▶' : '▼';
        toggle.style.cursor = 'pointer';
        toggle.style.marginRight = '8px';
        toggle.addEventListener('click', () => this.toggleCollapsed());
        headerDiv.appendChild(toggle);
      }

      const titleSpan = document.createElement('span');
      titleSpan.className = 'ui-panel-title';
      titleSpan.textContent = title;
      if (collapsible) {
        titleSpan.style.cursor = 'pointer';
        titleSpan.addEventListener('click', () => this.toggleCollapsed());
      }
      headerDiv.appendChild(titleSpan);

      this.header = headerDiv;
      this.element.appendChild(headerDiv);

      // Кастомный header поверх стандартного title — как в Dialog.render()
      if (headerContent) this._applyHeaderContent(headerContent);
    }

    const contentDiv = document.createElement('div');
    contentDiv.className = 'ui-panel-content';
    if (collapsed) contentDiv.style.display = 'none';
    // fillSpace перечитываем из свойства — иначе повторный render() (setTitle/
    // setCollapsible) возвращал бы padding, снятый ранее setFillSpace(true)
    if (this.getProperty('fillSpace', false)) {
      contentDiv.style.padding = '0';
      contentDiv.style.margin  = '0';
    }
    this.content = contentDiv;
    this.element.appendChild(contentDiv);

    const footerDiv = document.createElement('div');
    footerDiv.className = 'ui-panel-footer';
    this.footer = footerDiv;
    this.element.appendChild(footerDiv);

    return this;
  }
}

export default Panel;
