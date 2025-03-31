import { Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';
import { AuthService } from './auth.service';
import { JwtAuthenticateGuard } from './guards/jwt.guard';

@Controller('auth')
export class AuthController {

  constructor(private authService: AuthService) { }

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Get('profile')
  @UseGuards(JwtAuthenticateGuard)
  profile(@Request() req) {
    return req.user
  }

}
