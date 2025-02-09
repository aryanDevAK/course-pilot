// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: "course-pilot-71678.firebaseapp.com",
  projectId: "course-pilot-71678",
  storageBucket: "course-pilot-71678.firebasestorage.app",
  messagingSenderId: "852137486139",
  appId: "1:852137486139:web:16abfc3bfa8d6fd9f0f91e",
  measurementId: "G-BS5DM1TG8G"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);
export const storage = getStorage(app);