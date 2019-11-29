"use strict";
// Global namespace
const game = function() {
  // HTML Elements
  const alphabets = document.querySelector(".alphabets");
  const hint = document.querySelector(".hint");
  const restartButton = document.querySelector(".restart-button");
  const score = document.querySelector(".score");
  const wordText = document.querySelector(".word-text");
  const wordDefinition = document.querySelector(".word-definition");

  let wordBank = [];
  let guessWord = "";
  let alphabetArray = [];

  return {
    alphabets: alphabets,
    hint: hint,
    restartButton: restartButton,
    score: score,
    wordText: wordText,
    wordDefinition: wordDefinition,
    wordBank: wordBank,
    guessWord: guessWord,
    alphabetArray: alphabetArray,
  };
}();

function setGuessWord() {
  // Clear current guess word
  if (game.guessWord) {
    game.guessWord.clearText();
  }
  // Fill word bank if empty
  if (!game.wordBank.length) {
    console.log("hello1");
    populateWordBank();
  }

  game.guessWord = game.wordBank.pop();
  game.guessWord.displayText();
}

function populateWordBank() {
  game.wordBank = [new GuessWord("committee",
    "a body of persons delegated to consider, investigate, take action on, or report on some matter "),
    new GuessWord("braggadocio", "empty boasting")];
}

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
  this.clearText = function() {
    for (let letter of this.letters) {
      letter.remove();
    }
    game.wordDefinition.innerHTML = "";
  }
}

function createLetters(length) {
  let letters = [];

  for (let i = 0; i < length; i++) {
    let letter = document.createElement("span");
    letter.className = "word-letter";
    letter.innerHTML = "_";
    letters.push(letter);
  }

  return letters;
}

function generateAlphabets() { // grey out alphabets
  for (let i = 0; i < 26; i++) {
    let alphabet = document.createElement("input");
    alphabet.type = "button";
    alphabet.className = "alphabet";
    alphabet.value = String.fromCharCode(97 + i);
    alphabet.addEventListener("click", () => alphabetClickHandler(alphabet));
    game.alphabetArray.push(alphabet);
    game.alphabets.appendChild(alphabet);
  }
}

function alphabetClickHandler(alphabet) {
  // Grey out and become unclickable
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
      resetAlphabets();
      resetHintButton();
      setGuessWord();
      setupHintButton;
    }
  }
}

function resetAlphabets() {
  for (let alphabet of game.alphabetArray) {
    alphabet.disabled = false;
  }
}

function isFinished() {
  return game.guessWord.guessedLetters.every((value) => { return value; } )
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

function resetScore() {
  game.score.innerHTML = "0";
}

function setupHintButton() {
  game.hint.addEventListener("click", () => {
    changeScore(-2);
    game.wordDefinition.innerHTML = game.guessWord.definition;
    game.hint.disabled = true;
    console.log(game.hint.disabled)
  });
}

function resetHintButton() {
  game.hint.disabled = false;
}

function setupRestartButton() {
  game.restartButton.addEventListener("click", () => reset());
}

function reset() {
  resetAlphabets();
  resetScore();
  resetHintButton();
  setupHintButton;
  setGuessWord();
}

function main() {
  generateAlphabets();
  populateWordBank();
  setGuessWord();
  setupHintButton();
  setupRestartButton();
}

main();
