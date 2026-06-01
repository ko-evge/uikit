/**
 * UIKit - Type Definitions
 * TypeScript support for UIKit components.
 * Signatures mirror the actual implementation in UIKit/.
 */

// ----- Core -----
export declare class Base {
  element: HTMLElement | null;
  createElement(tagName?: string, className?: string): HTMLElement;
  getDOMElement(): HTMLElement | null;
  getId(): string;

  // properties
  setProperty(key: string, value: any): this;
  getProperty(key: string, defaultValue?: any): any;
  onPropertyChanged(name: string, value: any): void;

  // styling / attributes
  setStyle(name: string, value: string): this;
  getStyle(name: string): string | null;
  addClass(className: string): this;
  removeClass(className: string): this;
  toggleClass(className: string): this;
  setAttribute(name: string, value: any): this;
  getAttribute(name: string): string | null;

  // events (internal pub/sub; native DOM events are bridged automatically)
  on(eventName: string, handler: (payload: any) => void): this;
  off(eventName: string, handler?: (payload: any) => void): this;
  emit(eventName: string, data?: any): this;
  /** Central error handler for listener exceptions. Override to add logging. */
  handle(error: any, context?: string): this;
  /** @deprecated No-op. Native mouse events are bridged by on(). */
  enableMouseEvents(): this;

  // batched rendering — renders are suspended until endUpdate()
  beginUpdate(): this;
  endUpdate(): this;

  // visibility / tree
  show(): this;
  hide(): this;
  isVisible(): boolean;
  append(child: Base | HTMLElement | string): this;
  remove(child: Base): this;
  clear(): this;

  // lifecycle
  destroy(): this;
  isDestroyed(): boolean;
}

// ----- Components -----
export declare class Button extends Base {
  constructor(text?: string, onClick?: (event: Event) => void);
  setText(text: string): this;
  getText(): string;
  setDisabled(disabled: boolean): this;
  isDisabled(): boolean;
  setType(type: 'primary' | 'default' | 'danger' | 'success' | 'warning'): this;
  getType(): string;
  setSize(size: 'small' | 'medium' | 'large'): this;
  click(): this;
}

export declare class Input extends Base {
  constructor(type?: string, placeholder?: string);
  setValue(value: string): this;
  getValue(): string;
  setPlaceholder(text: string): this;
  setType(type: string): this;
  setReadonly(readonly: boolean): this;
  setDisabled(disabled: boolean): this;
  focus(): this;
  clear(): this;
  selectAll(): this;
}

export declare class Label extends Base {
  constructor(text?: string);
  setText(text: string): this;
  getText(): string;
  setFor(id: string): this;
  getFor(): string;
}

export declare class Textarea extends Base {
  constructor(placeholder?: string);
  setValue(value: string): this;
  getValue(): string;
  setPlaceholder(text: string): this;
  setRows(rows: number): this;
  setMaxLength(length: number | null): this;
  setReadonly(readonly: boolean): this;
  setDisabled(disabled: boolean): this;
  focus(): this;
  clear(): this;
  selectAll(): this;
  getCharCount(): number;
}

export declare class Checkbox extends Base {
  constructor(label?: string);
  setChecked(checked: boolean): this;
  isChecked(): boolean;
  setLabel(text: string): this;
  setDisabled(disabled: boolean): this;
  toggle(): this;
  getValue(): boolean;
  setValue(value: boolean): this;
}

export interface Option { value: string; label: string; }

export declare class RadioButton extends Base {
  constructor(name?: string, options?: Option[]);
  setOptions(options: Option[]): this;
  addOption(value: string, label: string): this;
  removeOption(value: string): this;
  setValue(value: string): this;
  getValue(): string | null;
  setDisabled(disabled: boolean): this;
  getValues(): string[];
}

