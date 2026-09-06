(() => {
  "use strict";

  const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  const TIME_SLOTS = [
    "6:00–7:00",
    "7:00–8:00",
    "8:00–9:00",
    "9:00–10:00",
    "10:00–11:00",
    "11:00–12:30",
    "12:30–2:00",
    "2:00–3:30",
    "3:30–4:30",
    "4:30–5:30",
    "5:30–7:00",
    "7:00–7:30",
    "7:30 onwards",
  ];

  const NOTE_SECTIONS = [
    { key: "running", title: "🏃‍♀️ Running" },
    { key: "oscar", title: "👶 Oscar" },
    { key: "housework", title: "🧹 Housework" },
    { key: "dogWalks", title: "🐕 Dog walks" },
    { key: "imogen", title: "📚 Imogen" },
  ];

  const MEAL_TYPES = [
    { key: "lunch", label: "Lunch" },
    { key: "dinner", label: "Dinner" },
  ];

  // Who a cell can be tagged with, and the color each shows up as — the
  // same idea as Cozi's color-coded family members, just fixed to our five.
  const PEOPLE = [
    { key: "Jo", initial: "J", color: "#d9727f" },
    { key: "Adam", initial: "A", color: "#5b8fd9" },
    { key: "Oscar", initial: "O", color: "#f2b134" },
    { key: "Imogen", initial: "I", color: "#7bc47f" },
    { key: "All", initial: "★", color: "#9b8fd1" },
  ];
  const PEOPLE_BY_KEY = Object.fromEntries(PEOPLE.map((p) => [p.key, p]));

  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");
  const whoami = document.getElementById("whoami");
  const statusEl = document.getElementById("status-indicator");
  const table = document.getElementById("plan-table");
  const notesSection = document.getElementById("notes-section");
  const dailySection = document.getElementById("daily-section");
  const searchInput = document.getElementById("search-input");
  const searchCount = document.getElementById("search-count");
  const mealsTable = document.getElementById("meals-table");
  const recipesList = document.getElementById("recipes-list");
  const addRecipeBtn = document.getElementById("add-recipe-btn");
  const loadStarterRecipesBtn = document.getElementById("load-starter-recipes-btn");
  const recipeForm = document.getElementById("recipe-form");
  const recipeNameInput = document.getElementById("recipe-name-input");
  const recipeIngredientsInput = document.getElementById("recipe-ingredients-input");
  const recipeQuickInput = document.getElementById("recipe-quick-input");
  const recipeSourceInput = document.getElementById("recipe-source-input");
  const cancelRecipeBtn = document.getElementById("cancel-recipe-btn");
  const shoppingListEl = document.getElementById("shopping-list");
  const generateShoppingBtn = document.getElementById("generate-shopping-btn");
  const addItemForm = document.getElementById("add-item-form");
  const newItemInput = document.getElementById("new-item-input");
  const clearCheckedBtn = document.getElementById("clear-checked-btn");

  let plan = null; // { grid, notes, updatedAt, updatedBy }
  let currentUser = null;
  let saveTimer = null;
  let pollTimer = null;
  let saving = false;
  let searchQuery = "";
  let dailyDayIndex = 0; // set to today's index once the app boots
  let dailyFilter = []; // person keys to filter the daily view to; empty = show all

  function todayName() {
    // JS getDay(): 0=Sunday..6=Saturday. Map to our Monday-first list.
    const idx = new Date().getDay();
    return DAYS[(idx + 6) % 7];
  }

  function setStatus(text, kind) {
    statusEl.textContent = text;
    statusEl.className = "status" + (kind ? " " + kind : "");
  }

  function autoResize(el) {
    el.style.height = "auto";
    el.style.height = el.scrollHeight + "px";
  }

  // ---------- Cell data model ----------
  //
  // A grid cell is normally { text: string, people: string[] }. Older saved
  // plans (or the seed data) may still have a plain string — normalize on
  // the way in so both shapes work everywhere else in this file.

  function normalizeCell(value) {
    if (value && typeof value === "object") {
      return {
        text: typeof value.text === "string" ? value.text : "",
        people: Array.isArray(value.people) ? value.people.filter((p) => PEOPLE_BY_KEY[p]) : [],
      };
    }
    return { text: typeof value === "string" ? value : "", people: [] };
  }

  function getCell(slot, day) {
    return normalizeCell(plan.grid[slot] && plan.grid[slot][day]);
  }

  function setCell(slot, day, cell) {
    if (!plan.grid[slot]) plan.grid[slot] = {};
    plan.grid[slot][day] = cell;
  }

  // ---------- Meal plan / recipes / shopping list data model ----------
  //
  // Plans saved before this feature existed (or the seed data) may be
  // missing these fields entirely — normalize on the way in.

  function makeId() {
    return typeof crypto !== "undefined" && crypto.randomUUID
      ? crypto.randomUUID()
      : `id-${Date.now()}-${Math.random().toString(36).slice(2)}`;
  }

  function normalizeRecipes(value) {
    if (!value || typeof value !== "object") return {};
    const out = {};
    Object.entries(value).forEach(([id, recipe]) => {
      if (!recipe || typeof recipe !== "object") return;
      out[id] = {
        name: typeof recipe.name === "string" ? recipe.name : "Untitled recipe",
        ingredients: Array.isArray(recipe.ingredients) ? recipe.ingredients.filter((i) => typeof i === "string") : [],
        quick: !!recipe.quick,
        source: typeof recipe.source === "string" ? recipe.source : "",
      };
    });
    return out;
  }

  // Weeknights are tight (Oscar's bedtime routine starts at 7), so dinner
  // on these days only offers recipes tagged "quick" — weekends have more
  // time. Lunch is never restricted.
  const QUICK_ONLY_DINNER_DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

  function normalizeMeals(value) {
    const source = value && typeof value === "object" ? value : {};
    const out = {};
    DAYS.forEach((day) => {
      const dayMeals = source[day] && typeof source[day] === "object" ? source[day] : {};
      out[day] = {};
      MEAL_TYPES.forEach(({ key }) => {
        const choice = dayMeals[key];
        if (choice && choice.type === "recipe" && typeof choice.recipeId === "string") {
          out[day][key] = { type: "recipe", recipeId: choice.recipeId };
        } else if (choice && choice.type === "custom" && typeof choice.text === "string") {
          out[day][key] = { type: "custom", text: choice.text };
        } else {
          out[day][key] = null;
        }
      });
    });
    return out;
  }

  function normalizeShoppingList(value) {
    if (!Array.isArray(value)) return [];
    return value
      .filter((item) => item && typeof item.text === "string")
      .map((item) => ({
        id: typeof item.id === "string" ? item.id : makeId(),
        text: item.text,
        checked: !!item.checked,
        source: item.source === "meal-plan" ? "meal-plan" : "manual",
      }));
  }

  function normalizePlanExtras() {
    plan.recipes = normalizeRecipes(plan.recipes);
    plan.meals = normalizeMeals(plan.meals);
    plan.shoppingList = normalizeShoppingList(plan.shoppingList);
  }

  // ---------- Rendering ----------

  function renderPersonChips(cell, onToggle) {
    const wrap = document.createElement("div");
    wrap.className = "person-tags";
    PEOPLE.forEach(({ key, initial, color }) => {
      const active = cell.people.includes(key);
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "person-chip" + (active ? " active" : "");
      chip.textContent = initial;
      chip.title = key;
      chip.style.setProperty("--chip-color", color);
      chip.addEventListener("click", () => onToggle(key));
      wrap.appendChild(chip);
    });
    return wrap;
  }

  function applyCellTint(td, cell) {
    const firstColor = cell.people.length ? PEOPLE_BY_KEY[cell.people[0]].color : null;
    td.style.setProperty("--cell-tint", firstColor ? firstColor + "22" : "transparent");
  }

  function renderTable() {
    table.innerHTML = "";
    const today = todayName();

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    const corner = document.createElement("th");
    corner.textContent = "";
    headRow.appendChild(corner);
    DAYS.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      if (day === today) th.classList.add("today-col");
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    table.appendChild(thead);

    const tbody = document.createElement("tbody");
    TIME_SLOTS.forEach((slot) => {
      const row = document.createElement("tr");
      const timeCell = document.createElement("td");
      timeCell.textContent = slot;
      timeCell.className = "time-cell";
      row.appendChild(timeCell);

      DAYS.forEach((day) => {
        const td = document.createElement("td");
        td.className = "cell";
        if (day === today) td.classList.add("today-col");
        td.dataset.slot = slot;
        td.dataset.day = day;

        const cell = getCell(slot, day);
        applyCellTint(td, cell);

        const chips = renderPersonChips(cell, (personKey) => {
          const current = getCell(slot, day);
          const idx = current.people.indexOf(personKey);
          if (idx === -1) current.people.push(personKey);
          else current.people.splice(idx, 1);
          setCell(slot, day, current);
          applyCellTint(td, current);
          chips.querySelectorAll(".person-chip").forEach((chip, i) => {
            chip.classList.toggle("active", current.people.includes(PEOPLE[i].key));
          });
          scheduleSave();
        });
        td.appendChild(chips);

        const textarea = document.createElement("textarea");
        textarea.rows = 1;
        textarea.value = cell.text;
        textarea.dataset.slot = slot;
        textarea.dataset.day = day;
        textarea.addEventListener("input", () => {
          const current = getCell(slot, day);
          current.text = textarea.value;
          setCell(slot, day, current);
          autoResize(textarea);
          scheduleSave();
        });

        td.appendChild(textarea);
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });
    table.appendChild(tbody);

    // Size textareas after they're in the DOM.
    requestAnimationFrame(() => {
      table.querySelectorAll("textarea").forEach(autoResize);
    });
  }

  function renderDaily() {
    dailySection.innerHTML = "";
    const day = DAYS[dailyDayIndex];
    const isToday = day === todayName();

    const card = document.createElement("div");
    card.className = "daily-card";

    // Day navigation: step backward/forward through the week, or jump
    // straight back to today.
    const nav = document.createElement("div");
    nav.className = "daily-nav";

    const prevBtn = document.createElement("button");
    prevBtn.type = "button";
    prevBtn.className = "daily-nav-btn";
    prevBtn.textContent = "‹";
    prevBtn.setAttribute("aria-label", "Previous day");
    prevBtn.addEventListener("click", () => {
      dailyDayIndex = (dailyDayIndex + 6) % 7;
      renderDaily();
    });
    nav.appendChild(prevBtn);

    const h2 = document.createElement("h2");
    h2.className = "daily-day-label";
    h2.textContent = day + (isToday ? " · Today" : "");
    nav.appendChild(h2);

    const nextBtn = document.createElement("button");
    nextBtn.type = "button";
    nextBtn.className = "daily-nav-btn";
    nextBtn.textContent = "›";
    nextBtn.setAttribute("aria-label", "Next day");
    nextBtn.addEventListener("click", () => {
      dailyDayIndex = (dailyDayIndex + 1) % 7;
      renderDaily();
    });
    nav.appendChild(nextBtn);

    if (!isToday) {
      const todayBtn = document.createElement("button");
      todayBtn.type = "button";
      todayBtn.className = "ghost-btn daily-today-btn";
      todayBtn.textContent = "Today";
      todayBtn.addEventListener("click", () => {
        dailyDayIndex = DAYS.indexOf(todayName());
        renderDaily();
      });
      nav.appendChild(todayBtn);
    }

    card.appendChild(nav);

    // Person filter: toggle one or more people to show only their entries.
    const filterRow = document.createElement("div");
    filterRow.className = "daily-filter";
    PEOPLE.forEach(({ key, initial, color }) => {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "person-filter-chip" + (dailyFilter.includes(key) ? " active" : "");
      chip.style.setProperty("--chip-color", color);
      chip.textContent = initial;
      chip.title = `Filter to ${key}`;
      chip.addEventListener("click", () => {
        const idx = dailyFilter.indexOf(key);
        if (idx === -1) dailyFilter.push(key);
        else dailyFilter.splice(idx, 1);
        renderDaily();
      });
      filterRow.appendChild(chip);
    });
    if (dailyFilter.length) {
      const clearBtn = document.createElement("button");
      clearBtn.type = "button";
      clearBtn.className = "ghost-btn daily-clear-filter";
      clearBtn.textContent = "Clear filter";
      clearBtn.addEventListener("click", () => {
        dailyFilter = [];
        renderDaily();
      });
      filterRow.appendChild(clearBtn);
    }
    card.appendChild(filterRow);

    // Entries for the selected day, narrowed to the filter if one is set.
    const list = document.createElement("div");
    list.className = "daily-list";

    let anyEntries = false;
    let anyMatching = false;
    TIME_SLOTS.forEach((slot) => {
      const cell = getCell(slot, day);
      if (!cell.text.trim()) return;
      anyEntries = true;
      if (dailyFilter.length && !cell.people.some((p) => dailyFilter.includes(p))) return;
      anyMatching = true;

      const row = document.createElement("div");
      row.className = "daily-row";

      const time = document.createElement("span");
      time.className = "daily-time";
      time.textContent = slot;
      row.appendChild(time);

      const dots = document.createElement("span");
      dots.className = "daily-dots";
      cell.people.forEach((key) => {
        const dot = document.createElement("span");
        dot.className = "person-dot";
        dot.style.setProperty("--dot-color", PEOPLE_BY_KEY[key].color);
        dot.title = key;
        dots.appendChild(dot);
      });
      row.appendChild(dots);

      const text = document.createElement("span");
      text.className = "daily-text";
      text.textContent = cell.text;
      row.appendChild(text);

      list.appendChild(row);
    });

    if (!anyEntries) {
      const empty = document.createElement("p");
      empty.className = "daily-empty";
      empty.textContent = `Nothing on the plan for ${day} yet.`;
      list.appendChild(empty);
    } else if (!anyMatching) {
      const empty = document.createElement("p");
      empty.className = "daily-empty";
      empty.textContent = `Nothing for ${dailyFilter.join(", ")} on ${day}.`;
      list.appendChild(empty);
    }

    card.appendChild(list);
    dailySection.appendChild(card);
  }

  function renderNotes() {
    notesSection.innerHTML = "";
    NOTE_SECTIONS.forEach(({ key, title }) => {
      const card = document.createElement("div");
      card.className = "note-card";

      const h2 = document.createElement("h2");
      h2.textContent = title;
      card.appendChild(h2);

      const textarea = document.createElement("textarea");
      textarea.value = plan.notes[key] || "";
      textarea.dataset.noteKey = key;
      textarea.addEventListener("input", () => {
        plan.notes[key] = textarea.value;
        scheduleSave();
      });

      card.appendChild(textarea);
      notesSection.appendChild(card);
    });
  }

  function renderMealsTable() {
    mealsTable.innerHTML = "";
    const today = todayName();

    const thead = document.createElement("thead");
    const headRow = document.createElement("tr");
    headRow.appendChild(document.createElement("th"));
    DAYS.forEach((day) => {
      const th = document.createElement("th");
      th.textContent = day;
      if (day === today) th.classList.add("today-col");
      headRow.appendChild(th);
    });
    thead.appendChild(headRow);
    mealsTable.appendChild(thead);

    const tbody = document.createElement("tbody");
    MEAL_TYPES.forEach(({ key, label }) => {
      const row = document.createElement("tr");
      const labelCell = document.createElement("td");
      labelCell.className = "meal-label-cell";
      labelCell.textContent = label;
      row.appendChild(labelCell);

      DAYS.forEach((day) => {
        const td = document.createElement("td");
        td.className = "meal-cell";
        if (day === today) td.classList.add("today-col");

        const choice = plan.meals[day][key];
        const restrictToQuick = key === "dinner" && QUICK_ONLY_DINNER_DAYS.includes(day);
        const alreadyChosenId = choice && choice.type === "recipe" ? choice.recipeId : null;

        const select = document.createElement("select");
        select.className = "meal-select";
        if (restrictToQuick) select.title = "Weeknight dinners are limited to quick meals";

        const noneOpt = document.createElement("option");
        noneOpt.value = "";
        noneOpt.textContent = "— choose —";
        select.appendChild(noneOpt);

        Object.entries(plan.recipes)
          // Weeknight dinners only offer quick recipes — except whatever's
          // already chosen, so an existing pick never just vanishes.
          .filter(([id, recipe]) => !restrictToQuick || recipe.quick || id === alreadyChosenId)
          .sort((a, b) => a[1].name.localeCompare(b[1].name))
          .forEach(([id, recipe]) => {
            const opt = document.createElement("option");
            opt.value = `recipe:${id}`;
            opt.textContent = recipe.quick ? `⚡ ${recipe.name}` : recipe.name;
            select.appendChild(opt);
          });

        const customOpt = document.createElement("option");
        customOpt.value = "custom";
        customOpt.textContent = "Something else…";
        select.appendChild(customOpt);

        let currentValue = "";
        if (choice && choice.type === "recipe") currentValue = `recipe:${choice.recipeId}`;
        else if (choice && choice.type === "custom") currentValue = "custom";
        select.value = currentValue;

        const customInput = document.createElement("input");
        customInput.type = "text";
        customInput.className = "meal-custom-input";
        customInput.placeholder = `What's for ${label.toLowerCase()}?`;
        customInput.value = choice && choice.type === "custom" ? choice.text : "";
        customInput.hidden = currentValue !== "custom";

        select.addEventListener("change", () => {
          if (select.value === "") {
            plan.meals[day][key] = null;
            customInput.hidden = true;
            customInput.value = "";
          } else if (select.value === "custom") {
            plan.meals[day][key] = { type: "custom", text: customInput.value };
            customInput.hidden = false;
            customInput.focus();
          } else {
            plan.meals[day][key] = { type: "recipe", recipeId: select.value.slice("recipe:".length) };
            customInput.hidden = true;
            customInput.value = "";
          }
          scheduleSave();
        });

        customInput.addEventListener("input", () => {
          plan.meals[day][key] = { type: "custom", text: customInput.value };
          scheduleSave();
        });

        td.appendChild(select);
        td.appendChild(customInput);
        row.appendChild(td);
      });

      tbody.appendChild(row);
    });
    mealsTable.appendChild(tbody);
  }

  function renderRecipes() {
    recipesList.innerHTML = "";
    const entries = Object.entries(plan.recipes).sort((a, b) => a[1].name.localeCompare(b[1].name));

    if (!entries.length) {
      const empty = document.createElement("p");
      empty.className = "recipes-empty";
      empty.textContent = "No recipes yet — add one to start planning meals.";
      recipesList.appendChild(empty);
      return;
    }

    entries.forEach(([id, recipe]) => {
      const item = document.createElement("div");
      item.className = "recipe-item";

      const name = document.createElement(recipe.source ? "a" : "span");
      name.className = "recipe-name";
      name.textContent = recipe.quick ? `⚡ ${recipe.name}` : recipe.name;
      if (recipe.source) {
        name.href = recipe.source;
        name.target = "_blank";
        name.rel = "noopener noreferrer";
        name.title = "View the original recipe";
      }
      item.appendChild(name);

      const count = document.createElement("span");
      count.className = "recipe-ingredient-count";
      count.textContent = `${recipe.ingredients.length} ingredient${recipe.ingredients.length === 1 ? "" : "s"}`;
      item.appendChild(count);

      const deleteBtn = document.createElement("button");
      deleteBtn.type = "button";
      deleteBtn.className = "ghost-btn small recipe-delete-btn";
      deleteBtn.textContent = "Delete";
      deleteBtn.addEventListener("click", () => {
        if (!confirm(`Delete "${recipe.name}"? Any days it's planned for will need a new choice.`)) return;
        delete plan.recipes[id];
        renderRecipes();
        renderMealsTable();
        scheduleSave();
      });
      item.appendChild(deleteBtn);

      recipesList.appendChild(item);
    });
  }

  function renderShoppingList() {
    shoppingListEl.innerHTML = "";
    if (!plan.shoppingList.length) {
      const empty = document.createElement("p");
      empty.className = "shopping-empty";
      empty.textContent = "Nothing on the list yet.";
      shoppingListEl.appendChild(empty);
      return;
    }

    // Unchecked items first, so the list gets shorter as you shop.
    const sorted = [...plan.shoppingList].sort((a, b) => Number(a.checked) - Number(b.checked));

    sorted.forEach((item) => {
      const row = document.createElement("label");
      row.className = "shopping-item" + (item.checked ? " checked" : "");

      const checkbox = document.createElement("input");
      checkbox.type = "checkbox";
      checkbox.checked = item.checked;
      checkbox.addEventListener("change", () => {
        const target = plan.shoppingList.find((i) => i.id === item.id);
        if (target) target.checked = checkbox.checked;
        renderShoppingList();
        scheduleSave();
      });
      row.appendChild(checkbox);

      const text = document.createElement("span");
      text.className = "shopping-item-text";
      text.textContent = item.text;
      row.appendChild(text);

      const removeBtn = document.createElement("button");
      removeBtn.type = "button";
      removeBtn.className = "shopping-item-remove";
      removeBtn.textContent = "×";
      removeBtn.setAttribute("aria-label", `Remove ${item.text}`);
      removeBtn.addEventListener("click", (e) => {
        e.preventDefault();
        plan.shoppingList = plan.shoppingList.filter((i) => i.id !== item.id);
        renderShoppingList();
        scheduleSave();
      });
      row.appendChild(removeBtn);

      shoppingListEl.appendChild(row);
    });
  }

  function renderAll() {
    renderDaily();
    renderTable();
    renderMealsTable();
    renderRecipes();
    renderShoppingList();
    renderNotes();
    updateMeta();
    applySearch();
  }

  function updateMeta() {
    if (!saving) {
      if (plan.updatedAt) {
        const when = new Date(plan.updatedAt);
        const who = plan.updatedBy ? plan.updatedBy : "someone";
        setStatus(`Saved · last edited by ${who} at ${when.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`, "");
      } else {
        setStatus("Saved", "");
      }
    }
  }

  // ---------- Search ----------
  //
  // A lightweight filter across the grid and notes: matching cells/notes are
  // highlighted, everything else dims slightly, so it's easy to spot what
  // you're looking for in a page full of small text.

  function applySearch() {
    const query = searchQuery.trim().toLowerCase();
    let matches = 0;
    const active = query.length > 0;

    table.querySelectorAll("td.cell").forEach((td) => {
      const textarea = td.querySelector("textarea");
      const isMatch = active && textarea.value.toLowerCase().includes(query);
      td.classList.toggle("search-match", isMatch);
      td.classList.toggle("search-dim", active && !isMatch);
      if (isMatch) matches++;
    });

    notesSection.querySelectorAll(".note-card").forEach((card) => {
      const textarea = card.querySelector("textarea");
      const isMatch = active && textarea.value.toLowerCase().includes(query);
      card.classList.toggle("search-match", isMatch);
      card.classList.toggle("search-dim", active && !isMatch);
      if (isMatch) matches++;
    });

    searchCount.textContent = active ? `${matches} match${matches === 1 ? "" : "es"}` : "";
  }

  // ---------- Networking ----------

  async function checkSession() {
    const res = await fetch("/api/session");
    const data = await res.json();
    return data;
  }

  async function loadPlan() {
    const res = await fetch("/api/plan");
    if (!res.ok) throw new Error("Failed to load plan");
    plan = await res.json();
    normalizePlanExtras();
  }

  function scheduleSave() {
    setStatus("Editing…", "saving");
    if (saveTimer) clearTimeout(saveTimer);
    saveTimer = setTimeout(savePlan, 800);
  }

  async function savePlan() {
    saving = true;
    setStatus("Saving…", "saving");
    try {
      const res = await fetch("/api/plan", {
        method: "PUT",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          grid: plan.grid,
          notes: plan.notes,
          recipes: plan.recipes,
          meals: plan.meals,
          shoppingList: plan.shoppingList,
        }),
      });
      if (!res.ok) throw new Error("Save failed");
      const saved = await res.json();
      plan.updatedAt = saved.updatedAt;
      plan.updatedBy = saved.updatedBy;
    } catch (err) {
      setStatus("Couldn't save — will retry shortly", "error");
      saveTimer = setTimeout(savePlan, 4000);
      saving = false;
      return;
    }
    saving = false;
    updateMeta();
  }

  function mergeRemotePlan(remote) {
    // Only overwrite cells the user isn't actively editing right now, so a
    // background refresh never yanks text out from under someone typing.
    const active = document.activeElement;

    TIME_SLOTS.forEach((slot) => {
      DAYS.forEach((day) => {
        const el = table.querySelector(
          `textarea[data-slot="${CSS.escape(slot)}"][data-day="${CSS.escape(day)}"]`,
        );
        if (el && el === active) return;
        const remoteCell = normalizeCell(remote.grid[slot] && remote.grid[slot][day]);
        setCell(slot, day, remoteCell);
        if (el && el.value !== remoteCell.text) {
          el.value = remoteCell.text;
          autoResize(el);
        }
        const td = table.querySelector(`td.cell[data-slot="${CSS.escape(slot)}"][data-day="${CSS.escape(day)}"]`);
        if (td) {
          applyCellTint(td, remoteCell);
          td.querySelectorAll(".person-chip").forEach((chip, i) => {
            chip.classList.toggle("active", remoteCell.people.includes(PEOPLE[i].key));
          });
        }
      });
    });

    NOTE_SECTIONS.forEach(({ key }) => {
      const el = notesSection.querySelector(`textarea[data-note-key="${CSS.escape(key)}"]`);
      if (el && el === active) return;
      const remoteVal = remote.notes[key] || "";
      plan.notes[key] = remoteVal;
      if (el && el.value !== remoteVal) el.value = remoteVal;
    });

    // Meal selects/custom inputs and the recipe/shopping-list forms don't
    // need the same cell-by-cell care — just skip the refresh entirely if
    // someone's mid-keystroke in a meal's custom-text box, since that's the
    // one input in this group tied to existing (rather than new) data.
    const activeIsMealInput = active && active.classList && active.classList.contains("meal-custom-input");
    if (!activeIsMealInput) {
      plan.recipes = normalizeRecipes(remote.recipes);
      plan.meals = normalizeMeals(remote.meals);
      plan.shoppingList = normalizeShoppingList(remote.shoppingList);
      renderMealsTable();
      renderRecipes();
      renderShoppingList();
    }

    plan.updatedAt = remote.updatedAt;
    plan.updatedBy = remote.updatedBy;
    updateMeta();
    renderDaily();
    applySearch();
  }

  async function pollForUpdates() {
    if (saving) return;
    try {
      const res = await fetch("/api/plan");
      if (!res.ok) return;
      const remote = await res.json();
      mergeRemotePlan(remote);
    } catch {
      // Silent — we'll try again on the next tick.
    }
  }

  // ---------- View switching ----------

  function showLogin(message) {
    loginView.hidden = false;
    appView.hidden = true;
    if (pollTimer) clearInterval(pollTimer);
    if (message) {
      loginError.textContent = message;
      loginError.hidden = false;
    } else {
      loginError.hidden = true;
    }
  }

  async function showApp(user) {
    currentUser = user;
    whoami.textContent = `Logged in as ${user}`;
    dailyDayIndex = DAYS.indexOf(todayName());
    dailyFilter = [];
    loginView.hidden = true;
    appView.hidden = false;
    setStatus("Loading plan…", "saving");
    try {
      await loadPlan();
      renderAll();
    } catch {
      setStatus("Couldn't load the plan — try refreshing", "error");
      return;
    }
    if (pollTimer) clearInterval(pollTimer);
    pollTimer = setInterval(pollForUpdates, 15000);
  }

  // ---------- Events ----------

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    loginError.hidden = true;
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
    const submitBtn = loginForm.querySelector("button");
    submitBtn.disabled = true;
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        loginError.textContent = data.error || "Couldn't log in.";
        loginError.hidden = false;
        return;
      }
      document.getElementById("password").value = "";
      await showApp(data.user);
    } catch {
      loginError.textContent = "Network error — please try again.";
      loginError.hidden = false;
    } finally {
      submitBtn.disabled = false;
    }
  });

  logoutBtn.addEventListener("click", async () => {
    try {
      await fetch("/api/logout", { method: "POST" });
    } catch {
      // Ignore — we still want to show the login screen.
    }
    plan = null;
    currentUser = null;
    showLogin();
  });

  searchInput.addEventListener("input", () => {
    searchQuery = searchInput.value;
    applySearch();
  });

  addRecipeBtn.addEventListener("click", () => {
    recipeForm.hidden = false;
    recipeNameInput.value = "";
    recipeIngredientsInput.value = "";
    recipeQuickInput.checked = false;
    recipeSourceInput.value = "";
    recipeNameInput.focus();
  });

  loadStarterRecipesBtn.addEventListener("click", async () => {
    loadStarterRecipesBtn.disabled = true;
    const originalLabel = loadStarterRecipesBtn.textContent;
    loadStarterRecipesBtn.textContent = "Loading…";
    try {
      const res = await fetch("/api/starter-recipes");
      if (!res.ok) throw new Error("Failed to load starter recipes");
      const starterRecipes = normalizeRecipes(await res.json());

      // Add any starter recipe not already present (matched by id) —
      // never overwrites a recipe you've already added or edited, so this
      // is safe to click more than once.
      let added = 0;
      Object.entries(starterRecipes).forEach(([id, recipe]) => {
        if (plan.recipes[id]) return;
        plan.recipes[id] = recipe;
        added++;
      });

      renderRecipes();
      renderMealsTable();
      if (added > 0) scheduleSave();
      loadStarterRecipesBtn.textContent = added > 0 ? `Added ${added} recipe${added === 1 ? "" : "s"}` : "Already up to date";
    } catch {
      loadStarterRecipesBtn.textContent = "Couldn't load — try again";
    } finally {
      setTimeout(() => {
        loadStarterRecipesBtn.textContent = originalLabel;
        loadStarterRecipesBtn.disabled = false;
      }, 2500);
    }
  });

  cancelRecipeBtn.addEventListener("click", () => {
    recipeForm.hidden = true;
  });

  recipeForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const name = recipeNameInput.value.trim();
    if (!name) return;
    const ingredients = recipeIngredientsInput.value
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    plan.recipes[makeId()] = {
      name,
      ingredients,
      quick: recipeQuickInput.checked,
      source: recipeSourceInput.value.trim(),
    };
    recipeForm.hidden = true;
    renderRecipes();
    renderMealsTable();
    scheduleSave();
  });

  generateShoppingBtn.addEventListener("click", () => {
    // Tally ingredients across every recipe-based meal planned this week.
    const counts = new Map(); // lowercased ingredient -> { text, count }
    DAYS.forEach((day) => {
      MEAL_TYPES.forEach(({ key }) => {
        const choice = plan.meals[day][key];
        if (!choice || choice.type !== "recipe") return;
        const recipe = plan.recipes[choice.recipeId];
        if (!recipe) return;
        recipe.ingredients.forEach((ingredient) => {
          const text = ingredient.trim();
          if (!text) return;
          const norm = text.toLowerCase();
          if (!counts.has(norm)) counts.set(norm, { text, count: 0 });
          counts.get(norm).count++;
        });
      });
    });

    // Keep manually-added items untouched, and preserve the checked state
    // of previously-generated items so re-generating doesn't uncheck
    // things already bought.
    const manualItems = plan.shoppingList.filter((i) => i.source === "manual");
    const previousMealItems = plan.shoppingList.filter((i) => i.source === "meal-plan");
    const baseName = (text) => text.replace(/\s*×\d+$/, "").toLowerCase();

    const generated = [];
    counts.forEach(({ text, count }) => {
      const existing = previousMealItems.find((i) => baseName(i.text) === text.toLowerCase());
      generated.push({
        id: existing ? existing.id : makeId(),
        text: count > 1 ? `${text} ×${count}` : text,
        checked: existing ? existing.checked : false,
        source: "meal-plan",
      });
    });

    plan.shoppingList = [...manualItems, ...generated];
    renderShoppingList();
    scheduleSave();
  });

  addItemForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const text = newItemInput.value.trim();
    if (!text) return;
    plan.shoppingList.push({ id: makeId(), text, checked: false, source: "manual" });
    newItemInput.value = "";
    renderShoppingList();
    scheduleSave();
  });

  clearCheckedBtn.addEventListener("click", () => {
    plan.shoppingList = plan.shoppingList.filter((i) => !i.checked);
    renderShoppingList();
    scheduleSave();
  });

  // ---------- Boot ----------

  (async function init() {
    try {
      const session = await checkSession();
      if (session.loggedIn) {
        await showApp(session.user);
      } else {
        showLogin();
      }
    } catch {
      showLogin("Couldn't reach the server — please refresh.");
    }
  })();
})();
