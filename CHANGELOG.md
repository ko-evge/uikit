# Changelog

All notable changes to UIKit will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned Features
- Virtual Scrolling Optimization for 100K+ rows
- ARIA Labels & Accessibility enhancements
- Documentation website

---

## [1.1.0] - 2026-06-01

Reliability release. Backward compatible — no breaking API changes.

### Fixed
- **Event system recursion** — `emit()` no longer dispatches on the DOM bus, so
  custom events can never collide with native events of the same name. Fixes
  "too much recursion" crashes in Input, Textarea, Checkbox, Link, Combo, Tabs, List.
- **`enableMouseEvents()`** is now a safe no-op; native mouse events are bridged
  automatically by `on()`.
- **Form validators** — custom messages for `required/email/url/number/integer`
  are now honored (previously ignored; `required` could return an object).
- **DateFormatter** — date-only strings (`YYYY-MM-DD`) and the `ISO` preset are
  parsed/formatted in local time; no more off-by-one day in non-UTC timezones.
- **`UIKit.*` factory helpers** (`button`, `input`, `div`, `h1`…) now work
  (were throwing `X is not defined` due to re-export-only bindings).
- **Grid** — corrected mouse-event delegation names (`dblclick`/`mouseover`/…);
  fixed a `thead` ReferenceError in the virtual-scroll path.
- **Table** — row selection is scoped to its own table.
- **List** — `setMultiSelect()` clears stale selection.
- **Combo** — removed a duplicate `getSelectedOption()`.
- **Listener leaks** — `document`/container listeners in Dropdown, DatePicker,
  Grid, Combo are bound once and removed on `destroy()`.

### Added
- **Batched rendering** — `beginUpdate()` / `endUpdate()` on every component;
  multiple setters render once. Calls nest safely.
- **Lifecycle** — `destroy()` removes tracked global listeners, recursively
  destroys children, detaches the element, and is idempotent. Added `isDestroyed()`.
- **Error isolation** — a throwing event listener is routed to `handle(error, ctx)`
  and never breaks sibling listeners or internal flow.
- **`off(eventName, handler?)`** can remove a specific handler.

### Changed
- `index.d.ts` rewritten to match the real API (removed phantom methods such as
  `Input.setRequired`, `Panel.getBody`, `Tabs.selectTab`, `HTMLFormatter.escapeHtml`).

### Verified
- 123 assertions pass in a real DOM (jsdom) across 5 timezones; all modules pass
  `node --check`; `index.d.ts` compiles under `tsc --strict`.

---

## [1.0.0] - 2026-06-01

### Added

#### Components (16 total)
- **Button** - Primary, default, danger types with sizes (small, medium, large)
- **Input** - Text, email, number, password, date with filled/underlined variants
- **Label** - Form labels with required indicator
- **Textarea** - Multi-line text input with row/column control
- **Checkbox** - Single/multiple selection
- **RadioButton** - Exclusive selection groups
- **Dropdown** - Select single option from list
- **Combo** - Searchable dropdown with async support
- **List** - Scrollable list with single/multi-select
- **DatePicker** - Date selection with min/max constraints
- **Grid** - Advanced table with sorting, filtering, inline editing
- **Dialog** - Modal dialogs (custom, alert, confirm)
- **Panel** - Container with header, body, footer
- **Tabs** - Tabbed interface with dynamic content
- **Link** - Styled hyperlinks
- **Table** - Simple table component

#### Features
- **Form Validation System** (12 validators)
  - Built-in: required, email, minLength, maxLength, min, max, pattern, url, number, integer, matches, custom
  - Validation triggers: change, blur, submit
  - Field-level validation events
  - Real-time error display with animations

- **Grid Sorting UI**
  - Click headers to sort (asc → desc → none cycle)
  - Sort indicators (↑ ↓)
  - Three-state sorting cycle
  - sortchange event emission
  - getSortState(), setSortColumn(), clearSort() methods

- **Grid Filtering UI**
  - Filter button (⚙️) on each column header
  - 9 filter operators: equals, contains, startsWith, endsWith, >, <, >=, <=, between
  - Multiple filters with AND logic
  - Filter popup UI
  - filterchange event emission
  - addFilter(), removeFilter(), getFilters(), clearFilters() methods

- **Async Operations**
  - Combo with async search (setAsyncSearch)
  - Configurable debounce (default 300ms)
  - Minimum character threshold (minChars)
  - Server-side search support

- **Inline Editing**
  - Double-click cells to edit
  - Enter to save, Esc to cancel
  - Per-column editability control
  - celledit event emission

- **Column Management**
  - Resizable columns (drag to resize)
  - columnresize event
  - Column width persistence
  - sortable per-column toggle
  - filterable per-column toggle

- **Theme System**
  - Modern Design theme (Ant Design 5.x style)
  - Tabulator theme (terminal/hacker style)
  - Active Widgets theme
  - CSS variables for customization
  - Consistent color palette across themes

- **Pagination & Virtual Scrolling**
  - Page-based navigation
  - Virtual scrolling for large datasets
  - Configurable page size
  - rowHeight control for virtual scroll

#### API Improvements
- Base component class with property system
- Event emission (emit/on pattern)
- chainable methods (return this)
- Formatter support for Grid columns
- Custom validators
- Dynamic field management

#### Documentation
- 50+ live examples in examples.html
- Event summary documentation
- Component API reference
- Grid events guide
- Theme switching guide
- Modern Design guide
- Tabulator theme guide

### Changed
- None (initial release)

### Fixed
- None (initial release)

### Security
- No external dependencies (ES6 modules only)
- No security vulnerabilities in dependencies
- Safe HTML rendering
- Input sanitization support

### Browser Support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Android)

### File Size
- UIKit/index.js: ~20KB
- All CSS themes: ~50KB combined
- Total: ~70KB uncompressed

### Performance
- No re-renders on property change (pure events)
- Efficient DOM updates
- Virtual scrolling support for 100K+ rows
- CSS Grid layout for performance

---

## Future Versions

### [1.1.0] - Planned
- Virtual Scrolling Optimization
- ARIA Labels & Accessibility
- TypeScript definitions
- Unit tests (70%+ coverage)
- Documentation website

### [1.2.0] - Planned
- Toast notifications
- Tooltip/Popover components
- Range slider
- File upload
- Color picker

### [2.0.0] - Planned (major)
- Framework integrations (React, Vue, Angular)
- Build system (Vite bundler)
- Build output (UMD, ESM, CJS)
- Tree component
- Advanced grid features (grouping, pivoting)

---

## Installation

```bash
npm install @evge/uikit
```

## Usage

```javascript
import { Button, Input, Form, Grid } from '@evge/uikit';

// Create a button
const btn = new Button('Click me', () => console.log('clicked'));
btn.setType('primary');
document.body.appendChild(btn.getDOMElement());
```

## License

MIT - See LICENSE file for details

---

## Contributors

- Initial release: 2026-06-01
- Community contributions welcome!

See CONTRIBUTING.md for guidelines.
