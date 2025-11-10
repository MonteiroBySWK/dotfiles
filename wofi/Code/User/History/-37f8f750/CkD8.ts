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

  public validate() {
    if (!this.props.email.trim()) {
      throw new Error("Email nulo");
    }

    if (!this.props.name.trim()) {
      throw new Error("Name nulo");
    }

    return true;
  }

  public setEmail() {

  }

  public setPassword() {

  }


}
