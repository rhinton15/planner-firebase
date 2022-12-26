// https://www.thisdot.co/blog/storing-your-notes-in-the-cloud-firestore-with-vuejs

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
// const firebaseConfig = {
//   apiKey: "AIzaSyB6hFCWPP3nvyTaBGKIgWTKmaQEgA8Wzi8",
//   authDomain: "planner-website-a49da.firebaseapp.com",
//   projectId: "planner-website-a49da",
//   storageBucket: "planner-website-a49da.appspot.com",
//   messagingSenderId: "1086106542166",
//   appId: "1:1086106542166:web:b1e6d365b01661417e5bf7",
// };
const firebaseConfig = {
  apiKey: "AIzaSyB8VKwC_stapdUA5ma-35fq1x2AbVsZI6k",
  authDomain: "fun-day-planners.firebaseapp.com",
  projectId: "fun-day-planners",
  storageBucket: "fun-day-planners.appspot.com",
  messagingSenderId: "700815152170",
  appId: "1:700815152170:web:11e9726b1a4f587c845f53",
  measurementId: "G-E3MBNH3ERV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Analytics and get a reference to the service
const analytics = getAnalytics(app);

let auth = getAuth();
let db = getFirestore();
const functions = getFunctions();
const storage = getStorage();

export { auth, db, functions, storage, analytics };
