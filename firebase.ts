
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, update } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";

const firebaseConfig = {
  apiKey: "AIzaSyAku5eM69kTlz97OWyw_d0FkOjEeZyA8nI",
  authDomain: "mbjks-portal-4fb6b.firebaseapp.com",
  databaseURL: "https://mbjks-portal-4fb6b-default-rtdb.firebaseio.com",
  projectId: "mbjks-portal-4fb6b",
  storageBucket: "mbjks-portal-4fb6b.firebasestorage.app",
  messagingSenderId: "184800242737",
  appId: "1:184800242737:web:9ae50d6c1f1a247c8d3910"
};

const app = initializeApp(firebaseConfig);
export const db = getDatabase(app);
export { ref, onValue, set, push, update };
