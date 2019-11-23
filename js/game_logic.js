let wordBank = [new GuessWord("committee", "a body of persons delegated to consider, investigate, take action on, or report on some matter")];
let alphabets = []

// function createWordBank() {}

function GuessWord(word, definition) {
  this.word = word;
  this.definition = definition;
  this.displayDefinition = function() {
    let wordDefinition = document.getElementById("word-definition");
    wordDefinition.innerHTML = this.definition;
  }
}

function generateAlphabets() { // grey out alphabets
  for (let i = 0; i < 26; i++) {
    let alphBtn = new Alphabet(String.fromCharCode(97 + i))
    alphabets.push(alphBtn)
  }
}

function Alphabet(char){
  this.btn = document.createElement('INPUT');
  this.btn.type = 'button';
  this.btn.value = char;
  document.body.appendChild(this.btn);
  this.clicked = function(){
    this.btn.disabled = true;
  }
}

function generateUnderlines(word) {
  for (let i = 0; i < word.length; i++) {
    let underline = document.createElement('P');
    underline.innerHTML = '_';
    underline.class = 'character';
    underline.dataset.character = word[i];
    document.body.appendChild(underline);
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
  score = document.getElementById('score').value;
  score+=num
  document.getElementById('score').innerHTML = score;
}

function generateResetButton() {

}

function main() {
  // generateAlphabets();
  console.log(`findMatch =  ${findMatch('t', "committee")}`);
  generateAlphabets();
  generateUnderlines('hello');
}
