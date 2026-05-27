const apiBase = "http://localhost:5000";
// const apiBase = "https://smart-focus-tracker.onrender.com";

const tasksUrl = `${apiBase}/tasks`;
const sessionsUrl = `${apiBase}/sessions`;

let selectedTaskId = null;
let selectedTaskTitle = "";
let activeSessionId = null;
let sessionStartedAt = null;
let timerInterval = null;

async function loadTasks() {
  const res = await fetch(tasksUrl);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    if (task._id === selectedTaskId) {
      li.classList.add("selected");
    }

    li.innerHTML = `
      <div class="task-left">
        <input
          type="checkbox"
          title="Mark task as completed"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask('${task._id}')"
        />
        <span>${task.title}</span>
      </div>

      <div class="task-actions">
        <button
          onclick="selectTask('${task._id}', '${escapeText(task.title)}')"
          ${task.completed ? "disabled" : ""}
        >
          Select
        </button>
        <button onclick="deleteTask('${task._id}')">Delete</button>
      </div>
    `;

    list.appendChild(li);
  });
}

async function createTask() {
  const input = document.getElementById("taskInput");
  const title = input.value.trim();

  if (!title) {
    return;
  }

  await fetch(tasksUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title })
  });

  input.value = "";
  loadTasks();
}

async function toggleTask(id) {
  await fetch(`${tasksUrl}/${id}/toggle`, {
    method: "PATCH"
  });

  if (selectedTaskId === id) {
    selectedTaskId = null;
    selectedTaskTitle = "";
    document.getElementById("selectedTaskLabel").textContent = "No task selected";
  }

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${tasksUrl}/${id}`, {
    method: "DELETE"
  });

  if (selectedTaskId === id) {
    selectedTaskId = null;
    selectedTaskTitle = "";
    document.getElementById("selectedTaskLabel").textContent = "No task selected";
  }

  loadTasks();
}

function selectTask(id, title) {
  selectedTaskId = id;
  selectedTaskTitle = title;

  document.getElementById("selectedTaskLabel").textContent = `Selected task: ${title}`;
  document.getElementById("startSessionButton").disabled = false; // ← add this line

  loadTasks();
}

async function startFocusSession() {
  if (!selectedTaskId) {
    alert("Select a task before starting a focus session.");
    return;
  }

  const res = await fetch(`${sessionsUrl}/start`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      taskId: selectedTaskId
    })
  });

  const session = await res.json();

  activeSessionId = session._id;
  sessionStartedAt = new Date(session.startTime);

  document.getElementById("startSessionButton").disabled = true;
  document.getElementById("stopSessionButton").disabled = false;

  startTimer();
}

async function stopFocusSession() {
  if (!activeSessionId) {
    return;
  }

  await fetch(`${sessionsUrl}/${activeSessionId}/stop`, {
    method: "PATCH"
  });

  activeSessionId = null;
  sessionStartedAt = null;

  clearInterval(timerInterval);
  timerInterval = null;

  document.getElementById("timerDisplay").textContent = "00:00";
  document.getElementById("startSessionButton").disabled = false;
  document.getElementById("stopSessionButton").disabled = true;

  loadSessions();
}

async function loadSessions() {
  const res = await fetch(sessionsUrl);
  const sessions = await res.json();

  const list = document.getElementById("sessionList");
  list.innerHTML = "";

  sessions.forEach(session => {
    const li = document.createElement("li");
    li.classList.add("session-item");

    const taskTitle = session.taskId?.title || "No task selected";
    const duration = session.durationMinutes || 0;
    const status = session.status;

    const startedAt = session.startTime
      ? new Date(session.startTime).toLocaleString()
      : "Unknown start time";

    li.innerHTML = `
      <div class="session-info">
        <strong>${taskTitle}</strong>
        <span>${duration} min · ${status}</span>
        <small>${startedAt}</small>
      </div>

      <button onclick="deleteSession('${session._id}')">Delete</button>
    `;

    list.appendChild(li);
  });
}

async function deleteSession(id) {
  await fetch(`${sessionsUrl}/${id}`, {
    method: "DELETE"
  });

  loadSessions();
}

function startTimer() {
  updateTimer();

  timerInterval = setInterval(() => {
    updateTimer();
  }, 1000);
}

function updateTimer() {
  if (!sessionStartedAt) {
    return;
  }

  const now = new Date();
  const elapsedSeconds = Math.floor((now - sessionStartedAt) / 1000);

  const minutes = String(Math.floor(elapsedSeconds / 60)).padStart(2, "0");
  const seconds = String(elapsedSeconds % 60).padStart(2, "0");

  document.getElementById("timerDisplay").textContent = `${minutes}:${seconds}`;
}

function escapeText(text) {
  return text.replace(/'/g, "\\'");
}

document.getElementById("taskInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    createTask();
  }
});

document.getElementById("startSessionButton").addEventListener("click", startFocusSession);
document.getElementById("stopSessionButton").addEventListener("click", stopFocusSession);

loadTasks();
loadSessions();