var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values = lines.map((u) => u.split(" "));

function fatorial(n) {
  if (n === 1) {
    return 1;
  }

  return n * fatorial(n - 1);
}

function somar(n1, n2) {
  return fatorial(n1) + fatorial(n2);
}

values.forEach((arr) => {
  n1 = parseInt(arr[0]);
  n2 = parseInt(arr[1]);

  console.log(somar(n1, n2));
});
