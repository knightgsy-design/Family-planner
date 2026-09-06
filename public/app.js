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

  const loginView = document.getElementById("login-view");
  const appView = document.getElementById("app-view");
  const loginForm = document.getElementById("login-form");
  const loginError = document.getElementById("login-error");
  const logoutBtn = document.getElementById("logout-btn");
  const whoami = document.getElementById("whoami");
  const statusEl = document.getElementById("status-indicator");
  const table = document.getElementById("plan-table");
  const notesSection = document.getElementById("notes-section");

  let plan = null; // { grid, notes, updatedAt, updatedBy }
  let currentUser = null;
  let saveTimer = null;
  let pollTimer = null;
  let saving = false;

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

  // ---------- Rendering ----------

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

        const textarea = document.createElement("textarea");
        textarea.rows = 1;
        textarea.value = (plan.grid[slot] && plan.grid[slot][day]) || "";
        textarea.dataset.slot = slot;
        textarea.dataset.day = day;
        textarea.addEventListener("input", () => {
          if (!plan.grid[slot]) plan.grid[slot] = {};
          plan.grid[slot][day] = textarea.value;
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
    renderTable();
    renderNotes();
    updateMeta();
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
        const remoteVal = (remote.grid[slot] && remote.grid[slot][day]) || "";
        if (plan.grid[slot]) plan.grid[slot][day] = remoteVal;
        if (el && el.value !== remoteVal) {
          el.value = remoteVal;
          autoResize(el);
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
