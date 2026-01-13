// This JS file is for registering a new app user ---------------------------//

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

function getUsername() {
  // Grab value for the 'keep logged in switch'
  let keepLoggedIn = localStorage.getItem("keepLoggedIn");

  // Grab user information passed from signIn.js
  if (keepLoggedIn == 'yes') {
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}

function SignOutUser() {
  sessionStorage.removeItem('user');  // Clear session storage
  localStorage.removeItem('user');     // Clear local storage
  localStorage.removeItem('keepLoggedIn');

  signOut(auth).then(() => {
    // Sign out successful
  }).catch((error) => {
    // Error occurred
  });

  window.location = "index.html";
}

function getData(userID, year, month, day) {
  let yearVal = document.getElementById('yearVal');
  let monthVal = document.getElementById('monthVal');
  let dayVal = document.getElementById('dayVal');
  let tempVal = document.getElementById('tempVal');

  const dbref = ref(db); // Firebase parameter for getting data
  
  // Provide the path through the nodes to the data
  get(child(dbref, 'users/' + userID + '/data/' + year + '/' + month))
    .then((snapshot) => {
      if (snapshot.exists) {
        yearVal.textContent = year;
        monthVal.textContent = month;
        dayVal.textContent = day;

        // To get specific values from the provided key: snapshot.val()[key]
        tempVal.textContent = snapshot.val()[day];
      } else {
        alert("No data found");
      }
  }).catch((error) => {
    alert('Unsuccessful, error: ' + error);
  });
}

let userLink = document.getElementById('userLink');   // Username for navbar
let userLinkText = document.getElementById('userLinkText');
let currentUser = null; 

// --------------------------- Home Page Loading -----------------------------
window.onload = function() {


  
  getUsername();  // Get current user's first name
  
  // Update navbar
  

  userLinkText.innerText = "Sign Out";
  userLink.href = "index.html";
  this.document.getElementById('userLink').onclick = function() {
      SignOutUser();
  };

  // Set Welcome Message
  document.getElementById("accountHeading").innerText = "Welcome, " + currentUser.firstName;

  // Get Data Function
  /*
  document.getElementById('get').onclick = function() {
    const year = document.getElementById('getYear').value;
    const month = document.getElementById('getMonth').value;
    const day = document.getElementById('getDay').value;
    const userID = currentUser.uid;

    getData(userID, year, month, day);
  */

  
    }


