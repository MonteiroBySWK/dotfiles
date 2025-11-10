import { User } from "../../../domain/entities/User";
import { UserType } from "../../../domain/entities/UserType";

export class RatingUser {
  public serviceProviderRateCommon(user: User, rate: number): void {
    try {
      if (user.type === UserType.SERVICE_PROVIDER) {
        
      }
    } catch (error) {
      console.error(Error);
    }
  }

  public commonRateService(): void {}
}
