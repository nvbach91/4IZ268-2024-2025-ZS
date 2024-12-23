import Swal from "sweetalert2";

const CLIENT_ID =
  "1082310563066-i012m4gulkr01asucv0gn452f82hk6kc.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

interface TimerSettings {
  focusTime: number; // minutes
  breakTime: number; // minutes
  sections: number; // number of sections
  taskType: string;
}

let isPomodoro = false;

// Elements
const signinButton = document.getElementById("signin-button")!;
const loginScreen = document.getElementById("login")!;
const timerSettings = document.getElementById("timer-settings")!;
const navPanel = document.getElementById("navbar-panel")!;
const timer = document.getElementById("timer")!;
const dashboard = document.getElementById("dashboard")!;
const screens: Array<HTMLElement> = [
  loginScreen,
  timerSettings,
  navPanel,
  timer,
  dashboard,
];

const navPanelButtons = document.querySelectorAll("#nav-panel button");

const timerButton = document.getElementById("timerButton")!;
const dashboardButton = document.getElementById("dashboardButton")!;
const logOutButton = document.getElementById("logOutButton")!;

const timerSettingsForm = document.getElementById("timer-settings-form") as HTMLFormElement;
const timerSettingsFormCancelButton = document.getElementById("cancel-form")!;

const pauseButton = document.getElementById("pause") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;

// User authorization and access token handling
let token: string;

const client = google.accounts.oauth2.initTokenClient({
  client_id: CLIENT_ID,
  scope: SCOPES,

  callback: (response: any) => {
    token = response.access_token;
    saveToken(response.expires_in);
    console.log("Token získán:" + token);
    changeScreen([navPanel, timerSettings]);
  },
});

signinButton.addEventListener("click", () => {
  console.log("Sign in button clicked!");
  client.requestAccessToken({ prompt: "consent" });
});

function saveToken(expiresIn: number): void {
  const currentDate = new Date();
  const expiryDate = new Date(currentDate.getTime() + expiresIn * 1000);
  localStorage.setItem("tokenExpiryDate", expiryDate.toISOString());
}

function clearToken(): void {
  localStorage.removeItem("tokenExpiryDate");
}

function isTokenValid(): boolean {
  let tokenExpiryStr = localStorage.getItem("tokenExpiryDate");
  if (!tokenExpiryStr) return false;

  let tokenExpiryDate = new Date(tokenExpiryStr);
  const now = new Date();

  console.log("Token expires at: " + tokenExpiryDate);
  return now < tokenExpiryDate;
}

function autoRefreshToken(): void {
  let tokenExpiryStr = localStorage.getItem("tokenExpiryDate");
  if (!tokenExpiryStr) return;

  let tokenExpiryDate = new Date(tokenExpiryStr);
  let now = new Date();

  let timeRemaining = (tokenExpiryDate.getTime() - now.getTime()) / 1000; // In seconds

  if (timeRemaining < 90) {
    console.log("Token is about to expire, refreshing...");
    client.requestAccessToken({ prompt: "none" });
  }
}

// Changing screens and nav panel navigation
function changeScreen(visibleScreens: Array<HTMLElement>): void {
  screens.forEach((screen) => {
    screen.classList.add("hidden");
  });

  visibleScreens.forEach((screen) => {
    screen.classList.remove("hidden");
  });
}

navPanelButtons.forEach(button => {
  button.addEventListener('click', () => {
    document.querySelectorAll("#nav-panel .nav-icon").forEach(icon => {
      icon.classList.remove('active');
    });

    const icon = button.querySelector('.nav-icon');
    if (icon) {
      icon.classList.add('active');
    }
  });
})

timerButton.addEventListener("click", () => {
  if (!isPomodoro) {
    changeScreen([navPanel, timerSettings]);
  } else {
    changeScreen([navPanel, timer]);
  }
});

dashboardButton.addEventListener("click", () => {
  changeScreen([navPanel, dashboard]);
});

logOutButton.addEventListener("click", () => {
  Swal.fire({
    title: "Do you realy want to Log Out?",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Don't Log Out`,
  }).then((result) => {
    if (result.isConfirmed) {
      clearToken();
      initApp();
      Swal.fire({
        title: "Log Out successful",
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      });
    }
  });
});

// Timer setup and logic
let pomodoroTimer: number | undefined;

timerSettingsForm.addEventListener("submit", (event) => {
  event.preventDefault();

  changeScreen([navPanel, timer]);

  let focusTime = document.getElementById("focusTime") as HTMLSelectElement;
  let breakTime = document.getElementById("breakTime") as HTMLSelectElement;
  let sections = document.getElementById("sections") as HTMLSelectElement;
  let taskType = document.getElementById("taskType") as HTMLSelectElement;

  if (!focusTime || !breakTime || !sections || !taskType) {
    console.error("Jedno nebo více polí formuláře nebylo nalezeno.");
    return;
  }

  const settings: TimerSettings = {
    focusTime: Number(focusTime.value),
    breakTime: Number(breakTime.value),
    sections: Number(sections.value),
    taskType: taskType.value,
  };

  console.log(settings);
  startPomodoroTimer(settings);
});

timerSettingsFormCancelButton.addEventListener('click', () => {
  timerSettingsForm.reset();
});

let isPaused = false;

