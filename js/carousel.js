// js/carousel.js

let currentSlide = 0;
let data = [];

function fetchCarouselData() {
  fetch("/carousel_data.json")
    .then((response) => response.json())
    .then((json) => {
      data = json;
      renderCarouselItems();
      updateSlide();
    })
    .catch((error) => console.error("Error loading carousel data:", error));
}

// Updated renderCarouselItems() function
function renderCarouselItems() {
  const track = document.querySelector(".carousel-track");
  track.innerHTML = "";

  data.forEach((item, index) => {
    const slide = document.createElement("div");
    slide.className = "carousel-item";
    slide.setAttribute("data-index", index);

    if (item.type === "video") {
      slide.innerHTML = `
        <video class="carousel-content" autoplay loop muted playsinline>
          <source src="${item.background}" type="video/mp4">
        </video>
        <a href="${item.clickout}" target="_blank" rel="noopener noreferrer">
          <div class="overlay-text">${item.text}</div>
        </a>
      `;
    } else {
      slide.innerHTML = `
        <img class="carousel-content" src="${item.background}" alt="Carousel image ${index + 1}">
        <a href="${item.clickout}" target="_blank" rel="noopener noreferrer">
          <div class="overlay-text">${item.text}</div>
        </a>
      `;
    }
    track.appendChild(slide);
  });
}

function updateSlide() {
  const track = document.querySelector(".carousel-track");
  const slides = track.querySelectorAll(".carousel-item");
  const orientation = window.innerWidth > window.innerHeight ? "horizontal" : "vertical";
  
  const translate = orientation === "horizontal"
    ? `translateX(-${currentSlide * 100}%)`
    : `translateY(-${currentSlide * 100}%)`;

  track.style.transform = translate;

  slides.forEach((slide, index) => {
    if (data.length === 0) return;
    const video = slide.querySelector("video");
      if (index === currentSlide) {
      slide.classList.add("active");
      if (video) video.play();
    } else {
      slide.classList.remove("active");
      if (video) video.pause();
    }
  });
}

function goToNextSlide() {
  currentSlide = (currentSlide + 1) % data.length;
  updateSlide();
}

function goToPrevSlide() {
  currentSlide = (currentSlide - 1 + data.length) % data.length;
  updateSlide();
}

function handleSwipe() {
  let startX, startY;

  const carousel = document.querySelector(".carousel");

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
  });

  carousel.addEventListener("touchend", (e) => {
    const deltaX = e.changedTouches[0].clientX - startX;
    const deltaY = e.changedTouches[0].clientY - startY;

    const orientation = window.innerWidth > window.innerHeight ? "horizontal" : "vertical";
    const threshold = 30; // sensitivity

    if (orientation === "horizontal") {
      if (Math.abs(deltaX) > threshold) {
        if (deltaX < -50) goToNextSlide();
        else if (deltaX > 50) goToPrevSlide();
      }
    } else {
      if (Math.abs(deltaY) > threshold) {
        if (deltaY < -50) goToNextSlide();
        else if (deltaY > 50) goToPrevSlide();
      }
    }
  });
}

function setupCarousel() {
  fetchCarouselData();
  handleSwipe();

  // Optional: autoplay every 50s
  setInterval(goToNextSlide, 50000);
}

document.querySelector(".carousel-btn.next").addEventListener("click", goToNextSlide);
document.querySelector(".carousel-btn.prev").addEventListener("click", goToPrevSlide);

setupCarousel();
