
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

## ⚠️ Для Backend Разработчика

Фронтенд полностью готов к интеграции с реальным API.

1. **Контракт API:**
   Пожалуйста, строго следуйте спецификации в файле [BACKEND_SPECS.md](../BACKEND_SPECS.md).
   Фронтенд использует `Zod` для валидации ответов. Если API вернет структуру, отличную от спецификации, приложение выбросит ошибку.

2. **Multi-tenancy:**
   Все запросы (кроме `/shops`) содержат заголовок `X-Shop-Id`. Вы должны использовать его для изоляции данных (меню, заказы) между разными кофейнями.

3. **Цены:**
   Все цены передаются и ожидаются в **копейках/центах** (Integer).
   *Пример:* `150.00 RUB` -> `15000`.

4. **Эмуляция (Mock):**
   Сейчас приложение работает на моках (`shared/api/mocks`). Чтобы переключиться на реальный бэкенд, достаточно установить переменную окружения `VITE_API_URL` и убрать логику `mockRouter` в `shared/api/client.ts`.

## Структура документации

- [Архитектура и структура папок](./ARCHITECTURE.md)
- [Данные и Состояние (API, Store)](./DATA_FLOW.md)
- [UI/UX и Дизайн-система](./UI_UX.md)
- [Контракт API (в корне)](../BACKEND_SPECS.md)
