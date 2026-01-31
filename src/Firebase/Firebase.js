// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDntOg7GKBBZa59JAf21HYIJeG2ocwc0nk",
  authDomain: "versa-b6835.firebaseapp.com",
  projectId: "versa-b6835",
  storageBucket: "versa-b6835.firebasestorage.app",
  messagingSenderId: "402357397269",
  appId: "1:402357397269:web:c1586ffc07056a5629ab1c",
  measurementId: "G-ZWZLLNKJM0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
