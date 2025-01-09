import { auth, db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc, // Import this
  updateDoc, // Import this
  deleteDoc, // Import this
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Global variables
let selectedGroupId = null;
let calendar;

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      console.log("Logged out successfully!");
      window.location.href = "login.html";
    })
    .catch((error) => console.error("Logout error:", error.message));
});

// Fetch Groups
async function fetchGroups() {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = ""; // Clear existing list

  try {
    const groups = await getDocs(collection(db, "groups"));
    if (groups.empty) {
      groupList.textContent = "No groups available.";
      return;
    }

    groups.forEach((doc) => {
      const group = doc.data();
      const li = document.createElement("li");
      li.className = "group-item"; // Add a class for styling

      // Group Name
      const groupName = document.createElement("span");
      groupName.textContent = group.name;
      groupName.className = "group-name";

      // Add click event for group selection
      li.addEventListener("click", () => {
        selectGroup(doc.id, group.name, li); // Function to handle group selection
      });

      // Create Edit Button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-group-btn";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering group selection
        showEditGroupModal(doc.id, group.name);
      });

      // Create Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-group-btn";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Prevent triggering group selection
        showDeleteGroupModal(doc.id);
      });

      // Append elements
      li.appendChild(groupName);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      groupList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    alert("Failed to fetch groups.");
  }
}

// Handle Group Selection
function selectGroup(groupId, groupName, listItem) {
  // Deselect all other groups
  const groupItems = document.querySelectorAll(".group-item");
  groupItems.forEach((item) => item.classList.remove("selected"));

  // Select the clicked group
  listItem.classList.add("selected");

  // Set the selected group
  selectedGroupId = groupId;
  document.getElementById("groupTitle").innerText = groupName;

  // Load the group-specific events
  loadGroup(groupId, groupName);
}



// Helper Function to Create Buttons
function createButton(text, className, onClickHandler) {
  const button = document.createElement("button");
  button.textContent = text;
  button.className = className;
  button.addEventListener("click", onClickHandler);
  return button;
}

// Edit Group
function showEditGroupModal(groupId, currentName) {
  const modal = document.getElementById("editGroupModal");
  const input = document.getElementById("editGroupNameInput");
  const saveButton = document.getElementById("saveGroupNameBtn");

  input.value = currentName;
  modal.classList.add("active");

  saveButton.onclick = async () => {
    const newName = input.value.trim();
    if (!newName) {
      alert("Group name cannot be empty.");
      return;
    }
    if (newName === currentName) {
      alert("No changes detected.");
      return;
    }

    try {
      const groupDoc = doc(db, "groups", groupId);
      await updateDoc(groupDoc, { name: newName });
      console.log(`Group "${currentName}" renamed to "${newName}" successfully!`);
      fetchGroups();
      modal.classList.remove("active");
    } catch (error) {
      console.error("Error updating group:", error.message);
      alert("Failed to update group.");
    }
  };
}


// Delete Group
function showDeleteGroupModal(groupId) {
  const modal = document.getElementById("deleteGroupModal");
  const deleteButton = document.getElementById("confirmDeleteGroupBtn");

  modal.classList.add("active"); // Show modal

  // Confirm delete button handler
  deleteButton.onclick = async () => {
    try {
      const groupDoc = doc(db, "groups", groupId);
      await deleteDoc(groupDoc);
      console.log(`Group "${groupId}" deleted successfully!`);
      fetchGroups(); // Refresh the group list
      modal.classList.remove("active"); // Close modal
    } catch (error) {
      console.error("Error deleting group:", error.message);
      alert("Failed to delete group.");
    }
  };
}




// Initialize Calendar with Navigation Support
function initializeCalendar() {
  calendar = new DayPilot.Calendar("calendarContainer");
  calendar.viewType = "Week";

  // Initialize the calendar start date
  let currentDate = new DayPilot.Date(); // Today by default

  // Handle navigation
  document.getElementById("prevWeekBtn").addEventListener("click", () => {
    currentDate = currentDate.addDays(-7); // Go to the previous week
    calendar.startDate = currentDate;
    calendar.update();
  });

  document.getElementById("currentWeekBtn").addEventListener("click", () => {
    currentDate = new DayPilot.Date(); // Reset to today
    calendar.startDate = currentDate;
    calendar.update();
  });

  document.getElementById("nextWeekBtn").addEventListener("click", () => {
    currentDate = currentDate.addDays(7); // Go to the next week
    calendar.startDate = currentDate;
    calendar.update();
  });

  // Handle time range selection
  calendar.onTimeRangeSelected = (args) => {
    const startInput = document.getElementById("startTime");
    const durationInput = document.getElementById("duration");

    // Convert start and end times to the local timezone
    const localStart = new Date(args.start.value); // args.start.value is the raw ISO string
    const localEnd = new Date(args.end.value); // args.end.value is the raw ISO string

    // Format start time for the input field
    startInput.value = formatDateTime(localStart);

    // Calculate duration in hours
    const durationHours = (localEnd - localStart) / (1000 * 60 * 60);
    durationInput.value = durationHours;

    // Open the modal for adding an event
    document.querySelector(".modal").classList.add("active");
  };

  calendar.init();
}


