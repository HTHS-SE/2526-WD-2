// ----------------- Page Loaded After User Sign-in -------------------------//
// ----------------- Firebase Setup & Initialization ------------------------//
// ----------------- Firebase Setup & Initialization ------------------------//
// Import the functions you need from the SDKs you need
  import { initializeApp } from "https://www.gstatic.com/firebasejs/12.6.0/firebase-app.js";
  import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } 
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-auth.js";

  import {getDatabase, ref, set, update, child, get}
    from "https://www.gstatic.com/firebasejs/12.6.0/firebase-database.js";


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




                              // Initialize currentUser to null

// ----------------------- Get User's Name'Name ------------------------------
function getUsername() {
  // Grab value for the 'keep logged in switch'
  let keepLoggedIn = localStorage.getItem("keepLoggedIn");
  console.log('Keep logged in value:', keepLoggedIn);
  // Grab user information passed from signIn.js
  if (keepLoggedIn == 'yes') {
    console.log('Getting user from local storage');
    currentUser = JSON.parse(localStorage.getItem('user'));
  } else {
    console.log('Getting user from session storage');
    currentUser = JSON.parse(sessionStorage.getItem('user'));
  }
}


// Magnify Function
function magnifyByClass(imgClass, zoom) {
  // Select all images with the given class (e.g., ".magnifiable")
  const imgs = document.querySelectorAll(`.${imgClass}`);

  imgs.forEach(img => {
    const glass = document.createElement("DIV");
    glass.classList.add("img-magnifier-glass");

    // Insert the magnifier before the image
    img.parentElement.insertBefore(glass, img);

    // Set up magnifier background
    glass.style.backgroundImage = `url('${img.src}')`;
    glass.style.backgroundRepeat = "no-repeat";
    glass.style.backgroundSize = `${img.width * zoom}px ${img.height * zoom}px`;

    const bw = 3;
    const w = glass.offsetWidth / 2;
    const h = glass.offsetHeight / 2;

    img.addEventListener("mouseenter", () => {
      glass.style.opacity = "1";
    });

    img.addEventListener("mouseleave", () => {
      glass.style.opacity = "0";
    });

    window.addEventListener("resize", () => {
      imgs.forEach(img => {
        const glass = img.previousElementSibling; // assuming glass is inserted before img
        if (glass) {
          glass.style.backgroundSize = `${img.offsetWidth * zoom}px ${img.offsetHeight * zoom}px`;
        }
      });
    });

    // Mouse and touch events
    ["mousemove", "touchmove"].forEach(evt => {
      glass.addEventListener(evt, moveMagnifier);
      img.addEventListener(evt, moveMagnifier);
    });

    function moveMagnifier(e) {
      e.preventDefault();
      const pos = getCursorPos(e);
      let x = pos.x;
      let y = pos.y;

      // Prevent magnifier from going outside image bounds
      if (x > img.width - w / zoom) x = img.width - w / zoom;
      if (x < w / zoom) x = w / zoom;
      if (y > img.height - h / zoom) y = img.height - h / zoom;
      if (y < h / zoom) y = h / zoom;

      // Move magnifier and update background position
      glass.style.left = `${x - w}px`;
      glass.style.top = `${y - h}px`;
      glass.style.backgroundPosition = `-${(x * zoom - w + bw)}px -${(y * zoom - h + bw)}px`;
    }

    function getCursorPos(e) {
      e = e || window.event;
      const rect = img.getBoundingClientRect();
      const x = e.pageX - rect.left - window.pageXOffset;
      const y = e.pageY - rect.top - window.pageYOffset;
      return { x, y };
    }
  });
}

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

// -------------------------Update data in database --------------------------
function updateData(userID, museum, date, time, party){
  // Must use brackets around variable name to use it as a key
  // Appends data to the month instead of wiping the month's information (setData)
  update(ref(db, 'users/' + userID + '/data/' + museum + '/' + date.substring(0, 4) + '/' + date.substring(5, 7) + '/' + date.substring(8, 10) + '/' + museum),{
    [time]: party
  })
  .then(() => {
    alert("Data stored successfully!");
  })
  .catch((error) => {
    alert("There was an error. Error: " + error)
  });
}

