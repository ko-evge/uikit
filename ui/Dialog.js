/**
 * UIKit — Dialog Component
 *
 * Ключевые архитектурные решения:
 *
 * 1. Dialog._stack (статический массив):
 *    Стек открытых диалогов нужен, чтобы при закрытии вложенного диалога
 *    восстановить интерактивность предыдущего. Без стека закрытие второго
 *    диалога оставляло бы первый с pointer-events:none навсегда.
 *
 * 2. z-index: _zBase + stackLength * 10:
 *    Каждый следующий диалог выше предыдущего. Шаг 10 — запас для
 *    внутренних элементов (dropdown, tooltip внутри диалога).
 *
 * 3. setHeight работает на .ui-dialog, а не на обёртке:
 *    Backdrop (position:fixed) сидит между wrapper и .ui-dialog.
 *    Высота на wrapper не доходит до flex-контейнера, и children
 *    с height:100% (Tabs, Grid) схлопываются в 0.
 *
 * 4. closeOnBackdrop = false по умолчанию:
 *    В рабочей форме справочника пользователь часто кликает рядом с диалогом —
 *    нечаянное закрытие потеряло бы несохранённые данные.
 *
 * 5. Каскадный сдвиг (cascade offset):
 *    Каждый следующий диалог смещается на _cascadeStep px ВНИЗ (только по
 *    вертикали) относительно центра экрана через transform: translateY().
 *    Горизонталь не трогаем — иначе диалог уезжает от центра и стек выглядит
 *    несимметрично. Это позволяет пользователю видеть край предыдущего
 *    диалога и понимать, что он открыл дочернее окно, а не перешёл на новый
 *    экран. Высокие диалоги (>70% высоты экрана) сдвигать некуда без
 *    обрезания контента — для них сдвиг пропускается, они просто центрируются.
 *    transform — не margin/top/left — потому что backdrop position:fixed
 *    центрирует диалог через flexbox; translate сдвигает уже центрированный элемент.
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
    this.setProperty('size', 'medium');
    this.setProperty('closable', true);
    this.setProperty('closeOnBackdrop', false);
    this.setProperty('customWidth', null);
    this.setProperty('customHeight', null);
    this.setProperty('fillSpace', false);
    this.setProperty('debugId', null);

    this.dialog = null;
    this.overlay = null;
    this.header = null;
    this.titleElement = null;
    this.contentElement = null;
    // footer создаётся в конструкторе, а не в render() — чтобы caller мог
    // добавить кнопки до первого show() и не потерять их при повторном render()
    this.footer = document.createElement('div');
    this.footer.className = 'ui-dialog-footer';
    this.debugLabel = null;
  }

  setTitle(title) {
    this.setProperty('title', title);
    if (this.titleElement) this.titleElement.textContent = title;
    return this;
  }

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

  appendContent(child) {
    if (!this.contentElement) return this;
    if (child instanceof Base) {
      this.contentElement.appendChild(child.getDOMElement());
    } else if (child instanceof HTMLElement) {
      this.contentElement.appendChild(child);
    }
    return this;
  }

  getHeader() {
    return this.header;
  }

  setHeaderContent(content) {
    // Сохраняем в свойство — иначе вызов до show() (this.header === null) терялся бы,
    // а первый render() перестроил бы header только из title. render() перечитывает
    // headerContent и применяет его поверх стандартного заголовка.
    this.setProperty('headerContent', content);
    if (this.header) this._applyHeaderContent(content);
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

  getFooter() {
    return this.footer;
  }

  setSize(size) {
    this.setProperty('size', size);
    if (this.dialog) this.dialog.className = `ui-dialog ui-dialog-${size}`;
    return this;
  }

  setWidth(width) {
    this.setProperty('customWidth', width);
    if (this.element) {
      this.element.style.setProperty('width', width, 'important');
      this.element.style.setProperty('max-width', 'none', 'important');
    }
    if (this.dialog) {
      this.dialog.style.setProperty('width', width, 'important');
      this.dialog.style.setProperty('max-width', 'none', 'important');
    }
    return this;
  }

  setHeight(height) {
    this.setProperty('customHeight', height);
    // Применяем к .ui-dialog (flex-контейнер), а не к wrapper.
    // Backdrop (position:fixed) прерывает наследование высоты —
    // wrapper.height не доходит до .ui-dialog, поэтому flex:1 дети (Tabs, Grid)
    // получают высоту 0 и не отображаются.
    if (this.dialog) {
      this.dialog.style.setProperty('height', height, 'important');
      this.dialog.style.setProperty('max-height', height, 'important');
    }
    return this;
  }

  setClosable(closable) {
    this.setProperty('closable', closable);
    return this;
  }

  // fillSpace убирает padding из contentElement — нужно когда содержимое
  // (Grid, List) должно занять весь диалог без внутренних отступов
  setFillSpace(fill = true) {
    this.setProperty('fillSpace', fill);
    if (this.contentElement) {
      this.contentElement.style.padding = fill ? '0' : '';
      this.contentElement.style.margin = fill ? '0' : '';
    }
    return this;
  }

  setDebugId(id) {
    this.setProperty('debugId', id);
    if (this.dialog) this.updateDebugLabel();
    console.log(`📌 Dialog "${this.getProperty('title', 'Dialog')}" - Debug ID: ${id}`);
    return this;
  }

  updateDebugLabel() {
    const debugId = this.getProperty('debugId');
    if (!debugId) {
      if (this.debugLabel && this.debugLabel.parentNode) {
        this.debugLabel.parentNode.removeChild(this.debugLabel);
      }
      return;
    }
    if (!this.debugLabel) {
      this.debugLabel = document.createElement('div');
      this.debugLabel.className = 'ui-debug-id';
    }
    this.debugLabel.textContent = `ID: ${debugId}`;
    if (this.dialog && !this.debugLabel.parentNode) {
      this.dialog.appendChild(this.debugLabel);
    }
  }

  show() {
    this.setProperty('visible', true);

    // render() вызываем только один раз — overlay создаётся здесь и далее переиспользуется
    if (!this.overlay) this.render();

    if (this.dialog && this.getProperty('debugId')) this.updateDebugLabel();

    if (!this.element.parentNode) document.body.appendChild(this.element);

    // Стек: отслеживаем порядок открытых диалогов.
    // При закрытии верхнего — восстанавливаем интерактивность предыдущего.
    if (!Dialog._stack.includes(this)) Dialog._stack.push(this);

    // z-index растёт со стеком — каждый следующий диалог поверх предыдущего.
    // Шаг 10 оставляет место для внутренних z-index (dropdown внутри диалога).
    this._myZ = Dialog._zBase + Dialog._stack.length * 10;
    if (this.overlay) this.overlay.style.zIndex = this._myZ;

    if (this.element) this.element.style.display = 'flex';
    if (this.overlay) this.overlay.style.display = 'flex';

    // pointer-events:none на все диалоги кроме верхнего — визуально backdrop их
    // затемняет, но клики всё равно могли бы пройти без этой блокировки
    Dialog._stack.forEach((dlg, i) => {
      const isTop = i === Dialog._stack.length - 1;
      if (dlg.overlay) dlg.overlay.style.pointerEvents = isTop ? 'auto' : 'none';
    });

    // Блокируем меню пока открыт хотя бы один диалог
    const menuScreen = document.getElementById('menuScreen');
    if (menuScreen) {
      menuScreen.style.pointerEvents = 'none';
      menuScreen.style.opacity = '0.5';
    }

    // setTimeout(0) — ждём, пока диалог вставится в DOM и станет видимым,
    // иначе focus() на скрытый элемент игнорируется
    setTimeout(() => {
      const firstInput = this.contentElement?.querySelector('input, textarea, select');
      if (firstInput) {
        firstInput.focus();
      } else {
        const firstButton = this.footer?.querySelector('button');
        if (firstButton) firstButton.focus();
      }
    }, 0);

    // Применяем размеры после render() — до него .ui-dialog ещё не существует
    const customWidth = this.getProperty('customWidth');
    if (customWidth) {
      this.element.style.setProperty('width', customWidth, 'important');
      this.element.style.setProperty('max-width', 'none', 'important');
      if (this.dialog) {
        this.dialog.style.setProperty('width', customWidth, 'important');
        this.dialog.style.setProperty('max-width', 'none', 'important');
      }
    } else {
      if (this.dialog) this.dialog.style.setProperty('max-width', '90%', 'important');
    }

    const customHeight = this.getProperty('customHeight');
    if (customHeight && this.dialog) {
      this.dialog.style.setProperty('height', customHeight, 'important');
      this.dialog.style.setProperty('max-height', customHeight, 'important');
    }

    // Каскадный сдвиг: первый диалог по центру, каждый следующий смещается
    // ВНИЗ (не по диагонали — горизонталь остаётся симметричной относительно
    // центра экрана) на cascadeStep px, чтобы был виден край предыдущего
    // диалога и порядок читался как стек, а не смена экрана.
    // Высокий диалог (занимает большую часть экрана) сдвигать некуда без
    // обрезания контента — для него сдвиг пропускаем, просто центрируем.
    // Transform применяется ДО показа чтобы не было дёрганья (появление + сдвиг).
    const depth = Dialog._stack.indexOf(this);
    if (this.dialog) {
      const naturalHeight = this.dialog.getBoundingClientRect().height;
      const isTall = naturalHeight > window.innerHeight * 0.7;
      const shift = (depth > 0 && !isTall) ? depth * Dialog._cascadeStep : 0;
      this.dialog.style.animation = 'none';
      this.dialog.style.transform = shift ? `translateY(${shift}px)` : '';
      const maxH = Math.floor(window.innerHeight - shift * 2 - 32);
      this.dialog.style.setProperty('max-height', shift ? maxH + 'px' : '90vh', 'important');
    }

    return this;
  }

  hide() {
    this.setProperty('visible', false);
    if (this.element) this.element.style.display = 'none';
    if (this.overlay) this.overlay.style.display = 'none';
    // Сбрасываем сдвиг — при следующем открытии глубина в стеке может быть другой
    if (this.dialog) this.dialog.style.transform = '';

    // Убираем из стека и восстанавливаем состояние оставшихся
    const idx = Dialog._stack.indexOf(this);
    if (idx !== -1) Dialog._stack.splice(idx, 1);

    if (Dialog._stack.length === 0) {
      // Все диалоги закрыты — меню снова доступно
      const menuScreen = document.getElementById('menuScreen');
      if (menuScreen) {
        menuScreen.style.pointerEvents = 'auto';
        menuScreen.style.opacity = '1';
      }
    } else {
      // Возвращаем интерактивность новому верхнему диалогу
      Dialog._stack.forEach((dlg, i) => {
        const isTop = i === Dialog._stack.length - 1;
        if (dlg.overlay) dlg.overlay.style.pointerEvents = isTop ? 'auto' : 'none';
      });
    }

    this.emit('close');
    return this;
  }

  close() {
    return this.hide();
  }

  /**
   * destroy() без предварительного hide() оставлял диалог в Dialog._stack:
   * верхним считался уже уничтоженный диалог, его fkeys перехватывали клавиши,
   * а pointer-events нижних диалогов оставались заблокированными навсегда.
   */
  destroy() {
    if (this._destroyed) return this;
    if (Dialog._stack.includes(this)) this.hide(); // снимает из стека + восстанавливает pointer-events/меню
    return super.destroy();
  }

  render() {
    if (!this.element) return;

    this.element.innerHTML = '';

    const title = this.getProperty('title', '');
    const size = this.getProperty('size', 'medium');
    const closable = this.getProperty('closable', true);

    // Overlay — полноэкранный backdrop. Клик по нему закрывает диалог
    // только если closeOnBackdrop=true (по умолчанию false — защита от потери данных)
    this.overlay = document.createElement('div');
    this.overlay.className = 'ui-dialog-backdrop';
    const closeOnBackdrop = this.getProperty('closeOnBackdrop', false);
    this.overlay.addEventListener('click', (e) => {
      if (e.target === this.overlay && closable && closeOnBackdrop) this.close();
    });

    this.dialog = document.createElement('div');
    this.dialog.className = `ui-dialog ui-dialog-${size}`;

    // Header
    const header = document.createElement('div');
    header.className = 'ui-dialog-header';

    this.titleElement = document.createElement('div');
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

    this.header = header;
    this.dialog.appendChild(header);

    // Кастомный header, заданный setHeaderContent() до show() — применяем поверх
    // стандартного title (иначе он терялся: header был null на момент вызова)
    const headerContent = this.getProperty('headerContent', null);
    if (headerContent) this._applyHeaderContent(headerContent);

    // Content — flex:1 заполняет пространство между header и footer.
    // Важно: НЕ ставить max-height здесь — это была причина пробела снизу
    // (dialog=90vh, content ограничен 70vh → 20vh пустого места).
    this.contentElement = document.createElement('div');
    this.contentElement.className = 'ui-dialog-content';
    // fillSpace перечитываем из свойства — setFillSpace() мог быть вызван до show()
    // (когда contentElement ещё null), иначе padding не снимался бы при первом render()
    if (this.getProperty('fillSpace', false)) {
      this.contentElement.style.padding = '0';
      this.contentElement.style.margin  = '0';
    }

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

    // footer создан в конструкторе — переиспользуем, не пересоздаём,
    // чтобы не потерять кнопки, добавленные до show()
    this.dialog.appendChild(this.footer);

    this.overlay.appendChild(this.dialog);
    this.element.appendChild(this.overlay);

    return this;
  }

  // fkeys: { 'F2': fn, 'F3': fn, 'Escape': fn, ... }
  // Обработчик срабатывает только когда этот диалог — верхний в Dialog._stack.
  // Регистрировать/снимать не нужно — hide() уже убирает из _stack.
  setFKeys(fkeys) {
    this.setProperty('fkeys', fkeys);
    Dialog._initKeyListener();
    return this;
  }

  // Инициализирует глобальный F-key listener один раз (флаг Dialog._keyListenerReady)
  static _initKeyListener() {
    if (Dialog._keyListenerReady) return;
    Dialog._keyListenerReady = true;
    const HANDLED = new Set([
      'F1','F2','F3','F4','F5','F6','F7','F8','F9','F10','F11','F12',
      'Escape','Insert','Delete','Enter',
    ]);
    document.addEventListener('keydown', (e) => {
      if (!HANDLED.has(e.key)) return;
      // Enter в textarea/contentEditable — это перевод строки, не команда диалога.
      // Enter в обычном input НЕ исключаем: паттерн "ввёл количество → Enter →
      // сохранить" используется во всех Qty-диалогах.
      if (e.key === 'Enter' &&
          (e.target?.tagName === 'TEXTAREA' || e.target?.isContentEditable)) return;
      const top = Dialog._stack[Dialog._stack.length - 1];
      if (!top) return;
      const fkeys = top.getProperty('fkeys');
      if (!fkeys || !fkeys[e.key]) return;
      e.preventDefault();
      e.stopImmediatePropagation();
      fkeys[e.key]();
    }, true);
  }

  // Статические хелперы для быстрых диалогов подтверждения/алерта
  static confirm(title, onConfirm, onCancel) {
    const dialog = new Dialog(title);
    dialog.setSize('small');

    const okBtn = new Button('OK', () => { if (onConfirm) onConfirm(); dialog.close(); });
    okBtn.setType('primary');
    const cancelBtn = new Button('Cancel', () => { if (onCancel) onCancel(); dialog.close(); });

    dialog.getFooter().appendChild(okBtn.getDOMElement());
    dialog.getFooter().appendChild(cancelBtn.getDOMElement());

    document.body.appendChild(dialog.getDOMElement());
    dialog.show();
    return dialog;
  }

  static alert(title, message) {
    const dialog = new Dialog(title, message);
    dialog.setSize('small');

    const okBtn = new Button('OK', () => dialog.close());
    okBtn.setType('primary');
    dialog.getFooter().appendChild(okBtn.getDOMElement());

    document.body.appendChild(dialog.getDOMElement());
    dialog.show();
    return dialog;
  }
}

// Статические поля — общие для всех экземпляров Dialog на странице.
// _zBase: стартовый z-index выше любого обычного UI (1050 — как Bootstrap modal).
// _stack: порядок открытых диалогов; управляет pointer-events и фокусом.
// _cascadeStep: смещение каждого следующего диалога в пикселях (вниз + вправо).
Dialog._zBase            = 1050;
Dialog._stack            = [];
Dialog._cascadeStep      = 36;
Dialog._keyListenerReady = false;

export default Dialog;
