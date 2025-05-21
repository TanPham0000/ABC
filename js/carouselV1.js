document.addEventListener('DOMContentLoaded', () => {
  const carouselTrack = document.getElementById('carouselTrack'),
        slides = document.querySelectorAll('.carousel-slide'),
        prevBtn = document.getElementById('prevBtn'),
        nextBtn = document.getElementById('nextBtn'),
        dotsContainer = document.getElementById('carouselDots');
  let currentIndex = 0, startPos = 0, currentTranslate = 0, isDragging = false,
      animationID = 0, startTime = 0, autoSlideInterval = 90000, autoSlideTimer,
      isScrolling = false, isMobile = window.innerWidth <= 768,
      isTransitioning = false;

  const initCarousel = () => {
    slides.forEach((_,i) => {
      const dot = document.createElement('button');
      dot.className = 'carousel-dot';
      dot.setAttribute('aria-label', `Go to slide ${i+1}`);
      dot.addEventListener('click', () => goToSlide(i));
      dotsContainer.appendChild(dot);
    });
    showSlide(0);
    setupEvents();
    startAutoSlide();
    window.addEventListener('resize', () => {
      const wasMobile = isMobile;
      isMobile = window.innerWidth <= 768;
      if (wasMobile !== isMobile) {
        setSlidePositions(0);
        showSlide(currentIndex);
      }
    });
  };

  const showSlide = index => {
    currentIndex = index;
    slides.forEach((s,i) => {
      s.classList.remove('active', 'prev', 'next');
      if (i === currentIndex) s.classList.add('active');
      else if (i === (currentIndex - 1 + slides.length) % slides.length) s.classList.add('prev');
      else if (i === (currentIndex + 1) % slides.length) s.classList.add('next');
    });
    setSlidePositions(0);
    document.querySelectorAll('.carousel-dot').forEach((d,i) => d.classList.toggle('active', i === currentIndex));
    resetAutoSlideTimer();
  };

  const setSlidePositions = dragOffset => {
    const slideSize = isMobile ? carouselTrack.offsetWidth : carouselTrack.offsetHeight,
          dragPercentage = dragOffset / slideSize;
    slides.forEach((s,i) => {
      const offset = (i - currentIndex) * 100 + dragPercentage * 100;
      s.style.transform = isMobile ? `translateX(${offset}%)` : `translateY(${offset}%)`;
    });
  };

  const goToSlide = index => {
    if (index === currentIndex || isTransitioning) return;
    currentIndex = index;
    isTransitioning = true;
    slides.forEach(s => s.style.transition = 'transform 0.5s ease-out');
    showSlide(currentIndex);
    setTimeout(() => {
      slides.forEach(s => s.style.transition = '');
      isTransitioning = false;
    }, 500);
  };

  const nextSlide = () => { if (!isTransitioning) goToSlide((currentIndex + 1) % slides.length); isScrolling = false; console.log('nextSlide');};
  const prevSlide = () => { if (!isTransitioning) goToSlide((currentIndex - 1 + slides.length) % slides.length); isScrolling = false; console.log('prevSlide');};

  const setupEvents = () => {
    ['touchstart', 'mousedown'].forEach(e => carouselTrack.addEventListener(e, dragStart));
    ['touchmove', 'mousemove'].forEach(e => carouselTrack.addEventListener(e, drag));
    ['touchend', 'mouseup', 'mouseleave'].forEach(e => carouselTrack.addEventListener(e, dragEnd));
    carouselTrack.addEventListener('wheel', handleWheel, { passive: false });
    carouselTrack.addEventListener('mouseenter', pauseAutoSlide);
    carouselTrack.addEventListener('mouseleave', resetAutoSlideTimer);
    prevBtn.addEventListener('click', () => { prevBtn.classList.add('clicked'); prevSlide(); setTimeout(() => prevBtn.classList.remove('clicked'), 500); });
    nextBtn.addEventListener('click', () => { nextBtn.classList.add('clicked'); nextSlide(); setTimeout(() => nextBtn.classList.remove('clicked'), 500); });
    document.addEventListener('keydown', e => {
      if (!isMobile && (e.key === 'ArrowUp' || e.key === 'ArrowDown')) e.key === 'ArrowUp' ? prevSlide() : nextSlide();
      if (isMobile && (e.key === 'ArrowLeft' || e.key === 'ArrowRight')) e.key === 'ArrowLeft' ? prevSlide() : nextSlide();
    });
  };
  const SCROLL_SENSITIVITY = 50; // ← lower = more sensitive
  const handleWheel = e => {
    console.log('scrolling');
   // e.preventDefault();
   
    if(!isScrolling) {
      isScrolling = true;
        if(e.deltaY > 0) {
          nextSlide();
      } else {
          prevSlide();
      }
      //WHEEL EVENT CANCEL
    }

    
  };

  const startAutoSlide = () => { autoSlideTimer = setInterval(nextSlide, autoSlideInterval); };
  const resetAutoSlideTimer = () => { clearInterval(autoSlideTimer); startAutoSlide(); };
  const pauseAutoSlide = () => { clearInterval(autoSlideTimer); };

  const dragStart = e => {
    if (isTransitioning) return;
    e.preventDefault();
    startTime = Date.now();
    pauseAutoSlide();
    startPos = e.type.includes('touch') 
      ? (isMobile ? e.touches[0].clientX : e.touches[0].clientY)
      : (isMobile ? e.clientX : e.clientY);
    isDragging = true;
    animationID = requestAnimationFrame(animation);
    carouselTrack.classList.add('dragging');
  };

  const drag = e => {
    if (isDragging) {
      currentTranslate = (e.type.includes('touch')
        ? (isMobile ? e.touches[0].clientX : e.touches[0].clientY)
        : (isMobile ? e.clientX : e.clientY)) - startPos;
      setSlidePositions(currentTranslate / 3);
    }
  };

  const dragEnd = () => {
    if (isDragging) {
      cancelAnimationFrame(animationID);
      isDragging = false;
      carouselTrack.classList.remove('dragging');
      const moveTime = Date.now() - startTime, movedDistance = currentTranslate;
      if (movedDistance < -50 || (movedDistance < 0 && moveTime < 300)) nextSlide();
      else if (movedDistance > 50 || (movedDistance > 0 && moveTime < 300)) prevSlide();
      else setSlidePositions(0);
      currentTranslate = startPos = 0;
    }
  };

  const animation = () => { if (isDragging) animationID = requestAnimationFrame(animation); };

  initCarousel();
});