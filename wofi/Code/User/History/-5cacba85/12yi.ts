export interface IToKeys<T> {
  getKeys(): (keyof T)[];
}