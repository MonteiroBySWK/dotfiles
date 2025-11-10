interface IUserService {
  createUser(): void;
}

export class UserController {
  constructor(private readonly userService: IUserService) {}

  public post(): string {
    this.userService.createUser();
    return ""
  }
}
