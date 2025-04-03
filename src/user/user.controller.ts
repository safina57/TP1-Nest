import { Controller, Get, Req } from '@nestjs/common';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}
    
    @Get('me')
    async getMe(@Req() req) {
        return req.user;
    }
}
