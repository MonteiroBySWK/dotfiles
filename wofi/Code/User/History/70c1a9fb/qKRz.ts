export abstract class BaseModel<T> {
  protected props: T;

  constructor(props: T) {
    this.props = props;
  }

  public static getKeys(): string[] {
    
  }

}