function startPomodoroTimer(settings: TimerSettings): void {
  isPomodoro = true;
  isPaused = false;

  pauseButton.disabled = false;
  stopButton.disabled = false;

  pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-pause" viewBox="0 0 16 16">
     <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
  </svg>`;

  const focusDuration = settings.focusTime * 60; // seconds
  const breakDuration = settings.breakTime * 60; // seconds
  const totalSections = settings.sections;
  const timerDisplay = document.getElementById("timer-display");
  const timerDisplaySession = document.getElementById("session-display");
  const focusBreakDisplay = document.getElementById("focus-break-display");

  let currentSection = 1;
  let isFocus = true;
  let remainingTime = focusDuration;

  const startTime = new Date();

  let totalFocusTime = 0; // seconds
  let totalBreakTime = 0; // seconds

  function updateTimer(): void {

    if (isFocus) {
      totalFocusTime++;
    } else {
      totalBreakTime++;
    }

    function formatTime(seconds: number): string {
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    function completeSession(): void {
      isPomodoro = false;

      console.log("Pomodoro finished!");
      if (timerDisplay) {
        timerDisplay.textContent = `Pomodoro finished! 🥳`;
      }

      if (focusBreakDisplay) {
        focusBreakDisplay.textContent = ``;
      }

      document.title = `Pomodoro finished! 🥳`;
      
      const sound = new Audio('../public/audio/trumpet_fanfare.mp3');
      sound.play().catch(error => console.error("Audio cannot be played: ", error));

      const endTime = new Date();

      const sessionData = {
        settings: {
          focusTime: settings.focusTime,
          breakTime: settings.breakTime,
          sections: settings.sections,
          taskType: settings.taskType,
        },
        stats: {
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          totalFocusTime: (totalFocusTime - (1 * totalSections)) / 60,
          totalBreakTime: (totalBreakTime - (1 * totalSections)) / 60,
        },
      };

      console.log(sessionData);

      // Implementace saveToGoogleDrive(sessionData);
    }

    console.log(
      `Pomodoro round ${currentSection}. ${
        isFocus ? "Focus" : "Break"
      } time remaining: ${formatTime(remainingTime)}`
    );

    if (timerDisplay) {
      timerDisplay.textContent = `${formatTime(remainingTime)}`;
    }

    if (timerDisplaySession) {
      timerDisplaySession.textContent = `Session ${currentSection} / ${totalSections}`;
    }

    if (focusBreakDisplay) {
      focusBreakDisplay.textContent = `${isFocus ? "Focus 💪" : "Break 🥱"}`;
    }

    document.title = `${formatTime(remainingTime)} - ${isFocus ? "Focus 💪" : "Break 🥱"}`;

    remainingTime--;

    if (remainingTime < 0) {
      if (isFocus) {
        isFocus = false;
        remainingTime = breakDuration;
        console.log("Session finished, switching to break...");
      } else {
        currentSection++;

        if (currentSection <= totalSections) {
          isFocus = true;
          remainingTime = focusDuration;
          console.log("Break finished, switching to focus session...");
        } else {
          clearInterval(pomodoroTimer);
          completeSession();
          return;
        }
      }
    }
  }

  pomodoroTimer = setInterval(updateTimer, 1000);

  // Pause and stop timer logic
  pauseButton.onclick = () => {
    if (isPaused) {
      isPaused = false;
      pomodoroTimer = setInterval(updateTimer, 1000);
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-pause" viewBox="0 0 16 16">
        <path d="M6 3.5a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5m4 0a.5.5 0 0 1 .5.5v8a.5.5 0 0 1-1 0V4a.5.5 0 0 1 .5-.5"/>
      </svg>`;
    } else {
      isPaused = true;
      clearInterval(pomodoroTimer);
      pauseButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="white" class="bi bi-play" viewBox="0 0 16 16">
        <path d="M10.804 8 5 4.633v6.734zm.792-.696a.802.802 0 0 1 0 1.392l-6.363 3.692C4.713 12.69 4 12.345 4 11.692V4.308c0-.653.713-.998 1.233-.696z"/>
      </svg>`;
    }
  };

  stopButton.onclick = () => {
    if (pomodoroTimer) {
      clearInterval(pomodoroTimer);
      pomodoroTimer = undefined;
    }

    isPomodoro = false;

    console.log("Pomodoro stoped!");
    if (timerDisplay) {
      timerDisplay.textContent = `Pomodoro stoped! 😥`;
    }

    if (focusBreakDisplay) {
      focusBreakDisplay.textContent = ``;
    }

    document.title = `Pomodoro stoped! 😥`

    pauseButton.disabled = true;
    stopButton.disabled = true;

    const endTime = new Date();

    const sessionData = {
      settings: {
        focusTime: settings.focusTime,
        breakTime: settings.breakTime,
        sections: settings.sections,
        taskType: settings.taskType,
      },
      stats: {
        startTime: startTime.toISOString(),
        endTime: endTime.toISOString(),
        totalFocusTime: (totalFocusTime - (1 * currentSection - 1)) / 60,
        totalBreakTime: (totalBreakTime - (1 * currentSection - 1)) / 60,
      },
    };

    console.log(sessionData);
  };
}

// Initialize screens
function initApp(): void {
  if (isTokenValid()) {
    console.log("User token valid.");
    changeScreen([navPanel, timerSettings]);
  } else {
    console.log("No valid tokens found.");
    changeScreen([loginScreen]);
  }
  setInterval(autoRefreshToken, 30 * 1000);
}

initApp();
