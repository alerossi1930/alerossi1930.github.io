const SORT_HINT = "I can sort.";
const COMPLIMENTS_ABOUT = ["He's the boss!", "Cool guy.", "Handsome!", "The man, the myth."];
const COMPLIMENTS_PROJECT = ["Cool right?", "Nice one!", "Love this.", "So good."];
const RANDOM_FUN = ["Hellooo!", "Psst...", "You found me!", "Boo!"];
const FUN_CHANCE = 0.18;
const FUN_COOLDOWN_MS = 6000;

document.addEventListener("DOMContentLoaded", () => {
  setupHeader();
  setupGrid();
});

function setupHeader() {
  const mascotBtn = document.querySelector(".mascot-btn");
  const filterRow = document.querySelector(".filter-row");
  const siteName = document.getElementById("siteName");
  const menuOverlay = document.getElementById("menuOverlay");
  const menuClose = document.querySelector(".menu-close");
  const navHiddenQuery = window.matchMedia("(max-width: 1000px)");

  // Once the inline Projects/About links are hidden, tapping the name opens
  // a full-screen menu instead of navigating home.
  if (siteName && menuOverlay) {
    siteName.addEventListener("click", (e) => {
      if (!navHiddenQuery.matches) return;
      e.preventDefault();
      if (filterRow) filterRow.classList.remove("is-open");
      menuOverlay.classList.add("is-open");
    });

    function closeMenu() {
      menuOverlay.classList.remove("is-open");
    }

    if (menuClose) menuClose.addEventListener("click", closeMenu);

    menuOverlay.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape") closeMenu();
    });
  }

  document.addEventListener("click", (e) => {
    if (
      filterRow &&
      filterRow.classList.contains("is-open") &&
      mascotBtn &&
      !filterRow.contains(e.target) &&
      !mascotBtn.contains(e.target)
    ) {
      filterRow.classList.remove("is-open");
      if (mascotBtn) refreshMascot();
    }
  });

  if (!mascotBtn) return;

  const img = mascotBtn.querySelector("img");
  const text = document.querySelector(".mascot-text");
  const page = document.body.dataset.page;

  const state = { hovering: false, filterOpen: false };
  let funTimer = null;
  let lastFunEventAt = 0;

  function setMascot(talking, phrase) {
    img.src = talking ? "images/mascotte_talk.png" : "images/mascotte_smile.png";
    if (text) {
      if (phrase !== undefined) text.textContent = phrase;
      text.classList.toggle("is-visible", talking && !!phrase);
    }
  }

  function refreshMascot() {
    state.filterOpen = !!(filterRow && filterRow.classList.contains("is-open"));
    if (state.filterOpen) {
      setMascot(true, SORT_HINT);
    } else if (state.hovering) {
      const pool = page === "about" ? COMPLIMENTS_ABOUT : page === "project" ? COMPLIMENTS_PROJECT : null;
      setMascot(true, pool ? pool[Math.floor(Math.random() * pool.length)] : SORT_HINT);
    } else {
      setMascot(false);
    }
  }

  mascotBtn.addEventListener("mouseenter", () => {
    state.hovering = true;
    refreshMascot();
  });

  mascotBtn.addEventListener("mouseleave", () => {
    state.hovering = false;
    refreshMascot();
  });

  if (filterRow) {
    mascotBtn.addEventListener("click", () => {
      if (menuOverlay) menuOverlay.classList.remove("is-open");
      filterRow.classList.toggle("is-open");
      refreshMascot();
    });
  }

  // Random fun aside when hovering a project thumbnail (portfolio page only)
  window.triggerMascotFunEvent = function () {
    if (state.filterOpen || state.hovering) return;
    const now = Date.now();
    if (now - lastFunEventAt < FUN_COOLDOWN_MS) return;
    if (Math.random() > FUN_CHANCE) return;
    lastFunEventAt = now;
    const phrase = RANDOM_FUN[Math.floor(Math.random() * RANDOM_FUN.length)];
    setMascot(true, phrase);
    clearTimeout(funTimer);
    funTimer = setTimeout(refreshMascot, 1800);
  };
}

function setupGrid() {
  const grid = document.getElementById("grid");
  if (!grid || typeof PROJECTS === "undefined") return;

  const filterList = document.querySelector(".filter-row-inner");
  const activeCategories = new Set();

  function columnsForWidth(w) {
    if (w <= 620) return 1;
    if (w <= 1000) return 2;
    return 3;
  }

  const arrowSvg = `<svg class="go-arrow" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="square"><path d="M6 18L18 6"/><path d="M8 6h10v10"/></svg>`;

  function buildFigure(project) {
    const fig = document.createElement("figure");
    fig.className = "project";
    fig.dataset.category = project.category;

    const a = document.createElement("a");
    a.href = `project.html?slug=${encodeURIComponent(project.slug)}`;
    a.addEventListener("mouseenter", () => {
      if (window.triggerMascotFunEvent) window.triggerMascotFunEvent();
    });

    const img = document.createElement("img");
    img.src = project.cover || project.images[0];
    img.alt = project.title;
    img.loading = "lazy";

    const overlay = document.createElement("div");
    overlay.className = "overlay";
    overlay.innerHTML = `
      <div>
        <div class="title">${project.title}</div>
        <div class="year">${project.year}</div>
      </div>
      <div class="bottom-row">
        <div class="tags">${project.tags.join(", ")}</div>
        ${arrowSvg}
      </div>`;

    a.appendChild(img);
    a.appendChild(overlay);
    fig.appendChild(a);
    return fig;
  }

  let currentCols = 0;

  function render() {
    const cols = columnsForWidth(window.innerWidth);
    currentCols = cols;

    grid.innerHTML = "";
    const columns = [];
    for (let i = 0; i < cols; i++) {
      const col = document.createElement("div");
      col.className = "grid-col";
      grid.appendChild(col);
      columns.push(col);
    }

    const visible = PROJECTS.filter(
      (p) => activeCategories.size === 0 || activeCategories.has(p.category)
    );

    visible.forEach((project, i) => {
      columns[i % cols].appendChild(buildFigure(project));
    });
  }

  if (filterList) {
    const counts = new Map();
    PROJECTS.forEach((p) => counts.set(p.category, (counts.get(p.category) || 0) + 1));

    const categories = [{ key: "all", label: "All", count: PROJECTS.length }].concat(
      Array.from(counts.keys())
        .sort()
        .map((key) => ({
          key,
          label: key.charAt(0).toUpperCase() + key.slice(1),
          count: counts.get(key),
        }))
    );

    filterList.innerHTML = categories
      .map(
        (c) => `
        <button type="button" class="filter-chip${c.key === "all" ? " is-active" : ""}" data-filter="${c.key}">
          ${c.label}<sup>[${String(c.count)}]</sup>
        </button>`
      )
      .join("");

    function refreshChipStates() {
      filterList.querySelectorAll(".filter-chip").forEach((btn) => {
        const key = btn.dataset.filter;
        const active = key === "all" ? activeCategories.size === 0 : activeCategories.has(key);
        btn.classList.toggle("is-active", active);
      });
    }

    filterList.addEventListener("click", (e) => {
      const btn = e.target.closest(".filter-chip");
      if (!btn) return;
      const key = btn.dataset.filter;
      if (key === "all") {
        activeCategories.clear();
      } else if (activeCategories.has(key)) {
        activeCategories.delete(key);
      } else {
        activeCategories.add(key);
      }
      refreshChipStates();
      render();
    });
  }

  render();

  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      const cols = columnsForWidth(window.innerWidth);
      if (cols !== currentCols) render();
    }, 150);
  });
}
