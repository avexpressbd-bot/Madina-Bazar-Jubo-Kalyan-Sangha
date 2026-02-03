
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getDatabase, ref, onValue, set, push, update, child } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-database.js";
import { getStorage, ref as sRef, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-storage.js";

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
const db = getDatabase(app);
const storage = getStorage(app);

export { db, storage, ref, sRef, onValue, set, push, update, child, uploadBytes, getDownloadURL };
