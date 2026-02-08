/* ==========================================================================
   MESSAGE - Love Letter Logic
   ========================================================================== */

(function() {
  'use strict';

  let modalShown = false;
  let observer;

  function init() {
    const finalModal = document.getElementById('final-modal');
    // If not on message page, do nothing
    if (!finalModal) return;

    const paragraphs = document.querySelectorAll('[data-reveal]');
    const closeModalBtn = document.getElementById('close-modal-btn');
    
    // Reset state each time
    modalShown = false;
    finalModal.classList.remove('active');
    document.body.style.overflow = '';

    // Disconnect old observer if exists
    if (observer) {
        observer.disconnect();
    }

    // Setup scroll reveal for paragraphs
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);

          // Check if this is the last paragraph
          const allVisible = Array.from(paragraphs).every(p => p.classList.contains('visible'));
          if (allVisible && !modalShown) {
            setTimeout(() => {
              showFinalModal(finalModal);
            }, 1800);
          }
        }
      });
    }, {
      threshold: 0.3,
      rootMargin: '0px 0px -30px 0px'
    });

    paragraphs.forEach((p, index) => {
      p.classList.remove('visible');
      p.style.transitionDelay = `${index * 80}ms`;
      observer.observe(p);
    });

    if (closeModalBtn) {
      closeModalBtn.onclick = () => closeFinalModal(finalModal);
    }

    // Event delegation (or overwrite onclick)
    finalModal.onclick = function(e) {
      if (e.target === finalModal) {
        closeFinalModal(finalModal);
      }
    };

    // Use named handler for easy removal
    document.removeEventListener('keydown', handleEsc);
    document.addEventListener('keydown', handleEsc);

    function handleEsc(e) {
        if (e.key === 'Escape' && finalModal.classList.contains('active')) {
          closeFinalModal(finalModal);
        }
    }

    console.log('[Message] Initialized');
  }

  function showFinalModal(modal) {
    if (modalShown) return;
    modalShown = true;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFinalModal(modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  // Re-initialize on SPA navigation
  document.addEventListener('page:loaded', (e) => {
    if (e.detail.page === 'message.html') init();
  });

  window.Message = {
    init: init
  };

})();
