const CLIENT_ID =
  "1082310563066-i012m4gulkr01asucv0gn452f82hk6kc.apps.googleusercontent.com";
const API_KEY = "AIzaSyCBypwgSBccNaAhus1FEx3SdAoSp7a3qGE";
const SCOPES = "https://www.googleapis.com/auth/drive.file";

declare namespace google.accounts.oauth2 {
  interface TokenClientConfig {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
  }

  interface TokenClient {
    requestAccessToken(): void;
  }

  interface TokenResponse {
    access_token: string;
    expires_in: string;
    error?: string;
  }

  function initTokenClient(config: TokenClientConfig): TokenClient;
}
console.log("Google API loaded:", google, gapi);

const signinButton = document.getElementById("signin-button");
const timerSettings = document.getElementById("timer-settings");
const navPanel = document.getElementById("navbar-panel");

let tokenClient: google.accounts.oauth2.TokenClient;
let accessToken: string | null = null;

function changeWindow(window: HTMLElement) {
    window.style.display = "flex";
}

function loadGapiScript() {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://apis.google.com/js/api.js";
    script.onload = resolve;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

async function initializeApp() {
  await loadGapiScript();
  //   gapi.load("client", async () => {
  //     await gapi.client.init({
  //       apiKey: API_KEY,
  //     });
  //   });

  //   console.log("Client loaded with gapi");

  await new Promise((resolve, reject) => {
    gapi.load("client", async () => {
      try {
        await gapi.client.init({ apiKey: API_KEY });
        console.log("Client loaded with gapi");
        resolve(true);
      } catch (error) {
        console.error("Error initializing gapi client:", error);
        reject(error);
      }
    });
  });

  tokenClient = google.accounts.oauth2.initTokenClient({
    client_id: CLIENT_ID,
    scope: SCOPES,
    callback: (tokenResponse) => {
      if (!tokenResponse || tokenResponse.error) {
        console.error("Error in token response:", tokenResponse?.error);
        return;
      }
      accessToken = tokenResponse.access_token;
      console.log('Something');
      
      changeWindow(timerSettings);
    },
  });
}

signinButton.addEventListener("click", () => {
  if (!tokenClient) {
    console.error("Token client is not initialized");
    return;
  }
  try {
    console.log("Requesting access token...");
    tokenClient.requestAccessToken();
  } catch (error) {
    console.error("Error requesting access token:", error);
  }
});

initializeApp();
