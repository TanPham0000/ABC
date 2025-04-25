document.addEventListener('DOMContentLoaded', function() {
  const carouselTrack = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');
  
  let currentIndex = 0;
  let startPos = 0;
  let currentTranslate = 0;
  let prevTranslate = 0;
  let isDragging = false;
  let animationID = 0;
  let startTime = 0;
  
  // Create dots based on number of slides
  function createDots() {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => {
        goToSlide(index);
      });
      dotsContainer.appendChild(dot);
    });
    
    // Set initial active dot
    updateDots();
  }
  
  // Update active dot
  function updateDots() {
    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, index) => {
      if (index === currentIndex) {
        dot.classList.add('active');
      } else {
        dot.classList.remove('active');
      }
    });
  }
  
  // Initialize the carousel
  function initCarousel() {
    slides[currentIndex].classList.add('active');
    createDots();
    
    // Set up touch and mouse events
    setupDraggable();
  }
  
  // Function to show a specific slide
  function showSlide(index) {
    // Hide all slides
    slides.forEach(slide => {
      slide.classList.remove('active');
    });
    
    // Show the current slide
    slides[index].classList.add('active');
    
    // Update dots
    updateDots();
  }
  
  // Function to go to a specific slide
  function goToSlide(index) {
    currentIndex = index;
    showSlide(currentIndex);
  }
  
  // Function to move to the next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % slides.length;
    showSlide(currentIndex);
  }
  
  // Function to move to the previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + slides.length) % slides.length;
    showSlide(currentIndex);
  }
  
  // Set up draggable functionality
  function setupDraggable() {
    // Touch Events
    carouselTrack.addEventListener('touchstart', dragStart);
    carouselTrack.addEventListener('touchmove', drag);
    carouselTrack.addEventListener('touchend', dragEnd);
    
    // Mouse Events
    carouselTrack.addEventListener('mousedown', dragStart);
    carouselTrack.addEventListener('mousemove', drag);
    carouselTrack.addEventListener('mouseup', dragEnd);
    carouselTrack.addEventListener('mouseleave', dragEnd);
  }
  
  function dragStart(e) {
    e.preventDefault();
    startTime = new Date().getTime();
    
    // Get starting positions
    if (e.type === 'touchstart') {
      startPos = e.touches[0].clientY;
    } else {
      startPos = e.clientY;
    }
    
    isDragging = true;
    carouselTrack.classList.add('dragging');
    animationID = requestAnimationFrame(animation);
  }
  
  function drag(e) {
    if (isDragging) {
      let currentPosition = 0;
      
      // Get current position
      if (e.type === 'touchmove') {
        currentPosition = e.touches[0].clientY;
      } else {
        currentPosition = e.clientY;
      }
      
      // Calculate how far we've dragged
      currentTranslate = prevTranslate + currentPosition - startPos;
    }
  }
  
  function dragEnd() {
    cancelAnimationFrame(animationID);
    isDragging = false;
    carouselTrack.classList.remove('dragging');
    
    const moveTime = new Date().getTime() - startTime;
    const movedDistance = currentTranslate - prevTranslate;
    
    // If dragged far enough or flicked fast enough
    if (movedDistance < -50 || (movedDistance < 0 && moveTime < 300)) {
      // Dragged down - go to next slide
      nextSlide();
    } else if (movedDistance > 50 || (movedDistance > 0 && moveTime < 300)) {
      // Dragged up - go to previous slide
      prevSlide();
    }
    
    // Reset values
    currentTranslate = 0;
    prevTranslate = 0;
  }
  
  // Animation for smooth dragging
  function animation() {
    if (isDragging) {
      animationID = requestAnimationFrame(animation);
    }
  }
  
  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', prevSlide);
  nextBtn.addEventListener('click', nextSlide);
  
  // Initialize the carousel
  initCarousel();
  
  // Handle overlays
  const openOverlayButtons = document.querySelectorAll('.read-more');
  
  openOverlayButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetOverlay = this.getAttribute('data-overlay-target');
      const overlay = document.getElementById(targetOverlay);
      
      if (overlay) {
        overlay.classList.add('active');
      } else {
        // If specific overlay not found, open the default one
        const defaultOverlay = document.querySelector('.more-content');
        if (defaultOverlay) {
          defaultOverlay.classList.add('active');
        }
      }
    });
  });
  
  // Close overlay button functionality
  const closeButtons = document.querySelectorAll('.close-content');
  
  closeButtons.forEach(button => {
    button.addEventListener('click', function() {
      const overlay = this.closest('.more-content');
      if (overlay) {
        overlay.classList.remove('active');
      }
    });
  });
  
  // Auto-advance carousel (optional)
  // Uncomment this if you want auto-sliding
  /*
  const autoSlideInterval = 5000; // 5 seconds
  setInterval(() => {
    nextSlide();
  }, autoSlideInterval);
  */
});
