import { auth, db } from "./firebase-config.js";
import { doc, getDoc, setDoc } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";
import { signOut, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// Elements
const userEmail = document.getElementById("userEmail");
const displayName = document.getElementById("displayName");
const updateProfileForm = document.getElementById("updateProfileForm");
const newDisplayNameInput = document.getElementById("newDisplayName");

// Logout
document.getElementById("logoutBtn").addEventListener("click", () => {
  signOut(auth).then(() => {
    alert("Logged out successfully!");
    window.location.href = "login.html";
  });
});

// Load User Data
onAuthStateChanged(auth, async (user) => {
  if (user) {
    userEmail.textContent = user.email;

    // Fetch display name from Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
      const userData = userDoc.data();
      displayName.textContent = userData.displayName || "Not set";
    } else {
      displayName.textContent = "Not set";
    }
  } else {
    alert("User not logged in!");
    window.location.href = "login.html";
  }
});

// Update Profile
updateProfileForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const newDisplayName = newDisplayNameInput.value.trim();

  if (newDisplayName) {
    try {
      const user = auth.currentUser;

      if (user) {
        const userRef = doc(db, "users", user.uid);
        await setDoc(userRef, { displayName: newDisplayName }, { merge: true });

        alert("Profile updated successfully!");
        displayName.textContent = newDisplayName;
        newDisplayNameInput.value = "";
      }
    } catch (error) {
      console.error("Error updating profile:", error.message);
      alert("Failed to update profile.");
    }
  }
});
