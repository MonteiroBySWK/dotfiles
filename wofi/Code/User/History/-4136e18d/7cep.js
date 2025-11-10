var input = require('fs').readFileSync('./dev/stdin', 'utf8');
var lines = input.split('\n');

let arr = lines[0].split(" ");

let arrNumber = arr.map(e => parseInt(e));

console.log(arrNumber)