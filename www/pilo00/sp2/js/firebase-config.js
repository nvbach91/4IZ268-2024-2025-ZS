// Import Firebase functions
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.16.0/firebase-firestore.js";

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAt3CcoMbVHj_Mr3-LWlfmzQCSrQ6gSb4Q",
  authDomain: "pilo00-sp2-tabletopplanner.firebaseapp.com",
  projectId: "pilo00-sp2-tabletopplanner",
  storageBucket: "pilo00-sp2-tabletopplanner.firebasestorage.app",
  messagingSenderId: "591379457476",
  appId: "1:591379457476:web:9b47f931e0f31a46f2f091",
  measurementId: "G-G6XPRZL5MM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and Firestore
const auth = getAuth(app);
const db = getFirestore(app);

// Export for use in other files
export { auth, db };
