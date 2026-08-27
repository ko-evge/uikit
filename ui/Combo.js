/**
 * UIKit — Combo Component
 *
 * Input с autocomplete-dropdown. Применяется для поиска по небольшим
 * спискам (до ~200 элементов) с подсветкой совпадений.
 *
 * Для 50+ элементов без поиска лучше использовать Select (нативный <select>).
 *
 * Два режима поиска:
 * - Синхронный (setOptions + локальная фильтрация): для статических данных
 * - Асинхронный (setAsyncSearch): для серверного поиска с debounce.
 *   Debounce предотвращает запрос на каждую нажатую букву — ждём паузу
 *   300мс (по умолчанию) и только тогда идём на сервер.
 *
 * blur + setTimeout(200):
 * При клике на пункт меню сначала срабатывает blur на input, потом click
 * на пункте. Без задержки hideMenu() закрывал бы меню до того, как
 * click успевал обработаться, и выбор пропадал.
 *
 * _listen(document, 'click'):
 * Закрывает меню при клике снаружи. Используем _listen (не addEventListener)
 * чтобы destroy() автоматически снял слушатель с document — иначе "zombie".
 */

import { Base } from '../core/Base.js';

export class Combo extends Base {
  constructor(placeholder = '') {
    super();
    this.createElement('div', 'ui-combo-wrapper');

    this.input = document.createElement('input');
    this.input.type = 'text';
    this.input.className = 'ui-combo-input';
    this.input.placeholder = placeholder;

    // Dropdown — скрыт по умолчанию, появляется при вводе
    this.menu = document.createElement('div');
    this.menu.className = 'ui-combo-menu';
    this.menu.style.display = 'none';

    this.element.appendChild(this.input);
    this.element.appendChild(this.menu);

    this.setProperty('placeholder', placeholder);
    this.setProperty('options', []);
    this.setProperty('value', '');
    this.setProperty('disabled', false);
    this.setProperty('filterMinChars', 1);
    this.setProperty('maxResults', 50);
    this.setProperty('debounceMs', 300);
    this.setProperty('minChars', 2);
    this.setProperty('isLoading', false);
    this.setProperty('strict', false);

    this.allOptions = [];
    this.filteredOptions = [];
    this.selectedOption = null;
    this.asyncSearchFn = null;
    this.searchTimeout = null;
    this.lastSearchQuery = null;

    this.input.addEventListener('input', (e) => this.handleInput(e));
    // Клик и фокус на пустом поле — раскрыть весь список сразу, тем же
    // путём, что и пробел в handleInput ("space = show all"), а не только
    // показать уже отрисованное меню (showMenu() no-op, если меню пустое —
    // раньше клик по пустому Combo ничего не открывал).
    this.input.addEventListener('focus', () => this.showAllOptions());
    this.input.addEventListener('click', () => this.showAllOptions());
    // 200мс задержка: клик на пункте меню должен успеть обработаться до скрытия
    this.input.addEventListener('blur', () => setTimeout(() => {
      this.hideMenu();
      // strict: поле не может остаться с текстом, не совпадающим ни с одним
      // вариантом (иначе выглядело бы как валидный выбор, но value не менялся)
      if (this.getProperty('strict') && this.input.value !== (this.selectedOption?.label || this.selectedOption?.value || '')) {
        this.input.value = this.selectedOption ? (this.selectedOption.label || this.selectedOption.value) : '';
      }
    }, 200));
    this.input.addEventListener('keydown', (e) => this.handleKeydown(e));

    // Закрываем при клике снаружи компонента.
    // _listen (не addEventListener) — чтобы destroy() снял слушатель с document.
    this._listen(document, 'click', (e) => {
      if (this.element && !this.element.contains(e.target)) this.hideMenu();
    });
  }

  /**
   * @param {Array} options - [{ value: 'id', label: 'Label' }, ...]
   */
  setOptions(options) {
    this.allOptions = options || [];
    this.setProperty('options', options);
    // Данные часто приходят асинхронно (apiCall) уже ПОСЛЕ того, как
    // пользователь успел нажать пробел/начать печатать — без этого повторного
    // рендера меню так и осталось бы "No results" даже после прихода данных,
    // пока пользователь не стёр и не ввёл текст заново.
    if (!this.asyncSearchFn && this.menu && this.menu.style.display !== 'none') {
      this.handleInput({ target: this.input });
    }
    return this;
  }

  addOption(value, label) {
    this.allOptions.push({ value, label });
    return this;
  }

  removeOption(value) {
    this.allOptions = this.allOptions.filter(opt => opt.value !== value);
    return this;
  }

