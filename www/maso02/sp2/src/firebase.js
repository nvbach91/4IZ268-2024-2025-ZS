// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getAuth } from "firebase/auth";
import { initializeFirestore, persistentLocalCache } from "firebase/firestore";

// web app's Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyA0Klsqh8sutJIrrJ7nfGpXm5geYLEV0X4",
  authDomain: "iz268-sp2-maso02.firebaseapp.com",
  projectId: "iz268-sp2-maso02",
  storageBucket: "iz268-sp2-maso02.firebasestorage.app",
  messagingSenderId: "59220471804",
  appId: "1:59220471804:web:d2e92a7bcf7f95c5834c79"
};

// init Firebase
const app = initializeApp(firebaseConfig);

// AUTH SECTION ===================================
const auth = getAuth(app);

// FIRESTORE SECTION ============================
const db = initializeFirestore(app, {
  localCache: persistentLocalCache({}), // enables localStorage (offline persistence)
});

export { app, auth, db }