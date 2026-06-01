/**
 * UIKit - Panel Component
 * Container with header, content, and footer
 */

import { Base } from '../core/Base.js';

export class Panel extends Base {
  constructor(title = '') {
    super();
    this.createElement('div', 'ui-panel');

    this.setProperty('title', title);
    this.setProperty('collapsible', false);
    this.setProperty('collapsed', false);

    this.header = null;
    this.content = null;
    this.footer = null;

    this.render();
  }

  /**
   * Set panel title
   */
  setTitle(title) {
    this.setProperty('title', title);
    this.render();
    return this;
  }

  /**
   * Get panel title
   */
  getTitle() {
    return this.getProperty('title', '');
  }

  /**
   * Make panel collapsible
   */
  setCollapsible(collapsible) {
    this.setProperty('collapsible', collapsible);
    this.render();
    return this;
  }

  /**
   * Collapse/expand panel
   */
  setCollapsed(collapsed) {
    this.setProperty('collapsed', collapsed);
    if (this.content) {
      this.content.style.display = collapsed ? 'none' : 'block';
    }
    return this;
  }

  /**
   * Toggle collapsed state
   */
  toggleCollapsed() {
    const collapsed = this.getProperty('collapsed', false);
    this.setCollapsed(!collapsed);
    return this;
  }

  /**
   * Get panel content element
   */
  getContent() {
    return this.content;
  }

  /**
   * Set panel content
   */
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

  /**
   * Append to content
   */
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

  /**
   * Clear content
   */
  clearContent() {
    if (this.content) {
      this.content.innerHTML = '';
    }
    return this;
  }

  /**
   * Get footer element
   */
  getFooter() {
    return this.footer;
  }

  /**
   * Set footer content
   */
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

  /**
   * Render panel
   */
  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';

    const title = this.getProperty('title', '');
    const collapsible = this.getProperty('collapsible', false);
    const collapsed = this.getProperty('collapsed', false);

    // Header
    if (title || collapsible) {
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

      this.element.appendChild(headerDiv);
    }

    // Content
    const contentDiv = document.createElement('div');
    contentDiv.className = 'ui-panel-content';
    if (collapsed) {
      contentDiv.style.display = 'none';
    }
    this.content = contentDiv;
    this.element.appendChild(contentDiv);

    // Footer
    const footerDiv = document.createElement('div');
    footerDiv.className = 'ui-panel-footer';
    this.footer = footerDiv;
    this.element.appendChild(footerDiv);

    return this;
  }
}

export default Panel;
