/**
 * UIKit — Form Component
 *
 * Форма с полями, валидацией и сабмитом.
 *
 * addField() добавляет одно поле (_buildField) без перерисовки всей формы.
 * Если бы addField() вызывал render() — каждый вызов пересоздавал бы N-1
 * предыдущих полей, итого O(N^2) при построении формы из N полей.
 *
 * Три уровня валидации (в порядке приоритета):
 *  1. field.required — встроенная проверка на пустоту
 *  2. field.validators[] — массив именованных валидаторов (Validators.*)
 *  3. field.validation — устаревший callback, оставлен для совместимости
 *
 * validationTrigger:
 *  'submit' — только при сабмите (по умолчанию, не раздражает пользователя)
 *  'change' — на каждый ввод символа (для критичных полей)
 *  'blur'   — при потере фокуса (компромисс)
 *
 * errorElements, fieldInputs, fieldElements — три отдельных Map.
 * Не объединяем в один объект, чтобы каждый тип операции (показ ошибки,
 * получение значения, скрытие поля) имел прямой доступ без деструктуризации.
 */

import { Base } from '../core/Base.js';
import { Input } from './Input.js';
import { Label } from './Label.js';
import { Button } from './Button.js';
import { Validators } from '../core/Validators.js';

export class Form extends Base {
  constructor() {
    super();
    this.createElement('form', 'ui-form');
    // Перехватываем нативный submit — браузер не должен делать GET/POST запрос
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.emit('submit', { data: this.getData(), valid: this.validate() });
    });

    this.setProperty('fields', []);
    this.setProperty('data', {});
    this.setProperty('errors', {});
    this.setProperty('fillSpace', false);

    this.fieldElements = {}; // name -> DOM группа (label + input + error)
    this.fieldInputs   = {}; // name -> UIKit Input-компонент
    this.errorElements = {}; // name -> div с текстом ошибки
  }

  /**
   * Добавляет поле без полного перерисовки формы.
   * @param {string} name - Имя поля (ключ в getData())
   * @param {object} config - { label, type, placeholder, required, validators, validationTrigger, value }
   */
  addField(name, config = {}) {
    const field = {
      name,
      label:             config.label || name,
      type:              config.type || 'text',
      placeholder:       config.placeholder || '',
      required:          config.required || false,
      validation:        config.validation || null,     // устаревший callback
      validators:        config.validators || [],
      validationTrigger: config.validationTrigger || 'submit',
      value:             config.value || '',
      ...config
    };

    const fields = this.getProperty('fields', []);
    fields.push(field);
    this.setProperty('fields', fields);

    // Инкрементальное добавление — не перерисовываем все предыдущие поля
    this.element.appendChild(this._buildField(field));
    return this;
  }

  removeField(name) {
    const fields = this.getProperty('fields', []).filter(f => f.name !== name);
    this.setProperty('fields', fields);
    // removeField редкий — полный перерендер допустим
    this.render();
    return this;
  }

  setFieldValue(name, value) {
    const data = this.getProperty('data', {});
    data[name] = value;
    this.setProperty('data', data);
    if (this.fieldInputs[name]) this.fieldInputs[name].setValue(value);
    return this;
  }

  getFieldValue(name) {
    // Приоритет: живой DOM input → свойство data
    if (this.fieldInputs[name]) return this.fieldInputs[name].getValue();
    return this.getProperty('data', {})[name] || '';
  }

  getField(name)        { return this.fieldInputs[name]; }
  getFieldElement(name) { return this.fieldElements[name]; }
  getFieldsContainer()  { return this.element; }

  setFillSpace(fill = true) {
    this.setProperty('fillSpace', fill);
    if (this.element) {
      this.element.style.padding = fill ? '0' : '';
      this.element.style.margin  = fill ? '0' : '';
    }
    return this;
  }

  getData() {
    const data   = {};
    const fields = this.getProperty('fields', []);
    fields.forEach(field => { data[field.name] = this.getFieldValue(field.name); });
    return data;
  }

  setData(data) {
    this.setProperty('data', data);
    const fields = this.getProperty('fields', []);
    fields.forEach(field => {
      if (data[field.name] !== undefined) this.setFieldValue(field.name, data[field.name]);
    });
    return this;
  }

  validateField(fieldName) {
    const fields = this.getProperty('fields', []);
    const field  = fields.find(f => f.name === fieldName);
    if (!field) return null;

    const value = this.getFieldValue(field.name);
    const data  = this.getData();

    // 1. required-проверка первой — останавливает дальнейшие валидаторы на пустом поле
    if (field.required) {
      const reqValidator = (field.validators || []).find(v => v.type === 'required');
      const message = reqValidator?.message || `${field.label} is required`;
      const error   = Validators.required(value, message);
      if (error) return error;
    }

    // 2. Именованные валидаторы из массива validators
    // Все ветки возвращают функцию (value, formData) => error|null —
    // единый интерфейс позволяет вызывать fn(value, data) без if/else
    if (field.validators && Array.isArray(field.validators)) {
      const msg = (v) => v.message;
      for (const validator of field.validators) {
        let fn = null;
        if      (validator.type === 'required')   fn = (v) => Validators.required(v, msg(validator));
        else if (validator.type === 'email')       fn = (v) => Validators.email(v, msg(validator));
        else if (validator.type === 'url')         fn = (v) => Validators.url(v, msg(validator));
        else if (validator.type === 'number')      fn = (v) => Validators.number(v, msg(validator));
        else if (validator.type === 'integer')     fn = (v) => Validators.integer(v, msg(validator));
        else if (validator.type === 'minLength')   fn = Validators.minLength(validator.min, msg(validator));
        else if (validator.type === 'maxLength')   fn = Validators.maxLength(validator.max, msg(validator));
        else if (validator.type === 'min')         fn = Validators.min(validator.min, msg(validator));
        else if (validator.type === 'max')         fn = Validators.max(validator.max, msg(validator));
        else if (validator.type === 'pattern')     fn = Validators.pattern(validator.regex, msg(validator));
        else if (validator.type === 'custom')      fn = Validators.custom(validator.fn, msg(validator));
        else if (validator.type === 'matches')     fn = Validators.matches(validator.field, msg(validator));

        if (fn) {
          const error = fn(value, data);
          if (error) return error;
        }
      }
    }

    // 3. Устаревший callback — для обратной совместимости со старым кодом
    if (field.validation) {
      const error = field.validation(value);
      if (error) return error;
    }

    return null;
  }

  validate() {
    const errors = {};
    const fields = this.getProperty('fields', []);
    fields.forEach(field => {
      const error = this.validateField(field.name);
      if (error) errors[field.name] = error;
    });
    this.setProperty('errors', errors);
    this.showErrors();
    return Object.keys(errors).length === 0;
  }

  getErrors() {
    return this.getProperty('errors', {});
  }

  showErrors() {
    const errors = this.getProperty('errors', {});

    // Сначала сбрасываем все ошибки — потом показываем только актуальные
    Object.keys(this.errorElements).forEach(name => {
      this.errorElements[name].textContent = '';
      this.errorElements[name].style.display = 'none';
      if (this.fieldInputs[name]) this.fieldInputs[name].removeClass('ui-input-error');
    });

    Object.keys(errors).forEach(name => {
      if (this.errorElements[name]) {
        this.errorElements[name].textContent = errors[name];
        this.errorElements[name].style.display = 'block';
      }
      if (this.fieldInputs[name]) this.fieldInputs[name].addClass('ui-input-error');
    });

    return this;
  }

  reset() {
    this.setProperty('data', {});
    this.setProperty('errors', {});
    this.showErrors();
    const fields = this.getProperty('fields', []);
    fields.forEach(field => {
      if (this.fieldInputs[field.name]) this.fieldInputs[field.name].clear();
    });
    return this;
  }

  clearErrors() {
    this.setProperty('errors', {});
    this.showErrors();
    return this;
  }

  render() {
    if (!this.element) return;
    if (this._renderSuspended()) return;

    this.element.innerHTML = '';
    this.fieldElements = {};
    this.fieldInputs   = {};
    this.errorElements = {};

    const fields = this.getProperty('fields', []);
    fields.forEach(field => this.element.appendChild(this._buildField(field)));

    return this;
  }

  /**
   * Создаёт DOM-группу для одного поля и регистрирует её в трёх Map.
   * Вынесено отдельно, чтобы вызываться и из addField() (инкрементально),
   * и из render() (полная перерисовка).
   */
  _buildField(field) {
    const group = document.createElement('div');
    group.className = 'ui-form-group';

    const label = new Label(field.label);
    if (field.required) {
      const required = document.createElement('span');
      required.className  = 'ui-form-required';
      required.textContent = ' *';
      label.element.appendChild(required);
    }
    group.appendChild(label.getDOMElement());

    const input = new Input(field.type, field.placeholder);
    input.setValue(field.value || '');
    this.fieldInputs[field.name] = input;

    const runValidation = () => {
      const error  = this.validateField(field.name);
      const errors = this.getProperty('errors', {});
      if (error) {
        errors[field.name] = error;
      } else {
        delete errors[field.name];
      }
      this.setProperty('errors', errors);
      this.showFieldError(field.name);
      this.emit('fieldvalidate', { field: field.name, error });
    };

    if (field.validationTrigger === 'change') input.on('change', runValidation);
    if (field.validationTrigger === 'blur')   input.getDOMElement().addEventListener('blur', runValidation);

    group.appendChild(input.getDOMElement());

    const errorElement = document.createElement('div');
    errorElement.className    = 'ui-form-error';
    errorElement.style.display = 'none';
    this.errorElements[field.name] = errorElement;
    group.appendChild(errorElement);

    this.fieldElements[field.name] = group;
    return group;
  }

  showFieldError(fieldName) {
    const errors       = this.getProperty('errors', {});
    const errorElement = this.errorElements[fieldName];
    const input        = this.fieldInputs[fieldName];

    if (errorElement) {
      if (errors[fieldName]) {
        errorElement.textContent    = errors[fieldName];
        errorElement.style.display = 'block';
      } else {
        errorElement.textContent    = '';
        errorElement.style.display = 'none';
      }
    }

    if (input) {
      if (errors[fieldName]) input.addClass('ui-input-error');
      else                    input.removeClass('ui-input-error');
    }
  }
}

export default Form;
