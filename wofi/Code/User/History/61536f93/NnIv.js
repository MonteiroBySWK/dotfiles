var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

const n = lines[0];

lines.forEach((item) => {
  if (item === n) return;

  if (item >= 10 && item <= 20) {
    qtdIn++;
  }
});

let qtdOut = lines.length

console.log(qtdIn, "in");
console.log(n - qtdIn, "out");
