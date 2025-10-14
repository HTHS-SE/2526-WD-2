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

window.onload = function() {
  magnifyByClass("timeline-img", 2);
};
