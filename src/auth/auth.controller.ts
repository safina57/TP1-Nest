import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import {
  LoginDTO,
  LoginResponseDto,
  RegisterDTO,
  RegisterResponseDto,
} from './dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginDTO: LoginDTO): Promise<LoginResponseDto> {
    return this.authService.login(loginDTO);
  }

  @Post('register')
  register(@Body() registerDTO: RegisterDTO): Promise<RegisterResponseDto> {
    return this.authService.register(registerDTO);
  }
}
