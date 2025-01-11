const CLIENT_ID = '31392427339-gqekuarpqa8ah4n3nb4nka6v9gqgbk4d.apps.googleusercontent.com';
const API_KEY = 'AIzaSyBLh651BCPXAdrFPs8n4zE8iZV9f2JhbG4';
const DISCOVERY_DOC = 'https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest';
const SCOPES = 'https://www.googleapis.com/auth/calendar';

let tokenClient;
let gapiInited = false;
let gisInited = false;

document.getElementById('authorize_button').style.visibility = 'hidden';
document.getElementById('signout_button').style.display = 'none';

function gapiLoaded() {
    gapi.load('client', initializeGapiClient);
}

async function initializeGapiClient() {
    await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: [DISCOVERY_DOC],
    });
    gapiInited = true;
    maybeEnableButtons();
}

function gisLoaded() {
    tokenClient = google.accounts.oauth2.initTokenClient({
        client_id: CLIENT_ID,
        scope: SCOPES,
        callback: (resp) => {
            if (resp.error !== undefined) {
                throw resp;
            }
            document.getElementById('signout_button').style.visibility = 'visible';
            document.getElementById('authorize_button').innerText = 'Refresh';
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            displayUserEmail();
        },
    });
    gisInited = true;
    maybeEnableButtons();
}


function maybeEnableButtons() {
    if (gapiInited && gisInited) {
        const token = gapi.client.getToken();
        if (token) {
            document.getElementById('authorize_button').style.visibility = 'hidden';
            document.getElementById('signout_button').style.visibility = 'visible';
            document.getElementById('auth-container').style.display = 'none';
            document.getElementById('app-container').style.display = 'block';
            displayUserEmail();
        } else {
            document.getElementById('authorize_button').style.visibility = 'visible';
        }
    }
}

function handleAuthClick() {
    tokenClient.requestAccessToken({ prompt: '' });
}

function handleSignoutClick() {
    const token = gapi.client.getToken();
    if (token !== null) {
        google.accounts.oauth2.revoke(token.access_token, () => {
            gapi.client.setToken('');
            document.getElementById('authorize_button').innerText = 'Authorize';
            document.getElementById('signout_button').style.visibility = 'hidden';
            document.getElementById('auth-container').style.display = 'block';
            document.getElementById('app-container').style.display = 'none';
        });
    }
}

async function displayUserEmail() {
    try {
        const response = await gapi.client.request({
            path: 'https://www.googleapis.com/oauth2/v3/userinfo',
        });
        const email = response.result.email;
        const emailElement = document.getElementById('user-email');
        emailElement.textContent = `Signed in as: ${email}`;
    } catch (error) {
        console.error('Error fetching user email:', error);
    }
}

function showNotification(message, type = 'info') {
  const container = document.getElementById('notification-container');

  const notification = document.createElement('div');
  notification.classList.add('notification');
  if (type === 'success') {
      notification.style.backgroundColor = '#28a745'; // Zelená pro úspěch
  } else if (type === 'error') {
      notification.style.backgroundColor = '#dc3545'; // Červená pro chybu
  }

  notification.textContent = message;
  container.appendChild(notification);

  // Odstranit zprávu po 5 sekundách
  setTimeout(() => {
      container.removeChild(notification);
  }, 5000);
}

