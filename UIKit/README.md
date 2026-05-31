# UIKit - Modern JavaScript UI Library

**Minimal, modern, independent. No dependencies, no frameworks. Pure ES6+ JavaScript.**

Built from scratch (inspired by ActiveWidgets architecture, rewritten on ES6).

## Features

- ✅ **No dependencies** - Pure JavaScript, zero external libs
- ✅ **ES6+ modules** - Modern syntax, easy to understand
- ✅ **Full control** - Every line is visible and modifiable
- ✅ **Lightweight** - ~15KB total
- ✅ **Component based** - Reusable UI components
- ✅ **Event system** - Built-in event binding and custom events
- ✅ **Chainable API** - Fluent interface for easy use
- ✅ **Mobile friendly** - Responsive, touch-friendly
- ✅ **Styled** - Modern CSS with animations

## Components

### Base Class
```javascript
import { Base } from './UIKit/index.js';

const div = new Base();
div.createElement('div', 'my-container');
div.setStyle('color', 'red');
div.append(anotherElement);
div.show(); // or hide(), toggleClass(), etc.
```

### Button
```javascript
import { Button } from './UIKit/index.js';

const btn = new Button('Click me', () => {
  console.log('Clicked!');
});

btn.setType('primary'); // primary, danger, success, warning
btn.setSize('large');   // small, medium, large
btn.setDisabled(false);
document.body.appendChild(btn.getDOMElement());
```

### Input
```javascript
import { Input } from './UIKit/index.js';

const input = new Input('text', 'Enter name');
input.setValue('John');
input.on('change', (e) => {
  console.log('New value:', input.getValue());
});
```

### Label
```javascript
import { Label } from './UIKit/index.js';

const label = new Label('Username');
label.setFor('username-input');
```

### Table
```javascript
import { Table } from './UIKit/index.js';

const table = new Table();
table.setHeaders(['Name', 'Email', 'Age']);
table.setRows([
  ['John', 'john@example.com', 30],
  ['Jane', 'jane@example.com', 25]
]);

table.on('rowselect', (e) => {
  console.log('Selected row:', e.detail.data);
});
```

## API

### Common Methods (all components extend Base)

#### DOM Operations
```javascript
component.getDOMElement()      // Get native HTMLElement
component.createElement(tag, className)
component.append(child)        // Add child (UIKit component or HTMLElement)
component.remove(child)        // Remove child
component.clear()              // Clear all children
component.destroy()            // Destroy component
```

#### Styling
```javascript
component.setStyle(name, value)  // Set CSS style
component.getStyle(name)
component.addClass(className)    // Add CSS class
component.removeClass(className)
component.toggleClass(className)
```

#### Properties
```javascript
component.setProperty(name, value)  // Set internal state
component.getProperty(name, defaultValue)
```

#### Attributes
```javascript
component.setAttribute(name, value)
component.getAttribute(name)
```

#### Events
```javascript
component.on(eventName, handler)      // Bind event
component.off(eventName)              // Unbind event
component.emit(eventName, data)       // Trigger custom event
```

#### Visibility
```javascript
component.show()
component.hide()
component.isVisible()
```

## Example Usage

```javascript
import { Button, Input, Label, Table } from './UIKit/index.js';

// Create form
const form = new Base();
form.createElement('div', 'form');

const nameLabel = new Label('Name');
const nameInput = new Input('text', 'Enter name');
const submitBtn = new Button('Submit', () => {
  console.log('Name:', nameInput.getValue());
});

form.append(nameLabel);
form.append(nameInput);
form.append(submitBtn);

document.body.appendChild(form.getDOMElement());

// Create table
const table = new Table();
table.setHeaders(['Product', 'Price', 'Quantity']);
table.setRows([
  { name: 'Laptop', price: 999, qty: 5 },
  { name: 'Mouse', price: 29, qty: 50 }
]);

document.body.appendChild(table.getDOMElement());
```

## Styling

Import CSS:
```html
<link rel="stylesheet" href="UIKit/styles/components.css">
```

Or customize with CSS variables:
```css
:root {
  --primary-color: #1890ff;
  --success-color: #52c41a;
  --danger-color: #ff4d4f;
}
```

## Creating Custom Components

```javascript
import { Base } from './UIKit/index.js';

export class CustomComponent extends Base {
  constructor() {
    super();
    this.createElement('div', 'custom-component');
  }

  setData(data) {
    this.setProperty('data', data);
    this.render();
    return this;
  }

  render() {
    // Your rendering logic
    return this;
  }
}
```

## Why UIKit?

| Feature | UIKit | ActiveWidgets | React | Vue |
|---------|-------|---------------|-------|-----|
| Size | ~15KB | 152KB minified | 300KB+ | 200KB+ |
| Learning curve | Easy | Hard (minified) | Medium | Medium |
| Dependencies | None | None | Many | Many |
| Understanding | 100% | 0% (minified) | 50% | 50% |
| Flexibility | High | High (if you understand) | Medium | Medium |
| Performance | Excellent | Good | Good | Good |

## License

Free for any use. No dependencies, no restrictions.

---

**UIKit** - Simple. Modern. Yours.