// Format date-time to "YYYY-MM-DDTHH:MM"
function formatDateTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date); // Ensure input is a Date object
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${year}-${month}-${day}T${hours}:${minutes}`; // Format to "YYYY-MM-DDTHH:MM"
}



// Load Group Events into Calendar
async function loadGroup(groupId, groupName) {
  selectedGroupId = groupId;
  document.getElementById("groupTitle").innerText = groupName;

  if (!calendar) {
    initializeCalendar();
  }

  console.log(`Loading events for groupId: ${groupId}`);
  
  try {
    const eventsQuery = query(collection(db, "events"), where("groupId", "==", groupId));
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = [];
    console.log("Events snapshot size:", eventsSnapshot.size);

    eventsSnapshot.forEach((doc) => {
      const event = doc.data();
      console.log("Fetched event:", event);

      // Normalize dates to valid ISO format
      const normalizedStart = normalizeDate(event.start);
      const normalizedEnd = normalizeDate(event.end);

      if (!normalizedStart || !normalizedEnd) {
        console.error("Invalid date format for event:", event);
        return; // Skip the event if normalization fails
      }

      events.push({
        id: doc.id,
        text: event.title || "Untitled Event",
        start: normalizedStart,
        end: normalizedEnd,
      });
    });

    console.log("Loaded events:", events);

    calendar.events.list = events; // Update the calendar
    calendar.update(); // Refresh the calendar view
  } catch (error) {
    console.error("Error loading events:", error.message || error);
  }
}


// Helper function to normalize date formats
function normalizeDate(date) {
  try {
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) {
      throw new Error("Invalid date format");
    }
    // Return fully qualified ISO format without milliseconds
    return parsedDate.toISOString().slice(0, 19);
  } catch (error) {
    console.error("Error normalizing date:", error.message, date);
    return null; // Return null if the date is invalid
  }
}



// Open and Close Add Group Modal
const addGroupModal = document.getElementById("addGroupModal");
const closeGroupModal = document.getElementById("closeGroupModal");
const addGroupBtn = document.getElementById("addGroupBtn");
const addGroupForm = document.getElementById("addGroupForm");

addGroupBtn.addEventListener("click", () => {
  addGroupModal.classList.add("active"); // Show modal
});

closeGroupModal.addEventListener("click", () => {
  addGroupModal.classList.remove("active"); // Hide modal
});

window.addEventListener("click", (e) => {
  if (e.target === addGroupModal) {
    addGroupModal.classList.remove("active"); // Hide modal when clicking outside
  }
});

// Add Group Logic
addGroupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const groupName = document.getElementById("groupName").value.trim();

  if (groupName) {
    try {
      await addDoc(collection(db, "groups"), {
        name: groupName,
        createdAt: new Date(),
      });
      console.log(`Group "${groupName}" added successfully!`);
      fetchGroups(); // Refresh the group list
      addGroupModal.classList.remove("active"); // Hide modal
      addGroupForm.reset(); // Clear the form
    } catch (error) {
      console.error("Error adding group:", error.message);
    }
  }
});


// Modal Functionality
const eventModal = document.querySelector(".modal");
const closeModal = document.querySelector(".close");

// Show modal
document.getElementById("addEventBtn").addEventListener("click", () => {
  eventModal.classList.add("active");
});

// Close modal
closeModal.addEventListener("click", () => {
  eventModal.classList.remove("active");
});

window.addEventListener("click", (e) => {
  if (e.target === eventModal) {
    eventModal.classList.remove("active");
  }
});

// Add Event via Form
document.getElementById("eventForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const title = document.getElementById("eventTitle").value;
  const start = document.getElementById("startTime").value;
  const duration = parseFloat(document.getElementById("duration").value);

  if (!selectedGroupId) {
    console.error("Group not selected.");
    return;
  }

  if (!title || !start || isNaN(duration)) {
    console.error("Invalid input. Title, start time, and duration are required.");
    return;
  }

  // Calculate the end time
  const end = new Date(start);
  end.setHours(end.getHours() + duration);

  try {
    await addDoc(collection(db, "events"), {
      groupId: selectedGroupId,
      title: title,
      start: formatDateTime(start),
      end: formatDateTime(end),
      createdAt: formatDateTime(new Date()),
    });

    console.log("Event added successfully!");
    loadGroup(selectedGroupId, document.getElementById("groupTitle").innerText);
    eventModal.classList.remove("active");
  } catch (error) {
    console.error("Error adding event:", error.message);
  }
});

// Helper Function to Validate Date-Time
function isValidDateTime(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
}

// Render Event List with Edit Option
function renderEventList(events) {
  const eventList = document.getElementById("upcomingEvents");
  eventList.innerHTML = ""; // Clear existing list

  events.forEach((event) => {
    const li = document.createElement("li");
    li.textContent = event.text;

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.className = "edit-event-btn";
    editBtn.addEventListener("click", () => openEditEventModal(event));

    li.appendChild(editBtn);
    eventList.appendChild(li);
  });
}



// Initialize Groups on Page Load
fetchGroups();