// Save tasks to localStorage
function saveTasksToLocalStorage() {
  const tasks = [];
  const existingEventIds = new Set(); 
  
  document.querySelectorAll('#task-list li').forEach((task) => {
      const eventId = task.getAttribute('data-event-id');

      if (existingEventIds.has(eventId)) {
          return;
      }

      existingEventIds.add(eventId); 
      tasks.push({
          text: task.querySelector('.task-text').textContent,
          eventId: task.getAttribute('data-event-id'),
          deadline: task.getAttribute('data-deadline'),
          completed: task.classList.contains('completed'),
          note: task.getAttribute('data-note') || '',
          priority: parseInt(task.getAttribute('data-priority')) || 3,
      });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

// Load tasks from localStorage
function loadTasksFromLocalStorage() {
  const taskList = document.getElementById('task-list');
  taskList.innerHTML = ''; 

  const tasks = JSON.parse(localStorage.getItem('tasks')) || []; 
  tasks.forEach((task) => {
      const deadline = new Date(task.deadline);
      const note = task.note || '';
      const priority = parseInt(task.priority) || 3;
      addTaskToDOM(task.text, task.eventId, deadline, task.note || '', parseInt(task.priority) || 3);

      if (task.completed) {
          const lastTask = document.querySelector('#task-list li:last-child');
          lastTask.classList.add('completed');
          lastTask.querySelector('.completion-circle').classList.add('completed');
      }
  });
}

// Add task to Google Calendar and DOM
async function addTask(taskText, deadline, note, priority) {
  const event = {
      summary: taskText,
      description: note,
      start: {
          dateTime: deadline.toISOString(),
          timeZone: 'UTC',
      },
      end: {
          dateTime: deadline.toISOString(),
          timeZone: 'UTC',
      },
  };

  try {
      const response = await gapi.client.calendar.events.insert({
          calendarId: 'primary',
          resource: event,
      });
      console.log('Event created:', response.result);

      addTaskToDOM(taskText, response.result.id, deadline, note, priority);
      showNotification('Event successfully added to Google Calendar!', 'success');
    } catch (error) {
      console.error('Error creating event:', error);
      showNotification('Failed to add event to Google Calendar.', 'error');
  }
}

// Delete task from Google Calendar and DOM
async function deleteTaskFromCalendar(eventId, taskElement) {
    if (!eventId) {
            taskElement.remove();
            saveTasksToLocalStorage();
            showNotification('Task successfully deleted!', 'success');
            return;
    }

    try {
            await gapi.client.calendar.events.delete({
                    calendarId: 'primary',
                    eventId: eventId,
            });
            console.log('Event deleted:', eventId);
            showNotification('Task successfully deleted from Google Calendar!', 'success');
            taskElement.remove();
            saveTasksToLocalStorage();
    } catch (error) {
            console.error('Error deleting event from Google Calendar:', error);
            showNotification('Failed to delete task from Google Calendar.', 'error');
    }
}

// Filter tasks based on completion status
function filterTasks(filterOption) {
  const tasks = document.querySelectorAll('#task-list li'); 

  tasks.forEach((task) => {
      const isCompleted = task.classList.contains('completed'); 
      task.style.display = ''; 

      if (filterOption === 'completed' && !isCompleted) {
          task.style.display = 'none';
      } else if (filterOption === 'incomplete' && isCompleted) {
          task.style.display = 'none';
      }
  });
}

// Filter tasks based on date
function filterTasksByDate(date) {
    const tasks = document.querySelectorAll('#task-list li');

    tasks.forEach((task) => {
        const taskDate = new Date(task.getAttribute('data-deadline')).toISOString().split('T')[0];
        task.style.display = '';

        if (taskDate !== date) {
            task.style.display = 'none';
        }
    });
}

// Sort tasks by priority
let sortAscending = true;

function sortTasksByPriority() {
  const taskList = document.getElementById('task-list');
  const tasks = Array.from(taskList.children);

  tasks.sort((a, b) => {
      const priorityA = parseInt(a.getAttribute('data-priority')) || 3;
      const priorityB = parseInt(b.getAttribute('data-priority')) || 3;
      return sortAscending ? priorityA - priorityB : priorityB - priorityA;
  });

  // Vyprázdnit seznam úkolů a znovu přidat seřazené úkoly
  taskList.innerHTML = '';
  tasks.forEach(task => taskList.appendChild(task));

  // Přepnout režim třídění pro další kliknutí
  sortAscending = !sortAscending;

  // Aktualizovat ikonu tlačítka podle režimu
  const sortButtonIcon = document.querySelector('#sort-priority-btn i');
  if (sortAscending) {
      sortButtonIcon.classList.remove('fa-sort-amount-up');
      sortButtonIcon.classList.add('fa-sort-amount-down');
  } else {
      sortButtonIcon.classList.remove('fa-sort-amount-down');
      sortButtonIcon.classList.add('fa-sort-amount-up');
  }
}

// Add task to the DOM
function addTaskToDOM(taskText, eventId, deadline, note = '', priority = 3) {
    const taskList = document.getElementById('task-list');

    const li = document.createElement('li');
    li.setAttribute('data-event-id', eventId);
    li.setAttribute('data-deadline', deadline.toISOString());
    li.setAttribute('data-note', note);
    li.setAttribute('data-priority', priority);

    const completionCircle = document.createElement('span');
    completionCircle.classList.add('completion-circle');
    completionCircle.addEventListener('click', () => {
        completionCircle.classList.toggle('completed');
        li.classList.toggle('completed');

        saveTasksToLocalStorage();
    });

    // Task text (přidá deadline pouze jednou)
    const taskTextSpan = document.createElement('span');
    taskTextSpan.classList.add('task-text');

    // Kontrola, zda již text obsahuje deadline (při načítání z localStorage)
    const formattedDeadline = `${deadline.toLocaleDateString()} ${deadline.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
    if (!taskText.includes(formattedDeadline)) {
        taskText += ` (${formattedDeadline})`; 
    }

    taskTextSpan.textContent = taskText;

    // Zobrazení priority
    const priorityDisplay = document.createElement('span');
    priorityDisplay.classList.add('priority-display');
    priorityDisplay.textContent = `Priority: ${priority}`;
    
   // Ikona pro poznámku
   const infoIcon = document.createElement('button');
   infoIcon.classList.add('info-icon');
   infoIcon.innerHTML = 'ℹ️';
   infoIcon.title = 'Show Note';

   infoIcon.addEventListener('click', () => {
       noteContainer.classList.toggle('visible'); 
  }); 

   // Kontejner pro poznámku
   const noteContainer = document.createElement('div');
   noteContainer.classList.add('note-container', 'hidden'); 
   noteContainer.textContent = note || 'Add your note here'; 

   // Po kliknutí na text poznámky se zobrazí prompt pro úpravu
   noteContainer.addEventListener('click', () => {
       const newNote = prompt('Edit note (max 80 characters):', note);
       if (newNote !== null) {
           const trimmedNote = newNote.substring(0, 80);
           note = trimmedNote; 
           noteContainer.textContent = note || 'Add your note here'; 
           li.setAttribute('data-note', note); 
           saveTasksToLocalStorage(); 
       }
   });

    // Smazání úkolu
    const deleteBtn = document.createElement('button');
    deleteBtn.classList.add('delete-btn');
    deleteBtn.textContent = 'Delete';
    deleteBtn.addEventListener('click', () => {
        const eventId = li.getAttribute('data-event-id');
        deleteTaskFromCalendar(eventId, li);
    });

    li.appendChild(completionCircle);
    li.appendChild(taskTextSpan);
    li.appendChild(priorityDisplay);
    li.appendChild(deleteBtn);
    const wrapperDiv = document.createElement('div');
      wrapperDiv.style.width = "100%";
      wrapperDiv.appendChild(infoIcon);
      wrapperDiv.appendChild(noteContainer);
    li.appendChild(wrapperDiv); 
    taskList.appendChild(li);

    saveTasksToLocalStorage(); 
}

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
  const sortPriorityBtn = document.getElementById('sort-priority-btn');
  const priorityIcon = document.getElementById('priority-icon');
  const taskPriorityInput = document.getElementById('task-priority');
  const taskDateInput = document.getElementById('task-date');
  const taskTimeInput = document.getElementById('task-time');
  const calendarIcon = document.getElementById('calendar-icon');
  const timeIcon = document.getElementById('time-icon');
  const addTaskBtn = document.getElementById('add-task-btn');
  const taskInput = document.getElementById('new-task');
  const taskFilter = document.getElementById('task-filter');
  const dateFilter = document.getElementById('date-filter');

  loadTasksFromLocalStorage();

  sortPriorityBtn.addEventListener('click', sortTasksByPriority);
  sortPriorityBtn.title = 'Sort tasks by priority';
 

  priorityIcon.addEventListener('click', () => {
      taskPriorityInput.classList.toggle('hidden'); 
      taskPriorityInput.focus(); 
  });
  priorityIcon.title = 'Set task priority';

  calendarIcon.addEventListener('click', () => {
      taskDateInput.classList.toggle('hidden');
      taskDateInput.focus();
  });
  calendarIcon.title = 'Set task date';

  timeIcon.addEventListener('click', () => {
      taskTimeInput.classList.toggle('hidden');
      taskTimeInput.focus();
  });
  timeIcon.title = 'Set task time';

  addTaskBtn.addEventListener('click', () => {
      const taskText = taskInput.value.trim();
      const taskDate = taskDateInput.value;
      const taskTime = taskTimeInput.value || '12:00';
      const taskPriority = parseInt(taskPriorityInput.value);

    if (taskText === '') {
        showNotification('Task cannot be empty!', 'error');
        return;
    }

    if (!taskDate) {
        showNotification('Please provide a date!', 'error');
        return;
    }

    if (isNaN(taskPriority) || taskPriority < 1 || taskPriority > 5) {
        showNotification('Please provide a priority between 1 and 5.', 'error');
        return;
      }

      const deadline = new Date(`${taskDate}T${taskTime}:00`);

      addTask(taskText, deadline, '', taskPriority);

      taskInput.value = '';
      taskDateInput.value = '';
      taskTimeInput.value = '';
      taskPriorityInput.value = '';
      taskDateInput.classList.add('hidden');
      taskTimeInput.classList.add('hidden');
      taskPriorityInput.classList.add('hidden');
  });

  taskFilter.addEventListener('change', (event) => {
      const filterOption = event.target.value;
      filterTasks(filterOption);
  });

    dateFilter.addEventListener('change', (event) => {
        const selectedDate = event.target.value;
        filterTasksByDate(selectedDate);
    });
});