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
  let autoSlideInterval = 90000; // 10 seconds between slides
  let autoSlideTimer;
  let isScrolling = false;
  let scrollTimeout;
  let isMobile = window.innerWidth <= 768;
  
  // Initialize the carousel
  function initCarousel() {
    // Create dots and show first slide
    createDots();
    showSlide(currentIndex);
    
    // Set up events
    setupEvents();
    
    // Start auto-sliding
    startAutoSlide();
    
    // Setup resize listener
    window.addEventListener('resize', handleResize);
  }
  
  // Handle window resize to update mobile status
  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    
    // If device type changed, reset slides to ensure proper positioning
    if (wasMobile !== isMobile) {
      // Reset any dragging transformations
      setSlidePositions(0);
      showSlide(currentIndex);
    }
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
  
  // Apply classes to slides for proper positioning
  function positionSlides() {
    slides.forEach((slide, index) => {
      // Remove all position classes first
      slide.classList.remove('active', 'prev', 'next');
      
      // Set position classes based on index
      if (index === currentIndex) {
        slide.classList.add('active');
      } else if (index === getPrevIndex()) {
        slide.classList.add('prev');
      } else if (index === getNextIndex()) {
        slide.classList.add('next');
      }
    });
  }
  
  // Show a specific slide
  function showSlide(index) {
    currentIndex = index;
    positionSlides();
    setSlidePositions(0); // Reset any transform shifts
    updateDots();
    resetAutoSlideTimer();
  }
  
  // Set slide positions with a drag offset
  function setSlidePositions(dragOffset) {
    const slideSize = isMobile ? carouselTrack.offsetWidth : carouselTrack.offsetHeight;
    const dragPercentage = dragOffset / slideSize;
    
    slides.forEach((slide, index) => {
      let position = 0;
      
      if (index === currentIndex) {
        // Current slide - moves with drag
        position = dragPercentage * 100;
      } else if (index === getPrevIndex()) {
        // Previous slide - starts at -100% and moves with drag
        position = -100 + dragPercentage * 100;
      } else if (index === getNextIndex()) {
        // Next slide - starts at 100% and moves with drag
        position = 100 + dragPercentage * 100;
      } else {
        // Other slides - positioned far away
        position = index < currentIndex ? -200 : 200;
      }
      
      // Apply transform based on orientation
      if (isMobile) {
        slide.style.transform = `translateX(${position}%)`;
      } else {
        slide.style.transform = `translateY(${position}%)`;
      }
    });
  }
  
  // Get previous index with wrap-around
  function getPrevIndex() {
    return (currentIndex - 1 + slides.length) % slides.length;
  }
  
  // Get next index with wrap-around
  function getNextIndex() {
    return (currentIndex + 1) % slides.length;
  }
  
  // Go to specific slide
  function goToSlide(index) {
    // Don't do anything if clicking the current slide
    if (index === currentIndex) return;
    
    showSlide(index);
  }
  
  // Go to next slide with animation
  function nextSlide() {
    // Add clicked animation to button
    nextBtn.classList.add('clicked');
    setTimeout(() => {
      nextBtn.classList.remove('clicked');
    }, 500);
    
    goToSlide(getNextIndex());
  }
  
  // Go to previous slide with animation
  function prevSlide() {
    // Add clicked animation to button
    prevBtn.classList.add('clicked');
    setTimeout(() => {
      prevBtn.classList.remove('clicked');
    }, 500);
    
    goToSlide(getPrevIndex());
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
    
    // Keyboard events
    document.addEventListener('keydown', handleKeyboard);
    
    // Overlay buttons
    setupOverlayEvents();
  }
  
  // Handle keyboard navigation
  function handleKeyboard(e) {
    switch (e.key) {
      case 'ArrowUp':
        if (!isMobile) prevSlide();
        break;
      case 'ArrowDown':
        if (!isMobile) nextSlide();
        break;
      case 'ArrowLeft':
        if (isMobile) prevSlide();
        break;
      case 'ArrowRight':
        if (isMobile) nextSlide();
        break;
    }
  }
  
  // Handle wheel events (with throttling)
  function handleWheel(e) {
    e.preventDefault();
    
    if (isScrolling) return;
    isScrolling = true;
    
    // Only handle vertical scrolling on desktop, horizontal on mobile
    if (isMobile) {
      // For mobile: left/right scrolling
      e.deltaX > 0 ? nextSlide() : prevSlide();
    } else {
      // For desktop: up/down scrolling
      e.deltaY > 0 ? nextSlide() : prevSlide();
    }
    
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
    e.preventDefault();
    startTime = new Date().getTime();
    pauseAutoSlide();
    
    // Get starting position based on device type
    if (e.type === 'touchstart') {
      startPos = isMobile ? e.touches[0].clientX : e.touches[0].clientY;
    } else {
      startPos = isMobile ? e.clientX : e.clientY;
    }
    
    isDragging = true;
    carouselTrack.classList.add('dragging');
    animationID = requestAnimationFrame(animation);
  }
  
  function drag(e) {
    if (!isDragging) return;
    
    // Get current position based on device type
    let currentPosition;
    if (e.type === 'touchmove') {
      currentPosition = isMobile ? e.touches[0].clientX : e.touches[0].clientY;
    } else {
      currentPosition = isMobile ? e.clientX : e.clientY;
    }
    
    // Calculate how far we've dragged
    currentTranslate = currentPosition - startPos;
    
    // Apply responsive drag to slide positions
    // We divide by a factor (3) to make the drag less sensitive but still responsive
    setSlidePositions(currentTranslate / 3);
  }
  
  function dragEnd() {
    if (!isDragging) return;
    
    cancelAnimationFrame(animationID);
    isDragging = false;
    carouselTrack.classList.remove('dragging');
    
    const moveTime = new Date().getTime() - startTime;
    const movedDistance = currentTranslate;
    
    // Determine threshold for slide change (lower value = more sensitive)
    const threshold = 50;
    const quickSwipeTime = 300; // ms
    
    // Get the slide size based on orientation
    const slideSize = isMobile ? carouselTrack.offsetWidth : carouselTrack.offsetHeight;
    
    // Reset all slides to their proper positions with animation
    slides.forEach(slide => {
      slide.style.transition = 'transform 0.5s ease-out';
    });
    
    if (movedDistance < -threshold || (movedDistance < 0 && moveTime < quickSwipeTime)) {
      // Swipe in negative direction (down or right) - go to next slide
      nextSlide();
    } else if (movedDistance > threshold || (movedDistance > 0 && moveTime < quickSwipeTime)) {
      // Swipe in positive direction (up or left) - go to previous slide
      prevSlide();
    } else {
      // No significant movement, snap back to current slide
      setSlidePositions(0);
      resetAutoSlideTimer();
    }
    
    // Remove transition after it completes
    setTimeout(() => {
      slides.forEach(slide => {
        slide.style.transition = '';
      });
    }, 500);
    
    // Reset values
    currentTranslate = 0;
    startPos = 0;
  }
  
  // Animation for smooth dragging
  function animation() {
    if (isDragging) {
      animationID = requestAnimationFrame(animation);
    }
  }
  // Initialize the carousel
  initCarousel();
});