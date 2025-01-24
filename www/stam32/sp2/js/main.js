document.addEventListener('DOMContentLoaded', () => {
  // Store all elements in variables
  const elements = {
    taskInput: document.getElementById('task'),
    taskDateInput: document.getElementById('task-date'),
    taskTimeInput: document.getElementById('task-time'),
    taskDescriptionInput: document.getElementById('task-description'),
    addTaskButton: document.getElementById('add-task'),
    taskList: document.getElementById('task-list'),
    syncCalendarButton: document.getElementById('sync-calendar'),
    authButton: document.getElementById('auth-button'),
    spinner: document.getElementById('spinner'),
    modal: document.getElementById('delete-confirm-modal'),
    confirmDeleteButton: document.getElementById('confirm-delete'),
    cancelDeleteButton: document.getElementById('cancel-delete'),
    notificationContainer: document.getElementById('notification-container'),
    taskCountSpan: document.querySelector('#task-count span'),
    currentDateSpan: document.querySelector('#current-date span'),
    dateFilter: document.getElementById('date-filter'),
  };

  let tokenClient;
  let accessToken = null;
  let gapiLoaded = false;
  let isSignedIn = false;
  let userLocation = null;
  let taskToDelete = null;
  let taskBeingEdited = null;

  const CLIENT_ID = '854096754385-hd86cp5llfgsq7r11gqlam9nl9k8odhr.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDH6184rvbg0xHaZy8d6kfCIhMarLpdL2s';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
  const TIMEZONE = 'Europe/Paris';

  const updateTaskCount = () => {
    elements.taskCountSpan.textContent = elements.taskList.children.length;
  };

  const setCurrentDate = () => {
    const today = new Date();
    elements.currentDateSpan.textContent = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showNotification = (message, type = 'success') => {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    elements.notificationContainer.appendChild(notification);

    setTimeout(() => {
      notification.remove();
    }, 3000);
  };

  const initGoogleIdentityServices = () => {
    tokenClient = google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (response) => {
        if (response.error) {
          console.error('Authentication error:', response.error);
          return;
        }
        accessToken = response.access_token;
        isSignedIn = true;
        updateAuthUI();
        loadTasksFromGoogleCalendar();
      },
    });

    elements.authButton.addEventListener('click', async () => {
      if (isSignedIn) {
        google.accounts.oauth2.revoke(accessToken, () => {
          accessToken = null;
          isSignedIn = false;
          updateAuthUI();
          elements.taskList.innerHTML = '';
          updateTaskCount();
          showNotification('You have signed out successfully.', 'success');
        });
      } else {
        tokenClient.requestAccessToken();
      }
    });
  };

  const updateAuthUI = () => {
    elements.authButton.textContent = isSignedIn ? 'Sign Out' : 'Sign In';
    elements.addTaskButton.disabled = !isSignedIn;
    elements.syncCalendarButton.disabled = !isSignedIn;
  };

  const loadGoogleCalendarAPI = async () => {
    await gapi.load('client', async () => {
      await gapi.client.init({
        apiKey: API_KEY,
        discoveryDocs: ['https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest'],
      });
      gapiLoaded = true;
    });
  };

  const fetchUserLocation = () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          userLocation = `${position.coords.latitude},${position.coords.longitude}`;
        },
        (error) => {
          console.error('Error fetching location:', error.message);
          userLocation = null;
        }
      );
    }
  };

  const createCalendarEvent = async (taskText, taskDate, taskTime, description = '') => {
    if (!accessToken) {
      showNotification('Please sign in to sync tasks.', 'error');
      return null;
    }

    const startDateTime = new Date(`${taskDate}T${taskTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 3600000);

    const event = {
      summary: taskText,
      description,
      location: userLocation || 'Unknown Location',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: TIMEZONE,
      },
    };

    try {
      const response = await gapi.client.calendar.events.insert({
        calendarId: 'primary',
        resource: event,
      });
      if (response.status === 200) {
        showNotification('Task successfully synced with Google Calendar.', 'success');
        return response.result.id;
      }
    } catch (error) {
      console.error('Error creating calendar event:', error);
      showNotification('Failed to sync task to Google Calendar.', 'error');
      return null;
    }
  };

  const loadTasksFromGoogleCalendar = async () => {
    if (!gapiLoaded || !isSignedIn) return;

    showSpinner();
    try {
      const response = await gapi.client.calendar.events.list({
        calendarId: 'primary',
        timeMin: new Date().toISOString(),
        showDeleted: false,
        singleEvents: true,
        orderBy: 'startTime',
      });

      const events = response.result.items;
      const fragment = document.createDocumentFragment();

      events.forEach((event) => {
        if (event.summary && event.start.dateTime) {
          const existingTask = Array.from(elements.taskList.children).find(
            (task) => task.getAttribute('data-event-id') === event.id
          );

          if (existingTask) {
            return;
          }

          const eventDate = new Date(event.start.dateTime).toISOString().split('T')[0];
          const eventTime = new Date(event.start.dateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const description = event.description || '';
          const li = document.createElement('li');

          const taskSpan = document.createElement('span');
          taskSpan.className = 'task-text';
          taskSpan.textContent = `${event.summary} (${eventDate} at ${eventTime})`;

          const descriptionSpan = document.createElement('span');
          descriptionSpan.className = 'task-description';
          descriptionSpan.textContent = description;

          const deleteButton = document.createElement('button');
          deleteButton.textContent = 'Delete';
          deleteButton.className = 'delete-task';

          const editButton = document.createElement('button'); // Add Edit button
          editButton.textContent = 'Edit';
          editButton.className = 'edit-task';

          li.appendChild(taskSpan);
          if (description) li.appendChild(descriptionSpan);
          li.appendChild(editButton);
          li.appendChild(deleteButton);

          li.setAttribute('data-event-id', event.id);
          li.setAttribute('data-date', eventDate);
          fragment.appendChild(li);
        }
      });

      elements.taskList.appendChild(fragment);
    } catch (error) {
      console.error('Error loading events from Google Calendar:', error);
    } finally {
      hideSpinner();
    }
  };

  const deleteCalendarEvent = async (eventId) => {
    if (!gapiLoaded || !isSignedIn || !eventId) return;

    try {
      await gapi.client.calendar.events.delete({
        calendarId: 'primary',
        eventId,
      });
      showNotification('Task deleted successfully.', 'success');
    } catch (error) {
      console.error('Error deleting event from Google Calendar:', error);
      showNotification('Failed to delete task.', 'error');
    }
  };

  const addTaskToDOM = (taskText, taskDate, taskTime, description = '', eventId = null) => {
    const li = document.createElement('li');
    li.setAttribute('data-date', taskDate);

    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = `${taskText} (${taskDate} at ${taskTime})`;

    const descriptionSpan = document.createElement('span');
    descriptionSpan.className = 'task-description';
    descriptionSpan.textContent = description;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-task';

    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.className = 'edit-task';

    li.appendChild(taskSpan);
    if (description) li.appendChild(descriptionSpan);
    li.appendChild(editButton);
    li.appendChild(deleteButton);

    if (eventId) {
      li.setAttribute('data-event-id', eventId);
    }

    elements.taskList.appendChild(li);
    updateTaskCount();
  };

  const filterTasksByDate = (selectedDate) => {
    const tasks = Array.from(elements.taskList.children);
    tasks.forEach((task) => {
      const taskDate = task.getAttribute('data-date');
      if (taskDate === selectedDate || !selectedDate) {
        task.style.display = '';
      } else {
        task.style.display = 'none';
      }
    });
  };

  elements.addTaskButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const taskText = elements.taskInput.value.trim();
    const taskDate = elements.taskDateInput.value;
    const taskTime = elements.taskTimeInput.value;
    const taskDescription = elements.taskDescriptionInput.value.trim();

    if (!taskText || !taskDate || !taskTime) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    if (taskBeingEdited) {
      const taskTextSpan = taskBeingEdited.querySelector('.task-text');
      const taskDescriptionSpan = taskBeingEdited.querySelector('.task-description');

      taskTextSpan.textContent = `${taskText} (${taskDate} at ${taskTime})`;

      if (taskDescription) {
        if (!taskDescriptionSpan) {
          const newDescriptionSpan = document.createElement('span');
          newDescriptionSpan.className = 'task-description';
          newDescriptionSpan.textContent = taskDescription;
          taskBeingEdited.appendChild(newDescriptionSpan);
        } else {
          taskDescriptionSpan.textContent = taskDescription;
        }
      } else if (taskDescriptionSpan) {
        taskDescriptionSpan.remove();
      }


      const eventId = taskBeingEdited.getAttribute('data-event-id');
      if (eventId) {
        await updateCalendarEvent(eventId, taskText, taskDate, taskTime, taskDescription);
      }

      showNotification('Task updated successfully!', 'success');
      taskBeingEdited = null;
      elements.addTaskButton.textContent = 'Add Task';
    } else {

      const eventId = await createCalendarEvent(taskText, taskDate, taskTime, taskDescription);
      addTaskToDOM(taskText, taskDate, taskTime, taskDescription, eventId);
      showNotification('Task added successfully!', 'success');
    }


    elements.taskInput.value = '';
    elements.taskDateInput.value = '';
    elements.taskTimeInput.value = '';
    elements.taskDescriptionInput.value = '';
  });

  elements.taskList.addEventListener('click', (e) => {
    if (e.target.classList.contains('edit-task')) {
      const li = e.target.parentElement;


      taskBeingEdited = li;


      const taskText = li.querySelector('.task-text').textContent.split(' (')[0];
      const taskDate = li.getAttribute('data-date');
      const taskTime = li.querySelector('.task-text').textContent.match(/\d{2}:\d{2}/)?.[0];
      const taskDescription = li.querySelector('.task-description')?.textContent || '';

      elements.taskInput.value = taskText;
      elements.taskDateInput.value = taskDate;
      elements.taskTimeInput.value = taskTime || '';
      elements.taskDescriptionInput.value = taskDescription;


      elements.addTaskButton.textContent = 'Save Task';
    }

    if (e.target.classList.contains('delete-task')) {
      const li = e.target.parentElement;
      taskToDelete = li;
      elements.modal.classList.remove('hidden');
    }
  });

  elements.syncCalendarButton.addEventListener('click', async () => {
    await loadTasksFromGoogleCalendar();
    showNotification('Task successfully synced with Google Calendar.', 'success');
  });

  elements.dateFilter.addEventListener('input', (e) => {
    const selectedDate = e.target.value;
    filterTasksByDate(selectedDate);
  });

  const showSpinner = () => {
    elements.spinner.style.display = 'block';
  };

  const hideSpinner = () => {
    elements.spinner.style.display = 'none';
  };

  elements.confirmDeleteButton.addEventListener('click', async () => {
    if (taskToDelete) {
      const eventId = taskToDelete.getAttribute('data-event-id');
      if (eventId) {
        await deleteCalendarEvent(eventId);
      }
      taskToDelete.remove();
      updateTaskCount();
    }
    taskToDelete = null;
    elements.modal.classList.add('hidden');
  });

  elements.cancelDeleteButton.addEventListener('click', () => {
    taskToDelete = null;
    elements.modal.classList.add('hidden');
  });

  const updateCalendarEvent = async (eventId, taskText, taskDate, taskTime, description = '') => {
    if (!accessToken) {
      showNotification('Please sign in to update tasks.', 'error');
      return;
    }

    const startDateTime = new Date(`${taskDate}T${taskTime}:00`);
    const endDateTime = new Date(startDateTime.getTime() + 3600000);

    const updatedEvent = {
      summary: taskText,
      description,
      location: userLocation || 'Unknown Location',
      start: {
        dateTime: startDateTime.toISOString(),
        timeZone: TIMEZONE,
      },
      end: {
        dateTime: endDateTime.toISOString(),
        timeZone: TIMEZONE,
      },
    };

    try {
      await gapi.client.calendar.events.update({
        calendarId: 'primary',
        eventId,
        resource: updatedEvent,
      });
      showNotification('Task successfully updated in Google Calendar.', 'success');
    } catch (error) {
      console.error('Error updating calendar event:', error);
      showNotification('Failed to update task in Google Calendar.', 'error');
    }
  };

  setCurrentDate();
  initGoogleIdentityServices();
  loadGoogleCalendarAPI();
  fetchUserLocation();
});
