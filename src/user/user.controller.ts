import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('current')
  getCurrentUser(@Req() req: any) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
    };
  }
}
