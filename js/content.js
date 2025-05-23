document.addEventListener("DOMContentLoaded", () => {
  fetch('content.json')
    .then(response => response.json())
    .then(data => {
      const slides = document.querySelectorAll(".carousel-slide.has-image");
      const dynamicSlides = Array.from(slides).slice(-2); // last 2 slides only

      data.slides.forEach((slideData, index) => {
        if (dynamicSlides[index]) {
          const slide = dynamicSlides[index];
          const img = slide.querySelector("img");
          const title = slide.querySelector("h2");
          const desc = slide.querySelector("p");
          const link = slide.querySelector("a");

          img.src = slideData.image;
          img.alt = slideData.title;
          title.textContent = slideData.title;
          desc.textContent = slideData.description;
          link.href = slideData.link;
          link.textContent = slideData.linkText;
        }
      });
    })
    .catch(err => console.error("Failed to load dynamic content:", err));
});