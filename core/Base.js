/**
 * UIKit — Base Class
 *
 * Фундамент всех компонентов. Три ключевых решения:
 *
 * 1. Двухуровневая система событий (DOM_EVENTS + emit/on):
 *    Нативные события (click, input...) перекидываются в внутренний реестр
 *    через _domBound — один раз на тип, чтобы не плодить дублирующих
 *    addEventListener. Кастомные события (change, rowselect, celledit...)
 *    доставляются напрямую через _dispatch, минуя DOM-шину полностью.
 *    Это исключает коллизии имён и рекурсию.
 *
 * 2. beginUpdate / endUpdate батчинг:
 *    Компонент может вызывать render() десятки раз при массовом обновлении
 *    данных (например, setRows + addFilter + setSortColumn). Без батчинга —
 *    перерисовка на каждый вызов. С батчингом — одна перерисовка в конце.
 *
 * 3. _trackedListeners для teardown:
 *    Компоненты вешают слушатели на document/window (Combo — клик снаружи,
 *    Grid — скролл). Без отслеживания они остаются жить после destroy()
 *    и вызывают ошибки на уже удалённых DOM-элементах.
 */

// Нативные DOM-события, которые on() превращает во внутренние.
// Кастомные emit-события здесь не перечислены намеренно — иначе
// on('change') дважды навешивало бы обработчик (нативный + кастомный).
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
    this._domBound = {};         // eventName -> true, гарантирует однократную привязку нативного перекидчика
    this._trackedListeners = []; // для destroy(): {target, type, handler, options}
    this._updateDepth = 0;       // счётчик вложенности begin/endUpdate
    this._renderPending = false; // render был запрошен внутри батча — выполнить при закрытии
    this._destroyed = false;     // флаг: prevent double-destroy и use-after-destroy
  }

  generateId() {
    // Date.now() + random гарантирует уникальность без счётчика —
    // компоненты создаются асинхронно и счётчик мог бы сбрасываться при reload модуля
    return `ui_${Date.now()}_${Math.random().toString(36).slice(2, 11)}`;
  }

  createElement(tag = 'div', className = '') {
    this.element = document.createElement(tag);
    this.element.id = this.id;
    if (className) this.element.className = className;
    return this.element;
  }

  // setProperty/getProperty — единое хранилище состояния.
  // Не используем прямые поля класса, чтобы onPropertyChanged мог
  // перехватывать любые изменения в одном месте (аналог ActiveWidgets).
  setProperty(name, value) {
    this.properties[name] = value;
    this.onPropertyChanged(name, value);
    return this;
  }

  getProperty(name, defaultValue = null) {
    return this.properties[name] !== undefined ? this.properties[name] : defaultValue;
  }

  setStyle(name, value) {
    if (this.element) {
      // camelCase -> kebab-case, чтобы работал setStyle('backgroundColor', ...)
      const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
      this.element.style.setProperty(cssName, value);
    }
    return this;
  }

  getStyle(name) {
    if (this.element) {
      // Та же нормализация camelCase → kebab-case, что и в setStyle:
      // getStyle('backgroundColor') должен находить то, что записал setStyle
      const cssName = name.replace(/([A-Z])/g, '-$1').toLowerCase();
      return this.element.style.getPropertyValue(cssName);
    }
    return null;
  }

  addClass(className) {
    if (this.element) this.element.classList.add(className);
    return this;
  }

  removeClass(className) {
    if (this.element) this.element.classList.remove(className);
    return this;
  }

  toggleClass(className) {
    if (this.element) this.element.classList.toggle(className);
    return this;
  }

  setAttribute(name, value) {
    if (this.element) {
      // null/undefined убирает атрибут — это нужно для aria-атрибутов
      if (value === null || value === undefined) {
        this.element.removeAttribute(name);
      } else {
        this.element.setAttribute(name, value);
      }
    }
    return this;
  }

  getAttribute(name) {
    return this.element ? this.element.getAttribute(name) : null;
  }

  /**
   * Подписка на событие.
   *
   * Принцип: один метод для нативных DOM-событий и кастомных.
   * Нативные события перекидываются в _listeners один раз (_domBound).
   * Кастомные события доставляет emit() напрямую — DOM-шину не трогает.
   * Это важно: если бы emit('click') шёл через DOM, он бы всплывал вверх
   * по дереву и ломал изоляцию компонентов.
   */
  on(eventName, handler) {
    if (!this._listeners[eventName]) {
      this._listeners[eventName] = [];
    }
    this._listeners[eventName].push(handler);
    this.handlers[eventName] = handler; // обратная совместимость: последний хендлер по ключу

    // Нативный перекидчик ставим только один раз на тип события
    if (this.element && !this._domBound[eventName] && DOM_EVENTS.has(eventName)) {
      this._domBound[eventName] = true;
      this.element.addEventListener(eventName, (event) => {
        this._dispatch(eventName, event);
      });
    }
    return this;
  }

  // off без handler убирает все слушатели — используется при уничтожении вкладки/диалога
  off(eventName, handler = null) {
    if (handler && this._listeners[eventName]) {
      this._listeners[eventName] = this._listeners[eventName].filter(h => h !== handler);
    } else {
      delete this._listeners[eventName];
    }
    delete this.handlers[eventName];
    return this;
  }

  // emit не идёт в DOM — только внутренний pub/sub
  emit(eventName, data = {}) {
    return this._dispatch(eventName, data);
  }

  /**
   * Вызывает всех подписчиков события.
   *
   * Изоляция ошибок: каждый хендлер в try/catch → handle().
   * Один сломанный хендлер не останавливает остальных.
   * Паттерн из ActiveWidgets, где каждый accessor оборачивался в try/catch.
   *
   * handlers.slice() — копия массива, чтобы off() внутри хендлера
   * не нарушал текущую итерацию.
   */
  _dispatch(eventName, payload) {
    const handlers = this._listeners[eventName];
    if (handlers) {
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

  // Центральный обработчик ошибок — override для своего логирования
  handle(error, context = '') {
    console.error(`[UIKit] error in "${context}" handler:`, error);
    return this;
  }

  /**
   * Навешивает DOM-слушатель на произвольный target (document, window, внутренние узлы)
   * и запоминает его в _trackedListeners для автоматического снятия в destroy().
   *
   * Почему не addEventListener напрямую: компонент живёт внутри страницы,
   * но может быть закрыт/перестроен. Слушатели на document без отслеживания
   * приводят к "zombie" — callback работает на несуществующем элементе.
   */
  _listen(target, type, handler, options) {
    if (!target || this._destroyed) return this;
    target.addEventListener(type, handler, options);
    this._trackedListeners.push({ target, type, handler, options });
    return this;
  }

  // Батчинг: beginUpdate/endUpdate позволяют сделать N изменений состояния
  // и получить только одну перерисовку вместо N.
  // Вызовы вложены безопасно — _updateDepth считает глубину.
  beginUpdate() {
    this._updateDepth++;
    return this;
  }

  endUpdate() {
    if (this._updateDepth > 0) this._updateDepth--;
    if (this._updateDepth === 0 && this._renderPending) {
      this._renderPending = false;
      if (typeof this.render === 'function') this.render();
    }
    return this;
  }

  // Вызывается в начале render(): если активен батч — пропускаем рендер
  // и ставим флаг, чтобы endUpdate() выполнил его позже
  _renderSuspended() {
    if (this._updateDepth > 0) {
      this._renderPending = true;
      return true;
    }
    return false;
  }

  isDestroyed() {
    return this._destroyed;
  }

  // Оставлен для обратной совместимости — раньше нативные события требовали
  // явного включения. Теперь on() делает это автоматически.
  enableMouseEvents() {
    return this;
  }

  show() {
    if (this.element) this.element.style.display = '';
    return this;
  }

  hide() {
    if (this.element) this.element.style.display = 'none';
    return this;
  }

  isVisible() {
    if (!this.element) return false;
    return this.element.style.display !== 'none';
  }

  // append принимает Base-компонент, HTMLElement или строку HTML —
  // чтобы не заставлять caller думать о .element
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

  remove(child) {
    if (child instanceof Base && child.element) {
      child.element.remove();
      this.children = this.children.filter(c => c !== child);
    }
    return this;
  }

  clear() {
    if (this.element) {
      this.element.innerHTML = '';
      this.children = [];
    }
    return this;
  }

  getDOMElement() {
    return this.element;
  }

  getId() {
    return this.id;
  }

  // Хук для подклассов — переопределяется там, где смена свойства
  // должна автоматически перерисовывать часть UI (например, Label.text)
  onPropertyChanged(name, value) {}

  /**
   * Уничтожает компонент и освобождает все ресурсы.
   *
   * Порядок важен:
   * 1. _trackedListeners — снимаем с document/window до того как элемент исчезнет
   * 2. children — рекурсивно, чтобы каждый дочерний тоже снял свои слушатели
   * 3. element.remove() — последним, чтобы дочерние ещё могли обратиться к DOM
   *
   * Идемпотентен: повторный вызов не делает ничего (_destroyed флаг).
   */
  destroy() {
    if (this._destroyed) return this;
    this._destroyed = true;

    this._trackedListeners.forEach(({ target, type, handler, options }) => {
      try { target.removeEventListener(type, handler, options); } catch (e) {}
    });
    this._trackedListeners = [];

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
