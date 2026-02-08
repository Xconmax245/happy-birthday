/* ==========================================================================
   QUESTIONS - Questions Page Logic
   Clean rewrite for reliable functionality
   ========================================================================== */

(function() {
  'use strict';

  // Question Bank - 20 Romantic Questions
  const QUESTION_BANK = [
    { id: 1, text: "What's your favorite memory of us together?" },
    { id: 2, text: "If we could travel anywhere tomorrow, where would you want to go?" },
    { id: 3, text: "What song reminds you of our relationship?" },
    { id: 4, text: "What do you love most about lazy Sundays with me?" },
    { id: 5, text: "What was the moment you knew I was special to you?" },
    { id: 6, text: "What's something you've always wanted to do together?" },
    { id: 7, text: "What's your favorite thing about the way I laugh?" },
    { id: 8, text: "If you could relive one day with me, which would it be?" },
    { id: 9, text: "What's a small thing I do that makes you happy?" },
    { id: 10, text: "What dream do you want us to achieve together?" },
    { id: 11, text: "What's your favorite way to spend time with me?" },
    { id: 12, text: "What makes our love unique?" },
    { id: 13, text: "What's something new you've learned about love from me?" },
    { id: 14, text: "If we had a theme song, what would it be?" },
    { id: 15, text: "What's the most romantic moment we've shared?" },
    { id: 16, text: "What do you miss most when we're apart?" },
    { id: 17, text: "What's your favorite photo of us?" },
    { id: 18, text: "What makes you feel most loved by me?" },
    { id: 19, text: "What adventure should we go on next?" },
    { id: 20, text: "What's one thing you want to promise me forever?" }
  ];

  // State
  let currentQuestion = null;
  let isFlipped = false;
  let questionIndex = 0;

  // DOM Elements
  let card, questionText, answerInput, counterEl, progressDots;
  let flipBtn, flipBtnBack, saveBtn, nextBtn, shareBtn, savedMsg;

  function init() {
    // Only run on questions page
    if (!document.getElementById('question-card')) return;

    // Cache DOM elements
    card = document.getElementById('question-card');
    questionText = document.getElementById('question-text');
    answerInput = document.getElementById('answer-input');
    counterEl = document.getElementById('question-counter');
    progressDots = document.getElementById('progress-dots');
    flipBtn = document.getElementById('flip-btn');
    flipBtnBack = document.getElementById('flip-btn-back');
    saveBtn = document.getElementById('save-btn');
    nextBtn = document.getElementById('next-btn');
    shareBtn = document.getElementById('share-btn');
    savedMsg = document.getElementById('saved-answer');

    // Setup event listeners
    if (flipBtn) flipBtn.addEventListener('click', flipCard);
    if (flipBtnBack) flipBtnBack.addEventListener('click', flipCard);
    if (saveBtn) saveBtn.addEventListener('click', saveAnswer);
    if (nextBtn) nextBtn.addEventListener('click', loadNextQuestion);
    if (shareBtn) shareBtn.addEventListener('click', exportAnswers);

    // Build progress dots
    buildProgressDots();

    // Load first question
    loadQuestion(0);

    console.log('[Questions] Initialized');
  }

  // Initialize when DOM is ready
  document.addEventListener('DOMContentLoaded', init);
  
  // Re-initialize on SPA navigation
  document.addEventListener('page:loaded', (e) => {
    if (e.detail.page === 'questions.html') init();
  });

  // Build progress indicator dots
  function buildProgressDots() {
    if (!progressDots) return;
    progressDots.innerHTML = '';
    
    for (let i = 0; i < QUESTION_BANK.length; i++) {
      const dot = document.createElement('span');
      dot.className = 'progress-dot';
      dot.dataset.index = i;
      
      // Question tooltips
      dot.title = `Question ${i + 1}`;
      
      // Check if answered
      const answer = getStoredAnswer(QUESTION_BANK[i].id);
      if (answer) dot.classList.add('completed');
      
      // Add click handler to jump to question
      dot.addEventListener('click', function() {
        loadQuestion(parseInt(this.dataset.index));
      });
      dot.style.cursor = 'pointer';
      
      progressDots.appendChild(dot);
    }
  }

  // Update progress dots
  function updateProgressDots() {
    if (!progressDots) return;
    const dots = progressDots.querySelectorAll('.progress-dot');
    
    dots.forEach((dot, i) => {
      dot.classList.remove('active');
      if (i === questionIndex) dot.classList.add('active');
      
      const answer = getStoredAnswer(QUESTION_BANK[i].id);
      if (answer) {
        dot.classList.add('completed');
      } else {
        dot.classList.remove('completed');
      }
    });
  }

  // Update counter text
  function updateCounter() {
    if (!counterEl) return;
    const answered = QUESTION_BANK.filter(q => getStoredAnswer(q.id)).length;
    counterEl.textContent = `Question ${questionIndex + 1} of ${QUESTION_BANK.length} (${answered} answered)`;
  }

  // Load a specific question by index
  function loadQuestion(index) {
    // Ensure valid index
    if (index < 0) index = QUESTION_BANK.length - 1;
    if (index >= QUESTION_BANK.length) index = 0;
    
    questionIndex = index;
    currentQuestion = QUESTION_BANK[index];

    // Update question text
    if (questionText) {
      questionText.textContent = currentQuestion.text;
    }

    // Load existing answer if any
    if (answerInput) {
      const saved = getStoredAnswer(currentQuestion.id);
      answerInput.value = saved ? saved.answer : '';
      answerInput.style.borderColor = '';
    }

    // Hide saved message
    if (savedMsg) savedMsg.classList.add('hide');

    // Update UI
    updateCounter();
    updateProgressDots();

    // If card is flipped, unflip it
    if (isFlipped) {
      flipCard();
    }
  }

  // Load next question
  function loadNextQuestion() {
    loadQuestion(questionIndex + 1);
  }

  // Flip the card
  function flipCard() {
    if (!card) return;
    
    isFlipped = !isFlipped;
    card.classList.toggle('flipped', isFlipped);
    
    // Update button text
    if (flipBtn) {
      const span = flipBtn.querySelector('span');
      if (span) span.textContent = isFlipped ? 'See Question' : 'Answer';
    }
  }

  // Save answer
  function saveAnswer() {
    if (!answerInput || !currentQuestion) return;

    const answer = answerInput.value.trim();
    
    // Validate
    if (!answer) {
      answerInput.style.borderColor = 'var(--color-rose)';
      answerInput.focus();
      setTimeout(() => {
        answerInput.style.borderColor = '';
      }, 1500);
      return;
    }

    // Save to localStorage
    storeAnswer(currentQuestion.id, answer);

    // Show success
    if (savedMsg) {
      savedMsg.textContent = 'Answer saved!';
      savedMsg.classList.remove('hide');
    }

    // Button feedback
    if (saveBtn) {
      const span = saveBtn.querySelector('span');
      if (span) {
        const original = span.textContent;
        span.textContent = 'Saved!';
        saveBtn.disabled = true;
        setTimeout(() => {
          span.textContent = original;
          saveBtn.disabled = false;
        }, 1500);
      }
    }

    // Update dots
    updateProgressDots();
    updateCounter();
  }

  // Storage helpers
  function storeAnswer(questionId, answer) {
    try {
      const key = 'love_answers';
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      data[questionId] = { answer: answer, timestamp: new Date().toISOString() };
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {
      console.warn('Storage error:', e);
    }
  }

  function getStoredAnswer(questionId) {
    try {
      const key = 'love_answers';
      const data = JSON.parse(localStorage.getItem(key) || '{}');
      return data[questionId] || null;
    } catch (e) {
      return null;
    }
  }

  function getAllAnswers() {
    try {
      const key = 'love_answers';
      return JSON.parse(localStorage.getItem(key) || '{}');
    } catch (e) {
      return {};
    }
  }

  // Export answers to clipboard
  function exportAnswers() {
    const answers = getAllAnswers();
    const answered = Object.keys(answers);
    
    if (answered.length === 0) {
      alert('No answers to export yet!');
      return;
    }

    let text = '=== OUR LOVE STORY - ANSWERS ===\n\n';
    
    QUESTION_BANK.forEach(q => {
      const entry = answers[q.id];
      if (entry) {
        text += `Q: ${q.text}\nA: ${entry.answer}\n\n`;
      }
    });

    // Copy to clipboard
    navigator.clipboard.writeText(text).then(() => {
      if (shareBtn) {
        const original = shareBtn.innerHTML;
        shareBtn.innerHTML = '<span>Copied!</span>';
        
        // After 2 seconds, offer to open WhatsApp
        setTimeout(() => {
          shareBtn.innerHTML = '<span>Open WhatsApp?</span>';
          shareBtn.onclick = () => {
            // Replace YOUR_PHONE_NUMBER with your actual number in international format
            // Format: country code + number (no + sign, no spaces, no dashes)
            // Example: Nigeria +234 803 123 4567 becomes 2348031234567
            const phoneNumber = '2349068344681'; // ← PUT YOUR NUMBER HERE
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(text)}`;
            window.open(url, '_blank');
            shareBtn.innerHTML = original;
            shareBtn.onclick = exportAnswers; // Reset
          };
        }, 2000);
      }
    }).catch(() => {
      alert(text);
    });
  }

  // Expose globally for debugging
  window.Questions = {
    loadQuestion,
    loadNextQuestion,
    flipCard,
    saveAnswer,
    exportAnswers,
    getAll: getAllAnswers
  };

})();