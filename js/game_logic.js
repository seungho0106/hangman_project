// Global namespace
const game = function() {
  // HTML Elements
  const score = document.querySelector('#scoreValue');
  const wordText = document.querySelector(".word-text");
  const wordDefinition = document.querySelector(".word-definition");
  const alphabets = document.querySelector(".alphabets");
  const hint = document.querySelector(".hint");

  let wordBank = [];
  let guessWord = "";
  let alphabetArray = [];

  function setGuessWord(word) {
    game.guessWord = word;
  }

  return {
    score: score,
    wordText: wordText,
    wordDefinition: wordDefinition,
    alphabets: alphabets,
    wordBank: wordBank,
    guessWord: guessWord,
    alphabetArray: alphabetArray,
    setGuessWord: setGuessWord,
    hint: hint,
  }
}();

function GuessWord(word, definition) {
  this.word = word;
  this.definition = definition;
  this.text = generateUnderlines(word.length);
  this.displayDefinition = function() {
    changeScore(-1);
    game.wordDefinition.innerHTML = this.definition;
    game.hint.disabled = true;
  };
  this.displayText = function() {
    for (let i = 0; i < this.text.length; i++) {
      game.wordText.appendChild(this.text[i]);
    }
  };
}

function generateUnderlines(length) {
  let underlines = [];
  for (let i = 0; i < length; i++) {
    let underline = document.createElement('span');
    underline.innerHTML = '_';
    underline.class = 'character';
    underlines.push(underline);
    game.wordText.appendChild(underline);
  }
  return underlines;
}

function generateAlphabets() { // grey out alphabets
  for (let i = 0; i < 26; i++) {
    let alphabet = document.createElement("input");
    alphabet.class = "alphabet-before";
    alphabet.type = "button";
    alphabet.value = String.fromCharCode(97 + i);
    alphabet.addEventListener("click", () => alphabetClickHandler(alphabet), { once: true });
    game.alphabets.appendChild(alphabet);
    game.alphabetArray.push(alphabet);
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
    setupHangman();
  }
  else {
    for (let i = 0; i < matches.length; i++) {
      game.guessWord.text[matches[i]].innerHTML = alphabet.value;
    }
    changeScore(matches.length);
  }
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

function changeScore(num){ //num==1 when right, -1 when wrong guess
  let score = parseInt(game.score.innerText);
  score += num;
  game.score.innerHTML = score;
}

function generateResetButton() {
}

function main() {
  generateAlphabets();
  game.setGuessWord(new GuessWord("committee", "a body of persons delegated to consider, investigate, take action on, or report on some matter "));
  console.log(`game.guessWord = ${game.guessWord}`);
  console.log(`game.guessWord.word = ${game.guessWord.word}`);
  game.hint.addEventListener("click", () => game.guessWord.displayDefinition());
}

main();