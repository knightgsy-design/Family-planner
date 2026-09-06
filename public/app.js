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

  function renderAll() {
    renderDaily();
    renderTable();
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
        body: JSON.stringify({ grid: plan.grid, notes: plan.notes }),
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
