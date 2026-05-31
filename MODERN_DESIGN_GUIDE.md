# UIKit - Modern Design System (Ant Design inspired)

## 🎨 Дизайн Философия

Базируется на **Ant Design** - лучшая дизайн-система для бизнес приложений (используется в 1000+ компаний).

**Принципы:**
- ✅ Минимализм и функциональность
- ✅ Читаемость и доступность
- ✅ Консистентность через весь UI
- ✅ Отзывчивость и интерактивность
- ✅ Поддержка light/dark тем

---

## 📐 Общие параметры

### Цветовая палитра

```css
/* Primary colors (Синий - как в Ant Design) */
--primary-color: #1677ff;      /* Основной цвет */
--primary-hover: #4096ff;      /* Hover состояние */
--primary-active: #0958d9;     /* Active состояние */

/* Semantic colors */
--success-color: #52c41a;      /* Успех/Готово */
--warning-color: #faad14;      /* Предупреждение */
--error-color: #ff4d4f;        /* Ошибка/Опасно */
--info-color: #1677ff;         /* Информация */

/* Grayscale */
--text-primary: rgba(0, 0, 0, 0.88);      /* Основной текст */
--text-secondary: rgba(0, 0, 0, 0.65);    /* Вторичный текст */
--text-disabled: rgba(0, 0, 0, 0.25);     /* Отключён */
--border-color: #d9d9d9;                  /* Границы */
--bg-light: #fafafa;                      /* Светлый фон */
--white: #ffffff;

/* Dark mode (опционально) */
--dark-bg: #141414;
--dark-text: rgba(255, 255, 255, 0.88);
--dark-border: #434343;
```

### Размеры

```css
/* Font sizes */
--font-h1: 38px;
--font-h2: 30px;
--font-h3: 24px;
--font-h4: 20px;
--font-h5: 16px;
--font-h6: 14px;
--font-body: 14px;
--font-small: 12px;

/* Component sizes */
--size-lg: 40px;    /* Large components */
--size-md: 32px;    /* Medium (default) */
--size-sm: 24px;    /* Small */
--size-xs: 16px;    /* Extra small */

/* Spacing */
--spacing-xs: 4px;
--spacing-sm: 8px;
--spacing-md: 12px;
--spacing-lg: 16px;
--spacing-xl: 24px;
--spacing-2xl: 32px;

/* Border radius */
--radius-none: 0;
--radius-sm: 4px;
--radius-md: 6px;
--radius-lg: 8px;

/* Shadows */
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.03), 
             0 1px 6px -1px rgba(0, 0, 0, 0.02),
             0 2px 4px 0 rgba(0, 0, 0, 0.02);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1),
             0 2px 4px -2px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1),
             0 4px 6px -4px rgba(0, 0, 0, 0.1);
```

### Анимации

```css
/* Transitions */
--transition-fast: 0.2s ease;
--transition-normal: 0.3s ease;
--transition-slow: 0.5s ease;
```

---

## 🔘 Компонент: Button

### Дизайн

**5 типов:**
- **Primary** - главное действие (синий фон)
- **Default** - обычная кнопка (прозрачный, серая граница)
- **Dashed** - дополнительная (пунктирная граница)
- **Text** - текстовая (только текст)
- **Link** - ссылка (как текст, но синий)

**4 модификатора:**
- `danger` - опасная операция (красный)
- `ghost` - прозрачный (для чёрного фона)
- `disabled` - отключена
- `loading` - загрузка (с иконкой)

### CSS

```css
.ui-button {
  /* Base styles */
  padding: 8px 15px;
  font-size: 14px;
  line-height: 1.5;
  border-radius: 6px;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.3s ease;
  white-space: nowrap;
  
  /* Default state */
  background: #ffffff;
  color: rgba(0, 0, 0, 0.88);
  border-color: #d9d9d9;
  
  /* Hover */
  &:hover:not(:disabled) {
    border-color: #4096ff;
    color: #4096ff;
  }
  
  /* Active */
  &:active:not(:disabled) {
    border-color: #0958d9;
    color: #0958d9;
  }
  
  /* Disabled */
  &:disabled {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
}

/* Primary variant */
.ui-button.primary {
  background: #1677ff;
  color: #ffffff;
  border-color: #1677ff;
  
  &:hover:not(:disabled) {
    background: #4096ff;
    border-color: #4096ff;
  }
  
  &:active:not(:disabled) {
    background: #0958d9;
    border-color: #0958d9;
  }
}

/* Danger variant */
.ui-button.danger {
  &:not(.primary) {
    color: #ff4d4f;
    border-color: #ff4d4f;
  }
  
  &.primary {
    background: #ff4d4f;
    border-color: #ff4d4f;
  }
}

/* Small/Large sizes */
.ui-button.small {
  padding: 4px 11px;
  font-size: 12px;
  height: 24px;
}

.ui-button.large {
  padding: 12px 15px;
  font-size: 16px;
  height: 40px;
}
```

---

## 📝 Компонент: Input

### Варианты

