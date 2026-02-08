/* ==========================================================================
   MEMORIES - Memories Gallery Page Logic
   ========================================================================== */

const Memories = (function() {
  'use strict';

  let lightbox;
  let isLightboxOpen = false;

  function init() {
    lightbox = document.getElementById('lightbox');

    setupMediaLoading();
    setupLightbox();
    setupEventListeners();
  }

  function setupMediaLoading() {
    // Images
    const images = document.querySelectorAll('.memory-image');
    images.forEach(img => {
      if (img.complete) {
        img.classList.add('loaded');
      } else {
        img.addEventListener('load', () => img.classList.add('loaded'));
      }
    });

    // Videos
    const videos = document.querySelectorAll('.memory-video');
    videos.forEach(video => {
      video.addEventListener('loadeddata', () => video.classList.add('loaded'));
    });
  }

  function setupLightbox() {
    const memoryItems = document.querySelectorAll('.memory-item');
    memoryItems.forEach(item => {
      item.addEventListener('click', () => openLightbox(item));
    });

    if (lightbox) {
      lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
      });
    }
  }

  function setupEventListeners() {
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && lightbox?.classList.contains('active')) {
        closeLightbox();
      }
    });
  }

  function openLightbox(item) {
    if (!lightbox) return;
    
    const type = item.getAttribute('data-type');
    lightbox.innerHTML = ''; // Clear previous content
    
    // Re-add close button (since we cleared innerHTML)
    const closeBtn = document.createElement('button');
    closeBtn.className = 'lightbox-close';
    closeBtn.innerHTML = '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>';
    closeBtn.onclick = closeLightbox;
    lightbox.appendChild(closeBtn);

    if (type === 'image') {
      const img = item.querySelector('.memory-image');
      if (!img) return;
      const lightImg = document.createElement('img');
      lightImg.className = 'lightbox-content';
      lightImg.src = img.src;
      lightImg.alt = img.alt;
      lightbox.appendChild(lightImg);
    } else if (type === 'video') {
      const video = item.querySelector('.memory-video source');
      if (!video) return;
      const lightVideo = document.createElement('video');
      lightVideo.className = 'lightbox-content';
      lightVideo.src = video.src;
      lightVideo.controls = true;
      lightVideo.autoplay = true;
      lightVideo.loop = true;
      lightbox.appendChild(lightVideo);
    }

    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    if (!lightbox) return;
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
    
    // Stop any playing video
    const video = lightbox.querySelector('video');
    if (video) {
      video.pause();
      video.src = "";
      video.load();
    }
  }

  return { init, openLightbox, closeLightbox };
})();

document.addEventListener('DOMContentLoaded', function() {
  if (document.querySelector('.memory-grid')) Memories.init();
});
