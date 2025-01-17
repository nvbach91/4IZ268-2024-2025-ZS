// dashboard.js

import { auth, db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

import { signOut, updateProfile } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// If you have a switchView function in spa.js, you can import it:
// import { switchView } from "./spa.js";

let selectedGroupId = null; // Track which group is selected
let calendar = null;        // DayPilot calendar instance

/* ============================
    LOGOUT FUNCTIONALITY
============================ */
document.getElementById("logoutBtn").addEventListener("click", async () => {
  try {
    await signOut(auth);
    console.log("Logged out successfully!");
    // If you want to show the login view or home view, do it here:
    // switchView("loginView");
  } catch (error) {
    console.error("Logout error:", error.message);
  }
});

/* ============================
         FETCH GROUPS
============================ */
export async function fetchGroups() {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = ""; // Clear existing list

  try {
    const groupsSnapshot = await getDocs(collection(db, "groups"));
    if (groupsSnapshot.empty) {
      groupList.textContent = "No groups available.";
      return;
    }

    groupsSnapshot.forEach((docSnap) => {
      const groupData = docSnap.data();
      const li = document.createElement("li");
      li.className = "group-item";

      // Group Name
      const groupNameSpan = document.createElement("span");
      groupNameSpan.textContent = groupData.name;
      groupNameSpan.className = "group-name";

      // Clicking the <li> selects that group
      li.addEventListener("click", () => {
        selectGroup(docSnap.id, groupData.name, li);
      });

      // Edit Button
      const editBtn = document.createElement("button");
      editBtn.textContent = "Edit";
      editBtn.className = "edit-group-btn";
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation(); // Don’t select group
        showEditGroupModal(docSnap.id, groupData.name);
      });

      // Delete Button
      const deleteBtn = document.createElement("button");
      deleteBtn.textContent = "Delete";
      deleteBtn.className = "delete-group-btn";
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        showDeleteGroupModal(docSnap.id);
      });

      li.appendChild(groupNameSpan);
      li.appendChild(editBtn);
      li.appendChild(deleteBtn);
      groupList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching groups:", error.message);
    alert("Failed to fetch groups.");
  }
}

/* ============================
     SELECT / LOAD GROUP
============================ */
function selectGroup(groupId, groupName, listItem) {
  // Deselect all
  const groupItems = document.querySelectorAll(".group-item");
  groupItems.forEach((item) => item.classList.remove("selected"));

  // Select the clicked one
  listItem.classList.add("selected");

  // Store selected group
  selectedGroupId = groupId;
  document.getElementById("groupTitle").innerText = groupName;

  // Load group events
  loadGroupEvents(groupId, groupName);
}

/* ============================
   SHOW EDIT GROUP MODAL
============================ */
function showEditGroupModal(groupId, currentName) {
  const modal = document.getElementById("editGroupModal");
  const input = document.getElementById("editGroupNameInput");
  const saveButton = document.getElementById("saveGroupNameBtn");
  const spinner = document.getElementById("editGroupSpinner");

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
      spinner?.classList.remove("hidden"); // show spinner
      saveButton.disabled = true;

      await updateDoc(doc(db, "groups", groupId), { name: newName });
      console.log(`Renamed to "${newName}" successfully!`);
      fetchGroups();
      modal.classList.remove("active");
    } catch (error) {
      console.error("Error updating group:", error.message);
      alert("Failed to update group.");
    } finally {
      spinner?.classList.add("hidden"); // hide spinner
      saveButton.disabled = false;
    }
  };
}

// Close button for edit group
const closeEditGroupSpan = document.getElementById("closeEditGroupModal");
if (closeEditGroupSpan) {
  closeEditGroupSpan.addEventListener("click", () => {
    document.getElementById("editGroupModal").classList.remove("active");
  });
}

