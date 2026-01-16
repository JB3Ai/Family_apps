import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyB5mxeX7f73HjSQNphATgYcXx4S7Za_Y1Y",
    authDomain: "familysync-fbd39.firebaseapp.com",
    projectId: "familysync-fbd39",
    storageBucket: "familysync-fbd39.firebasestorage.app",
    messagingSenderId: "1093022149039",
    appId: "1:1093022149039:web:5149e341a0131071c9a75a",
    measurementId: "G-3CEFK92KEX",
    databaseURL: "https://familysync-fbd39-default-rtdb.europe-west1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and get a reference to the service
export const db = getDatabase(app);
