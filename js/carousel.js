document.addEventListener('DOMContentLoaded', function () {
  const carouselTrack = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  let currentIndex = 0;
  let startPos = 0;
  let currentTranslate = 0;
  let isDragging = false;
  let animationID = 0;
  let startTime = 0;
  let autoSlideInterval = 90000;
  let autoSlideTimer;
  let isScrolling = false;
  let scrollTimeout;
  let isMobile = window.innerWidth <= 768;
  let isTransitioning = false; // 🔒 Lock during slide animations

  function initCarousel() {
    createDots();
    showSlide(currentIndex);
    setupEvents();
    startAutoSlide();
    window.addEventListener('resize', handleResize);
  }

  function handleResize() {
    const wasMobile = isMobile;
    isMobile = window.innerWidth <= 768;
    if (wasMobile !== isMobile) {
      setSlidePositions(0);
      showSlide(currentIndex);
    }
  }

  function createDots() {
    slides.forEach((_, index) => {
      const dot = document.createElement('button');
      dot.classList.add('carousel-dot');
      dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
      dot.addEventListener('click', () => goToSlide(index));
      dotsContainer.appendChild(dot);
    });
  }

  function updateDots() {
    document.querySelectorAll('.carousel-dot').forEach((dot, index) => {
      dot.classList.toggle('active', index === currentIndex);
    });
  }

  function positionSlides() {
    slides.forEach((slide, index) => {
      slide.classList.remove('active', 'prev', 'next');
      if (index === currentIndex) {
        slide.classList.add('active');
      } else if (index === getPrevIndex()) {
        slide.classList.add('prev');
      } else if (index === getNextIndex()) {
        slide.classList.add('next');
      }
    });
  }

  function showSlide(index) {
    currentIndex = index;
    positionSlides();
    setSlidePositions(0);
    updateDots();
    resetAutoSlideTimer();
  }

  function setSlidePositions(dragOffset) {
    const slideSize = isMobile ? carouselTrack.offsetWidth : carouselTrack.offsetHeight;
    const dragPercentage = dragOffset / slideSize;

    slides.forEach((slide, index) => {
      const offset = (index - currentIndex) * 100 + dragPercentage * 100;
      const transformValue = isMobile ? `translateX(${offset}%)` : `translateY(${offset}%)`;
      slide.style.transform = transformValue;
    });
  }

  function getPrevIndex() {
    return (currentIndex - 1 + slides.length) % slides.length;
  }

  function getNextIndex() {
    return (currentIndex + 1) % slides.length;
  }

  function goToSlide(index) {
    if (index === currentIndex || isTransitioning) return;
    currentIndex = index;
    transitionToSlide();
  }

  function nextSlide() {
    if (isTransitioning) return;
    currentIndex = getNextIndex();
    transitionToSlide();
  }

  function prevSlide() {
    if (isTransitioning) return;
    currentIndex = getPrevIndex();
    transitionToSlide();
  }

  // 🔄 Applies shared transition logic
  function transitionToSlide() {
    isTransitioning = true;
    slides.forEach(slide => slide.style.transition = 'transform 0.5s ease-out');
    showSlide(currentIndex);
    setTimeout(() => {
      slides.forEach(slide => slide.style.transition = '');
      isTransitioning = false;
    }, 500);
  }

  function setupEvents() {
    carouselTrack.addEventListener('touchstart', dragStart, { passive: false });
    carouselTrack.addEventListener('touchmove', drag, { passive: false });
    carouselTrack.addEventListener('touchend', dragEnd);
    carouselTrack.addEventListener('mousedown', dragStart);
    carouselTrack.addEventListener('mousemove', drag);
    carouselTrack.addEventListener('mouseup', dragEnd);
    carouselTrack.addEventListener('mouseleave', dragEnd);
    carouselTrack.addEventListener('wheel', handleWheel, { passive: false });
    carouselTrack.addEventListener('mouseenter', pauseAutoSlide);
    carouselTrack.addEventListener('mouseleave', resetAutoSlideTimer);
    prevBtn.addEventListener('click', () => {
      prevBtn.classList.add('clicked');
      prevSlide();
      setTimeout(() => prevBtn.classList.remove('clicked'), 500);
    });
    nextBtn.addEventListener('click', () => {
      nextBtn.classList.add('clicked');
      nextSlide();
      setTimeout(() => nextBtn.classList.remove('clicked'), 500);
    });
    document.addEventListener('keydown', handleKeyboard);
    setupOverlayEvents();
  }

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

  function handleWheel(e) {
    e.preventDefault();
    if (isScrolling) return;
    isScrolling = true;

    if (isMobile) {
      e.deltaX > 0 ? nextSlide() : prevSlide();
    } else {
      e.deltaY > 0 ? nextSlide() : prevSlide();
    }

    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
      isScrolling = false;
    }, 500);
  }

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

  function dragStart(e) {
    if (isTransitioning) return;

    e.preventDefault();
    startTime = Date.now();
    pauseAutoSlide();

    startPos = (e.type.includes('touch'))
      ? (isMobile ? e.touches[0].clientX : e.touches[0].clientY)
      : (isMobile ? e.clientX : e.clientY);

    isDragging = true;
    animationID = requestAnimationFrame(animation);
    carouselTrack.classList.add('dragging');
  }

  function drag(e) {
    if (!isDragging) return;

    const currentPosition = (e.type.includes('touch'))
      ? (isMobile ? e.touches[0].clientX : e.touches[0].clientY)
      : (isMobile ? e.clientX : e.clientY);

    currentTranslate = currentPosition - startPos;
    setSlidePositions(currentTranslate / 3);
  }

  function dragEnd() {
    if (!isDragging) return;

    cancelAnimationFrame(animationID);
    isDragging = false;
    carouselTrack.classList.remove('dragging');

    const moveTime = Date.now() - startTime;
    const movedDistance = currentTranslate;
    const threshold = 50;
    const quickSwipeTime = 300;

    if (movedDistance < -threshold || (movedDistance < 0 && moveTime < quickSwipeTime)) {
      nextSlide();
    } else if (movedDistance > threshold || (movedDistance > 0 && moveTime < quickSwipeTime)) {
      prevSlide();
    } else {
      setSlidePositions(0);
    }

    currentTranslate = 0;
    startPos = 0;
  }

  function animation() {
    if (isDragging) {
      animationID = requestAnimationFrame(animation);
    }
  }

  function cloneSlides() {
    const firstClone = slides[0].cloneNode(true);
    const lastClone = slides[slides.length - 1].cloneNode(true);
    firstClone.classList.add('clone');
    lastClone.classList.add('clone');
    carouselTrack.appendChild(firstClone);
    carouselTrack.insertBefore(lastClone, slides[0]);
  }

  initCarousel();
});