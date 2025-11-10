import { User, UserProps } from "../../../domain/entities/User";

export default class RegisterUser {
  public createUserWithAllProps(props: UserProps): User {
    return new User(props);
  }

  public createUserWithEmailAndPassword(props: {email: string}): void {
    return new User()
  }

}
