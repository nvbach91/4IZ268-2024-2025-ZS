import { initializeApp } from "https://www.gstatic.com/firebasejs/10.0.0/firebase-app.js";
import { 
    getAuth, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-auth.js";
import { 
    getFirestore,
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
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/10.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey: "AIzaSyBe6Xr5UdfjOrdUivPOaSB5h3VWWWD_Y48",
    authDomain: "travel-planner-6b82b.firebaseapp.com",
    projectId: "travel-planner-6b82b",
    storageBucket: "travel-planner-6b82b.firebasestorage.app",
    messagingSenderId: "863538728110",
    appId: "1:863538728110:web:376ce5730f1ae05f81f13f",
    measurementId: "G-6Y7ZBBXEDM"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { 
    auth, 
    db, 
    signInWithEmailAndPassword, 
    createUserWithEmailAndPassword, 
    signOut,
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
    serverTimestamp
};

document.addEventListener('DOMContentLoaded', function() {
    const loadEl = document.querySelector('#load');
    if (loadEl) {
        let features = ['auth', 'firestore'];
        loadEl.textContent = `Firebase SDK loaded with ${features.join(', ')}`;
    } else {
        console.error('Load element not found');
    }
});