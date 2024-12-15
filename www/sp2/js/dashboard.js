import { auth, db } from "./firebase-config.js";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Global variables
let selectedGroupId = null;
let calendar;

// Logout Functionality
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
});

// Fetch Groups
async function fetchGroups() {
  const groupList = document.getElementById("groupList");
  groupList.innerHTML = ""; // Clear existing list

  try {
    const groups = await getDocs(collection(db, "groups"));
    groups.forEach((doc) => {
      const group = doc.data();
      const li = document.createElement("li");
      const link = document.createElement("a");
      link.href = "#";
      link.textContent = group.name;
      link.addEventListener("click", () => loadGroup(doc.id, group.name));
      li.appendChild(link);
      groupList.appendChild(li);
    });
  } catch (error) {
    console.error("Error fetching groups:", error);
    alert("Failed to fetch groups.");
  }
}

// Initialize DayPilot Lite Calendar
function initializeCalendar() {
  console.log("Initializing DayPilot...");
  calendar = new DayPilot.Calendar("calendarContainer");
  calendar.viewType = "Week";
  calendar.init();
}

// Load Group Events into Calendar
async function loadGroup(groupId, groupName) {
  selectedGroupId = groupId;
  document.getElementById("groupTitle").innerText = groupName;

  if (!calendar) {
    initializeCalendar();
  }

  console.log(`Loading events for groupId: ${groupId}`);
  
  // Fetch events for the selected group
  try {
    const eventsQuery = query(collection(db, "events"), where("groupId", "==", groupId));
    const eventsSnapshot = await getDocs(eventsQuery);

    const events = [];
    console.log("Events snapshot size:", eventsSnapshot.size);

    eventsSnapshot.forEach((doc) => {
      const event = doc.data();
      console.log("Fetched event:", event);

      // Append ':00' to start and end times to ensure proper ISO format
      const formattedStart = event.start.includes(":") ? `${event.start}:00` : event.start;
      const formattedEnd = event.end.includes(":") ? `${event.end}:00` : event.end;

      events.push({
        id: doc.id,
        text: event.title,
        start: formattedStart,
        end: formattedEnd,
      });
    });

    console.log("Loaded events:", events);

    calendar.events.list = events;
    calendar.update();
  } catch (error) {
    console.error("Error loading events:", error);
    alert("Failed to load events.");
  }
}


// Add Group Functionality
document.getElementById("addGroupBtn").addEventListener("click", async () => {
  const groupName = prompt("Enter the name of the new group:");
  if (groupName) {
    try {
      await addDoc(collection(db, "groups"), {
        name: groupName,
        createdAt: new Date(),
      });
      alert(`Group "${groupName}" added successfully!`);
      fetchGroups(); // Refresh the group list
    } catch (error) {
      console.error("Error adding group:", error);
      alert("Failed to add group.");
    }
  }
});

// Add Event Functionality
document.getElementById("addEventBtn").addEventListener("click", async () => {
  if (!selectedGroupId) {
    alert("Please select a group first.");
    return;
  }

  const title = prompt("Enter the event title:");
  const start = prompt("Enter start time (YYYY-MM-DDTHH:MM):");
  const end = prompt("Enter end time (YYYY-MM-DDTHH:MM):");

  if (title && isValidDateTime(start) && isValidDateTime(end)) {
    try {
      await addDoc(collection(db, "events"), {
        groupId: selectedGroupId,
        title: title,
        start: start,
        end: end,
        createdAt: new Date(),
      });

      alert("Event added successfully!");
      loadGroup(selectedGroupId, document.getElementById("groupTitle").innerText);
    } catch (error) {
      console.error("Error adding event:", error);
      alert("Failed to add event.");
    }
  } else {
    alert("Invalid input! Ensure start and end time are in YYYY-MM-DDTHH:MM format.");
  }
});

// Helper function to validate date-time format
function isValidDateTime(value) {
  return /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/.test(value);
}

// Initialize Groups on Page Load
fetchGroups();
