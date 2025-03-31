
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { jwtConstants } from '../auth.constants';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {

    constructor(private readonly config: ConfigService) {
        const data = {
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: config.get(jwtConstants.ACCESS_TOKEN_SECRETE),
        }
        super(data);
    }

    async validate(payload: any) {
        return { userId: payload.sub, username: payload.username };
    }
}
