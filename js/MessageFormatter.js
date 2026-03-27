import { GRID_COLS, GRID_ROWS } from './constants.js';

export function formatTextForGrid(rawText) {
  if (!rawText) return Array(GRID_ROWS).fill('');

  const text = rawText.toUpperCase().trim();
  const words = text.split(/\s+/);
  const lines = [];
  let currentLine = '';

  for (const word of words) {
    if (!currentLine) {
      // First word on the line
      let w = word;
      while (w.length > GRID_COLS) {
        lines.push(w.substring(0, GRID_COLS));
        w = w.substring(GRID_COLS);
      }
      currentLine = w;
    } else {
      // Check if word fits with a space
      if (currentLine.length + 1 + word.length <= GRID_COLS) {
        currentLine += ' ' + word;
      } else {
        // Doesn't fit, start a new line
        lines.push(currentLine);
        let w = word;
        while (w.length > GRID_COLS) {
          lines.push(w.substring(0, GRID_COLS));
          w = w.substring(GRID_COLS);
        }
        currentLine = w;
      }
    }
  }

  if (currentLine) {
    lines.push(currentLine);
  }

  // Vertical centering logic (GRID_ROWS is expected to be 5)
  const result = Array(GRID_ROWS).fill('');
  const numLines = Math.min(lines.length, GRID_ROWS);

  if (numLines === 1) {
    result[2] = lines[0]; // 3rd line
  } else if (numLines === 2) {
    result[1] = lines[0]; // 2nd line
    result[3] = lines[1]; // 4th line
  } else if (numLines === 3) {
    result[1] = lines[0]; // 2nd line
    result[2] = lines[1]; // 3rd line
    result[3] = lines[2]; // 4th line
  } else if (numLines === 4) {
    result[0] = lines[0];
    result[1] = lines[1];
    result[2] = lines[2];
    result[3] = lines[3];
  } else {
    for (let i = 0; i < numLines; i++) {
      result[i] = lines[i];
    }
  }

  return result;
}
