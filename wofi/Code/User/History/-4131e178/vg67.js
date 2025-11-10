var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let target = parseInt(lines[0]);

let result = [];
for (let i = 1; i <= 10; i++) {
  result[i] = target;
  target = target * 2;
}

result.forEach((item, index) => console.log(`N[${index-1}] = ${item}`));
