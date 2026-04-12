// GLOBAL TASK STORAGE
let tasks = [];
let taskCounter = 0;


// =============================
// 1. CREATE TASK CARD
// =============================
function createTaskCard(taskObj) {
  // Main <li>
  const li = document.createElement("li");
  li.setAttribute("data-id", taskObj.id);
  li.classList.add("task-card");

  // Title
  const title = document.createElement("h3");
  title.textContent = taskObj.title;

  // Description
  const desc = document.createElement("p");
  desc.textContent = taskObj.description;

  // Priority Badge
  const priority = document.createElement("span");
  priority.textContent = taskObj.priority;
  priority.classList.add("badge");
  priority.classList.add(taskObj.priority); // e.g. high, medium, low

  // Due Date
  const date = document.createElement("small");
  date.textContent = "Due: " + taskObj.dueDate;

  // Edit Button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.classList.add("edit-btn");
  editBtn.addEventListener("click", function () {
    editTask(taskObj.id);
  });

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.classList.add("delete-btn");
  deleteBtn.addEventListener("click", function () {
    deleteTask(taskObj.id);
  });

  // Append everything
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
  // Add to array
  tasks.push(taskObj);

  // Find column
  const column = document.getElementById(columnId);
  const taskList = column.querySelector(".task-list");

  // Create card
  const card = createTaskCard(taskObj);

  // Append
  taskList.appendChild(card);

  // Update counter
  taskCounter++;
  document.getElementById("task-count").textContent = taskCounter;
}