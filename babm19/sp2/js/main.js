const $taskForm = $("#taskForm");
const $taskName = $("#taskName");
const $dueDate = $("#dueDate");
const $prioritySelect = $("#prioritySelect");
const $taskFilter = $("#taskFilter");
const $taskList = $("#taskList");

const $editTaskInput = $("#editTaskInput");
const $editTaskModal = $("#editTaskModal");
const $saveTaskEdit = $("#saveTaskEdit");

const $editDescriptionInput = $("#editDescriptionInput");
const $editDescriptionModal = $("#editDescriptionModal");
const $saveDescriptionEdit = $("#saveDescriptionEdit");

const $editDueDateInput = $("#editDueDateInput");
const $editDueDateModal = $("#editDueDateModal");
const $saveDueDate = $("#saveDueDate");

const $deleteConfirmModal = $("#deleteConfirmModal");
const $confirmDelete = $("#confirmDelete");

const $editPriorityModal = $("#editPriorityModal");
const $savePriority = $("#savePriority");

const $toggleCompletedTasks = $("#toggleCompletedTasks");

const $taskToast = $("#taskToast");
const $loader = $(`
    <div id="loader" class="loader-container">
        <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
        </div>
    </div>
`);

$("body").append($loader);

let selectedTaskId = null;
let currentSort = "manual";
let showCompleted = false;

const showLoader = () => $loader.show();
const hideLoader = () => $loader.hide();

const fetchTasks = async (showCompleted = false) => {
    showLoader();
    try {
        let tasks = [];
        if (showCompleted) {
            const response = await fetch("https://api.todoist.com/sync/v9/completed/get_all", {
                method: "GET",
                headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
            });

            if (!response.ok) throw new Error("Failed to fetch completed tasks");
            const data = await response.json();
            tasks = data.items || [];
        } else {
            const response = await fetch(TODOIST_API_URL, {
                method: "GET",
                headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
            });

            if (!response.ok) throw new Error("Failed to fetch tasks");
            tasks = await response.json();
        }

        renderTasks(tasks, showCompleted);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    } finally {
        hideLoader();
    }
};


$(document).ready(() => {
    const savedFilter = localStorage.getItem("taskFilter");
    const savedSort = localStorage.getItem("currentSort");

    if (savedFilter) $taskFilter.val(savedFilter);
    if (savedSort) currentSort = savedSort;

    fetchTasks();

    $taskForm.on("submit", function (e) {
        e.preventDefault();
        addTask();
    });
});


$(".sort-option").on("click", function () {
    currentSort = $(this).data("sort");
    fetchTasks();
});

$saveTaskEdit.on("click", () => {
    updateTask(selectedTaskId, $editTaskInput.val());
    $editTaskModal.modal("hide");
});

$saveDescriptionEdit.on("click", () => {
    updateTaskDescription(selectedTaskId, $editDescriptionInput.val());
    $editDescriptionModal.modal("hide");
});

$saveDueDate.on("click", () => {
    updateTaskDueDate(selectedTaskId, $editDueDateInput.val());
    $editDueDateModal.modal("hide");
});

$savePriority.on("click", () => {
    updateTaskPriority(selectedTaskId, $prioritySelect.val());
    $editPriorityModal.modal("hide");
});

$(document).on("click", ".edit-task", function () {
    selectedTaskId = $(this).data("id");
    $editTaskInput.val($(this).closest("li").find("strong").text());
    $editTaskModal.modal("show");
});

$(document).on("click", ".edit-description", function () {
    selectedTaskId = $(this).data("id");
    $editDescriptionInput.val($(this).closest("li").find(".task-description").text());
    $editDescriptionModal.modal("show");
});

$(document).on("click", ".edit-due-date", function () {
    selectedTaskId = $(this).data("id");
    const existingDueDate = $(this).closest("li").find(".due-date").text();
    $editDueDateInput.val(existingDueDate 
        ? new Date(existingDueDate).toLocaleDateString("cs-CZ", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric" 
        }) 
        : ""
    );
    $editDueDateModal.modal("show");
});

$(document).on("click", ".edit-priority", function () {
    selectedTaskId = $(this).data("id");
    const existingPriority = $(this).closest("li").data("priority");
    $prioritySelect.val(existingPriority || 4);
    $editPriorityModal.modal("show");
});

$(document).on("click", ".delete-task", function () {
    selectedTaskId = $(this).data("id");
    $deleteConfirmModal.modal("show");
});

