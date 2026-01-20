/* File Name: booking.js
   Coded By: Timothey Saks
   Description: This file handles all of the functions on the booking page. Specifically, this adds data to the FRD based on user inputs.
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




function getUsername() {
  // Grab value for the 'keep logged in switch'
  let keepLoggedIn = localStorage.getItem("keepLoggedIn");
  // Grab user information passed from signIn.js
  if (keepLoggedIn == 'yes') {
    console.log('Getting user from local storage');
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    console.log('Getting user from session storage');
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}



/* The set function is here in case it's needed, but it's not currently used in the code. */

/*
function setData(userID, museum, date, time, party){
  // Must use brackets around variable name to use it as a key
  console.log("Set data ran");
  set(ref(db, 'users/' + userID + '/data/' + date.substring(0, 4) + '/' + date.substring(5, 7) + '/' + date.substring(8, 10) + '/' + museum),{
    [time]: party
  })
  .then(() => {
    console.log("Data stored successfully!");
    alert("Data stored successfully!");
  })
  .catch((error) => {
    alert("There was an error. Error: " + error)
  });
}

*/

// -------------------------Update data in database --------------------------
// Note: update was used instead of set in order to prevent deleting existing data from the FRD
function updateData(userID, museum, date, time, party){
  // Go through the nodes in order to set a value
  update(ref(db, 'users/' + userID + '/data/' + date.substring(0, 4) + '/' + date.substring(5, 7) + '/' + date.substring(8, 10) + '/' + museum),{
    [time]: party
  })
  .then(() => {
    // If the update is successful, alert the user
    alert("Visit booked successfully!");
  })
  .catch((error) => {
    // This catch will run if the user fails to put in a date and time value. If this happens, it will alert the user to put in a value.
    alert("Please input a date and time.");
  });
}

// This function checks if the input date and time are valid for the selected museum (i.e. if the museum is open at the chosen time/day)
// Note: The date object was utilized a lot in this function. Days and months are zero-indexed (0 = Sunday & 0 = January) 
function checkValidDateAndTime(museum, year, month, day, time) {
  
  // Get the current date and the date inputted ad compare them. Alerts the user if they put in a date that's in the past.
  const currentDate = new Date();
  const inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (inputDate < currentDate) {
    alert("Please input a valid date in the future.");
    return false;
  }

  // Checks opening hours for each museum
  if (museum === "Musée d'Orsay") {
    // On Thursdays, the museum is open later so the hours are adjusted
    if (inputDate.getDay() === 4) {
      if (!("09:30" < time && time < "21:45")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    // On every other day, the museum is open from 9:30 AM to 6:00 PM
    } else {
      if (!("09:30" < time && time < "18:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    }
    // Checks all the days the museum is closed. (May 1st, Christmas, and Mondays)
    if (isSpecificDay(inputDate, 4, 1) || isSpecificDay(inputDate, 11, 25) || inputDate.getDay() === 1) {
      alert(`${museum} is not open on the day you chose.`)
      return false;
    }
  } else if (museum === "Musée Marmottan Monet") {
    // On Thursdays, the museum is open later so the hours are adjusted
    if (inputDate.getDay() === 4) {
      if (!("10:00" < time && time < "21:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    // On every other day, the museum is open from 10:00 AM to 6:00 PM
    } else {
      if (!("10:00" < time && time < "18:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    }
    // Checks all the days the museum is closed. (May 1st, Christmas, January 1st, and Mondays)
    if (inputDate.getDay() === 1 || isSpecificDay(inputDate, 11, 25) || isSpecificDay(inputDate, 0, 1) || isSpecificDay(inputDate, 4, 1)) {
      alert(`${museum} is not open on the day you chose.`)
      return false;
    }
  } else if (museum === "The Metropolitan Museum of Art") {
    // The museum opens later on Fridays and Saturdays
    if (inputDate.getDay() === 5 || inputDate.getDay() === 6) {
      if (!("10:00" < time && "21:00" < time)) {
        alert(`${museum} is not open at the time you chose.`)
        return false;
      }
    // On every other day, the museum is open from 10:00 AM to 5:00 PM
      } else {
        if (!("10:00" < time && time < "17:00")) {
          alert(`${museum} is not open at the time you chose.`)
          return false
        }
      }
    // Checks all the day the museum is closed. Wednesdays, January 1st, Christmas, Thanksgiving, and the first Monday of May
    if (inputDate.getDay() === 3 || isSpecificDay(inputDate, 0, 1) || isSpecificDay(inputDate, 11, 25) || isSpecificDay(inputDate, 10, 26) || isFirstMondayOfMay(inputDate)) {
      alert(`${museum} is not open on the day you chose.`)
      return false;
    }
  } else if (museum === "Art Institute of Chicago") {
    // Museum is open later on Thursdays
    if (inputDate.getDay() === 4) {
      if (!("11:00" < time && time < "20:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    // Every other day, the museum is open from 11:00 AM to 6:00 PM
    } else {
      if (!("11:00" < time && time < "17:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    }
    // Checks all the days the museum is closed. Tuesdays, Christmas, and Thanksgiving
      if (inputDate.getDay() === 2 || isSpecificDay(inputDate, 11, 25) || isSpecificDay(inputDate, 10, 26)) {
        alert(`${museum} is not open on the day you chose.`)
        return false;
      }
}
  return true;
}

// Helper function to checkValidDateAndTime that compares two days to see if they're the same
function isSpecificDay(date, month, day) {
  return date.getMonth() === month && date.getDate() === day;
}

// Helper function to checkValidDateAndTime that checks if a date is the first Monday of May
function isFirstMondayOfMay(date) {
  const d = new Date(date); // allow passing string or Date

  const isMay = d.getMonth() === 4;      // May = 4 (0-based)
  const isMonday = d.getDay() === 1;     // Monday = 1
  const isFirstWeek = d.getDate() <= 7;  // 1–7

  return isMay && isMonday && isFirstWeek;
}



// Get the userLink element on the nav bar
let userLink = document.getElementById('userLink');
let userLinkText = document.getElementById('userLinkText');
let currentUser = null; 

// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  console.log("Nav bar update onload function ran");


  getUsername();  // Get current user's first name

  // If the user isn't logged it, the nav bar will take them to the sign in page.
  if (currentUser == null) {
    userLinkText.innerText = "Login";
    userLink.href = "signIn.html";
  } 
  // If they are logged in, update the nav bar to take them to the Account page.
    else {
    userLinkText.innerText = "Account";
    userLink.href = "account.html";
    }




  // Update data function call
  document.getElementById('update').onclick = function(){
    // Checks if the user is logged in
    if (currentUser != null) {
        // User is logged in, pull all the values
        const museum = document.getElementById('museum').value;
        const party = document.getElementById('party').value;
        const date = document.getElementById('date').value;
        const time = document.getElementById('time').value;
        const userID = currentUser.uid;
        // If the user didn't select a museum, alert them to put in a valid museum name
        if (museum === "Museum Name") {
            alert("Please input a valid museum name.");
            } else if (checkValidDateAndTime(museum, date.substring(0, 4), date.substring(5, 7), date.substring(8, 10), time) == false) {
            // Checks if there is an invalid date or time
        } else {
            updateData(userID, museum, date, time, party);
        }
    } else {
    // If the user is not logged in, alert them to sign in or make an account.
        alert("Please log in or make an account to book a trip.");
    }

  }
}
