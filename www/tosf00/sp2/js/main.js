(() => {
    /* API && Constants && Stuff */
    CLIENT_ID = '1341bf9d386c40ebbcebd35b9874f20b';
    CLIENT_SECRET = '39f70e92744442c9873771cf6b66d737';
    TOKEN_URL = 'https://accounts.spotify.com/api/token';
    STORAGE_KEY = 'spotifyAppSavedItems';
    RESULTS_LIMIT = 10;


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
                    'Authorization': 'Basic ' + btoa(this.clientId + ':' + this.clientSecret),
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
                    `https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=${type}`,
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
                const response = await fetch(`https://api.spotify.com/v1/${endpoint}`, options);

                // checks if token is not expired //
                if (response.status === 401) {
                    // if expired calls the getAccessToken function once more //
                    await this.getAccessToken();
                    options.headers['Authorization'] = `Bearer ${this.accessToken}`;
                    const retryResponse = await fetch(`https://api.spotify.com/v1/${endpoint}`, options);

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
            const storedData = localStorage.getItem(this.STORAGE_KEY);
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
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify(emptyData));
            return emptyData;
        }

        // process of saving items into the storage //
        saveItem(type, item) {
            if (!this.savedItems[type].some(savedItem => savedItem.id === item.id)) {
                this.savedItems[type].push(item);
                this.saveToStorage();
                return true;
            }
            return false;
        }

        // removing items from the storage //
        removeItem(type, itemId) {
            this.savedItems[type] = this.savedItems[type].filter(item => item.id !== itemId);
            this.saveToStorage();
        }

        // saving item into the storage //
        saveToStorage() {
            try {
                localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.savedItems));
            } catch (error) {
                console.error('Error saving data to localStorage:', error);
                throw new Error('Unable to save the data. localStorage might be full.');
            }
        }

        // purging the storage //
        clearStorage() {
            this.savedItems = this.initializeEmptyStorage();
            localStorage.removeItem(this.STORAGE_KEY);
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

    document.addEventListener('DOMContentLoaded', async () => {
        const spotify = new SpotifyClient(CLIENT_ID, CLIENT_SECRET);
        const searchForm = document.getElementById('search-form');
        const tabs = document.querySelectorAll('.tab');
        const localManager = new SpotifyLocalManager();

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
            const searchInput = document.getElementById('search-input');
            const query = searchInput.value;
            if (query) {
                try {
                    const results = await spotify.search(query, 'track,artist,album');
                    currentResults = results;
                    displayResults();
                } catch (error) {
                    document.querySelectorAll('.tab-content').forEach(content => {
                        content.innerHTML = `<p>Error: ${error.message}</p>`;
                    });
                }
            } else {
                alert('Input form is empty.');
            }
        });

        ///////////////////////////////////////////////////////////////////////////////////////
        //Modal window section //
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
                    alert(`${type.slice(0, -1)} saved successfully!`);
                } else {
                    alert('Item has been already saved!');
                }
            } catch (error) {
                alert(error.message);
            }
        }

        // function for removing items from localStorage //
        function removeItem(type, itemId) {
            localManager.removeItem(type, itemId);
            updateSavedItemsDisplay();
        }

        // function for removing everything at once from the localStorage //
        function clearSavedItems() {
            if (confirm('Do you really want to remove all of your saved items?')) {
                localManager.clearStorage();
                updateSavedItemsDisplay();
            }
        }
        // function for updating information from the localStorage //
        async function updateSavedItemsDisplay() {
            const savedContent = document.getElementById('saved');
            if (!savedContent) return;

            let html = `
            <div class="container storage-info">
                <button onclick="clearSavedItems()" class="btn btn-primary clear-btn">Remove all</button>
            </div>
        `;

            const savedItems = await localManager.getAllItems();

            // Tracks section //
            html += '<div class="saved-section"><h2>Saved tracks</h2>';
            if (savedItems.tracks.length) {
                html += savedItems.tracks.map(track => `
                <div class="track saved-item">
                    <h3>${track.name}</h3>
                    <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
                    ${track.album.images.length ?
                        `<img src="${track.album.images[track.album.images.length - 1].url}" alt="Album cover">` :
                        ''}
                    <div class="saved-item-buttons">
                        <button onclick="showDetails('track', '${track.id}')" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                        <button onclick="removeItem('tracks', '${track.id}')" class="btn btn-primary remove-btn">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
            } else {
                html += '<p>You do not have any saved songs</p>';
            }
            html += '</div>';

            // Artists section //
            html += '<div class="saved-section"><h2>Saved artists</h2>';
            if (savedItems.artists.length) {
                html += savedItems.artists.map(artist => `
                <div class="artist saved-item">
                    <h3>${artist.name}</h3>
                    ${artist.images.length ?
                        `<img src="${artist.images[artist.images.length - 1].url}" alt="Artist photo">` :
                        ''}
                    <div class="saved-item-buttons">
                        <button onclick="showDetails('artist', '${artist.id}')" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                        <button onclick="removeItem('artists', '${artist.id}')" class="btn btn-primary remove-btn">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
            } else {
                html += '<p>You do not have any saved artists</p>';
            }
            html += '</div>';

            // Albums section //
            html += '<div class="saved-section"><h2>Saved albums</h2>';
            if (savedItems.albums.length) {
                html += savedItems.albums.map(album => `
                <div class="album saved-item">
                    <h3>${album.name}</h3>
                    <p>Artist: ${album.artists.map(artist => artist.name).join(', ')}</p>
                    ${album.images.length ?
                        `<img src="${album.images[album.images.length - 1].url}" alt="Album cover">` :
                        ''}
                    <div class="saved-item-buttons">
                        <button onclick="showDetails('album', '${album.id}')" class="btn btn-primary details-btn">
                            Show Details
                        </button>
                        <button onclick="removeItem('albums', '${album.id}')" class="btn btn-primary remove-btn">
                            Remove
                        </button>
                    </div>
                </div>
            `).join('');
            } else {
                html += '<p>You do not have any saved albums</p>';
            }
            html += '</div>';

            savedContent.innerHTML = html;
        }


        ///////////////////////////////////////////////////////////////////////////////////////
        // Detail Cards section //
        ///////////////////////////////////////////////////////////////////////////////////////

        // Funtion for showing the detail card //

        async function showDetails(type, id) {
            // Zobrazení modalu
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
                        details = currentResults.tracks.items.find(track => track.id === id);
                        const albumTracks = await spotify.get(`albums/${details.album.id}/tracks?limit=5`);
                        additionalContent = `
                        <div class="related-content">
                            <h3>Songs from the same album:</h3>
                            <ul>
                                ${albumTracks.items
                                .filter(track => track.id !== details.id)
                                .map(track => `
                                    <li>
                                        ${track.name}
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
                        <p><strong>Artists:</strong> ${details.artists.map(artist => artist.name).join(', ')}</p>
                        <p><strong>Album:</strong> ${details.album.name}</p>
                        <p><strong>Release Date:</strong> ${details.album.release_date}</p>
                        <p><strong>Duration:</strong> ${Math.floor(details.duration_ms / 60000)}:${(((details.duration_ms % 60000) / 1000)
                                .toFixed(0)).padStart(2, '0')}</p>
                        <p><strong>Popularity:</strong> ${details.popularity}/100</p>
                        ${additionalContent}
                        `;
                        break;

                    case 'artist':
                        details = currentResults.artists.items.find(artist => artist.id === id);
                        const topTracks = await spotify.get(`artists/${id}/top-tracks?limit=5`);
                        additionalContent = `
                        <div class="related-content">
                            <h3>Most popular songs:</h3>
                            <ul>
                                ${topTracks.tracks.slice(0, 5).map(track => `
                                    <li>
                                        ${track.name}
                                        (Popularity: ${track.popularity})
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
                            <p><strong>Spotify URI:</strong> ${details.uri}</p>
                            ${additionalContent}
                        `;
                        break;

                    case 'album':
                        details = currentResults.albums.items.find(album => album.id === id);
                        const tracks = await spotify.get(`albums/${id}/tracks?limit=5`);
                        additionalContent = `
                        <div class="related-content">
                            <h3>Tracks from the album:</h3>
                            <ul>
                                ${tracks.items.map(track => `
                                    <li>
                                        ${track.name}
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
                            <p><strong>Spotify URI:</strong> ${details.uri}</p>
                            ${additionalContent}
                        `;
                        break;
                }
            } catch (error) {
                modalContent.innerHTML = `<p>Error loading details: ${error.message}</p>`;
            }
        }

        ///////////////////////////////////////////////////////////////////////////////////////
        // Display section //
        ///////////////////////////////////////////////////////////////////////////////////////

        function displayResults() {
            // Tracks tab content //
            const tracksContent = document.getElementById('tracks');
            if (currentResults.tracks?.items?.length) {
                tracksContent.innerHTML = currentResults.tracks.items
                    .slice(0, RESULTS_LIMIT)
                    .map(track => `
                    <div class="track">
                        <h3>${track.name}</h3>
                        <p>Artist: ${track.artists.map(artist => artist.name).join(', ')}</p>
                        <p>Album: ${track.album.name}</p>
                        ${track.album.images.length ?
                            `<img src="${track.album.images[track.album.images.length - 1].url}" alt="Album cover">` :
                            ''}
                        <div class="button-group">
                            <button onclick="showDetails('track', '${track.id}')" class="btn btn-primary details-btn">
                                Show Details
                            </button>
                            <button onclick="saveItem('tracks', ${JSON.stringify(track).replace(/"/g, '&quot;')})" class="btn btn-primary save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                tracksContent.innerHTML = '<p>No songs found</p>';
            }

            // Artists tab content //
            const artistsContent = document.getElementById('artists');
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
                            <button onclick="showDetails('artist', '${artist.id}')" class="btn btn-primary details-btn">
                                Show Details
                            </button>
                            <button onclick="saveItem('artists', ${JSON.stringify(artist).replace(/"/g, '&quot;')})" class="btn btn-primary save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                artistsContent.innerHTML = '<p>No artists found</p>';
            }

            // Albums tab content //
            const albumsContent = document.getElementById('albums');
            if (currentResults.albums?.items?.length) {
                albumsContent.innerHTML = currentResults.albums.items
                    .slice(0, RESULTS_LIMIT)
                    .map(album => `
                    <div class="album">
                        <h3>${album.name}</h3>
                        <p>Artist: ${album.artists.map(artist => artist.name).join(', ')}</p>
                        ${album.images.length ?
                            `<img src="${album.images[album.images.length - 1].url}" alt="Album cover">` :
                            ''}
                        <p>Release date: ${album.release_date}</p>
                        <p>Total tracks: ${album.total_tracks}</p>
                        <div class="button-group">
                            <button onclick="showDetails('album', '${album.id}')" class="btn btn-primary details-btn">
                                Show Details
                            </button>
                            <button onclick="saveItem('albums', ${JSON.stringify(album).replace(/"/g, '&quot;')})" class="btn btn-primary save-btn">
                                Save
                            </button>
                        </div>
                    </div>
                `).join('');
            } else {
                albumsContent.innerHTML = '<p>No albums found</p>';
            }
        }

        window.showDetails = showDetails;
        window.saveItem = saveItem;
        window.removeItem = removeItem;
        window.clearSavedItems = clearSavedItems;
    });
})();
