document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.getElementById('task');
  const taskDateInput = document.getElementById('task-date');
  const taskTimeInput = document.getElementById('task-time');
  const taskDescriptionInput = document.getElementById('task-description');
  const addTaskButton = document.getElementById('add-task');
  const taskList = document.getElementById('task-list');
  const syncCalendarButton = document.getElementById('sync-calendar');
  const authButton = document.getElementById('auth-button');
  const spinner = document.getElementById('spinner');

  let tokenClient;
  let accessToken = null;
  let gapiLoaded = false;
  let isSignedIn = false;
  let userLocation = null;

  const CLIENT_ID = '854096754385-hd86cp5llfgsq7r11gqlam9nl9k8odhr.apps.googleusercontent.com';
  const API_KEY = 'AIzaSyDH6184rvbg0xHaZy8d6kfCIhMarLpdL2s';
  const SCOPES = 'https://www.googleapis.com/auth/calendar.events';
  const TIMEZONE = 'Europe/Paris';

  const updateTaskCount = () => {
    const taskCount = taskList.children.length;
    document.querySelector('#task-count span').textContent = taskCount;
  };

  const setCurrentDate = () => {
    const today = new Date();
    document.querySelector('#current-date span').textContent = today.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const showNotification = (message, type = 'success') => {
    const notificationContainer = document.getElementById('notification-container');

    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;

    notificationContainer.appendChild(notification);

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

    authButton.addEventListener('click', () => {
      if (isSignedIn) {
        google.accounts.oauth2.revoke(accessToken, () => {
          accessToken = null;
          isSignedIn = false;
          updateAuthUI();
          taskList.innerHTML = '';
          updateTaskCount();
          showNotification('You have signed out.', 'success');
        });
      } else {
        tokenClient.requestAccessToken();
      }
    });
  };

  const updateAuthUI = () => {
    authButton.textContent = isSignedIn ? 'Sign Out' : 'Sign In';
    addTaskButton.disabled = !isSignedIn;
    syncCalendarButton.disabled = !isSignedIn;
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
      taskList.innerHTML = '';
      events.forEach((event) => {
        if (event.summary && event.start.dateTime) {
          const eventDate = new Date(event.start.dateTime).toISOString().split('T')[0];
          const eventTime = new Date(event.start.dateTime).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
          });
          const description = event.description || '';
          addTaskToDOM(event.summary, eventDate, eventTime, description, event.id);
        }
      });
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

    const taskSpan = document.createElement('span');
    taskSpan.className = 'task-text';
    taskSpan.textContent = `${taskText} (${taskDate} at ${taskTime})`;

    const descriptionSpan = document.createElement('span');
    descriptionSpan.className = 'task-description';
    descriptionSpan.textContent = description;

    const deleteButton = document.createElement('button');
    deleteButton.textContent = 'Delete';
    deleteButton.className = 'delete-task';

    li.appendChild(taskSpan);
    if (description) li.appendChild(descriptionSpan);
    li.appendChild(deleteButton);

    if (eventId) {
      li.setAttribute('data-event-id', eventId);
    }

    taskList.appendChild(li);
    updateTaskCount();
  };

  addTaskButton.addEventListener('click', async (e) => {
    e.preventDefault();

    const taskText = taskInput.value.trim();
    const taskDate = taskDateInput.value;
    const taskTime = taskTimeInput.value;
    const taskDescription = taskDescriptionInput.value.trim();

    if (!taskText || !taskDate || !taskTime) {
      showNotification('Please fill in all fields.', 'error');
      return;
    }

    const eventId = await createCalendarEvent(taskText, taskDate, taskTime, taskDescription);
    addTaskToDOM(taskText, taskDate, taskTime, taskDescription, eventId);
    showNotification('Task added successfully!', 'success');

    taskInput.value = '';
    taskDateInput.value = '';
    taskTimeInput.value = '';
    taskDescriptionInput.value = '';
  });

  taskList.addEventListener('click', async (e) => {
    if (e.target.classList.contains('delete-task')) {
      const li = e.target.parentElement;
      const eventId = li.getAttribute('data-event-id');

      if (eventId) {
        await deleteCalendarEvent(eventId);
      }

      li.remove();
      updateTaskCount();
    }
  });

  syncCalendarButton.addEventListener('click', async () => {
    await loadTasksFromGoogleCalendar();
    showNotification('Task successfully synced with Google Calendar.', 'success');
  });

  const showSpinner = () => {
  spinner.style.display = 'block';
  };

  const hideSpinner = () => {
  spinner.style.display = 'none';
  };


  setCurrentDate();
  initGoogleIdentityServices();
  loadGoogleCalendarAPI();
  fetchUserLocation();
});
