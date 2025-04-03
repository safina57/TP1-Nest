import { JwtService } from "@nestjs/jwt";
import { JwtPayload } from "./jwt-payload.interface";
import { UnauthorizedException } from "@nestjs/common";


export async function generateToken(userId: string, jwt: JwtService) : Promise<{ access_token: string }> {
    const payload = { 
        sub: userId
     };
    return {
        access_token: await jwt.signAsync(
            payload,
            ),
    };
}

export async function validateToken(token: string, jwt: JwtService) : Promise<JwtPayload> {
    
    try {
        console.log(token);
        return await jwt.verifyAsync(token);
    }
    catch (error) {
        throw new UnauthorizedException('Invalid token');
    }
}

