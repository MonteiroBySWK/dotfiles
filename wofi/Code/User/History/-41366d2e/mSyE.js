var input = require('fs').readFileSync('./dev/stdin', 'utf8');
var lines = input.split('\n');

let values = lines.map(e => parseInt(e));

let qtdPares = 0;
let qtdImpares = 0;
let qtdPositivos = 0;
let qtdNegativos = 0;

values.forEach(item => {
  if (item % 2 === 0) {
    qtdPares++;
  }

  if (item % 2 !==) {
    qtdImpares++;
  }

  if(item > 0) {
    qtdPositivos++;
  }

  if (item < 0) {
    qtdNegativos++;
  }

})


console.log(`${qtdPares} valor(es) par(es)`)
console.log(`${qtdImpares} `)
console.log(`${qtdPositivos} `)
console.log(`${qtdNegativos} `)
