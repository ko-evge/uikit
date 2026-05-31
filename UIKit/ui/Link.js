/**
 * UIKit - Link Component
 * Styled hyperlink
 */

import { Base } from '../core/Base.js';

export class Link extends Base {
  constructor(text = '', href = '#') {
    super();
    this.createElement('a', 'ui-link');
    this.enableMouseEvents(); // Enable all mouse events

    this.element.href = href;
    this.element.textContent = text;

    this.setProperty('text', text);
    this.setProperty('href', href);
    this.setProperty('target', null);
    this.setProperty('disabled', false);
  }

  /**
   * Set link text
   */
  setText(text) {
    this.setProperty('text', text);
    this.element.textContent = text;
    return this;
  }

  /**
   * Set link href
   */
  setHref(href) {
    this.setProperty('href', href);
    this.element.href = href;
    return this;
  }

  /**
   * Set target (blank, self, parent, top)
   */
  setTarget(target) {
    this.setProperty('target', target);
    if (target) {
      this.element.target = target;
    } else {
      this.element.removeAttribute('target');
    }
    return this;
  }

  /**
   * Open in new window
   */
  openInNewWindow() {
    return this.setTarget('_blank');
  }

  /**
   * Set disabled (grayed out, not clickable)
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (disabled) {
      this.addClass('ui-link-disabled');
      this.element.style.pointerEvents = 'none';
      this.element.style.opacity = '0.5';
    } else {
      this.removeClass('ui-link-disabled');
      this.element.style.pointerEvents = 'auto';
      this.element.style.opacity = '1';
    }
    return this;
  }

  /**
   * Get link href
   */
  getHref() {
    return this.element.href;
  }

  /**
   * Get link text
   */
  getText() {
    return this.element.textContent;
  }
}

export default Link;
