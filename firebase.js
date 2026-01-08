import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBFQ6G8AuEkxg-QFy0YCpSr-gtYk9ipA40",
  authDomain: "student-teacher-appointm-60ca5.firebaseapp.com",
  projectId: "student-teacher-appointm-60ca5",
  storageBucket: "student-teacher-appointm-60ca5.firebasestorage.app",
  messagingSenderId: "25051231226",
  appId: "1:25051231226:web:edd0f9e490dc66ccb8aa43"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

