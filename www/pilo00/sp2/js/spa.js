// spa.js

import { auth } from "./firebase-config.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { loadProfile } from "./profile.js";

/**
 * switchView(viewId):
 *  1. Hides all .view sections.
 *  2. Shows the one matching `viewId`.
 *  3. Updates nav link 'active' class.
 */
export function switchView(viewId) {
  // Hide all elements with class "view"
  const views = document.querySelectorAll(".view");
  views.forEach((view) => {
    view.classList.add("hidden");
  });

  // Show the target view
  const targetView = document.getElementById(viewId);
  if (targetView) {
    targetView.classList.remove("hidden");
  } else {
    console.warn(`View "${viewId}" not found.`);
  }

  // Update nav link 'active' classes
  const navLinks = document.querySelectorAll("nav a[data-target]");
  navLinks.forEach((link) => {
    if (link.dataset.target === viewId) {
      link.classList.add("active");
    } else {
      link.classList.remove("active");
    }
  });
}

/**
 * DOMContentLoaded: 
 *   1. Attach nav link listeners to call switchView().
 *   2. "Get Started" button -> switch to loginView.
 *   3. Listen for auth changes:
 *      - If user => go to dashboardView, show logout + profile, hide login/home
 *      - Else => go to homeView, show login/home, hide logout+profile
 *   4. Attach logout link => sign out
 */
document.addEventListener("DOMContentLoaded", () => {
  // 1. Nav link listeners
  const navLinks = document.querySelectorAll("nav a[data-target]");
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.dataset.target;
      switchView(targetId);
    });
  });

  // 2. "Get Started" button => loginView
  const getStartedBtn = document.getElementById("getStartedBtn");
  if (getStartedBtn) {
    getStartedBtn.addEventListener("click", () => {
      switchView("loginView");
    });
  }

  // References to nav links
  const homeLink    = document.getElementById("navHome");
  const loginLink   = document.getElementById("navLogin");
  const profileLink = document.getElementById("navProfile");
  const logoutLink  = document.getElementById("logoutBtn");

  // 3. Auth state
  onAuthStateChanged(auth, (user) => {
    if (user) {
      // Logged in => show dashboard
      switchView("dashboardView");

      // Hide Home + Login, show Profile + Logout
      if (homeLink)    homeLink.classList.add("hidden");
      if (loginLink)   loginLink.classList.add("hidden");
      if (profileLink) profileLink.classList.remove("hidden");
      if (logoutLink)  logoutLink.classList.remove("hidden");

      // Profile link => go to "profileView" + load data
      if (profileLink) {
        profileLink.addEventListener("click", (e) => {
          e.preventDefault();
          switchView("profileView");
          loadProfile();
        });
      }

      // 3a. "Back to Dashboard" button in Profile
      // We'll attach the event only if the user is logged in, since the dashboard requires auth
      const toDashboardBtn = document.getElementById("toDashboardBtn");
      if (toDashboardBtn) {
        toDashboardBtn.addEventListener("click", () => {
          switchView("dashboardView");
        });
      }

    } else {
      // Not logged in => show home
      switchView("homeView");

      // Show Home + Login, hide Profile + Logout
      if (homeLink)    homeLink.classList.remove("hidden");
      if (loginLink)   loginLink.classList.remove("hidden");
      if (profileLink) profileLink.classList.add("hidden");
      if (logoutLink)  logoutLink.classList.add("hidden");
    }
  });

  // 4. Logout link => sign out
  if (logoutLink) {
    logoutLink.addEventListener("click", async (e) => {
      e.preventDefault();
      await signOut(auth);
      console.log("User logged out");
      // Switch to login after sign out
      switchView("loginView");
    });
  }
});
