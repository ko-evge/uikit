/**
 * UIKit - Type Definitions
 * TypeScript support for UIKit components
 */

// Core
export declare class Base {
  createElement(tagName: string, className?: string): void;
  getDOMElement(): HTMLElement;
  setProperty(key: string, value: any): void;
  getProperty(key: string, defaultValue?: any): any;
  addClass(className: string): Base;
  removeClass(className: string): Base;
  emit(eventName: string, data?: any): void;
  on(eventName: string, callback: (event: any) => void): Base;
  append(component: Base): Base;
}

// Components
export declare class Button extends Base {
  constructor(text: string, onClick?: () => void);
  setType(type: 'primary' | 'default' | 'danger'): Button;
  getType(): string;
  setSize(size: 'small' | 'medium' | 'large'): Button;
  setDisabled(disabled: boolean): Button;
  setText(text: string): Button;
}

export declare class Input extends Base {
  constructor(type?: string, placeholder?: string);
  setValue(value: string): Input;
  getValue(): string;
  setPlaceholder(text: string): Input;
  setDisabled(disabled: boolean): Input;
  setRequired(required: boolean): Input;
  setVariant(variant: 'default' | 'filled' | 'underlined'): Input;
  clear(): Input;
  focus(): Input;
}

export declare class Label extends Base {
  constructor(text: string);
  setText(text: string): Label;
  getText(): string;
  setRequired(required: boolean): Label;
}

export declare class Textarea extends Base {
  constructor(placeholder?: string);
  setValue(value: string): Textarea;
  getValue(): string;
  setRows(rows: number): Textarea;
  setMaxLength(length: number): Textarea;
  clear(): Textarea;
}

export declare class Checkbox extends Base {
  constructor(label: string);
  setChecked(checked: boolean): Checkbox;
  isChecked(): boolean;
  setLabel(label: string): Checkbox;
  setDisabled(disabled: boolean): Checkbox;
}

export declare class RadioButton extends Base {
  constructor(name: string);
  addOption(value: string, label: string): RadioButton;
  setValue(value: string): RadioButton;
  getValue(): string;
  setDisabled(disabled: boolean): RadioButton;
}

export declare class Dropdown extends Base {
  constructor(placeholder?: string);
  addOption(value: string, label: string): Dropdown;
  setValue(value: string): Dropdown;
  getValue(): string;
  getLabel(): string;
  clear(): Dropdown;
}

export declare class Combo extends Base {
  constructor(placeholder?: string);
  addOption(value: string, label: string): Combo;
  setValue(value: string): Combo;
  getValue(): string;
  setAsyncSearch(fn: (query: string) => Promise<any[]>): Combo;
  setDebounce(ms: number): Combo;
  setMinChars(chars: number): Combo;
  getSelectedOption(): { value: string; label: string } | null;
}

export declare class DatePicker extends Base {
  constructor(placeholder?: string);
  setValue(date: string): DatePicker;
  getValue(): string;
  setMinDate(date: string): DatePicker;
  setMaxDate(date: string): DatePicker;
  setDisabled(disabled: boolean): DatePicker;
}

export declare class Grid extends Base {
  constructor();
  setHeaders(headers: Array<{
    key: string;
    label: string;
    width?: string;
    sortable?: boolean;
  }>): Grid;
  setRows(rows: any[]): Grid;
  addRow(rowData: any): Grid;
  setFormatter(columnKey: string, fn: (value: any, row: any) => string): Grid;
  setEditable(editable: boolean): Grid;
  setEditableColumn(columnKey: string, editable: boolean): Grid;
  setResizable(resizable: boolean): Grid;
  setSortable(sortable: boolean): Grid;
  setSortColumn(columnKey: string, order?: 'asc' | 'desc'): Grid;
  getSortState(): { column: string | null; order: string };
  clearSort(): Grid;
  setFilterable(filterable: boolean): Grid;
  addFilter(columnKey: string, operator: string, value: any, valueTo?: any): Grid;
  getFilters(): { [key: string]: any };
  clearFilters(): Grid;
  removeFilter(columnKey: string): Grid;
}

export declare class Form extends Base {
  constructor();
  addField(name: string, config: {
    label?: string;
    type?: string;
    placeholder?: string;
    required?: boolean;
    validators?: Array<{
      type: string;
      message?: string;
      [key: string]: any;
    }>;
    validationTrigger?: 'change' | 'blur' | 'submit';
    value?: string;
  }): Form;
  removeField(name: string): Form;
  setFieldValue(name: string, value: any): Form;
  getFieldValue(name: string): any;
  getData(): { [key: string]: any };
  setData(data: { [key: string]: any }): Form;
  validate(): boolean;
  validateField(name: string): string | null;
  getErrors(): { [key: string]: string };
  clearErrors(): Form;
  reset(): Form;
}

export declare class Dialog extends Base {
  constructor(title?: string, content?: string);
  setTitle(title: string): Dialog;
  setContent(content: string | HTMLElement | Base): Dialog;
  setSize(size: 'small' | 'medium' | 'large'): Dialog;
  getFooter(): HTMLElement;
  show(): Dialog;
  close(): Dialog;
  static alert(title: string, message: string): Dialog;
  static confirm(title: string, onYes?: () => void, onNo?: () => void): Dialog;
}

export declare class Panel extends Base {
  constructor(title?: string);
  setTitle(title: string): Panel;
  setContent(content: string | HTMLElement | Base): Panel;
  getBody(): HTMLElement;
  getFooter(): HTMLElement;
}

export declare class Tabs extends Base {
  constructor();
  addTab(id: string, label: string, content: string | HTMLElement | Base, active?: boolean): Tabs;
  selectTab(id: string): Tabs;
  getActiveTab(): string;
}

export declare class List extends Base {
  constructor();
  addItem(id: string, label: string): List;
  removeItem(id: string): List;
  selectItem(id: string): List;
  getSelectedItem(): string | null;
  setMultiSelect(enabled: boolean): List;
}

export declare class Link extends Base {
  constructor(text: string, href: string);
  setText(text: string): Link;
  setHref(href: string): Link;
  setTarget(target: string): Link;
}

export declare class Table extends Base {
  constructor();
  setHeaders(headers: string[]): Table;
  addRow(cells: string[]): Table;
  clear(): Table;
}

// Formatters
export declare class NumberFormatter {
  static format(value: number, format: string): string;
}

export declare class DateFormatter {
  static format(date: string, format: string): string;
}

export declare class StringFormatter {
  static capitalize(str: string): string;
  static truncate(str: string, length: number): string;
}

export declare class HTMLFormatter {
  static escapeHtml(html: string): string;
  static sanitizeHtml(html: string): string;
}

// Validators
export declare class Validators {
  static required(value: any, message?: string): string | null;
  static email(value: string, message?: string): string | null;
  static minLength(min: number, message?: string): (value: string) => string | null;
  static maxLength(max: number, message?: string): (value: string) => string | null;
  static min(min: number, message?: string): (value: number) => string | null;
  static max(max: number, message?: string): (value: number) => string | null;
  static pattern(regex: RegExp, message?: string): (value: string) => string | null;
  static url(value: string, message?: string): string | null;
  static number(value: any, message?: string): string | null;
  static integer(value: any, message?: string): string | null;
  static custom(fn: (value: any) => boolean, message?: string): (value: any) => string | null;
  static matches(fieldName: string, message?: string): (value: any, formData?: any) => string | null;
}

// UIKit Factory
export declare const UIKit: {
  button(text: string, onClick?: () => void): Button;
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
