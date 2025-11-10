var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

let values = lines[0].split(" ");

let [n1, n2, n3] = values;

n1 = parseInt(n1);
n2 = parseInt(n2);
n3 = parseInt(n3);

function maior(a, b) {
  return parseInt((a + b + Math.abs(a - b)) / 2);
}

let out = maior(n1, n2);
console.log(out);
let result = maior(out, n3);

console.log(result);
