var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values = lines.map(e => parseInt(e));

let qtdAlcool = 0;
let qtdGasolina = 0;
let qtdDiesel = 0;

console.log("MUITO OBRIGADO");

values.forEach(element  => {
  if(element === 4) {
    return;
  }
  
  if (element === 1) {
    qtdAlcool++;
  }


})

console.log(`Alcool: ${qtdAlcool}`);
console.log(`Gasolina: ${qtdGasolina}`);
console.log(`Diesel: ${qtdDiesel}`)