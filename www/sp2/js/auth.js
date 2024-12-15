import { auth } from "./firebase-config.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";

// User Registration
document.getElementById("registerForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("registerEmail").value;
  const password = document.getElementById("registerPassword").value;

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Registration successful!");
      console.log("User registered:", userCredential.user);
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert(error.message);
    });
});

// User Login
document.getElementById("loginForm").addEventListener("submit", (e) => {
  e.preventDefault();
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      alert("Login successful!");
      console.log("User logged in:", userCredential.user);
      window.location.href = "dashboard.html";
    })
    .catch((error) => {
      console.error("Error:", error.message);
      alert("Login failed: " + error.message);
    });
});

// Password Reset
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
