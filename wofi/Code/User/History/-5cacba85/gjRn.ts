export interface DataProps<T extends Record<string, any>> {

}



export interface IDataType {
  toObject(): () => DataProps;
}