  handleInput(e) {
    const text = e.target.value;
    this.setProperty('value', text);

    // Пробел (и только пробел) — показать весь список, не дожидаясь minChars.
    // Для коротких справочников (3-5 записей) пользователь не должен вслепую
    // подбирать буквы, чтобы увидеть варианты — пробел работает как "раскрыть всё".
    if (text === ' ' && !this.asyncSearchFn) {
      const maxResults = this.getProperty('maxResults', 50);
      this.filteredOptions = this.allOptions.slice(0, maxResults);
      this.renderMenu();
      this.showMenu();
      return;
    }

    const minChars = this.getProperty('minChars', 2);
    if (text.length < minChars) {
      // Слишком мало символов — очищаем меню, но показываем пустое
      // (чтобы пользователь понял, что функция поиска активна)
      this.menu.innerHTML = '';
      this.showMenu();
      return;
    }

    if (this.asyncSearchFn) {
      this.performAsyncSearch(text);
    } else {
      this.performLocalSearch(text);
    }
  }

  performLocalSearch(searchText) {
    const searchLower = searchText.toLowerCase();
    this.filteredOptions = this.allOptions.filter(opt => {
      const label = (opt.label || opt.value).toLowerCase();
      return label.includes(searchLower);
    });

    // Ограничиваем вывод — рендер 1000 пунктов заморозил бы UI
    const maxResults = this.getProperty('maxResults', 50);
    this.filteredOptions = this.filteredOptions.slice(0, maxResults);

    this.renderMenu();
    this.showMenu();
  }

  performAsyncSearch(query) {
    // Отменяем предыдущий таймер — debounce
    if (this.searchTimeout) clearTimeout(this.searchTimeout);

    // Если запрос не изменился И меню уже показывает его результаты — не дублируем
    // серверный вызов. Проверка видимости обязательна: без неё повторный ввод того же
    // запроса (поискал → выбрал → очистил → набрал снова) молча не открывал меню.
    if (this.lastSearchQuery === query && this.menu.style.display !== 'none') return;

    const debounceMs = this.getProperty('debounceMs', 300);

    this.searchTimeout = setTimeout(async () => {
      this.lastSearchQuery = query;
      this.setProperty('isLoading', true);
      this.menu.innerHTML = '<div class="ui-combo-loading">Loading…</div>';
      this.showMenu();

      try {
        const results = await this.asyncSearchFn(query);
        this.filteredOptions = Array.isArray(results) ? results : [];

        const maxResults = this.getProperty('maxResults', 50);
        this.filteredOptions = this.filteredOptions.slice(0, maxResults);

        this.renderMenu();
        this.setProperty('isLoading', false);
      } catch (error) {
        console.error('Async search error:', error);
        this.menu.innerHTML = '<div class="ui-combo-error">Search error</div>';
        this.setProperty('isLoading', false);
      }
    }, debounceMs);
  }

  renderMenu() {
    this.menu.innerHTML = '';

    if (this.filteredOptions.length === 0) {
      const noResults = document.createElement('div');
      noResults.className = 'ui-combo-no-results';
      noResults.textContent = 'No results';
      this.menu.appendChild(noResults);
      return;
    }

    this.filteredOptions.forEach((option) => {
      const item = document.createElement('div');
      item.className = 'ui-combo-item';
      // highlightMatch оборачивает совпадение в <strong> — HTML, не textContent
      item.innerHTML = this.highlightMatch(option.label || option.value, this.input.value);

      item.addEventListener('click', () => this.selectOption(option));

      // mouseenter снимает hover со всех и ставит на текущий —
      // нужно для синхронизации с клавиатурной навигацией (ArrowDown/Up)
      item.addEventListener('mouseenter', () => {
        this.menu.querySelectorAll('.ui-combo-item').forEach(el => el.classList.remove('hover'));
        item.classList.add('hover');
      });

      this.menu.appendChild(item);
    });
  }

