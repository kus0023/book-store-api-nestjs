import { Controller, Post, Request, UseGuards } from '@nestjs/common';
import { LocalAuthGuard } from './guards/local.guard';

@Controller('auth')
export class AuthController {

  @Post('login')
  @UseGuards(LocalAuthGuard)
  login(@Request() req) {
    return req.user;
  }

}
