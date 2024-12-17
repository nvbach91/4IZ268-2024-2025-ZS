gapi.load('client:auth2', initClient);

function initClient() {
    gapi.client.init({
        API_KEY: 'AIzaSyBLh651BCPXAdrFPs8n4zE8iZV9f2JhbG4',
        CLIENT_ID: '31392427339-gqekuarpqa8ah4n3nb4nka6v9gqgbk4d.apps.googleusercontent.com',
        DISCOVERY_DOCS: ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"],
        SCOPES: "https://www.googleapis.com/auth/calendar.events"
    }).then(function () {
        gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

        updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
    });
}

function updateSigninStatus(isSignedIn) {
    if (isSignedIn) {
        createEvent();
    } else {
        gapi.auth2.getAuthInstance().signIn();
    }
}

