# Відповідність завданню

| Завдання | Реалізація |
| --- | --- |
| 1. Налаштування | Vite, React, Router, Tailwind 3, PostCSS, MUI + Emotion, Sass; тема й імпорти стилів |
| 2. Header | `Header.module.scss`, `Navigation.module.scss`: sticky, blur, nesting, змінні, hover-lift, badge animation, меню, пошук, сповіщення, обране, кошик із сумою, профіль, бургер |
| 3. FilterSidebar | MUI Accordion, Checkbox, Slider 0–50000, Autocomplete з 20 брендами, Rating 3/4/5, Button; лічильники категорій/фільтрів; Drawer на мобільних |
| 4. ProductCard | Тільки Tailwind utility classes; grid/list, масштабування фото, NEW/SALE/TOP, рейтинг і відгуки, старі/нові ціни, кошик, обране, quick view, порівняння |
| 5. Catalog | Tailwind layout, breadcrumbs, кількість результатів, 5 сортувань, grid/list, responsive 1/2/3/4 колонки, пагінація по 12, порожні результати, комбіновані URL-фільтри |
| 6. ProductDetail | CSS Modules для верхньої частини; MUI Tabs з описом, таблицею, відгуками, доставкою; варіанти, кількість, кошик, купити зараз, обране, порівняння; Tailwind-рекомендації |
| 7. ImageGallery | CSS Modules, 4 зображення, активні thumbnails, hover zoom, MUI lightbox, стрілки й клавіатура |
| 8. Cart | MUI List/кнопки/Collapse; CSS Modules для layout та підсумків; опції, кількість, видалення, undo Snackbar, промокод, доставка, total, localStorage |
| 9. Wishlist | Звичайний SCSS; grid, видалення, додати всі, copy link, спільний список; variables, nesting, mixins, function, lighten/darken, partial @import |
| 10. Footer | Звичайний CSS; компанія, швидкі посилання, контакти, соціальні іконки, copyright, responsive |
| 11. Hooks | `useCart`, `useWishlist`, `useFilters`, `usePersistentState`; стан кошика через reducer, спільний Context, localStorage |
| 12. Mock дані | 120 товарів, 6 категорій по 20 товарів, 20 брендів, ціни 500–50000 ₴, рейтинги 3–5, badges, кольори, розміри та пам’ять |

## Опціональні можливості

| Можливість | Реалізація |
| --- | --- |
| Quick View | Material UI Dialog |
| Порівняння | До 4 товарів, CSS Grid + CSS Modules, виділення відмінностей, фільтр відмінностей |
| Autocomplete search | MUI; товари, бренди, категорії; підсвічування знайденого тексту |
| Toast | MUI Snackbar + Alert; undo для кошика |
| Responsive | 320, 768, 1024, 1440 px; кнопки для touch, бургер та панель фільтрів |
| Темна тема | CSS Variables, ThemeProvider, збереження вибору |

Моделі є навчальними. Реальної оплати й серверної авторизації завдання не вимагає; оформлення та профіль реалізовані як локальні демонстрації.
