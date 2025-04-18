import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { GenericService } from 'src/common/services/generic.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';

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
  @UseGuards(JWTAuthGuard, AdminGuard)
  getAllUsers(@Query() query: PaginationQueryDto) {
    return this.genericService.getAll('user', {
      skip: query.skip,
      take: query.take,
    });
  }

  @Get('current')
  //@UseGuards(JWTAuthGuard)
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
