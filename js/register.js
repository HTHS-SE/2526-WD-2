/* File Name: register.js
   Coded By: Mr. Hanas
   Description: This file handles the registration of a new user.

*/

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  import {getDatabase, ref, set, update, child, get}
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";

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
  const app = initializeApp(firebaseConfig);

  // Initialize Firebase Authentication
  const auth = getAuth();

  // Return instance of your app's firebase realtime database (FRD)
  const db = getDatabase(app);

// ---------------- Register New User --------------------------------//

// When the register button is clicked
document.getElementById("register").onclick = function() {
  const firstName = document.getElementById("firstName").value;
  const lastName = document.getElementById("lastName").value;
  const email = document.getElementById("userEmail").value;

  // Firebase will requires a password of at least 6 characters
  const password = document.getElementById("userPass").value;

  // Validate user inputs
  if (!validation(firstName, lastName, email, password)) {
    return;
  };


  // Create new app user using email and password authentication
  createUserWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    // User account created and signed in successfully 
    const user = userCredential.user;
    // Add user account info to the Realtime Database
    // 'set' will create a new reference or completely replace an existing one
    // Each new user will be placed under the users node
    set(ref(db, 'users/' + user.uid + '/accountInfo'), {
      uid: user.uid,    // Save the userID for home.js reference
      email: email,
      firstName: firstName,
      lastName: lastName
    }).then(() => {
      alert('User created successfully!'); // Alert for successful creation
      window.location.href = "signIn.html"; // Redirect to login page
  })
  .catch((error) => {
    alert(error) // User creation failed
    });
  })
  .catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    alert(errorMessage);
  });
}


// --------------- Check for null, empty ("") or all spaces only ------------//
function isEmptyorSpaces(str){
  return str === null || str.match(/^ *$/) !== null
}

// ---------------------- Validate Registration Data -----------------------//
function validation(firstName, lastName, email, password) {
  let fNameRegex = /^[A-Za-z]+$/;
  let lNameRegex = /^[A-Za-z]+$/;
  let emailRegex = /^[A-Za-z0-9]+@ctemc\.org$/;

  if (isEmptyorSpaces(firstName) || isEmptyorSpaces(lastName) ||
      isEmptyorSpaces(email) || isEmptyorSpaces(password)) {
    alert("Error: All fields are required!");
    return false;
  }

  if (!fNameRegex.test(firstName)) {
    alert("The first name should only contain letters.");
    console.log(fNameRegex);
    return false;
  }

  if (!lNameRegex.test(lastName)) {
    alert("The last name should only contain letters.");
    console.log(lNameRegex);
    return false;
  }

  if (!emailRegex.test(email)) {
    alert("Please enter a valid email.");
    console.log(emailRegex);
    return false;
  }
  return true;
}