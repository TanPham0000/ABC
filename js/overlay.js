document.addEventListener('DOMContentLoaded', function() {
  const openButtons = document.querySelectorAll('[data-overlay-target]');
  
  function openOverlay(targetId) {
      const overlay = document.getElementById(targetId);
      if (overlay) {
          // Remove closing class if it exists
          overlay.classList.remove('closing');
          
          // Add active class to show and animate in
          overlay.classList.add('active');
          document.body.style.overflow = 'hidden';
      }
  }
  
  function closeOverlay(overlay) {
      // Add closing class to trigger slide-out animation
      overlay.classList.add('closing');
      
      // Remove active class after animation completes
      overlay.addEventListener('animationend', function handler() {
          overlay.classList.remove('active', 'closing');
          overlay.removeEventListener('animationend', handler);
      });
      
      document.body.style.overflow = '';
  }
  
  // Open buttons
  openButtons.forEach(button => {
      button.addEventListener('click', function() {
          const targetId = this.getAttribute('data-overlay-target');
          openOverlay(targetId);
      });
  });
  
  // Close button
  const closeBtn = document.getElementById('closeBtn');
  if (closeBtn) {
      closeBtn.addEventListener('click', function() {
          const overlay = this.closest('.overlay');
          closeOverlay(overlay);
      });
  }
  
  // Close when clicking outside content
  document.querySelectorAll('.overlay').forEach(overlay => {
      overlay.addEventListener('click', function(e) {
          if (e.target === this) {
              closeOverlay(this);
          }
      });
  });
  
  // Close with Escape key
  document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
          document.querySelectorAll('.overlay.active').forEach(overlay => {
              // Only close if not already closing
              if (!overlay.classList.contains('closing')) {
                  closeOverlay(overlay);
              }
          });
      }
  });
});