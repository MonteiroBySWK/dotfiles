var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let numCaseTest = parseInt(lines[0]);

function fib(n) {
  if (n === 0) {
    return 0;
  }

  if (n === 1) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
}