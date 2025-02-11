import Swal from "sweetalert2";
import { Chart, ChartConfiguration, BarElement, BarController, CategoryScale, LinearScale, Title, Tooltip } from 'chart.js';
Chart.register(BarElement, BarController, CategoryScale, LinearScale, Title, Tooltip);

const CLIENT_ID =
  "1082310563066-i012m4gulkr01asucv0gn452f82hk6kc.apps.googleusercontent.com";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

interface TimerSettings {
  focusTime: number; // minutes
  breakTime: number; // minutes
  sections: number;
  taskType: string;
}

interface TaskDetails {
  taskType: string;
  totalFocusTime: number;
  days: Array<Day>;
}

interface Day {
  date: string;
  minutes: number;
}

type TaskTypeData = {
  taskType: string;
  totalFocusTime: number;
  days: Array<string>;
}

type TaskTypeAccumulator = {
  [key: string]: TaskTypeData;
}

let isPomodoro = false;

// Elements
const signinButton = document.getElementById("signin-button")!;
const loginScreen = document.getElementById("login")!;
const timerSettings = document.getElementById("timer-settings")!;
const navPanel = document.getElementById("navbar-panel")!;
const timer = document.getElementById("timer")!;
const dashboard = document.getElementById("dashboard")!;
const manualEntry = document.getElementById("manual-entry")!;
const screens: Array<HTMLElement> = [
  loginScreen,
  timerSettings,
  navPanel,
  timer,
  dashboard,
  manualEntry
];

let currentBarChart: Chart | null = null;
let currentDailyChart: Chart | null = null;
const dailyChartSettingsForm = document.getElementById("daily-chart-settings-form") as HTMLFormElement;
const dailyChartCanvas = document.getElementById('dailyChart') as HTMLCanvasElement;
const barChartCanvas = document.getElementById('barChart') as HTMLCanvasElement;
const selectElement = document.getElementById("taskTypeForChart") as HTMLSelectElement;

const navPanelButtons = document.querySelectorAll("#nav-panel button");

const timerButton = document.getElementById("timerButton")!;
const dashboardButton = document.getElementById("dashboardButton")!;
const logOutButton = document.getElementById("logOutButton")!;
const manualEntryButton = document.getElementById("manualEntryButton")!;

const timerSettingsForm = document.getElementById("timer-settings-form") as HTMLFormElement;
const timerSettingsFormCancelButton = document.getElementById("cancel-form")!;
const manualEntryForm = document.getElementById("manual-entry-form") as HTMLFormElement;

let taskType = document.getElementById("taskType") as HTMLSelectElement;
let tasksString = Array.from(taskType.options).map(option => option.value)

const pauseButton = document.getElementById("pause") as HTMLButtonElement;
const stopButton = document.getElementById("stop") as HTMLButtonElement;

const spinner = document.getElementById('loading-spinner');

const showSpinner = function() {
  if (spinner) {
    spinner.classList.remove('hidden');
  }
}

const hideSpinner = function() {
  if (spinner) {
    spinner.classList.add('hidden');
  }
}

// User authorization and access token handling xx
let token: string;

interface ExtendedTokenClient extends google.accounts.oauth2.TokenClient {
  callback?: (response: any) => void; //Pro typescript přidáváme do tokenclienta callback, abychom jej mohli později modifikovat pro asynchronní volání
}
let client: ExtendedTokenClient;


const loadGoogleLibrary = function (): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      console.log("Google Identity Services loaded");
      resolve();
    };
    document.head.appendChild(script);
  });
}

const initializeGoogleClient = function() {
  client = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (response: any) => {
      if (response.error) {
        console.error("Error during token request:", response.error);
      } else {
        token = response.access_token;
        saveToken(response.expires_in);
        console.log("Token získán: " + token);
      }
    },
  });
}

const init = async function() {
  await loadGoogleLibrary();
  initializeGoogleClient();
}

init();

const signInAndGetToken = async function(): Promise<string> {
  if (!client) {
    throw new Error("Google gsi client not loaded");
  }

  return new Promise((resolve, reject) => {

    client.callback = (response: any) => {
      if (response.error) {
        reject(new Error(response.error));        
      } else {
        token = response.access_token;
        saveToken(response.expires_in);
        //console.log("Token získán:" + token);
        resolve(token);
      }
    }

    client.requestAccessToken({ prompt: "consent" });

  });
}

