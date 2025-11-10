var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let arr = lines[0].split(" ");

let arrNumber = arr.map((e) => parseInt(e));

for (let i = 0; i < arrNumber.length; i++) {
  for (let j = 0; j < arrNumber.length; j++) {
    if (arrNumber[i] < arrNumber[j]) {
      let tmp = arrNumber[i];
      arrNumber[i] = arrNumber[j];
      arrNumber[j] = tmp;
    }
  }
}

arrNumber.forEach(element => {
  console.log(element);
});

console.log()

arr.forEach(element => {
  console.log(element)
})