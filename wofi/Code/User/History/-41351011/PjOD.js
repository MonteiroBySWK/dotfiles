var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values = lines.map((e) => parseInt(e));

let qtdAlcool = 0;
let qtdGasolina = 0;
let qtdDiesel = 0;

console.log("MUITO OBRIGADO");

for (let i = 0; values[i] !== 4; i++) {
  if (values[i] === 4) {
    break;
  }

  if (values[i] === 1) {
    qtdAlcool++;
  }

  if (values[i] === 2) {
    qtdGasolina++;
  }

  if (values[i] === 3) {
    qtdDiesel++;
  }
}

console.log(`Alcool: ${qtdAlcool}`);
console.log(`Gasolina: ${qtdGasolina}`);
console.log(`Diesel: ${qtdDiesel}`);
