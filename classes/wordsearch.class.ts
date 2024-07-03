export class Wordsearch {
  private words: string[];
  private difficulty: { [key: string]: number } = {
    '10x10': 10,
    '15x15': 15,
    '20x20': 20,
  };
  private grid: string[][];
  private size: number;
  private unusedWords: string[];
  private highlightedItems: (
    | { rowIndex: number; colIndex: number; letter: string }
    | string
  )[] = [];

  constructor(words: string[], level: string) {
    this.grid = [[]];
    this.words = words;
    this.size = this.difficulty[level];
    this.unusedWords = [];
  }

  makeGrid() {
    this.grid = Array.from(Array(this.size), () =>
      new Array(this.size).fill(null)
    );
    return this.grid;
  }

  random = (min: number, max: number) => {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  fillGrid() {
    const possible: string = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const gridCopy = this.grid.map((row) => [...row]);

    for (let i = 0; i < gridCopy.length; i++) {
      let row = gridCopy[i];
      for (let j = 0; j < row.length; j++) {
        if (gridCopy[i][j] === null) {
          gridCopy[i][j] = possible[this.random(0, possible.length - 1)];
        }
      }
    }
    this.grid = gridCopy;
    return this.grid;
  }

  placeWords() {
    // Insert each word into the grid at a random location and orientation
    for (const word of this.words) {
      const wordLength = word.length;
      const maxIterations = 1000;
      let iterations = 0;
      while (iterations < maxIterations) {
        const orientation = Math.floor(Math.random() * 4); // 0 = horizontal, 1 = vertical, 2 = diagonal up, 3 = diagonal down
        let startRow, startCol, rowStep, colStep;

        if (orientation === 0) {
          // Horizontal
          startRow = Math.floor(Math.random() * this.size);
          startCol = Math.floor(Math.random() * (this.size - wordLength + 1));
          rowStep = 0;
          colStep = 1;
        } else if (orientation === 1) {
          // Vertical
          startRow = Math.floor(Math.random() * (this.size - wordLength + 1));
          startCol = Math.floor(Math.random() * this.size);
          rowStep = 1;
          colStep = 0;
        } else if (orientation === 2) {
          // Diagonal up
          startRow = Math.floor(
            Math.random() * (this.size - wordLength + 1) + wordLength - 1
          );
          startCol = Math.floor(Math.random() * (this.size - wordLength + 1));
          rowStep = -1;
          colStep = 1;
        } else {
          // Diagonal down
          startRow = Math.floor(Math.random() * (this.size - wordLength + 1));
          startCol = Math.floor(Math.random() * (this.size - wordLength + 1));
          rowStep = 1;
          colStep = 1;
        }

        let validLocation = true;
        // Check if the word fits in the grid at the chosen location and orientation
        for (let i = 0; i < wordLength; i++) {
          const row = startRow + i * rowStep;
          const col = startCol + i * colStep;

          if (this.grid[row][col] !== null && this.grid[row][col] !== word[i]) {
            validLocation = false;
            break;
          }
        }
        // If the word fits, insert it into the grid and exit the loop
        if (validLocation) {
          for (let i = 0; i < wordLength; i++) {
            const rowIndex = startRow + i * rowStep;
            const colIndex = startCol + i * colStep;

            const letter = word[i].toUpperCase();
            this.grid[rowIndex][colIndex] = letter;
            this.highlightedItems.push(
              JSON.stringify({ rowIndex, colIndex, letter })
            );
          }
          break;
        }
        iterations++;
      }
    }

    return this.grid;
  }

  validateWords() {
    const validWord = /^[A-Z]+$/i;
    this.words = this.words.map((word) => word.toLocaleUpperCase());

    this.words = this.words.filter((word) => {
      return validWord.test(word);
    });
  }

  get showWords() {
    return this.words;
  }
  get showUnusedWords() {
    return this.unusedWords;
  }

  get showGrid() {
    return this.grid;
  }

  get showHighlightedWords() {
    return this.highlightedItems;
  }
}

