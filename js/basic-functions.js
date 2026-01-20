/* File Name: basic-functions.js
   Coded By: Timothey Saks
   Description: This file contains very basic functions that are used on every page of the website.
*/

// Scroll Progress Bar
window.onscroll = function() {
        const scrollProgress = document.getElementById("scrollProgressBar");
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + "%";
    };

//Fade-in Animation on Scroll
const sections = document.querySelectorAll('.fade-section');

        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
            });
        }, { threshold: 0.2 }); // 20% of element visible before animation triggers (can be changed)

        sections.forEach(section => observer.observe(section));