signinButton.addEventListener("click", async () => {
  try {
    const token = await signInAndGetToken();
    console.log("Přihlášení úspěšné, token získán: " + token);

    // Nastavení timer button na active po loginu
    document.querySelectorAll("#nav-panel .nav-icon").forEach(icon => {
      icon.classList.remove('active');
    });
    const icon = document.querySelector('#timerButton .nav-icon');
    if (icon) {
      icon.classList.add('active');
    }
    //
    changeScreen([navPanel, timerSettings]);
  } catch (error) {
    console.error("Přihlášení selhalo:", error);
  }
});

const saveToken = function(expiresIn: number): void {
  const currentDate = new Date();
  const expiryDate = new Date(currentDate.getTime() + expiresIn * 1000);
  localStorage.setItem("tokenExpiryDate", expiryDate.toISOString());
}

const clearToken = function(): void {
  localStorage.removeItem("tokenExpiryDate");
}

const isTokenValid = function(): boolean {
  let tokenExpiryStr = localStorage.getItem("tokenExpiryDate");
  if (!tokenExpiryStr) return false;

  let tokenExpiryDate = new Date(tokenExpiryStr);
  const now = new Date();

  console.log("Token expires at: " + tokenExpiryDate);
  return now < tokenExpiryDate;
}

const autoRefreshToken = function(): void {
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

const verifyToken = async function(token: string): Promise<boolean> {
  try {
    const response = await fetch(`https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`);
    if (response.ok) {
      const data = await response.json();
      console.log("Token je platný:", data);
      return true;
    } else {
      console.warn("Token je neplatný nebo vypršel.");
      return false;
    }
  } catch (error) {
    console.error("Chyba při ověřování tokenu:", error);
    return false;
  }
}


// Changing screens and nav panel navigation
const changeScreen = function(visibleScreens: Array<HTMLElement>): void {
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

// Charts on dashboard loading
dashboardButton.addEventListener("click", async () => {
  showSpinner();
  try {
    const isTokenValid = await verifyToken(token);

    if (isTokenValid) {
      changeScreen([navPanel, dashboard]);
      // Vykreslení grafu po kategoriích

      const fileId = await findFileOnGoogleDrive(token, "pomodioSessionData.json");
      const data = await downloadFileFromGoogleDrive(token, fileId);

      if (data) {
        console.log("File found and downloaded successfully: "); 
        console.log(data);

        const xlabels = Object.keys(data.taskTypes).filter(taskType => taskType !== "");

        const chartData = Object.values(data.taskTypes as Record<string, TaskDetails>)
          .filter(details => details.taskType !== "")
          .map(details => details.totalFocusTime / 60).map(Number); // Přepočet na hodiny

        const xlabel = 'Hours';
        const name = 'Total hours by categories';

        createBarChart(xlabels, chartData, xlabel, name);

        if (selectElement) {
          selectElement.innerHTML = '';

          const options = [
            "Studying", "Work", "Exercise", "Learning new skill", "Coding", "Reading", "Meditation", "Other"
          ]

          options.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option;
            optionElement.textContent = `${option} (${data.taskTypes[option].days.length})`;
            selectElement.appendChild(optionElement);
          })
        }

      } else {
        console.log("File not found");
      }
    } else {
      try {
        const token = await signInAndGetToken();
        console.log("Přihlášení úspěšné, token získán: " + token);
        changeScreen([navPanel, dashboard]);

        // Vykreslení grafu po kategoriích

        const fileId = await findFileOnGoogleDrive(token, "pomodioSessionData.json");
        const data = await downloadFileFromGoogleDrive(token, fileId);

        if (data) {
          console.log("File found and downloaded successfully: "); 
          console.log(data);

          const xlabels = Object.keys(data.taskTypes).filter(taskType => taskType !== "");

          const chartData = Object.values(data.taskTypes as Record<string, TaskDetails>)
            .filter(details => details.taskType !== "")
            .map(details => details.totalFocusTime / 60).map(Number); // Přepočet na hodiny

          const xlabel = 'Hours';
          const name = 'Total hours by categories';

          createBarChart(xlabels, chartData, xlabel, name);

          if (selectElement) {
            Array.from(selectElement.options).forEach(option => {
              let count = data.taskTypes[option.value].days.length;
              option.textContent = `${option.value} (${count})`;
            })
          }

        } else {
          console.log("File not found");
        }

      } catch (error) {
        console.error("Přihlášení selhalo:", error);
      }
    }
  } catch (error) {
    console.error("Chyba při načítání:", error);
  } finally {
    hideSpinner();
  }

});

dailyChartSettingsForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  showSpinner();

  try {
    let taskType = document.getElementById("taskTypeForChart") as HTMLSelectElement;
    console.log("Daily chart task: " + taskType.value);

    const fileId = await findFileOnGoogleDrive(token, "pomodioSessionData.json");
    const data = await downloadFileFromGoogleDrive(token, fileId);

      if (data) {
        console.log("File found and downloaded successfully");

        const days: Array<Day> = data.taskTypes[taskType.value].days;
        const xlabels = days.map(day => day.date);
        const chartData = days.map(day => day.minutes / 60); // Přepočet na hodiny
        const xlabel = 'Hours';
        const name = 'Hours by days';

        createDailyChart(xlabels, chartData, xlabel, name);

      } else {
        console.log("File not found");
      }
  } catch (error) {
    console.error("Chyba při načítání:", error);
  } finally {
    hideSpinner();
    dailyChartCanvas.scrollIntoView({behavior: "smooth"});
  }
  
});

logOutButton.addEventListener("click", () => {
  Swal.fire({
    title: "Do you realy want to Log Out?",
    icon: "question",
    showDenyButton: true,
    confirmButtonText: "Yes",
    denyButtonText: `Don't Log Out`,
    customClass: {
      confirmButton: "swal-confirm-btn",
      denyButton: "swal-deny-btn",
    }
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

// Manual entry logika
manualEntryButton.addEventListener("click", () => {
  changeScreen([navPanel, manualEntry]);
});

manualEntryForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    let isTokenValid = await verifyToken(token);

    if (!isTokenValid) {
      try {
        const accessToken = await signInAndGetToken();
        console.log("Přihlášení úspěšné, token získán: " + accessToken);
        isTokenValid = true;
      } catch (error) {
        console.error("Přihlášení selhalo: ", error);
        changeScreen([navPanel, timerSettings]);
        return;
      }
    }
    showSpinner();

    let totalFocusTimeInput = document.getElementById("manualTotalFocusTime") as HTMLInputElement;
    let dateInput = document.getElementById("manualDate") as HTMLInputElement;
    let taskTypeInput = document.getElementById("manualTaskType") as HTMLSelectElement;
    const totalFocusTime: number = parseInt(totalFocusTimeInput.value, 10);
    const date = dateInput.value;
    const taskType = taskTypeInput.value;

    // console.log(totalFocusTime);
    //console.log(taskType);
    // console.log(date);

    const fileId = await findFileOnGoogleDrive(token, 'pomodioSessionData.json');
  
    if (fileId) {
      const res = await downloadFileFromGoogleDrive(token, fileId);
      console.log("File found and downloaded, updating file ...");
      
      updateSessionData(res, taskType, totalFocusTime, date);
      res.taskTypes[taskType].days.sort((a: Day, b: Day) => new Date(a.date).getTime() - new Date(b.date).getTime());

      console.log(res);

      const updatedFile = new File([JSON.stringify(res, null, 2)], 'pomodioSessionData.json', { type: "application/json" });
      return await updateFileOnGoogleDrive(token, fileId, updatedFile);

    } else {
      console.log("File not found, creating new one ...");

      // Inicializace prázného objektu sessionData pro následné naplnění a upload
      const sessionData = {
        taskTypes: tasksString.reduce( (acc: TaskTypeAccumulator, taskType: string) => {
          acc[taskType] = {
            taskType,
            totalFocusTime: 0,
            days: []
          };
          return acc;
        }, {} as TaskTypeAccumulator),
      };

      updateSessionData(sessionData, taskType, totalFocusTime, date);
      return await createNewFileOnGoogleDrive(token, 'pomodioSessionData.json', sessionData);
    }

  } catch (error) {
    console.error("Chyba při načítání:", error);
  } finally {
    hideSpinner();
  }

});

let isPaused = false;

// Implementace Google Drive handling logiky
const updateSessionData = function(sessionData: any, taskType: string, focusTime: number, date: string) {
  const task = sessionData.taskTypes[taskType];

  if (task) {
    task.totalFocusTime += focusTime;

    type day = {
      date: string,
      minutes:  number
    }

    type days = Array<day>

    const days: days = sessionData.taskTypes[taskType].days;
    const day = days.find(day => day.date == date);

    if (day) {
      day.minutes += focusTime;
    } else {
      task.days.push({date, minutes: focusTime});  
    }

  } else {
    console.log("Task not found when updating data ...");
  }
    
}

const createNewFileOnGoogleDrive = async function(accessToken: string, fileName: string, fileContent: object) {
  const metadata = {
    name: fileName,
    mimeType: "appliaction/json"
  };

  const fileBlob = new Blob([JSON.stringify(fileContent, null, 2)], { type: "application/json" });

  const form = new FormData();
  form.append("metadata", new Blob([JSON.stringify(metadata)], { type: "application/json" }));
  form.append("file", fileBlob);

  const response = await fetch("https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: form
  });

  if (!response.ok) {
    throw new Error('Failed to upload file to google drive: ' + response.statusText);
  }

  const res = await response.json();
  console.log('File uploaded successfully: ' + res);
  return res;
}

