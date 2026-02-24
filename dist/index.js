import { displaycard, getTime } from "./card.js";
let taskForm = document.getElementById("taskForm");
let taskTitle = document.querySelector("input[type=text]");
let taskDate = document.querySelector("input[type=date]");
let taskTextArea = document.querySelector("textarea");
let selectPriority = document.querySelector("select");
let saveBtn = document.getElementById("saveBtn");
let cancelBtn = document.getElementById("cancelBtn");
let btnClose = document.getElementById("btnClose");
let taskTodoCount = document.getElementById("taskTodoCount");
let taskInProgressCount = document.getElementById("taskInProgressCount");
let taskCompleteCount = document.getElementById("taskCompleteCount");
const taskTodo = document.getElementById("tasks-todo");
const taskinprogress = document.getElementById("tasks-in-progress");
const taskscompleted = document.getElementById("tasks-completed");
let tasks = JSON.parse(localStorage.getItem("tasks") || "[]");
const bootstrapModal = new bootstrap.Modal(document.getElementById("taskModal"));
let editindex = null;
saveBtn.addEventListener("click", () => {
    // console.log(taskForm);
    // console.log(taskTitle.value);
    // console.log(taskDate.value);
    // console.log(taskTextArea.value);
    // console.log(selectPriority.value);
    const title = taskTitle.value.trim();
    const discription = taskTextArea.value.trim();
    const priority = selectPriority.value;
    const dueDate = taskDate.value;
    if (!title)
        return alert("Title required");
    if (editindex === null) {
        const newtask = {
            id: generateId(),
            priority,
            title,
            status: "todo",
            createdAt: Date.now(),
            ...(discription && { discription }),
            ...(dueDate && { dueDate }),
        };
        console.log(newtask);
        tasks.push(newtask);
        console.log(tasks);
    }
    else {
        const task = tasks[editindex];
        task.title = title;
        task.discription = discription || undefined;
        task.priority = priority;
        task.dueDate = dueDate;
    }
    saveCards();
    bootstrapModal.hide();
    clearinputs();
    displaydata();
});
function displaydata() {
    // let box = " ";
    // for (let i = 0; i < tasks.length; i++) {
    //   box += displaycard(tasks[i]!);
    // }
    // taskTodo.innerHTML = box;
    const empty = `<div class="empty-state text-center text-slate-100 fw-semibold">
                <i class="fa-regular fa-folder-open fs-1 mb-2 opacity-50"></i>
                <p class="mb-0">No tasks yet</p>
                <small>Click + to add one</small>
              </div>`;
    const todo = tasks.filter((t) => t.status === "todo");
    const inprogress = tasks.filter((t) => t.status === "in-progress");
    const completed = tasks.filter((t) => t.status === "completed");
    taskTodo.innerHTML = todo.length > 0 ? todo.map(displaycard).join("") : empty;
    taskinprogress.innerHTML =
        inprogress.length > 0 ? inprogress.map(displaycard).join("") : empty;
    taskscompleted.innerHTML =
        completed.length > 0 ? completed.map(displaycard).join("") : empty;
    updateCount();
    attachCardEvents();
}
cancelBtn.addEventListener("click", () => {
    bootstrapModal.hide();
    clearinputs();
});
btnClose.addEventListener("click", () => {
    // bootstrapModal.hide();
    clearinputs();
});
function clearinputs() {
    taskTitle.value = "";
    taskTextArea.value = "";
    selectPriority.value = "Medium";
    taskDate.value = "";
    editindex = null;
}
function generateId() {
    const userids = tasks.map((t) => parseInt(t.id.slice(1)));
    let newId = 1;
    while (userids.includes(newId)) {
        newId++;
    }
    return `#${newId.toString().padStart(3, "0")}`;
}
function saveCards() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}
function attachCardEvents() {
    document.querySelectorAll(".delete-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const taskId = e.currentTarget.dataset.id;
            tasks = tasks.filter((t) => t.id !== taskId);
            saveCards();
            displaydata();
        });
    });
    document.querySelectorAll(".edit-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const taskId = e.currentTarget.dataset.id;
            // console.log(taskId);
            editindex = tasks.findIndex((t) => t.id === taskId);
            // console.log(editindex);
            const task = tasks[editindex];
            console.log(task);
            taskTitle.value = task.title;
            taskTextArea.value = task.discription || "";
            // taskDate.value = task!.dueDate || "";
            selectPriority.value = task.priority;
            bootstrapModal.show();
        });
    });
    document.querySelectorAll(".status-btn").forEach((btn) => {
        btn.addEventListener("click", (e) => {
            const taskbtn = e.currentTarget;
            // console.log(taskbtn)
            const task = tasks.find((t) => t.id === taskbtn.dataset.id);
            // console.log(task);
            task.status = taskbtn.dataset.status;
            saveCards();
            displaydata();
        });
    });
}
function updateCount() {
    const todoCount = tasks.filter((t) => t.status === "todo").length;
    const inprogressCount = tasks.filter((t) => t.status === "in-progress").length;
    const completedCount = tasks.filter((t) => t.status === "completed").length;
    taskTodoCount.textContent = `${todoCount} tasks`;
    taskInProgressCount.textContent = `${inprogressCount} tasks`;
    taskCompleteCount.textContent = `${completedCount} tasks`;
}
function startTimer() {
    setInterval(() => {
        document.querySelectorAll(".time").forEach((el) => {
            const createdAt = Number(el.dataset.created);
            el.textContent = getTime(createdAt);
        });
    }, 60000);
}
displaydata();
startTimer();
//# sourceMappingURL=index.js.map