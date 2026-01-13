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

function setData(userID, museum, year, month, day, party){
  // Must use brackets around variable name to use it as a key
  console.log("Set data ran");
  set(ref(db, 'users/' + userID + '/data/' + museum + '/' + year + '/' + month),{
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
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const party = document.getElementById('party').value;
    const userID = currentUser.uid;

    setData(userID, museum, year, month, day, party);
  };

  // Update data function call
  document.getElementById('update').onclick = function(){
    const museum = document.getElementById('museum').value;
    const year = document.getElementById('year').value;
    const month = document.getElementById('month').value;
    const day = document.getElementById('day').value;
    const party = document.getElementById('party').value;
    const userID = currentUser.uid;

    updateData(userID, museum, year, month, day, party)
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
