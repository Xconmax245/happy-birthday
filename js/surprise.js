/* ==========================================================================
   SURPRISE - Gift Box & Effects
   ========================================================================== */

(function() {
  'use strict';

  let confettiCanvas;
  let ctx;
  let confettiPieces = [];
  let confettiActive = false;
  let animationFrameId;
  let isOpened = false;

  function init() {
    const giftBox = document.getElementById('gift-box');
    if (!giftBox) return;

    // Confetti Setup
    confettiCanvas = document.getElementById('confetti-canvas');
    if (confettiCanvas) {
        ctx = confettiCanvas.getContext('2d');
        resizeCanvas();
        window.removeEventListener('resize', resizeCanvas);
        window.addEventListener('resize', resizeCanvas);
    }

    // Gift Box Interaction
    const surpriseMessage = document.getElementById('surprise-message');
    const revealModal = document.getElementById('reveal-modal');
    const cakeSection = document.getElementById('cake-section');
    const cakeContainer = document.getElementById('cake-container');
    const kissCountEl = document.getElementById('kiss-count');
    const kissMessageEl = document.getElementById('kiss-message');
    const continueBtn = document.getElementById('continue-btn');
    const revealContinueBtn = document.getElementById('reveal-continue-btn');
    
    // Reset state for new page load
    isOpened = false;
    confettiActive = false;
    confettiPieces = [];
    if (ctx && confettiCanvas) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    const STORAGE_KEY = 'birthdayKisses';
    const MIN_KISSES = 5;

    const kissMessages = [
      "Keep tapping to send more love!",
      "You're doing great!",
      "So much love!",
      "My heart is overflowing!",
      "You're the sweetest!",
      "I feel so loved!",
      "Never stop!",
      "Best birthday ever!"
    ];

    function updateKissMessage() {
      if (kissMessageEl) {
        let currentCount = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
        const idx = Math.min(Math.floor(currentCount / 3), kissMessages.length - 1);
        kissMessageEl.textContent = kissMessages[idx];
      }
    }

    let kissCount = parseInt(localStorage.getItem(STORAGE_KEY)) || 0;
    if (kissCountEl) kissCountEl.textContent = kissCount;
    updateKissMessage();
    if (kissCount >= MIN_KISSES && continueBtn) continueBtn.classList.add('enabled');

    giftBox.onclick = function(e) {
      if (isOpened) return;
      isOpened = true;
      
      const rect = this.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      
      this.classList.add('opened');
      
      setTimeout(() => {
        createExplosion(x, y);
        startConfetti();
      }, 400);
      
      // Show reveal modal after box opens
      // Show reveal modal after box opens
      setTimeout(() => {
        if(revealModal) {
            revealModal.classList.add('show');
            // If button exists, it handles the close. If not (fallback), auto close.
            if (!revealContinueBtn) {
                setTimeout(() => {
                    closeRevealModal();
                }, 5000); // 5 seconds fallback
            }
        }
      }, 1000);
    };

    function closeRevealModal() {
        if(revealModal) revealModal.classList.remove('show');
        setTimeout(() => {
            if(cakeSection) cakeSection.classList.add('show');
        }, 500);
    }

    if (revealContinueBtn) {
        revealContinueBtn.onclick = function() {
            closeRevealModal();
        };
    }

    if (cakeContainer) {
        cakeContainer.onclick = function(e) {
          kissCount++;
          localStorage.setItem(STORAGE_KEY, kissCount);
          if (kissCountEl) kissCountEl.textContent = kissCount;
          updateKissMessage();
          
          if (kissCount >= MIN_KISSES && continueBtn) continueBtn.classList.add('enabled');
          
          // Create tap effect
          const rect = this.getBoundingClientRect();
          const effect = document.createElement('div');
          effect.className = 'tap-effect';
          const colors = ['#FF6B8A', '#FF85A2', '#FFB3C1', '#E85577', '#FF8FA3'];
          const color = colors[Math.floor(Math.random() * colors.length)];
          effect.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" viewBox="0 0 24 24" fill="${color}" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
          effect.style.left = (e.clientX - rect.left) + 'px';
          effect.style.top = (e.clientY - rect.top) + 'px';
          this.appendChild(effect);
          setTimeout(() => effect.remove(), 1000);
        };
    }

    if (continueBtn) {
        continueBtn.onclick = function() {
          if (kissCount < MIN_KISSES) return;
          if(cakeSection) cakeSection.classList.remove('show');
          setTimeout(() => {
            if(surpriseMessage) {
                surpriseMessage.classList.add('show');
                setTimeout(() => {
                surpriseMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }, 300);
            }
          }, 500);
        };
    }

    // Surprise cards navigation
    const surpriseCards = document.querySelectorAll('.surprise-card');
    surpriseCards.forEach(card => {
      card.onclick = function() {
        const page = this.getAttribute('data-page');
        if (page) {
           if (window.Router && window.Router.navigateTo) {
               window.Router.navigateTo(page);
           } else {
               window.location.href = page;
           }
        }
      };
    });

    createFloatingHearts();
    console.log('[Surprise] Initialized');
  }

  function resizeCanvas() {
      if (!confettiCanvas) return;
      confettiCanvas.width = window.innerWidth;
      confettiCanvas.height = window.innerHeight;
  }

    class ConfettiPiece {
      constructor() {
        if (!confettiCanvas) return;
        this.x = Math.random() * confettiCanvas.width;
        this.y = -10 - Math.random() * 100;
        this.size = Math.random() * 8 + 4;
        this.speedY = Math.random() * 3 + 2;
        this.speedX = Math.random() * 2 - 1;
        this.rotation = Math.random() * 360;
        this.rotationSpeed = Math.random() * 6 - 3;
        this.colors = ['#FF6B8A', '#FFB6C1', '#E6B3FF', '#FFD4A3', '#B8F3D8', '#FF8FA3'];
        this.color = this.colors[Math.floor(Math.random() * this.colors.length)];
        this.shape = Math.random() > 0.5 ? 'rect' : 'circle';
      }

      update() {
        if (!confettiCanvas) return;
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (this.y > confettiCanvas.height + 20) {
          this.y = -20;
          this.x = Math.random() * confettiCanvas.width;
        }
      }

      draw() {
        if (!ctx) return;
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation * Math.PI / 180);
        ctx.fillStyle = this.color;
        
        if (this.shape === 'rect') {
          ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size * 0.6);
        } else {
          ctx.beginPath();
          ctx.arc(0, 0, this.size / 2, 0, Math.PI * 2);
          ctx.fill();
        }
        
        ctx.restore();
      }
    }

    function startConfetti() {
      if (confettiActive) return;
      confettiActive = true;
      confettiPieces = [];
      
      for (let i = 0; i < 100; i++) {
        confettiPieces.push(new ConfettiPiece());
      }
      
      animateConfetti();
      
      // Stop confetti after 5 seconds
      setTimeout(() => {
        confettiActive = false;
        if (animationFrameId) cancelAnimationFrame(animationFrameId);
        if (ctx && confettiCanvas) ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      }, 5000);
    }

    function animateConfetti() {
      if (!ctx || !confettiCanvas) return;
      if (!confettiActive && confettiPieces.length === 0) return;
      
      ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
      
      confettiPieces.forEach((piece, index) => {
        piece.update();
        piece.draw();
        
        if (!confettiActive && piece.y > confettiCanvas.height + 20) {
          confettiPieces.splice(index, 1);
        }
      });
      
      animationFrameId = requestAnimationFrame(animateConfetti);
    }

    function createExplosion(x, y) {
      const container = document.getElementById('explosion-container');
      if (!container) return;
      const colors = ['#FF6B8A', '#FFB6C1', '#E6B3FF', '#FFD4A3', '#B8F3D8'];
      
      // Create sparkles
      for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.background = colors[Math.floor(Math.random() * colors.length)];
        sparkle.style.setProperty('--tx', (Math.random() - 0.5) * 400 + 'px');
        sparkle.style.setProperty('--ty', (Math.random() - 0.5) * 400 + 'px');
        container.appendChild(sparkle);
        
        setTimeout(() => sparkle.remove(), 1500);
      }
      
      // Create heart particles
      for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="var(--color-rose)" stroke="none"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>';
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--tx', (Math.random() - 0.5) * 300 + 'px');
        heart.style.setProperty('--ty', (Math.random() - 0.5) * 300 + 'px');
        heart.style.setProperty('--rot', (Math.random() * 720 - 360) + 'deg');
        container.appendChild(heart);
        
        setTimeout(() => heart.remove(), 2000);
      }
    }

    function createFloatingHearts() {
      const container = document.querySelector('.floating-hearts');
      if (!container) return;

      for (let i = 0; i < 8; i++) {
        const heart = document.createElement('div');
        heart.className = 'floating-heart';
        heart.innerHTML = '❤️';
        heart.style.left = Math.random() * 100 + '%';
        heart.style.animationDuration = (10 + Math.random() * 10) + 's';
        heart.style.animationDelay = (Math.random() * 10) + 's';
        heart.style.fontSize = (12 + Math.random() * 12) + 'px';
        container.appendChild(heart);
      }
    }

  document.addEventListener('DOMContentLoaded', init);
  document.addEventListener('page:loaded', (e) => {
    if (e.detail.page === 'surprise.html') init();
  });

  window.Surprise = {
    init: init
  };

})();
