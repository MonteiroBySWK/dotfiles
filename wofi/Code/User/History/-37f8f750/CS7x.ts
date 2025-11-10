interface UserProps {
  name: string;
  email: string;
  password: string; // hash !!!!! (Não esquecer)
}

class User {
  constructor(private id: number, private props: UserProps) {
    
  }
}