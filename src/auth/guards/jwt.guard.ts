import { AuthGuard } from "@nestjs/passport";

export class JwtAuthenticateGuard extends AuthGuard('jwt') { }