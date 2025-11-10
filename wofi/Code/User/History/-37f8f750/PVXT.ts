export interface UserProps {
  name: string;
  email: string;
  password: string; // hash !!!!! (Não esquecer)
  createdAt: number;
}

export default class User {
  constructor(private id: number, private props: UserProps) {
    try {
      if (this.validate()) {
        this.props = { ...props, createdAt: Date.now() };
      }
    } catch (e) {
      console.error(e);
    }

    this.props = { ...props, createdAt: Date.now() };
  }

  public validate(): boolean {
    if (!this.props.email.trim()) {
      throw new Error("Email nulo");
    }

    if (!this.props.name.trim()) {
      throw new Error("Name nulo");
    }

    return true;
  }

  public setEmail(newEmail: string) {
    this.props.email = newEmail;
  }

  public setPassword(newPassword: string) {
    this.props.password = newPassword;
  }
}
