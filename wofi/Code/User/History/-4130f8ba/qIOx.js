var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let arr = lines.map((e) => parseInt(e));

let numEntry = parseInt(arr[0]);



let arrPar = arr.filter((e) => e % 2 === 0);
let arrImpar = arr.filter((e) => e % 2 !== 0);

function quicksort(arr) {
    if (arr.length <= 1) {
        return arr
    }

    let pivot = arr[0]

    let left = []
    let right = []

    for (let i = 1; i < arr.length; i++) {
        arr[i] < pivot ? left.push(arr[i]) : right.push(arr[i])
    }

    return quicksort(left).concat(pivot, quicksort(right))
}


for (let i = 0; i < arrPar.length; i++) {
  for (let j = 0; j < arrPar.length; j++) {
    if (arrPar[i] < arrPar[j]) {
      let tmp = arrPar[i];
      arrPar[i] = arrPar[j];
      arrPar[j] = tmp;
    }
  }
}

for (let i = 0; i < arrImpar.length; i++) {
  for (let j = 0; j < arrImpar.length; j++) {
    if (arrImpar[i] > arrImpar[j]) {
      let tmp = arrImpar[i];
      arrImpar[i] = arrImpar[j];
      arrImpar[j] = tmp;
    }
  }
}

console.log(arrPar);
console.log(arrImpar)