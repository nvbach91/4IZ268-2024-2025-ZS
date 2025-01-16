// Google API Configuration
const CLIENT_ID = "31392427339-gqekuarpqa8ah4n3nb4nka6v9gqgbk4d.apps.googleusercontent.com";
const API_KEY = "AIzaSyBLh651BCPXAdrFPs8n4zE8iZV9f2JhbG4";
const DISCOVERY_DOC = "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest";
const SCOPES = "https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/userinfo.email";

// Token management constants
const TOKEN_STORAGE_KEY = "authToken";
const TOKEN_EXPIRY_KEY = "tokenExpiry";
const REFRESH_THRESHOLD = 5 * 60 * 1000; // 5 minutes in milliseconds
const SESSION_TIMEOUT = 30 * 60 * 1000; // 30 minutes in milliseconds

let tokenClient;
let gapiInited = false;
let gisInited = false;
let sessionTimeoutId = null;

// Store DOM elements in variables
const authorizeButton = document.getElementById("authorize_button");
const signoutButton = document.getElementById("signout_button");
const appContainer = document.getElementById("app-container");
const authContainer = document.getElementById("auth-container");
const sortPriorityBtn = document.getElementById("sort-priority-btn");
const calendarIcon = document.getElementById("calendar-icon");
const timeIcon = document.getElementById("time-icon");
const taskInput = document.getElementById("new-task");
const taskDateInput = document.getElementById("task-date");
const taskTimeInput = document.getElementById("task-time");
const taskFilter = document.getElementById("task-filter");
const dateFilter = document.getElementById("date-filter");
const taskForm = document.getElementById("task-form");
const taskList = document.getElementById("task-list");
const notificationContainer = document.getElementById("notification-container");
const emailElement = document.getElementById("user-email");

// Token Management Functions
const storeToken = (token, expiresIn) => {
  const expiryTime = Date.now() + expiresIn * 1000;
  localStorage.setItem(TOKEN_STORAGE_KEY, token);
  localStorage.setItem(TOKEN_EXPIRY_KEY, expiryTime.toString());
  resetSessionTimeout();
}

const isTokenExpiredOrExpiring = () => {
  const expiryTime = parseInt(localStorage.getItem(TOKEN_EXPIRY_KEY));
  if (!expiryTime) return true;

  const timeUntilExpiry = expiryTime - Date.now();
  return timeUntilExpiry < REFRESH_THRESHOLD;
}

const clearTokenData = () => {
  localStorage.removeItem(TOKEN_STORAGE_KEY);
  localStorage.removeItem(TOKEN_EXPIRY_KEY);
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
    sessionTimeoutId = null;
  }
}

const resetSessionTimeout = () => {
  if (sessionTimeoutId) {
    clearTimeout(sessionTimeoutId);
  }

  sessionTimeoutId = setTimeout(() => {
    handleSignoutClick();
    showNotification(
      "Session expired due to inactivity. Please sign in again.",
      "info",
    );
  }, SESSION_TIMEOUT);
}

// Priority Calculation Function
const calculatePriority = (eventStartDate) => {
  const now = new Date();
  const timeDifference = eventStartDate.getTime() - now.getTime();
  const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

  if (hoursDifference <= 48) {
    // Less than 48 hours
    return 3;
  } else if (hoursDifference <= 336) {
    // Less than 168 hours (1 week)
    return 2;
  } else {
    return 1;
  }
}

