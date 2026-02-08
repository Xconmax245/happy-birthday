/* ==========================================================================
   ROUTER - JavaScript Page Swapping System
   Handles smooth transitions between pages without full page reloads
   ========================================================================== */

/**
 * Router Module
 * Controls navigation and page transitions with fade effects
 */
const Router = (function () {
  "use strict";

  // --------------------------------------------------------------------------
  // Configuration
  // --------------------------------------------------------------------------
  const CONFIG = {
    transitionDuration: 450, // Duration of fade transition in ms
    contentSelector: "#page-content",
    navSelector: ".bottom-nav",
    navItemSelector: ".nav-item",
    defaultPage: "index.html",
  };

  // Page mapping for navigation items
  const PAGES = {
    "index.html": "nav-home",
    "love-story.html": "nav-story",
    "questions.html": "nav-questions",
    "memories.html": "nav-memories",
    "surprise.html": "nav-surprise",
    "message.html": "nav-message",
  };

  // --------------------------------------------------------------------------
  // State
  // --------------------------------------------------------------------------
  let currentPage = "";
  let isTransitioning = false;

  // --------------------------------------------------------------------------
  // Core Functions
  // --------------------------------------------------------------------------

  /**
   * Initialize the router
   * Sets up event listeners and determines current page
   */
  function init() {
    // Determine current page from URL
    currentPage = getCurrentPageName();

    // Update navigation state
    updateActiveNav(currentPage);

    // Save current page to session storage
    saveLastVisitedPage(currentPage);

    // Setup navigation click handlers
    setupNavigation();

    // Add fade-in animation to current page
    const content = document.querySelector(CONFIG.contentSelector);
    if (content) {
      content.classList.add("fade-in");
    }

    console.log("[Router] Initialized on page:", currentPage);
  }

  /**
   * Get the current page name from the URL
   * @returns {string} Current page filename
   */
  function getCurrentPageName() {
    const path = window.location.pathname;
    const page = path.substring(path.lastIndexOf("/") + 1);
    return page || CONFIG.defaultPage;
  }

  /**
   * Setup click handlers for navigation items
   */
  function setupNavigation() {
    const navItems = document.querySelectorAll(CONFIG.navItemSelector);

    navItems.forEach((item) => {
      item.addEventListener("click", handleNavClick);
    });
  }

  /**
   * Handle navigation item click
   * @param {Event} event - Click event
   */
  function handleNavClick(event) {
    event.preventDefault();

    // Prevent multiple transitions
    if (isTransitioning) return;

    const targetPage = event.currentTarget.dataset.page;

    // Don't navigate to current page
    if (targetPage === currentPage) return;

    // Navigate to the target page
    navigateTo(targetPage);
  }

  /**
   * Navigate to a new page with transition effect
   * @param {string} pageName - Target page filename
   */
  function navigateTo(pageName) {
    if (isTransitioning) return;

    isTransitioning = true;

    const content = document.querySelector(CONFIG.contentSelector);

    if (!content) {
      // Fallback: direct navigation
      window.location.href = pageName;
      return;
    }

    // Start fade out
    content.classList.remove("fade-in");
    content.classList.add("fade-out");

    console.log("[Router] Navigating to:", pageName);

    // After fade out completes, navigate to new page
    setTimeout(() => {
      // Save the page we're navigating to
      saveLastVisitedPage(pageName);

      // Navigate to new page
      window.location.href = pageName;
    }, CONFIG.transitionDuration);
  }

  /**
   * Update the active state of navigation items
   * @param {string} page - Current page filename
   */
  function updateActiveNav(page) {
    const navItems = document.querySelectorAll(CONFIG.navItemSelector);
    const activeNavId = PAGES[page];

    navItems.forEach((item) => {
      item.classList.remove("active");

      if (item.id === activeNavId) {
        item.classList.add("active");
      }
    });
  }

  /**
   * Save the last visited page to session storage
   * @param {string} page - Page filename
   */
  function saveLastVisitedPage(page) {
    try {
      sessionStorage.setItem("lastVisitedPage", page);
    } catch (e) {
      console.warn("[Router] Could not save to sessionStorage:", e);
    }
  }

  /**
   * Get the last visited page from session storage
   * @returns {string|null} Last visited page or null
   */
  function getLastVisitedPage() {
    try {
      return sessionStorage.getItem("lastVisitedPage");
    } catch (e) {
      console.warn("[Router] Could not read from sessionStorage:", e);
      return null;
    }
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  return {
    init,
    navigateTo,
    getCurrentPage: getCurrentPageName,
    getLastVisitedPage,
  };
})();

// Initialize router when DOM is ready
document.addEventListener("DOMContentLoaded", function () {
  Router.init();
});
