
// let wordBank = ;

function generateAlphabets() {
  for (let i = 0; i < 26; i++) {
    let input = document.createElement("input");
    input.type = "button";
    input.value = String.fromCharCode(65 + i);
    input.onclick = () => console.log(`Button ${input.value} was clicked!`); // change!!
    document.body.appendChild(input);
  }
}

function generateUnderlines(word) {
  for (let i = 0; i < word.length; i++) {
    let underline = document.createElement('P');
    underline.innerHTML = '_'
    underline.class = 'character'
    underline.dataset.character = word[i]
    document.body.appendChild(underline);
  }
}

function onClickHandler(char) {
  return function () {
    greyOutChar(char)
    
  }
}

function incrementScore(){
  score = document.getElementById('score').value;
  score+=1
  document.getElementById('score').innerHTML = score;
}

function main() {
  generateAlphabets();
  generateUnderlines('hello');
}




main();