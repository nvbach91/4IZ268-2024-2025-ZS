let selectedTaskId = null;
let currentSort = "manual";

$(document).ready(() => {
    fetchTasks();

    $("#addTaskBtn").on("click", addTask);
    $("#taskFilter").on("change", function () {
        const filterValue = $(this).val();
        if (filterValue === "all") {
            fetchTasks();
        } else {
            fetchFilteredTasks(filterValue);
        }
    });

    $(document).ready(() => {
        $("body").append(`
            <div id="loader" class="loader-container">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `);
        hideLoader();
    });

    $(".sort-option").on("click", function () {
        currentSort = $(this).data("sort");
        fetchTasks();
    });

    $("#saveTaskEdit").on("click", function () {
        updateTask(selectedTaskId, $("#editTaskInput").val());
        $("#editTaskModal").modal("hide");
    });

    $("#saveDescriptionEdit").on("click", function () {
        updateTaskDescription(selectedTaskId, $("#editDescriptionInput").val());
        $("#editDescriptionModal").modal("hide");
    });

    $("#saveDueDate").on("click", function () {
        updateTaskDueDate(selectedTaskId, $("#editDueDateInput").val());
        $("#editDueDateModal").modal("hide");
    });

    $("#savePriority").on("click", function () {
        updateTaskPriority(selectedTaskId, $("#prioritySelect").val());
        $("#editPriorityModal").modal("hide");
    });

    $(document).on("click", ".edit-task", function () {
        selectedTaskId = $(this).data("id");
        $("#editTaskInput").val($(this).closest("li").find("strong").text());
        $("#editTaskModal").modal("show");
    });

    $(document).on("click", ".edit-description", function () {
        selectedTaskId = $(this).data("id");
        $("#editDescriptionInput").val($(this).closest("li").find(".task-description").text());

        const descriptionModalEl = document.getElementById("editDescriptionModal");
        if (descriptionModalEl) {
            const descriptionModal = new bootstrap.Modal(descriptionModalEl);
            descriptionModal.show();
        }
    });

    $(document).on("click", ".edit-due-date", function () {
        selectedTaskId = $(this).data("id");
        $("#editDueDateInput").val($(this).closest("li").find(".due-date").text());
        $("#editDueDateModal").modal("show");
    });

    $(document).on("click", ".delete-task", function () {
        selectedTaskId = $(this).data("id");
        $("#deleteConfirmModal").modal("show");
    });

    $(document).on("click", ".edit-priority", function () {
        selectedTaskId = $(this).data("id");
        $("#editPriorityModal").modal("show");
    });

    $(document).on("click", "#confirmDelete", function () {
        deleteTask(selectedTaskId);
        $("#deleteConfirmModal").modal("hide");
    });

    $(document).on("click", ".complete-task", function () {
        selectedTaskId = $(this).data("id");
        completeTask(selectedTaskId);
    });
});

$("#taskFilter").on("change", function () {
    const filterValue = $(this).val();
    localStorage.setItem("taskFilter", filterValue);

    if (filterValue === "all") {
        fetchTasks();
    } else {
        fetchFilteredTasks(filterValue);
    }
});

$(".sort-option").on("click", function () {
    currentSort = $(this).data("sort");
    localStorage.setItem("currentSort", currentSort);
    fetchTasks();
});

function showLoader() {
    $("#loader").show();
}

function hideLoader() {
    $("#loader").hide();
}

const savedFilter = localStorage.getItem("taskFilter");
if (savedFilter) {
    $("#taskFilter").val(savedFilter).trigger("change");
}

const savedSort = localStorage.getItem("currentSort");
if (savedSort) {
    currentSort = savedSort;
    fetchTasks();
}

$(document).on("click", ".edit-task", function () {
    selectedTaskId = $(this).data("id");
    localStorage.setItem("selectedTaskId", selectedTaskId);
    $("#editTaskInput").val($(this).closest("li").find("strong").text());
    $("#editTaskModal").modal("show");
});

const savedTaskId = localStorage.getItem("selectedTaskId");
if (savedTaskId) {
    selectedTaskId = savedTaskId;
    
}


async function fetchTasks() {
    showLoader();
    try {
        const response = await fetch(TODOIST_API_URL, {
            method: "GET",
            headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
        });

        if (!response.ok) throw new Error("Failed to fetch tasks");

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching tasks:", error);
    } finally {
        hideLoader();
    }
}
function sortTasks(tasks) {
    switch (currentSort) {
        case "name":
            return tasks.sort((a, b) => a.content.localeCompare(b.content));
        case "date":
            return tasks.sort((a, b) => new Date(a.due?.date || 0) - new Date(b.due?.date || 0));
        case "dateAdded":
            return tasks.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        case "dueDate":
            return tasks.sort((a, b) => new Date(a.due?.date || 0) - new Date(b.due?.date || 0));
        case "priority":
            return tasks.sort((a, b) => a.priority - b.priority);
        default:
            return tasks;
    }
}

