const auth_link = `https://www.strava.com/oauth/token`;
const activities_link = `https://www.strava.com/api/v3/athlete/activities`;
const user_link = `https://www.strava.com/api/v3/athlete`;
const base_link = `https://www.strava.com/api/v3/`;
const searchResultsContainer = document.querySelector('#search-results');
const activityDetailsContainer = document.querySelector('#activity-details');
const authButton = document.querySelector('#auth_button');
const searchForm = document.querySelector('#search-form');

//calls strava api to get activities using access token passed as parameter
const getActivities = async (accessToken) => {
  const res = await fetch(activities_link, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });
  if (res.status !== 200) {
    throw new Error(res.status);
  }
  const data = await res.json();
  return data;
};
//calls strava api to get specific activity using access token and id both passed as parameters
const getActivity = async (accessToken, activityId) => {
  const res = await fetch(`${base_link}/activities/${activityId}`, {
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });
  if (res.status !== 200) {
    throw new Error(res.status);
  }
  const data = await res.json();
  return data;
};
//calls strava api to get athlete info using access token passed as parameter
const getAthlete = async (accessToken) => {
  const res = await fetch(user_link, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  });
  if (res.status !== 200) {
    throw new Error(res.status);
  }
  const data = await res.json();
  return data;
};
//calls strava api to get activity streams using access token, id, keys(stream type) and keybytype(Must be true) passed as parameter
const getActivityStreams = async (accessToken, activityId, keys = '', keyByType) => {
  const streamLink = `https://www.strava.com/api/v3/activities/${activityId}/streams?keys=${keys}&key_by_type=${keyByType}`;
  const res = await fetch(streamLink, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${accessToken}`
    },
  });

  const data = await res.json();
  return data;
};
//uses authorization code to get access token and refresh token
const useAuthorizationCode = async (code) => {
  if (code === null) {
    console.log("No code");
  }
  else {
    console.log("Using authorization code:", code);

    const res = await fetch("https://www.strava.com/oauth/token", {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: '141939',
        client_secret: 'a44c3c0d9468c1b78f4b918968f2f10a56446da8',
        code: code,
        grant_type: 'authorization_code',
      }),
    });
    const data = await res.json();
    return data;
  }
};
//stores access token and refresh token in cookies
const storeTokens = async (accessToken, refreshToken) => {
  document.cookie = `access_token=${accessToken};path=/; max-age=60*60*24*30`;
  document.cookie = `refresh_token=${refreshToken};path=/; max-age=60*60*24*30`;
}
//gets cookie value by name
function getCookie(cname) {
  let name = cname + "=";
  //remove special characters 
  let decodedCookie = decodeURIComponent(document.cookie);
  //split cookie on ;
  let ca = decodedCookie.split(';');
  //loop through ca array
  for (let i = 0; i < ca.length; i++) {
    //stores first value from array
    let c = ca[i];
    //removes spaces
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}
//--------------------MAP--------------------
const API_KEY = 'Vhu6awCwPFON-b8zzwSjwNcTdgyKBX73hDTCJjFdMq0';

/*
We create the map and set its initial coordinates and zoom.
See https://leafletjs.com/reference.html#map
*/
const map = L.map('map').setView([49.8729317, 14.8981184], 16);

/*
Then we add a raster tile layer with REST API Mapy.cz tiles
See https://leafletjs.com/reference.html#tilelayer
*/
L.tileLayer(`https://api.mapy.cz/v1/maptiles/basic/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
  minZoom: 0,
  maxZoom: 19,
  attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
}).addTo(map);

/*
We also require you to include our logo somewhere over the map.
We create our own map control implementing a documented interface,
that shows a clickable logo.
See https://leafletjs.com/reference.html#control
*/
const LogoControl = L.Control.extend({
  options: {
    position: 'bottomleft',
  },

  onAdd: function (map) {
    const container = L.DomUtil.create('div');
    const link = L.DomUtil.create('a', '', container);

    link.setAttribute('href', 'http://mapy.cz/');
    link.setAttribute('target', '_blank');
    link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" />';
    L.DomEvent.disableClickPropagation(link);

    return container;
  },
});

