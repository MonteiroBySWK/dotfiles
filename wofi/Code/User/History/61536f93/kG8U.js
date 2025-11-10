var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

let values = lines[0].split(" ");

let [n1, n2 ,n3] = lines;

function maior(a, b) {
  return (a+b+Math.abs(a - b))/2
}