- **Outlined** (по умолчанию) - граница вокруг
- **Filled** - заполненный фон
- **Borderless** - без границ
- **Underlined** - только нижняя граница

### CSS

```css
.ui-input {
  width: 100%;
  padding: 7px 11px;
  font-size: 14px;
  line-height: 1.5;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background: #ffffff;
  color: rgba(0, 0, 0, 0.88);
  transition: all 0.2s ease;
  
  /* Placeholder */
  &::placeholder {
    color: rgba(0, 0, 0, 0.25);
  }
  
  /* Focus */
  &:focus {
    outline: none;
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }
  
  /* Hover */
  &:hover:not(:focus) {
    border-color: #4096ff;
  }
  
  /* Disabled */
  &:disabled {
    background: rgba(0, 0, 0, 0.04);
    color: rgba(0, 0, 0, 0.25);
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  
  /* Error state */
  &.error {
    border-color: #ff4d4f;
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(255, 77, 79, 0.1);
    }
  }
  
  /* Warning state */
  &.warning {
    border-color: #faad14;
    
    &:focus {
      box-shadow: 0 0 0 2px rgba(250, 173, 20, 0.1);
    }
  }
}

/* Filled variant */
.ui-input.filled {
  background: #fafafa;
  border-color: transparent;
  
  &:hover:not(:focus) {
    background: #f0f0f0;
  }
  
  &:focus {
    background: #ffffff;
    border-color: #1677ff;
  }
}

/* Underlined variant */
.ui-input.underlined {
  border: none;
  border-bottom: 1px solid #d9d9d9;
  border-radius: 0;
  padding-left: 0;
  padding-right: 0;
  
  &:focus {
    border-bottom-color: #1677ff;
    box-shadow: none;
  }
}

/* Sizes */
.ui-input.large {
  padding: 11px 15px;
  font-size: 16px;
  height: 40px;
}

.ui-input.small {
  padding: 4px 7px;
  font-size: 12px;
  height: 24px;
}
```

---

## ☑️ Компонент: Checkbox

### Дизайн

- Размер: 16x16 или 20x20 (36x36 с padding для мобиля)
- Скругление: 4px
- При выборе: заливка синим, галочка белым

### CSS

```css
.ui-checkbox-wrapper {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  user-select: none;
}

.ui-checkbox-input {
  appearance: none;
  -webkit-appearance: none;
  width: 16px;
  height: 16px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  background: #ffffff;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
  flex-shrink: 0;
  
  /* Hover */
  &:hover {
    border-color: #4096ff;
  }
  
  /* Checked */
  &:checked {
    background: #1677ff;
    border-color: #1677ff;
  }
  
  /* Checked + Hover */
  &:checked:hover {
    background: #4096ff;
    border-color: #4096ff;
  }
  
  /* Checkmark */
  &:checked::after {
    content: '✓';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    color: #ffffff;
    font-size: 12px;
    font-weight: bold;
  }
  
  /* Disabled */
  &:disabled {
    background: rgba(0, 0, 0, 0.04);
    border-color: #d9d9d9;
    cursor: not-allowed;
  }
  
  &:disabled:checked {
    background: rgba(0, 0, 0, 0.15);
    border-color: rgba(0, 0, 0, 0.15);
  }
}

.ui-checkbox-label {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  
  span {
    color: rgba(0, 0, 0, 0.88);
  }
}
```

---

## 📊 Компонент: Grid/Table

### Дизайн

