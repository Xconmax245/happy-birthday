/* ==========================================================================
   HOME - Landing Page Logic
   Handles birthday modal, confetti, and stat counters
   ========================================================================== */

(function() {
  'use strict';

  function init() {
    console.log('[Home] Initializing...');
    
    // 1. Handle Birthday Modal
    handleBirthdayModal();

    // 2. Setup Stats Animation
    setupStatsAnimation();
  }

  function handleBirthdayModal() {
    const birthdayModal = document.getElementById('birthday-modal');
    if (!birthdayModal) return;

    // Check if modal was already seen this session
    const modalSeen = sessionStorage.getItem('birthdayModalSeen');
    
    if (modalSeen) {
      birthdayModal.style.display = 'none';
    } else {
      // Show modal logic
      createConfetti();
      createDecorations();
      document.body.style.overflow = 'hidden';
      
      // Setup Entry Button
      const enterBtn = document.getElementById('enter-btn');
      if (enterBtn) {
        enterBtn.onclick = () => closeBirthdayModal(birthdayModal);
      }

      // Slight delay for audio to feel more natural
      setTimeout(() => {
        if (window.AudioManager) window.AudioManager.startMusic();
      }, 100);
    }
  }

  function closeBirthdayModal(modal) {
    if (!modal) return;
    
    modal.classList.add('closing');
    
    // Start music if not already playing
    if (window.AudioManager) window.AudioManager.startMusic();
    
    setTimeout(() => {
      modal.style.display = 'none';
      document.body.style.overflow = '';
      
      // Mark as seen in session
      sessionStorage.setItem('birthdayModalSeen', 'true');
    }, 800);
  }

  function setupStatsAnimation() {
    const statsSection = document.getElementById('stats-section');
    const counters = document.querySelectorAll('.counter');
    
    if (!statsSection || counters.length === 0) return;

    let countersAnimated = false;

    // Observer to trigger animation
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !countersAnimated) {
          animateCounters(counters);
          countersAnimated = true;
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    observer.observe(statsSection);
  }

  function animateCounters(counters) {
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-target'));
      const suffix = counter.getAttribute('data-suffix') || '';
      const duration = 2000; // 2 seconds
      const startTime = performance.now();

      function updateCounter(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const current = Math.floor(easeOutQuart * target);
        
        // Format number with commas
        counter.textContent = current.toLocaleString() + suffix;

        if (progress < 1) {
          requestAnimationFrame(updateCounter);
        } else {
          counter.textContent = target.toLocaleString() + suffix;
        }
      }

      requestAnimationFrame(updateCounter);
    });
  }

  // --- Helper Functions for Decorations ---

  function createConfetti() {
    const container = document.querySelector('.confetti-container');
    if (!container) return;
    
    const colors = ['#FF6B8A', '#FFB5C5', '#C9B1FF', '#FFFFFF', '#FFD700'];
    
    for (let i = 0; i < 50; i++) {
      const confetti = document.createElement('div');
      confetti.classList.add('confetti');
      confetti.style.left = Math.random() * 100 + '%';
      confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
      confetti.style.animationDelay = Math.random() * 5 + 's';
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      
      container.appendChild(confetti);
    }
  }

  function createDecorations() {
    const container = document.querySelector('.birthday-decorations');
    if (!container) return;
    
    // Simple SVG shapes for decoration
    const shapes = [
      '<circle cx="16" cy="16" r="12" stroke-width="2"/>',
      '<rect x="4" y="4" width="24" height="24" rx="4" stroke-width="2"/>',
      '<path d="M16 2L20 12L30 16L20 20L16 30L12 20L2 16L12 12Z" stroke-width="2"/>'
    ];
    
    for (let i = 0; i < 15; i++) {
      const el = document.createElement('div');
      el.classList.add('floating-decoration');
      el.innerHTML = `<svg viewBox="0 0 32 32">${shapes[Math.floor(Math.random() * shapes.length)]}</svg>`;
      
      el.style.left = Math.random() * 100 + '%';
      el.style.top = Math.random() * 100 + '%';
      el.style.animationDelay = Math.random() * 5 + 's';
      el.style.transform = `scale(${Math.random() * 0.5 + 0.5})`;
      
      container.appendChild(el);
    }
  }

  // Expose init globally
  window.Home = {
    init: init
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', init);
  
  // Re-initialize on SPA navigation
  document.addEventListener('page:loaded', (e) => {
    if (e.detail.page === 'index.html') init();
  });

})();