/* ============================
   SHOW DELETE GROUP MODAL
============================ */
function showDeleteGroupModal(groupId) {
  const modal = document.getElementById("deleteGroupModal");
  const deleteButton = document.getElementById("confirmDeleteGroupBtn");
  const spinner = document.getElementById("deleteGroupSpinner"); // optional?
  modal.classList.add("active");

  deleteButton.onclick = async () => {
    try {
      spinner?.classList.remove("hidden");
      deleteButton.disabled = true;

      await deleteDoc(doc(db, "groups", groupId));
      console.log(`Group "${groupId}" deleted successfully!`);
      fetchGroups(); // Refresh groups
      modal.classList.remove("active");
    } catch (error) {
      console.error("Error deleting group:", error.message);
      alert("Failed to delete group.");
    } finally {
      spinner?.classList.add("hidden");
      deleteButton.disabled = false;
    }
  };
}

// Close button for delete group
const closeDeleteGroupSpan = document.getElementById("closeDeleteGroupModal");
if (closeDeleteGroupSpan) {
  closeDeleteGroupSpan.addEventListener("click", () => {
    document.getElementById("deleteGroupModal").classList.remove("active");
  });
}

/* ============================
  CALENDAR INITIALIZATION
============================ */
function initializeCalendar() {
  calendar = new DayPilot.Calendar("calendarContainer");
  calendar.viewType = "Week";

  // Current date reference
  let currentDate = new DayPilot.Date(); // today

  // Prev / Current / Next
  document.getElementById("prevWeekBtn").addEventListener("click", () => {
    currentDate = currentDate.addDays(-7);
    calendar.startDate = currentDate;
    calendar.update();
  });

  document.getElementById("currentWeekBtn").addEventListener("click", () => {
    currentDate = new DayPilot.Date(); // reset to today
    calendar.startDate = currentDate;
    calendar.update();
  });

  document.getElementById("nextWeekBtn").addEventListener("click", () => {
    currentDate = currentDate.addDays(7);
    calendar.startDate = currentDate;
    calendar.update();
  });

  // Click-drag to add an event
  calendar.onTimeRangeSelected = (args) => {
    // fill out #startTime, #duration from selection
    const startInput = document.getElementById("startTime");
    const durationInput = document.getElementById("duration");

    const localStart = new Date(args.start.value);
    const localEnd = new Date(args.end.value);

    startInput.value = formatDateTime(localStart);

    const durationHours = (localEnd - localStart) / (1000 * 60 * 60);
    durationInput.value = durationHours;

    // Show the "Add Event" modal
    document.getElementById("addEventModal").classList.add("active");
  };

  // Clicking an existing event to edit
  calendar.onEventClick = (args) => {
    const clickedEvent = calendar.events.list.find((e) => e.id === args.e.id());
    if (!clickedEvent) {
      console.error("Event not found.");
      return;
    }

    // Populate edit modal
    const editEventModal = document.getElementById("editEventModal");
    const editEventTitle = document.getElementById("editEventTitle");
    const editStartTime = document.getElementById("editStartTime");
    const editDuration = document.getElementById("editDuration");
    const saveButton = document.getElementById("saveEventButton");
    const spinner = document.getElementById("editEventSpinner"); // optional spinner?

    // Get and remove the old duration from the title before populating
    const titleWithoutDuration = clickedEvent.text.replace(/\(\d{1,2}h\s\d{1,2}m\)/, '').trim();
    editEventTitle.value = titleWithoutDuration;
    editStartTime.value = formatDateTime(new Date(clickedEvent.start));
    editDuration.value =
      (new Date(clickedEvent.end) - new Date(clickedEvent.start)) / 3600000;

    editEventModal.classList.add("active");

    // Save changes
    saveButton.onclick = async () => {
      try {
        spinner?.classList.remove("hidden");
        saveButton.disabled = true;

        const updatedTitle = editEventTitle.value.trim();
        const updatedStart = new Date(editStartTime.value);
        const updatedDur = parseFloat(editDuration.value);

        if (!updatedTitle || isNaN(updatedDur)) {
          alert("All fields required.");
          return;
        }

        const updatedEnd = new Date(updatedStart.getTime() + updatedDur * 3600000);

        // Update the title to include only the new duration
        const newTitle = `${updatedTitle} (${Math.floor(updatedDur)}h ${Math.round((updatedDur % 1) * 60)}m)`;

        await updateDoc(doc(db, "events", clickedEvent.id), {
          title: updatedTitle,
          start: formatDateTime(updatedStart),
          end: formatDateTime(updatedEnd),
        });

        console.log("Event updated successfully!");
        loadGroupEvents(selectedGroupId, document.getElementById("groupTitle").innerText);
        editEventModal.classList.remove("active");
      } catch (error) {
        console.error("Error updating event:", error.message);
      } finally {
        spinner?.classList.add("hidden");
        saveButton.disabled = false;
      }
    };
  };


  calendar.init();
}

