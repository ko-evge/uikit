/**
 * UIKit — Tabs Component
 *
 * Реализация вкладок. Ключевые решения:
 *
 * tabMap (объект) вместо массива:
 * Вкладки добавляются и удаляются динамически. Объект { key -> tab } даёт
 * O(1) доступ по ключу без indexOf. При удалении вкладки из массива
 * сдвигались бы индексы — с объектом это не проблема.
 *
 * tabPanel.style.display = 'flex' (не 'block'):
 * Содержимое вкладки (Grid, List) использует flex:1 для заполнения высоты.
 * Если контейнер display:block — flex:1 не работает, высота схлопывается.
 *
 * Клавиатурная навигация ArrowLeft/Right:
 * ARIA-паттерн для tablist — переключение стрелками, а не Tab.
 * Tab переключает между компонентами страницы, стрелки — между вкладками.
 */

import { Base } from '../core/Base.js';

export class Tabs extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-tabs');

    this.tabsHeader = document.createElement('div');
    this.tabsHeader.className = 'ui-tabs-header';

    this.tabsContent = document.createElement('div');
    this.tabsContent.className = 'ui-tabs-content';

    this.element.appendChild(this.tabsHeader);
    this.element.appendChild(this.tabsContent);

    this.setProperty('tabs', []);
    this.setProperty('activeTab', null);

    // Быстрый доступ по ключу: key -> { button, content }
    this.tabMap = {};
  }

  /**
   * @param {string} key    - Уникальный ключ вкладки (используется как ID)
   * @param {string} label  - Заголовок вкладки
   * @param {HTMLElement|string} content - Содержимое вкладки
   * @param {boolean} active - Сразу активировать эту вкладку
   */
  addTab(key, label, content = '', active = false) {
    if (this.tabMap[key]) {
      console.warn('Tab already exists:', key);
      return this;
    }

    const tabBtn = document.createElement('button');
    tabBtn.className = 'ui-tabs-button';
    tabBtn.textContent = label;
    if (active) {
      // Деактивируем ранее добавленные вкладки: два addTab(..., active=true)
      // иначе оставляли бы обе панели видимыми одновременно
      Object.values(this.tabMap).forEach(tab => {
        tab.button.classList.remove('active');
        tab.content.style.display = 'none';
      });
      tabBtn.classList.add('active');
    }

    const tabPanel = document.createElement('div');
    tabPanel.className = 'ui-tabs-panel';
    // flex+min-height:0 — обязательны, иначе flex:1 дочерние элементы (Grid, List)
    // не получают реальной высоты и схлопываются в 0
    tabPanel.style.cssText = 'flex: 1; overflow: auto; min-height: 0; display: '
      + (active ? 'flex' : 'none') + '; flex-direction: column;';

    if (content instanceof HTMLElement) {
      tabPanel.appendChild(content);
    } else {
      tabPanel.innerHTML = content;
    }

    tabBtn.addEventListener('click', () => this.activateTab(key));

    // ArrowRight/Left для переключения вкладок (ARIA tablist pattern).
    // Tab-клавиша не используется — она переводит фокус между компонентами страницы.
    tabBtn.addEventListener('keydown', (e) => {
      const buttons = Array.from(this.tabsHeader.querySelectorAll('.ui-tabs-button'));
      const currentIndex = buttons.indexOf(tabBtn);

      switch (e.key) {
        case 'ArrowRight':
          e.preventDefault();
          if (currentIndex < buttons.length - 1) {
            buttons[currentIndex + 1].click();
            buttons[currentIndex + 1].focus();
          }
          break;
        case 'ArrowLeft':
          e.preventDefault();
          if (currentIndex > 0) {
            buttons[currentIndex - 1].click();
            buttons[currentIndex - 1].focus();
          }
          break;
        case 'Home':
          e.preventDefault();
          if (buttons.length > 0) { buttons[0].click(); buttons[0].focus(); }
          break;
        case 'End':
          e.preventDefault();
          if (buttons.length > 0) {
            buttons[buttons.length - 1].click();
            buttons[buttons.length - 1].focus();
          }
          break;
      }
    });

    this.tabsHeader.appendChild(tabBtn);
    this.tabsContent.appendChild(tabPanel);

    this.tabMap[key] = { key, label, button: tabBtn, content: tabPanel };

    const tabs = this.getProperty('tabs', []);
    tabs.push({ key, label, active });
    this.setProperty('tabs', tabs);

    if (active) this.setProperty('activeTab', key);

    return this;
  }

  removeTab(key) {
    if (!this.tabMap[key]) return this;

    const tab = this.tabMap[key];
    tab.button.remove();
    tab.content.remove();
    delete this.tabMap[key];

    const tabs = this.getProperty('tabs', []).filter(t => t.key !== key);
    this.setProperty('tabs', tabs);

    // При удалении активной вкладки — автоматически переходим на первую доступную
    if (this.getProperty('activeTab') === key && tabs.length > 0) {
      this.activateTab(tabs[0].key);
    }

    return this;
  }

  activateTab(key) {
    if (!this.tabMap[key]) return this;

    // Скрываем все вкладки перед показом выбранной
    Object.values(this.tabMap).forEach(tab => {
      tab.button.classList.remove('active');
      tab.content.style.display = 'none';
    });

    const tab = this.tabMap[key];
    tab.button.classList.add('active');
    // display:flex — а не block, иначе flex:1 дочерние (Grid/List) схлопнутся
    tab.content.style.display = 'flex';

    // setTimeout(0): фокус работает только на видимом элементе.
    // Переносим фокус только если пользователь уже находился на кнопках вкладок
    // (клавиатурная навигация ←→) — программный activateTab/setActiveTab
    // не должен красть фокус у поля ввода в контенте вкладки
    if (this.tabsHeader.contains(document.activeElement)) {
      setTimeout(() => { tab.button.focus(); }, 0);
    }

    this.setProperty('activeTab', key);
    this.emit('change', { activeTab: key });

    return this;
  }

  setActiveTab(key) {
    return this.activateTab(key);
  }

  getActiveTab() {
    return this.getProperty('activeTab');
  }

  setTabContent(key, content) {
    if (!this.tabMap[key]) return this;
    const tab = this.tabMap[key];
    tab.content.innerHTML = '';
    if (content instanceof HTMLElement) {
      tab.content.appendChild(content);
    } else {
      tab.content.innerHTML = content;
    }
    return this;
  }

  getTabContent(key) {
    if (!this.tabMap[key]) return null;
    return this.tabMap[key].content;
  }

  getTabs() {
    return Object.keys(this.tabMap);
  }

  setTabDisabled(key, disabled) {
    if (!this.tabMap[key]) return this;
    this.tabMap[key].button.disabled = disabled;
    return this;
  }
}

export default Tabs;
