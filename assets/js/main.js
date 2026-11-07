/* ============================================================
   ENUDA — site behaviour
   ============================================================ */
(() => {
  "use strict";

  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------------------------------------------------
     Snackbar
     --------------------------------------------------------- */
  const snackbar = $("#snackbar");
  let snackTimer;
  function showSnack(message) {
    if (!snackbar) return;
    snackbar.textContent = message;
    snackbar.classList.add("is-visible");
    clearTimeout(snackTimer);
    snackTimer = setTimeout(() => snackbar.classList.remove("is-visible"), 3200);
  }

  /* ---------------------------------------------------------
     Ripple
     --------------------------------------------------------- */
  document.addEventListener("pointerdown", (e) => {
    const host = e.target.closest(".ripple");
    if (!host || reduced) return;
    const rect = host.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const wave = document.createElement("span");
    wave.className = "ripple-wave";
    wave.style.width = wave.style.height = `${size}px`;
    wave.style.left = `${e.clientX - rect.left - size / 2}px`;
    wave.style.top = `${e.clientY - rect.top - size / 2}px`;
    host.appendChild(wave);
    wave.addEventListener("animationend", () => wave.remove());
  });

  /* ---------------------------------------------------------
     Theme
     --------------------------------------------------------- */
  const themeToggle = $("#themeToggle");
  const themeMeta = $('meta[name="theme-color"]');

  function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem("enuda-theme", theme);
    if (themeMeta) themeMeta.content = theme === "dark" ? "#0b0f0d" : "#f6fbf6";
  }

  const savedTheme = localStorage.getItem("enuda-theme");
  if (savedTheme) {
    applyTheme(savedTheme);
  } else if (window.matchMedia("(prefers-color-scheme: light)").matches) {
    applyTheme("light");
  }

  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    showSnack(next === "dark" ? "Тёмная тема включена" : "Светлая тема включена");
  });

  /* ---------------------------------------------------------
     App bar / scroll progress / FAB
     --------------------------------------------------------- */
  const appbar = $("#appbar");
  const scrollBar = $("#scrollBar");
  const toTop = $("#toTop");

  const onScroll = () => {
    const y = window.scrollY;
    appbar?.classList.toggle("is-scrolled", y > 12);
    toTop?.classList.toggle("is-visible", y > 700);
    const max = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar) scrollBar.style.width = `${max > 0 ? (y / max) * 100 : 0}%`;
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  toTop?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" }));

  /* ---------------------------------------------------------
     Mobile drawer
     --------------------------------------------------------- */
  const drawer = $("#navDrawer");
  const drawerScrim = $("#drawerScrim");
  const menuToggle = $("#menuToggle");
  const menuClose = $("#menuClose");

  function setDrawer(open) {
    if (!drawer) return;
    drawer.classList.toggle("is-open", open);
    drawer.setAttribute("aria-hidden", String(!open));
    menuToggle?.setAttribute("aria-expanded", String(open));
    document.body.classList.toggle("is-locked", open);
    if (drawerScrim) {
      clearTimeout(setDrawer.scrimTimer);
      if (open) drawerScrim.hidden = false;
      requestAnimationFrame(() => drawerScrim.classList.toggle("is-visible", open));
      if (!open) {
        setDrawer.scrimTimer = setTimeout(() => {
          drawerScrim.hidden = true;
        }, 280);
      }
    }
    if (open) $("#menuClose")?.focus(); else menuToggle?.focus();
  }

  menuToggle?.addEventListener("click", () => setDrawer(true));
  menuClose?.addEventListener("click", () => setDrawer(false));
  drawerScrim?.addEventListener("click", () => setDrawer(false));
  $$("#navDrawer a").forEach((a) => a.addEventListener("click", () => setDrawer(false)));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && drawer?.classList.contains("is-open")) setDrawer(false);
  });

  /* ---------------------------------------------------------
     Active nav link
     --------------------------------------------------------- */
  const navLinks = $$(".nav__link");
  const sections = navLinks
    .map((link) => ({ link, el: $(link.getAttribute("href")) }))
    .filter((s) => s.el);

  if (sections.length) {
    const navObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((l) => l.classList.remove("is-current"));
          const active = sections.find((s) => s.el === entry.target);
          active?.link.classList.add("is-current");
        });
      },
      { rootMargin: "-45% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((s) => navObserver.observe(s.el));
  }

  /* ---------------------------------------------------------
     Reveal on scroll
     --------------------------------------------------------- */
  const revealItems = $$(".reveal");
  revealItems.forEach((el) => {
    const d = Number(el.dataset.delay || 0);
    if (d) el.style.setProperty("--reveal-delay", `${d * 80}ms`);
  });

  if (reduced || !("IntersectionObserver" in window)) {
    revealItems.forEach((el) => el.classList.add("is-in"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-in");
          observer.unobserve(entry.target);
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
    );
    revealItems.forEach((el) => revealObserver.observe(el));
  }

  /* ---------------------------------------------------------
     Animated counters
     --------------------------------------------------------- */
  const counters = $$(".stat__num");
  const animateCount = (el) => {
    const target = Number(el.dataset.count || 0);
    const suffix = el.dataset.suffix || "";
    const duration = 1500;
    const start = performance.now();
    const fmt = (n) => n.toLocaleString("ru-RU").replace(/\u00A0/g, " ");

    if (reduced) {
      el.textContent = fmt(target) + suffix;
      return;
    }

    const step = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      el.textContent = fmt(Math.round(target * eased)) + suffix;
      if (p < 1) requestAnimationFrame(step);
      else el.textContent = fmt(target) + suffix;
    };
    requestAnimationFrame(step);
  };

  if (counters.length && "IntersectionObserver" in window && !reduced) {
    const countObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animateCount(entry.target);
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.5 }
    );
    counters.forEach((el) => countObserver.observe(el));
  } else {
    counters.forEach((el) => (el.textContent = Number(el.dataset.count || 0).toLocaleString("ru-RU") + (el.dataset.suffix || "")));
  }

  /* ---------------------------------------------------------
     Hero pointer glow + mock FPS
     --------------------------------------------------------- */
  const hero = $("#hero");
  const heroGlow = $("#heroGlow");
  if (hero && heroGlow && !reduced) {
    hero.addEventListener("pointermove", (e) => {
      const rect = hero.getBoundingClientRect();
      heroGlow.style.setProperty("--gx", `${e.clientX - rect.left}px`);
      heroGlow.style.setProperty("--gy", `${e.clientY - rect.top}px`);
    });
  }

  const mockFps = $("#mockFps");
  if (mockFps && !reduced) {
    setInterval(() => {
      mockFps.textContent = String(300 + Math.floor(Math.random() * 26));
    }, 1800);
  }

  /* ---------------------------------------------------------
     Modules showcase
     --------------------------------------------------------- */
  const grid = $("#modulesGrid");
  const filters = $("#moduleFilters");
  const search = $("#moduleSearch");
  const emptyState = $("#modulesEmpty");
  const countLabel = $("#moduleCount");
  const CAT_LABEL = Object.fromEntries(ENUDA_CATEGORIES.map((c) => [c.id, c.label]));

  let activeCat = "all";
  let query = "";

  function moduleCard(mod) {
    const html = `
      <article class="module ${mod.on ? "is-on" : ""}" data-id="${mod.id}">
        <div class="module__top">
          <div>
            <span class="module__name">${mod.name}</span>
            <span class="module__cat">${CAT_LABEL[mod.cat]}</span>
          </div>
          <label class="switch">
            <input type="checkbox" ${mod.on ? "checked" : ""} aria-label="Включить ${mod.name}">
            <span class="switch__track"><span class="switch__thumb"></span></span>
          </label>
        </div>
        <p class="module__desc">${mod.desc}</p>
        <div class="module__foot">
          ${mod.bind !== "—" ? `<span class="kbd">${mod.bind}</span>` : `<span class="kbd">нет бинда</span>`}
          ${mod.tag ? `<span class="module__tag">${mod.tag}</span>` : ""}
        </div>
      </article>`;
    const wrap = document.createElement("div");
    wrap.innerHTML = html.trim();
    return wrap.firstElementChild;
  }

  function renderModules() {
    if (!grid) return;
    const items = ENUDA_MODULES.filter((m) => {
      const catOk = activeCat === "all" || m.cat === activeCat;
      const qOk = !query || (m.name + " " + m.desc).toLowerCase().includes(query);
      return catOk && qOk;
    });

    grid.innerHTML = "";
    const frag = document.createDocumentFragment();
    items.forEach((m, i) => {
      const card = moduleCard(m);
      card.style.animationDelay = `${Math.min(i * 28, 260)}ms`;
      frag.appendChild(card);
    });
    grid.appendChild(frag);

    emptyState.hidden = items.length > 0;
    countLabel.textContent = items.length
      ? `Показано ${items.length} из 24 · 184 модуля в полной сборке`
      : "Ничего не нашлось";
    grid.setAttribute("aria-busy", "false");
  }

  grid?.addEventListener("change", (e) => {
    const input = e.target.closest('input[type="checkbox"]');
    if (!input) return;
    const card = input.closest(".module");
    card.classList.toggle("is-on", input.checked);
    const name = $(".module__name", card).textContent;
    showSnack(`${name} — ${input.checked ? "включён" : "выключен"}`);
  });

  filters?.addEventListener("click", (e) => {
    const btn = e.target.closest(".chip--filter");
    if (!btn) return;
    $$(".chip--filter", filters).forEach((b) => b.classList.remove("is-active"));
    btn.classList.add("is-active");
    activeCat = btn.dataset.cat;
    renderModules();
  });

  search?.addEventListener("input", () => {
    query = search.value.trim().toLowerCase();
    renderModules();
  });

  renderModules();

  /* ---------------------------------------------------------
     Interactive ClickGUI demo
     --------------------------------------------------------- */
  const demoRail = $("#demoRail");
  const demoList = $("#demoList");
  const demoSettings = $("#demoSettings");
  const demoTitle = $("#demoCatTitle");
  const demoCount = $("#demoCatCount");
  let demoCat = "combat";
  let demoSelected = "aura";

  function renderDemoRail() {
    if (!demoRail) return;
    demoRail.innerHTML = ENUDA_CATEGORIES.map(
      (c) => `<button type="button" role="tab" aria-selected="${c.id === demoCat}" data-cat="${c.id}">
        <svg><use href="#${c.icon}"></use></svg>${c.label}
      </button>`
    ).join("");
  }

  function renderDemoModules() {
    if (!demoList) return;
    const items = ENUDA_MODULES.filter((m) => m.cat === demoCat);
    const withSlider = items.find((m) => m.sliders.length);
    if (!items.some((m) => m.id === demoSelected)) demoSelected = withSlider ? withSlider.id : items[0].id;

    demoList.innerHTML = items
      .map(
        (m) => `<div class="module-row ${m.on ? "is-on" : ""} ${m.id === demoSelected ? "is-selected" : ""}" data-id="${m.id}">
          <span class="module-row__name">${m.name}${m.bind !== "—" ? `<span class="module-row__bind">${m.bind}</span>` : ""}</span>
          <label class="switch">
            <input type="checkbox" ${m.on ? "checked" : ""} aria-label="Включить ${m.name}">
            <span class="switch__track"><span class="switch__thumb"></span></span>
          </label>
        </div>`
      )
      .join("");

    demoTitle.textContent = CAT_LABEL[demoCat];
    demoCount.textContent = `${items.length} модулей`;
    renderDemoSettings();
  }

  function renderDemoSettings() {
    if (!demoSettings) return;
    const mod = ENUDA_MODULES.find((m) => m.id === demoSelected) || ENUDA_MODULES[0];
    if (!mod.sliders.length) {
      demoSettings.innerHTML = `
        <div class="set">
          <div class="set-head"><span>${mod.name}</span><b>${mod.bind !== "—" ? mod.bind : "без бинда"}</b></div>
          <p style="font-size:.76rem;color:var(--text-dim);line-height:1.55">${mod.desc}</p>
        </div>`;
      return;
    }
    demoSettings.innerHTML = mod.sliders
      .map((s) => {
        const p = ((s.value - s.min) / (s.max - s.min)) * 100;
        return `<div class="set">
          <div class="set-head"><span>${mod.name} · ${s.label}</span><b>${s.value}${s.unit}</b></div>
          <input type="range" min="${s.min}" max="${s.max}" step="${s.step}" value="${s.value}"
                 style="--p:${p}%" data-label="${s.label}" data-unit="${s.unit}" aria-label="${mod.name}: ${s.label}">
        </div>`;
      })
      .join("");
  }

  demoRail?.addEventListener("click", (e) => {
    const btn = e.target.closest("button[data-cat]");
    if (!btn) return;
    demoCat = btn.dataset.cat;
    demoSelected = "";
    renderDemoRail();
    renderDemoModules();
  });

  demoList?.addEventListener("click", (e) => {
    const row = e.target.closest(".module-row");
    if (!row || e.target.closest(".switch")) return;
    demoSelected = row.dataset.id;
    $$(".module-row", demoList).forEach((r) => r.classList.toggle("is-selected", r === row));
    renderDemoSettings();
  });

  demoList?.addEventListener("change", (e) => {
    const input = e.target.closest('input[type="checkbox"]');
    if (!input) return;
    const row = input.closest(".module-row");
    row.classList.toggle("is-on", input.checked);
    const mod = ENUDA_MODULES.find((m) => m.id === row.dataset.id);
    showSnack(`${mod ? mod.name : "Модуль"} — ${input.checked ? "включён" : "выключен"}`);
  });

  demoSettings?.addEventListener("input", (e) => {
    const range = e.target.closest('input[type="range"]');
    if (!range) return;
    const val = Number(range.value);
    const p = ((val - range.min) / (range.max - range.min)) * 100;
    range.style.setProperty("--p", `${p}%`);
    $("b", range.parentElement).textContent = `${val}${range.dataset.unit || ""}`;
  });

  const accentThemes = [
    { id: "", label: "Emerald" },
    { id: "tertiary", label: "Lilac" },
    { id: "cyan", label: "Cyan" },
    { id: "rose", label: "Rose" },
    { id: "amber", label: "Amber" }
  ];
  let accentIndex = 0;

  $("#demoTheme")?.addEventListener("click", () => {
    accentIndex = (accentIndex + 1) % accentThemes.length;
    const theme = accentThemes[accentIndex];
    const win = $(".demo__window");
    if (theme.id) win.dataset.accent = theme.id;
    else delete win.dataset.accent;
    showSnack(`Акцентная тема: ${theme.label}`);
  });

  if (demoRail) {
    renderDemoRail();
    renderDemoModules();
  }

  /* ---------------------------------------------------------
     FPS benchmark
     --------------------------------------------------------- */
  const scenarios = {
    spawn: { vanilla: 96, enuda: 254, hint: "Рендер-дистанция 12 чанков · 1080p" },
    fight: { vanilla: 62, enuda: 196, hint: "20 игроков в зоне видимости · 12 чанков" },
    chunks: { vanilla: 41, enuda: 148, hint: "Телепорт на 500 блоков · загрузка чанков" },
    shaders: { vanilla: 38, enuda: 92, hint: "Iris · BSL Medium · 8 чанков" }
  };
  const MAX_FPS = 320;

  const barVanilla = $("#barVanilla");
  const barEnuda = $("#barEnuda");
  const fpsVanilla = $("#fpsVanilla");
  const fpsEnuda = $("#fpsEnuda");
  const fpsDelta = $("#fpsDelta");
  const fpsHint = $("#fpsHint");

  function applyScenario(key) {
    const s = scenarios[key];
    if (!s) return;
    barVanilla.style.setProperty("--w", `${(s.vanilla / MAX_FPS) * 100}%`);
    barEnuda.style.setProperty("--w", `${(s.enuda / MAX_FPS) * 100}%`);
    fpsVanilla.textContent = s.vanilla;
    fpsEnuda.textContent = s.enuda;
    fpsDelta.textContent = `+${Math.round((s.enuda / s.vanilla - 1) * 100)}%`;
    fpsHint.textContent = s.hint;
  }

  $("#fpsScenarios")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-scenario]");
    if (!btn) return;
    $$("#fpsScenarios .segmented__item").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    applyScenario(btn.dataset.scenario);
  });

  const presets = {
    max: {
      fps: 312,
      rows: [["Частицы", "Минимум"], ["Тени сущностей", "Выкл"], ["Дистанция прорисовки", "8 чанков"], ["Оптимизация HUD", "Вкл"]]
    },
    balanced: {
      fps: 254,
      rows: [["Частицы", "Снижено"], ["Тени сущностей", "Мягкие"], ["Дистанция прорисовки", "12 чанков"], ["Оптимизация HUD", "Вкл"]]
    },
    quality: {
      fps: 186,
      rows: [["Частицы", "Все"], ["Тени сущностей", "Вкл"], ["Дистанция прорисовки", "16 чанков"], ["Оптимизация HUD", "Вкл"]]
    }
  };
  const presetList = $("#presetList");
  const presetFps = $("#presetFps");

  $("#presetSeg")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-preset]");
    if (!btn) return;
    $$("#presetSeg .segmented__item").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    const preset = presets[btn.dataset.preset];
    if (!preset) return;
    presetList.innerHTML = preset.rows.map(([k, v]) => `<li><span>${k}</span><b>${v}</b></li>`).join("");
    if (!reduced) {
      presetFps.animate([{ opacity: 0.3, transform: "translateY(4px)" }, { opacity: 1, transform: "none" }], {
        duration: 320,
        easing: "cubic-bezier(.2,0,0,1)"
      });
    }
    presetFps.textContent = preset.fps;
  });

  /* ---------------------------------------------------------
     Pricing
     --------------------------------------------------------- */
  const terms = {
    "30": { lite: 149, pro: 249, max: 399, per: "за 30 дней" },
    "90": { lite: 349, pro: 549, max: 899, per: "за 90 дней" },
    forever: { lite: 899, pro: 1399, max: 2199, per: "навсегда" }
  };
  let activeTerm = "30";

  function updatePrices(term) {
    const data = terms[term];
    if (!data) return;
    ["lite", "pro", "max"].forEach((plan) => {
      const el = $(`[data-price="${plan}"]`);
      if (!el) return;
      el.textContent = data[plan].toLocaleString("ru-RU").replace(/\u00A0/g, " ");
      if (!reduced) {
        el.animate([{ opacity: 0.2, transform: "translateY(6px)" }, { opacity: 1, transform: "none" }], {
          duration: 300,
          easing: "cubic-bezier(.2,0,0,1)"
        });
      }
    });
    $$("[data-per]").forEach((el) => (el.textContent = data.per));
  }

  $("#durationSeg")?.addEventListener("click", (e) => {
    const btn = e.target.closest("[data-term]");
    if (!btn) return;
    $$("#durationSeg .segmented__item").forEach((b) => {
      b.classList.remove("is-active");
      b.setAttribute("aria-selected", "false");
    });
    btn.classList.add("is-active");
    btn.setAttribute("aria-selected", "true");
    activeTerm = btn.dataset.term;
    updatePrices(activeTerm);
  });

  $$("[data-plan]").forEach((btn) => {
    btn.addEventListener("click", () => {
      showSnack(`Тариф ${btn.dataset.plan} · ${terms[activeTerm].per} — открываем оплату…`);
    });
  });

  updatePrices(activeTerm);

  /* ---------------------------------------------------------
     Accordion
     --------------------------------------------------------- */
  $$(".acc__head").forEach((head) => {
    head.addEventListener("click", () => {
      const isOpen = head.getAttribute("aria-expanded") === "true";
      $$(".acc__head").forEach((h) => h.setAttribute("aria-expanded", "false"));
      head.setAttribute("aria-expanded", String(!isOpen));
    });
  });

  /* ---------------------------------------------------------
     Download dialog
     --------------------------------------------------------- */
  const dialog = $("#downloadDialog");
  const osCards = $$(".os-card");
  const osLabel = $("#osLabel");
  let activeOs = "Windows";

  function openDialog() {
    if (!dialog) return;
    if (typeof dialog.showModal === "function") dialog.showModal();
    else dialog.setAttribute("open", "");
    document.body.classList.add("is-locked");
  }

  function closeDialog() {
    dialog?.close?.();
    document.body.classList.remove("is-locked");
  }

  $$("[data-open-download]").forEach((btn) =>
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      openDialog();
    })
  );

  osCards.forEach((card) => {
    card.addEventListener("click", () => {
      osCards.forEach((c) => c.classList.remove("is-active"));
      card.classList.add("is-active");
      activeOs = card.querySelector("b").textContent;
      if (osLabel) osLabel.textContent = activeOs;
    });
  });

  $("#dialogDownload")?.addEventListener("click", () => {
    setTimeout(() => {
      document.body.classList.remove("is-locked");
      showSnack(`Загрузка Enuda Launcher для ${activeOs} началась · v4.2.1`);
    }, 120);
  });

  dialog?.addEventListener("close", () => document.body.classList.remove("is-locked"));
  dialog?.addEventListener("click", (e) => {
    if (e.target === dialog) closeDialog();
  });
  $$("[data-close-dialog]").forEach((el) => el.addEventListener("click", closeDialog));

  /* ---------------------------------------------------------
     Dead links → snackbar
     --------------------------------------------------------- */
  $$('a[href="#"]').forEach((link) => {
    if (link.dataset.openDownload !== undefined) return;
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const label = link.textContent.trim();
      showSnack(`«${label}» — раздел в разработке`);
    });
  });
})();
