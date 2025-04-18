import {
  LoginDTO,
  LoginResponseDto,
  RegisterDTO,
  RegisterResponseDto,
} from './dto';
import {
  ConflictException,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { JwtPayload } from './jwt-payload.interface';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  private readonly saltRounds: number;

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {
    this.saltRounds = parseInt(config.get<string>('SALT_ROUNDS', '10'), 10);
  }

  async register(registerDTO: RegisterDTO): Promise<RegisterResponseDto> {
    const { username, email, password } = registerDTO;
    const hashedPassword = await bcrypt.hash(password, this.saltRounds);

    try {
      const user = await this.prisma.user.create({
        data: {
          username,
          email,
          password: hashedPassword,
        },
      });

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;
      return {
        message: 'User created successfully',
        data: rest,
      };
    } catch (error) {
      if (
        error instanceof PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException(
          'User with this email or username already exists',
        );
      }
      throw error;
    }
  }

  async login(loginDto: LoginDTO): Promise<LoginResponseDto> {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new ForbiddenException('Credentials incorrect');
    }

    return {
      access_token: await this.generateAccessToken(user.id, user.role),
    };
  }

  private async generateAccessToken(userId: string, role: string) {
    const payload: JwtPayload = { id: userId, role: role };
    const access_token = await this.jwtService.signAsync(payload);
    return access_token;
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    let user: User;

    try {
      user = (await this.prisma.user.findUnique({
        where: { id: payload.id },
      })) as User;
    } catch {
      throw new UnauthorizedException(
        `There isn't any user with id: ${payload.id}`,
      );
    }

    return user;
  }
}
