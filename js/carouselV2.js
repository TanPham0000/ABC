document.addEventListener('DOMContentLoaded', () => {
  const carouselTrack = document.getElementById('carouselTrack');
  const slides = document.querySelectorAll('.carousel-slide');
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const dotsContainer = document.getElementById('carouselDots');

  let currentIndex = 0;
  let startPos = 0;
  let currentTranslate = 0; // Current drag position
  let isDragging = false;
  let animationID = 0;
  let autoSlideTimer = null;
  let isMobile = window.innerWidth <= 768;
  let isTransitioning = false;
  let startTime = 0;

  const getEventPos = (e) => {
    const p = e.touches?.[0] || e;
    return isMobile ? p.clientX : p.clientY;
  };

  const setSlidePositions = (dragOffset = 0) => {
    const size = isMobile ? carouselTrack.offsetWidth : carouselTrack.offsetHeight;
    const dragPercent = dragOffset / size * 100;

    slides.forEach((slide, i) => {
      const offset = (i - currentIndex) * 100 + dragPercent;
      slide.style.transform = isMobile
        ? `translateX(${offset}%)`
        : `translateY(${offset}%)`;
    });
  };

  const updateDots = () => {
    document.querySelectorAll('.carousel-dot').forEach((dot, i) =>
      dot.classList.toggle('active', i === currentIndex)
    );
  };

  const showSlide = (index) => {
    currentIndex = index;
    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'prev', 'next');
      if (i === currentIndex) slide.classList.add('active');
      else if (i === (currentIndex - 1 + slides.length) % slides.length) slide.classList.add('prev');
      else if (i === (currentIndex + 1) % slides.length) slide.classList.add('next');
    });
    setSlidePositions();
    updateDots();
    restartAutoSlide();
  };

  const goToSlide = (index) => {
    if (isTransitioning || index === currentIndex) return;
    isTransitioning = true;
    slides.forEach(slide => slide.style.transition = 'transform 0.5s ease-out');
    showSlide(index);
    setTimeout(() => {
      slides.forEach(slide => slide.style.transition = '');
      isTransitioning = false;
    }, 500);
  };

  const nextSlide = () => goToSlide((currentIndex + 1) % slides.length);
  const prevSlide = () => goToSlide((currentIndex - 1 + slides.length) % slides.length);

  const SCROLL_SENSITIVITY = 50; // ← lower = more sensitive 
  // Handle wheel event for scrolling
  const handleWheel = (e) => {
    e.preventDefault();
    if (isTransitioning || Math.abs(e.deltaY) < SCROLL_SENSITIVITY) return; // Ignore small scrolls
    e.deltaY > 0 ? nextSlide() : prevSlide();
  };

  // Initializes a drag: records start position/time and disables auto-slide
  const dragStart = (e) => {
    if (isTransitioning) return;
    e.preventDefault(); // Prevents the browser’s default behavior (like scrolling), so the drag gesture is handled only by the code.
    startTime = Date.now();
    startPos = getEventPos(e);
    isDragging = true;
    animationID = requestAnimationFrame(animate);
    pauseAutoSlide();
    carouselTrack.classList.add('dragging');
  };
  // Continuously updates slide position during drag
  const drag = (e) => {
    if (!isDragging) return;
    const pos = getEventPos(e);
    currentTranslate = pos - startPos;
    setSlidePositions(currentTranslate / 3);
  };

  // Decides if the drag should trigger a new slide or snap back
  const dragEnd = () => {
    if (!isDragging) return;
    cancelAnimationFrame(animationID);
    carouselTrack.classList.remove('dragging');
    const moveTime = Date.now() - startTime;
    if (currentTranslate < -100 || (currentTranslate < 0 && moveTime < 300)) nextSlide();
    else if (currentTranslate > 100 || (currentTranslate > 0 && moveTime < 300)) prevSlide();
    else setSlidePositions();
    isDragging = false;
    currentTranslate = 0;                                                                              
  };

  const animate = () => {
    if (isDragging) {
      setSlidePositions(currentTranslate / 3);
      animationID = requestAnimationFrame(animate);
    }
  };

  const pauseAutoSlide = () => clearInterval(autoSlideTimer);
  const startAutoSlide = () => autoSlideTimer = setInterval(nextSlide, 90000);
  const restartAutoSlide = () => { pauseAutoSlide(); startAutoSlide(); };

  const setupDots = () => {
    slides.forEach((_, i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
  };

  const setupEvents = () => {
    ['touchstart', 'mousedown'].forEach(evt => carouselTrack.addEventListener(evt, dragStart));
    ['touchmove', 'mousemove'].forEach(evt => carouselTrack.addEventListener(evt, drag));
    ['touchend', 'mouseup', 'mouseleave'].forEach(evt => carouselTrack.addEventListener(evt, dragEnd));
    carouselTrack.addEventListener('wheel', handleWheel, { passive: false });
    carouselTrack.addEventListener('mouseenter', pauseAutoSlide);
    carouselTrack.addEventListener('mouseleave', restartAutoSlide);

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

    document.addEventListener('keydown', (e) => {
      const keys = {
        ArrowLeft: () => isMobile && prevSlide(),
        ArrowRight: () => isMobile && nextSlide(),
        ArrowUp: () => !isMobile && prevSlide(),
        ArrowDown: () => !isMobile && nextSlide()
      };
      keys[e.key]?.();
    });

    window.addEventListener('resize', () => {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= 768;
      if (wasMobile !== isMobile) {
        setSlidePositions();
        showSlide(currentIndex);
      }
    });
  };

  const initCarousel = () => {
    setupDots();
    setupEvents();
    showSlide(0);
    startAutoSlide();
  };

  initCarousel();
});