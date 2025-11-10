interface UserProps {
  name: string;
  email: string;
  password: string; // hash !!!!! (Não esquecer)
  createdAt: number;
}

class User {
  constructor(private id: number, private props: UserProps) {
    if (!this.validate()) {

    }
    
    
    this.props = { ...props, createdAt: Date.now() };
  
    
  
  }

  public validate(): boolean {

  }

  public setEmail() {

  }

  public setPassword() {

  }


}
