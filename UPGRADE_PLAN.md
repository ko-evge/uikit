# UIKit Upgrade Plan - ActiveWidgets Level

## Priority Order & Effort

### PHASE 1: Critical Components (4-5 hours)
- [ ] Checkbox (30 min)
- [ ] RadioButton (30 min)
- [ ] Tabs (1 hour)
- [ ] Link (15 min)
- [ ] Formatters (Number, Date, HTML) (1.5 hours)

### PHASE 2: Advanced Features (4-5 hours)
- [ ] Inline Grid Editing (2 hours)
- [ ] Column Resizing (1.5 hours)
- [ ] List Component (1 hour)

### PHASE 3: Performance & UX (4-5 hours)
- [ ] Virtual Scrolling (2 hours)
- [ ] Keyboard Navigation (1.5 hours)
- [ ] Advanced Combo (1 hour)

### PHASE 4: Nice-to-Have (2-3 hours)
- [ ] Column Reordering (1 hour)
- [ ] Multiple Themes (1 hour)
- [ ] Accessibility (ARIA labels) (1 hour)

## Total: ~14-16 hours of development

---

## Implementation Status

```
Phase 1:
[ ] Checkbox.js
[ ] RadioButton.js
[ ] Tabs.js
[ ] Link.js
[ ] Formatters.js

Phase 2:
[ ] Grid inline editing
[ ] Grid column resize
[ ] List.js

Phase 3:
[ ] Grid virtual scroll
[ ] Keyboard navigation
[ ] Advanced Combo.js

Phase 4:
[ ] Column reorder
[ ] Themes
[ ] Accessibility
```

---

## What We Skip (by choice)
- ❌ Tree component (not needed for IMS)
- ❌ Browser detection (modern only)
- ❌ IE compatibility (not needed)
- ❌ Templates system (can use formatters instead)
- ❌ Data binding (use API layer instead)