- Header: светлый серый фон (#fafafa)
- Rows: чередующиеся (опционально)
- Hover: светлый синий (#f0f7ff)
- Selected: более интенсивный синий (#e6f4ff)
- Borders: лёгкие (#f0f0f0)
- Padding: 12px (medium)

### CSS

```css
.ui-grid {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  overflow: hidden;
}

.ui-grid-header {
  background: #fafafa;
  color: rgba(0, 0, 0, 0.88);
}

.ui-grid-header th {
  padding: 12px;
  font-weight: 600;
  font-size: 14px;
  text-align: left;
  border-bottom: 1px solid #f0f0f0;
  white-space: nowrap;
  user-select: none;
}

.ui-grid-row {
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s ease;
  
  /* Hover */
  &:hover {
    background: #f0f7ff;
  }
  
  /* Selected */
  &.selected {
    background: #e6f4ff;
  }
  
  /* Alternate rows (опционально) */
  &:nth-child(odd) {
    background: #ffffff;
  }
  
  &:nth-child(even) {
    background: #fafafa;
  }
}

.ui-grid-row td {
  padding: 12px;
  color: rgba(0, 0, 0, 0.88);
  font-size: 14px;
}

/* Checkbox в Grid */
.ui-grid-row td:first-child {
  width: 50px;
  text-align: center;
  padding: 12px;
}

.ui-grid-row input[type="checkbox"] {
  width: 16px;
  height: 16px;
  cursor: pointer;
  accent-color: #1677ff;
}

/* Keyboard focus */
.ui-grid-row.keyboard-focus {
  outline: 2px solid #1677ff;
  outline-offset: -2px;
  background: #e6f4ff;
}

/* Column resizer */
.ui-grid-resizer {
  position: absolute;
  right: -4px;
  top: 0;
  height: 100%;
  width: 8px;
  cursor: col-resize;
  user-select: none;
  
  &:hover {
    background: #1677ff;
    opacity: 0.5;
  }
}

/* Pagination */
.ui-grid-pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  
  button {
    /* Use button styles above */
  }
}
```

---

## 📋 Компонент: Tabs

### Дизайн

- Активная вкладка: синий цвет и нижняя линия
- Неактивная: серая
- Hover: светлый фон
- Плавный переход между вкладками

### CSS

```css
.ui-tabs {
  width: 100%;
}

.ui-tabs-header {
  display: flex;
  border-bottom: 1px solid #f0f0f0;
  background: #ffffff;
  overflow-x: auto;
}

.ui-tabs-button {
  padding: 12px 16px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  position: relative;
  transition: color 0.2s ease;
  white-space: nowrap;
  
  /* Hover */
  &:hover {
    color: rgba(0, 0, 0, 0.88);
  }
  
  /* Active */
  &.active {
    color: #1677ff;
    font-weight: 600;
    
    /* Underline */
    &::after {
      content: '';
      position: absolute;
      bottom: -1px;
      left: 0;
      right: 0;
      height: 2px;
      background: #1677ff;
    }
  }
}

.ui-tabs-content {
  padding: 16px;
  background: #ffffff;
  min-height: 200px;
  animation: fadeIn 0.3s ease;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

.ui-tabs-panel {
  display: none;
  
  &.active {
    display: block;
  }
}
```

---

## 📥 Компонент: Combo (Dropdown с поиском)

### Дизайн

- Использует Input стиль для поля
- Dropdown меню: с shadows, 4-6px border-radius
- Hover на элементе: светлый фон
- Selected: синий фон

### CSS

```css
.ui-combo-wrapper {
  position: relative;
  width: 100%;
}

.ui-combo-input {
  /* Use input styles from above */
  padding: 7px 11px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  
  &:focus {
    border-color: #1677ff;
    box-shadow: 0 0 0 2px rgba(22, 119, 255, 0.1);
  }
}

.ui-combo-menu {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background: #ffffff;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  max-height: 300px;
  overflow-y: auto;
  z-index: 1000;
  
  /* Empty state */
  &:empty {
    display: none;
  }
}

.ui-combo-item {
  padding: 8px 12px;
  cursor: pointer;
  transition: background 0.2s ease;
  color: rgba(0, 0, 0, 0.88);
  
  /* Hover */
  &:hover {
    background: #f0f7ff;
  }
  
  /* Selected */
  &.selected {
    background: #e6f4ff;
    color: #1677ff;
    font-weight: 600;
  }
  
  /* Highlight match */
  strong {
    color: #1677ff;
    font-weight: 600;
  }
}

.ui-combo-no-results {
  padding: 12px;
  text-align: center;
  color: rgba(0, 0, 0, 0.45);
}
```

---

## 📝 Компонент: Dialog/Modal

### Дизайн

- White background (#ffffff)
- Shadow: хорошо видимая (#0 10px 15px...)
- Border-radius: 8px
- Backdrop: полупрозрачный (#rgba(0,0,0,0.45))
- Close button: в углу

### CSS

```css
.ui-dialog-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.45);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1050;
  animation: fadeIn 0.2s ease;
}

.ui-dialog {
  background: #ffffff;
  border-radius: 8px;
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  max-width: 90%;
  max-height: 90vh;
  overflow: auto;
  animation: slideUp 0.3s ease;
  
  @media (min-width: 576px) {
    min-width: 400px;
  }
}

.ui-dialog-header {
  padding: 16px;
  border-bottom: 1px solid #f0f0f0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ui-dialog-title {
  font-size: 18px;
  font-weight: 600;
  color: rgba(0, 0, 0, 0.88);
}

.ui-dialog-close {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: rgba(0, 0, 0, 0.45);
  
  &:hover {
    color: rgba(0, 0, 0, 0.88);
  }
}

.ui-dialog-body {
  padding: 16px;
}

.ui-dialog-footer {
  padding: 16px;
  border-top: 1px solid #f0f0f0;
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🎨 Применение к проекту

Обновить `/home/evge/Desktop/ims2/UIKit/styles/components.css` с:

1. CSS переменные (в :root)
2. Базовые стили для каждого компонента
3. Светлую и тёмную тему (опционально)
4. Responsive breakpoints

---

## 📚 Ссылки на источники

- [Ant Design Button Component](https://ant.design/components/button/)
- [Ant Design Input Component](https://ant.design/components/input/)
- [Ant Design Table Component](https://ant.design/components/table/)
- [Best CSS Checkbox Designs 2026](https://uicookies.com/css-checkbox/)
- [Modern CSS Techniques 2025](https://moderncss.dev/)

---

**Статус:** Готово к применению ✨
