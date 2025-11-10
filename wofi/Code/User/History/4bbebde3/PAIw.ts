interface IUserService {
  public name(): void;
}

export class UserController {
  constructor(
    private readonly IUserService userService
  ) {
    this.UserService = userService
  }
  


}
