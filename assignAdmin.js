import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyB6hFCWPP3nvyTaBGKIgWTKmaQEgA8Wzi8",
  authDomain: "planner-website-a49da.firebaseapp.com",
  projectId: "planner-website-a49da",
  storageBucket: "planner-website-a49da.appspot.com",
  messagingSenderId: "1086106542166",
  appId: "1:1086106542166:web:b1e6d365b01661417e5bf7",
};

// Initialize Firebase
initializeApp(firebaseConfig);

let auth = getAuth();

console.log(auth.currentUser.uid);
