/* ==========================================================================
   SURPRISE - Surprise Page Logic
   Handles gift box interaction, confetti, kiss counter, and modals
   ========================================================================== */

const Surprise = (function() {
  'use strict';

  let confettiCanvas, ctx;
  let confettiPieces = [];
  let confettiActive = false;
  let animationId;

  function init() {
    // Only run on surprise page
    if (!document.getElementById('gift-box')) return;

    console.log('[Surprise] Initializing...');

    // Initialize AOS locally if needed
    if (window.AOS) {
      window.AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true
      });
    }

    setupConfetti();
    setupGiftBox();
    setupCakeInteraction();
    setupCards();
    
    // Check if coming from "Continue" button or already seen
    // (Optional state check could go here)
  }

  // =========================================================================
  // CONFETTI ANIMATION
  // =========================================================================
  function setupConfetti() {
    confettiCanvas = document.getElementById('confetti-canvas');
    if (!confettiCanvas) return;
    
    ctx = confettiCanvas.getContext('2d');
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
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
        this.y += this.speedY;
        this.x += this.speedX;
        this.rotation += this.rotationSpeed;
        
        if (confettiCanvas && this.y > confettiCanvas.height + 20) {
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
    }, 5000);
  }

  function animateConfetti() {
    if (!confettiActive && confettiPieces.length === 0) return;
    if (!ctx) return;
    
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    
    confettiPieces.forEach((piece, index) => {
        piece.update();
        piece.draw();
        
        if (!confettiActive && confettiCanvas && piece.y > confettiCanvas.height + 20) {
          confettiPieces.splice(index, 1);
        }
    });
    
    if (confettiActive || confettiPieces.length > 0) {
        requestAnimationFrame(animateConfetti);
    }
  }

  // =========================================================================
  // GIFT BOX INTERACTION
  // =========================================================================
  function setupGiftBox() {
    const giftBox = document.getElementById('gift-box');
    const surpriseMessage = document.getElementById('surprise-message');
    const revealModal = document.getElementById('reveal-modal');
    const cakeSection = document.getElementById('cake-section');
    const continueBtn = document.getElementById('continue-btn'); // For cake section flow
    
    if (!giftBox) return;

    giftBox.addEventListener('click', function() {
        if (this.classList.contains('opened')) return;
        
        // 1. Open Box Animation
        this.classList.add('opened');
        
        // 2. Confetti Explosion
        startConfetti();
        createExplosion(
            window.innerWidth / 2,
            window.innerHeight / 2
        );
        
        // 3. Show Reveal Modal (Primary Gift)
        setTimeout(() => {
            if (revealModal) revealModal.classList.add('show');
        }, 1200);

        // 4. Auto-close modal and show Cake Section after delay
        setTimeout(() => {
            if (revealModal) revealModal.classList.remove('show');
            setTimeout(() => {
                if (cakeSection) cakeSection.classList.add('show');
            }, 500);
        }, 6000); // 1.2s + 4.8s reading time
        
        // 5. Show Message Container (Background)
        if (surpriseMessage) {
            setTimeout(() => {
               surpriseMessage.classList.add('show');
            }, 1500);
        }
    });

    // Determine when to close cake section
    if (continueBtn) {
        continueBtn.addEventListener('click', () => {
            if (cakeSection) cakeSection.classList.remove('show');
            // Scroll to message
            if (surpriseMessage) {
                surpriseMessage.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }
    
    // Also allow closing reveal modal on click
    if (revealModal) {
        revealModal.addEventListener('click', () => {
             revealModal.classList.remove('show');
             if (cakeSection) setTimeout(() => cakeSection.classList.add('show'), 300);
        });
    }
  }

  // =========================================================================
  // EXPLOSION EFFECTS
  // =========================================================================
  function createExplosion(x, y) {
    const container = document.getElementById('explosion-container');
    if (!container) return;
    
    // Sparkles
    for (let i = 0; i < 30; i++) {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 100 + 50;
        
        sparkle.style.left = x + 'px';
        sparkle.style.top = y + 'px';
        sparkle.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        sparkle.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        
        container.appendChild(sparkle);
        setTimeout(() => sparkle.remove(), 1200);
    }
    
    // Hearts
    const hearts = ['💕', '💖', '💗', '❤️'];
    for (let i = 0; i < 15; i++) {
        const heart = document.createElement('div');
        heart.className = 'heart-particle';
        heart.innerText = hearts[Math.floor(Math.random() * hearts.length)];
        
        const angle = Math.random() * Math.PI * 2;
        const velocity = Math.random() * 150 + 80;
        
        heart.style.left = x + 'px';
        heart.style.top = y + 'px';
        heart.style.setProperty('--tx', Math.cos(angle) * velocity + 'px');
        heart.style.setProperty('--ty', Math.sin(angle) * velocity + 'px');
        heart.style.setProperty('--rot', (Math.random() * 360) + 'deg');
        
        container.appendChild(heart);
        setTimeout(() => heart.remove(), 1800);
    }
  }

  // =========================================================================
  // CAKE INTERACTION & KISS COUNTER
  // =========================================================================
  function setupCakeInteraction() {
     const cakeContainer = document.getElementById('cake-container');
     const kissCountEl = document.getElementById('kiss-count');
     const kissMessageEl = document.getElementById('kiss-message');
     const continueBtn = document.getElementById('continue-btn');
     
     if (!cakeContainer || !kissCountEl) return;

     let kissCount = 0;
     const messages = [
        "Sending love... 💕",
        "Keep going! 💖",
        "So many kisses! 💋",
        "You're amazing! ✨",
        "Almost there! 🎂",
        "Yay! Birthday Love! 🥳"
     ];

     cakeContainer.addEventListener('click', (e) => {
         // Create floating heart
         createFloatingHeart(e.clientX, e.clientY);
         
         // Update counter
         kissCount++;
         kissCountEl.innerText = kissCount;
         
         // Animate counter
         const counter = document.getElementById('kiss-counter');
         if (counter) {
             counter.style.transform = 'scale(1.2)';
             setTimeout(() => counter.style.transform = 'scale(1)', 150);
         }
         
         // Update message
         if (kissCount % 5 === 0) {
            const msgIndex = Math.min(Math.floor(kissCount / 5), messages.length - 1);
            if (kissMessageEl) kissMessageEl.innerText = messages[msgIndex];
         }
         
         // Enable continue button
         if (kissCount >= 10 && continueBtn) {
             continueBtn.classList.add('enabled');
             if (kissMessageEl) kissMessageEl.innerText = "You've sent enough love! Continue below 👇";
         }
     });
  }

  function createFloatingHeart(x, y) {
      const heart = document.createElement('div');
      heart.className = 'tap-effect';
      heart.innerText = '💋';
      heart.style.left = x + 'px';
      heart.style.top = y + 'px';
      document.body.appendChild(heart);
      
      setTimeout(() => heart.remove(), 1000);
  }
  
  // =========================================================================
  // CARDS NAVIGATION
  // =========================================================================
  function setupCards() {
      const cards = document.querySelectorAll('.surprise-card');
      cards.forEach(card => {
          card.addEventListener('click', () => {
             const page = card.getAttribute('data-page');
             if (page && window.Router) {
                 // Use global router navigateTo if exposed, or verify href/click logic
                 // If Router handles buttons, we maybe good. 
                 // But these are divs, not buttons. Router might not catch them unless we add logic.
                 // Actually Router catches .nav-item and <a>.
                 // We should manually navigate here.
                 
                 // Since Router functions aren't globally exposed easily (IIFE), we can use window.location.href?
                 // No, that reloads.
                 // We can trigger click on hidden link? Or expose navigateTo?
                 
                 // Router intercepts clicks on 'a'.
                 // Let's create a hidden link and click it.
                 const link = document.createElement('a');
                 link.href = page;
                 link.style.display = 'none';
                 document.body.appendChild(link);
                 link.click();
                 setTimeout(() => link.remove(), 100);
             }
          });
      });
  }

  return { init };
})();

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Surprise.init();
});

// Re-initialize on SPA navigation
document.addEventListener('page:loaded', (e) => {
  if (e.detail.page === 'surprise.html') Surprise.init();
});