/* ============================
  LOAD GROUP EVENTS
============================ */
async function loadGroupEvents(groupId, groupName) {
  selectedGroupId = groupId;
  document.getElementById("groupTitle").innerText = groupName;

  // Initialize calendar if not done yet
  if (!calendar) {
    initializeCalendar();
  }

  try {
    const eventsQuery = query(collection(db, "events"), where("groupId", "==", groupId));
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = [];
    eventsSnapshot.forEach((docSnap) => {
      const evt = docSnap.data();
      const normalizedStart = adjustToLocalTimezone(evt.start);
      const normalizedEnd = adjustToLocalTimezone(evt.end);

      if (!normalizedStart || !normalizedEnd) {
        console.error("Invalid date for event:", evt);
        return;
      }

      // Calculate duration for display
      const startDate = new Date(normalizedStart);
      const endDate = new Date(normalizedEnd);
      const diffMs = endDate - startDate;
      const hrs = Math.floor(diffMs / (3600000));
      const mins = Math.floor((diffMs % 3600000) / 60000);
      const durationText = hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;

      events.push({
        id: docSnap.id,
        text: `${evt.title || "Untitled Event"} (${durationText})`,
        start: normalizedStart,
        end: normalizedEnd,
      });
    });

    // Update DayPilot
    calendar.events.list = events;
    calendar.update();
  } catch (error) {
    console.error("Error loading events:", error);
  }
}

/* ============================
  ADD EVENT LOGIC
============================ */
/* =========================
   ADD EVENT (BUTTON + FORM)
========================= */
// 1) Make sure the button #addEventBtn exists:
const addEventBtn = document.getElementById("addEventBtn");
if (addEventBtn) {
  addEventBtn.addEventListener("click", () => {
    document.getElementById("eventForm").reset();
    document.getElementById("addEventModal").classList.add("active");
  });
}

// 2) "Add Event" form submission
document.getElementById("eventForm")?.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!selectedGroupId) {
    console.error("No group selected!");
    return;
  }

  const title = document.getElementById("eventTitle").value.trim();
  const startVal = document.getElementById("startTime").value;
  const durationVal = parseFloat(document.getElementById("duration").value);

  if (!title || !startVal || isNaN(durationVal)) {
    alert("All fields are required.");
    return;
  }

  const startDate = new Date(startVal);
  const endDate = new Date(startDate.getTime() + durationVal * 3600000);

  try {
    // Optional spinner for add event
    const spinner = document.getElementById("addEventSpinner");
    const submitBtn = document.getElementById("addEventSubmitBtn");
    spinner?.classList.remove("hidden");
    if (submitBtn) submitBtn.disabled = true;

    await addDoc(collection(db, "events"), {
      groupId: selectedGroupId,
      title,
      start: formatDateTime(startDate),
      end: formatDateTime(endDate),
      createdAt: new Date().toISOString(),
    });

    console.log("Event added successfully!");
    loadGroupEvents(selectedGroupId, document.getElementById("groupTitle").innerText);

    document.getElementById("addEventModal").classList.remove("active");
    e.target.reset();
  } catch (err) {
    console.error("Error adding event:", err.message);
  } finally {
    const spinner = document.getElementById("addEventSpinner");
    const submitBtn = document.getElementById("addEventSubmitBtn");
    spinner?.classList.add("hidden");
    if (submitBtn) submitBtn.disabled = false;
  }
});




