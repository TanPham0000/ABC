document.addEventListener("DOMContentLoaded", function () {
const logoDesktop = document.getElementById("logo-desktop");

logoDesktop.onclick = () => {
  const rect = logoDesktop.getBoundingClientRect();
  const x = rect.left + rect.width / 2;
  const y = rect.top + rect.height / 2;

  confetti({
    particleCount: 100,
    spread: 70,
    origin: {
      x: x / window.innerWidth,
      y: y / window.innerHeight,
    }
  });
};
});

  const konamiCode = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
  let konamiIndex = 0;

  document.addEventListener("keydown", function (e) {
    if (e.keyCode === konamiCode[konamiIndex]) {
      konamiIndex++;
      if (konamiIndex === konamiCode.length) {
        showEasterEgg(); // Trigger your fun here
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0; // Reset if the sequence is broken
    }
  });

  function showEasterEgg() {
    // Example: show a funny gif overlay
    const gif = document.createElement("img");
    gif.src = "https://media0.giphy.com/media/v1.Y2lkPTc5MGI3NjExaTdhZjRlMDhyZjg5dW9yMXd4ZzBidjd1OW5ob3oxbHlzbWJueDA0MSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/DPJ7BcVmBi3dYVBT7v/giphy.gif"; // replace with your own
    gif.style.position = "fixed";
    gif.style.top = "50%";
    gif.style.left = "50%";
    gif.style.transform = "translate(-50%, -50%)";
    gif.style.zIndex = 9999;
    gif.style.maxWidth = "80%";
    gif.style.border = "5px solid white";
    gif.style.boxShadow = "0 0 20px black";
    gif.style.borderRadius = "10px";
    document.body.appendChild(gif);

    // Optional: remove after a few seconds
    setTimeout(() => gif.remove(), 5000);
  }