// finally we add our LogoControl to the map
new LogoControl().addTo(map);
//--------------------MAP--------------------
//renders user info based on data passed as parameter
const renderUser = async (data) => {
  data = await getAthlete(getCookie('access_token'));
  const userContainer = document.getElementById('user-info');
  const html = `

    <div class="card-body p-3">
      <div class="d-flex align-items-center gap-3">
        <div class="user-profile-picture">
          <img class="rounded-circle border shadow-sm" 
               width="50" 
               height="50" 
               src="${data.profile}" 
               alt="${data.username}'s profile picture"
               style="object-fit: cover;"
          >
        </div>
        <div class="text-start">
          <div class="fw-bold">${data.username}</div>
          <small class="text-muted">Strava Athlete</small>
        </div>
      </div>
    </div>`;
  userContainer.innerHTML = html;
};
//renders activites based on data(from search) passed as parameter
const renderActivitySearchResults = (results) => {
  const activities = results.map((result) => {
    const html = `<a href="#" class="list-group-item list-group-item-action">${result.name}</a>`;
    const activityContainer = document.createElement('div');
    activityContainer.innerHTML = html;

    const activityElement = activityContainer.firstElementChild;
    activityElement.addEventListener('click', async (e) => {
      e.preventDefault();
      searchResultsContainer.querySelectorAll('.list-group-item').forEach(item => {
        item.classList.remove('active');
      });
      activityElement.classList.add('active');

      renderActivityDetails(result);

      const streams = await getActivityStreams(getCookie('access_token'), result.id, 'time,distance,latlng', true);
      if (streams && streams.latlng && streams.latlng.data) {
        // Clear existing polylines
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });
        // Add new polyline
        const polyline = L.polyline(streams.latlng.data, { color: 'red' }).addTo(map);
        map.fitBounds(polyline.getBounds());
      }
      else {
        // remove polyline
        map.eachLayer((layer) => {
          if (layer instanceof L.Polyline) {
            map.removeLayer(layer);
          }
        });
      }
    });

    return activityElement;
  });

  searchResultsContainer.innerHTML = '';
  searchResultsContainer.append(...activities);
};
const formatTime = (seconds) => {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const remainingSeconds = seconds % 60;

  const parts = [];
  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0) parts.push(`${minutes}m`);
  if (remainingSeconds > 0) parts.push(`${remainingSeconds}s`);

  return parts.join(' ');
};
//renders activity details based on data passed as parameter
const renderActivityDetails = (data) => {
  const activityDetailsContainer = document.getElementById('activity-details');

  const dom = `
    <div class="card-body">
      <h5 class="card-title">${data.name}</h5>
      <div class="row g-3">
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Heart Rate</h6>
              <div class="d-flex justify-content-between">
                <div>
                  <small class="text-muted">Average</small>
                  <div class="h4 mb-0">${data.average_heartrate} <small>bpm</small></div>
                </div>
                <div>
                  <small class="text-muted">Max</small>
                  <div class="h4 mb-0">${data.max_heartrate} <small>bpm</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Speed</h6>
              <div class="d-flex justify-content-between">
                <div>
                  <small class="text-muted">Average</small>
                  <div class="h4 mb-0">${data.average_speed * 3.6} <small>km/h</small></div>
                </div>
                <div>
                  <small class="text-muted">Max</small>
                  <div class="h4 mb-0">${data.max_speed * 3.6} <small>km/h</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Distance</h6>
              <div class="h4 mb-0">${data.distance / 1000} <small>km</small></div>
            </div>
          </div>
        </div>
        
        <div class="col-md-6">
          <div class="card">
            <div class="card-body">
              <h6 class="card-subtitle mb-2 text-muted">Duration</h6>
              <div class="h4 mb-0">${formatTime(data.moving_time)}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;

  activityDetailsContainer.innerHTML = dom;
};
//reauthorizes user using refresh token
const reAuthorize = async (auth_link, Connect_Data) => {
  const res = await fetch(auth_link, {
    method: "POST",
    headers: {
      'Accept': 'application/json, text/plain, */*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      client_id: '141939',
      client_secret: 'a44c3c0d9468c1b78f4b918968f2f10a56446da8',
      refresh_token: `${Connect_Data.refresh_token}`,
      grant_type: 'refresh_token'
    })
  });
  const data = await res.json();
  return data;
};

// Load user activities using stored tokens
const loadUserActivities = async () => {
  const accessToken = getCookie('access_token');

  if (!accessToken) {
    console.log('No access token available');
    return;
  }

  try {
    const activities = await getActivities(accessToken);
    console.log(activities);
    if (activities.message !== "Authorization Error" && activities !== null) {
      renderActivitySearchResults(activities);

      if (activities.length > 0) {
        // Load and display the first activity
        const firstActivityId = activities[0].id;
        const streams = await getActivityStreams(accessToken, firstActivityId, 'time,distance,latlng', true);

        if (streams && streams.latlng) {
          const polyline = L.polyline(streams.latlng.data, { color: 'red' }).addTo(map);
          map.fitBounds(polyline.getBounds());
        }
      }
    }
  } catch (error) {
    console.error('Error loading activities: ' + error);
    if (error.message === '401') {
      const refreshToken = getCookie('refresh_token');
      //try to get new token
      if (refreshToken !== null && refreshToken !== "undefined") {
        try {
          const newAuthData = await reAuthorize(AUTH_CONFIG.tokenUrl, refreshToken);
          await storeTokens(newAuthData.access_token, newAuthData.refresh_token);
          // Try to load activities again
          await loadUserActivities();
        } catch (refreshError) {
          console.error('Error refreshing token: ' + refreshError);
        }
      }
    }
  }
};

// Handle the entire authentication flow
const handleAuthentication = async () => {
  // Check if code is in the URL
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');

  if (code) {
    try {
      // Exchange the code for tokens
      const connectData = await useAuthorizationCode(code);

      if (connectData && connectData.access_token) {
        // Store tokens
        await storeTokens(connectData.access_token, connectData.refresh_token);

        // Clean up the URL
        window.history.replaceState({}, document.title, window.location.pathname);

      }
    } catch (error) {
      console.error('Error during token exchange:', error);
    }
  }
};

searchForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(searchForm);
  const { searchValue } = Object.fromEntries(formData);

  const activityDetailsContainer = document.getElementById('activity-details');

  try {
    let result = await getActivity(getCookie('access_token'), searchValue);
    renderActivityDetails(result);
  } catch (error) {
    activityDetailsContainer.innerHTML = `
      <div class="alert alert-danger alert-dismissible fade show" role="alert">
        Activity with ID: ${searchValue} was not found.
        <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
      </div>
    `;
    console.error('Search error:', error);
  }
});

document.addEventListener('DOMContentLoaded', async () => {
  handleAuthentication();
  // Gets user activities and renders them
  await loadUserActivities();
  //Render user info
  renderUser();

  // Authorization button event
  const authButton = document.getElementById('auth_button');
  if (authButton) {
    authButton.addEventListener('click', (e) => {
      e.preventDefault();
      window.location.href = `https://www.strava.com/oauth/authorize?client_id=141939&response_type=code&redirect_uri=http://127.0.0.1:5500/SP2/index.html&approval_prompt=force&scope=activity:read_all,read_all`;
    });
  }
});