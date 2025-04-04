import { JwtService } from '@nestjs/jwt';
import {
  Injectable,
  Logger,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from './jwt-payload.interface';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private readonly logger = new Logger(AuthMiddleware.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers['auth-user'] as string;
    if (!token) {
      this.logger.warn('Authorization token missing');
      throw new UnauthorizedException('Authorization token missing');
    }

    try {
      const payload: JwtPayload = await this.jwtService.verifyAsync(token);
      const user = await this.prisma.user.findUnique({
        where: { id: payload.id },
      });

      if (!user) {
        this.logger.warn(`User not found for token payload id: ${payload.id}`);
        throw new UnauthorizedException('Invalid token: user not found');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password: _, ...rest } = user;
      req['user'] = rest;
      next();
    } catch (error) {
      this.logger.error('Token verification failed', error);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
