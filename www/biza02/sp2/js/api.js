import {
    auth,
    db,
    collection,
    query,
    where,
    orderBy,
    getDocs,
    addDoc,
    getDoc,
    updateDoc,
    deleteDoc,
    doc,
    serverTimestamp,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut
} from './firebase-init.js';
import Config from './config.js';

function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function fetchWithDelay(url, params, delayTime = 1000) {
    await delay(delayTime);
    return axios.get(url, { params });
}

const placeCache = {};

async function getPlaceDetails(xid) {
    if (placeCache[xid]) return placeCache[xid];  // Return cached data if available

    try {
        const response = await fetchWithDelay(`${Config.apiEndpoints.openTripMap}/xid/${xid}`, {
            apikey: Config.apiKeys.openTripMap,
            format: 'json'
        });

        placeCache[xid] = response.data; // Cache the response
        return response.data;
    } catch (error) {
        console.error('Error fetching place details:', error);

        if (error.response && error.response.status === 429) {
            console.warn('Rate limit exceeded. Retrying in 5 seconds...');
            await delay(5000);  // Wait 5 seconds before retrying
            return getPlaceDetails(xid);  // Retry the request
        }
        return null;
    }
}

const API = {
    getPlaceDetails,  

    async login(credentials) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
            return {
                user: {
                    id: userCredential.user.uid,
                    email: userCredential.user.email
                }
            };
        } catch (error) {
            console.error('Login error:', error);
            throw error;
        }
    },

    async register(userData) {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
            return {
                user: {
                    id: userCredential.user.uid,
                    email: userData.email
                }
            };
        } catch (error) {
            console.error('Registration error:', error);
            throw error;
        }
    },

    async logout() {
        await signOut(auth);
    },

    async isAuthenticated() {
        return auth.currentUser ? true : false;
    },

    async getTrips() {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error("Not authenticated");

            const tripsRef = collection(db, "trips");
            const q = query(
                tripsRef,
                where("userId", "==", user.uid),
                orderBy("createdAt", "desc")
            );

            const snapshot = await getDocs(q);
            return snapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
        } catch (error) {
            console.error("Get trips error:", error);
            throw error;
        }
    },

    async getTrip(tripId) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');

            const tripDoc = doc(db, 'trips', tripId);
            const tripSnapshot = await getDoc(tripDoc);

            if (!tripSnapshot.exists()) throw new Error('Trip not found');

            return { id: tripSnapshot.id, ...tripSnapshot.data() };
        } catch (error) {
            console.error('Get trip error:', error);
            throw error;
        }
    },

    async createTrip(tripData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');

            const tripsRef = collection(db, 'trips');
            const docRef = await addDoc(tripsRef, {
                ...tripData,
                userId: user.uid,
                createdAt: serverTimestamp()
            });

            return {
                id: docRef.id,
                ...tripData
            };
        } catch (error) {
            console.error('Create trip error:', error);
            throw error;
        }
    },

    async updateTrip(tripId, tripData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');

            const tripDoc = doc(db, 'trips', tripId);
            await updateDoc(tripDoc, {
                ...tripData,
                updatedAt: serverTimestamp()
            });

            return {
                id: tripId,
                ...tripData
            };
        } catch (error) {
            console.error('Update trip error:', error);
            throw error;
        }
    },

    async deleteTrip(tripId) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');

            const tripDoc = doc(db, 'trips', tripId);
            await deleteDoc(tripDoc);
        } catch (error) {
            console.error('Delete trip error:', error);
            throw error;
        }
    },

    async addPlace(tripId, placeData) {
        try {
            const user = auth.currentUser;
            if (!user) throw new Error('Not authenticated');

            const placesRef = collection(db, 'trips', tripId, 'places');
            const docRef = await addDoc(placesRef, {
                ...placeData,
                createdAt: serverTimestamp()
            });

            return {
                id: docRef.id,
                ...placeData
            };
        } catch (error) {
            console.error('Add place error:', error);
            throw error;
        }
    },

    async searchPlaces(lat, lon, radius = 5000, kinds = '') {
        try {
            const response = await axios.get(`${Config.apiEndpoints.openTripMap}/radius`, {
                params: {
                    radius,
                    lon,
                    lat,
                    kinds,
                    format: 'json',
                    apikey: Config.apiKeys.openTripMap,
                    limit: 10
                }
            });
    
            console.log(`✅ API Response for Places (Raw):`, response.data); 
    
            if (!response.data || response.data.length === 0) {
                console.warn("❌ No places found.");
                return [];
            }
    
            const detailedPlaces = [];
            for (const place of response.data) {
                try {
                    if (!place.xid) {
                        console.warn(`⚠️ Skipping place with missing XID: ${place.name}`);
                        continue;
                    }
    
                    const details = await getPlaceDetails(place.xid);
                    detailedPlaces.push({ ...place, ...details });
    
                    await delay(1500); 
                } catch (error) {
                    console.error(`Error fetching details for ${place.name}:`, error);
                    detailedPlaces.push(place);
                }
            }
    
            console.log(`✅ Processed Places (Final List):`, detailedPlaces); 
    
            return detailedPlaces;
        } catch (error) {
            console.error('❌ Place search error:', error);
            throw error;
        }
    },    

    async geocode(location) {
        try {
            const response = await axios.get(`${Config.apiEndpoints.google}/geocode/json`, {
                params: {
                    address: location,
                    key: Config.apiKeys.google
                }
            });

            if (response.data.results.length > 0) {
                const locationData = response.data.results[0].geometry.location;
                return { lat: locationData.lat, lon: locationData.lng };
            }

            return null;
        } catch (error) {
            console.error('Geocoding error:', error);
            throw new Error(error.response?.data?.message || 'Geocoding failed');
        }
    },

    async getWeather(lat, lon) {
        try {
            const response = await axios.get(`${Config.apiEndpoints.openWeather}/weather`, {
                params: {
                    lat,
                    lon,
                    appid: Config.apiKeys.openWeather,
                    units: 'metric'
                }
            });

            return response.data;
        } catch (error) {
            console.error('Weather API error:', error);
            throw new Error(error.response?.data?.message || 'Failed to fetch weather data');
        }
    }
};

export default API;
