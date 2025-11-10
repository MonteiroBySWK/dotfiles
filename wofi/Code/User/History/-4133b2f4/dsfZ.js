var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let value = parseInt(lines[0]);

function fib(n) {
  if (n === 1) {
    return 1;
  }


  return fib(n-1) + fib(n-2)
}


fib(5)
