// Booking Page JS
console.log("Booking JS loaded");
// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  import {getDatabase, ref, set, update, child, get}
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

  import { onAuthStateChanged } from
    "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  // TODO: Add SDKs for Firebase products that you want to use
  // https://firebase.google.com/docs/web/setup#available-libraries

  // Your web app's Firebase configuration

  // Your web app's Firebase configuration
  const firebaseConfig = {
    apiKey: "AIzaSyD2xfIz6jMWHXnRpMW5afLkNYPZllbBDdc",
    authDomain: "wd-2-fc227.firebaseapp.com",
    databaseURL: "https://wd-2-fc227-default-rtdb.firebaseio.com",
    projectId: "wd-2-fc227",
    storageBucket: "wd-2-fc227.firebasestorage.app",
    messagingSenderId: "31083722430",
    appId: "1:31083722430:web:87e89224c22a69793450ef"
    };

  // Initialize Firebase

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  const auth = getAuth();

  // Return instance of your app's firebase realtime database (FRD)
  const db = getDatabase(app);

// ------------------------Set (insert) data into FRD ------------------------


// --------------------------- Home Page Loading -----------------------------

window.onload = function() {
  
}