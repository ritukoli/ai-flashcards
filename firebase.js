// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDKYtUhSUjorp-6-17wKtxU9WHwF5ZfHRs",
  authDomain: "flashcard-saas-51b7a.firebaseapp.com",
  projectId: "flashcard-saas-51b7a",
  storageBucket: "flashcard-saas-51b7a.appspot.com",
  messagingSenderId: "656507914742",
  appId: "1:656507914742:web:18d39263700f3a8b291fd7",
  measurementId: "G-RME9E4PK02"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
