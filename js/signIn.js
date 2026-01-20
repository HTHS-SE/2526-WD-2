/* File Name: signIn.js
   Coded By: Mr. Hanas
   Description: This file handles the user sign-in process.

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


document.getElementById('signIn').onclick = function() {

    // Get user's email and password for signing in
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    console.log(email, password);

    // Attempt to sign in the user
    signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
        // Create user credential and store the user ID
        const user = userCredential.user;

        // Log sign-in date in the database
        // 'update' will only add the last login info and won't overwrite everything else
        let logDate = new Date();
        update(ref(db, 'users/' + user.uid + '/accountInfo'), {
            last_login: logDate,
        })
        .then(() => {
            // User signed in successfully
            alert('User signed in successfully!');

            // Get a snapshot of all the user information that will be passed
            // to the login function and stored in either session or local storage
            // snapshot - copy of a system's state at a specific point in time
            get(ref(db, 'users/' + user.uid + '/accountInfo')).then((snapshot) => {
                if (snapshot.exists()) {
                    console.log(snapshot.val());
                    logIn(snapshot.val());
                } else {
                    console.log('User does not exist.');
                }
            })
            .catch((error) => {
                console.log(error);
            });
        })
        .catch((error) => {
            alert("Invalid email or password.");
        })
    })
    .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        alert("Invalid email or password.");
    })
}



// ---------------- Keep User Logged In ----------------------------------//
function logIn(user) {
    let keepLoggedIn = document.getElementById('keepLoggedInSwitch').ariaChecked;

    // Session storage is temporary (only while browser session is active)
    // Information saved as string (must convert JS object to string)
    // Session storage will be cleared with a signOut() function in home.js
    if(!keepLoggedIn) {
        sessionStorage.setItem('user', JSON.stringify(user));
        window.location = 'account.html';      // Redirect browser to home.html
    }

    // Local storage is permanent (keep user logged in even if browser is closed)
    // Local storage will be cleared with signOut() function in home.js
    else {
        localStorage.setItem('keepLoggedIn', 'yes');
        localStorage.setItem('user', JSON.stringify(user));
        window.location = "account.html";
    }
}

