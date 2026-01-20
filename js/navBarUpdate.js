/* File Name: navBarUpdate.js
   Coded By: Timothey Saks
   Description: This file handles the updating of the navigation bar based on user authentication status. (logged in vs not logged in)
   The magnify function is also housed in this file, because it applies to all the pages that need the nav bar update.
*/



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

// Get the userLink element on the nav bar
let userLink = document.getElementById('userLink');
let userLinkText = document.getElementById('userLinkText');
let currentUser = null; 

// --------------------------- Home Page Loading -----------------------------
window.onload = function() {

  // Set Welcome Message
  getUsername();  // Get current user's first name

  // If the user is not logged in, set the nav bar link to the sign in page
  if (currentUser == null) {
    userLinkText.innerText = "Login";
    userLink.href = "signIn.html";
  } 
  // If the user is logged in, set the nav bar link to the account page
  else {
    userLinkText.innerText = "Account";
    userLink.href = "account.html";
    }

  
  // Run magnify function
  magnifyByClass("timeline-img", 2);
  magnifyByClass("index-img", 1.5);

  }
