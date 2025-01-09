document.querySelectorAll("nav a, button[data-target]").forEach((link) => {
    link.addEventListener("click", (e) => {
      const target = e.target.getAttribute("data-target");
      if (target) {
        document.querySelectorAll(".page").forEach((page) => page.classList.remove("active"));
        document.getElementById(target).classList.add("active");
      }
    });
  });
  
  // Hide Logout button on pages where it's not needed
  const logoutBtn = document.getElementById("logoutBtn");
  logoutBtn.style.display = "none"; // Hide by default
  
  document.querySelectorAll("[data-target='dashboardPage']").forEach((el) => {
    el.addEventListener("click", () => {
      logoutBtn.style.display = "block"; // Show Logout on Dashboard
    });
  });
  