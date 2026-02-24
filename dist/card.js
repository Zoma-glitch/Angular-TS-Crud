export function displaycard(task) {
    const desc = task.discription
        ? `<p class="fw-semibold text-secondary mb-2">${task.discription}</p>`
        : "";
    let priorityBadge = "";
    switch (task.priority) {
        case "Low":
            priorityBadge = `<span
                    class="badge priority-badge text-primary bg-info-subtle"
                  >
                    <span class="priority-dot bg-primary"></span>
                    Low
                  </span>`;
            break;
        case "Medium":
            priorityBadge = `<span class="badge priority-badge bg-amber-50 text-amber-500">
                    <span class="priority-dot bg-amber-500"></span>
                    Medium
                  </span>`;
            break;
        case "High":
            priorityBadge = `<span class="badge priority-badge text-red bg-red">
                    <span class="priority-dot bg-dark-red"></span>
                    High Priority
                  </span>`;
            break;
        default:
            break;
    }
    const completeBadge = task.status === "completed"
        ? `<span
                    class="badge priority-badge text-emerald-500 bg-emerald-50"
                  >
                    <i class="fa-solid fa-check"></i>
                    Done
                  </span>`
        : "";
    // console.log(dueDateState(task.dueDate));
    let dueBadge = "";
    let dueDateRow = "";
    if (task.dueDate) {
        let dateColorClass = "text-slate-100";
        if (task.status !== "completed") {
            const state = dueDateState(task.dueDate);
            if (state === "overdue") {
                dateColorClass = "text-red";
            }
            else if (state === "soon")
                dateColorClass = "text-amber-500";
        }
        dueDateRow = `<div class=" ${dateColorClass}">
    <i class="fa-regular fa-calendar"></i>
    <span>${formatDate(task.dueDate)}</span>
  </div>`;
    }
    if (task.dueDate && task.status !== "completed") {
        const state = dueDateState(task.dueDate);
        if (state === "overdue") {
            dueBadge = `<span class="badge text-red bg-red">
                    
                    OVERDUE
                  </span>`;
        }
        else if (state === "soon") {
            dueBadge = `<span class="badge text-amber-500 bg-amber-50">
                    
                    Due Soon
                  </span>`;
        }
    }
    return `
     <div class="task-card card p-3 shadow-sm border">
                <div
                  class="d-flex justify-content-between align-items-center mb-3"
                >
                  <div class="d-flex align-items-center gap-2">
                    <span class="dot ${task.status === "todo" ? "bg-secondary" : task.status === "in-progress" ? "bg-amber-500" : "bg-emerald-500"}"></span>
                    <span class="task-id text-uppercase">${task.id}</span>
                  </div>

                  <div class="task-actions">
                    <button
                      class="btn btn-sm btn-light edit-btn" data-id="${task.id}"
                      title="Edit task"
                    >
                      <i class="fa-solid fa-pen small"></i>
                    </button>

                    <button
                      class="btn btn-sm btn-light delete-btn text-danger" data-id="${task.id}"
                      title="Delete task"
                    >
                      <i class="fa-solid fa-trash-can small"></i>
                    </button>
                  </div>
                </div>

                <h6 class="fw-semibold text-dark mb-2">${task.title}</h6>
                ${desc}
                <div class="d-flex flex-wrap align-items-center gap-2 mb-3">
                ${priorityBadge}
                ${dueBadge}
                ${completeBadge}
                </div>

                <div
                  class="d-flex align-items-center gap-3 text-muted small pb-3 mb-3 border-bottom"
                >
                  ${dueDateRow}
                  <div class="d-flex align-items-center gap-1">
                    <i class="fa-regular fa-clock text-slate-100"></i>
                    <span class="text-slate-100 time" data-created="${task.createdAt}">${getTime(task.createdAt)}</span>
                  </div>
                </div>

                ${renderStatusButtons(task)}
              </div>
    
    `;
}
function renderStatusButtons(task) {
    let buttons = "";
    if (task.status === "todo") {
        buttons += `<button
                    class="btn btn-sm text-amber-500 bg-amber-50 status-btn" data-id="${task.id}"
                    data-status="in-progress"
                  >
                    <i class="fa-solid fa-play"></i> Start
                  </button>`;
        buttons += `<button
                    class="btn btn-sm text-emerald-500 bg-emerald-50 status-btn" data-id="${task.id}"
                    data-status="completed"
                  >
                    <i class="fa-solid fa-check"></i> Complete
                  </button>`;
    }
    else if (task.status === "in-progress") {
        buttons += `<button
                    class="btn btn-sm text-secondary bg-slate-100 status-btn" data-id="${task.id}" 
                    data-status="todo"
                  >
                    <i class="fa-solid fa-arrow-rotate-left me-1"></i>To Do
                  </button>`;
        buttons += `<button
                    class="btn btn-sm text-emerald-500 bg-emerald-50 status-btn" data-id="${task.id}"
                    data-status="completed"
                  >
                    <i class="fa-solid fa-check"></i> Complete
                  </button>`;
    }
    else {
        buttons += `<button
                    class="btn btn-sm text-secondary bg-slate-100 status-btn" data-id="${task.id}" 
                    data-status="todo"
                  >
                    <i class="fa-solid fa-arrow-rotate-left me-1"></i>To Do
                  </button>`;
        buttons += `<button
                    class="btn btn-sm text-amber-500 bg-amber-50 status-btn" data-id="${task.id}"
                    data-status="in-progress"
                  >
                    <i class="fa-solid fa-play"></i> Start
                  </button>`;
    }
    return `<div class="d-flex flex-wrap gap-2">${buttons}</div>`;
}
function formatDate(dataString) {
    const date = new Date(dataString);
    return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
    });
}
function dueDateState(dueDate) {
    const now = new Date().getTime();
    const due = new Date(dueDate).getTime();
    const diff = due - now;
    console.log(diff);
    if (diff < 0) {
        return "overdue";
    }
    if (diff <= 24 * 60 * 60 * 1000) {
        return "soon";
    }
    return "normal";
}
export function getTime(createdAt) {
    const diff = Date.now() - createdAt;
    const mins = Math.floor(diff / 60000);
    const hours = Math.floor(mins / 60);
    const days = Math.floor(hours / 24);
    console.log("mins is" + mins);
    console.log("hours is" + hours);
    if (mins < 60) {
        return `${mins}m ago`;
    }
    if (hours < 24) {
        return `${hours}h ago`;
    }
    return `${days}d ago`;
}
//# sourceMappingURL=card.js.map