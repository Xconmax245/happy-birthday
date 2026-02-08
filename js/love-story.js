/* ==========================================================================
   LOVE STORY - Timeline Logic
   Handles interactivity for the Our Story timeline
   ========================================================================== */

(function() {
  'use strict';

  function init() {
    console.log('[LoveStory] Initialized');
    
    // Restore state of open cards from State manager if available
    if (window.State) {
        const openCards = window.State.getOpenTimelineCards();
        openCards.forEach(id => {
            const item = document.querySelector(`.timeline-item[data-id="${id}"]`);
            if (item) item.classList.add('open');
        });
    }

    // Attach click listeners to timeline cards
    // We do this via delegation or direct attachment.
    // Since cards are static in HTML, we can attach directly.
    const timelineItems = document.querySelectorAll('.timeline-item');
    timelineItems.forEach(item => {
        const card = item.querySelector('.timeline-card');
        if (card) {
            // Remove old listeners to be safe (though typically new DOM on nav)
            card.onclick = null; 
            card.onclick = () => toggleTimelineItem(item);
        }
    });
  }

  function toggleTimelineItem(item) {
    if (!item) return;
    
    // Toggle class
    item.classList.toggle('open');
    
    // Save state
    const eventId = item.dataset.id;
    if (eventId && window.State) {
        window.State.toggleTimelineCard(eventId);
    }
  }

  // Expose init globally
  window.LoveStory = {
    init: init
  };

  // Initialize on load
  document.addEventListener('DOMContentLoaded', init);
  
  // Re-initialize on SPA navigation
  document.addEventListener('page:loaded', (e) => {
    if (e.detail.page === 'love-story.html') init();
  });

})();
