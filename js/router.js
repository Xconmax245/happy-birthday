/* ==========================================================================
   ROUTER - SPA Navigation System
   Handles seamless page transitions without reloading to keep music playing
   ========================================================================== */

const Router = (function () {
  "use strict";

  const CONFIG = {
    transitionDuration: 400,
    contentSelector: "#page-content",
    navSelector: ".bottom-nav",
    navItemSelector: ".nav-item",
    defaultPage: "index.html",
  };

  const PAGES = {
    "index.html": "nav-home",
    "love-story.html": "nav-story",
    "questions.html": "nav-questions",
    "memories.html": "nav-memories",
    "surprise.html": "nav-surprise",
    "message.html": "nav-message",
  };

  let currentPage = "";
  let isTransitioning = false;

  function init() {
    currentPage = getCurrentPageName();
    updateActiveNav(currentPage);
    setupNavigation();
    
    // Handle browser back/forward buttons
    window.addEventListener('popstate', handlePopState);
    
    // Initial fade in
    const content = document.querySelector(CONFIG.contentSelector);
    if (content) content.classList.add("fade-in");
    
    console.log("[Router] SPA Initialized on:", currentPage);
  }

  function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1);
    return page || CONFIG.defaultPage;
  }

  function setupNavigation() {
    // Intercept all internal links
    document.addEventListener('click', (e) => {
      // Handle anchor tags (e.g. "Let's Go" button)
      const link = e.target.closest('a');
      
      // Robust check for internal links (supports file:// protocol)
      if (link) {
        const href = link.getAttribute('href');
        // Ignore external links, anchors, or empty links
        if (!href || href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:')) return;
        
        // Ignore if opening in new tab or specific download
        if (link.target === '_blank' || link.hasAttribute('download')) return;

        e.preventDefault();
        
        // Handle simple relative paths like "love-story.html"
        // If href contains path, get just the filename
        const pageName = href.split('/').pop() || CONFIG.defaultPage;
        
        if (pageName && pageName !== currentPage) {
          navigateTo(pageName);
        }
        return;
      }
      
      // Handle navigation buttons (bottom nav)
      const navItem = e.target.closest(CONFIG.navItemSelector);
      if (navItem) {
        e.preventDefault();
        const targetPage = navItem.dataset.page;
        if (targetPage && targetPage !== currentPage) {
          navigateTo(targetPage);
        }
      }
    });

    // Also handle direct .nav-item clicks if necessary (covered above)
  }

  function handlePopState() {
    currentPage = getCurrentPageName();
    updateActiveNav(currentPage);
    loadContent(currentPage, false); // Load without pushing state
  }

  function navigateTo(pageName) {
    if (isTransitioning) return;
    isTransitioning = true;

    const content = document.querySelector(CONFIG.contentSelector);
    
    // Start transition
    content.classList.remove("fade-in");
    content.classList.add("fade-out");

    setTimeout(() => {
      loadContent(pageName, true);
    }, CONFIG.transitionDuration);
  }

  async function loadContent(pageName, pushState = true) {
    try {
      console.log(`[Router] Fetching ${pageName}...`);
      const response = await fetch(pageName);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      
      const html = await response.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Extract new content
      const newContent = doc.querySelector(CONFIG.contentSelector).innerHTML;
      const contentContainer = document.querySelector(CONFIG.contentSelector);
      
      // Update DOM
      contentContainer.innerHTML = newContent;
      
      // Update URL
      if (pushState) {
        window.history.pushState({}, '', pageName);
      }
      currentPage = pageName;
      sessionStorage.setItem("lastVisitedPage", pageName);

      // Update UI
      updateActiveNav(pageName);
      
      // Fade in
      contentContainer.classList.remove("fade-out");
      contentContainer.classList.add("fade-in");
      
      // Re-initialize scripts for the new page
      reinitScripts(pageName);
      
      // Scroll to top
      window.scrollTo(0, 0);

      isTransitioning = false;

    } catch (err) {
      console.error("[Router] Navigation failed:", err);
      window.location.href = pageName; // Fallback to full reload
    }
  }

  function updateActiveNav(page) {
    const navItems = document.querySelectorAll(CONFIG.navItemSelector);
    const activeNavId = PAGES[page];
    navItems.forEach((item) => {
      item.classList.remove("active");
      if (item.id === activeNavId) item.classList.add("active");
    });
  }

  function reinitScripts(pageName) {
    // Re-initialize AOS
    if (window.AOS) {
      setTimeout(() => window.AOS.refreshHard(), 100);
    }

    // Trigger custom event for other scripts to re-init
    document.dispatchEvent(new CustomEvent('page:loaded', { detail: { page: pageName } }));
    
    // Note: Most scripts currently use DOMContentLoaded. 
    // We will need to update them to listen to 'page:loaded' as well.
  }

  return { init, navigateTo };
})();

document.addEventListener("DOMContentLoaded", () => Router.init());
