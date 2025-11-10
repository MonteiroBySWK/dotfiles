use std::io;
use std::io::stdin;

fn main() {
  let mut input: String = String::new();
  stdin().read_line(&mut input).unwrap();

  let number_1 = input.split(1);
  let number_2 = input.split(2);

  let output: u32 = run(number_1, number_2);

  println!("{}", output);
}


fn and(n1: u32, n2: u32) -> u32 {
  n1 & n2
}

fn or(n1: u32, n2: u32) -> u32 {
  n1 | n2
}

fn run(n1: u32, n2: u32) -> u32 {
  let carry =  and(n1, n1);

  let and1 = and(!n1, n2);

  let and2 = and(n1, !n2);

  let output = or(and1, and2);

  output
}