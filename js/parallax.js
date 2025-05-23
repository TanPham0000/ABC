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
      const depth = parseFloat(el.getAttribute('data-depth')) || 0.7;
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
  
  function initMotion() {
    if (typeof DeviceOrientationEvent.requestPermission === 'function') {
      // iOS
      DeviceOrientationEvent.requestPermission()
        .then((response) => {
          if (response === 'granted') {
            window.addEventListener('deviceorientation', handleOrientation, true);
          } else {
            console.warn("Permission denied for device orientation.");
          }
        })
        .catch(console.error);
    } else {
      // Android
      window.addEventListener('deviceorientation', handleOrientation, true);
    }
  }
  
  function handleOrientation(event) {
    const x = event.gamma / 45; // Normalize to -1..1
    const y = event.beta / 45;
    applyParallax(x, y);
  }
  
  // Add permission button for iOS
  // if (isMobile && window.DeviceOrientationEvent) {
  //   const permissionButton = document.createElement('button');
  //   permissionButton.innerText = 'Enable Motion';
  //   Object.assign(permissionButton.style, {
  //     position: 'absolute',
  //     top: '20px',
  //     left: '50%',
  //     transform: 'translateX(-50%)',
  //     zIndex: 9999,
  //     padding: '12px 24px',
  //     fontSize: '16px',
  //     border: 'none',
  //     background: '#1108BB',
  //     color: 'white',
  //     borderRadius: '6px',
  //     cursor: 'pointer'
  //   });
  //   document.body.appendChild(permissionButton);
  
  //   permissionButton.addEventListener('click', () => {
  //     initMotion();
  //     permissionButton.remove();
  //   });
  // } else {
    // Desktop mouse fallback
    document.addEventListener('mousemove', (e) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      applyParallax(x, y);
    });