/* ============================
  ADD GROUP LOGIC + SPINNER
============================ */
const addGroupModal = document.getElementById("addGroupModal");
const closeGroupModal = document.getElementById("closeGroupModal");
const addGroupBtn = document.getElementById("addGroupBtn");
const addGroupForm = document.getElementById("addGroupForm");

addGroupBtn.addEventListener("click", () => {
  addGroupModal.classList.add("active");
});

closeGroupModal.addEventListener("click", () => {
  addGroupModal.classList.remove("active");
});

addGroupForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const groupNameField = document.getElementById("groupName");
  const spinner = document.getElementById("spinner");
  const submitBtn = document.getElementById("addGroupSubmitBtn");

  const groupName = groupNameField.value.trim();
  if (!groupName) {
    alert("Group name cannot be empty.");
    return;
  }

  try {
    spinner.classList.remove("hidden");
    submitBtn.disabled = true;

    await addDoc(collection(db, "groups"), {
      name: groupName,
      createdAt: new Date(),
    });

    console.log(`Group "${groupName}" added successfully!`);
    addGroupModal.classList.remove("active");
    addGroupForm.reset();
    fetchGroups();
  } catch (error) {
    console.error("Error adding group:", error.message);
  } finally {
    spinner.classList.add("hidden");
    submitBtn.disabled = false;
  }
});

/* ============================
  EDIT EVENT LOGIC
============================ */
// We handle opening the edit event modal in `calendar.onEventClick` above.
// Here we just handle the close, etc.
const editEventModal = document.getElementById("editEventModal");
const closeEditEventModal = document.getElementById("closeEditEventModal");
closeEditEventModal.addEventListener("click", () => {
  editEventModal.classList.remove("active");
});

const addEventModal = document.getElementById("addEventModal");
const closeAddEventModal = document.getElementById("closeAddEventModal");
closeAddEventModal.addEventListener("click", () => {
  addEventModal.classList.remove("active");
});

/* ============================
  PROFILE LOGIC
============================ */
const openProfileBtn = document.getElementById("openProfileBtn");
if (openProfileBtn) {
  openProfileBtn.addEventListener("click", () => {
    document.getElementById("profileModal").classList.add("active");
    loadProfile();
  });
}

const closeProfileModalBtn = document.getElementById("closeProfileModal");
if (closeProfileModalBtn) {
  closeProfileModalBtn.addEventListener("click", () => {
    document.getElementById("profileModal").classList.remove("active");
  });
}

// Load user’s profile data
async function loadProfile() {
  const user = auth.currentUser;
  if (user) {
    document.getElementById("userEmail").textContent = user.email || "Not Available";
    document.getElementById("displayName").textContent = user.displayName || "Not Available";
  } else {
    console.error("User not logged in.");
  }
}

// Update profile
const updateProfileForm = document.getElementById("updateProfileForm");
if (updateProfileForm) {
  updateProfileForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    const newDisplayName = document.getElementById("newDisplayName").value.trim();
    if (!newDisplayName) {
      alert("Display name cannot be empty.");
      return;
    }

    const user = auth.currentUser;
    if (!user) {
      console.error("No user is logged in.");
      return;
    }
    try {
      await updateProfile(user, { displayName: newDisplayName });
      loadProfile();
      updateProfileForm.reset();
    } catch (err) {
      console.error("Error updating profile:", err.message);
    }
  });
}

/* ============================
   HELPER FUNCTIONS
============================ */
function formatDateTime(date) {
  if (!(date instanceof Date)) {
    date = new Date(date);
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const mins = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${mins}`;
}

function adjustToLocalTimezone(dateString) {
  try {
    const utcDate = new Date(dateString);
    const localDate = new Date(utcDate.getTime() - utcDate.getTimezoneOffset() * 60000);
    return localDate.toISOString().slice(0, 19); // No milliseconds
  } catch (err) {
    console.error("Error adjusting date:", err.message, dateString);
    return null;
  }
}

/* ============================
   ON PAGE LOAD
============================ */
document.addEventListener("DOMContentLoaded", () => {
  // On load, fetch groups so the sidebar is populated
  fetchGroups();
  // You might also check if user is logged in, etc.
  console.log("dashboard.js loaded and initialized.");
});
