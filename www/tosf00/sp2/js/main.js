(() => {
    /* API && Constants && Stuff */
    const CLIENT_ID = '1341bf9d386c40ebbcebd35b9874f20b';
    const CLIENT_SECRET = '39f70e92744442c9873771cf6b66d737';
    const TOKEN_URL = 'https://accounts.spotify.com/api/token';
    const BASE_API_URL = "https://api.spotify.com/v1/"
    const STORAGE_KEY = 'personalSaves';
    const RESULTS_LIMIT = 10;


    // Class handling the API calls and access tokens //
    class SpotifyClient {
        constructor(clientId, clientSecret) {
            this.clientId = clientId;
            this.clientSecret = clientSecret;
            this.accessToken = null;
        }

        // getting the access token // 
        async getAccessToken() {
            const authOptions = {
                method: 'POST',
                headers: {
                    'Authorization': `Basic ${btoa(`${this.clientId}:${this.clientSecret}`)}`,
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                body: 'grant_type=client_credentials'
            };

            try {
                const response = await fetch(TOKEN_URL, authOptions);
                const data = await response.json();
                this.accessToken = data.access_token;
                return this.accessToken;
            } catch (error) {
                console.error('Error getting access token:', error);
                throw error;
            }
        }

        // basic search function //
        async search(query, type = 'track,artist,album') {
            if (!this.accessToken) {
                await this.getAccessToken();
            }

            const searchOptions = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            };

            try {
                const response = await fetch(
                    `${BASE_API_URL}search?q=${encodeURIComponent(query)}&type=${type}`,
                    searchOptions
                );
                return await response.json();
            } catch (error) {
                console.error('Error searching:', error);
                throw error;
            }
        }

        // Get function to access endpoints //
        async get(endpoint) {
            if (!this.accessToken) {
                await this.getAccessToken();
            }

            const options = {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${this.accessToken}`
                }
            };

            try {
                const response = await fetch(`${BASE_API_URL}${endpoint}`, options);

                // checks if token is not expired //
                if (response.status === 401) {
                    // if expired calls the getAccessToken function once more //
                    await this.getAccessToken();
                    options.headers['Authorization'] = `Bearer ${this.accessToken}`;
                    const retryResponse = await fetch(`${BASE_API_URL}${endpoint}`, options);

                    if (!retryResponse.ok) {
                        throw new Error(`API request failed with status ${retryResponse.status}`);
                    }
                    return await retryResponse.json();
                }

                if (!response.ok) {
                    throw new Error(`API request failed with status ${response.status}`);
                }

                return await response.json();
            } catch (error) {
                console.error(`Error fetching ${endpoint}:`, error);
                throw error;
            }
        }
    }

    // Class for handling  localStorage functions -> saving finds into personal library //
    class SpotifyLocalManager {

        constructor() {
            this.savedItems = this.loadFromStorage();
        }
        // loads the data from the storage //
        loadFromStorage() {
            const storedData = localStorage.getItem(STORAGE_KEY);
            if (storedData) {
                try {
                    return JSON.parse(storedData);
                } catch (error) {
                    console.error('Error loading data from localStorage:', error);
                    return this.initializeEmptyStorage();
                }
            }
            return this.initializeEmptyStorage();
        }

        // empty storage inicialization //
        initializeEmptyStorage() {
            const emptyData = {
                tracks: [],
                artists: [],
                albums: []
            };
            localStorage.setItem(STORAGE_KEY, JSON.stringify(emptyData));
            return emptyData;
        }

        // process of saving items into the storage //
        saveItem(type, item) {
            if (!this.savedItems[type].some(savedItem => savedItem.id === item.id)) {
                const trimmedItem = this.trimSavedItem(type, item);
                this.savedItems[type].push(trimmedItem);
                this.saveToStorage();
                return true;
            }
            return false;
        }

        trimSavedItem(type, item) {
            if (type === "tracks") {
                const {
                    name,
                    id,
                    external_urls,
                    duration_ms,
                    artists,
                    album,
                    popularity,
                    images,
                    type
                } = item;

                return {
                    name,
                    id,
                    external_urls,
                    duration_ms,
                    artists,
                    album,
                    popularity,
                    images,
                    type
                };
            } else if (type === "artists") {
                const {
                    name,
                    id,
                    external_urls,
                    genres,
                    popularity,
                    type,
                    images,
                    followers
                } = item;

                return {
                    name,
                    id,
                    external_urls,
                    genres,
                    popularity,
                    type,
                    images,
                    followers
                };
            } else if (type === 'albums') {
                const {
                    name,
                    id,
                    external_urls,
                    artists,
                    type,
                    images,
                    followers,
                    release_date,
                    album_type,
                    total_tracks
                } = item;

                return {
                    name,
                    id,
                    external_urls,
                    artists,
                    type,
                    images,
                    followers,
                    release_date,
                    album_type,
                    total_tracks
                };
            } else {
                return item;
            }
        }

        // removing items from the storage //
        removeItem(type, itemId) {
            this.savedItems[type] = this.savedItems[type].filter(item => item.id !== itemId);
            this.saveToStorage();
        }

        // saving item into the storage //
        saveToStorage() {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(this.savedItems));
            } catch (error) {
                console.error('Error saving data to localStorage:', error);
                throw new Error('Unable to save the data. localStorage might be full.');
            }
        }

        // purging the storage //
        clearStorage() {
            this.savedItems = this.initializeEmptyStorage();
            localStorage.removeItem(STORAGE_KEY);
        }

        // fetches information about all of the saved items //
        getAllItems() {
            return this.savedItems;
        }

        // fetches information about all of the saved items of the specific type //
        getItemsByType(type) {
            return this.savedItems[type] || [];
        }
    }


    //Universal class for all modal pop-ups - utilized instead of the alert() and confirm() functions //
    class universalModal {
        constructor() {
            this.modal = null;
            this.modalElement = null;
            this.modalTitle = null;
            this.modalBody = null;
            this.createModalElement();
            this.initialize();
        }

        // Modals HTML structure //
        createModalElement() {
            this.modalElement = document.createElement('div');
            this.modalElement.className = 'modal fade';
            this.modalElement.id = 'universalModal';
            this.modalElement.setAttribute('tabindex', '-1');

            this.modalElement.innerHTML = `
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-primary" data-bs-dismiss="modal">OK</button>
                        </div>
                    </div>
                </div>
            `;
            document.body.appendChild(this.modalElement);
        }

        // inicialization //
        initialize() {
            if (document.readyState === 'loading') {
                document.addEventListener('DOMContentLoaded', () => this.initializeModal());
            } else {
                this.initializeModal();
            }
        }
        //inicialization of modals properties //
        initializeModal() {
            this.modal = new bootstrap.Modal(this.modalElement);
            this.modalTitle = this.modalElement.querySelector('.modal-title');
            this.modalBody = this.modalElement.querySelector('.modal-body');
        }

        // Basic method for showing modal window //
        show(message, title = 'Warning') {
            if (this.modal && this.modalTitle && this.modalBody) {
                this.modalTitle.textContent = title;
                this.modalBody.textContent = message;
                this.modal.show();
            } else {
                console.error('Modal is not inicialized');
            }
        }

        // Method for hiding the modal //
        hide() {
            if (this.modal) {
                this.modal.hide();
            }
        }

        // Method for hiding the modals footer //
        clearFooter() {
            const footer = this.modalElement.querySelector('.modal-footer');
            footer.innerHTML = '';
            return footer;
        }

        // Confirmation modal dialog option //
        confirm(message, title = 'Confirmation', options = {}) {
            const defaultOptions = {
                confirmText: 'Yes',
                cancelText: 'No',
                confirmClass: 'btn-primary',
                cancelClass: 'btn-secondary'
            };

            const finalOptions = { ...defaultOptions, ...options };

            return new Promise((resolve) => {
                if (this.modal && this.modalTitle && this.modalBody) {
                    this.modalTitle.textContent = title;
                    this.modalBody.textContent = message;

                    const footer = this.clearFooter();

                    // Handling of "No" button being clicked //
                    const cancelButton = document.createElement('button');
                    cancelButton.type = 'button';
                    cancelButton.className = `btn ${finalOptions.cancelClass}`;
                    cancelButton.textContent = finalOptions.cancelText;
                    cancelButton.addEventListener('click', () => {
                        this.hide();
                        resolve(false);
                    });

                    // Handling of "Yes" button being clicked //
                    const confirmButton = document.createElement('button');
                    confirmButton.type = 'button';
                    confirmButton.className = `btn ${finalOptions.confirmClass}`;
                    confirmButton.textContent = finalOptions.confirmText;
                    confirmButton.addEventListener('click', () => {
                        this.hide();
                        resolve(true);
                    });

                    footer.appendChild(cancelButton);
                    footer.appendChild(confirmButton);

                    // Handling of the modal being closed by ESC or cross button //
                    this.modalElement.addEventListener('hidden.bs.modal', () => {
                        resolve(false);
                    }, { once: true });

                    this.modal.show();
                }
            });
        }

        // Setting the HTML content of the modal //
        setHtmlContent(content) {
            if (this.modalBody) {
                this.modalBody.innerHTML = content;
            }
        }
    }

    class universalSpinner {
        loadSpinner() {
            const spinner = `
                    <div class="d-flex justify-content-center align-items-center p-5">
                        <div class="spinner-border text-primary" role="status">
                            <span class="visually-hidden">Loading...</span>
                        </div>
                    </div>
                    `;
            return spinner;
        }
    }

    const tracksContent = document.getElementById('tracks');
    const artistsContent = document.getElementById('artists');
    const albumsContent = document.getElementById('albums');
    const searchInput = document.getElementById('search-input');

    document.addEventListener('DOMContentLoaded', async () => {
        const spotify = new SpotifyClient(CLIENT_ID, CLIENT_SECRET);
        const searchForm = document.getElementById('search-form');
        const tabs = document.querySelectorAll('.tab');
        const localManager = new SpotifyLocalManager();
        const modalManager = new universalModal();
        const spinnerManager = new universalSpinner();


        updateSavedItemsDisplay();

        // Tabs switching //
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
                document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                tab.classList.add('active');
                const tabId = tab.getAttribute('data-tab');
                const tabContent = document.getElementById(tabId);
                if (tabContent) {
                    tabContent.classList.add('active');
                    if (tabId === 'saved') {
                        updateSavedItemsDisplay();
                    }
                }
            });
        });

        // Form event listener //
        searchForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const query = searchInput.value.trim();
            if (query && query.length > 0) {
                try {
                    //const tracksContent = document.getElementById('tracks');
                    //const artistsContent = document.getElementById('artists');
                    //const albumsContent = document.getElementById('albums');

                    [tracksContent, artistsContent, albumsContent].forEach(el => el.innerHTML = spinnerManager.loadSpinner());

                    const results = await spotify.search(query, 'track,artist,album');
                    //console.log(results);
                    currentResults = results;

                    const tracksCount = results.tracks?.items?.length || 0;
                    const artistsCount = results.artists?.items?.length || 0;
                    const albumsCount = results.albums?.items?.length || 0;

                    document.getElementById('search-statistics').innerHTML =
                        `Found: ${tracksCount} tracks, 
                        ${artistsCount} artists, 
                        ${albumsCount} albums`;

                    displayResults(tracksContent, artistsContent, albumsContent);
                } catch (error) {
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.innerHTML = `<p>Error: ${error.message}</p>`;
                    });
                }
            } else {
                //alert('Input form is empty.');
                modalManager.show('Input form is empty.', 'Warning')
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////
        //Modal window section (for item details) //
        ///////////////////////////////////////////////////////////////////////////////////////    

        // insertion of modal window //
        document.body.insertAdjacentHTML('beforeend', `
            <div class="modal fade" id="detailsModal" tabindex="-1" aria-labelledby="detailsModalLabel">
                <div class="modal-dialog modal-dialog-scrollable">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="detailsModalLabel"></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body" id="modalContent">
                        </div>
                    </div>
                </div>
            </div>
        `);

        const modal = document.getElementById('detailsModal');
        const modalContent = document.getElementById('modalContent');
        const bootstrapModal = new bootstrap.Modal(modal);
        const modalTitle = document.getElementById('detailsModalLabel');
        //const closeModal = document.querySelector('.close-modal');

        // closing by clicking out of modal listener //
        modal.addEventListener('click', (event) => {
            if (event.target === modal) {
                bootstrapModal.hide();
            }
        });

        // closing by ESC button pressed modal listener //
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && modal.classList.contains('show')) {
                bootstrapModal.hide();
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////
        //Saved items section //
        ///////////////////////////////////////////////////////////////////////////////////////

        // function for saving items into localStorage //
        function saveItem(type, item) {
            try {
                if (localManager.saveItem(type, item)) {
                    updateSavedItemsDisplay();
                    //alert(`${type.slice(0, -1)} saved successfully!`);
                    modalManager.show(`${type.slice(0, -1)} saved successfully!`, 'Item saved');
                } else {
                    //alert('Item has been already saved!');
                    modalManager.show('Item has been already saved!', 'Already saved');
                }
            } catch (error) {
                alert(error.message);
            }
        }

        // function for removing items from localStorage //
        async function removeItem(type, itemId) {
            //if (confirm('Do you really want to remove this item from your saved items?')) {
            if (await modalManager.confirm('Do you really want to remove this item from your saved items?')) {
                localManager.removeItem(type, itemId);
                updateSavedItemsDisplay();
            }
        }

        // function for removing everything at once from the localStorage //
        async function clearSavedItems() {
            if (await modalManager.confirm('Do you really want to remove all of your saved items?')) {
                localManager.clearStorage();
                updateSavedItemsDisplay();
            }
        }

        // function for updating information from the localStorage //
        async function updateSavedItemsDisplay() {
            const savedContent = document.getElementById('saved');
            if (!savedContent) return;
            let removeAllButtonHTML = `
            <div class="container storage-info">
                <button id="remove-all-btn" class="btn btn-primary clear-btn">Remove all</button>
            </div>
            `;

            const savedItems = await localManager.getAllItems();

            // Tracks section //
            let trackSavedHTML = '';
            let trackSaved = '';
            //html += '<div class="saved-section"><h2>Saved tracks</h2>';
            if (savedItems.tracks.length) {
                trackSaved = savedItems.tracks.map(track => `
                <div class="track saved-item">
                    <h3>${track.name}</h3>
                    <p>Artist: ${track.artists.map(artist =>
                        `<a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a>`
                    ).join(', ')}</p>
                    ${track.album.images.length ?
                        `<img src="${track.album.images[track.album.images.length - 1].url}" alt="Album cover">` :
                        ''}
                    <div class="saved-item-buttons">
                        <button data-type="track" data-id="${track.id}" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                        <button data-type="tracks" data-id="${track.id}" class="btn btn-primary remove-btn">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
            } else {
                trackSaved = '<p>You do not have any saved songs</p>';
            }
            trackSavedHTML = `
            <div class="saved-section">
                <h2>Saved tracks</h2>
                ${trackSaved}
            </div>    
            `;

            // Artists section //
            let artistSavedHTML = '';
            let artistSaved = '';
            //html += '<div class="saved-section"><h2>Saved artists</h2>';
            if (savedItems.artists.length) {
                artistSaved = savedItems.artists.map(artist => `
                <div class="artist saved-item">
                    <h3>${artist.name}</h3>
                    ${artist.images.length ?
                        `<img src="${artist.images[artist.images.length - 1].url}" alt="Artist photo">` :
                        ''}
                    <div class="saved-item-buttons">
                        <button data-type="artist" data-id = "${artist.id}" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                        <button data-type="artists" data-id="${artist.id}" class="btn btn-primary remove-btn">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
            } else {
                artistSaved = '<p>You do not have any saved artists</p>';
            }
            artistSavedHTML = `
            <div class="saved-section">
                <h2>Saved artists</h2>
                ${artistSaved}
            </div>    
            `;

            // Albums section //
            let albumSavedHTML = '';
            let albumSaved = '';
            //html += '<div class="saved-section"><h2>Saved albums</h2>';
            if (savedItems.albums.length) {
                albumSaved = savedItems.albums.map(album => `
                <div class="album saved-item">
                    <h3>${album.name}</h3>
                    <p>Artist:  ${album.artists.map(artist =>
                        `<a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a>`
                    ).join(', ')}</p>
                    ${album.images.length ?
                        `<img src="${album.images[album.images.length - 1].url}" alt="Album cover">` :
                        ''}
                    <div class="saved-item-buttons">
                        <button data-type="album" data-id="${album.id}" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                        <button data-type="albums" data-id="${album.id}" class="btn btn-primary remove-btn">
                            Remove
                        </button>
                        
                    </div>
                </div>
            `).join('');
            } else {
                albumSaved = '<p>You do not have any saved albums</p>';
            }
            albumSavedHTML = `
            <div class="saved-section">
                <h2>Saved albums</h2>
                ${albumSaved}
            </div>    
            `;

            savedContent.innerHTML = `${removeAllButtonHTML}${trackSavedHTML}${artistSavedHTML}${albumSavedHTML}`;

            // Event handlers for saved section //
            const removeAllButton = document.getElementById('remove-all-btn');
            removeAllButton.addEventListener('click', async () => {
                clearSavedItems();
            });

            // event handler for remove-btn & details-btn //
            document.querySelectorAll('.remove-btn, .details-btn').forEach(element => {
                element.addEventListener('click', async function (event) {
                    let type;
                    let id;
                    let call;
                    if (event.target.classList.contains('remove-btn')) {
                        type = event.target.getAttribute('data-type');
                        id = event.target.getAttribute('data-id');
                        removeItem(type, id);
                    } else if (event.target.classList.contains('details-btn')) {
                        type = event.target.getAttribute('data-type');
                        id = event.target.getAttribute('data-id');
                        call = 'saved';
                        showDetails(type, id, call);
                    }
                });
            });
            /*
                        document.getElementById('saved')?.addEventListener('click', async function (event) {
                            let type;
                            let id;
                            let call;
                            if (event.target.classList.contains('remove-btn')) {
                                type = event.target.getAttribute('data-type');
                                id = event.target.getAttribute('data-id');
                                removeItem(type, id);
                            } else if (event.target.classList.contains('details-btn')) {
                                type = event.target.getAttribute('data-type');
                                id = event.target.getAttribute('data-id');
                                call = 'saved';
                                showDetails(type, id, call);
                            }
                        }); */
        }


        ///////////////////////////////////////////////////////////////////////////////////////
        // Detail Cards section //
        ///////////////////////////////////////////////////////////////////////////////////////

        // Funtion for showing the detail card //

        async function showDetails(type, id, call) {
            bootstrapModal.show();
            modalTitle.innerHTML = '';
            modalContent.innerHTML = `
            <div class="d-flex justify-content-center align-items-center p-5">
                <div class="spinner-border text-primary" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
            `;

            try {
                let details;
                let additionalContent = '';
                switch (type) {
                    case 'track':
                        if (call === 'saved') {
                            const savedItems = await localManager.savedItems;
                            details = savedItems.tracks.find(track => track.id === id);
                        } else {
                            details = currentResults.tracks.items.find(track => track.id === id);
                        }
                        const albumTracks = await spotify.get(`albums/${details.album.id}/tracks?limit=5`);
                        additionalContent = `
                        <div class="related-content">
                            <h3>Songs from the same album:</h3>
                            <ul>
                                ${albumTracks.items
                                .filter(track => track.id !== details.id)
                                .map(track => `
                                    <li>
                                        <button data-input = "${track.name}" class="btn btn-primary new-search-btn">
                                            ${track.name} 
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        `;
                        modalTitle.innerHTML = `Details about the song`;
                        modalContent.innerHTML = `
                        <h2>${details.name}</h2>
                        ${details.album.images.length ?
                                `<img src="${details.album.images[0].url}" alt="Album cover" class="img-detail">` :
                                ''}
                        <p><strong>Artists:</strong>${details.artists.map(artist => artist.name).join(', ')}</p>
                        <p><strong>Album:</strong> ${details.album.name}</p>
                        <p><strong>Release Date:</strong> ${details.album.release_date}</p>
                        <p><strong>Duration:</strong> ${Math.floor(details.duration_ms / 60000)}:${(((details.duration_ms % 60000) / 1000)
                                .toFixed(0)).padStart(2, '0')}</p>
                        <p><strong>Popularity:</strong> ${details.popularity}/100</p>
                        <p><strong>Spotify url:</strong> <a href="${details.external_urls.spotify}" target="_blank">${details.name}</a></p>
                        ${additionalContent}
                        `;
                        break;

                    case 'artist':
                        if (call === 'saved') {
                            const savedItems = await localManager.savedItems;

                            details = savedItems.artists.find(artist => artist.id === id);
                        } else {
                            details = currentResults.artists.items.find(artist => artist.id === id);
                        }
                        const topTracks = await spotify.get(`artists/${id}/top-tracks?limit=5`);
                        additionalContent = `
                        <div class="related-content">
                            <h3>Most popular songs:</h3>
                            <ul>
                                ${topTracks.tracks.slice(0, 5).map(track => `
                                    <li>
                                        <button data-input = "${track.name}" class="btn btn-primary new-search-btn">
                                            ${track.name} (Popularity: ${track.popularity})
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        `;
                        modalTitle.innerHTML = `Details about the artist`;
                        modalContent.innerHTML = `
                            <h2>${details.name}</h2>
                            ${details.images.length ?
                                `<img src="${details.images[0].url}" alt="Artist photo" class="img-detail">` :
                                ''}
                            <p><strong>Followers:</strong> ${details.followers.total.toLocaleString()}</p>
                            <p><strong>Genres:</strong> ${details.genres.length ? details.genres.join(', ') : 'Not specified'}</p>
                            <p><strong>Popularity:</strong> ${details.popularity}/100</p>
                            <p><strong>Spotify URL:</strong> <a href="${details.external_urls.spotify}" target="_blank">${details.name}</a></p>
                            ${additionalContent}
                        `;
                        break;

                    case 'album':
                        if (call === 'saved') {
                            const savedItems = await localManager.savedItems;
                            details = savedItems.albums.find(album => album.id === id);
                        } else {
                            details = currentResults.albums.items.find(album => album.id === id);
                        }
                        const tracks = await spotify.get(`albums/${id}/tracks?limit=5`);
                        additionalContent = `
                        <div class="related-content">
                            <h3>Tracks from the album:</h3>
                            <ul>
                                ${tracks.items.map(track => `
                                    <li>
                                        <button data-input = "${track.name}" class="btn btn-primary new-search-btn">
                                            ${track.name}
                                        </button>
                                    </li>
                                `).join('')}
                            </ul>
                        </div>
                        `;
                        modalTitle.innerHTML = `Details about the album`;
                        modalContent.innerHTML = `
                            <h2>${details.name}</h2>
                            ${details.images.length ?
                                `<img src="${details.images[0].url}" alt="Album cover" class="img-detail">` :
                                ''}
                            <p><strong>Artists:</strong> ${details.artists.map(artist => artist.name).join(', ')}</p>
                            <p><strong>Release Date:</strong> ${details.release_date}</p>
                            <p><strong>Total Tracks:</strong> ${details.total_tracks}</p>
                            <p><strong>Album Type:</strong> ${details.album_type}</p>
                            <p><strong>Spotify URL:</strong> <a href="${details.external_urls.spotify}" target="_blank">${details.name}</a></p>
                            ${additionalContent}
                        `;
                        break;
                }
            } catch (error) {
                modalContent.innerHTML = `<p>Error loading details: ${error.message}</p>`;
            }

            document.querySelectorAll('.new-search-btn').forEach(element => {
                element.addEventListener('click', async function (event) {
                    bootstrapModal.hide();
                    const newQuery = event.target.getAttribute('data-input').toString();
                    if (newQuery && newQuery.length > 0) {
                        try {
                            searchInput.value = newQuery;

                            [tracksContent, artistsContent, albumsContent].forEach(el => el.innerHTML = spinnerManager.loadSpinner());

                            const newResults = await spotify.search(newQuery, 'track,artist,album');
                            currentResults = newResults;

                            displayResults(tracksContent, artistsContent, albumsContent);
                        } catch (error) {
                            document.querySelectorAll('.tab-content').forEach(content => {
                                content.innerHTML = `<p>Error: ${error.message}</p>`;
                            });
                        }
                    }
                });
            });
        }

        ///////////////////////////////////////////////////////////////////////////////////////
        // Display section //
        ///////////////////////////////////////////////////////////////////////////////////////

        // Tracks tab content //
        function displayResults(tracksContent, artistsContent, albumsContent) {
            if (currentResults.tracks?.items?.length) {
                tracksContent.innerHTML = currentResults.tracks.items
                    .slice(0, RESULTS_LIMIT)
                    .map(track => `
                    <div class="track">
                        <h3>${track.name}</h3>
                        <p>Artist: ${track.artists.map(artist =>
                        `<a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a>`
                    ).join(', ')}</p>
                        <p>Album: <a href="${track.album.external_urls.spotify}" target="_blank">${track.album.name}</a></p>
                        ${track.album.images.length ?
                            `<img src="${track.album.images[track.album.images.length - 1].url}" alt="Album cover">` :
                            ''}
                        <div class="button-group">
                            <button data-type="track" data-id="${track.id}" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                            <button data-type="tracks" data = '${JSON.stringify(track).replace(/"/g, "&quot;")}' class="btn btn-primary save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                tracksContent.innerHTML = '<p>No songs found</p>';
            }

            // Artists tab content //
            if (currentResults.artists?.items?.length) {
                artistsContent.innerHTML = currentResults.artists.items
                    .slice(0, RESULTS_LIMIT)
                    .map(artist => `
                    <div class="artist">
                        <h3>${artist.name}</h3>
                        ${artist.images.length ?
                            `<img src="${artist.images[artist.images.length - 1].url}" alt="Artist photo">` :
                            ''}
                        <p>Followers: ${artist.followers.total.toLocaleString()}</p>
                        <p>Genres: ${artist.genres.join(', ') || 'Not specified'}</p>
                        <p>Popularity: ${artist.popularity}/100</p>
                        <div class="button-group">
                            <button data-type="artist" data-id = "${artist.id}" class="btn btn-primary details-btn">
                            Show Details
                            </button>
                            <button data-type="artists" data = '${JSON.stringify(artist).replace(/"/g, "&quot;")}' class="btn btn-primary save-btn">                        
                                Save
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                artistsContent.innerHTML = '<p>No artists found</p>';
            }

            // Albums tab content //
            if (currentResults.albums?.items?.length) {
                albumsContent.innerHTML = currentResults.albums.items
                    .slice(0, RESULTS_LIMIT)
                    .map(album => `
                    <div class="album">
                        <h3>${album.name}</h3>
                        <p>Artist:  ${album.artists.map(artist =>
                        `<a href="${artist.external_urls.spotify}" target="_blank">${artist.name}</a>`
                    ).join(', ')}</p>
                        ${album.images.length ?
                            `<img src="${album.images[album.images.length - 1].url}" alt="Album cover">` :
                            ''}
                        <p>Release date: ${album.release_date}</p>
                        <p>Total tracks: ${album.total_tracks}</p>
                        <div class="button-group">
                            <button data-type="album" data-id="${album.id}" class="btn btn-primary details-btn">
                                Show Details
                            </button>
                            <button data-type="albums" data = '${JSON.stringify(album).replace(/"/g, "&quot;")}' class="btn btn-primary save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                albumsContent.innerHTML = '<p>No albums found</p>';
            }

            // event handler for save & details-btn //
            document.querySelectorAll('.save-btn, .details-btn').forEach(element => {
                element.addEventListener('click', async function (event) {
                    console.log('clicked');
                    let type;
                    let id;
                    if (event.target.classList.contains('details-btn')) {
                        type = event.target.getAttribute('data-type');
                        id = event.target.getAttribute('data-id');
                        showDetails(type, id);
                    }
                    else if (event.target.classList.contains('save-btn')) {
                        type = event.target.getAttribute('data-type');
                        const dataJSON = event.target.getAttribute('data');
                        try {
                            const data = JSON.parse(dataJSON);
                            await saveItem(type, data);
                        } catch (error) {
                            console.error('Error during parsing JSON:', error);
                        }
                    }
                });
            });
        }

       /* window.showDetails = showDetails;
        window.saveItem = saveItem;
        window.removeItem = removeItem;
        window.clearSavedItems = clearSavedItems; */
    });
})();
