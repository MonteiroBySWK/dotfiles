var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let target = parseInt(lines[0]);

let result = [];
for (let i = 1; i <= 10; i++) {
  result[i] = i * target;
}

result.forEach((item, index) => console.log(`N[${index}] = ${item}`));
