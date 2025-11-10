var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");


for(let i = 0; i < 10; i++) {
  if (lines[i] <= 0) {
    lines[i] = 1;
  }
  console.log(`X[${i}] = ${lines[i]}`);
}