const createTaskElement = (
  taskText,
  eventId,
  deadline,
  eventDate,
  note = "",
  priority = 3
) => {
  const li = document.createElement("li");
  li.setAttribute("data-event-id", eventId);
  li.setAttribute("data-deadline", deadline.toISOString());
  li.setAttribute("data-date", eventDate);
  li.setAttribute("data-note", note);
  li.setAttribute("data-priority", priority);

  const completionCircle = document.createElement("span");
  completionCircle.classList.add("completion-circle");
  completionCircle.addEventListener("click", () => {
    completionCircle.classList.toggle("completed");
    li.classList.toggle("completed");
  });

  const taskTextSpan = document.createElement("span");
  taskTextSpan.classList.add("task-text");

  const formattedDeadline = `${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`;
  if (!taskText.includes(formattedDeadline)) {
    taskText += ` (${formattedDeadline})`;
  }

  taskTextSpan.textContent = taskText;

  const priorityDisplay = document.createElement("span");
  priorityDisplay.classList.add("priority-display");
  priorityDisplay.textContent = `Priority: ${priority}`;

  const infoIcon = document.createElement("button");
  infoIcon.classList.add("info-icon");
  infoIcon.innerHTML = "ℹ️";
  infoIcon.title = "Show Note";

  const noteContainer = document.createElement("div");
  noteContainer.classList.add("note-container");

  const noteInput = document.createElement("input");
  noteInput.type = "text";
  noteInput.classList.add("note-input");
  noteInput.value = note || "";
  noteInput.placeholder = "Add your note here";
  noteInput.maxLength = 80;

  const saveButton = document.createElement("button");
  saveButton.textContent = "Save";
  saveButton.classList.add("save-note-btn");
  saveButton.style.display = "none";

  noteContainer.appendChild(noteInput);
  noteContainer.appendChild(saveButton);

  infoIcon.addEventListener("click", () => {
    noteContainer.classList.toggle("visible");
  });

  if (note) {
    noteContainer.classList.add("visible");
  }

  noteInput.addEventListener("input", () => {
    saveButton.style.display = "inline-block";
  });

  saveButton.addEventListener("click", async () => {
    const newNote = noteInput.value.trim();
    const eventId = li.getAttribute("data-event-id");
    const success = await updateEventNote(eventId, newNote);

    if (success) {
      note = newNote;
      li.setAttribute("data-note", note);
      saveButton.style.display = "none";
      showNotification("Note updated successfully!", "success");
    } else {
      showNotification("Failed to update note in Google Calendar.", "error");
    }
  });

  const deleteBtn = document.createElement("button");
  deleteBtn.classList.add("delete-btn");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    const eventId = li.getAttribute("data-event-id");
    deleteTaskFromCalendar(eventId, li);
  });

  li.appendChild(completionCircle);
  li.appendChild(taskTextSpan);
  li.appendChild(priorityDisplay);
  li.appendChild(deleteBtn);

  const wrapperDiv = document.createElement("div");
  wrapperDiv.style.width = "100%";
  wrapperDiv.appendChild(infoIcon);
  wrapperDiv.appendChild(noteContainer);
  li.appendChild(wrapperDiv);

  return li;
}

const addTaskToDOM = (
  taskText,
  eventId,
  deadline,
  eventDate,
  note = "",
  priority = 3,
) => {
  if (!taskList) return;

  const li = createTaskElement(taskText, eventId, deadline, eventDate, note, priority);
  taskList.appendChild(li);
}

// GAPI Initialization Functions
const gapiLoaded = () => {
  gapi.load("client", async () => {
    try {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
        scope: SCOPES,
      });
      gapiInited = true;
      maybeEnableButtons();
    } catch (error) {
      console.error("Error initializing GAPI client:", error);
      showNotification("Failed to initialize Google API client.", "error");
    }
  });
}

const gisLoaded = () => {
  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: async (resp) => {
      if (resp.error !== undefined) {
        throw resp;
      }

      // Store token with expiration
      const token = resp.access_token;
      const expiresIn = resp.expires_in || 3600;
      storeToken(token, expiresIn);

      if (signoutButton) signoutButton.style.visibility = "visible";
      if (authorizeButton) authorizeButton.innerText = "Refresh";
      if (authContainer) authContainer.style.display = "none";
      if (appContainer) appContainer.style.display = "block";

      // Set the token before making API calls
      gapi.client.setToken({ access_token: token });

      // Now make API calls
      await displayUserEmail();
      if (gapi.client.calendar) {
        await loadEventsFromCalendar();
      }
    },
  });
  gisInited = true;
  maybeEnableButtons();
}

