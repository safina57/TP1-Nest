import { JwtService } from "@nestjs/jwt";
import { Injectable, NestMiddleware, UnauthorizedException } from "@nestjs/common";
import { NextFunction, Request, Response } from 'express';
import { PrismaService } from "src/prisma/prisma.service";
import { ConfigService } from "@nestjs/config";
import { validateToken } from "./utils/jwt/jwt-funcionalities";

@Injectable()
export class AuthMiddleware implements NestMiddleware {

    constructor(
        private readonly prisma: PrismaService,
        private readonly jwt: JwtService, 
        private readonly config: ConfigService,
    ) {}
    async use(req: Request, res: Response, next: NextFunction) {
    
        const token = req.headers['auth-user'] as string;
        if (!token) {
        throw new UnauthorizedException('Invalid token');
        }
        
        const payload = await validateToken(token, this.jwt);
    
        const user = await this.prisma.user.findUnique({
            where: { id: payload.sub },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid token');
        }
        req['user'] = user;
        next();
  }
}