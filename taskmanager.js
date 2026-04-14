// GLOBAL TASK STORAGE
let tasks = [];
let taskCounter = 0;


// =============================
// 1. CREATE TASK CARD
// =============================
function createTaskCard(taskObj) {

  const li = document.createElement("li");
  li.setAttribute("data-id", taskObj.id);
  li.classList.add("task-card");

  // Title (for inline editing)
  const title = document.createElement("h3");
  title.textContent = taskObj.title;
  title.setAttribute("data-id", taskObj.id);
  title.classList.add("task-title");

  // Description
  const desc = document.createElement("p");
  desc.textContent = taskObj.description;

  // Priority Badge
  const priority = document.createElement("span");
  priority.textContent = taskObj.priority;
  priority.classList.add("badge");
  priority.classList.add(taskObj.priority);

  // Due Date
  const date = document.createElement("small");
  date.textContent = "Due: " + taskObj.dueDate;

  // Edit Button (event delegation)
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.setAttribute("data-action", "edit");
  editBtn.setAttribute("data-id", taskObj.id);

  // Delete Button (event delegation)
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.setAttribute("data-action", "delete");
  deleteBtn.setAttribute("data-id", taskObj.id);

  // Append
  li.appendChild(title);
  li.appendChild(desc);
  li.appendChild(priority);
  li.appendChild(date);
  li.appendChild(editBtn);
  li.appendChild(deleteBtn);

  return li;
}


// =============================
// 2. ADD TASK
// =============================
function addTask(columnId, taskObj) {

  tasks.push(taskObj);

  const column = document.getElementById(columnId);
  const taskList = column.querySelector(".task-list");

  const card = createTaskCard(taskObj);
  taskList.appendChild(card);

  taskCounter++;
  document.getElementById("task-count").textContent = taskCounter;
}


// =============================
// 3. DELETE TASK
// =============================
function deleteTask(taskId) {

  const card = document.querySelector('[data-id="' + taskId + '"]');
  if (!card) return;

  card.classList.add("fade-out");

  card.addEventListener("animationend", function () {

    card.remove();

    tasks = tasks.filter(function (t) {
      return t.id !== taskId;
    });

    taskCounter--;
    document.getElementById("task-count").textContent = taskCounter;

  });
}


// =============================
// 4. EDIT TASK (MODAL)
// =============================
function editTask(taskId) {

  const task = tasks.find(function (t) {
    return t.id === taskId;
  });

  if (!task) return;

  document.getElementById("task-title").value = task.title;
  document.getElementById("task-desc").value = task.description;
  document.getElementById("task-priority").value = task.priority;
  document.getElementById("task-date").value = task.dueDate;

  document.getElementById("task-modal").setAttribute("data-edit-id", taskId);
  document.getElementById("task-modal").classList.remove("hidden");
}


// =============================
// 5. UPDATE TASK
// =============================
function updateTask(taskId, updatedData) {

  const task = tasks.find(function (t) {
    return t.id === taskId;
  });

  if (!task) return;

  task.title = updatedData.title;
  task.description = updatedData.description;
  task.priority = updatedData.priority;
  task.dueDate = updatedData.dueDate;

  const oldCard = document.querySelector('[data-id="' + taskId + '"]');
  if (!oldCard) return;

  const parent = oldCard.parentNode;
  const newCard = createTaskCard(task);

  parent.replaceChild(newCard, oldCard);
}


// =============================
// EVENT DELEGATION (EDIT + DELETE)
// =============================
const columns = document.querySelectorAll(".task-list");

columns.forEach(function (ul) {

  ul.addEventListener("click", function (event) {

    const action = event.target.getAttribute("data-action");
    const id = event.target.getAttribute("data-id");

    if (!action || !id) return;

    const taskId = parseInt(id);

    if (action === "edit") {
      editTask(taskId);
    }

    if (action === "delete") {
      deleteTask(taskId);
    }

  });

});


// =============================
// INLINE EDITING (DOUBLE CLICK)
// =============================
document.addEventListener("dblclick", function (event) {

  if (!event.target.classList.contains("task-title")) return;

  const titleElement = event.target;
  const taskId = parseInt(titleElement.getAttribute("data-id"));

  const input = document.createElement("input");
  input.type = "text";
  input.value = titleElement.textContent;

  titleElement.replaceWith(input);
  input.focus();

  function saveEdit() {

    const newValue = input.value;

    const task = tasks.find(function (t) {
      return t.id === taskId;
    });

    if (task) {
      task.title = newValue;
    }

    const newTitle = document.createElement("h3");
    newTitle.textContent = newValue;
    newTitle.setAttribute("data-id", taskId);
    newTitle.classList.add("task-title");

    input.replaceWith(newTitle);
  }

  input.addEventListener("keydown", function (e) {
    if (e.key === "Enter") saveEdit();
  });

  input.addEventListener("blur", saveEdit);

});


// =============================
// PRIORITY FILTER
// =============================
document.getElementById("filter").addEventListener("change", function () {

  const selected = this.value;
  const allCards = document.querySelectorAll(".task-card");

  allCards.forEach(function (card) {

    const badge = card.querySelector(".badge");
    const priority = badge.textContent;

    const shouldHide = (selected !== "all" && priority !== selected);

    card.classList.toggle("is-hidden", shouldHide);

  });

});


// =============================
// CLEAR DONE (STAGGER)
// =============================
document.getElementById("clear-done").addEventListener("click", function () {

  const doneList = document.querySelector("#done .task-list");
  const cards = doneList.querySelectorAll(".task-card");

  cards.forEach(function (card, index) {

    setTimeout(function () {

      card.classList.add("fade-out");

      card.addEventListener("animationend", function () {

        const id = parseInt(card.getAttribute("data-id"));

        card.remove();

        tasks = tasks.filter(function (t) {
          return t.id !== id;
        });

        taskCounter--;
        document.getElementById("task-count").textContent = taskCounter;

      });

    }, index * 100);

  });

});


// =============================
// MODAL BUTTONS (SAVE / CANCEL)
// =============================
document.getElementById("save-task").addEventListener("click", function () {

  const modal = document.getElementById("task-modal");

  const title = document.getElementById("task-title").value;
  const desc = document.getElementById("task-desc").value;
  const priority = document.getElementById("task-priority").value;
  const date = document.getElementById("task-date").value;

  const editId = modal.getAttribute("data-edit-id");

  if (editId) {

    updateTask(parseInt(editId), {
      title: title,
      description: desc,
      priority: priority,
      dueDate: date
    });

    modal.removeAttribute("data-edit-id");

  } else {

    const column = modal.getAttribute("data-column");

    const newTask = {
      id: Date.now(),
      title: title,
      description: desc,
      priority: priority,
      dueDate: date,
      status: column
    };

    addTask(column, newTask);
  }

  modal.classList.add("hidden");

});


document.getElementById("cancel-task").addEventListener("click", function () {
  document.getElementById("task-modal").classList.add("hidden");
});


// =============================
// ADD TASK BUTTONS (OPEN MODAL)
// =============================
const addButtons = document.querySelectorAll(".add-task-btn");

addButtons.forEach(function (btn) {

  btn.addEventListener("click", function () {

    const column = btn.parentElement.id;

    const modal = document.getElementById("task-modal");

    modal.setAttribute("data-column", column);

    document.getElementById("task-title").value = "";
    document.getElementById("task-desc").value = "";
    document.getElementById("task-priority").value = "medium";
    document.getElementById("task-date").value = "";

    modal.classList.remove("hidden");

  });

});
