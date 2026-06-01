/**
 * UIKit - Built-in Validators
 * Email, required, min/max, pattern, minLength, custom
 */

export const Validators = {
  /**
   * Required validator
   */
  required: (value, message = 'This field is required') => {
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      return message;
    }
    return null;
  },

  /**
   * Email validator
   */
  email: (value, message = 'Invalid email address') => {
    if (!value) return null;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return message;
    }
    return null;
  },

  /**
   * Minimum length validator
   */
  minLength: (min, message = `Minimum ${min} characters required`) => {
    return (value) => {
      if (!value) return null;
      if (value.length < min) return message;
      return null;
    };
  },

  /**
   * Maximum length validator
   */
  maxLength: (max, message = `Maximum ${max} characters allowed`) => {
    return (value) => {
      if (!value) return null;
      if (value.length > max) return message;
      return null;
    };
  },

  /**
   * Minimum value validator (for numbers)
   */
  min: (minVal, message = `Minimum value is ${minVal}`) => {
    return (value) => {
      if (!value) return null;
      const num = parseFloat(value);
      if (isNaN(num) || num < minVal) return message;
      return null;
    };
  },

  /**
   * Maximum value validator (for numbers)
   */
  max: (maxVal, message = `Maximum value is ${maxVal}`) => {
    return (value) => {
      if (!value) return null;
      const num = parseFloat(value);
      if (isNaN(num) || num > maxVal) return message;
      return null;
    };
  },

  /**
   * Pattern validator (regex)
   */
  pattern: (regex, message = 'Invalid format') => {
    return (value) => {
      if (!value) return null;
      if (!regex.test(value)) return message;
      return null;
    };
  },

  /**
   * Custom validator function
   */
  custom: (fn, message = 'Invalid value') => {
    return (value) => {
      if (!fn(value)) return message;
      return null;
    };
  },

  /**
   * URL validator
   */
  url: (value, message = 'Invalid URL') => {
    if (!value) return null;
    try {
      new URL(value);
      return null;
    } catch {
      return message;
    }
  },

  /**
   * Number validator
   */
  number: (value, message = 'Must be a number') => {
    if (!value) return null;
    if (isNaN(parseFloat(value))) return message;
    return null;
  },

  /**
   * Integer validator
   */
  integer: (value, message = 'Must be an integer') => {
    if (!value) return null;
    if (!Number.isInteger(parseFloat(value))) return message;
    return null;
  },

  /**
   * Matches another field
   */
  matches: (fieldName, message = 'Fields do not match') => {
    return (value, formData) => {
      if (!value) return null;
      if (value !== formData?.[fieldName]) return message;
      return null;
    };
  }
};

export default Validators;
