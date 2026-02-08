/* ==========================================================================
   STATE - Session Storage State Management
   Persists user data across page navigations and reloads
   ========================================================================== */

/**
 * State Management Module
 * Handles all sessionStorage operations for the love experience
 */
const State = (function() {
  'use strict';

  // --------------------------------------------------------------------------
  // Storage Keys
  // --------------------------------------------------------------------------
  const KEYS = {
    ANSWERS: 'love_answers',           // User's question answers
    LAST_PAGE: 'lastVisitedPage',      // Last visited page
    OPEN_TIMELINE: 'openTimelineCards', // Which timeline cards are open
    ASKED_QUESTIONS: 'askedQuestions', // Questions already shown
    SURPRISE_SEEN: 'surpriseSeen',     // Whether surprise was triggered
    MESSAGE_PROGRESS: 'messageProgress' // Scroll progress on message page
  };

  // --------------------------------------------------------------------------
  // Core Storage Functions
  // --------------------------------------------------------------------------

  /**
   * Get an item from sessionStorage
   * @param {string} key - Storage key
   * @param {*} defaultValue - Default value if key doesn't exist
   * @returns {*} Stored value or default
   */
  function get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      if (item === null) return defaultValue;
      return JSON.parse(item);
    } catch (e) {
      console.warn('[State] Error getting item:', key, e);
      return defaultValue;
    }
  }

  /**
   * Set an item in sessionStorage
   * @param {string} key - Storage key
   * @param {*} value - Value to store
   */
  function set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('[State] Error setting item:', key, e);
    }
  }

  /**
   * Remove an item from sessionStorage
   * @param {string} key - Storage key
   */
  function remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn('[State] Error removing item:', key, e);
    }
  }

  /**
   * Clear all stored state
   */
  function clearAll() {
    try {
      Object.values(KEYS).forEach(key => {
        localStorage.removeItem(key);
      });
    } catch (e) {
      console.warn('[State] Error clearing state:', e);
    }
  }

  // --------------------------------------------------------------------------
  // Question Answer Functions
  // --------------------------------------------------------------------------

  /**
   * Save an answer to a question
   * @param {number} questionId - Question ID
   * @param {string} answer - User's answer
   */
  function saveAnswer(questionId, answer) {
    const answers = get(KEYS.ANSWERS, {});
    answers[questionId] = {
      answer: answer,
      timestamp: new Date().toISOString()
    };
    set(KEYS.ANSWERS, answers);
    console.log('[State] Saved answer for question:', questionId);
  }

  /**
   * Get an answer for a specific question
   * @param {number} questionId - Question ID
   * @returns {object|null} Answer object or null
   */
  function getAnswer(questionId) {
    const answers = get(KEYS.ANSWERS, {});
    return answers[questionId] || null;
  }

  /**
   * Get all saved answers
   * @returns {object} All answers
   */
  function getAllAnswers() {
    return get(KEYS.ANSWERS, {});
  }

  /**
   * Export answers as a formatted string
   * @returns {string} Formatted answers
   */
  function exportAnswers() {
    const answers = getAllAnswers();
    if (Object.keys(answers).length === 0) return "No answers found yet.";

    let output = "💖 OUR LOVE STORIES - ANSWERS 💖\n\n";
    
    // We'll need the questions from the bank, but since this module 
    // doesn't have them, we just output the IDs or wait for the 
    // export to be called from the Questions module.
    return output + JSON.stringify(answers, null, 2);
  }

  // --------------------------------------------------------------------------
  // Asked Questions Functions
  // --------------------------------------------------------------------------

  /**
   * Mark a question as asked
   * @param {number} questionId - Question ID
   */
  function markQuestionAsked(questionId) {
    const asked = get(KEYS.ASKED_QUESTIONS, []);
    if (!asked.includes(questionId)) {
      asked.push(questionId);
      set(KEYS.ASKED_QUESTIONS, asked);
    }
  }

  /**
   * Get all asked question IDs
   * @returns {number[]} Array of asked question IDs
   */
  function getAskedQuestions() {
    return get(KEYS.ASKED_QUESTIONS, []);
  }

  /**
   * Reset asked questions (when all have been asked)
   */
  function resetAskedQuestions() {
    set(KEYS.ASKED_QUESTIONS, []);
    console.log('[State] Reset asked questions');
  }

  // --------------------------------------------------------------------------
  // Timeline Functions
  // --------------------------------------------------------------------------

  /**
   * Toggle a timeline card's open state
   * @param {string} cardId - Timeline card ID
   */
  function toggleTimelineCard(cardId) {
    const openCards = get(KEYS.OPEN_TIMELINE, []);
    const index = openCards.indexOf(cardId);
    
    if (index > -1) {
      openCards.splice(index, 1);
    } else {
      openCards.push(cardId);
    }
    
    set(KEYS.OPEN_TIMELINE, openCards);
  }

  /**
   * Check if a timeline card is open
   * @param {string} cardId - Timeline card ID
   * @returns {boolean} Whether the card is open
   */
  function isTimelineCardOpen(cardId) {
    const openCards = get(KEYS.OPEN_TIMELINE, []);
    return openCards.includes(cardId);
  }

  /**
   * Get all open timeline cards
   * @returns {string[]} Array of open card IDs
   */
  function getOpenTimelineCards() {
    return get(KEYS.OPEN_TIMELINE, []);
  }

  // --------------------------------------------------------------------------
  // Surprise Functions
  // --------------------------------------------------------------------------

  /**
   * Mark surprise as seen
   */
  function markSurpriseSeen() {
    set(KEYS.SURPRISE_SEEN, true);
  }

  /**
   * Check if surprise has been seen
   * @returns {boolean} Whether surprise was seen
   */
  function hasSurpriseBeenSeen() {
    return get(KEYS.SURPRISE_SEEN, false);
  }

  // --------------------------------------------------------------------------
  // Message Progress Functions
  // --------------------------------------------------------------------------

  /**
   * Save message page scroll progress
   * @param {number} progress - Scroll progress (0-1)
   */
  function saveMessageProgress(progress) {
    set(KEYS.MESSAGE_PROGRESS, progress);
  }

  /**
   * Get message page scroll progress
   * @returns {number} Scroll progress (0-1)
   */
  function getMessageProgress() {
    return get(KEYS.MESSAGE_PROGRESS, 0);
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------
  return {
    // Core functions
    get,
    set,
    remove,
    clearAll,
    KEYS,
    
    // Question functions
    saveAnswer,
    getAnswer,
    getAllAnswers,
    markQuestionAsked,
    getAskedQuestions,
    resetAskedQuestions,
    
    // Timeline functions
    toggleTimelineCard,
    isTimelineCardOpen,
    getOpenTimelineCards,
    
    // Surprise functions
    markSurpriseSeen,
    hasSurpriseBeenSeen,
    
    // Message functions
    saveMessageProgress,
    getMessageProgress,
    
    // Export function
    exportAnswers
  };
})();
