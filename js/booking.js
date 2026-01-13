// Booking Page JS

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
function setData(userID, event, museum, year, month, day, party){
  // Must use brackets around variable name to use it as a key
  set(ref(db, 'users/' + userID + '/data/' + event + '/' + museum + '/' + year + '/' + month),{
    [day]: party
  })
  .then(() => {
    alert("Data stored successfully!");
  })
  .catch((error) => {
    alert("There was an error. Error: " + error)
  });
}

// -------------------------Update data in database --------------------------
function updateData(userID, event, museum, year, month, day, party){
  // Must use brackets around variable name to use it as a key
  // Appends data to the month instead of wiping the month's information (setData)
  update(ref(db, 'users/' + userID + '/data/' + event + '/' + museum + '/' + year + '/' + month),{
    [day]: party
  })
  .then(() => {
    alert("Data stored successfully!");
  })
  .catch((error) => {
    alert("There was an error. Error: " + error)
  });
}

// --------------------------- Home Page Loading -----------------------------
window.onload = function(){
  // Set and Update Reservation Data in FRD
  // Set (Insert) data function call
  document.getElementById('set').onclick = function(){
    const event = document.getElementById('event').value;
    const museum = document.getElementById('museum').value;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const party = document.getElementById('party').value;
    const userID = currentUser.uid;

    setData(userID, event, museum, year, month, day, party);
  };

  // Update data function call
  document.getElementById('update').onclick = function(){
    const event = document.getElementById('event').value;
    const museum = document.getElementById('museum').value;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const party = document.getElementById('party').value;
    const userID = currentUser.uid;

    updateData(userID, event, museum, year, month, day, party)
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