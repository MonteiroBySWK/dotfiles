var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let numCaseTest = parseInt(lines[0]);

const dictRept = {}

for(let i = 1; i <= numCaseTest; i++) {
  if (!dictRept[parseInt(lines[i])]) {
    dictRept[parseInt(lines[i])] = 0
  };
}

console.log(dictRept)