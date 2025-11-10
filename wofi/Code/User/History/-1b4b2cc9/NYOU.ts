import { User } from "../../../domain/entities/user/User";
import { UserType } from "../../../domain/entities/user/UserType";

export class RatingUser {
  public serviceProviderRateCommon(user: User, rate: number): void {
    try {
      if (user.type === UserType.SERVICE_PROVIDER) {
        // TODO: tem que tirar a média com o novo valor
        let avg: number = rate;

        user.setStars(avg);
      }
    } catch (error) {
      console.error(Error);
    }
  }

  public commonRateService(): void {}
}
