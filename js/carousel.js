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
  let autoSlideInterval = 5000; // 5 seconds between slides
  let autoSlideTimer; // Timer reference for auto-sliding
  let isScrolling = false; // Flag to prevent multiple wheel triggers
  let scrollTimeout; // Timeout for wheel event throttling
  
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
    setupWheelEvents();
    
    // Start auto-sliding
    startAutoSlide();
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
    
    // Reset the auto-slide timer whenever a slide changes
    resetAutoSlideTimer();
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
  
  // Set up mouse wheel events
  function setupWheelEvents() {
    carouselTrack.addEventListener('wheel', handleWheel, { passive: false });
  }
  
  // Handle mouse wheel events
  function handleWheel(e) {
    // Prevent page scrolling
    e.preventDefault();
    
    // If already processing a scroll event, return
    if (isScrolling) return;
    
    // Set scrolling flag to true
    isScrolling = true;
    
    // Determine scroll direction
    if (e.deltaY > 0) {
      // Scrolling down
      prevSlide();
    } else {
      // Scrolling up
      nextSlide();
    }
    
    // Clear any existing timeout
    clearTimeout(scrollTimeout);
    
    // Set a timeout to reset the scrolling flag
    // This prevents rapid successive wheel events
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 500); // Throttle wheel events to one every 500ms
  }
  
  // Start auto-sliding
  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      nextSlide();
    }, autoSlideInterval);
  }
  
  // Reset the auto-slide timer
  function resetAutoSlideTimer() {
    // Clear the existing timer
    clearInterval(autoSlideTimer);
    
    // Start a new timer
    startAutoSlide();
  }
  
  // Stop auto-sliding (used when user interacts with carousel)
  function pauseAutoSlide() {
    clearInterval(autoSlideTimer);
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
    
    // Pause auto-slide during user interaction
    pauseAutoSlide();
    
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
    } else {
      // If no significant movement, restart auto-slide
      resetAutoSlideTimer();
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
  
  // Pause auto-slide when user hovers over carousel
  carouselTrack.addEventListener('mouseenter', pauseAutoSlide);
  
  // Resume auto-slide when user leaves carousel
  carouselTrack.addEventListener('mouseleave', resetAutoSlideTimer);
  
  // Event listeners for navigation buttons
  prevBtn.addEventListener('click', () => {
    prevSlide();
    // No need to reset timer here as showSlide() will do it
  });
  
  nextBtn.addEventListener('click', () => {
    nextSlide();
    // No need to reset timer here as showSlide() will do it
  });
  
  // Initialize the carousel
  initCarousel();
  
  // Handle overlays
  const openOverlayButtons = document.querySelectorAll('.read-more');
  
  openOverlayButtons.forEach(button => {
    button.addEventListener('click', function() {
      // Pause auto-slide when overlay is open
      pauseAutoSlide();
      
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
        // Resume auto-slide when overlay is closed
        resetAutoSlideTimer();
      }
    });
  });
});