  /**
   * Подсветка совпадения через innerHTML.
   * Используем <strong> а не обёртку с цветом — цвет задаётся в CSS,
   * что позволяет темам переопределять стиль подсветки.
   *
   * Текст и поисковая строка экранируются: text — от HTML (label из БД мог бы
   * исполниться как разметка), search — от regex-метасимволов (ввод '(' ронял
   * new RegExp с SyntaxError, и меню переставало рендериться).
   */
  highlightMatch(text, search) {
    const escaped = String(text)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    if (!search) return escaped;
    const safe = search.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(${safe})`, 'gi');
    return escaped.replace(regex, '<strong>$1</strong>');
  }

  selectOption(option) {
    this.selectedOption = option;
    this.input.value = option.label || option.value;
    this.setProperty('value', option.value);
    this.hideMenu();
    this.emit('change', { value: option.value, label: option.label, option });
  }

  handleKeydown(e) {
    const items = this.menu.querySelectorAll('.ui-combo-item');
    const hovered = this.menu.querySelector('.ui-combo-item.hover');
    const hoveredIndex = hovered ? Array.from(items).indexOf(hovered) : -1;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (items.length === 0) return;
        {
          const nextIdx = (hoveredIndex + 1) % items.length;
          items.forEach(el => el.classList.remove('hover'));
          items[nextIdx].classList.add('hover');
        }
        break;

      case 'ArrowUp':
        e.preventDefault();
        if (items.length === 0) return;
        {
          const prevIdx = hoveredIndex <= 0 ? items.length - 1 : hoveredIndex - 1;
          items.forEach(el => el.classList.remove('hover'));
          items[prevIdx].classList.add('hover');
        }
        break;

      case 'Home':
        e.preventDefault();
        if (items.length === 0) return;
        items.forEach(el => el.classList.remove('hover'));
        items[0].classList.add('hover');
        items[0].scrollIntoView({ block: 'nearest' });
        break;

      case 'End':
        e.preventDefault();
        if (items.length === 0) return;
        items.forEach(el => el.classList.remove('hover'));
        items[items.length - 1].classList.add('hover');
        items[items.length - 1].scrollIntoView({ block: 'nearest' });
        break;

      case 'PageDown':
        e.preventDefault();
        if (items.length === 0) return;
        {
          const nextIdx = Math.min(hoveredIndex < 0 ? 0 : hoveredIndex + 10, items.length - 1);
          items.forEach(el => el.classList.remove('hover'));
          items[nextIdx].classList.add('hover');
          items[nextIdx].scrollIntoView({ block: 'nearest' });
        }
        break;

      case 'PageUp':
        e.preventDefault();
        if (items.length === 0) return;
        {
          const prevIdx = Math.max((hoveredIndex < 0 ? items.length - 1 : hoveredIndex) - 10, 0);
          items.forEach(el => el.classList.remove('hover'));
          items[prevIdx].classList.add('hover');
          items[prevIdx].scrollIntoView({ block: 'nearest' });
        }
        break;

      case 'Enter':
        e.preventDefault();
        if (hovered) {
          const idx = Array.from(items).indexOf(hovered);
          this.selectOption(this.filteredOptions[idx]);
        } else if (this.filteredOptions.length > 0) {
          this.selectOption(this.filteredOptions[0]);
        } else if (!this.getProperty('strict')) {
          // Freeform режим: если нет совпадений — принимаем текст как есть.
          // В strict режиме (setStrict(true)) — только выбор из списка, ввод игнорируется.
          this.setProperty('value', this.input.value);
          this.emit('change', { value: this.input.value, label: this.input.value });
          this.hideMenu();
        }
        break;

      case 'Escape':
        e.preventDefault();
        this.hideMenu();
        break;
    }
  }

  showMenu() {
    if (this.menu.innerHTML) {
      this.menu.style.display = 'block';
    }
  }

  // Раскрыть весь список (как пробел в handleInput) — используется на клик/
  // фокус пустого поля, синхронный режим только (в async — нет понятия
  // "весь список" без запроса, там просто откроется то, что уже отрисовано).
  showAllOptions() {
    if (this.input.value !== '' || this.asyncSearchFn) { this.showMenu(); return; }
    const maxResults = this.getProperty('maxResults', 50);
    this.filteredOptions = this.allOptions.slice(0, maxResults);
    this.renderMenu();
    this.showMenu();
  }

  hideMenu() {
    this.menu.style.display = 'none';
  }

  /**
   * @param {Function} fn - async function(query: string) -> Promise<Array>
   */
  setAsyncSearch(fn) {
    this.asyncSearchFn = fn;
    return this;
  }

  setDebounce(ms) {
    this.setProperty('debounceMs', ms);
    return this;
  }

  setMinChars(chars) {
    this.setProperty('minChars', chars);
    return this;
  }

  /**
   * Strict режим — только выбор из списка (как нативный <select>): Enter/blur
   * без совпадения не принимает произвольный текст, откатывает к последнему
   * выбранному варианту.
   */
  setStrict(strict) {
    this.setProperty('strict', strict);
    return this;
  }

  getSelectedOption() {
    return this.selectedOption;
  }

  setValue(value) {
    this.setProperty('value', value);
    const option = this.allOptions.find(opt => opt.value === value);
    if (option) {
      this.input.value = option.label || option.value;
      this.selectedOption = option;
    } else {
      this.input.value = value;
    }
    return this;
  }

  getValue() {
    return this.getProperty('value');
  }

  setDisabled(disabled) {
    this.setProperty('disabled', disabled);
    this.input.disabled = disabled;
    return this;
  }

  setPlaceholder(text) {
    this.setProperty('placeholder', text);
    this.input.placeholder = text;
    return this;
  }

  clear() {
    this.input.value = '';
    this.setProperty('value', '');
    this.selectedOption = null;
    return this;
  }

  focus() {
    this.input.focus();
    return this;
  }

  /**
   * Отменяем debounce-таймер при destroy, чтобы отложенный async-запрос
   * не выполнился против уже уничтоженного компонента.
   */
  destroy() {
    if (this.searchTimeout) {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = null;
    }
    return super.destroy();
  }
}

export default Combo;
