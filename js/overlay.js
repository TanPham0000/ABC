document.addEventListener('DOMContentLoaded', function() {
    // Select all buttons that can open overlays
    const openButtons = document.querySelectorAll('[data-overlay-target]');
    
    // Function to open an overlay by its ID
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
    
    // Function to close an overlay
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
    
    // Set up event listeners for all open buttons
    openButtons.forEach(button => {
      button.addEventListener('click', function() {
        const targetId = this.getAttribute('data-overlay-target');
        openOverlay(targetId);
      });
    });
    
    // Set up event listeners for all close buttons
    document.querySelectorAll('.overlay .close').forEach(closeBtn => {
      closeBtn.addEventListener('click', function() {
        const overlay = this.closest('.overlay');
        closeOverlay(overlay);
      });
    });
    
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