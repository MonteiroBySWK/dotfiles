var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let value = parseInt(lines[0]);
console.log(value)