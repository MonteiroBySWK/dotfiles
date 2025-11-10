var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

const n = lines[0];

let qtdIn = 0;

lines.forEach((item) => {
  if (item === n) return;

  if (item >= 10 && item <= 20) {
    qtdIn++;
  }
});

console.log(lines.length)

console.log(qtdIn, "in");
console.log(lines.length - qtdIn - 1, "out");