$(document).on("click", "#confirmDelete", function () {
    deleteTask(selectedTaskId);
    $deleteConfirmModal.modal("hide");
});

$(document).on("click", ".complete-task", function () {
    selectedTaskId = $(this).data("id");
    completeTask(selectedTaskId);
});

$(document).on("click", ".reopen-task", function () {
    const taskId = $(this).data("id");
    const taskContent = $(this).data("content") || $(this).closest("li").find("strong").text();
    reopenTask(taskId, taskContent);
});

$toggleCompletedTasks.on("click", () => {
    showCompleted = !showCompleted;
    fetchTasks(showCompleted);

    $toggleCompletedTasks.text(showCompleted ? "Show active tasks" : "Show completed tasks");
});

$taskFilter.on("change", function () {
    const filterValue = $taskFilter.val();
    localStorage.setItem("taskFilter", filterValue);
    fetchTasks();
});

$(".sort-option").on("click", function () {
    currentSort = $(this).data("sort");
    localStorage.setItem("currentSort", currentSort);
    fetchTasks();
});


$(document).on("click", ".edit-task", function () {
    selectedTaskId = $(this).data("id");
    localStorage.setItem("selectedTaskId", selectedTaskId);
    $editTaskInput.val($(this).closest("li").find("strong").text());
    $editTaskModal.modal("show");
});

selectedTaskId = localStorage.getItem("selectedTaskId") || null;

const sortTasks = (tasks) => {
    return tasks.sort((a, b) => {
        switch (currentSort) {
            case "name":
                return a.content.localeCompare(b.content);
            case "dateAdded":
                return new Date(a.created_at) - new Date(b.created_at);
            case "dueDate":
            case "date":
                return new Date(a.due?.date || 0) - new Date(b.due?.date || 0);
            case "priority":
                return a.priority - b.priority;
            default:
                return 0; 
        }
    });
};

const renderTasks = (tasks, showCompleted = false) => {
    $taskList.empty();
    const sortedTasks = sortTasks(tasks);
    const fragment = $(document.createDocumentFragment());

    sortedTasks.forEach(task => {
        const dueDate = $dueDate.val() || new Date().toLocaleDateString("cs-CZ", { 
            day: "2-digit", 
            month: "2-digit", 
            year: "numeric" 
        });
        const storedPriority = localStorage.getItem(`taskPriority-${task.id}`);
        const priority = storedPriority ? parseInt(storedPriority) : task.priority || 4;
        const priorityIcon = getPriorityIcon(priority);

        const taskItem = $(`
            <li class="list-group-item d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center">
                    <span><strong>${task.content}</strong> ${priorityIcon}</span>
                    <div>
                        ${showCompleted 
                            ? `<button class="btn btn-secondary btn-sm reopen-task" data-id="${task.id}">
                                <i class="bi bi-arrow-counterclockwise"></i>
                              </button>`
                            : `<button class="btn btn-success btn-sm complete-task" data-id="${task.id}">
                                <i class="bi bi-check2-circle"></i>
                              </button>`}
                        
                        <button class="btn btn-warning btn-sm edit-task" data-id="${task.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-info btn-sm edit-description" data-id="${task.id}">
                            <i class="bi bi-file-text"></i>
                        </button>
                        <button class="btn btn-primary btn-sm edit-due-date" data-id="${task.id}" data-due="${dueDate}">
                            <i class="bi bi-calendar"></i>
                        </button>
                        <button class="btn btn-dark btn-sm edit-priority" data-id="${task.id}" data-priority="${priority}">
                            <i class="bi bi-arrow-up-circle"></i>
                        </button>
                        <button class="btn btn-danger btn-sm delete-task" data-id="${task.id}">
                            <i class="bi bi-trash"></i>
                        </button>
                    </div>
                </div>
                <small class="text-muted">Due: <span class="due-date">${dueDate}</span></small>
                <p class="task-description">${task.description || "No description"}</p>
            </li>
        `);

        fragment.append(taskItem);
    });

    $taskList.append(fragment);
};


const completeTask = async (taskId) => {
    if (!taskId) {
        console.error("Error: Task ID is missing!");
        return;
    }

    try {
        const taskElement = $(`#taskList li[data-id="${taskId}"]`);
        const taskPriority = taskElement.data("priority") || 4;

        localStorage.setItem(`taskPriority-${taskId}`, taskPriority);

        const response = await fetch(`${TODOIST_API_URL}/${taskId}/close`, {
            method: "POST",
            headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
        });

        if (!response.ok) throw new Error(`Failed to complete task: ${response.status}`);

        console.log("Task successfully closed.");
        fetchTasks();
    } catch (error) {
        console.error("Error completing task:", error);
    } finally {
        fetchTasks();
    }
};

