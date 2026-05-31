/**
 * UIKit - Form Component
 * Form with fields, validation, and submission
 */

import { Base } from '../core/Base.js';
import { Input } from './Input.js';
import { Label } from './Label.js';
import { Button } from './Button.js';

export class Form extends Base {
  constructor() {
    super();
    this.createElement('form', 'ui-form');
    this.element.addEventListener('submit', (e) => e.preventDefault());

    this.setProperty('fields', []);
    this.setProperty('data', {});
    this.setProperty('errors', {});

    this.fieldElements = {};
    this.fieldInputs = {};
    this.errorElements = {};
  }

  /**
   * Add form field
   */
  addField(name, config = {}) {
    const field = {
      name: name,
      label: config.label || name,
      type: config.type || 'text',
      placeholder: config.placeholder || '',
      required: config.required || false,
      validation: config.validation || null,
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
   * Validate form
   */
  validate() {
    const errors = {};
    const fields = this.getProperty('fields', []);

    fields.forEach(field => {
      const value = this.getFieldValue(field.name);

      // Required validation
      if (field.required && (!value || value.trim() === '')) {
        errors[field.name] = `${field.label} is required`;
      }

      // Custom validation
      if (field.validation && !errors[field.name]) {
        const error = field.validation(value);
        if (error) {
          errors[field.name] = error;
        }
      }
    });

    this.setProperty('errors', errors);
    this.showErrors();

    return Object.keys(errors).length === 0;
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
}

export default Form;