async function fetchFilteredTasks(filter) {
    showLoader();
    let apiFilter = filter === "today" ? "today" : filter === "overdue" ? "overdue" : "";

    try {
        const response = await fetch(`${TODOIST_API_URL}?filter=${encodeURIComponent(apiFilter)}`, {
            method: "GET",
            headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
        });

        if (!response.ok) throw new Error("Failed to fetch filtered tasks");

        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error("Error fetching filtered tasks:", error);
    } finally {
        hideLoader();
    }
}

function renderTasks(tasks) {
    $("#taskList").empty();

    const sortedTasks = sortTasks(tasks);

    tasks.forEach(task => {
        const dueDate = task.due && task.due.date ? new Date(task.due.date).toLocaleDateString("cs-CZ") : "No due date";        
        const priorityIcon = getPriorityIcon(task.priority);

        const taskItem = $(`
            <li class="list-group-item d-flex flex-column">
                <div class="d-flex justify-content-between align-items-center">
                    <span><strong>${task.content}</strong> ${priorityIcon}</span>
                    <div>
                        <button class="btn btn-success btn-sm complete-task" data-id="${task.id}">
                            <i class="bi bi-check2-circle"></i>
                        </button>
                        <button class="btn btn-warning btn-sm edit-task" data-id="${task.id}">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-info btn-sm edit-description" data-id="${task.id}">
                            <i class="bi bi-file-text"></i>
                        </button>
                        <button class="btn btn-primary btn-sm edit-due-date" data-id="${task.id}">
                            <i class="bi bi-calendar"></i>
                        </button>
                        <button class="btn btn-dark btn-sm edit-priority" data-id="${task.id}">
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

        $("#taskList").append(taskItem);
    });
}



async function completeTask(taskId) {
    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}/close`, {
            method: "POST",
            headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
        });

        if (!response.ok) throw new Error("Failed to complete task");

        fetchTasks();
    } catch (error) {
        console.error("Error completing task:", error);
    }
}

async function addTask() {
    const taskName = $("#taskName").val().trim();
    const dueDate = $("#dueDate").val();
    const selectedPriority = parseInt($("#prioritySelect").val()) || 4;

    const priorityMap = { 1: 4, 2: 3, 3: 2, 4: 1 };
    const priority = priorityMap[selectedPriority];

    if (!taskName) {
        const toast = new bootstrap.Toast(document.getElementById("taskToast"));
        toast.show();
        return;
    }

    const taskData = {
        content: taskName,
        project_id: TODOIST_PROJECT_ID,
        priority: priority
    };

    if (dueDate) {
        taskData.due_date = dueDate;
    }

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

        $("#taskName").val("");
        $("#dueDate").val("");
        fetchTasks();
    } catch (error) {
        console.error("Error adding task:", error);
    }
}

async function updateTask(taskId, updatedContent) {
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

        fetchTasks();
    } catch (error) {
        console.error("Error updating task:", error);
    }
}

async function updateTaskDescription(taskId, description) {
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

        fetchTasks();
    } catch (error) {
        console.error("Error updating task description:", error);
    }
}

async function updateTaskDueDate(taskId, dueDate) {
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

        fetchTasks();
    } catch (error) {
        console.error("Error updating task due date:", error);
    }
}

async function updateTaskPriority(taskId, selectedPriority) {
    const priorityMap = { 1: 4, 2: 3, 3: 2, 4: 1 };
    const priority = priorityMap[selectedPriority];

    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${TODOIST_API_KEY}`
            },
            body: JSON.stringify({ priority: priority })
        });

        if (!response.ok) throw new Error("Failed to update task priority");

        fetchTasks();
    } catch (error) {
        console.error("Error updating task priority:", error);
    }
}

function getPriorityIcon(priority) {
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


async function deleteTask(taskId) {
    try {
        const response = await fetch(`${TODOIST_API_URL}/${taskId}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${TODOIST_API_KEY}` }
        });

        if (!response.ok) throw new Error("Failed to delete task");

        fetchTasks();
    } catch (error) {
        console.error("Error deleting task:", error);
    }
}

const loaderCSS = `
    .loader-container {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        display: none;
        z-index: 1050;
    }
`;

$("head").append(`<style>${loaderCSS}</style>`);