const reopenTask = async (taskId, taskContent) => {
    try {
        const storedPriority = parseInt(localStorage.getItem(`taskPriority-${taskId}`)) || 1;

        const taskData = {
            content: taskContent,
            project_id: TODOIST_PROJECT_ID,
            priority: storedPriority,
        };

        const response = await fetch(TODOIST_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error("Failed to reopen (recreate) task");

        fetchTasks(); 
    } catch (error) {
        console.error("Error reopening task:", error);
    }
};

const addTask = async () => {
    const taskName = $taskName.val().trim();
    const dueDate = $dueDate.val() || new Date().toISOString().split("T")[0];
    const selectedPriority = parseInt($prioritySelect.val()) || 4;

    const priorityMap = { 1: 4, 2: 3, 3: 2, 4: 1 };
    const priority = priorityMap[selectedPriority];

    if (!taskName) {
        new bootstrap.Toast($taskToast[0]).show();
        return;
    }

    const taskData = {
        content: taskName,
        project_id: TODOIST_PROJECT_ID,
        priority: priority,
        due_date: dueDate
    };

    try {
        const response = await fetch(TODOIST_API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) throw new Error("Failed to add task");

        $taskName.val("");
        $dueDate.val("");
        $prioritySelect.val("4");

        fetchTasks();
    } catch (error) {
        console.error("Error adding task:", error);
    }
};

const updateTask = async (taskId, updatedContent) => {
    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify({ content: updatedContent })
        });

        if (!response.ok) throw new Error("Failed to update task");

        $(`#taskList li[data-id="${taskId}"] strong`).text(updatedContent);

    } catch (error) {
        console.error("Error updating task:", error);
    }finally {
        fetchTasks();
    }
};

const updateTaskDescription = async (taskId, description) => {
    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify({ description })
        });

        if (!response.ok) throw new Error("Failed to update task description");

        $(`#taskList li[data-id="${taskId}"] .task-description`).text(description);

    } catch (error) {
        console.error("Error updating task description:", error);
    }finally {
        fetchTasks();
    }
};

const updateTaskDueDate = async (taskId, dueDate) => {
    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify({ due_date: dueDate })
        });

        if (!response.ok) throw new Error("Failed to update task due date");

        const formattedDate = dueDate ? new Date(dueDate).toLocaleDateString("cs-CZ") : "No due date";
        $(`#taskList li[data-id="${taskId}"] .due-date`).text(formattedDate);

    } catch (error) {
        console.error("Error updating task due date:", error);
    } finally {
        fetchTasks();
    }
};

const updateTaskPriority = async (taskId, selectedPriority) => {
    const priorityMap = { 1: 4, 2: 3, 3: 2, 4: 1 };
    const priority = priorityMap[selectedPriority];

    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify({ priority })
        });

        if (!response.ok) throw new Error("Failed to update task priority");

        $(`#taskList li[data-id="${taskId}"] .priority-icon`).replaceWith(getPriorityIcon(priority));

    } catch (error) {
        console.error("Error updating task priority:", error);
    } finally {
        fetchTasks();
    }
};

const getPriorityIcon = (priority) => {
    const priorityMap = { 4: 1, 3: 2, 2: 3, 1: 4 };
    const appPriority = priorityMap[priority] || 4;

    switch (appPriority) {
        case 1:
            return '<span class="priority-icon high-priority">High</span>';
        case 2:
            return '<span class="priority-icon medium-priority">Medium</span>';
        case 3:
            return '<span class="priority-icon low-priority">Low</span>';
        default:
            return '<span class="priority-icon no-priority">No priority</span>';
    }
}

const deleteTask = async (taskId) => {
    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
        });

        if (!response.ok) throw new Error("Failed to delete task");

        $(`#taskList li[data-id="${taskId}"]`).remove();

    } catch (error) {
        console.error("Error deleting task:", error);
    } 
    finally {
        fetchTasks();
    }
};

const spinnerCSS = `
    .loader-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        z-index: 1050;
}`;
    $("head").append(`<style id="spinner-style">${spinnerCSS}</style>`);
