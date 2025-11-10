var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let value = parseInt(lines[0]);

let pivot = 0;
for(let i = 0; i <= value; i++) {
  pivot = 4*i + 1
  console.log(`${pivot} ${pivot+1} ${pivot+2} PUM`);
}