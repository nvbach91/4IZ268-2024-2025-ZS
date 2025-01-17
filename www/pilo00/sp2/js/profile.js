// profile.js

import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Grab DOM elements once (assuming they're in the HTML at all times)
const userEmailElement = document.getElementById("userEmail");
const displayNameElement = document.getElementById("displayName");
const updateProfileForm = document.getElementById("updateProfileForm");
const newDisplayNameInput = document.getElementById("newDisplayName");

/**
 * loadProfile():
 *  - Fetch current user from Firebase Auth.
 *  - If there's a Firestore doc for them, set userEmail/displayName in the DOM.
 */
export async function loadProfile() {
  const user = auth.currentUser;
  if (!user) {
    console.log("No user is logged in, cannot load profile.");
    // Optionally do something else, like switchView("loginView") 
    return;
  }

  // Set user email
  userEmailElement.textContent = user.email || "Not set";

  // Try to fetch display name from Firestore
  const userRef = doc(db, "users", user.uid);
  const userDoc = await getDoc(userRef);

  if (userDoc.exists()) {
    const userData = userDoc.data();
    displayNameElement.textContent = userData.displayName || "Not set";
  } else {
    displayNameElement.textContent = "Not set";
  }
}

/**
 * Handle "Update Profile" form submission.
 *  - Writes the new display name to Firestore (merge: true).
 */
updateProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newDisplayName = newDisplayNameInput.value.trim();
  if (!newDisplayName) return;

  try {
    const user = auth.currentUser;
    if (!user) {
      console.error("No user is logged in, cannot update profile.");
      return;
    }

    const userRef = doc(db, "users", user.uid);
    await setDoc(userRef, { displayName: newDisplayName }, { merge: true });

    console.log("Profile updated successfully!");
    displayNameElement.textContent = newDisplayName;
    newDisplayNameInput.value = "";
  } catch (error) {
    console.error("Error updating profile:", error.message);
    alert("Failed to update profile.");
  }
});
