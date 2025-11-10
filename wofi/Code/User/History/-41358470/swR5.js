var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let value = parseInt(lines[0]);

for(let i = 1; i <= 10; i++) {
  console.log(`${i} x ${value} = ${i*value}`)
}