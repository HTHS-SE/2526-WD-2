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

// Sign-out function that will remove user info from local/session storage and
// sign-out from FRD
function SignOutUser(){
  sessionStorage.removeItem('user');        // Clear session storage
  localStorage.removeItem('user');          // Clear local storage
  localStorage.removeItem('keepLoggedIn');

  signOutLink(auth).then(() => {
    // Sign out successful
  }).catch((error) => {
    // Error occured
  });

  window.location = "home.html"
}

// ------------------------Set (insert) data into FRD ------------------------
function setData(userID, year, month, day, temperature){
  // Must use brackets around variable name to use it as a key
  set(ref(db, 'users/' + userID + '/data/' + year + '/' + month),{
    [day]: temperature
  })
  .then(() => {
    alert("Data stored successfully!");
  })
  .catch((error) => {
    alert("there was an error. Error: " + error)
  });
}

// -------------------------Update data in database --------------------------
function updateData(userID, year, month, day, temperature){
  // Must use brackets around variable name to use it as a key
  // Appends data to the month instead of wiping the month's information (setData)
  update(ref(db, 'users/' + userID + '/data/' + year + '/' + month),{
    [day]: temperature
  })
  .then(() => {
    alert("Data stored successfully!");
  })
  .catch((error) => {
    alert("there was an error. Error: " + error)
  });
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  // ------------------------- Set Welcome Message -------------------------
  getUsername();    // Get current user's first name
  if(currentUser == null){
    userLink.innerText = "Create New Account";
    userLink.classList.replace("nav-link", "btn");
    userLink.classList.add("btn-primary");
    userLink.href = "register.html";

    signOutLink.innerText = "Sign In";
    signOutLink.classList.replace("nav-link", "btn");
    signOutLink.classList.add("btn-success");
    signOutLink.href = "signIn.html";
  }
  else {
    userLink.innerText = currentUser.firstname;
    welcome.innerText = "Welcome" + currentUser.firstname;
    userLink.classList.replace("btn", "nav-link");
    userLink.classList.add("btn-primary");
    userLink.href = "#";

    signOutLink.innerText = "Sign Out";
    signOutLink.classList.replace("btn", "nav-link");
    signOutLink.classList.add("btn-success");
    this.document.getElementById('signOut').onclick = function(){
      SignOutUser();
    }
  }

  // Set and Update Reservation Data in FRD
  // Set (Insert) data function call
  document.getElementById('set').onclick = function(){
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const temperature = document.getElementById('temperature').value;
    const userID = currentUser.uid;

    setData(userID, year, month, day, temperature);
  };


  // Update data function call
  document.getElementById('update').onclick = function(){
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const temperature = document.getElementById('temperature').value;
    const userID = currentUser.uid;

    updateData(userID, year, month, day, temperature)
  }

//   // Get a datum function call
//   document.getElementById('get').onclick = function(){
//     const year = document.getElementById('getYear').value;
//     const month = document.getElementById('getMonth').value;
//     const day = document.getElementById('getDay').value;
//     const userID = currentUser.uid;

//     getData(userID, year, month, day)
//   }

//   // Get a data set function call
//   document.getElementById('getDataSet').onclick = function(){
//     const year = document.getElementById('getSetYear').value;
//     const month = document.getElementById('getSetMonth').value;
//     const userID = currentUser.uid;

//     getDataSet(userID, year, month);
//   }

//   // Delete a single day's data function call
//   this.document.getElementById('delete').onclick = function(){
//     const year = document.getElementById('delYear').value;
//     const month = document.getElementById('delMonth').value;
//     const day = document.getElementById('delDay').value;
//     const userID = currentUser.uid;

//     deleteData(userID, year, month, day);
//   };
}