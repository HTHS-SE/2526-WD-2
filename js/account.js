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

function monthNumberToName(monthNumber) {
  return new Date(2000, monthNumber - 1).toLocaleString("en-US", {
    month: "long"
  });
}

async function getMonthCounts(year, uid) {
  console.log("getMonthCounts ran");
  const yearRef = ref(db, `users/${uid}/data/${year}`);
  const snapshot = await get(yearRef);

  const monthCounts = {};

  if (snapshot.exists()) {
    
    snapshot.forEach((monthSnap) => {
      const month = monthNumberToName(parseInt(monthSnap.key));

      const value = monthSnap.val();
      const dayCount = value ? Object.keys(value).length : 0;

      monthCounts[month] = dayCount;
      console.log(month, dayCount);
    });
  }
  return monthCounts;
}


async function createChart(year, uid) {
    const data = await getMonthCounts(year, uid); // createChart will wait for getData() to process the CSV file
    const lineChart = document.getElementById('lineChart');
    const myChart = new Chart(lineChart, {  // Construct the chart    
        type: 'line',
        data: {                         // Define data
            labels: data.xYears,        // x-axis labels
            datasets: [                 // Each object describes one dataset of y-values
                                        //  including display properties.  To add more datasets, 
                                        //  place a comma after the closing curly brace of the last
                                        //  data set object and add another dataset object. 
                {
                    label:    `Combined Global LSA and SSW Temperature in ${degreeSymbol}C`,     // Dataset label for legend
                    data:     data.yTemps,    
                    fill:     false,           // Fill area under the linechart (true = yes, false = no)
                    backgroundColor:  'rgba(255, 0, 132, 0.2)',    // Color for data marker
                    borderColor:      'rgba(255, 0, 132, 1)',      // Color for data marker border
                    borderWidth:      1   // Data marker border width
                },
                {
                    label:    `Combined NH LSA and SSW Temperature in ${degreeSymbol}C`,     // Dataset label for legend
                    data:     data.yNHtemps,    
                    fill:     false,           // Fill area under the linechart (true = yes, false = no)
                    backgroundColor:  'rgba(0, 102, 255, 0.2)',    // Color for data marker
                    borderColor:      'rgba(0, 102, 255, 1)',      // Color for data marker border
                    borderWidth:      1   // Data marker border width
                },
                {
                    label:    `Combined SH LSA and SSW Temperature in ${degreeSymbol}C`,     // Dataset label for legend
                    data:     data.ySHtemps,    
                    fill:     false,           // Fill area under the linechart (true = yes, false = no)
                    backgroundColor:  'rgba(0, 153, 51, 0.2)',    // Color for data marker
                    borderColor:      'rgba(0, 153, 51, 1)',      // Color for data marker border
                    borderWidth:      1   // Data marker border width
                },
        ]
        },
        options: {                        // Define display chart display options 
            responsive: true,             // Re-size based on screen size
            maintainAspectRatio: false,
            scales: {                     // Display options for x & y axes
                x: {                      // x-axis properties
                    title: {
                        display: true,
                        text: 'Year',     // x-axis title
                        font: {                   // font properties
                            size: 14
                        },
                    },
                    ticks: {                      // x-axis tick mark properties
                        callback: function(value, index) {
                            // Set tick marks at every 5 years
                            return index % 5 === 0 ? this.getLabelForValue(value) : '';
                        },
                        font: {
                            size: 14
                        },
                    },
                    grid: {                       // x-axis grid properties
                        color: '#6c767e'
                    }
                },
                y: {                              // y-axis properties
                    title: {
                        display: true,
                        text: 'Global Mean Temperatures (°C)',     // y-axis title
                        font: {
                            size: 14
                        },
                    },
                    ticks: {
                        min: 0,
                        maxTicksLimit: data.yTemps.length / 10,        // Actual value can be set dynamically
                        font: {
                            size: 12
                        }
                    },
                    grid: {                       // y-axis gridlines
                        color: '#6c767e'
                    }
                }
            },
            plugins: {                  // Display options for title and legend
                title: {
                    display: true,
                    text: 'Global Mean Temperature vs. Year (since 1880)',
                    font: {
                        size: 24,
                    },
                    color: '#black',
                    padding: {
                        top: 10,
                        bottom: 30
                    }
                },
                legend: {
                    align: 'start',
                    position: 'bottom',
                }
            }
        }       
    });

}




let userLink = document.getElementById('userLink');   // Username for navbar
let userLinkText = document.getElementById('userLinkText');
let currentUser = null; 

// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  console.log("Account page onload function ran");
  getMonthCounts();

  
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

  // Get user id for getMonthCounts
  const userID = currentUser.uid;
  console.log(getMonthCounts("2026", userID));


}
