# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project: IMS 2 - Inventory Management System

**Philosophy:** Modern, minimal, independent. Full control, zero dependencies.

Custom ES6 JavaScript frontend (UIKit) + PHP backend. No frameworks, no build tools, no npm.

---

## High-Level Architecture

### Frontend Stack
- **UIKit** - Custom ES6 UI component library (~16 components)
- **ES6 Modules** - Code organization via import/export
- **Fetch API** - HTTP communication with backend
- **No build tools** - Works directly in browser

### Backend Stack
- **PHP** - REST API endpoints (server.php)
- **MySQL** - Data storage
- **Action-based routing** - POST to server.php with ?action=name

### Data Flow
```
Browser (ES6 modules)
    ↓ Fetch JSON POST
server.php (REST API)
    ↓ SQL queries
MySQL database
```

---

## Project Structure

```
ims2/
├── UIKit/                           # Custom UI component library
│   ├── core/
│   │   └── Base.js                 # Base class for all components
│   ├── ui/                         # 16 component implementations
│   │   ├── Button.js, Input.js, Label.js, Table.js
│   │   ├── Grid.js                 # Advanced table with sorting/filtering/pagination
│   │   ├── Panel.js, Dialog.js, Form.js
│   │   ├── DatePicker.js, Dropdown.js, Textarea.js
│   │   ├── Checkbox.js, RadioButton.js, Tabs.js, Link.js
│   │   ├── Combo.js                # Input with autocomplete
│   │   └── List.js                 # Scrollable list with selection
│   ├── formatters/
│   │   └── Formatters.js           # NumberFormatter, DateFormatter, HTMLFormatter, StringFormatter
│   ├── styles/
│   │   ├── modern.css              # Ant Design inspired (blue on white) ← PRIMARY
│   │   ├── tabulator.css           # Terminal style (green on black)
│   │   └── components.css          # Original style (minimal)
│   └── index.js                    # Library entry point - exports all components
│
├── app.js                          # Main application logic (uses UIKit)
├── api.js                          # Fetch wrapper - API.call(), API.docs, API.refs, API.auth
├── server.php                      # Backend REST API - handles all HTTP requests
├── index.html                      # HTML entry point - loads app.js as ES6 module
├── style.css                       # Application-level styles
├── examples.html                   # Live examples of all UIKit components
│
├── DESIGN_SWITCH.md                # How to switch between 3 CSS themes
├── MODERN_DESIGN_GUIDE.md          # Ant Design system details
├── TABULATOR_GUIDE.md              # Terminal/Tabulator Dark theme guide
├── GRID_EVENTS.md                  # Complete Grid event reference (24+ events)
├── UIKIT_EVENTS_SUMMARY.md         # Event summary for all components
└── README.md                       # Main documentation
```

---

## UIKit Component System

### Base Class (`UIKit/core/Base.js`)
- All components inherit from Base
- Provides: `createElement()`, `setProperty()`, `getProperty()`, `on()`, `emit()`
- Event system: custom event listeners (emit/on pattern)
- Properties system: state management via properties

### Component Pattern
```javascript
import { Base } from '../core/Base.js';

export class MyComponent extends Base {
  constructor() {
    super();
    this.createElement('div', 'my-component-class');
    this.setProperty('value', null);
  }

  setValue(value) {
    this.setProperty('value', value);
    return this; // Chainable
  }

  getValue() {
    return this.getProperty('value');
  }
}
```

### Event System
```javascript
// Listen to events
component.on('change', (data) => {
  console.log('Event data:', data);
});

// Emit events
this.emit('change', { value: newValue });
```

### Key Components

**Grid** - Most complex component
- Sorting, filtering, pagination (50 rows default)
- Multi-select with checkboxes
- Inline cell editing (double-click to edit)
- Column resizing (drag on header)
- Keyboard navigation (arrow keys, Space, Enter, Home/End)
- Virtual scrolling support (partial - for 10K+ rows)
- Events: 24+ (rowClick, cellClick, cellEdit, selectionchange, etc.)
- Formatters: NumberFormatter, DateFormatter, HTMLFormatter, StringFormatter

**Combo** - Input with autocomplete
- Real-time filtering as user types
- Keyboard navigation (↑↓ Enter Esc)
- Match highlighting

**Dialog** - Modal windows
- Header, body, footer sections
- Close button
- Modal backdrop

**Tabs** - Tabbed interface
- Add/remove tabs dynamically
- Events on tab change

---

## CSS Theming System

### 3 Complete Themes

