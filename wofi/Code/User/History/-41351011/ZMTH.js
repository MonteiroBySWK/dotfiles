var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values = lines.map(e => parseInt(e));

let qtdAlcool = 0;
let qtdGasolina = 0;
let qtdDiesel = 0;

console.log("MUITO OBRIGADO");



console.log(`Alcool: ${qtdAlcool}`);
console.log(`Gasolina: ${qtdGasolina}`);
console.log(`Diesel: ${qtdDiesel}`)