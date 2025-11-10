interface IUserService {
  public name(): void;
}

export class UserController {
  constructor(
    private readonly userService: IUserService
  ) {
    this.userService = userService
  }
  


}
