/**
 * UIKit - Dialog Component
 * Modal dialog for confirmations, alerts, forms
 */

import { Base } from '../core/Base.js';
import { Button } from './Button.js';

export class Dialog extends Base {
  constructor(title = '', content = '') {
    super();
    this.createElement('div', 'ui-dialog-wrapper');

    this.setProperty('title', title);
    this.setProperty('content', content);
    this.setProperty('visible', false);
    this.setProperty('size', 'medium'); // small, medium, large
    this.setProperty('closable', true);

    this.dialog = null;
    this.overlay = null;
    this.titleElement = null;
    this.contentElement = null;
    this.footer = null;
  }

  /**
   * Set dialog title
   */
  setTitle(title) {
    this.setProperty('title', title);
    if (this.titleElement) {
      this.titleElement.textContent = title;
    }
    return this;
  }

  /**
   * Set dialog content
   */
  setContent(content) {
    this.setProperty('content', content);
    if (this.contentElement) {
      this.contentElement.innerHTML = '';

      if (content instanceof Base) {
        this.contentElement.appendChild(content.getDOMElement());
      } else if (content instanceof HTMLElement) {
        this.contentElement.appendChild(content);
      } else if (typeof content === 'string') {
        this.contentElement.innerHTML = content;
      }
    }
    return this;
  }

  /**
   * Append to content
   */
  appendContent(child) {
    if (!this.contentElement) return this;

    if (child instanceof Base) {
      this.contentElement.appendChild(child.getDOMElement());
    } else if (child instanceof HTMLElement) {
      this.contentElement.appendChild(child);
    }

    return this;
  }

  /**
   * Get footer element for buttons
   */
  getFooter() {
    return this.footer;
  }

  /**
   * Set dialog size
   */
  setSize(size) {
    this.setProperty('size', size); // small, medium, large
    if (this.dialog) {
      this.dialog.className = `ui-dialog ui-dialog-${size}`;
    }
    return this;
  }

  /**
   * Make closable
   */
  setClosable(closable) {
    this.setProperty('closable', closable);
    return this;
  }

  /**
   * Show dialog
   */
  show() {
    this.setProperty('visible', true);
    this.render();

    if (this.overlay) {
      this.overlay.style.display = 'flex';
    }

    // Focus first input if exists
    const firstInput = this.contentElement?.querySelector('input, textarea');
    if (firstInput) {
      setTimeout(() => firstInput.focus(), 100);
    }

    return this;
  }

  /**
   * Hide dialog
   */
  hide() {
    this.setProperty('visible', false);
    if (this.overlay) {
      this.overlay.style.display = 'none';
    }
    this.emit('close');
    return this;
  }

  /**
   * Close dialog
   */
  close() {
    this.hide();
    return this;
  }

  /**
   * Render dialog
   */
  render() {
    if (!this.element) return;

    this.element.innerHTML = '';

    const title = this.getProperty('title', '');
    const size = this.getProperty('size', 'medium');
    const closable = this.getProperty('closable', true);

    // Overlay (backdrop)
    this.overlay = document.createElement('div');
    this.overlay.className = 'ui-dialog-overlay';
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay && closable) {
        this.close();
      }
    });

    // Dialog container
    this.dialog = document.createElement('div');
    this.dialog.className = `ui-dialog ui-dialog-${size}`;

    // Header
    const header = document.createElement('div');
    header.className = 'ui-dialog-header';

    this.titleElement = document.createElement('h2');
    this.titleElement.className = 'ui-dialog-title';
    this.titleElement.textContent = title;
    header.appendChild(this.titleElement);

    if (closable) {
      const closeBtn = document.createElement('button');
      closeBtn.className = 'ui-dialog-close';
      closeBtn.textContent = '✕';
      closeBtn.addEventListener('click', () => this.close());
      header.appendChild(closeBtn);
    }

    this.dialog.appendChild(header);

    // Content
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'ui-dialog-content';

    const content = this.getProperty('content', '');
    if (content) {
      if (content instanceof Base) {
        this.contentElement.appendChild(content.getDOMElement());
      } else if (content instanceof HTMLElement) {
        this.contentElement.appendChild(content);
      } else if (typeof content === 'string') {
        this.contentElement.innerHTML = content;
      }
    }

    this.dialog.appendChild(this.contentElement);

    // Footer
    this.footer = document.createElement('div');
    this.footer.className = 'ui-dialog-footer';
    this.dialog.appendChild(this.footer);

    // Add to overlay
    this.overlay.appendChild(this.dialog);
    this.element.appendChild(this.overlay);

    return this;
  }

  /**
   * Show confirmation dialog
   * @static
   * @example Dialog.confirm('Delete?', () => { console.log('deleted'); })
   */
  static confirm(title, onConfirm, onCancel) {
    const dialog = new Dialog(title);
    dialog.setSize('small');

    const okBtn = new Button('OK', () => {
      if (onConfirm) onConfirm();
      dialog.close();
    });
    okBtn.setType('primary');

    const cancelBtn = new Button('Cancel', () => {
      if (onCancel) onCancel();
      dialog.close();
    });

    dialog.getFooter().appendChild(okBtn.getDOMElement());
    dialog.getFooter().appendChild(cancelBtn.getDOMElement());

    document.body.appendChild(dialog.getDOMElement());
    dialog.show();

    return dialog;
  }

  /**
   * Show alert dialog
   * @static
   */
  static alert(title, message) {
    const dialog = new Dialog(title, message);
    dialog.setSize('small');

    const okBtn = new Button('OK', () => {
      dialog.close();
    });
    okBtn.setType('primary');

    dialog.getFooter().appendChild(okBtn.getDOMElement());

    document.body.appendChild(dialog.getDOMElement());
    dialog.show();

    return dialog;
  }

}

export default Dialog;
