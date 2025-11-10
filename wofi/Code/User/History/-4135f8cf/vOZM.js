var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let values  = lines.map(e => parseInt(e))

let [menor, maior] = (values[0] > values[1]) ? [values[1], values[0]] : [values[0], values[1]];

for (let i = menor; i <= maior; i++) {

}