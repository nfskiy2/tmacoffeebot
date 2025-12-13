# Coffee Shop TMA (SaaS)

White-label Telegram Mini App для кофеен. Проект построен как SaaS-решение, где один инстанс приложения обслуживает множество кофеен (тенантов) на основе конфигурации.

## Стек технологий

- **Core:** React 18, TypeScript, Vite
- **Architecture:** Feature-Sliced Design (Lite)
- **Styling:** Tailwind CSS, `clsx`, `tailwind-merge`
- **State Management:** Zustand (Client State), TanStack Query v5 (Server State)
- **UI/UX:** Framer Motion (Animations), Vaul (Drawers), Lucide React (Icons)
- **Validation:** Zod

## Быстрый старт

1. **Установка зависимостей:**
   ```bash
   npm install
   ```

2. **Запуск в режиме разработки:**
   ```bash
   npm run dev
   ```
   Приложение будет доступно по адресу `http://localhost:5173` (или другой порт).

3. **Сборка для продакшена:**
   ```bash
   npm run build
   ```

## Ключевые особенности

- **Мульти-тенанси:** Весь контент (меню, цвета, баннеры) зависит от заголовка `X-Shop-Id`.
- **Offline-ready корзина:** Состояние корзины сохраняется в `localStorage` и переживает перезагрузку.
- **Native Feel:** Использование плавных переходов, свайпаемых шторок и тактильного отклика (визуально) для ощущения нативного приложения.
- **Mock API:** Встроенный слой эмуляции бэкенда (`shared/api/client.ts`), работающий по контракту `BACKEND_SPECS.md`.

## Структура документации

- [Архитектура и структура папок](./ARCHITECTURE.md)
- [Данные и Состояние (API, Store)](./DATA_FLOW.md)
- [UI/UX и Дизайн-система](./UI_UX.md)
- [Контракт API (в корне)](../BACKEND_SPECS.md)
