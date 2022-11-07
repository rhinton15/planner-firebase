// https://www.thisdot.co/blog/storing-your-notes-in-the-cloud-firestore-with-vuejs

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

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
let db = getFirestore();
const functions = getFunctions();
const storage = getStorage();

export { auth, db, functions, storage };
