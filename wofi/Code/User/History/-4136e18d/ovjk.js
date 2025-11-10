var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let arr = lines[0].split(" ");

let arrNumber = arr.map((e) => parseInt(e));

let swap = false;

for (let i = 0; i < arrNumber.length; i++) {
  for (let j = 0; j < arrNumber.length; j++) {
    if (arrNumber[i] < arrNumber[j]) {
      let tmp = arrNumber[i];
      arrNumber[i] = arrNumber[j];
      arrNumber[j] = tmp;
      swap = true;
    }
    if (!swap) {
    break;
  }
  }
  
}

arrNumber.forEach((element) => {
  console.log(element.toString());
});

console.log();

arr.forEach((element) => {
  console.log(element);
});
