
let wordBank = [new GuessWord("committeee", "a body of persons delegated to consider, investigate, take action on, or report on some matter ")];

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
    let input = document.createElement("input");
    input.class = "alphabet";
    input.type = "button";
    input.value = String.fromCharCode(97 + i);
    input.onclick = () => console.log(`Button ${input.value} was clicked!`); // change!!
    document.body.appendChild(input);
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

function generateResetButton() {

}

function main() {
  // generateAlphabets();
  console.log(`findMatch =  ${findMatch('t', "committee")}`);
}

main();