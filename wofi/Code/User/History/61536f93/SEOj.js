var input = require("fs").readFileSync("stdin", "utf8");
var lines = input.split("\n");

lines.forEach((x, i) => {
  if (x <= 0) {
    x = 1;
  }
  console.log("X[" + i + "] = " + x);
});
