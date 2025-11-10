interface IUserService {
  createUser(): void;
}

export class UserController {
  constructor(private readonly userService: IUserService) {}

  public post(req, res): string {
    this.userService.createUser();
    return ""
  }
}
