interface IUserService {
  createUser(): void;
}

export class UserController {
  constructor(private readonly userService: IUserService) {}
}
