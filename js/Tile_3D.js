import { CHARSET } from './constants.js';

export class Tile_3D {
  constructor(row, col, soundEngine) {
    this.row = row;
    this.col = col;
    this.soundEngine = soundEngine;
    this.currentChar = ' ';
    this.isAnimating = false;

    this.el = document.createElement('div');
    this.el.className = 'tile';

    this.topStatic = this._createHalf('top-half');
    this.botStatic = this._createHalf('bottom-half');
    
    this.flipper = document.createElement('div');
    this.flipper.className = 'flipper';
    
    this.flipperFront = this._createHalf('flipper-front', true);
    this.flipperBack = this._createHalf('flipper-back', true);
    
    this.flipper.appendChild(this.flipperFront.el);
    this.flipper.appendChild(this.flipperBack.el);

    this.el.appendChild(this.topStatic.el);
    this.el.appendChild(this.botStatic.el);
    this.el.appendChild(this.flipper);
  }

  _createHalf(extraClass, isFlipper = false) {
    const el = document.createElement('div');
    el.className = isFlipper ? extraClass : `half-common ${extraClass}`;
    const span = document.createElement('span');
    span.className = 'half-text';
    el.appendChild(span);
    return { el, span };
  }

  setChar(char) {
    this.currentChar = char;
    const t = char === ' ' ? '' : char;
    this.topStatic.span.textContent = t;
    this.botStatic.span.textContent = t;
    this.flipperFront.span.textContent = t;
    this.flipperBack.span.textContent = t;
    this.flipper.classList.remove('flipping');
  }

  scrambleTo(targetChar, delay) {
    if (targetChar === this.currentChar) return;
    this.isAnimating = true;

    setTimeout(() => {
      let scrambleCount = 0;
      const maxScrambles = 5 + Math.floor(Math.random() * 20);
      
      const flipNext = () => {
        if (scrambleCount >= maxScrambles) {
          this.setChar(targetChar); // Finish exactly on it
          this.isAnimating = false;
          if (this.soundEngine) this.soundEngine.playSingleFlap();
          return;
        }
        
        const randChar = CHARSET[Math.floor(Math.random() * CHARSET.length)];
        this._triggerFlip(randChar, () => {
          scrambleCount++;
          flipNext();
        });
      };
      
      flipNext();
    }, delay);
  }

  _triggerFlip(nextChar, onComplete) {
    const displayNext = nextChar === ' ' ? '' : nextChar;
    const displayCurr = this.currentChar === ' ' ? '' : this.currentChar;

    this.flipper.classList.remove('flipping');
    void this.flipper.offsetWidth; // Force reflow

    // Setup DOM for animation visually:
    this.topStatic.span.textContent = displayNext;
    this.botStatic.span.textContent = displayCurr;
    this.flipperFront.span.textContent = displayCurr;
    this.flipperBack.span.textContent = displayNext;

    if (this.soundEngine) {
      this.soundEngine.playSingleFlap();
    }

    this.flipper.classList.add('flipping');

    // Interval matches animation time + tiny pad
    setTimeout(() => {
      this.currentChar = nextChar;
      onComplete();
    }, 125);
  }
}
