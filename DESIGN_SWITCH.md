# UIKit - Design System Guide

## 🎨 Доступные Темы

### 0. **Tabulator Dark** (ХАКЕРСКАЯ ЭСТЕТИКА!) 🟢⬛

Вдохновлена популярной библиотекой Tabulator - классический стиль "зелёное на чёрном".

**Файл:** `UIKit/styles/tabulator.css`

**Характеристики:**
- ✅ Яркий зелёный (#00d084) на чистом чёрном (#000000)
- ✅ Моноширинный шрифт (Courier New, Monaco)
- ✅ Светящиеся эффекты (glows) вокруг активных элементов
- ✅ Терминальный стиль (как хакерский интерфейс)
- ✅ Дотированные границы на ссылках
- ✅ Цветные text-shadow для свечения
- ✅ Красивые transitions и hover effects
- ✅ Прямоугольные фокусные outline (dashed)

**Цветовая палитра:**
- Основной: #00d084 (яркий зелёный)
- Фон: #000000 / #0a0a0a / #1a1a1a (чёрные оттенки)
- Текст: #00d084 (зелёный)
- Успех: #00ff00 (ещё ярче)
- Ошибка: #ff4444 (красный)
- Информация: #00ccff (голубой)

**Для кого:**
- Любителей классических хакерских интерфейсов
- Для ночной работы (не слепит глаза)
- Для production систем с "крутым" видом
- Для систем мониторинга и аналитики

**Пример использования:**
```html
<link rel="stylesheet" href="UIKit/styles/tabulator.css">
```

---

### 1. **Modern Design** (РЕКОМЕНДУЕТСЯ) ✨

Основана на **Ant Design 5.x** - лучшей дизайн-системе для бизнес приложений.

**Файл:** `UIKit/styles/modern.css`

**Характеристики:**
- ✅ Профессиональный синий цвет (#1677ff)
- ✅ Современные input поля с фокусом
- ✅ Красивые checkbox и radio buttons
- ✅ Элегантные table/grid с shadows
- ✅ Smooth transitions и hover effects
- ✅ Полная поддержка accessibility
- ✅ Dark mode ready (опционально)

**Цветовая палитра:**
- Основной: #1677ff (синий)
- Успех: #52c41a (зелёный)
- Предупреждение: #faad14 (жёлтый)
- Ошибка: #ff4d4f (красный)
- Текст: rgba(0,0,0,0.88)
- Фон: #ffffff / #fafafa

**Используется в:**
- index.html (по умолчанию)
- examples.html

---

### 2. **Classic Components** (СТАРЫЙ)

Исходный дизайн с простыми стилями.

**Файл:** `UIKit/styles/components.css`

**Когда использовать:**
- Для тестирования функциональности
- Если нужна минимальная стилизация
- Для backwards compatibility

---

## 🔄 Переключение между темами

### Способ 1: В HTML (Рекомендуется)

```html
<!-- Modern Design (Рекомендуется) -->
<link rel="stylesheet" href="UIKit/styles/modern.css">

<!-- OR -->

<!-- Classic Components -->
<link rel="stylesheet" href="UIKit/styles/components.css">
```

### Способ 2: Dynamic CSS Loading

```javascript
function switchTheme(themeName) {
  const themes = {
    'modern': 'UIKit/styles/modern.css',
    'classic': 'UIKit/styles/components.css'
  };

  const link = document.getElementById('theme-link');
  if (link) {
    link.href = themes[themeName];
  } else {
    const newLink = document.createElement('link');
    newLink.id = 'theme-link';
    newLink.rel = 'stylesheet';
    newLink.href = themes[themeName];
    document.head.appendChild(newLink);
  }
}

// Использование
switchTheme('modern');  // Переключить на Modern Design
switchTheme('classic'); // Переключить на Classic
```

### Способ 3: CSS Variables (Dark Mode)

```css
/* Light theme (по умолчанию) */
:root {
  --primary-color: #1677ff;
  --bg-white: #ffffff;
  --text-primary: rgba(0, 0, 0, 0.88);
}

/* Dark theme */
@media (prefers-color-scheme: dark) {
  :root {
    --primary-color: #177ddc;
    --bg-white: #141414;
    --text-primary: rgba(255, 255, 255, 0.88);
  }
}
```

---

## 📐 Design System Components

### Modern Design включает:

| Компонент | Размер | Радиус | Padding | Тень |
|-----------|--------|--------|---------|------|
| **Button** | 24px / 32px / 40px | 6px | 8-15px | shadow-sm |
| **Input** | 24px / 32px / 40px | 6px | 7-11px | на фокусе |
| **Checkbox** | 16x16 | 4px | - | - |
| **Tabs** | 14px | 8px (border-radius content) | 12-16px | - |
| **Grid** | 32px (default row) | 8px | 12px | shadow-sm |
| **Dialog** | 400px+ | 8px | 16px | shadow-lg |
| **Panel** | fluid | 8px | 16px | shadow-sm |

### Цветовые переменные CSS

Все переменные определены в `:root`:

```css
--primary-color: #1677ff;
--primary-hover: #4096ff;
--primary-active: #0958d9;

--success-color: #52c41a;
--warning-color: #faad14;
--error-color: #ff4d4f;

--text-primary: rgba(0, 0, 0, 0.88);
--text-secondary: rgba(0, 0, 0, 0.65);
--text-disabled: rgba(0, 0, 0, 0.25);

--border-color: #d9d9d9;
--bg-white: #ffffff;
--bg-light: #fafafa;
```

---

## 🎯 Рекомендации

### 🟢 Используйте Tabulator Dark если:
- Нужна хакерская/крутая эстетика
- Система мониторинга или real-time dashboard
- Работа ночью (не слепит глаза)
- Нужен низкий контраст но контрольный
- Нравится классический терминальный стиль
- Production система с "wow factor"
- Зелёное на чёрном - это ваш стиль

### ✅ Используйте Modern Design если:
- Это бизнес-приложение (ERP, CRM, IMS)
- Нужен профессиональный вид
- Требуется high-end UI/UX
- Пользователи ценят красоту
- Корпоративная среда
- Нужна максимальная читаемость днём

### ❌ Используйте Classic если:
- Это внутреннее тестирование
- Нужна минимальная стилизация
- Разработка функциональности
- Быстрое прототипирование

---

## 🌙 Dark Mode (Будущие возможности)

Dark mode готов к использованию через CSS Media Queries:

```css
@media (prefers-color-scheme: dark) {
  :root {
    --bg-white: #141414;
    --bg-light: #1f1f1f;
    --text-primary: rgba(255, 255, 255, 0.88);
    --border-color: #434343;
  }
}
```

Пользователь может включить через системные настройки или выбрать в приложении.

---

## 📱 Responsive Design

Modern CSS включает mobile-first подход:

```css
/* Base: Mobile first (14px font, 32px components) */

/* Tablet */
@media (min-width: 768px) {
  /* Larger padding, font sizes */
}

/* Desktop */
@media (min-width: 1024px) {
  /* Full layout with sidebars */
}
```

---

## 🧪 Протестировать дизайн

1. Откройте `examples.html`
2. Посмотрите все компоненты в Modern Design
3. Измените CSS ссылку на `components.css` чтобы увидеть Classic

```html
<link rel="stylesheet" href="UIKit/styles/modern.css">  <!-- Modern -->
<link rel="stylesheet" href="UIKit/styles/components.css">  <!-- Classic -->
```

---

## 📊 Сравнение дизайнов

| Аспект | Tabulator Dark | Modern | Classic |
|--------|----------------|--------|---------|
| Цвета | Зелёный (#00d084) на чёрном | Яркий синий (#1677ff) | Базовые цвета |
| Фон | Pure Black (#000000) | White (#ffffff) | White |
| Шрифт | Моноширинный (терминал) | Стандартный | Стандартный |
| Glows/Shadows | Зелёные свечения (glow) | Тени (shadow) | Нет |
| Text Effects | text-shadow свечение | Нет | Нет |
| Transitions | Smooth (0.15-0.25s) | Smooth (0.2-0.3s) | Basic |
| Border Radius | 2-4px (квадратный) | 4-8px (округлый) | 0-4px |
| Padding | Средний | Оптимальный | Минимальный |
| Accessibility | AAA | AAA | AA |
| Ночной режим | ✅ Отличный | ❌ Белый фон | ❌ Белый фон |
| Production Ready | ✅ Да | ✅ Да | ❌ Нет |
| Стиль | Хакерский/Крутой | Профессиональный | Простой |

---

## 🚀 Использование в разработке

```javascript
// app.js

import { Button, Input, Grid } from './UIKit/index.js';

// Все компоненты будут автоматически стилизованы
// согласно современному дизайну из modern.css

const btn = new Button('Click me', 'primary');
btn.render();

const input = new Input('text', 'Enter text...');
input.render();

// CSS классы будут применены автоматически:
// .ui-button.primary
// .ui-input
```

---

## ✨ Статус

**Modern Design:** ✅ Production-Ready

Используется в примерах, документации и рекомендуется для всех новых проектов.

---

**Выбирайте Modern Design для профессионального вида! 🎨**
