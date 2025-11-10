var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.trim().split("\n");

let numCaseTest = parseInt(lines[0]);

let dictLeds = {
  1: 2,
  2: 5,
  3: 5,
  4: 4,
  5: 5,
  6: 6,
  7: 3,
  8: 7,
  9: 6,
  0: 6,
};

let sum = 0;
for (let i = 1; i < lines.length; i++) {
  let target = lines[i];

  for (let j = 0; j < target.length; j++) {
    sum = sum + dictLeds[target[j]];
  }

  console.log(`${sum} leds`);
  sum = 0;
}
