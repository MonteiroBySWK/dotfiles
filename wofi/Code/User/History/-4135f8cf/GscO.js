var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values  = lines.map(e => parseInt(e))

let [menor, maior] = (values[0] > values[1]) ? [values[1], values[0]] : [values[0], values[1]];

let sum = 0;

for (let i = menor; i <= maior; i++) {
  console.log(i)
  if (i % 2 !== 0) {
    console.log(i)
    sum = sum + i;
  }
}

console.log(sum)