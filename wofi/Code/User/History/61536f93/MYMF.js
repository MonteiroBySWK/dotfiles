var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

let values = lines[0].split(" ");

const [a, b, c, d] = values;

if (b > c && d > a && c + d > a + b && c > 0 && d > 0 && a % 2 === 0) {
  console.log("Valores aceitos");
} else {
  console.log("Valores nao aceitos");
}
