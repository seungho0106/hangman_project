
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

function main() {
  generateAlphabets();
}

main();