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
  const overlay = document.getElementById("overlay");

  // Constants
  const db = initFirestore();
  const initialLife = 7;
  const numAlphabets = 26;
  const upperCaseA = 65;

  let wordBank = [];
  let guessWord = "";
  let alphabetArray = [];
  let life = initialLife;

  return {
    alphabets: alphabets,
    hangman: hangman,
    hint: hint,
    restartButton: restartButton,
    score: score,
    wordText: wordText,
    wordDefinition: wordDefinition,
    overlay: overlay,
    db: db,
    initialLife: initialLife,
    numAlphabets: numAlphabets,
    upperCaseA: upperCaseA,
    wordBank: wordBank,
    guessWord: guessWord,
    alphabetArray: alphabetArray,
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
  // this.print = function() {
  //   console.log(`${this.word}: ${this.definition}`);
  // }
}

function Alphabet(charCode) {
  this.btn = document.createElement("input");
  this.btn.type = "button";
  this.btn.className = "alphabet btn-lg m-2";
  this.btn.value = String.fromCharCode(charCode);
  this.btn.addEventListener("click", () => alphabetClickHandler(this));
  game.alphabets.appendChild(this.btn);
}

function generateAlphabets() {
  for (let i = 0; i < game.numAlphabets; i++) {
    let alphabet = new Alphabet(game.upperCaseA + i);
      game.alphabetArray.push(alphabet);
  }
}

async function alphabetClickHandler(alphabet) {
  // Grey out and become unclickable
  alphabet.btn.disabled = true;

  // Find matches in current word
  let matches = findMatch(alphabet.btn.value, game.guessWord.word);
  if (matches.length === 0) {
    changeScore(-1);
    changeLife(-1);
  }
  else {
    for (let i of matches) {
      game.guessWord.letters[i].innerHTML = alphabet.btn.value;
      game.guessWord.guessedLetters[i] = true;
    }
    changeScore(matches.length);

    // If user gussed the word, set another word
    if (isWordGuessed()) {
      await sleep(1000);
      resetAlphabets();
      resetHintButton();
      setGuessWord();
    }
  }
}

async function populateWordBank() {
  let words = await fetchWords();
  words.forEach(word => {
    let guessWord = new GuessWord(word.word, word.defn);
    game.wordBank.push(guessWord);
  });
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

function isWordGuessed() {
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
  changeHangman();

  if (game.life === 0) {
    gameOver();
  }
}

function changeHangman() {
  game.hangman.src = `./images/amir_hangman_${8 - game.life}.png`;
}

function changeScore(num) {
  let score = parseInt(game.score.innerHTML);
  score += num;
  game.score.innerHTML = score.toString();
}

function setGuessWord() {
  // Clear current guess word
  if (game.guessWord) {
    game.guessWord.clearText();
  }
  // Fill word bank if empty
  if (!game.wordBank.length) {
    populateWordBank().then(() => {
        game.guessWord = game.wordBank.pop();
        game.guessWord.displayText();
    });
  }
  else {
    game.guessWord = game.wordBank.pop();
    game.guessWord.displayText();
  }
}

function setupHintButton() {
  game.hint.addEventListener("click", () => {
    changeScore(-1);
    game.wordDefinition.innerHTML = `${game.guessWord.definition}`;
    game.hint.disabled = true;
  });
}

function setupRestartButton() {
  game.restartButton.addEventListener("click", () => reset());
}

function setupOverlay() {
  game.overlay.addEventListener("click", () => overlayOff());
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
    alphabet.btn.disabled = false;
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

async function gameOver() {
  // Ask user for name
  let name = prompt("Enter your name.");

  // Add score to leaderboard
  await addToLeaderboard(name, parseInt(game.score.innerHTML));
  fetchLeaderboard().then(res => {
    populateTable(res);
    overlayOn();
  });
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function initFirestore() {
  // Config
  let firebaseConfig = {
    apiKey: "AIzaSyCOl7zfOtE5H75WPViBv-jNxn9nZLhHNFo",
    authDomain: "fire1-2c085.firebaseapp.com",
    projectId: "fire1-2c085",
    storageBucket: "fire1-2c085.appspot.com",
    messagingSenderId: "228703666474",
    appId: "1:228703666474:web:3bacd2b08daf85a79cde53",
    measurementId: "G-8V89TB50QY"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

  // Initialize Firestore
  return firebase.firestore();
}

async function fetchWords() {
  let results = [];
  await game.db.collection('hangman').where('id', '>=', Math.random()).limit(10).get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => results.push(doc.data()));
    });
  return results;
}

async function fetchLeaderboard() {
  let results = [];
  await game.db.collection('leaderboard').orderBy("score", "desc").limit(10).get()
    .then(function (querySnapshot) {
      querySnapshot.forEach(doc => {
        console.log(`doc.data().score = ${doc.data().score}`);
        results.push(doc.data());
      });
    });
  return results;
}

async function addToLeaderboard(name, score){
  let leaderRef = game.db.collection('leaderboard');
  await leaderRef.add({ name: name, score: score });
}

function populateTable(leaderData) {
  for (const [i, o] of leaderData.entries()) {
    o.rank = i + 1;
  }
  let table = $("#results").DataTable({
    ordering: false,
    dom: 't',
    data: leaderData,
    autoWidth: true,
    pageLength: 25,
    columns: [
      { title: 'RANK', data: 'rank', width: '33%' },
      { title: 'USER', data: 'name', width: '33%' },
      { title: 'SCORE', data: 'score', width: '33%' }
    ]
  });
}

function overlayOn() {
  game.overlay.style.display = "block";
}

function overlayOff() {
  game.overlay.style.display = "none";
  reset();
}

function main() {
  populateWordBank().then(() => {
    generateAlphabets();
    setGuessWord();
    setupHintButton();
    setupRestartButton();
    setupOverlay();
  });
}

main();

function getProperties(obj) {
  let result = [];
  for (let p in obj) {
    result.push([p, typeof(obj[p])]);
  }
  return result;
}