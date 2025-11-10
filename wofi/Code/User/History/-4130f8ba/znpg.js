var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let arr = lines.map(e => parseInt(e));

let numEntry = parseInt(arr[0]);
