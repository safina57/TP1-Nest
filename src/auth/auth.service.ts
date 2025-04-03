import { LoginDTO, RegisterDTO } from './dto';
import { ForbiddenException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { generateToken } from './utils/jwt/jwt-funcionalities';

@Injectable()
export class AuthService {
    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService,
        private readonly config: ConfigService, 
    ) {}

    async register(RegisterDTO: RegisterDTO) {

        try{
          const { username, email, password } = RegisterDTO;
          const salt = await bcrypt.genSalt();
          const hashedPassword = await bcrypt.hash(password, salt);
          
          const user = await this.prisma.user.create({
              data : {
                  username,
                  email,
                  password: hashedPassword,
              }
          });

          return user;

        }
        catch (error) {
          throw new ForbiddenException('User already exists');
        }

    }

    async login(loginDto: LoginDTO) : Promise<{ access_token: string }> {
        const { email, password } = loginDto;
        const user = await this.prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new ForbiddenException('Credentials incorrect');
        }

        const passwordMatches = await bcrypt.compare(password, user.password);
        if (!passwordMatches) {
            throw new ForbiddenException('Credentials incorrect');
        }

        return await generateToken(user.id, this.jwt);
    }

}