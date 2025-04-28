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
  let autoSlideInterval = 10000; // 10 seconds between slides
  let autoSlideTimer;
  let isScrolling = false;
  let scrollTimeout;
  
  // Initialize the carousel
  function initCarousel() {
    // Create dots and show first slide
    createDots();
    showSlide(currentIndex);
    
    // Set up events
    setupEvents();
    
    // Start auto-sliding
    startAutoSlide();
  }
  
  // Create navigation dots
  function createDots() {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }
  
  // Update active dot indicator
  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }
  
  // Show a specific slide
  function showSlide(index) {
    slides.forEach(slide => slide.classList.remove('active'));
    slides[index].classList.add('active');
    updateDots();
    resetAutoSlideTimer();
  }
  
  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    showSlide(currentIndex);
  }
  
  // Go to next slide
  function nextSlide() {
    goToSlide((currentIndex + 1) % slides.length);
  }
  
  // Go to previous slide
  function prevSlide() {
    goToSlide((currentIndex - 1 + slides.length) % slides.length);
  }
  
  // Set up all event listeners
  function setupEvents() {
    // Touch Events
    carouselTrack.addEventListener('touchstart', dragStart, { passive: false });
    carouselTrack.addEventListener('touchmove', drag, { passive: false });
    carouselTrack.addEventListener('touchend', dragEnd);
    
    // Mouse Events
    carouselTrack.addEventListener('mousedown', dragStart);
    carouselTrack.addEventListener('mousemove', drag);
    carouselTrack.addEventListener('mouseup', dragEnd);
    carouselTrack.addEventListener('mouseleave', dragEnd);
    
    // Wheel Events
    carouselTrack.addEventListener('wheel', handleWheel, { passive: false });
    
    // Hover events to pause/resume auto-slide
    carouselTrack.addEventListener('mouseenter', pauseAutoSlide);
    carouselTrack.addEventListener('mouseleave', resetAutoSlideTimer);
    
    // Button events
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);
    
    // Overlay buttons
    setupOverlayEvents();
  }
  
  // Handle wheel events (with throttling)
  function handleWheel(e) {
    e.preventDefault();
    
    if (isScrolling) return;
    isScrolling = true;
    
    // Determine scroll direction
    e.deltaY > 0 ? nextSlide() : prevSlide();
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 500);
  }
  
  // Auto-sliding functions
  function startAutoSlide() {
    autoSlideTimer = setInterval(nextSlide, autoSlideInterval);
  }
  
  function resetAutoSlideTimer() {
    clearInterval(autoSlideTimer);
    startAutoSlide();
  }
  
  function pauseAutoSlide() {
    clearInterval(autoSlideTimer);
  }
  
  // Touch/mouse drag functions
  function dragStart(e) {
    // Only prevent default if starting touch is directly on the carousel track
    if (e.target === carouselTrack) {
      e.preventDefault();
    }
    
    startTime = new Date().getTime();
    pauseAutoSlide();
    
    // Get starting position
    startPos = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
    
    isDragging = true;
    carouselTrack.classList.add('dragging');
    animationID = requestAnimationFrame(animation);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    // Get current position (horizontal)
    const currentPosition = e.type === 'touchmove' ? 
      e.touches[0].clientX : e.clientX;
    
    // Calculate how far we've dragged horizontally
    currentTranslate = prevTranslate + currentPosition - startPos;
  }
  
  function dragEnd() {
    if (!isDragging) return;
    
    cancelAnimationFrame(animationID);
    isDragging = false;
    carouselTrack.classList.remove('dragging');
    
    const moveTime = new Date().getTime() - startTime;
    const movedDistance = currentTranslate - prevTranslate;
    
    // For horizontal swiping, we invert the direction logic:
    // Swiping left means next slide, right means previous slide
    if (movedDistance < -50 || (movedDistance < 0 && moveTime < 300)) {
      // Swiped left - go to next slide
      nextSlide();
    } else if (movedDistance > 50 || (movedDistance > 0 && moveTime < 300)) {
      // Swiped right - go to previous slide
      prevSlide();
    } else {
      // No significant movement, restart auto-slide
      resetAutoSlideTimer();
    }
    
    // Reset values
    currentTranslate = prevTranslate = 0;
  }
  
  // Animation for smooth dragging
  function animation() {
    if (isDragging) {
      animationID = requestAnimationFrame(animation);
    }
  }
  
  // Setup overlay functionality
  function setupOverlayEvents() {
    // Open overlay buttons
    document.querySelectorAll('.read-more').forEach(button => {
      button.addEventListener('click', function() {
        pauseAutoSlide();
        
        const targetOverlay = this.getAttribute('data-overlay-target');
        const overlay = document.getElementById(targetOverlay) || 
                       document.querySelector('.more-content');
        
        if (overlay) overlay.classList.add('active');
      });
    });
    
    // Close overlay buttons
    document.querySelectorAll('.close-content').forEach(button => {
      button.addEventListener('click', function() {
        const overlay = this.closest('.more-content');
        if (overlay) {
          overlay.classList.remove('active');
          resetAutoSlideTimer();
        }
      });
    });
  }
  
  // Initialize the carousel
  initCarousel();
});