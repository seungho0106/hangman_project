// Global namespace
const game = function() {
  // HTML Elements
  const alphabets = document.getElementById("alphabets");
  const hangman = document.getElementById("hangman")
  const hint = document.getElementById("hint");
  const restartButton = document.getElementById("restart");
  const score = document.getElementById("score");
  const wordText = document.getElementById("word-text");
  const wordDefinition = document.getElementById("word-definition");

  // Environment variables
  const numAlphabets = 26;
  const upperCaseA = 65;

  let wordBank = [];
  let guessWord = "";
  let alphabetArray = [];
  let initialLife = 7;
  let life = initialLife;

  return {
    alphabets: alphabets,
    hangman: hangman,
    hint: hint,
    restartButton: restartButton,
    score: score,
    numAlphabets: numAlphabets,
    upperCaseA: upperCaseA,
    wordText: wordText,
    wordDefinition: wordDefinition,
    wordBank: wordBank,
    guessWord: guessWord,
    alphabetArray: alphabetArray,
    initialLife: initialLife,
    life: life,
  };
}();

function GuessWord(word, definition) {
  this.word = word.toUpperCase();
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

function Alphabet(charCode) {
  this.btn = document.createElement("input");
  this.btn.type = "button";
  this.btn.className = "alphabet";
  this.btn.value = String.fromCharCode(charCode);
  this.btn.addEventListener("click", () => alphabetClickHandler(this.btn));
  game.alphabets.appendChild(this.btn);
}

function generateAlphabets() { // grey out alphabets
  for (let i = 0; i < game.numAlphabets; i++) {
    let alphabet = new Alphabet(game.upperCaseA + i);
      game.alphabetArray.push(alphabet);
  }
}

async function alphabetClickHandler(alphabet) {
  // Grey out and become unclickable
  alphabet.disabled = true;

  // Find matches in current word
  let matches = findMatch(alphabet.value, game.guessWord.word);
  if (matches.length === 0) {
    changeLife(-1);
    changeScore(-1);
    changeHangman();
  }
  else {
    for (let i of matches) {
      game.guessWord.letters[i].innerHTML = alphabet.value;
      game.guessWord.guessedLetters[i] = true;
    }
    changeScore(matches.length);

    if (isFinished()) {
      await sleep(1000);
      resetAlphabets();
      resetHintButton();
      setGuessWord();
    }
  }
}

function populateWordBank() {
  game.wordBank = [new GuessWord("committee",
    "a body of persons delegated to consider, investigate, take action on, or report on some matter "),
    new GuessWord("braggadocio", "empty boasting")];
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

function changeLife(num) {
  game.life += num;
  if (game.life == 0) {
    gameOver();
  }
}

function changeScore(num) {
  let score = parseInt(game.score.innerHTML);
  score += num;
  game.score.innerHTML = score.toString();
}

function changeHangman() {
  game.hangman.src = `./images/amir_hangman_${8 - game.life}.png`;
}

function setGuessWord() {
  // Clear current guess word
  if (game.guessWord) {
    game.guessWord.clearText();
  }
  // Fill word bank if empty
  if (!game.wordBank.length) {
    populateWordBank();
  }

  game.guessWord = game.wordBank.pop();
  game.guessWord.displayText();
}

function setupHintButton() {
  game.hint.addEventListener("click", () => {
    changeScore(-2);
    game.wordDefinition.innerHTML = `${game.guessWord.definition}`;
    game.hint.disabled = true;
  });
}

function setupRestartButton() {
  game.restartButton.addEventListener("click", () => reset());
}

function reset() {
  resetAlphabets();
  resetScore();
  resetLife();
  resetHintButton();
  resetHangman();
  setGuessWord();
}

function resetAlphabets() {
  for (let alphabet of game.alphabetArray) {
    alphabet.disabled = false;
  }
}

function resetScore() {
  game.score.innerHTML = "0";
}

function resetLife() {
  game.life = game.initialLife;
}

function resetHintButton() {
  game.hint.disabled = false;
}

function resetHangman() {
  game.hangman.src = `./images/amir_hangman_1.png`;
}

function gameOver() {

}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}


function main() {
  generateAlphabets();
  populateWordBank();
  setGuessWord();
  setupHintButton();
  setupRestartButton();
  // fetch("https://o-99.com/david", {
  //   method: "GET",
  //   mode: "cors",
  //   headers: {
  //     "Content-Type": "application/json",
  //   }
  // }).then(data => console.log(`data = ${data}`));
}

main();
