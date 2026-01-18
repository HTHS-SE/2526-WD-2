// This JS file is for registering a new app user ---------------------------//

// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  import {getDatabase, ref, set, update, child, get, onValue}
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

function monthNumberToName(monthNumber) {
  return new Date(2000, monthNumber - 1).toLocaleString("en-US", {
    month: "long"
  });
}

async function getMonthCounts(year, uid) {
  const yearRef = ref(db, `users/${uid}/data/${year}`);
  const snapshot = await get(yearRef);

  const monthCounts = {};

  for (let m = 1; m <= 12; m++) {
    monthCounts[monthNumberToName(m)] = 0;
  }

  if (snapshot.exists()) {
    
    snapshot.forEach((monthSnap) => {
      const month = monthNumberToName(parseInt(monthSnap.key));

      const value = monthSnap.val();
      const dayCount = value ? Object.keys(value).length : 0;

      monthCounts[month] = dayCount;
    });
  }
  return monthCounts;
}


async function createChart(year, uid) {
    const data = await getMonthCounts(year, uid);
    const barChart = document.getElementById('bookingMonths');
    const myChart = new Chart(barChart, {
        type: 'bar',
        data: {
            labels: Object.keys(data),
            datasets: [{
                label: 'Number of Bookings',
                data: Object.values(data),
                borderWidth: 1,
                backgroundColor: '#ff5757',
                borderColor: '#FFC0CB',
            }]
        },
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Month'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Number of Bookings'
                    },
                    ticks: {
                      stepSize: 1
                    }
                }
            },
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    align: 'center',
                    position: 'bottom',
                },
                title: {
                    display: true,
                    text: `Your Bookings in ${year}`,
                    font: {
                        size: 32,
                        fontFamily: 'Playfair Display',
                        color: '#ff5757',
                    }
                }
            }
        },
    });

}

function listenToEvents(user, year, callback) {
  console.log("listening to events")
  const yearRef = ref(db, `users/${user.uid}/data/${year}`);

  // Iterate through the nodes and pull out all the values
  onValue(yearRef, (snapshot) => {
    const events = [];

    if (snapshot.exists()) {
      // Go from year to month
      snapshot.forEach(monthSnap => {
        const month = monthSnap.key; 
        // Month to day
        monthSnap.forEach(daySnap => {
          const day = daySnap.key; 
          // Day to museum (location)
          daySnap.forEach(locationSnap => {
            // Location to time
            locationSnap.forEach(timeSnap => {
              const time = timeSnap.key; 

              // Year-Month-DayTHour:Minute (turn all the values into calendar format)
              const startDate = `${year}-${month}-${day}T${time}`;
              
              const details = timeSnap.val() || {};
              
              // Push all the details to the events dictionary
              events.push({
                id: `${year}-${month}-${day}-${locationSnap.key}-${time}`, 
                title: locationSnap.key,
                start: startDate,
                allDay: false,
                extendedProps: details
              });
            });
          });
        });
      });
    }

    callback(events);
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
   // Get a datum function call
  document.getElementById('get').onclick = function(){
    const date = document.getElementById('bookingDate').value;
    const time = document.getElementById('bookingTime').value;
    const day = document.getElementById('getDay').value;
    const userID = currentUser.uid;

    getData(userID, date, time)
  }

  // Get a data set function call
  document.getElementById('getDataSet').onclick = function(){
    const year = document.getElementById('getSetYear').value;
    const month = document.getElementById('getSetMonth').value;
    const userID = currentUser.uid;

    getDataSet(userID, year, month);
  }

  // Delete a single day's data function call
  this.document.getElementById('delete').onclick = function(){
    const year = document.getElementById('delYear').value;
    const month = document.getElementById('delMonth').value;
    const day = document.getElementById('delDay').value;
    const userID = currentUser.uid;

    deleteData(userID, year, month, day);
  };
  */

  // Get user id for the chart
  const userID = currentUser.uid;
  createChart("2026", userID);


  // Set up the calendar
  const calendarEl = document.getElementById("calendar");
  let calendar;

  onAuthStateChanged(auth, (user) => {
    console.log("User state changed");
    if (!user) return;

    const year = new Date().getFullYear();

    calendar = new FullCalendar.Calendar(calendarEl, {
      initialView: "dayGridMonth",
      events: []
    });

    calendar.render();

    listenToEvents(user, year, (events) => {
      calendar.removeAllEvents();
      calendar.addEventSource(events);
    });
  });

}
