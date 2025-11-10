use std:io;

fn main() {
  let number_1 = 6;
  let number_2 = 2;

  inputNumbers(number_1, number_2);

}

fn inputNumbers(n1: u32, n2: u32) -> u32 {
  n1 & n2
}