var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values = lines.map((u) => u.split(" "));

function fatorial(n) {
  if (n === 1 || n === 0) {
    return 1;
  }
  return n * fatorial(n - 1);
}



values.forEach((arr) => {
  n1 = parseInt(arr[0]);
  n2 = parseInt(arr[1]);
  try {
    fat1 = fatorial(n1);
    fat2 = fatorial(n2);
    console.log(fat1 + fat2);
  } catch (error) {}
});
