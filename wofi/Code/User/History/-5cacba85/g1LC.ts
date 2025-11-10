export interface IToKeys<T> {
  toKeys(): (keyof T)[];
}