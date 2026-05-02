let tasksData = {};
const todo = document.querySelector("#todo");
const progress = document.querySelector("#progress");
const done = document.querySelector("#done");

let dragElement = null;

// 🔥 count update
function updateCount() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll(".task");
    const count = col.querySelector(".right");
    count.innerText = tasks.length;
  });
}

// 🔥 save data
function saveData() {
  [todo, progress, done].forEach((col) => {
    const tasks = col.querySelectorAll(".task");

    tasksData[col.id] = Array.from(tasks).map((t) => {
      return {
        title: t.querySelector("h2").innerText,
        desc: t.querySelector("p").innerText,
      };
    });
  });

  localStorage.setItem("tasks", JSON.stringify(tasksData));
}

// 🔥 drag event
function addDragEvent(el) {
  el.addEventListener("dragstart", () => {
    dragElement = el;
  });
}

// 🔥 delete event
function addDeleteEvent(el) {
  el.querySelector("button").addEventListener("click", () => {
    el.remove();
    updateCount();
    saveData();
  });
}

// 🔥 create task
function createTask(title, desc, column) {
  const div = document.createElement("div");

  div.classList.add("task");
  div.setAttribute("draggable", "true");

  div.innerHTML = `
    <h2>${title}</h2>
    <p>${desc}</p>
    <button>Delete</button>
  `;

  column.appendChild(div);

  addDragEvent(div);
  addDeleteEvent(div);
}

// ✅ LOAD FROM LOCALSTORAGE
if (localStorage.getItem("tasks")) {
  tasksData = JSON.parse(localStorage.getItem("tasks"));

  for (const col in tasksData) {
    const column = document.querySelector(`#${col}`);

    tasksData[col].forEach((task) => {
      createTask(task.title, task.desc, column);
    });
  }
}

updateCount();

// 🔥 DRAG EVENTS
function addDragEventsOnColumn(column) {
  column.addEventListener("dragenter", (e) => {
    e.preventDefault();
    column.classList.add("hover-over");
  });

  column.addEventListener("dragleave", (e) => {
    e.preventDefault();
    column.classList.remove("hover-over");
  });

  column.addEventListener("dragover", (e) => {
    e.preventDefault();
  });

  column.addEventListener("drop", (e) => {
    e.preventDefault();

    column.appendChild(dragElement);
    column.classList.remove("hover-over");

    updateCount();
    saveData();
  });
}

addDragEventsOnColumn(todo);
addDragEventsOnColumn(progress);
addDragEventsOnColumn(done);

// 🔥 MODAL
const toggleModalButton = document.querySelector("#toggle-modal");
const modalBg = document.querySelector(".bg");
const modal = document.querySelector(".modal");
const addTaskButton = document.querySelector("#add-new-task");

toggleModalButton.addEventListener("click", () => {
  modal.classList.toggle("active");
});

modalBg.addEventListener("click", () => {
  modal.classList.remove("active");
});

// 🔥 ADD TASK
addTaskButton.addEventListener("click", () => {
  const taskTitle = document.querySelector("#task-title-input").value;
  const taskDesc = document.querySelector("#task-desc-input").value;

  createTask(taskTitle, taskDesc, todo);

  updateCount();
  saveData();

  modal.classList.remove("active");
});

// 🔥 CLEAR ALL BUTTON (NEW)
const clearBtn = document.querySelector("#clear-all");

if (clearBtn) {
  clearBtn.addEventListener("click", () => {
    const confirmClear = confirm("Delete all tasks?");

    if (confirmClear) {
      localStorage.removeItem("tasks");

      document.querySelectorAll(".task").forEach((t) => t.remove());

      updateCount();
    }
  });
}