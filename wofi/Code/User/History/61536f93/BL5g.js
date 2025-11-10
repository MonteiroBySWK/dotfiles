var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

let values = lines[0].split(" ");

let [n1, n2 ,n3] = lines;

function maior(a, b) {
  return (a+b+Math.abs(a - b))/2
}

let out1 = maior(n1, n2);
let result = maior(out1, n3);

console.log(result);