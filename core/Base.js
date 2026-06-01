/**
 * UIKit - Base Class
 * Foundation for all components
 */

/**
 * Native DOM interaction events that `on()` bridges into the internal
 * listener registry. Custom emitted events (change, rowselect, ...) are
 * NOT in this set, so they never attach a native forwarder and never
 * collide with native events of the same name.
 */
const DOM_EVENTS = new Set([
  'click', 'dblclick', 'mousedown', 'mouseup', 'mouseover', 'mouseout',
  'mouseenter', 'mouseleave', 'mousemove', 'contextmenu', 'wheel',
  'keydown', 'keyup', 'keypress', 'input', 'focus', 'blur', 'submit', 'scroll'
]);

export class Base {
  constructor() {
    this.element = null;
    this.parent = null;
    this.children = [];
    this.handlers = {};
    this.properties = {};
    this.id = this.generateId();
    this._listeners = {};        // eventName -> [handler, ...]
    this._domBound = {};         // eventName -> true once a native forwarder is attached
    this._trackedListeners = []; // {target, type, handler, options} for clean teardown
    this._updateDepth = 0;       // >0 while inside a begin/endUpdate batch
    this._renderPending = false; // a render was requested while batching
    this._destroyed = false;     // true after destroy()
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
   * Subscribe to an event.
   *
   * Works for both native DOM interaction events (click, input, blur, ...)
   * and custom events emitted via emit(). Native events are bridged once
   * into the internal registry; custom events are delivered directly by
   * emit() without touching the DOM event bus (so no recursion / collision).
   */
  on(eventName, handler) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push(handler);
    this.handlers[eventName] = handler; // backward-compat: last handler

    // Bridge a native DOM event into the registry exactly once.
    if (this.element && !this._domBound[eventName] && DOM_EVENTS.has(eventName)) {
      this._domBound[eventName] = true;
      this.element.addEventListener(eventName, (event) => {
        this._dispatch(eventName, event);
      });
    }
    return this;
  }

  /**
   * Unsubscribe. Without handler, removes all listeners for the event.
   */
  off(eventName, handler = null) {
    if (handler && this._listeners[eventName]) {
      this._listeners[eventName] = this._listeners[eventName].filter(h => h !== handler);
    } else {
      delete this._listeners[eventName];
    }
    delete this.handlers[eventName];
    return this;
  }

  /**
   * Emit an event to registered listeners (internal pub/sub, no DOM dispatch).
   */
  emit(eventName, data = {}) {
    return this._dispatch(eventName, data);
  }

  /**
   * Invoke all registered listeners for an event.
   *
   * Each handler is isolated: a listener that throws is routed to handle()
   * and does NOT prevent the remaining listeners from running or corrupt the
   * component's internal event flow. (Inspired by ActiveWidgets, which wraps
   * property access in try/catch -> this.handle(error).)
   */
  _dispatch(eventName, payload) {
    const handlers = this._listeners[eventName];
    if (handlers) {
      // copy so a handler that calls off() doesn't disturb iteration
      handlers.slice().forEach(h => {
        try {
          h.call(this, payload);
        } catch (error) {
          this.handle(error, eventName);
        }
      });
    }
    return this;
  }

  /**
   * Central error handler. Override to add logging/diagnostics.
   * Default: report without breaking the component.
   */
  handle(error, context = '') {
    console.error(`[UIKit] error in "${context}" handler:`, error);
    return this;
  }

  /**
   * Attach a DOM listener to an arbitrary target (document, window, inner
   * nodes) and track it so destroy() can remove it. Prevents "zombie"
   * global listeners from firing after the component is gone.
   */
  _listen(target, type, handler, options) {
    if (!target || this._destroyed) return this;
    target.addEventListener(type, handler, options);
    this._trackedListeners.push({ target, type, handler, options });
    return this;
  }

  /**
   * Begin a batch of updates. Renders are suspended until the matching
   * endUpdate(), then performed once. Calls nest safely.
   */
  beginUpdate() {
    this._updateDepth++;
    return this;
  }

  /**
   * End a batch. When the outermost batch closes, runs a single render()
   * if any render was requested while suspended.
   */
  endUpdate() {
    if (this._updateDepth > 0) {
      this._updateDepth--;
    }
    if (this._updateDepth === 0 && this._renderPending) {
      this._renderPending = false;
      if (typeof this.render === 'function') {
        this.render();
      }
    }
    return this;
  }

  /**
   * Render methods call this first: if a batch is active, the render is
   * deferred (returns true) instead of running now.
   *   render() { if (this._renderSuspended()) return this; ... }
   */
  _renderSuspended() {
    if (this._updateDepth > 0) {
      this._renderPending = true;
      return true;
    }
    return false;
  }

  /**
   * True once destroy() has run. Guards public methods against use-after-destroy.
   */
  isDestroyed() {
    return this._destroyed;
  }

  /**
   * Deprecated no-op. Native mouse events are bridged automatically by on().
   * Kept for backward compatibility.
   */
  enableMouseEvents() {
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
   * Destroy component: remove every tracked DOM listener, detach the element,
   * and clear internal state. Idempotent and safe to call once.
   */
  destroy() {
    if (this._destroyed) return this;
    this._destroyed = true;

    // Remove all tracked global/inner listeners so nothing fires post-destroy
    this._trackedListeners.forEach(({ target, type, handler, options }) => {
      try { target.removeEventListener(type, handler, options); } catch (e) { /* ignore */ }
    });
    this._trackedListeners = [];

    // Destroy child components recursively
    this.children.forEach(child => {
      if (child && typeof child.destroy === 'function') child.destroy();
    });

    if (this.element && this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
    this.element = null;
    this.children = [];
    this.handlers = {};
    this._listeners = {};
    this._domBound = {};
    return this;
  }
}

export default Base;
