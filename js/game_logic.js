// Global namespace
const game = function() {
  // HTML Elements
  const score = document.querySelector(".score");
  const wordText = document.querySelector(".word-text");
  const wordDefinition = document.querySelector(".word-definition");
  const alphabets = document.querySelector(".alphabets");

  let wordBank = [];
  let guessWord = "";
  let alphabetArray = [];

  return {
    score: score,
    wordText: wordText,
    wordDefinition: wordDefinition,
    alphabets: alphabets,
    wordBank: wordBank,
    guessWord: guessWord,
    alphabetArray: alphabetArray,
  }
}();

function GuessWord(word, definition) {
  this.word = word;
  this.definition = definition;
  this.letters = createLetters(word.length);
  this.guessedLetters = Array(word.length).fill(false);
  this.displayText = function() {
    for (let letter of this.letters) {
      game.wordText.appendChild(letter);
    }
  };
  this.displayDefinition = function() {
    game.wordDefinition.innerHTML = this.definition;
  };
  this.clear = function() {
    for (let letter of this.letters) {
      letter.remove();
    }
    game.wordDefinition = "";
  }
}

function createLetters(length) {
  let letters = [];

  for (let i = 0; i < length; i++) {
    let letter = document.createElement("span");
    letter.class = "word-letter";
    letter.innerHTML = "_";
    letters.push(letter);
  }

  return letters;
}

function generateAlphabets() { // grey out alphabets
  for (let i = 0; i < 26; i++) {
    let alphabet = document.createElement("input");
    alphabet.class = "alphabet-before";
    alphabet.type = "button";
    alphabet.value = String.fromCharCode(97 + i);
    alphabet.addEventListener("click", () => alphabetClickHandler(alphabet));
    game.alphabetArray.push(alphabet);
    game.alphabets.appendChild(alphabet);
  }
}

function resetAlphabets() {
  for (let alphabet of game.alphabetArray) {
    alphabet.disabled = false;
  }
}

function alphabetClickHandler(alphabet) {
  // Grey out and become unclickable
  alphabet.class = "alphabet-after";
  alphabet.disabled = true;

  // Find matches in current word
  let matches = findMatch(alphabet.value, game.guessWord.word);

  if (matches.length === 0) {
    changeScore(-1);
    // setupHangman();
  }
  else {
    for (let i of matches) {
      game.guessWord.letters[i].innerHTML = alphabet.value;
      game.guessWord.guessedLetters[i] = true;
    }
    changeScore(matches.length);

    if (isFinished()) {
      // Set new guess word
      setGuessWord();

      // Enable buttons again
      resetAlphabets();
    }
  }
}

function isFinished() {
  return game.guessWord.guessedLetters.every((value) => { return value; } )
}

function setGuessWord() {
  let nextWord = game.wordBank.pop();
  // Delete current guess word
  if (game.guessWord) {
    game.guessWord.clear();
  }
  if (!nextWord) {
    populateWordBank();
  }

  game.guessWord = nextWord;
  game.guessWord.displayText();
}

function populateWordBank() {
  game.wordBank = [new GuessWord("committee",
    "a body of persons delegated to consider, investigate, take action on, or report on some matter "),
    new GuessWord("braggadocio", "empty boasting")];
}

function findMatch(character, word) {
  let arrIndices = [];
  for (let i = 0; i < word.length; i++) {
    if (word[i] === character) {
      arrIndices.push(i);
    }
  }
  return arrIndices;
}

function changeScore(num) {
  let score = parseInt(game.score.innerHTML);
  score += num;
  game.score.innerHTML = score.toString();
}

function main() {
  generateAlphabets();
  populateWordBank();
  setGuessWord();
}

main();