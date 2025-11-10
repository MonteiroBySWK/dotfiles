var input = require("fs").readFileSync("./dev/stdin", "utf8");
var lines = input.split("\n");

let arr = lines.map((e) => parseInt(e));
let numEntry = parseInt(arr[0]);

arr = arr.slice(1, numEntry+1);


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


arrPar = quicksort(arrPar);
arrImpar = quicksort(arrImpar);

console.log(arrPar);
console.log(arrImpar)