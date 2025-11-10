import { User } from "../../../domain/entities/user/User";
import { UserType } from "../../../domain/entities/user/UserType";

export class RatingUser {
  public rating(user: User, type: UserType, rate: number): void {
    if (user.type === type) {
      user.setStars(rate);
    } 
  }
}