function checkValidDateAndTime(museum, year, month, day, time) {
  const currentDate = new Date();
  const inputDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  if (inputDate < currentDate) {
    alert("Please input a valid date in the future.");
    return false;
  }
  if (museum === "Musée d'Orsay") {
    if (inputDate.getDay() === 4) {
      if (!("09:30" < time && time < "21:45")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    } else {
      if (!("09:30" < time && time < "18:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    }
    if (isSpecificDay(inputDate, 3, 1) || isSpecificDay(inputDate, 11, 25) || inputDate.getDay() === 1) {
      alert(`${museum} is not open on the day you chose.`)
      return false;
    }
  } else if (museum === "Musée Marmottan Monet") {
    if (inputDate.getDay() === 4) {
      if (!("10:00" < time && time < "21:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    } else {
      if (!("10:00" < time && time < "18:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      }
    }
    if (inputDate.getDay() === 1 || isSpecificDay(inputDate, 11, 25) || isSpecificDay(inputDate, 0, 1) || isSpecificDay(inputDate, 4, 1)) {
      alert(`${museum} is not open on the day you chose.`)
      return false;
    }
  } else if (museum === "The Metropolitan Museum of Art") {
    if (inputDate.getDay() === 5 || inputDate.getDay() === 6) {
      if (!("10:00" < time && "21:00" < time)) {
        alert(`${museum} is not open at the time you chose.`)
        return false;
      }
      } else {
        if (!("10:00" < time && time < "17:00")) {
          alert(`${museum} is not open at the time you chose.`)
          return false
        }
      }

    if (isSpecificDay(inputDate, 0, 1) || isSpecificDay(inputDate, 11, 25) || isSpecificDay(inputDate, 10, 26) || isFirstMondayOfMay(inputDate)) {
      alert(`${museum} is not open on the day you chose.`)
      return false;
    }
  } else {
    if (inputDate.getDay() === 4) {
      if (!("11:00" < time && time < "20:00")) {
        alert(`${museum} is not open at the time you chose.`)
        return false
      } else {
        if (!("11:00" < time && time < "17:00")) {
          alert(`${museum} is not open at the time you chose.`)
          return false
        }
      }
      if (isSpecificDay(inputDate, 11, 25) || isSpecificDay(inputDate, 10, 26) || inputDate.getDay() === 2) {
        alert(`${museum} is not open on the day you chose.`)
        return false;
      }
  }
  return true;
}
}

function isSpecificDay(date, month, day) {
  return date.getMonth() === month && date.getDate() === day;
}

function isFirstMondayOfMay(date) {
  const d = new Date(date); // allow passing string or Date

  const isMay = d.getMonth() === 4;      // May = 4 (0-based)
  const isMonday = d.getDay() === 1;     // Monday = 1
  const isFirstWeek = d.getDate() <= 7;  // 1–7

  return isMay && isMonday && isFirstWeek;
}


// ----------------------Get a datum from FRD (single data point)---------------
function getData(userID, date, time){

  let dateVal = document.getElementById('bookingDate')
  let MuseumVal = document.getElementById('museumVal')
  let timeVal = document.getElementById('bookingTime')
  let partySizeVal = document.getElementById('partySizeVal')
 
  const dbref = ref(db)     // Firebase parameter for getting data

  // Provide the path through the nodes to the data
  get(child(dbref, 'users/' + userID + '/data/' + museum + '/' + date.substring(0, 4) + '/' + date.substring(5, 7) + '/' + date.substring(8, 10) + '/' + museum ))
  .then((snapshot) => {

    if(snapshot.exists()){
      dateVal = date;
      museumVal = museum;
      timeVal = time;
      // To get specific value from the provided key: snapshot.val()[key]
      partySizeVal.textContent = snapshot.val()[time]
    }
    else{
      alert('No data found')
    }
  })
  .catch((error) => {
    alert('Unsuccessful, error: ' + error)
  });
}


// ---------------------------Get a month's data set --------------------------
// Must be an async function because you need to get all the data from FRD
// before you can process it for a table or graph
async function getDataSet(userID, day, time){

  let dateVal = document.getElementById('bookingDate');

  dateVal.textContent = `Date: ${day}`;

  const days = [];
  const temps = [];
  const tbodyEl = document.getElementById('tbody');     // Select <tbody> element

  const dbref = ref(db);    // Firebase parameter to access database

  // Wait for all data to be pulled from FRD
  // Must provide the path through the nodes to the data
  await get(child(dbref, 'users/' + userID + '/data/' + museum + '/' + dateVal.substring(0, 4) + '/' + dateVal.substring(5, 7) + '/' + dateVal.substring(8, 10))).then((snapshot) => {

    if(snapshot.exists()){
      console.log(snapshot.val())

      snapshot.forEach(child => {
        console.log(child.key, child.val())
        // Push values to the corresponding arrays
        days.push(child.key);
        temps.push(child.val());
      })
    }
    else{
      alert('No data found')
    }
  })
  .catch((error) => {
    alert('unsuccessful, error: ' + error);
  })

  // Dynamically add table rows to HTML using string interpolation
  tbodyEl.innerHTML = '';       // Clear any existing table
  for(let i = 0; i < days.length; i++){
    addItemToTable(days[i], temps[i], tbodyEl)
  }
}

// Add a item to the table of data
function addItemToTable(day, temp, tbody){
  console.log(day, temp);
  let tRow = document.createElement("tr")
  let td1 = document.createElement("td")
  let td2 = document.createElement("td")

  td1.innerHTML = day;
  td2.innerHTML = temp;

  tRow.appendChild(td1);
  tRow.appendChild(td2);

  tbody.append(tRow);
}

// -------------------------Delete a day's data from FRD ---------------------
function deleteData(userID, year, time){
  remove(ref(db, 'users/' + userID + '/data/' + museum + '/' + dateVal.substring(0, 4) + '/' + dateVal.substring(5, 7) + '/' + dateVal.substring(8, 10)))
  .then(() => {
    alert('Data removed successfully');
  })
  .catch((error) => {
    alert('Unsuccessful, error: '+ error)
  })
}

// ---------------------// Get reference values -----------------------------

let userLink = document.getElementById('userLink');   // Username for navbar
let userLinkText = document.getElementById('userLinkText');
let currentUser = null; 

// --------------------------- Home Page Loading -----------------------------
window.onload = function() {
  console.log("Nav bar update onload function ran");

  // ------------------------- Set Welcome Message -------------------------
  getUsername();  // Get current user's first name
  if (currentUser == null) {
    userLinkText.innerText = "Login";
    userLink.href = "signIn.html";
  } else {
    //console.log('Else statement executed');
    userLinkText.innerText = "Account";
    userLink.href = "account.html";
    }

  
  // Run magnify function
  magnifyByClass("timeline-img", 2);
  magnifyByClass("index-img", 1.5);

  console.log("On load function ran");
  // Set and Update Reservation Data in FRD
  // Set (Insert) data function call
  document.getElementById('set').onclick = function(){
    console.log("Set button clicked");
    const museum = document.getElementById('museum').value;
    const party = document.getElementById('party').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const userID = currentUser.uid;

    if (museum === "Museum Name") {
      alert("Please input a valid museum name.");
    } else if (checkValidDateAndTime(museum, date.substring(0, 4), date.substring(5, 7), date.substring(8, 10), time) == false) {
    } else {
      setData(userID, museum, date, time, party);
    }
  };

  // Update data function call
  document.getElementById('update').onclick = function(){
    console.log("Set button clicked");
    const museum = document.getElementById('museum').value;
    const party = document.getElementById('party').value;
    const date = document.getElementById('date').value;
    const time = document.getElementById('time').value;
    const userID = currentUser.uid;
    if (museum === "Museum Name") {
      alert("Please input a valid museum name.");
    } else if (checkValidDateAndTime(museum, date.substring(0, 4), date.substring(5, 7), date.substring(8, 10), time) == false) {
    } else {
      updateData(userID, museum, date, time, party);
    }
  };

  }
