/**
 * UIKit - Tabs Component
 * Tabbed interface with multiple panels
 */

import { Base } from '../core/Base.js';

export class Tabs extends Base {
  constructor() {
    super();
    this.createElement('div', 'ui-tabs');
    this.enableMouseEvents(); // Enable all mouse events

    this.tabsHeader = document.createElement('div');
    this.tabsHeader.className = 'ui-tabs-header';

    this.tabsContent = document.createElement('div');
    this.tabsContent.className = 'ui-tabs-content';

    this.element.appendChild(this.tabsHeader);
    this.element.appendChild(this.tabsContent);

    this.setProperty('tabs', []);
    this.setProperty('activeTab', null);

    this.tabMap = {}; // Map key -> { button, content }
  }

  /**
   * Add tab
   * @param {string} key - Unique tab key
   * @param {string} label - Tab label
   * @param {HTMLElement|string} content - Tab content
   * @param {boolean} active - Is tab active
   */
  addTab(key, label, content = '', active = false) {
    if (this.tabMap[key]) {
      console.warn('Tab already exists:', key);
      return this;
    }

    // Create tab button
    const tabBtn = document.createElement('button');
    tabBtn.className = 'ui-tabs-button';
    tabBtn.textContent = label;
    if (active) {
      tabBtn.classList.add('active');
    }

    // Create tab content
    const tabPanel = document.createElement('div');
    tabPanel.className = 'ui-tabs-panel';
    if (content instanceof HTMLElement) {
      tabPanel.appendChild(content);
    } else {
      tabPanel.innerHTML = content;
    }
    if (!active) {
      tabPanel.style.display = 'none';
    }

    // Click handler
    tabBtn.addEventListener('click', () => this.activateTab(key));

    this.tabsHeader.appendChild(tabBtn);
    this.tabsContent.appendChild(tabPanel);

    this.tabMap[key] = {
      key: key,
      label: label,
      button: tabBtn,
      content: tabPanel
    };

    const tabs = this.getProperty('tabs', []);
    tabs.push({ key, label, active });
    this.setProperty('tabs', tabs);

    if (active) {
      this.setProperty('activeTab', key);
    }

    return this;
  }

  /**
   * Remove tab
   */
  removeTab(key) {
    if (!this.tabMap[key]) return this;

    const tab = this.tabMap[key];
    tab.button.remove();
    tab.content.remove();

    delete this.tabMap[key];

    const tabs = this.getProperty('tabs', []).filter(t => t.key !== key);
    this.setProperty('tabs', tabs);

    // If removed tab was active, activate first available
    if (this.getProperty('activeTab') === key && tabs.length > 0) {
      this.activateTab(tabs[0].key);
    }

    return this;
  }

  /**
   * Activate tab
   */
  activateTab(key) {
    if (!this.tabMap[key]) return this;

    // Hide all tabs
    Object.values(this.tabMap).forEach(tab => {
      tab.button.classList.remove('active');
      tab.content.style.display = 'none';
    });

    // Show selected tab
    const tab = this.tabMap[key];
    tab.button.classList.add('active');
    tab.content.style.display = 'block';

    this.setProperty('activeTab', key);
    this.emit('change', { activeTab: key });

    return this;
  }

  /**
   * Get active tab key
   */
  getActiveTab() {
    return this.getProperty('activeTab');
  }

  /**
   * Set tab content
   */
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

  /**
   * Get tab content element
   */
  getTabContent(key) {
    if (!this.tabMap[key]) return null;
    return this.tabMap[key].content;
  }

  /**
   * Get all tab keys
   */
  getTabs() {
    return Object.keys(this.tabMap);
  }

  /**
   * Disable/enable tab
   */
  setTabDisabled(key, disabled) {
    if (!this.tabMap[key]) return this;
    this.tabMap[key].button.disabled = disabled;
    return this;
  }
}

export default Tabs;