const maybeEnableButtons = () => {
    if (gapiInited && gisInited) {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
  
      if (token && !isTokenExpiredOrExpiring()) {
        gapi.client.setToken({ access_token: token });
        if (authorizeButton) authorizeButton.style.visibility = "hidden";
        if (signoutButton) signoutButton.style.visibility = "visible";
        if (authContainer) authContainer.style.display = "none";
        if (appContainer) appContainer.style.display = "block";
        displayUserEmail();
        if (gapi.client.calendar) {
          loadEventsFromCalendar();
        }
        resetSessionTimeout();
      } else if (token && isTokenExpiredOrExpiring()) {
        handleSignoutClick();
        showNotification("Session expired. Please sign in again.", "info");
      } else {
        if (authorizeButton) authorizeButton.style.visibility = "visible";
        if (signoutButton) signoutButton.style.visibility = "hidden";
        if (authContainer) authContainer.style.display = "block";
        if (appContainer) appContainer.style.display = "none";
      }
    }
  }
  
  // Auth Button Handlers
  const handleAuthClick = () => {
    tokenClient.requestAccessToken({ prompt: "" });
  }
  
  const handleSignoutClick = () => {
    const token = gapi.client.getToken();
    if (token !== null) {
      google.accounts.oauth2.revoke(token.access_token, () => {
        gapi.client.setToken("");
        clearTokenData();
  
        if (authorizeButton) {
          authorizeButton.style.visibility = "visible";
          authorizeButton.innerText = "Authorize";
          authorizeButton.addEventListener("click", handleAuthClick);
        }
        if (signoutButton) signoutButton.style.visibility = "hidden";
        if (authContainer) authContainer.style.display = "block";
        if (appContainer) appContainer.style.display = "none";
      });
    }
  }
  
  // User Info Functions
  const displayUserEmail = async () => {
    try {
      if (!gapi.client) {
        console.log("GAPI client not initialized");
        return;
      }
  
      const token = gapi.client.getToken();
      if (!token) {
        console.log("No valid token available");
        return;
      }
  
      const response = await fetch(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${token.access_token}`,
          },
        },
      );
  
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
  
      const data = await response.json();
      if (emailElement && data.email) {
        emailElement.textContent = `Signed in as: ${data.email}`;
      }
    } catch (error) {
      console.error("Error fetching user email:", error);
      if (emailElement) {
        emailElement.textContent = "";
      }
    }
  }
  
  // Notification System
  const showNotification = (message, type = "info") => {
    if (!notificationContainer) return;
  
    const notification = document.createElement("div");
    notification.classList.add("notification");
    if (type === "success") {
      notification.style.backgroundColor = "#28a745";
    } else if (type === "error") {
      notification.style.backgroundColor = "#dc3545";
    }
  
    notification.textContent = message;
    notificationContainer.appendChild(notification);
  
    setTimeout(() => {
      notificationContainer.removeChild(notification);
    }, 5000);
  }
  
  // Calendar Event Management Functions
  const updateEventNote = async (eventId, newNote) => {
    if (!eventId) {
      console.error("No event ID provided for note update");
      return false;
    }
  
    try {
      const response = await gapi.client.calendar.events.get({
        calendarId: "primary",
        eventId: eventId,
      });
  
      const currentEvent = response.result;
  
      const updatedEvent = {
        ...currentEvent,
        description: newNote,
      };
  
      const updateResponse = await gapi.client.calendar.events.update({
        calendarId: "primary",
        eventId: eventId,
        resource: updatedEvent,
      });
  
      if (updateResponse.status !== 200) {
        throw new Error("Failed to update event");
      }
  
      return true;
    } catch (error) {
      console.error("Error updating event note:", error);
      showNotification(
        "Failed to update note in Google Calendar: " + error.message,
        "error",
      );
      return false;
    }
  }
  
  const displayEvents = (events) => {
    if (!events || events.length === 0) return;
  
    const fragment = document.createDocumentFragment();
  
    events.forEach((event) => {
      const start = event.start.dateTime || event.start.date;
      const deadline = new Date(start);
      const eventDate = deadline.toISOString().split("T")[0];
      const calculatedPriority = calculatePriority(deadline);
      const note = event.description || "";
      const li = createTaskElement(
        event.summary,
        event.id,
        deadline,
        eventDate,
        note,
        calculatedPriority
      );
      fragment.appendChild(li);
    });
  
    taskList.appendChild(fragment);
  }
  
  
const loadEventsFromCalendar = async () => {
    if (!gapi.client.calendar) {
      console.error("Google Calendar API client not initialized.");
      return;
    }
  
    try {
      if (!dateFilter) return;
  
      let selectedDate = dateFilter.value;
  
      if (taskList) {
        taskList.innerHTML = "";
      }
  
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: selectedDate + "T00:00:00Z",
        timeMax: selectedDate + "T23:59:59Z",
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      });
  
      const events = response.result.items;
      if (events && events.length > 0) {
        displayEvents(events);
      } else {
        showNotification("No events found for the selected date.", "info");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showNotification("Failed to load events from Google Calendar.", "error");
    }
  }
  
  const loadAllEvents = async () => {
    if (!gapi.client.calendar) {
      console.error("Google Calendar API client not initialized.");
      return;
    }
  
    try {
      // Clear existing tasks before loading new ones
      if (taskList) {
        taskList.innerHTML = "";
      }
  
      const startDate = new Date();
      startDate.setMonth(startDate.getMonth()); 
      const endDate = new Date();
      endDate.setMonth(endDate.getMonth() + 12); 
  
      const response = await gapi.client.calendar.events.list({
        calendarId: "primary",
        timeMin: startDate.toISOString(),
        timeMax: endDate.toISOString(),
        showDeleted: false,
        singleEvents: true,
        maxResults: 100,
        orderBy: "startTime",
      });
  
      const events = response.result.items;
      if (events && events.length > 0) {
        displayEvents(events);
        showNotification("Showing all events", "info");
      } else {
        showNotification("No events found.", "info");
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      showNotification("Failed to load events from Google Calendar.", "error");
    }
  }
  
  const addTask = async (taskText, deadline, note) => {
    const calculatedPriority = calculatePriority(deadline);
    const event = {
      summary: taskText,
      description: note,
      start: {
        dateTime: deadline.toISOString(),
        timeZone: "UTC",
      },
      end: {
        dateTime: deadline.toISOString(),
        timeZone: "UTC",
      },
    };
  
    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: "primary",
        resource: event,
      });
  
      // Clear existing tasks and reload events for the selected date
      if (dateFilter) {
        loadEventsFromCalendar();
      }
  
      showNotification("Event successfully added to Google Calendar!", "success");
    } catch (error) {
      console.error("Error creating event:", error);
      showNotification("Failed to add event to Google Calendar.", "error");
    }
  }
  
  const deleteTaskFromCalendar = async (eventId, taskElement) => {
    if (!eventId) {
      taskElement.remove();
      showNotification("Task successfully deleted!", "success");
      return;
    }
  
    try {
      await gapi.client.calendar.events.delete({
        calendarId: "primary",
        eventId: eventId,
      });
  
      taskElement.remove();
      showNotification(
        "Task successfully deleted from Google Calendar!",
        "success",
      );
  
      // Reload events based on the current date filter
      if (dateFilter && dateFilter.value) {
        loadEventsFromCalendar();
      } else {
        loadAllEvents();
      }
    } catch (error) {
      console.error("Error deleting event from Google Calendar:", error);
      showNotification("Failed to delete task from Google Calendar.", "error");
    }
  }

// Task Management Functions
const filterTasks = (filterOption) => {
    const tasks = document.querySelectorAll("#task-list li");
    tasks.forEach((task) => {
      const isCompleted = task.classList.contains("completed");
      task.style.display = "";
  
      if (filterOption === "completed" && !isCompleted) {
        task.style.display = "none";
      } else if (filterOption === "incomplete" && isCompleted) {
        task.style.display = "none";
      }
    });
  }
  
  const filterTasksByDate = (date) => {
    if (!taskList) return;
  
    const tasks = document.querySelectorAll("#task-list li");
    tasks.forEach((task) => {
      const taskDate = task.getAttribute("data-date");
      task.style.display = taskDate === date ? "" : "none";
    });
  }
  
  let sortAscending = true;
  
  const sortTasksByPriority = () => {
    if (!taskList) return;
  
    const tasks = Array.from(taskList.children);
    tasks.sort((a, b) => {
      const priorityA = parseInt(a.getAttribute("data-priority")) || 3;
      const priorityB = parseInt(b.getAttribute("data-priority")) || 3;
      return sortAscending ? priorityA - priorityB : priorityB - priorityA;
    });
  
    taskList.innerHTML = "";
    tasks.forEach((task) => taskList.appendChild(task));
  
    sortAscending = !sortAscending;
  
    const sortButtonIcon = document.querySelector("#sort-priority-btn i");
    if (sortButtonIcon) {
      if (sortAscending) {
        sortButtonIcon.classList.remove("fa-sort-amount-up");
        sortButtonIcon.classList.add("fa-sort-amount-down");
      } else {
        sortButtonIcon.classList.remove("fa-sort-amount-down");
        sortButtonIcon.classList.add("fa-sort-amount-up");
      }
    }
  }
  
  // Initialize app
  document.addEventListener("DOMContentLoaded", () => {
    // Initialize button visibility
    if (authorizeButton) {
      authorizeButton.addEventListener("click", handleAuthClick);
    }
    if (signoutButton) {
      signoutButton.addEventListener("click", handleSignoutClick);
    }
  
    // Set initial visibility
    if (authorizeButton) authorizeButton.style.visibility = "visible";
    if (signoutButton) signoutButton.style.visibility = "hidden";
    if (appContainer) appContainer.style.display = "none";
    if (authContainer) authContainer.style.display = "block";
  
    // Set default values for date and time
    const today = new Date().toISOString().split("T")[0];
    if (taskDateInput) taskDateInput.value = today;
    if (taskTimeInput) taskTimeInput.value = "12:00";
    if (dateFilter) dateFilter.value = today;
  
    // Initialize event listeners
    if (sortPriorityBtn) {
      sortPriorityBtn.addEventListener("click", sortTasksByPriority);
      sortPriorityBtn.title = "Sort tasks by priority";
    }
  
    if (calendarIcon) {
      calendarIcon.addEventListener("click", () => {
        taskDateInput.focus();
      });
      calendarIcon.title = "Set task date";
    }
  
    if (timeIcon) {
      timeIcon.addEventListener("click", () => {
        taskTimeInput.focus();
      });
      timeIcon.title = "Set task time";
    }
  
    if (taskForm) {
      taskForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const taskText = taskInput.value.trim();
        const taskDate = taskDateInput.value;
        const taskTime = taskTimeInput.value || "12:00";
  
        if (taskText === "") {
          showNotification("Task cannot be empty!", "error");
          return;
        }
  
        if (!taskDate) {
          showNotification("Please provide a date!", "error");
          return;
        }
  
        const deadline = new Date(`${taskDate}T${taskTime}:00`);
        addTask(taskText, deadline, "");
  
        taskInput.value = "";
        taskDateInput.value = today;
        taskTimeInput.value = "12:00";
      });
    }
  
    if (taskFilter) {
      taskFilter.addEventListener("change", (event) => {
        const filterOption = event.target.value;
        filterTasks(filterOption);
      });
    }
  
    if (dateFilter) {
      dateFilter.addEventListener("change", (event) => {
        const selectedDate = event.target.value;
        if (!selectedDate) {
          loadAllEvents();
        } else {
          filterTasksByDate(selectedDate);
          loadEventsFromCalendar();
        }
      });
    }
  
    // Add event listeners for activity tracking
    document.addEventListener("mousemove", resetSessionTimeout);
    document.addEventListener("keypress", resetSessionTimeout);
    document.addEventListener("click", resetSessionTimeout);
  
    // Check token status periodically
    setInterval(() => {
      const token = localStorage.getItem(TOKEN_STORAGE_KEY);
      if (token && isTokenExpiredOrExpiring()) {
        handleSignoutClick();
        showNotification("Session expired. Please sign in again.", "info");
      }
    }, REFRESH_THRESHOLD);
  
    // Initialize calendar events if authenticated
    if (gapiInited && gisInited) {
      loadEventsFromCalendar();
    }
  });