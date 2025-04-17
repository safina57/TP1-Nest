import { Controller, Get, Req, Query } from '@nestjs/common';
import { UserService } from './user.service';
import { GenericService } from 'src/common/services/generic.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

interface User {
  id: string;
  email: string;
  username: string;
  password: string;
}

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly genericService: GenericService,
  ) {}

  @Get('all')
  getAllUsers(@Query() query: PaginationQueryDto) {
    return this.genericService.getAll('user', {
      skip: query.skip,
      take: query.take,
    });
  }

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
