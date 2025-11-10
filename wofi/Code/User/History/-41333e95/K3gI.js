var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

console.log(lines)

function fatorial(n) {
  if (n === 1) {
    return 1;
  }

  return n * fatorial(n-1);
}

