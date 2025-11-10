interface UserProps {
  name: string;
  email: string;
  password: string; // hash !!!!! (Não esquecer)
  createdAt: number;
}

class User {
  constructor(private id: number, private props: UserProps) {
    if (!this.validate()) {
      throw new Error("Usuario Não Valido");
    }
        
    this.props = { ...props, createdAt: Date.now() };
  
  }

  public validate(): boolean {
    if (!this.props.email.trim()) {
      return false;
    }

    if (!this.props.name.trim()) {
      return false;
    }

    return true;
  }

  public setEmail() {

  }

  public setPassword() {

  }


}
