import {User } from "../../../domain/entities/User";

export default class RegisterUser {
  
  public createUser(name: string, email: string) {
    return new User(name, email);
  }
}
