/* ==========================================================================
   MESSAGE - Love Letter Logic
   Handles text reveal animations and final modal
   ========================================================================== */

const Message = (function() {
  'use strict';

  let observer;
  let modalShown = false;

  function init() {
    // Only run on message page
    if (!document.querySelector('.letter-container')) return;
    
    // Reset state on re-init
    modalShown = false;
    
    // Disconnect old observer if exists
    if (observer) {
      observer.disconnect();
    }

    const paragraphs = document.querySelectorAll('[data-reveal]');
    const finalModal = document.getElementById('final-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');

    // Setup scroll reveal for paragraphs
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);

          // Check if this is the last paragraph
          // Wait a bit to ensure DOM update, then check visibility
          setTimeout(() => {
             const allVisible = Array.from(paragraphs).every(p => p.classList.contains('visible'));
             if (allVisible && !modalShown) {
               // Verify we are still on the page
               if (document.getElementById('final-modal')) {
                   setTimeout(() => {
                     showFinalModal(finalModal);
                   }, 1800);
               }
             }
          }, 100);
        }
      });
    }, {
      threshold: 0.2, // Slightly lower threshold for better mobile triggers
      rootMargin: '0px 0px -20px 0px'
    });

    paragraphs.forEach((p, index) => {
      // Clean up previous inline styles if re-initializing
      p.style.transitionDelay = `${index * 80}ms`;
      p.classList.remove('visible'); // Reset visibility for animation replay? 
      // Actually, if re-visiting, maybe we want to see them again? 
      // Yes, clear visible class.
      observer.observe(p);
    });

    setupModalListeners(finalModal, closeModalBtn);
    
    console.log('[Message] Initialized');
  }

  function showFinalModal(modal) {
    if (modalShown || !modal) return;
    modalShown = true;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeFinalModal(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }

  function setupModalListeners(modal, btn) {
    if (!modal) return;

    if (btn) {
      // Remove old listeners to prevent duplicates?
      // Cloning node is nuclear option. Better to just add listener.
      // Since SPA reloads script scope? No. 
      // Message module is persistent.
      
      const newBtn = btn.cloneNode(true);
      btn.parentNode.replaceChild(newBtn, btn);
      newBtn.addEventListener('click', () => closeFinalModal(modal));
    }

    // Modal background click
    // We can't clone body. But we can handle event delegation or single listener logic.
    // If we init repeatedly, we add multiple listeners to 'finalModal' if we aren't careful?
    // Wait, 'finalModal' element is REPLACED by router on nav.
    // So distinct DOM element. New listener is fine.
    
    modal.addEventListener('click', function(e) {
      if (e.target === modal) {
        closeFinalModal(modal);
      }
    });

    // Keydown is global. We should handle it carefully.
    // We can add a named function.
    document.addEventListener('keydown', (e) => handleKeydown(e, modal));
  }
  
  function handleKeydown(e, modal) {
      if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
        closeFinalModal(modal);
      }
  }

  return { init };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => { 
    Message.init();
});

// Re-initialize on SPA navigation
document.addEventListener('page:loaded', (e) => {
  if (e.detail.page === 'message.html') Message.init();
});
