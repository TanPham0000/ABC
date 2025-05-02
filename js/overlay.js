document.addEventListener('DOMContentLoaded', function() {
  const openButtons = document.querySelectorAll('[data-overlay-target]');
  const closeButtons = document.querySelectorAll('.overlay .close');
  const overlays = document.querySelectorAll('.overlay');

  // Theme toggle button (if you still want it)
  const themeToggle = document.getElementById('toggle-theme');
  if (themeToggle) {
    themeToggle.addEventListener('click', function () {
      document.body.classList.toggle('night-mode');
    });
  }

  // Open overlay and apply night mode if .info-icon is clicked
  openButtons.forEach(button => {
    button.addEventListener('click', function() {
      const targetId = this.getAttribute('data-overlay-target');
      const overlay = document.getElementById(targetId);
      if (!overlay) return;

      if (this.classList.contains('info-icon')) {
        document.body.classList.add('night-mode'); // Force night mode on info click
      }

      overlay.classList.remove('closing');
      overlay.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  // Close overlay and remove night mode
  closeButtons.forEach(closeBtn => {
    closeBtn.addEventListener('click', function () {
      const overlay = this.closest('.overlay');
      if (!overlay) return;

      overlay.classList.add('closing');

      overlay.addEventListener('animationend', function handler() {
        overlay.classList.remove('active', 'closing');
        overlay.removeEventListener('animationend', handler);
      });

      document.body.classList.remove('night-mode'); // Turn off night mode
      document.body.style.overflow = '';
    });
  });

  // Click outside overlay content to close
  overlays.forEach(overlay => {
    overlay.addEventListener('click', function (e) {
      if (e.target === this) {
        overlay.classList.add('closing');
        overlay.addEventListener('animationend', function handler() {
          overlay.classList.remove('active', 'closing');
          overlay.removeEventListener('animationend', handler);
        });
        document.body.classList.remove('night-mode'); // Turn off night mode
        document.body.style.overflow = '';
      }
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.overlay.active').forEach(overlay => {
        if (!overlay.classList.contains('closing')) {
          overlay.classList.add('closing');
          overlay.addEventListener('animationend', function handler() {
            overlay.classList.remove('active', 'closing');
            overlay.removeEventListener('animationend', handler);
          });
          document.body.classList.remove('night-mode'); // Turn off night mode
          document.body.style.overflow = '';
        }
      });
    }
  });
});