export declare class Dropdown extends Base {
  constructor(placeholder?: string);
  setOptions(options: Option[]): this;
  getOptions(): Option[];
  addOption(value: string, label: string): this;
  removeOption(value: string): this;
  setValue(value: string): this;
  getValue(): string;
  setDisabled(disabled: boolean): this;
  toggleMenu(): void;
  openMenu(): void;
  closeMenu(): void;
  render(): this;
}

export declare class Combo extends Base {
  constructor(placeholder?: string);
  setOptions(options: Option[]): this;
  addOption(value: string, label: string): this;
  removeOption(value: string): this;
  setValue(value: string): this;
  getValue(): string;
  getSelectedOption(): Option | null;
  setAsyncSearch(fn: (query: string) => Promise<Option[]>): this;
  setDebounce(ms: number): this;
  setMinChars(chars: number): this;
  setDisabled(disabled: boolean): this;
  setPlaceholder(text: string): this;
  clear(): this;
  focus(): this;
}

export declare class DatePicker extends Base {
  constructor(placeholder?: string);
  setValue(date: string): this;
  getValue(): string;
  setMinDate(date: string): this;
  setMaxDate(date: string): this;
  formatDate(date: Date): string;
  parseDate(str: string): Date;
  showCalendar(): void;
  hideCalendar(): void;
  render(): this;
}

export interface GridHeader {
  key: string;
  label: string;
  width?: string;
  sortable?: boolean;
  formatter?: (value: any, row: any) => string | HTMLElement;
}

export declare class Grid extends Base {
  constructor();
  setHeaders(headers: GridHeader[]): this;
  setRows(rows: any[]): this;
  addRow(rowData: any): this;
  removeRow(index: number): this;
  updateRow(index: number, rowData: any): this;
  setFormatter(columnKey: string, fn: (value: any, row: any) => string | HTMLElement): this;
  setEditable(editable: boolean): this;
  setEditableColumn(columnKey: string, editable?: boolean): this;
  setResizable(resizable: boolean): this;
  setSortable(sortable: boolean): this;
  setSortColumn(columnKey: string, order?: 'asc' | 'desc'): this;
  getSortState(): { column: string | null; order: string };
  clearSort(): this;
  setFilterable(filterable: boolean): this;
  setFilter(text: string): this;
  addFilter(columnKey: string, operator: string, value: any, valueTo?: any): this;
  getFilters(): { [key: string]: any };
  removeFilter(columnKey: string): this;
  clearFilters(): this;
  setVirtualScroll(enabled: boolean, rowHeight?: number): this;
  setKeyboardNav(enabled: boolean): this;
  getSelectedRows(): any[];
  clearSelection(): this;
}

export interface FieldConfig {
  label?: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  validators?: Array<{ type: string; message?: string; [key: string]: any }>;
  validationTrigger?: 'change' | 'blur' | 'submit';
  value?: string;
}

export declare class Form extends Base {
  constructor();
  addField(name: string, config?: FieldConfig): this;
  removeField(name: string): this;
  setFieldValue(name: string, value: any): this;
  getFieldValue(name: string): any;
  getData(): { [key: string]: any };
  setData(data: { [key: string]: any }): this;
  validate(): boolean;
  validateField(name: string): string | null;
  getErrors(): { [key: string]: string };
  clearErrors(): this;
  reset(): this;
}

export declare class Dialog extends Base {
  constructor(title?: string, content?: string | HTMLElement | Base);
  setTitle(title: string): this;
  setContent(content: string | HTMLElement | Base): this;
  appendContent(child: HTMLElement | Base): this;
  setSize(size: 'small' | 'medium' | 'large'): this;
  setClosable(closable: boolean): this;
  getFooter(): HTMLElement;
  show(): this;
  hide(): this;
  close(): this;
  static alert(title: string, message: string): Dialog;
  static confirm(title: string, onConfirm?: () => void, onCancel?: () => void): Dialog;
}

