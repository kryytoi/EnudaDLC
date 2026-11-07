# Enuda Client — сайт

Лендинг для модификации **Enuda Client** — клиента для **Minecraft 1.21.11 (Fabric)**:
обходы античитов, оптимизация FPS, 184 модуля и ClickGUI в стиле **Material 3**.

Сайт статический: чистый HTML + CSS + JS, без сборки и зависимостей. Достаточно открыть
`index.html` или раздать папку любым статическим сервером.

## Структура

```
index.html                  разметка всех секций + SVG-спрайт иконок
assets/css/tokens.css       дизайн-токены Material 3 (цветовые роли, форма, типографика, моушен)
assets/css/components.css   M3-компоненты: кнопки, чипы, карточки, сегменты, свитчи, диалог, снекбар
assets/css/site.css         секции страницы: hero, обходы, FPS, модули, GUI, тарифы, отзывы, FAQ, футер
assets/js/modules-data.js   данные модулей и категорий клиента
assets/js/main.js           вся интерактивность
assets/img/                 фон hero, арт для bento-блока, favicon
```

## Локальный запуск

```bash
python3 -m http.server 5173
# http://localhost:5173
```

Подойдёт и `npx serve .`, и любой деплой на GitHub Pages / Netlify / Vercel без настроек.

## Что на странице

| Секция | Содержимое | Интерактив |
| --- | --- | --- |
| Hero | оффер, версия 1.21.11, счётчики, макет ClickGUI | анимированные цифры, parallax-свечение за курсором, живой FPS-счётчик |
| Обходы | матрица GrimAC / Matrix / Vulcan / NCP / Intave / Verus, серверы | статусы и версии патчей |
| Производительность | замеры «ванилла vs Enuda» по 4 сценариям | переключение сценариев, анимация баров, пресеты рендера с оценкой FPS |
| Модули | 24 карточки из 5 категорий | фильтры, поиск, рабочие свитчи |
| ClickGUI | интерактивный макет интерфейса | категории, включение модулей, слайдеры, 5 акцентных тем |
| Экосистема | облачные конфиги, скрипты на JS, HWID, лаунчер | — |
| Тарифы | Lite / Pro / Max | переключатель 30 дней / 90 дней / навсегда с пересчётом цен |
| Отзывы, FAQ | 6 отзывов, 7 вопросов | аккордеон |
| Догрузка | CTA + диалог выбора ОС | нативный `<dialog>`, снекбары |

## Material 3

- Полный набор цветовых ролей (`primary`, `secondary`, `tertiary`, `surface-container-*`,
  `outline*`, `error`) в `tokens.css`; тёмная тема по умолчанию, светлая — переключателем,
  выбор запоминается в `localStorage`.
- Шкала типографики M3 (`display`, `headline`, `title`, `body`, `label`), форма от 4 до 36 px,
  state-слои и ripple-эффект на всех кнопках.
- Компоненты: filled / tonal / outlined / text buttons, filter chips, segmented buttons,
  outlined search field, switches, cards (filled / outlined), dialog, snackbar, FAB, drawer.
- Учтён `prefers-reduced-motion`, есть focus-visible состояния и aria-атрибуты.

## Правки контента

- **Модули** — массив `ENUDA_MODULES` в `assets/js/modules-data.js`
  (`name`, `cat`, `desc`, `bind`, `on`, `tag`, `sliders`).
- **Цены** — объект `terms` в `assets/js/main.js` (ключи `30`, `90`, `forever`).
- **Замеры FPS** — объект `scenarios` и `presets` там же.
- **Цвета** — меняются в `tokens.css`; акцент демо-GUI — массив `accentThemes`.
- **Ссылки на оплату/соцсети** — заменить `href="#"` и обработчики `[data-plan]`.

## Дисклеймер

Проект не связан с Mojang Studios и Microsoft. Minecraft — торговая марка Mojang AB.
Упоминание античитов и серверов используется только для описания совместимости.
