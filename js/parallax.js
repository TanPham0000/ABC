function updateViewportHeight() {
  const vh = window.visualViewport?.height || window.innerHeight;
  document.documentElement.style.setProperty('--vh', `${vh * 0.01}px`);
}

// Run once on load
updateViewportHeight();

// Update on resize or zoom
window.visualViewport?.addEventListener('resize', updateViewportHeight);
window.addEventListener('orientationchange', updateViewportHeight);

function applyParallax(x, y) {
    document.querySelectorAll('.parallax').forEach((el) => {
        const depth = parseFloat(el.getAttribute('data-depth')) || 0.4;
        const moveX = -x * 10 * depth;
        const moveY = -y * 10 * depth;
        const rotateX = y * 30 * depth;
        const rotateY = -x * 30 * depth;

        el.style.transform = `translate(${moveX}px, ${moveY}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        el.style.transformStyle = "preserve-3d";
        el.style.backfaceVisibility = "hidden";
        el.style.transition = "transform 0.1s ease-out";
    });
}

const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function handleOrientation(event) {
  const x = event.gamma / 45; // -1 to 1
  const y = event.beta / 45;
  applyParallax(x, y);
}

if (isMobile && window.DeviceOrientationEvent) {
  if (typeof DeviceOrientationEvent.requestPermission === 'function') {
    // iOS 13+ requires permission
    const button = document.createElement('button');
    button.innerText = 'Enable Motion';
    button.style.position = 'absolute';
    button.style.top = '20px';
    button.style.left = '50%';
    button.style.transform = 'translateX(-50%)';
    button.style.zIndex = '9999';
    button.style.padding = '10px 20px';
    button.style.fontSize = '16px';
    button.style.backgroundColor = '#1108BB';
    button.style.color = '#FFF9EE';
    button.style.border = 'none';
    button.style.borderRadius = '8px';
    button.style.cursor = 'pointer';
    button.style.fontFamily = 'Obviously Regular, sans-serif';
    button.style.textTransform = 'uppercase';

    document.body.appendChild(button);

    button.addEventListener('click', () => {
      DeviceOrientationEvent.requestPermission()
        .then(response => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
            button.remove(); // Remove the button after enabling
          }
        })
        .catch(console.error);
    });
  } else {
    // Android or older iOS versions
    window.addEventListener('deviceorientation', handleOrientation, true);
  }
} else {
  // Desktop fallback with mouse
  document.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth - 0.5) * 2;
    const y = (e.clientY / window.innerHeight - 0.5) * 2;
    applyParallax(x, y);
  });
}
