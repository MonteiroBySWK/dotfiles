var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values = lines.map(u => u.split(" "))

//values = values.map(ex => parseInt(ex))

console.log(values)

function fatorial(n) {
  if (n === 1) {
    return 1;
  }

  return n * fatorial(n-1);
}

function somar(n1, n2) {
  return fatorial(n1) + fatorial(n2)
}