const findFileOnGoogleDrive = async function (accessToken: string, fileName: string) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files?q=name='${fileName}'&fields=files(id,name)`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }          
  });

  if (!response.ok) {
    throw new Error(`Failed to search file: ${response.statusText}`);
  }

  const data = await response.json();
  const file = data.files && data.files.length > 0 ? data.files[0] : null;

  if (file) {
    return file.id
  } else {
    return null
  }

}

const downloadFileFromGoogleDrive = async function(accessToken: string, fileId: string) {
  const response = await fetch(`https://www.googleapis.com/drive/v3/files/${fileId}?alt=media`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    throw new Error(`Failed to download file: ${response.statusText}`);
  }

  const data = await response.json();
  return data;

}

const updateFileOnGoogleDrive = async function(accessToken: string, fileId: string, file: File) {
  const response = await fetch('https://www.googleapis.com/upload/drive/v3/files/'+ fileId +'?uploadType=media', {
    method: "PATCH",
    headers: {
      Authorization: "Bearer " + accessToken,
      "Content-Type": file.type
    },
    body: file
  });

  if (!response.ok) {
    throw new Error("Failed to upload file to Google Drive: " + response.statusText);
  }

  const result = await response.json();
  console.log("File uploaded on Google Drive successfully: ", result);
  return result;
}

const handleGoogleDriveFile = async function(accessToken: string, fileName: string, data: object, settings: TimerSettings) {
  
  let isTokenValid = await verifyToken(accessToken);

  if (!isTokenValid) {
    const result = await Swal.fire({
      title: "You need to log in again to save data on Google Drive.",
      showDenyButton: false,
      showCancelButton: true,
      confirmButtonText: "Log in",
    });

    if (result.isConfirmed) {
      
      try {
        accessToken = await signInAndGetToken();
        console.log("Přihlášení úspěšné, token získán: " + token);
        isTokenValid = true;
      } catch (error) {
        console.error("Přihlášení selhalo: ", error);
        changeScreen([navPanel, timerSettings]);
        return;
      }

    } else {
      console.log("User canceled login.");
      changeScreen([navPanel, timerSettings]);
      return;
    }
  }

  const fileId = await findFileOnGoogleDrive(accessToken, fileName);
  
  if (fileId) {
    const res = await downloadFileFromGoogleDrive(accessToken, fileId);
    console.log("File found and downloaded, updating file ...");
    updateSessionData(res, settings.taskType, (settings.focusTime * settings.sections), new Date().toISOString().split('T')[0] );

    console.log(res);

    const updatedFile = new File([JSON.stringify(res, null, 2)], fileName, { type: "application/json" });
    return await updateFileOnGoogleDrive(accessToken, fileId, updatedFile);

  } else {
    createNewFileOnGoogleDrive(accessToken, fileName, data);
    return ("File not found, creating new one ...")
  }

}

