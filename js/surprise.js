/* ==========================================================================
   SURPRISE - Surprise Page Confetti and Animation Effects
   ========================================================================== */

const Surprise = (function() {
  'use strict';

  let surpriseBtn, surpriseMessage, confettiCanvas, ctx;
  let particles = [];
  let animationId = null;

  let surpriseBox, visibleMessage;

  function init() {
    surpriseBox = document.getElementById('gift-box');
    
    // Select by ID if possible, or fallback to class reference if needed in future
    visibleMessage = document.getElementById('surprise-message');
    confettiCanvas = document.getElementById('confetti-canvas');
    
    const wishModal = document.getElementById('birthday-wish-modal');
    const closeWishBtn = document.getElementById('close-wish-modal');

    // ... existing modal and canvas logic ...

    if (confettiCanvas) {
      ctx = confettiCanvas.getContext('2d');
      resizeCanvas();
      window.addEventListener('resize', resizeCanvas);
    }

    if (surpriseBox) {
      surpriseBox.addEventListener('click', triggerSurprise);
    }

    // Modal logic
    if (wishModal && closeWishBtn) {
      setTimeout(() => {
        wishModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }, 500);

      closeWishBtn.addEventListener('click', () => {
        wishModal.classList.remove('active');
        document.body.style.overflow = '';
        if (window.AOS) window.AOS.refresh();
      });
    }
  }

  // ... existing resizeCanvas function ...

  function triggerSurprise() {
    if (!surpriseBox || surpriseBox.classList.contains('open')) return;

    // Open the box
    surpriseBox.classList.add('open');

    // Start confetti burst immediately
    createConfetti();
    animateConfetti();

    // Reveal the message content after box opens
    setTimeout(() => {
       if (visibleMessage) {
         visibleMessage.classList.add('revealed');
         
         // Scroll to message smoothly
         visibleMessage.scrollIntoView({ behavior: 'smooth', block: 'start' });
       }
       State.markSurpriseSeen();
    }, 1200);
  }

  function createConfetti() {
    const colors = ['#FFB6C1', '#FF8FA3', '#FFE4E9', '#E8D5F2', '#FFCBA4', '#C7F5E3'];
    const hearts = ['💕', '💗', '💖', '💝', '❤️', '💘', '✨', '🌸'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * confettiCanvas.width,
        y: -20 - Math.random() * 100,
        size: Math.random() * 12 + 8,
        speedY: Math.random() * 3 + 2,
        speedX: (Math.random() - 0.5) * 4,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        type: Math.random() > 0.5 ? 'heart' : 'circle',
        color: colors[Math.floor(Math.random() * colors.length)],
        heart: hearts[Math.floor(Math.random() * hearts.length)],
        opacity: 1
      });
    }
  }

  function animateConfetti() {
    if (!ctx) return;
    ctx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);

    particles.forEach((p, index) => {
      p.y += p.speedY;
      p.x += p.speedX;
      p.rotation += p.rotationSpeed;

      if (p.y > confettiCanvas.height + 50) {
        p.opacity -= 0.02;
      }

      if (p.opacity <= 0) {
        particles.splice(index, 1);
        return;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rotation * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;

      if (p.type === 'heart') {
        ctx.font = `${p.size}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(p.heart, 0, 0);
      } else {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    });

    if (particles.length > 0) {
      animationId = requestAnimationFrame(animateConfetti);
    }
  }

  return { init, triggerSurprise };
})();

document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('surprise-btn')) Surprise.init();
});
