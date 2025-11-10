import { UserType } from "../user/UserType";
import { ServiceArea } from "./ServiceArea";

export interface UserProps {
  id?: string; // UUID
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

  // A partir daqui talvez já deva separar em duas classes enão tem UserType
  serviceArea: ServiceArea; // País, Estado, Cidades[], Bairros[];

  type: UserType;

  password: string;

  hourlyRate: number;

  createdAt: Date;
  updatedAt: Date;

  lastLogin: Date; // Importante para chats
};

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
  
  public get type(): UserType {
    return this.props.type;
  }

  public setStars(rate : number) {
    this.props.stars = rate;
  }
  
}
