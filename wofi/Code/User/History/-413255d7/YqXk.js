var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let numCaseTest = parseInt(lines[0]);

const dictRept = {}

for(let i = 1; i <= numCaseTest; i++) {
  dictRept[parseInt(lines[i])];
}

console.log(dictRept)