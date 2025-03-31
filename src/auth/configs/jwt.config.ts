import { JwtModuleOptions, JwtOptionsFactory } from "@nestjs/jwt";
import { jwtConstants } from "../auth.constants";
import { ConfigService } from "@nestjs/config";
import { Inject } from "@nestjs/common";

export class JwtConfigClass implements JwtOptionsFactory {
    constructor(@Inject() private readonly config: ConfigService) { }

    createJwtOptions(): Promise<JwtModuleOptions> | JwtModuleOptions {
        return {
            secret: this.config.get<string>(jwtConstants.ACCESS_TOKEN_SECRETE),
            signOptions: { expiresIn: this.config.get<string>(jwtConstants.ACCESS_TOKEN_EXPIRE) }
        }
    }

}