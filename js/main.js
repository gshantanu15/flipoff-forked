import { Board } from './Board.js';
import { SoundEngine } from './SoundEngine.js';
import { MessageRotator } from './MessageRotator.js';
import { KeyboardController } from './KeyboardController.js';
import { formatTextForGrid } from './MessageFormatter.js';

document.addEventListener('DOMContentLoaded', () => {
  const boardContainer = document.getElementById('board-container');
  const soundEngine = new SoundEngine();
  const board = new Board(boardContainer, soundEngine);
  const rotator = new MessageRotator(board);
  const keyboard = new KeyboardController(rotator, soundEngine);

  // Initialize audio on first user interaction (browser autoplay policy)
  let audioInitialized = false;
  const initAudio = async () => {
    if (audioInitialized) return;
    audioInitialized = true;
    await soundEngine.init();
    soundEngine.resume();
    document.removeEventListener('click', initAudio);
    document.removeEventListener('keydown', initAudio);
  };
  document.addEventListener('click', initAudio);
  document.addEventListener('keydown', initAudio);

  // Start message rotation
  rotator.start();

  // Volume toggle button in header
  const volumeBtn = document.getElementById('volume-btn');
  if (volumeBtn) {
    volumeBtn.addEventListener('click', () => {
      initAudio();
      const muted = soundEngine.toggleMute();
      volumeBtn.classList.toggle('muted', muted);
    });
  }

  // "Add to Board" button: format message, push to rotator, and scroll
  const addMsgBtn = document.getElementById('add-msg-btn');
  const customMsgInput = document.getElementById('custom-msg-input');
  
  if (addMsgBtn && customMsgInput) {
    const handleCustomSubmit = (e) => {
      e.preventDefault();
      const text = customMsgInput.value.trim();
      if (!text) return;
      
      initAudio();
      
      const lines = formatTextForGrid(text);
      rotator.addCustomMessage(lines);
      
      customMsgInput.value = '';
      
      boardContainer.scrollIntoView({ behavior: 'smooth' });
      // Keep it completely unobtrusive; no forced fullscreen on custom submit, just scroll.
    };

    addMsgBtn.addEventListener('click', handleCustomSubmit);
    customMsgInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        handleCustomSubmit(e);
      }
    });
  }
});
