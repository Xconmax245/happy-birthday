/* ==========================================================================
   ANIMATIONS - Animation Utilities and Effects
   Handles AOS, floating hearts, and other animation effects
   ========================================================================== */

/**
 * Animations Module
 * Controls all animation effects throughout the site
 */
const Animations = (function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Configuration
  // --------------------------------------------------------------------------
  const CONFIG = {
    floatingHearts: {
      count: 8,
      characters: ['💕', '💗', '💖', '💝', '♥', '❤️', '💘'],
      minDuration: 6000,
      maxDuration: 12000,
      minDelay: 0,
      maxDelay: 8000
    }
  };

  // --------------------------------------------------------------------------
  // Initialization
  // --------------------------------------------------------------------------

  /**
   * Initialize all animations
   */
  function init() {
    initAOS();
    initFloatingHearts();
    console.log('[Animations] Initialized');
  }

  /**
   * Initialize AOS (Animate On Scroll) library
   */
  function initAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 800,
        easing: 'ease-out-cubic',
        once: true,           // Animations only happen once
        offset: 50,           // Offset from the original trigger point
        delay: 0,             // Delay before animation
        anchorPlacement: 'top-bottom'
      });
      console.log('[Animations] AOS initialized');
    } else {
      console.warn('[Animations] AOS library not found');
    }
  }

  /**
   * Refresh AOS (call after dynamic content changes)
   */
  function refreshAOS() {
    if (typeof AOS !== 'undefined') {
      AOS.refresh();
    }
  }

  // --------------------------------------------------------------------------
  // Floating Hearts
  // --------------------------------------------------------------------------

  /**
   * Initialize floating hearts background animation
   */
  function initFloatingHearts() {
    const container = document.querySelector('.floating-hearts');
    if (!container) return;

    // Clear existing hearts
    container.innerHTML = '';

    // Create floating hearts
    for (let i = 0; i < CONFIG.floatingHearts.count; i++) {
      createFloatingHeart(container, i);
    }

    console.log('[Animations] Floating hearts initialized');
  }

  /**
   * Create a single floating heart element
   * @param {HTMLElement} container - Container element
   * @param {number} index - Heart index
   */
  function createFloatingHeart(container, index) {
    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    
    // Random heart character
    const chars = CONFIG.floatingHearts.characters;
    heart.textContent = chars[Math.floor(Math.random() * chars.length)];
    
    // Random horizontal position
    heart.style.left = `${Math.random() * 100}%`;
    
    // Random animation duration
    const duration = randomBetween(
      CONFIG.floatingHearts.minDuration,
      CONFIG.floatingHearts.maxDuration
    );
    heart.style.animationDuration = `${duration}ms`;
    
    // Random delay
    const delay = randomBetween(
      CONFIG.floatingHearts.minDelay,
      CONFIG.floatingHearts.maxDelay
    );
    heart.style.animationDelay = `${delay}ms`;
    
    // Random size
    const size = randomBetween(16, 28);
    heart.style.fontSize = `${size}px`;
    
    // Random opacity
    heart.style.opacity = randomBetween(0.2, 0.5);
    
    container.appendChild(heart);
  }

  // --------------------------------------------------------------------------
  // Fade Animations
  // --------------------------------------------------------------------------

  /**
   * Fade in an element
   * @param {HTMLElement} element - Element to fade in
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when animation completes
   */
  function fadeIn(element, duration = 400) {
    return new Promise(resolve => {
      element.style.opacity = '0';
      element.style.display = 'block';
      element.style.transition = `opacity ${duration}ms ease`;
      
      // Force reflow
      element.offsetHeight;
      
      element.style.opacity = '1';
      
      setTimeout(resolve, duration);
    });
  }

  /**
   * Fade out an element
   * @param {HTMLElement} element - Element to fade out
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when animation completes
   */
  function fadeOut(element, duration = 400) {
    return new Promise(resolve => {
      element.style.transition = `opacity ${duration}ms ease`;
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.display = 'none';
        resolve();
      }, duration);
    });
  }

  // --------------------------------------------------------------------------
  // Scale Animations
  // --------------------------------------------------------------------------

  /**
   * Scale in an element (grow from small to full size)
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when animation completes
   */
  function scaleIn(element, duration = 400) {
    return new Promise(resolve => {
      element.style.transform = 'scale(0.8)';
      element.style.opacity = '0';
      element.style.display = 'block';
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      
      // Force reflow
      element.offsetHeight;
      
      element.style.transform = 'scale(1)';
      element.style.opacity = '1';
      
      setTimeout(resolve, duration);
    });
  }

  /**
   * Scale out an element
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when animation completes
   */
  function scaleOut(element, duration = 400) {
    return new Promise(resolve => {
      element.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
      element.style.transform = 'scale(0.8)';
      element.style.opacity = '0';
      
      setTimeout(() => {
        element.style.display = 'none';
        resolve();
      }, duration);
    });
  }

  // --------------------------------------------------------------------------
  // Slide Animations
  // --------------------------------------------------------------------------

  /**
   * Slide up an element (animate height from 0)
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when animation completes
   */
  function slideDown(element, duration = 400) {
    return new Promise(resolve => {
      element.style.display = 'block';
      const height = element.scrollHeight;
      element.style.height = '0';
      element.style.overflow = 'hidden';
      element.style.transition = `height ${duration}ms ease`;
      
      // Force reflow
      element.offsetHeight;
      
      element.style.height = height + 'px';
      
      setTimeout(() => {
        element.style.height = '';
        element.style.overflow = '';
        resolve();
      }, duration);
    });
  }

  /**
   * Slide up an element (animate height to 0)
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Duration in ms
   * @returns {Promise} Resolves when animation completes
   */
  function slideUp(element, duration = 400) {
    return new Promise(resolve => {
      element.style.height = element.scrollHeight + 'px';
      element.style.overflow = 'hidden';
      element.style.transition = `height ${duration}ms ease`;
      
      // Force reflow
      element.offsetHeight;
      
      element.style.height = '0';
      
      setTimeout(() => {
        element.style.display = 'none';
        element.style.height = '';
        element.style.overflow = '';
        resolve();
      }, duration);
    });
  }

  // --------------------------------------------------------------------------
  // Glow Effect
  // --------------------------------------------------------------------------

  /**
   * Add a glow effect to an element
   * @param {HTMLElement} element - Element to add glow to
   * @param {string} color - Glow color (CSS color value)
   */
  function addGlow(element, color = 'rgba(255, 143, 163, 0.5)') {
    element.style.boxShadow = `0 0 30px ${color}`;
    element.style.transition = 'box-shadow 0.3s ease';
  }

  /**
   * Remove glow effect from an element
   * @param {HTMLElement} element - Element to remove glow from
   */
  function removeGlow(element) {
    element.style.boxShadow = '';
  }

  // --------------------------------------------------------------------------
  // Stagger Animation
  // --------------------------------------------------------------------------

  /**
   * Stagger animate a list of elements
   * @param {NodeList|Array} elements - Elements to animate
   * @param {number} delay - Delay between each element in ms
   * @param {string} animationClass - Class to add for animation
   */
  function stagger(elements, delay = 100, animationClass = 'visible') {
    elements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add(animationClass);
      }, index * delay);
    });
  }

  // --------------------------------------------------------------------------
  // Scroll Reveal
  // --------------------------------------------------------------------------

  /**
   * Setup scroll reveal for elements
   * @param {string} selector - CSS selector for elements to reveal
   * @param {Object} options - Configuration options
   */
  function setupScrollReveal(selector, options = {}) {
    const defaults = {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
      animationClass: 'visible'
    };
    
    const config = { ...defaults, ...options };
    const elements = document.querySelectorAll(selector);
    
    if (!elements.length) return;
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add(config.animationClass);
          // Unobserve after animation (once only)
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: config.threshold,
      rootMargin: config.rootMargin
    });
    
    elements.forEach(el => observer.observe(el));
    
    return observer;
  }

  // --------------------------------------------------------------------------
  // Utility Functions
  // --------------------------------------------------------------------------

  /**
   * Generate random number between min and max
   * @param {number} min - Minimum value
   * @param {number} max - Maximum value
   * @returns {number} Random number
   */
  function randomBetween(min, max) {
    return Math.random() * (max - min) + min;
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  return {
    init,
    initAOS,
    refreshAOS,
    initFloatingHearts,
    fadeIn,
    fadeOut,
    scaleIn,
    scaleOut,
    slideDown,
    slideUp,
    addGlow,
    removeGlow,
    stagger,
    setupScrollReveal,
    randomBetween
  };
})();

// Initialize animations when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  Animations.init();
});
