const baseUrl = "https://smart-focus-tracker.onrender.com/tasks";

async function loadTasks() {
  const res = await fetch(baseUrl);
  const tasks = await res.json();

  const list = document.getElementById("taskList");
  list.innerHTML = "";

  tasks.forEach(task => {
    const li = document.createElement("li");

    li.innerHTML = `
      ${task.title}
      <button onclick="deleteTask('${task._id}')">❌</button>
    `;

    list.appendChild(li);
  });
}

async function createTask() {
  const input = document.getElementById("taskInput");

  await fetch(baseUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ title: input.value })
  });

  input.value = "";
  loadTasks();
}

async function deleteTask(id) {
  await fetch(`${baseUrl}/${id}`, {
    method: "DELETE"
  });

  loadTasks();
}

loadTasks();