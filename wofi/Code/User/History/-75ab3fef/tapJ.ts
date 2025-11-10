interface IUserProps {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  birthDate: Date;
  phone: string;
  rg: string;
  photo: URL;

  password: string;

  createdAt: Date;
  updatedAt: Date;
}

class User {
  private readonly props: IUserProps;

  constructor(props: IUserProps) {
    this.props = {
      ...props,
      createdAt: props.createdAt ?? new Date(),
      updatedAt: props.updatedAt ?? new Date(),
    };

    this.validate();
  }

  private validate() {
    if (!this.props.email.match(/@/)) {
      throw new Error("Email invalid");
    }

    if (!this.props.email || !this.props.password) {
      throw new Error("Input null not permited");
    }
  }

  public setPassword() {}
}
