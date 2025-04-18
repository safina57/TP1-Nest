import { Controller, Get, Req, Query, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { GenericService } from 'src/common/services/generic.service';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { JWTAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { AdminGuard } from 'src/auth/guards/admin.guard';
import { Request } from 'express';
import { User } from '@prisma/client';

interface AuthenticatedRequest extends Request {
  user: User;
}

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
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
  getCurrentUser(@Req() req: AuthenticatedRequest) {
    const user = req.user;
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      password: user.password,
    };
  }
}
