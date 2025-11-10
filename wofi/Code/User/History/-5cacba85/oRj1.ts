export interface DataProps {
  
}



export interface IToKeys<T> {
  toKeys(): (keyof T)[];
}