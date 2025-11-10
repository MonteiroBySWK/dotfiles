import { UserType } from "./UserType";

export type UserProps = {
  id?: string;        // UUID
  firstName: string;
  lastName: string;
  
  email: string;
  birthDate: Date;
  phone: string;
  rg: string;
  photo: URL;

  about: string; // Tipo de Linkedin 
  skills: string[]; // A babá pode ter especialidade com crianças especiais, deficientes, pode saber libras etc.
  stars: number; // 0 - 5

  serviceArea: string[]; // País, Estado, Cidades[], Bairros[];

  type: UserType;

  password: string;

  createdAt: Date;
  updatedAt: Date;

  lastLogin: Date;
}

export class User {
  private props: UserProps;

  constructor(props: UserProps) {
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
