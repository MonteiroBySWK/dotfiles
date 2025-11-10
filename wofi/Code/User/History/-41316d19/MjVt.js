var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let numCaseTest = parseInt(lines[0]);

function fib2(n) {
  if(n === 0) {
    return 0;
  }
  if (n === 1 || n === 2) {
    return 1;
  }
  return fib(n - 1) + fib(n - 2);
}


function fib(n) {
  if (n === 0) return 0;
  if (n === 1 || n === 2) return 1;

  let arr = [0,1,1]
  let target = 0;
  for (let i = 3; i <= n; i++) {
    target = arr[i - 1] + arr[i-2];
    arr.push(target);
  }
  return target;
}

for (let i = 1; i <= numCaseTest; i++) {
  let arg = parseInt(lines[i]);

  let result = fib(arg);

  console.log(`Fib(${arg}) = ${result}`);
}

