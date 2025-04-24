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

if (isMobile && window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", (event) => {
        const x = event.gamma / 45; // range: -90 to 90, normalize to -1 to 1
        const y = event.beta / 45;  // range: -180 to 180, normalize to -1 to 1
        applyParallax(x, y);
    }, true);
} else {
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        applyParallax(x, y);
    });
}