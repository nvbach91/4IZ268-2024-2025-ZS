//Authorization link
//https://www.strava.com/oauth/authorize?client_id=141939&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=activity:read_all
//https://www.strava.com/oauth/authorize?client_id=141939&response_type=code&redirect_uri=http://127.0.0.1:5500/SP2/index.html&approval_prompt=force&scope=activity:read_all,read_all
//const API_KEY = '92dbc163c956536ae66e02d4a6167e15e71535a7';
//const REFRESH_KEY_activityReadAll = `6bfcd2e883920e688615f9a736794ed9ea57e6e3`;
//const gpx_link = `https://www.strava.com/activities/12518418319/export_gpx`;
//const REFRESH_KEY = `bdd8f1d219e1278fee016853c68718db874bd895`;
const auth_link = `https://www.strava.com/oauth/token`;
const activities_link = `https://www.strava.com/api/v3/athlete/activities`;
const searchResultsContainer = document.querySelector('#search-results');
const authButton = document.querySelector('#auth_button');

const getActivities = async (accessToken) => {
  const res = await fetch(activities_link, {
    method: "GET",
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Accept': 'application/json'
    }
  });
  const data = await res.json();
  return data;
};

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
const downloadGPX = async (accessToken) => {
  const link = document.createElement("a");
  link.href = `${gpx_link}`;
  link.download = "activity.gpx";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


const renderMovieSearchResults = (results) => {
  const activities = results.map((result) => {
    const activity = document.createElement('li');
    activity.textContent = result.name;
    /*activity.addEventListener('click', async () => {
        const movieDetailsData = await fetchMovieDetails(result.id);
        renderMovieDetails(movieDetailsData);
    });*/
    return activity;
  });
  searchResultsContainer.innerHTML = '';
  searchResultsContainer.append(...activities);
};

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

// Zpracování nahraného GPX souboru
document.getElementById('gpxFile').addEventListener('change', function (event) {
  const file = event.target.files[0];

  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      const gpxData = e.target.result;

      // Načtení a vykreslení GPX dat pomocí leaflet-gpx
      const gpxLayer = new L.GPX(gpxData, {
        async: true,
        marker_options: {
          startIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-green.png',
          endIconUrl: 'https://leafletjs.com/examples/custom-icons/leaf-red.png',
          shadowUrl: 'https://leafletjs.com/examples/custom-icons/leaf-shadow.png',
        },
      }).on('loaded', function (e) {
        map.fitBounds(e.target.getBounds());
      }).addTo(map);
    };

    reader.readAsText(file);
  }
});


// Function to extract the code parameter
const extractCodeAfterRedirect = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const code = urlParams.get('code');
  if (code) {
    console.log("Authorization code:", code);
    return code;
  } else {
    console.log("No authorization code found in the URL.");
    return null;
  }
};


//TODO
//vymazat z asress baru ten kod (jako do dělá ten ind při ouath od google)
(async () => {
  //Extrakce kodu z url
  let code = extractCodeAfterRedirect();
  //Použití kodu na volání typu POST na získání refresh a access tokenu pro uživatele (potřeba někam tokeny uložit aby se nemuselo autorizovat pořád)
  let connect_Data = await useAuthorizationCode(code);

  //Získání nového access tokenu
  const authResponse = await reAuthorize(auth_link, connect_Data);
  //Získíní aktivit uživatele
  const activities = await getActivities(authResponse.access_token);
  console.log(activities);

  //Test odpovědi
  console.log("access_token: " + authResponse.access_token);
  console.log("refresh_token: " + connect_Data.refresh_token);
  renderMovieSearchResults(activities);

  //vykreslení první aktivity na mapě
  const firstActivityId = activities[1].id;
  const streams = await getActivityStreams(authResponse.access_token, firstActivityId, 'time,distance,latlng', true);

  console.log(`Streams for activity ${firstActivityId}:`, streams.latlng.data);

  // create a red polyline from an array of LatLng points
  var latlngs = streams.latlng.data;

  var polyline = L.polyline(latlngs, { color: 'red' }).addTo(map);

  // zoom the map to the polyline
  map.fitBounds(polyline.getBounds());
})();
