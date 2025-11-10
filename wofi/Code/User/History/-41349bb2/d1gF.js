var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let value = parseInt(lines[0]);

for(let i = 0; i <= value; i++) {
  console.log(`${4*i + 1} ${i+1} ${i+2} PUM`);
}