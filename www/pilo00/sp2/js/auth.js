// auth.js

import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// If you have a switchView function in spa.js, import it:
import { switchView } from "./spa.js";

// SPINNER ELEMENTS (optional if you want spinners for login/register)
const loginSpinner = document.getElementById("loginSpinner");    // e.g. <span id="loginSpinner" class="spinner hidden"></span>
const registerSpinner = document.getElementById("registerSpinner"); // e.g. <span id="registerSpinner" class="spinner hidden"></span>

/* ==========================
      USER REGISTRATION
========================== */
document.getElementById("registerForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;
  
  // Show spinner, disable button (optional)
  if (registerSpinner) registerSpinner.classList.remove("hidden");
  e.target.querySelector("button").disabled = true;

  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered:", userCredential.user);
    
    // Possibly switch to dashboard or remain on login view
    // switchView("dashboardView");  // If you want them auto-logged in and moved to dashboard
    // or just do nothing if you want them to log in after registering
    
  } catch (error) {
    console.error("Registration Error:", error.message);
    alert("Registration failed: " + error.message);
  } finally {
    // Hide spinner, re-enable button
    if (registerSpinner) registerSpinner.classList.add("hidden");
    e.target.querySelector("button").disabled = false;
  }
});

/* ==========================
         USER LOGIN
========================== */
document.getElementById("loginForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;
  
  // Show spinner, disable button (optional)
  if (loginSpinner) loginSpinner.classList.remove("hidden");
  e.target.querySelector("button").disabled = true;

  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);

    // Instead of redirect, switch to dashboard
    switchView("dashboardView");
    
    // Also, you might want to adjust nav links:
    // - Hide Login
    // - Show Dashboard, Profile, and Logout
    // That logic can also live in spa.js or a separate function.

  } catch (error) {
    console.error("Login Error:", error.message);
    alert("Login failed: " + error.message);
  } finally {
    // Hide spinner, re-enable button
    if (loginSpinner) loginSpinner.classList.add("hidden");
    e.target.querySelector("button").disabled = false;
  }
});

/* ==========================
       PASSWORD RESET
========================== */
document.getElementById("resetPassword").addEventListener("click", () => {
  const email = prompt("Enter your email to reset password:");
  if (email) {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert("Password reset email sent!");
      })
      .catch((error) => {
        console.error("Error:", error.message);
        alert(error.message);
      });
  }
});
