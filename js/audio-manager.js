/* ==========================================================================
   AUDIO MANAGER - Persistent Background Music
   Handles continuous playback across page navigations
   ========================================================================== */

const AudioManager = (function() {
  'use strict';

  let audio = null;
  let isPlaying = false;
  const AUDIO_SRC = 'assets/lottie/New_West_-_Those_Eyes_CeeNaija.com_.mp3'; 
  const STORAGE_KEY = 'birthday_audio_state';

  function init() {
    // Create audio element if it doesn't exist
    if (!audio) {
      audio = new Audio(AUDIO_SRC);
      audio.loop = true;
      audio.volume = 0.5;
    }

    // Load saved state
    const savedState = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (savedState) {
      audio.currentTime = savedState.currentTime || 0;
      isPlaying = savedState.isPlaying || false;
    }

    // Create UI Control
    createMusicControl();

    // If it was playing, try to resume (might be blocked by browser until interaction)
    if (isPlaying) {
      attemptPlay();
    }

    // Update state periodically
    setInterval(() => {
      if (audio && !audio.paused) {
        saveState();
      }
    }, 1000);

    // Global interaction listener to clear autoplay blocks AND start music if needed
    const handleInteraction = () => {
        if (!isPlaying) {
            startMusic();
        } else if (audio.paused) {
            attemptPlay();
        }
    };

    document.addEventListener('click', handleInteraction);
    document.addEventListener('touchstart', handleInteraction);
    document.addEventListener('keydown', handleInteraction);
  }

  function saveState() {
    const state = {
      currentTime: audio.currentTime,
      isPlaying: !audio.paused
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function attemptPlay() {
    audio.play().catch(err => {
      console.log('Autoplay blocked. Waiting for interaction.');
    });
  }

  function toggleMusic() {
    if (audio.paused) {
      audio.play();
      isPlaying = true;
    } else {
      audio.pause();
      isPlaying = false;
    }
    saveState();
    updateUI();
  }

  function createMusicControl() {
    if (document.getElementById('music-control')) return;

    const control = document.createElement('div');
    control.id = 'music-control';
    control.className = 'music-control';
    control.innerHTML = `
      <button class="music-toggle-btn" aria-label="Toggle Music">
        <div class="music-bars">
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
          <span class="bar"></span>
        </div>
      </button>
    `;

    document.body.appendChild(control);

    control.querySelector('button').addEventListener('click', toggleMusic);
    updateUI();
  }

  function updateUI() {
    const control = document.getElementById('music-control');
    if (!control) return;

    if (audio.paused) {
      control.classList.add('muted');
    } else {
      control.classList.remove('muted');
    }
  }

  // Exposed method to start music from index.html modal
  function startMusic() {
    isPlaying = true;
    attemptPlay();
    saveState();
    updateUI();
  }

  return { init, toggleMusic, startMusic };
})();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => AudioManager.init());
} else {
  AudioManager.init();
}
