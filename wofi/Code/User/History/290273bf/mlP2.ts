interface IUserService {
  createUser(): void;
}

export class UserController {
  constructor(private readonly userService: IUserService) {}

  public post(req: Express.Request, res: Express.Response): string {
    this.userService.createUser();
    return ""
  }
}
