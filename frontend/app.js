const baseUrl = "https://smart-focus-tracker.onrender.com/tasks";

async function loadTasks() {
  const res = await fetch(baseUrl);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    if (task.completed) {
      li.classList.add("completed");
    }

    li.innerHTML = `
      <div class="task-left">
        <input
          type="checkbox"
          ${task.completed ? "checked" : ""}
          onchange="toggleTask('${task._id}')"
        />
        <span>${task.title}</span>
      </div>

      <button onclick="deleteTask('${task._id}')">Delete</button>
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

  await fetch(baseUrl, {
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
  await fetch(`${baseUrl}/${id}/toggle`, {
    method: "PATCH"
  });

  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}

document.getElementById("taskInput").addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    createTask();
  }
});

loadTasks();