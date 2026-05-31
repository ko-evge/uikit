/**
 * UIKit - Button Component
 */

import { Base } from '../core/Base.js';

export class Button extends Base {
  constructor(text = '', onClick = null) {
    super();
    this.createElement('button', 'ui-button');
    this.setText(text);
    this.enableMouseEvents(); // Enable all mouse events

    if (onClick) {
      this.on('click', onClick);
    }
  }

  /**
   * Set button text
   */
  setText(text) {
    this.setProperty('text', text);
    if (this.element) {
      this.element.textContent = text;
    }
    return this;
  }

  /**
   * Get button text
   */
  getText() {
    return this.getProperty('text', '');
  }

  /**
   * Set button disabled state
   */
  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    if (this.element) {
      this.element.disabled = disabled;
    }
    return this;
  }

  /**
   * Get disabled state
   */
  isDisabled() {
    return this.getProperty('disabled', false);
  }

  /**
   * Set button type (primary, default, danger, success, warning)
   */
  setType(type) {
    this.setProperty('type', type);
    this.removeClass('ui-button-primary');
    this.removeClass('ui-button-danger');
    this.removeClass('ui-button-success');
    this.removeClass('ui-button-warning');

    if (type && type !== 'default') {
      this.addClass(`ui-button-${type}`);
    }
    return this;
  }

  /**
   * Get button type
   */
  getType() {
    return this.getProperty('type', 'default');
  }

  /**
   * Set button size (small, medium, large)
   */
  setSize(size) {
    this.setProperty('size', size);
    this.removeClass('ui-button-small');
    this.removeClass('ui-button-large');

    if (size && size !== 'medium') {
      this.addClass(`ui-button-${size}`);
    }
    return this;
  }

  /**
   * Trigger click event programmatically
   */
  click() {
    if (this.element) {
      this.element.click();
    }
    return this;
  }
}

export default Button;