1. **Modern Design** (Ant Design inspired) ← **PRIMARY**
   - File: `UIKit/styles/modern.css` (~900 lines)
   - Colors: Blue (#1677ff) on white (#ffffff)
   - Professional, business-focused
   - Used in index.html by default
   - Accessibility: AAA compliant

2. **Tabulator Dark** (Terminal/hacker style)
   - File: `UIKit/styles/tabulator.css` (~1200 lines)
   - Colors: Green (#00d084) on black (#000000)
   - Monospace font (Courier New/Monaco)
   - Glowing effects, uppercase text
   - Ideal for night work, dashboards

3. **Classic** (Original minimal)
   - File: `UIKit/styles/components.css`
   - Basic styling for functionality

### Switching Themes
```html
<!-- In index.html, change this line: -->
<link rel="stylesheet" href="UIKit/styles/modern.css">  <!-- Modern (default) -->
<link rel="stylesheet" href="UIKit/styles/tabulator.css"> <!-- Terminal style -->
<link rel="stylesheet" href="UIKit/styles/components.css"> <!-- Classic -->
```

### CSS Variables
All themes use CSS custom properties (--primary-color, --bg-white, etc.). Can be overridden in custom CSS.

---

## API System (`api.js`)

### Structure
- `API.call(action, params)` - POST request to server.php?action=name
- `API.auth` - Login/logout (returns user data + token)
- `API.docs` - Document CRUD (get, getAll, add, update, delete)
- `API.refs` - Reference lookup (search, get, add, update, delete)

### Usage
```javascript
// Login
const user = await API.auth.login(username, password);

// Get documents
const docs = await API.docs.getAll();

// Search references
const results = await API.refs.search('sprps', 'search_text');

// Generic action
const result = await API.call('my_action', { param: value });
```

### Backend (`server.php`)
- Routes based on `?action=name` query parameter
- Field mapping: kd_dk→code, dt_dk→date, kd_ps→supplier, text→comment
- Automatic primary key detection
- Returns JSON responses

---

## Common Development Tasks

### Run the Application
```bash
# Server must be running (PHP + MySQL)
# Open in browser: http://localhost/ims2/
```

### View Component Examples
```bash
# Open examples.html in browser to see all 16 components with live examples
# http://localhost/ims2/examples.html
```

### Add a New Component
1. Create `UIKit/ui/MyComponent.js` extending Base
2. Export in `UIKit/index.js`
3. Add CSS to theme files (modern.css, tabulator.css, components.css)
4. Add to examples.html for testing

### Add New Page/Feature
1. Create method in `App` class (app.js)
2. Use UIKit components
3. Call API methods as needed
4. Update menu in showMenu()

### Add Backend Endpoint
1. Add `case 'action_name':` in server.php
2. Execute SQL query
3. Return JSON response
4. Call with `API.call('action_name', params)` from frontend

### Switch CSS Theme
Edit index.html line 9 to load different CSS file (modern.css, tabulator.css, or components.css)

---

## Important Implementation Details

### No Build Step Required
- Direct ES6 module imports work in modern browsers
- No transpilation, no bundling
- All code visible and modifiable

### Database Credentials
Edit in server.php (lines 14-17):
```php
$host = 'localhost';
$db = 'msdata1';
$user = 'root';
$pass = 'pointer9';
```

### Component Initialization Pattern
Components don't auto-render. Must call:
1. Create component: `const btn = new Button('text')`
2. Configure: `btn.setType('primary')`
3. Append to DOM: `container.appendChild(btn.element)` or `container.append(btn)`

### Form Integration
Form component uses dynamic field generation:
```javascript
const form = new Form();
form.addField('name', 'text', 'Name', true); // name, type, label, required
form.addField('date', 'date', 'Date', false);
form.on('submit', (data) => console.log(data));
```

### Grid Usage Pattern
```javascript
const grid = new Grid();
grid.setHeaders([
  { key: 'id', label: 'ID' },
  { key: 'name', label: 'Name', sortable: true }
]);
grid.setRows(data);
grid.on('rowselect', (e) => console.log(e.row));
grid.on('celledit', (e) => console.log(e.value));
```

---

## Git & Version Control

Repository initialized with initial commit documenting:
- Complete UIKit with 3 CSS themes
- All 16 components with full styling
- 24+ Grid events
- 5 documentation files
- Status: PRODUCTION-READY

---

## Documentation Files

- **GRID_EVENTS.md** - Complete reference for 24+ Grid events with payloads
- **MODERN_DESIGN_GUIDE.md** - Ant Design system colors, sizes, spacing, component specs
- **TABULATOR_GUIDE.md** - Terminal theme guide with color scheme and usage examples
- **DESIGN_SWITCH.md** - How to switch between themes, comparison table
- **UIKIT_EVENTS_SUMMARY.md** - Event summary for all components
- **README.md** - General project overview and getting started

---

## Key Decisions & Patterns

1. **No frameworks** - Pure ES6 JS gives maximum control
2. **CSS themes over JS styling** - All styling in CSS, not component properties
3. **Event-driven** - Components communicate via events, not parent-child coupling
4. **Action-based API** - All backend routes via single ?action= parameter
5. **Chainable setters** - All setter methods return `this` for fluent API
6. **Property-based state** - Use getProperty/setProperty for all internal state
7. **Inline editing in Grid** - Double-click cells, Enter/Esc to save/cancel
8. **Keyboard nav in Grid** - Arrow keys, Space, Home/End support

---

## When to Modify

- **Add UI feature** → Create UIKit component or add to app.js
- **Add backend logic** → Add case in server.php, export as API method
- **Change appearance** → Modify CSS theme files (modern.css, tabulator.css, components.css)
- **Add new data** → Create API endpoint, then add UI to display it
- **Fix a bug** → Check app.js, APIKit component, or server.php depending on layer

---

## Next Development Phases

Development roadmap:
- Phase 1 ✅ - Core components (Button, Input, CheckBox, RadioButton, Tabs, Link, Formatters, Combo)
- Phase 1+ ✅ - Combo with autocomplete
- Phase 2 ✅ - List, Inline Grid Editing, Column Resizing
- Phase 3 ✅ - Keyboard Navigation (complete), Virtual Scrolling (complete)
- Phase 4 🔄 - Advanced features (column reordering, async filters, multi-select, virtualization enhancements)

---

**Last Updated:** May 31, 2026  
**Status:** PRODUCTION-READY ✨
