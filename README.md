# IMS 2 - Inventory Management System

**Modern, minimal, independent. Full control, zero dependencies.**

Built with **UIKit** - custom ES6 JavaScript UI library. No React, no frameworks, no complexity.

## Architecture

```
Frontend (UIKit + ES6 JavaScript)
├─ UIKit/                  ← Custom UI library
│  ├─ core/               ← Base class (inheritance)
│  ├─ ui/                 ← Components (Button, Input, Table, etc.)
│  └─ styles/             ← CSS for components
├─ app.js                 ← Application logic (uses UIKit)
├─ api.js                 ← Fetch API wrapper
├─ index.html             ← Entry point
└─ style.css              ← App styles

        ↓ Fetch JSON (POST)

Backend (PHP)
├─ server.php             ← REST API endpoints
└─ MySQL database         ← Data storage
```

## What's Different from Old IMS?

| Aspect | Old IMS | IMS 2 |
|--------|---------|-------|
| UI Library | Large 3rd-party library (152KB) | UIKit (custom, ~15KB) |
| Code style | Old JavaScript (var, callbacks) | Modern ES6+ (const, async/await) |
| Complexity | High (hard to understand) | Low (easy to modify) |
| Dependencies | Old frameworks, browser hacks | None (pure vanilla JS) |
| Control | Limited (minified code) | Complete (all code visible) |
| Learning curve | Steep | Easy |
| Customization | Difficult | Simple |

## Project Structure

```
ims2/
├── UIKit/                   # UI Component Library
│   ├── core/
│   │   └── Base.js         # Base class for all components
│   ├── ui/
│   │   ├── Button.js       # Button component
│   │   ├── Input.js        # Input component
│   │   ├── Label.js        # Label component
│   │   └── Table.js        # Table component
│   ├── styles/
│   │   └── components.css  # Component styles
│   ├── index.js            # Library entry point
│   └── README.md           # UIKit documentation
│
├── index.html              # HTML entry point
├── app.js                  # Main application (ES6 module)
├── api.js                  # API wrapper (fetch)
├── server.php              # Backend REST API
├── style.css               # App styles
├── README.md               # This file
└── ActiveWidgets/          # Old source code (reference only)
```

## Getting Started

### 1. Setup

```bash
# No installation needed! Just open in browser
# Ensure PHP is running on your server
```

### 2. Update Database Connection

Edit `server.php`:
```php
$host = 'localhost';
$db = 'msdata1';
$user = 'root';
$pass = 'pointer9';
```

### 3. Open in Browser

```
http://localhost/ims2/index.html
```

## Using UIKit Components

### Create a Button

```javascript
import { Button } from './UIKit/index.js';

const btn = new Button('Click me', () => {
  console.log('Clicked!');
});

btn.setType('primary');
btn.setDisabled(false);

container.append(btn);
```

### Create an Input

```javascript
import { Input } from './UIKit/index.js';

const input = new Input('text', 'Enter name');
input.setValue('John');
input.on('change', (e) => {
  console.log('Value:', input.getValue());
});
```

### Create a Table

```javascript
import { Table } from './UIKit/index.js';

const table = new Table();
table.setHeaders(['Name', 'Email', 'Age']);
table.setRows([
  ['John', 'john@example.com', 30],
  ['Jane', 'jane@example.com', 25]
]);

table.on('rowselect', (e) => {
  console.log('Selected:', e.detail.data);
});
```

## API Calls

### Login

```javascript
const user = await API.auth.login('username', 'password');
// Returns: { kdus, im_p, token }
```

### Get Documents

```javascript
const docs = await API.docs.getAll(kdus);
// Returns: Array of documents
```

### Search References

```javascript
const results = await API.refs.search('sprps', 'search term');
// Returns: Array of matching records
```

## Features

✅ **No build tools** - Works in any browser, no npm needed  
✅ **No dependencies** - Pure vanilla JavaScript  
✅ **ES6 modules** - Modern code organization  
✅ **Async/await** - Modern async handling  
✅ **Event system** - Custom events support  
✅ **Responsive** - Mobile-friendly UI  
✅ **Full source** - All code visible and modifiable  
✅ **REST API** - Clean backend interface  

## Development

### Add a New Component

Create `UIKit/ui/MyComponent.js`:

```javascript
import { Base } from '../core/Base.js';

export class MyComponent extends Base {
  constructor() {
    super();
    this.createElement('div', 'my-component');
  }

  setData(data) {
    this.setProperty('data', data);
    return this;
  }
}
```

Export from `UIKit/index.js`:

```javascript
export { MyComponent } from './ui/MyComponent.js';
```

### Add a New Page

Create a new method in `app.js`:

```javascript
showMyPage: () => {
  const content = document.getElementById('content');
  content.innerHTML = '';

  const title = new Base();
  title.createElement('h2');
  title.element.textContent = 'My Page';

  const contentDiv = new Base();
  contentDiv.createElement('div');
  contentDiv.append(title);

  content.appendChild(contentDiv.getDOMElement());
}
```

### Add API Endpoint

Add to `server.php`:

```php
case 'my_action':
  $result = $conn->query("SELECT ...");
  $response['success'] = true;
  $response['data'] = $result->fetchAll();
  break;
```

Call from frontend:

```javascript
const result = await API.call('my_action', { param: 'value' });
```

## Philosophy

**Simple > Complex**
- No build tools, no transpilers
- No frameworks or libraries (except what we wrote)
- No magic or hidden logic
- Complete understanding and control

## Next Steps

1. ✅ Basic auth and menu structure
2. ✅ UIKit library (Button, Input, Table)
3. ⭕ Documents: list, add, edit, delete
4. ⭕ References: search, add, edit
5. ⭕ Warehouse: stock management
6. ⭕ Reports and analytics

## Troubleshooting

### Components not showing?
- Check that UIKit/styles/components.css is loaded
- Check browser console for errors
- Verify UIKit paths in imports

### API calls failing?
- Check server.php database credentials
- Verify API endpoint matches your data
- Check browser Network tab in DevTools

### Styling issues?
- Clear browser cache (Ctrl+Shift+Delete)
- Check CSS specificity
- Use browser DevTools to inspect elements

## Resources

- **UIKit Documentation**: `UIKit/README.md`
- **Component Examples**: See `app.js` for usage patterns
- **CSS Classes**: See `UIKit/styles/components.css`
- **Old ActiveWidgets**: `ActiveWidgets/` folder (reference only)

## License

Free for any use. No restrictions, no dependencies.

---

**IMS 2** - Made for control and clarity.
