import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

/**
 * অভিনন্দন! আপনি সঠিক কনফিগারেশনটি পেয়েছেন।
 * এখন আপনার ওয়েবসাইটটি এই তথ্যের মাধ্যমে সরাসরি আপনার Firebase ডাটাবেসে ডাটা জমা করবে।
 */

const firebaseConfig = {
  apiKey: "AIzaSyAku5eM69kTlz97OWyw_d0FkOjEeZyA8nI",
  authDomain: "mbjks-portal-4fb6b.firebaseapp.com",
  projectId: "mbjks-portal-4fb6b",
  storageBucket: "mbjks-portal-4fb6b.firebasestorage.app",
  messagingSenderId: "184800242737",
  appId: "1:184800242737:web:9ae50d6c1f1a247c8d3910"
};

// Firebase ইনিশিয়ালাইজ করা হচ্ছে
const app = initializeApp(firebaseConfig);

// Firestore ডাটাবেস এক্সপোর্ট করা হচ্ছে যাতে অন্য ফাইল থেকে ব্যবহার করা যায়
export const db = getFirestore(app);