// Timer setup and logic
const startPomodoroTimer = function(settings: TimerSettings): void {
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

  const updateTimer = function(): void {

    if (isFocus) {
      totalFocusTime++;
    } else {
      totalBreakTime++;
    }

    const formatTime = function(seconds: number): string {
      let mins = Math.floor(seconds / 60);
      let secs = seconds % 60;
      return `${mins}:${secs.toString().padStart(2, "0")}`;
    }

    // Ukončení session a upload dat na disk
    const completeSession = function(): void {
      isPomodoro = false;

      console.log("Pomodoro finished!");
      if (timerDisplay) {
        timerDisplay.textContent = `Pomodoro finished! 🥳`;
      }

      if (focusBreakDisplay) {
        focusBreakDisplay.textContent = ``;
      }

      document.title = `Pomodoro finished! 🥳`;
      
      const sound = document.getElementById('finished-timer-audio') as HTMLAudioElement;
      sound.play().catch(error => console.error("Audio cannot be played: ", error));

      // Inicializace prázného objektu sessionData pro následné naplnění a upload
      const sessionData = {
        taskTypes: tasksString.reduce( (acc: TaskTypeAccumulator, taskType: string) => {
          acc[taskType] = {
            taskType,
            totalFocusTime: 0,
            days: []
          };
          return acc;
        }, {} as TaskTypeAccumulator),
      };

      // Zde byla implementace google drive logiky

      updateSessionData(sessionData, settings.taskType, (settings.focusTime * settings.sections), new Date().toISOString().split('T')[0] );
      //console.log(sessionData);
      //createNewFileOnGoogleDrive(token, "pomodioSessionData.json", sessionData);
      handleGoogleDriveFile(token, "pomodioSessionData.json", sessionData, settings)
        .then(result => console.log("Operation successful: ", result))
        .catch(error => console.log("Operation failed: ", error));

    }

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

// Dashboard and charts
const createBarChart = function(xlabels: Array<string>, chartData: Array<number>, xlabel: string, name: string){

  if (barChartCanvas) {
    if (currentBarChart) {
      currentBarChart.destroy();
    }
    // Data a konfigurace grafu
    const data = {
      labels: xlabels,
      datasets: [
        {
          label: xlabel,
          data: chartData,
          backgroundColor: '#6F2BF6',
          borderColor: '#6F2BF6',
          borderWidth: 1,
        },
      ],
    };
  
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: name,
            font: {
              size: 18, // Nastavení velikosti fontu pro název
            },
            color: '#ffffff', // Barva fontu názvu grafu
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff', // Barva fontu pro osu X
              font: {
                size: 12, // Velikost fontu pro osu X
              },
            },
            grid: {
              display: false, // Skrytí grid lines pro osu X
            },
          },
          y: {
            ticks: {
              color: '#ffffff', // Barva fontu pro osu Y
              font: {
                size: 12, // Velikost fontu pro osu Y
              },
            },
            grid: {
              display: false, // Skrytí grid lines pro osu Y
            },
          },
        },
      },
    };
  
    // Vytvoření grafu
    currentBarChart = new Chart(barChartCanvas, config);
  }
}

const createDailyChart = function(xlabels: Array<string>, chartData: Array<number>, xlabel: string, name: string){

  if (dailyChartCanvas) {
    if (currentDailyChart) {
      currentDailyChart.destroy();
    }
    // Data a konfigurace grafu
    const data = {
      labels: xlabels,
      datasets: [
        {
          label: xlabel,
          data: chartData,
          backgroundColor: '#6F2BF6',
          borderColor: '#6F2BF6',
          borderWidth: 1,
        },
      ],
    };
  
    const config: ChartConfiguration<'bar'> = {
      type: 'bar',
      data,
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          title: {
            display: true,
            text: name,
            font: {
              size: 18, // Nastavení velikosti fontu pro název
            },
            color: '#ffffff', // Barva fontu názvu grafu
          },
          tooltip: {
            enabled: true,
          },
        },
        scales: {
          x: {
            ticks: {
              color: '#ffffff', // Barva fontu pro osu X
              font: {
                size: 12, // Velikost fontu pro osu X
              },
            },
            grid: {
              display: false, // Skrytí grid lines pro osu X
            },
          },
          y: {
            ticks: {
              color: '#ffffff', // Barva fontu pro osu Y
              font: {
                size: 12, // Velikost fontu pro osu Y
              },
            },
            grid: {
              display: false, // Skrytí grid lines pro osu Y
            },
          },
        },
      },
    };
  
    // Vytvoření grafu
    currentDailyChart = new Chart(dailyChartCanvas, config);
  }

}

// Initialize screens
const initApp = function(): void {
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
