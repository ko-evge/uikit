/**
 * UIKit - Base Class
 * Foundation for all components
 */

export class Base {
  constructor() {
    this.element = null;
    this.parent = null;
    this.children = [];
    this.handlers = {};
    this.properties = {};
    this.id = this.generateId();
  }

  /**
   * Generate unique ID
   */
  generateId() {
    return `ui_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Create DOM element
   */
  createElement(tag = 'div', className = '') {
    this.element = document.createElement(tag);
    this.element.id = this.id;
    if (className) this.element.className = className;
    return this.element;
  }

  /**
   * Set property (state)
   */
  setProperty(name, value) {
    this.properties[name] = value;
    this.onPropertyChanged(name, value);
    return this;
  }

  /**
   * Get property
   */
  getProperty(name, defaultValue = null) {
    return this.properties[name] !== undefined ? this.properties[name] : defaultValue;
  }

  /**
   * Set CSS style
   */
  setStyle(name, value) {
    if (this.element) {
      // Convert camelCase to kebab-case
      const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.element.style.setProperty(cssName, value);
    }
    return this;
  }

  /**
   * Get CSS style
   */
  getStyle(name) {
    if (this.element) {
      return this.element.style.getPropertyValue(name);
    }
    return null;
  }

  /**
   * Add CSS class
   */
  addClass(className) {
    if (this.element) {
      this.element.classList.add(className);
    }
    return this;
  }

  /**
   * Remove CSS class
   */
  removeClass(className) {
    if (this.element) {
      this.element.classList.remove(className);
    }
    return this;
  }

  /**
   * Toggle CSS class
   */
  toggleClass(className) {
    if (this.element) {
      this.element.classList.toggle(className);
    }
    return this;
  }

  /**
   * Set attribute
   */
  setAttribute(name, value) {
    if (this.element) {
      if (value === null || value === undefined) {
        this.element.removeAttribute(name);
      } else {
        this.element.setAttribute(name, value);
      }
    }
    return this;
  }

  /**
   * Get attribute
   */
  getAttribute(name) {
    if (this.element) {
      return this.element.getAttribute(name);
    }
    return null;
  }

  /**
   * Bind event listener
   */
  on(eventName, handler) {
    if (this.element) {
      this.handlers[eventName] = handler;
      this.element.addEventListener(eventName, (event) => {
        handler.call(this, event);
      });
    }
    return this;
  }

  /**
   * Unbind event listener
   */
  off(eventName) {
    if (this.handlers[eventName]) {
      delete this.handlers[eventName];
    }
    return this;
  }

  /**
   * Emit custom event
   */
  emit(eventName, data = {}) {
    const event = new CustomEvent(eventName, { detail: data, bubbles: true });
    if (this.element) {
      this.element.dispatchEvent(event);
    }
    return this;
  }

  /**
   * Enable automatic mouse events for component
   * Emits: click, doubleclick, mouseover, mouseout, mousedown, mouseup
   */
  enableMouseEvents() {
    if (!this.element) return this;

    const eventMap = {
      'click': 'click',
      'dblclick': 'doubleclick',
      'mouseover': 'mouseover',
      'mouseout': 'mouseout',
      'mousedown': 'mousedown',
      'mouseup': 'mouseup'
    };

    Object.entries(eventMap).forEach(([domEvent, customEvent]) => {
      this.element.addEventListener(domEvent, (e) => {
        this.emit(customEvent, { event: e });
      });
    });

    return this;
  }

  /**
   * Show element
   */
  show() {
    if (this.element) {
      this.element.style.display = '';
    }
    return this;
  }

  /**
   * Hide element
   */
  hide() {
    if (this.element) {
      this.element.style.display = 'none';
    }
    return this;
  }

  /**
   * Check if visible
   */
  isVisible() {
    if (!this.element) return false;
    return this.element.style.display !== 'none';
  }

  /**
   * Append child
   */
  append(child) {
    if (!this.element) return this;

    if (child instanceof Base) {
      if (child.element) {
        this.element.appendChild(child.element);
        this.children.push(child);
        child.parent = this;
      }
    } else if (child instanceof HTMLElement) {
      this.element.appendChild(child);
    } else if (typeof child === 'string') {
      const div = document.createElement('div');
      div.innerHTML = child;
      this.element.appendChild(div);
    }

    return this;
  }

  /**
   * Remove child
   */
  remove(child) {
    if (child instanceof Base && child.element) {
      child.element.remove();
      this.children = this.children.filter(c => c !== child);
    }
    return this;
  }

  /**
   * Clear all children
   */
  clear() {
    if (this.element) {
      this.element.innerHTML = '';
      this.children = [];
    }
    return this;
  }

  /**
   * Get HTML element
   */
  getDOMElement() {
    return this.element;
  }

  /**
   * Get ID
   */
  getId() {
    return this.id;
  }

  /**
   * Called when property changes (override in subclass)
   */
  onPropertyChanged(name, value) {
    // Override in subclass
  }

  /**
   * Destroy component
   */
  destroy() {
    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.children = [];
    this.handlers = {};
  }
}

export default Base;
