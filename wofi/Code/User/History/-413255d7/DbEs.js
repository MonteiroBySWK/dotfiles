var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let numCaseTest = parseInt(lines[0]);

const dictRept = {};

for (let i = 1; i <= numCaseTest; i++) {
  let target = parseInt(lines[i]);

  if (!dictRept[target]) {
    dictRept[target] = 0;
  }

  if (typeof dictRept[target] === "number") {
    dictRept[target] = dictRept[target] + 1;
  }
}

for (const val in dictRept) {
  console.log(val);
}
