/* ============================================================
   ENUDA — данные модулей клиента
   ============================================================ */

const ENUDA_CATEGORIES = [
  { id: "combat", label: "Бой", icon: "i-cursor" },
  { id: "move", label: "Движение", icon: "i-rocket" },
  { id: "render", label: "Рендер", icon: "i-layers" },
  { id: "world", label: "Мир", icon: "i-server" },
  { id: "player", label: "Игрок", icon: "i-shield" }
];

const ENUDA_MODULES = [
  /* ---- combat ---- */
  {
    id: "aura", icon: "i-target", name: "Aura", cat: "combat", bind: "R", on: true, tag: "Legit",
    desc: "Атакует ближайшую цель плавными ротациями с проверкой видимости и тайминга удара.",
    sliders: [
      { label: "Радиус атаки", min: 1, max: 6, step: 0.1, value: 3.1, unit: "" },
      { label: "Скорость ротации", min: 1, max: 100, step: 1, value: 78, unit: "%" }
    ]
  },
  {
    id: "velocity", icon: "i-shield-off", name: "Velocity", cat: "combat", bind: "V", on: true,
    desc: "Снижает отбрасывание от ударов, оставляя физику валидной для сервера.",
    sliders: [
      { label: "Горизонталь", min: 0, max: 100, step: 1, value: 14, unit: "%" },
      { label: "Вертикаль", min: 0, max: 100, step: 1, value: 8, unit: "%" }
    ]
  },
  {
    id: "criticals", icon: "i-sword", name: "Criticals", cat: "combat", bind: "C", on: false,
    desc: "Критические удары пакетной анимацией прыжка — без прыжка на клиенте.",
    sliders: [{ label: "Задержка", min: 0, max: 1, step: 0.05, value: 0.6, unit: "с" }]
  },
  {
    id: "autototem", icon: "i-heart", name: "AutoTotem", cat: "combat", bind: "T", on: true,
    desc: "Мгновенно ставит тотем при падении здоровья и возвращает предмет обратно.",
    sliders: [{ label: "Порог HP", min: 1, max: 20, step: 0.5, value: 6, unit: "" }]
  },
  {
    id: "triggerbot", icon: "i-crosshair", name: "TriggerBot", cat: "combat", bind: "G", on: false,
    desc: "Атакует в момент, когда прицел целиком наведён на хитбокс.",
    sliders: [{ label: "Задержка удара", min: 0, max: 300, step: 5, value: 60, unit: "мс" }]
  },

  /* ---- move ---- */
  {
    id: "sprint", icon: "i-forward", name: "Sprint", cat: "move", bind: "—", on: true,
    desc: "Автоматический спринт с корректной обработкой замедлений и воды.",
    sliders: []
  },
  {
    id: "noslow", icon: "i-feather", name: "NoSlow", cat: "move", bind: "N", on: true,
    desc: "Убирает замедление при еде, блоке и натяжении лука.",
    sliders: [{ label: "Сила", min: 0, max: 100, step: 1, value: 100, unit: "%" }]
  },
  {
    id: "nofall", icon: "i-umbrella", name: "NoFall", cat: "move", bind: "F", on: false,
    desc: "Исключает урон от падения пакетной подменой состояния.",
    sliders: []
  },
  {
    id: "speed", icon: "i-wind", name: "Speed", cat: "move", bind: "S", on: false,
    desc: "Ускорение движения с валидацией под конкретный античит.",
    sliders: [{ label: "Множитель", min: 1, max: 2.5, step: 0.05, value: 1.25, unit: "x" }]
  },
  {
    id: "elytrafly", icon: "i-wings", name: "ElytraFly", cat: "move", bind: "E", on: false,
    desc: "Стабильный полёт на элитрах с предсказанием позиции.",
    sliders: [{ label: "Скорость", min: 0.5, max: 3, step: 0.1, value: 1.6, unit: "x" }]
  },

  /* ---- render ---- */
  {
    id: "esp", icon: "i-eye", name: "ESP", cat: "render", bind: "H", on: true, tag: "Обновлено",
    desc: "Подсветка игроков и мобов: боксы, скелет, цвет по дистанции.",
    sliders: [{ label: "Дистанция", min: 16, max: 128, step: 4, value: 64, unit: "м" }]
  },
  {
    id: "nametags", icon: "i-tag", name: "NameTags", cat: "render", bind: "—", on: true,
    desc: "Никнеймы с HP, бронёй, дистанцией и уроном по цели.",
    sliders: []
  },
  {
    id: "tracers", icon: "i-tracer", name: "Tracers", cat: "render", bind: "—", on: false,
    desc: "Линии от прицела к целям с настраиваемой толщиной.",
    sliders: [{ label: "Толщина", min: 1, max: 6, step: 0.5, value: 2, unit: "px" }]
  },
  {
    id: "norender", icon: "i-eye-off", name: "NoRender", cat: "render", bind: "—", on: true,
    desc: "Отключает лишние частицы, тряску камеры и экранные эффекты.",
    sliders: []
  },
  {
    id: "hud", icon: "i-layout", name: "HUD", cat: "render", bind: "—", on: true, tag: "Material 3",
    desc: "Модульный HUD с редактором сетки, скруглениями и темами.",
    sliders: [{ label: "Прозрачность", min: 10, max: 100, step: 1, value: 82, unit: "%" }]
  },

  /* ---- world ---- */
  {
    id: "scaffold", icon: "i-cube", name: "Scaffold", cat: "world", bind: "—", on: false,
    desc: "Ставит блоки под ноги с человеческими ротациями.",
    sliders: [{ label: "Задержка", min: 0, max: 5, step: 1, value: 2, unit: "тик" }]
  },
  {
    id: "autotool", icon: "i-pickaxe", name: "AutoTool", cat: "world", bind: "—", on: true,
    desc: "Выбирает лучший инструмент под блок и возвращает прошлый слот.",
    sliders: []
  },
  {
    id: "cheststealer", icon: "i-chest", name: "ChestStealer", cat: "world", bind: "—", on: false,
    desc: "Быстро забирает нужное из сундуков и шалкеров по фильтру.",
    sliders: [{ label: "Задержка", min: 20, max: 200, step: 10, value: 60, unit: "мс" }]
  },
  {
    id: "fastbreak", icon: "i-hammer", name: "FastBreak", cat: "world", bind: "—", on: false,
    desc: "Ускоряет ломание блоков в рамках допустимой погрешности.",
    sliders: [{ label: "Множитель", min: 1, max: 2, step: 0.05, value: 1.3, unit: "x" }]
  },
  {
    id: "autofarm", icon: "i-sprout", name: "AutoFarm", cat: "world", bind: "—", on: false,
    desc: "Автосбор ресурсов с профилями под популярные серверы.",
    sliders: []
  },

  /* ---- player ---- */
  {
    id: "autoauth", icon: "i-key", name: "AutoAuth", cat: "player", bind: "—", on: true,
    desc: "Автоввод пароля на серверах с /login и /register.",
    sliders: []
  },
  {
    id: "autorespawn", icon: "i-refresh", name: "AutoRespawn", cat: "player", bind: "—", on: true,
    desc: "Мгновенный респавн после смерти, без экрана.",
    sliders: []
  },
  {
    id: "nameprotect", icon: "i-mask", name: "NameProtect", cat: "player", bind: "—", on: false,
    desc: "Скрывает ваш ник в чате, HUD и таблице для скриншотов.",
    sliders: []
  },
  {
    id: "streamer", icon: "i-broadcast", name: "StreamerMode", cat: "player", bind: "—", on: false,
    desc: "Скрывает ники, IP-адреса и ключ лицензии в один клик.",
    sliders: []
  }
];
