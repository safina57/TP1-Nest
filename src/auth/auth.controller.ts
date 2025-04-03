import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDTO, RegisterDTO } from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() LoginDTO: LoginDTO) {
    return this.authService.login(LoginDTO);
  }

  @Post('register')
  register(@Body() RegisterDTO: RegisterDTO) {
    return this.authService.register(RegisterDTO);
  }
}
