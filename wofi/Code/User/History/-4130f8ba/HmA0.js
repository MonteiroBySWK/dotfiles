var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let arr = lines.map(e => parseInt(e));

let numEntry = parseInt(arr[0]);

let arrPar = arr.filter(e => e % 2 === 0);

console.log(arrPar)
