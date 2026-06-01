/**
 * UIKit - Form Component
 * Form with fields, validation, and submission
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
    this.element.addEventListener('submit', (e) => {
      e.preventDefault();
      this.emit('submit', { data: this.getData(), valid: this.validate() });
    });

    this.setProperty('fields', []);
    this.setProperty('data', {});
    this.setProperty('errors', {});

    this.fieldElements = {};
    this.fieldInputs = {};
    this.errorElements = {};
  }

  /**
   * Add form field
   * validators: array of {type: 'required'|'email'|'min'|etc, message: 'Error message'}
   * validationTrigger: 'change'|'blur'|'submit' (default: 'submit')
   */
  addField(name, config = {}) {
    const field = {
      name: name,
      label: config.label || name,
      type: config.type || 'text',
      placeholder: config.placeholder || '',
      required: config.required || false,
      validation: config.validation || null,
      validators: config.validators || [],
      validationTrigger: config.validationTrigger || 'submit',
      value: config.value || '',
      ...config
    };

    const fields = this.getProperty('fields', []);
    fields.push(field);
    this.setProperty('fields', fields);

    this.render();
    return this;
  }

  /**
   * Remove field
   */
  removeField(name) {
    const fields = this.getProperty('fields', []).filter(f => f.name !== name);
    this.setProperty('fields', fields);
    this.render();
    return this;
  }

  /**
   * Set field value
   */
  setFieldValue(name, value) {
    const data = this.getProperty('data', {});
    data[name] = value;
    this.setProperty('data', data);

    if (this.fieldInputs[name]) {
      this.fieldInputs[name].setValue(value);
    }

    return this;
  }

  /**
   * Get field value
   */
  getFieldValue(name) {
    if (this.fieldInputs[name]) {
      return this.fieldInputs[name].getValue();
    }
    return this.getProperty('data', {})[name] || '';
  }

  /**
   * Get all form data
   */
  getData() {
    const data = {};
    const fields = this.getProperty('fields', []);

    fields.forEach(field => {
      data[field.name] = this.getFieldValue(field.name);
    });

    return data;
  }

  /**
   * Set form data
   */
  setData(data) {
    this.setProperty('data', data);

    const fields = this.getProperty('fields', []);
    fields.forEach(field => {
      if (data[field.name] !== undefined) {
        this.setFieldValue(field.name, data[field.name]);
      }
    });

    return this;
  }

  /**
   * Validate single field
   */
  validateField(fieldName) {
    const fields = this.getProperty('fields', []);
    const field = fields.find(f => f.name === fieldName);
    if (!field) return null;

    const value = this.getFieldValue(field.name);
    const data = this.getData();

    // Built-in required check
    if (field.required) {
      const error = Validators.required(value, `${field.label} is required`);
      if (error) return error;
    }

    // Validators array
    if (field.validators && Array.isArray(field.validators)) {
      for (const validator of field.validators) {
        let fn = null;

        if (validator.type === 'required') {
          fn = Validators.required;
        } else if (validator.type === 'email') {
          fn = Validators.email;
        } else if (validator.type === 'minLength') {
          fn = Validators.minLength(validator.min);
        } else if (validator.type === 'maxLength') {
          fn = Validators.maxLength(validator.max);
        } else if (validator.type === 'min') {
          fn = Validators.min(validator.min);
        } else if (validator.type === 'max') {
          fn = Validators.max(validator.max);
        } else if (validator.type === 'pattern') {
          fn = Validators.pattern(validator.regex);
        } else if (validator.type === 'url') {
          fn = Validators.url;
        } else if (validator.type === 'number') {
          fn = Validators.number;
        } else if (validator.type === 'integer') {
          fn = Validators.integer;
        } else if (validator.type === 'custom') {
          fn = Validators.custom(validator.fn);
        } else if (validator.type === 'matches') {
          fn = Validators.matches(validator.field);
        }

        if (fn) {
          const error = fn(value, data, validator.message);
          if (error) return error;
        }
      }
    }

    // Legacy custom validation
    if (field.validation) {
      const error = field.validation(value);
      if (error) return error;
    }

    return null;
  }

  /**
   * Validate form
   */
  validate() {
    const errors = {};
    const fields = this.getProperty('fields', []);

    fields.forEach(field => {
      const error = this.validateField(field.name);
      if (error) {
        errors[field.name] = error;
      }
    });

    this.setProperty('errors', errors);
    this.showErrors();

    return Object.keys(errors).length === 0;
  }

  /**
   * Get all errors
   */
  getErrors() {
    return this.getProperty('errors', {});
  }

  /**
   * Show validation errors
   */
  showErrors() {
    const errors = this.getProperty('errors', {});

    // Clear all errors first
    Object.keys(this.errorElements).forEach(name => {
      this.errorElements[name].textContent = '';
      this.errorElements[name].style.display = 'none';
      if (this.fieldInputs[name]) {
        this.fieldInputs[name].removeClass('ui-input-error');
      }
    });

    // Show new errors
    Object.keys(errors).forEach(name => {
      if (this.errorElements[name]) {
        this.errorElements[name].textContent = errors[name];
        this.errorElements[name].style.display = 'block';
      }
      if (this.fieldInputs[name]) {
        this.fieldInputs[name].addClass('ui-input-error');
      }
    });

    return this;
  }

  /**
   * Reset form
   */
  reset() {
    this.setProperty('data', {});
    this.setProperty('errors', {});
    this.showErrors();

    const fields = this.getProperty('fields', []);
    fields.forEach(field => {
      if (this.fieldInputs[field.name]) {
        this.fieldInputs[field.name].clear();
      }
    });

    return this;
  }

  /**
   * Clear errors
   */
  clearErrors() {
    this.setProperty('errors', {});
    this.showErrors();
    return this;
  }

  /**
   * Render form
   */
  render() {
    if (!this.element) return;

    this.element.innerHTML = '';
    this.fieldElements = {};
    this.fieldInputs = {};
    this.errorElements = {};

    const fields = this.getProperty('fields', []);

    fields.forEach(field => {
      // Form group container
      const group = document.createElement('div');
      group.className = 'ui-form-group';

      // Label
      const label = new Label(field.label);
      if (field.required) {
        const required = document.createElement('span');
        required.className = 'ui-form-required';
        required.textContent = ' *';
        label.element.appendChild(required);
      }
      group.appendChild(label.getDOMElement());

      // Input
      const input = new Input(field.type, field.placeholder);
      input.setValue(field.value || '');

      // Add to tracking
      this.fieldInputs[field.name] = input;

      // Validation on change
      if (field.validationTrigger === 'change') {
        input.on('change', () => {
          const error = this.validateField(field.name);
          const errors = this.getProperty('errors', {});

          if (error) {
            errors[field.name] = error;
          } else {
            delete errors[field.name];
          }

          this.setProperty('errors', errors);
          this.showFieldError(field.name);
          this.emit('fieldvalidate', { field: field.name, error });
        });
      }

      // Validation on blur
      if (field.validationTrigger === 'blur') {
        input.getDOMElement().addEventListener('blur', () => {
          const error = this.validateField(field.name);
          const errors = this.getProperty('errors', {});

          if (error) {
            errors[field.name] = error;
          } else {
            delete errors[field.name];
          }

          this.setProperty('errors', errors);
          this.showFieldError(field.name);
          this.emit('fieldvalidate', { field: field.name, error });
        });
      }

      group.appendChild(input.getDOMElement());

      // Error message
      const errorElement = document.createElement('div');
      errorElement.className = 'ui-form-error';
      errorElement.style.display = 'none';
      this.errorElements[field.name] = errorElement;
      group.appendChild(errorElement);

      // Store group
      this.fieldElements[field.name] = group;

      this.element.appendChild(group);
    });

    return this;
  }

  /**
   * Show/hide error for single field
   */
  showFieldError(fieldName) {
    const errors = this.getProperty('errors', {});
    const errorElement = this.errorElements[fieldName];
    const input = this.fieldInputs[fieldName];

    if (errorElement) {
      if (errors[fieldName]) {
        errorElement.textContent = errors[fieldName];
        errorElement.style.display = 'block';
      } else {
        errorElement.textContent = '';
        errorElement.style.display = 'none';
      }
    }

    if (input) {
      if (errors[fieldName]) {
        input.addClass('ui-input-error');
      } else {
        input.removeClass('ui-input-error');
      }
    }
  }
}

export default Form;