export declare class Panel extends Base {
  constructor(title?: string);
  setTitle(title: string): this;
  getTitle(): string;
  setCollapsible(collapsible: boolean): this;
  setCollapsed(collapsed: boolean): this;
  toggleCollapsed(): this;
  getContent(): HTMLElement;
  setContent(content: string | HTMLElement | Base): this;
  appendContent(child: string | HTMLElement | Base): this;
  clearContent(): this;
  getFooter(): HTMLElement;
  setFooter(footer: string | HTMLElement | Base): this;
}

export declare class Tabs extends Base {
  constructor();
  addTab(key: string, label: string, content?: string | HTMLElement, active?: boolean): this;
  removeTab(key: string): this;
  activateTab(key: string): this;
  getActiveTab(): string | null;
  setTabContent(key: string, content: string | HTMLElement): this;
  getTabContent(key: string): HTMLElement | null;
  getTabs(): string[];
  setTabDisabled(key: string, disabled: boolean): this;
}

export interface ListItem { value: string; label: string; disabled?: boolean; }

export declare class List extends Base {
  constructor();
  setItems(items: ListItem[]): this;
  addItem(value: string, label: string): this;
  removeItem(value: string): this;
  setSelectedItem(value: string): this;
  getSelectedItem(): ListItem | null;
  getSelectedItems(): ListItem[];
  setMultiSelect(multiSelect: boolean): this;
  clearSelection(): this;
  getItems(): ListItem[];
  getItemCount(): number;
  scrollToItem(index: number): this;
}

export declare class Link extends Base {
  constructor(text?: string, href?: string);
  setText(text: string): this;
  setHref(href: string): this;
  setTarget(target: string): this;
  openInNewWindow(): this;
  setDisabled(disabled: boolean): this;
  getHref(): string;
  getText(): string;
}

export declare class Table extends Base {
  constructor();
  setHeaders(headers: string[]): this;
  getHeaders(): string[];
  setRows(rows: any[][]): this;
  getRows(): any[][];
  addRow(rowData: any[]): this;
  removeRow(index: number): this;
  updateRow(index: number, rowData: any[]): this;
  getSelectedRow(): { index: number; data: any } | null;
  clearRows(): this;
}

// ----- Formatters -----
export declare const NumberFormatter: {
  format(value: number | string, options?: string | object): string;
  parse(formatted: string): number;
};

export declare const DateFormatter: {
  format(date: string | Date, pattern?: string): string;
  parse(dateString: string, pattern?: string): Date | null;
};

export declare const HTMLFormatter: {
  escape(html: string): string;
  unescape(html: string): string;
  sanitize(html: string): string;
};

export declare const StringFormatter: {
  capitalize(str: string): string;
  upper(str: string): string;
  lower(str: string): string;
  truncate(str: string, length?: number): string;
  repeat(str: string, count?: number): string;
  pad(str: string, length?: number, char?: string, side?: 'left' | 'right'): string;
};

// ----- Validators -----
export declare const Validators: {
  required(value: any, message?: string): string | null;
  email(value: string, message?: string): string | null;
  minLength(min: number, message?: string): (value: string) => string | null;
  maxLength(max: number, message?: string): (value: string) => string | null;
  min(min: number, message?: string): (value: number) => string | null;
  max(max: number, message?: string): (value: number) => string | null;
  pattern(regex: RegExp, message?: string): (value: string) => string | null;
  custom(fn: (value: any) => boolean, message?: string): (value: any) => string | null;
  url(value: string, message?: string): string | null;
  number(value: any, message?: string): string | null;
  integer(value: any, message?: string): string | null;
  matches(fieldName: string, message?: string): (value: any, formData?: any) => string | null;
};

// ----- UIKit Factory -----
export declare const UIKit: {
  button(text: string, onClick?: (event: Event) => void): Button;
  input(type?: string, placeholder?: string): Input;
  label(text: string): Label;
  table(): Table;
  div(className?: string): Base;
  h1(text: string): Base;
  h2(text: string): Base;
  h3(text: string): Base;
  p(text: string): Base;
  alert(message: string, type?: string): void;
};

export default UIKit;
