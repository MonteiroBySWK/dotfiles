var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let value = parseInt(lines[0]);

let result = [];

function fib(n) {
  if (n === 0) {
    return 0;
  }

  if (n === 1) {
    return 1;
  }

  return fib(n - 1) + fib(n - 2);
}

for (let i = 0; i < value; i++) {
  result.push(fib(i));
}

let strResult = result.toString().replaceAll(",", " ");

console.log(strResult);
