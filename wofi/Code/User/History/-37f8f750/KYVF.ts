interface UserProps {
  name: string;
  email: string;
  password: string; // hash !!!!! (Não esquecer)
  createdAt: number;
}

class User {
  constructor(private id: number, private props: UserProps) {
    this.props = { ...props, createdAt: Date.now() };
  }
}
