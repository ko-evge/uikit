/**
 * UIKit - Data Formatters
 * Format numbers, dates, HTML content
 */

/**
 * Number formatter
 * @example
 * NumberFormatter.format(1234.56, 'USD') => '$1,234.56'
 * NumberFormatter.format(1234.56, 'EUR') => '€1.234,56'
 * NumberFormatter.format(1234567, 'INT') => '1,234,567'
 * NumberFormatter.format(0.123, 'PCT') => '12.30%'
 */
export const NumberFormatter = {
  /**
   * Format number with options
   */
  format(value, options = 'INT') {
    if (value === null || value === undefined) return '';

    const num = parseFloat(value);
    if (isNaN(num)) return value;

    // Preset formats
    if (typeof options === 'string') {
      switch (options) {
        case 'USD':
          return '$' + num.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        case 'EUR':
          return '€' + num.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        case 'INT':
          return num.toLocaleString('en-US', { maximumFractionDigits: 0 });
        case 'RUB':
          return '₽' + num.toLocaleString('ru-RU', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
        case 'PCT':
          return (num * 100).toFixed(2) + '%';
        case 'DECIMAL':
          return num.toFixed(2);
        default:
          return num.toString();
      }
    }

    // Custom options object
    const opts = {
      currency: null,
      decimals: 0,
      thousands: ',',
      decimal: '.',
      ...options
    };

    let formatted = num.toFixed(opts.decimals);
    const parts = formatted.split('.');

    // Add thousands separator
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, opts.thousands);

    formatted = parts.join(opts.decimal);

    if (opts.currency) {
      const symbols = {
        'USD': '$',
        'EUR': '€',
        'GBP': '£',
        'JPY': '¥',
        'RUB': '₽',
        'INR': '₹'
      };
      formatted = (symbols[opts.currency] || opts.currency) + formatted;
    }

    return formatted;
  },

  /**
   * Parse formatted number back to numeric value
   */
  parse(formatted) {
    if (!formatted) return 0;
    // Remove currency symbols and separators
    return parseFloat(formatted.replace(/[^\d.-]/g, ''));
  }
};

/**
 * Date formatter
 * @example
 * DateFormatter.format('2026-05-31', 'DD/MM/YYYY') => '31/05/2026'
 * DateFormatter.format('2026-05-31', 'LONG') => 'May 31, 2026'
 * DateFormatter.format('2026-05-31', 'SHORT') => '5/31/2026'
 */
export const DateFormatter = {
  /**
   * Format date with pattern
   */
  format(date, pattern = 'YYYY-MM-DD') {
    if (!date) return '';

    let d;
    if (typeof date === 'string') {
      // Parse a date-only string (YYYY-MM-DD) as LOCAL time. Passing it to
      // `new Date(str)` interprets it as UTC midnight, which shifts the day
      // backwards in timezones west of UTC when read via getDate()/getMonth().
      const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
      d = m ? new Date(+m[1], +m[2] - 1, +m[3]) : new Date(date);
    } else {
      d = date;
    }
    if (isNaN(d.getTime())) return date;

    const pad = (n) => String(n).padStart(2, '0');

    // Preset patterns
    switch (pattern) {
      case 'ISO':
        // Local Y-M-D (not toISOString, which converts to UTC and can shift the day)
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
      case 'LONG':
        return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
      case 'SHORT':
        return d.toLocaleDateString('en-US');
      case 'TIME':
        return d.toLocaleTimeString('en-US');
      case 'DATETIME':
        return d.toLocaleString('en-US');
      default:
        // Custom pattern
        let result = pattern;
        result = result.replace(/YYYY/g, d.getFullYear());
        result = result.replace(/YY/g, String(d.getFullYear()).slice(-2));
        result = result.replace(/MMMM/g, d.toLocaleString('en-US', { month: 'long' }));
        result = result.replace(/MMM/g, d.toLocaleString('en-US', { month: 'short' }));
        result = result.replace(/MM/g, pad(d.getMonth() + 1));
        result = result.replace(/M/g, d.getMonth() + 1);
        result = result.replace(/DD/g, pad(d.getDate()));
        result = result.replace(/D/g, d.getDate());
        result = result.replace(/dddd/g, d.toLocaleString('en-US', { weekday: 'long' }));
        result = result.replace(/ddd/g, d.toLocaleString('en-US', { weekday: 'short' }));
        result = result.replace(/HH/g, pad(d.getHours()));
        result = result.replace(/mm/g, pad(d.getMinutes()));
        result = result.replace(/ss/g, pad(d.getSeconds()));
        return result;
    }
  },

  /**
   * Parse date string
   */
  parse(dateString, pattern = 'YYYY-MM-DD') {
    if (!dateString) return null;
    return new Date(dateString);
  }
};

/**
 * HTML formatter - escape/unescape HTML
 */
export const HTMLFormatter = {
  /**
   * Escape HTML special characters
   */
  escape(html) {
    if (!html) return '';
    const map = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    };
    return String(html).replace(/[&<>"']/g, m => map[m]);
  },

  /**
   * Unescape HTML entities
   */
  unescape(html) {
    if (!html) return '';
    const textarea = document.createElement('textarea');
    textarea.innerHTML = html;
    return textarea.value;
  },

  /**
   * Sanitize HTML - remove scripts and dangerous attributes
   */
  sanitize(html) {
    if (!html) return '';
    const div = document.createElement('div');
    div.innerHTML = html;

    // Remove script tags and event handlers
    const scripts = div.querySelectorAll('script');
    scripts.forEach(s => s.remove());

    // Remove dangerous attributes
    div.querySelectorAll('*').forEach(el => {
      const attrs = el.attributes;
      for (let i = attrs.length - 1; i >= 0; i--) {
        const attr = attrs[i];
        if (attr.name.startsWith('on')) {
          el.removeAttribute(attr.name);
        }
      }
    });

    return div.innerHTML;
  }
};

/**
 * String formatter
 */
export const StringFormatter = {
  /**
   * Capitalize string
   */
  capitalize(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  },

  /**
   * Convert to uppercase
   */
  upper(str) {
    return str ? str.toUpperCase() : '';
  },

  /**
   * Convert to lowercase
   */
  lower(str) {
    return str ? str.toLowerCase() : '';
  },

  /**
   * Truncate string with ellipsis
   */
  truncate(str, length = 50) {
    if (!str || str.length <= length) return str;
    return str.substr(0, length) + '...';
  },

  /**
   * Repeat string
   */
  repeat(str, count = 1) {
    return str ? str.repeat(count) : '';
  },

  /**
   * Pad string
   */
  pad(str, length = 10, char = ' ', side = 'right') {
    if (!str) return '';
    const strLen = str.length;
    if (strLen >= length) return str;

    const padLen = length - strLen;
    const padding = char.repeat(padLen);

    return side === 'left' ? padding + str : str + padding;
  }
};

export default {
  NumberFormatter,
  DateFormatter,
  HTMLFormatter,
  StringFormatter
};
