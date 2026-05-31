/**
 * UIKit - Label Component
 */

import { Base } from '../core/Base.js';

export class Label extends Base {
  constructor(text = '') {
    super();
    this.createElement('label', 'ui-label');
    this.setText(text);
  }

  /**
   * Set label text
   */
  setText(text) {
    this.setProperty('text', text);
    if (this.element) {
      this.element.textContent = text;
    }
    return this;
  }

  /**
   * Get label text
   */
  getText() {
    return this.getProperty('text', '');
  }

  /**
   * Set label for (associate with input)
   */
  setFor(id) {
    this.setProperty('for', id);
    if (this.element) {
      this.element.htmlFor = id;
    }
    return this;
  }

  /**
   * Get label for
   */
  getFor() {
    return this.getProperty('for', '');
  }
}

export default Label;
